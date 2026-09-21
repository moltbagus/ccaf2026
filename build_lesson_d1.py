#!/usr/bin/env python3
"""Rebuild lessons/d1.json in the clearer explanation format.

Why: the first draft was accurate but read as a wall of assertion. This version adds four
labelled blocks per concept — In short (plain sentence), Why it works this way (the
reasoning), The tempting alternative (what the naive option costs you), What the exam tests
(the tell) — and grounds every concept in the harvested concept pages under
/home/colb/ccaf-research/d1-concepts/ plus the class corpus.
Run: python3 /home/colb/build_lesson_d1.py
"""
import json
import os

OUT = "/home/colb/.openclaw/workspace/ccaf/class/lessons/d1.json"


def t(task, title, inshort, lead, points, why, contrast, exam, takeaway,
      diagram=None, caption=None, code=None, kind="teach"):
    return {
        "task": task, "kind": kind, "title": title, "inshort": inshort, "lead": lead,
        "points": points, "diagram": diagram, "caption": caption, "code": code,
        "ask": None, "why": why, "contrast": contrast, "exam": exam, "takeaway": takeaway,
    }


def gate(task, title, lead, q, options, answer, why, trap, takeaway, kind="check"):
    return {
        "task": task, "kind": kind, "title": title, "inshort": None, "lead": lead,
        "points": [], "diagram": None, "caption": None, "code": None,
        "ask": {"q": q, "options": options, "answer": answer, "why": why, "trap": trap},
        "why": None, "contrast": None, "exam": None, "takeaway": takeaway,
    }


steps = [
    # ---------------- 1.1 the loop ----------------
    t("1.1", "An agent is a while loop, not a program",
      "An agentic loop calls the model, runs whatever tools it asked for, appends the results, and calls the model again - repeating until the model stops asking for tools.",
      "Start with the piece that everything else in this domain hangs off. Your code sends a request, Claude replies, and if the reply asks for a tool you run it and send the result back. That cycle is the agent. Everything the exam asks about stopping, gating, delegating or recovering is a decision made somewhere on this cycle.",
      ["The Messages API is stateless: every call must resend the whole conversation, because the endpoint remembers nothing between requests.",
       "A response is a list of content blocks plus a `stop_reason` field - not a single string of text.",
       "A tool call arrives as a `tool_use` block; you answer it with a `tool_result` block inside a new user-role message.",
       "Each `tool_result` must carry the `tool_use_id` from the matching `tool_use` request, or the model cannot pair them up."],
      "The loop has no built-in sense of completion. The model cannot end your program for you - it can only say what it wants next, and the API gives you one structured field that says whether it wants a tool or is finished. Control lives in your code, driven by that field.",
      "People reach for natural language: check whether the reply text contains done, or set a fixed iteration cap and call it completion detection. Both look like they work in a demo, because a demo has one happy path. In production the model writes text and calls a tool in the same response, so any check on the text fires early.",
      "This is the foundation task, and most Domain 1 questions reduce to it. If you can state that `stop_reason` is the only authoritative loop-control signal, you can answer the stopping questions without knowing the scenario.",
      "The model asks, your code decides. `stop_reason` is the switch.",
      code="while True:\n    response = client.messages.create(model=M, messages=messages, tools=tools)\n    messages.append({\"role\": \"assistant\", \"content\": response.content})\n    if response.stop_reason != \"tool_use\":\n        break\n    results = [run_tool(b) for b in response.content if b.type == \"tool_use\"]\n    messages.append({\"role\": \"user\", \"content\": results})"),

    t("1.1", "One field decides whether the loop continues",
      "`stop_reason == \"tool_use\"` means keep looping. `stop_reason == \"end_turn\"` means stop. Nothing else decides.",
      "Two values do all the work, and the exam tests the pair constantly. Read the field, not the prose.",
      ["`tool_use` - the model wants a tool run. Execute it and loop again.",
       "`end_turn` - the model is finished. Exit the loop and return the answer.",
       "`max_tokens` and `stop_sequence` are also stopping states you must handle, because the task may not be done.",
       "`refusal` means the model declined, which is not the same as finishing successfully."],
      "Because it is a structured field produced by the API rather than text produced by the model, it cannot be reworded, reformatted, or buried in a long explanation. It is the one signal your code can branch on without guessing.",
      "Parsing the assistant text is the temptation - it avoids one API call and looks cheap. But a single response can carry both a text block and a `tool_use` block, so a text-based check exits while tools are still pending. That is the classic premature-termination bug.",
      "The exam's preferred answer is `stop_reason`-driven control, and it usually appears next to a distractor that sounds more efficient. The other stopping states are tested as a secondary detail.",
      "Branch on the field. If it is not `tool_use`, your loop is finished looping.",
      diagram="agentic-loop", caption="The cycle your code owns. The back edge exists only while stop_reason says tool_use."),

    gate("1.1", "Commit: why does the agent stop early?",
         "Same support agent, same production symptom: it presents a partial answer and stops before finishing the work. Pick the fix you would actually ship.",
         "A support agent loops over `client.messages.create` with tools. A teammate proposes exiting the loop whenever the assistant text contains the words done or resolved, to save an API call. Production shows the agent sometimes stops mid-task with a partial answer.",
         ["Keep the text check but make the keywords stricter and longer.",
          "Add a 10-iteration cap and treat hitting it as completion.",
          "Exit when `stop_reason` is anything other than `tool_use`, so the loop only continues while the model is genuinely requesting tools.",
          "Ask the model to end every response with a JSON field stating whether it is finished."],
         2,
         "Stricter keywords are the same broken mechanism with a longer list, because a single response can carry both a text block and a `tool_use` block. An iteration cap is a safety net, never the stopping mechanism. The right move is to branch on the structured field that already says whether the model wants a tool: continue only while `stop_reason` is `tool_use`, and exit otherwise. Self-reported completion is model prose again, just wearing a schema.",
         "sounds-pragmatic",
         "A text check fires on narration, not on completion."),

    t("1.1", "The three anti-patterns have one shared root cause",
      "Every bad loop controller fails the same way: it decides completion from something other than `stop_reason`.",
      "Learn them as a set. The exam writes distractors by dressing these three up as sensible engineering.",
      ["Natural-language termination - scanning the reply text for a completion word or phrase.",
       "An arbitrary iteration cap as the primary stop - the loop ends because it ran out of turns, not because the work is done.",
       "A content-type check - treating a text block as the finish line (`response.content[0].type == \"text\"`)."],
      "All three are guesses about the model's intent, made from a proxy rather than the signal the API provides. A proxy is fine until it is not, and the failure is silent: the agent returns a confident partial answer.",
      "Each anti-pattern is defensible in isolation. A cap protects against runaway cost; a content-type check avoids parsing blocks; a keyword search avoids one field read. The exam offers them exactly that way. What none of them can do is distinguish work in progress from work that is finished.",
      "When a question describes premature termination, the fix is a code change to branch on `stop_reason`. If an answer option proposes a prompt rewrite, a bigger cap, or a smarter keyword, it is wrong.",
      "A cap is a seatbelt. `stop_reason` is the brake.",
      code="# the bug, and the fix, in two lines\nif response.content[0].type == \"text\": break        # fires on narration\nif response.stop_reason != \"tool_use\": break         # the contract"),

    # ---------------- 1.2 orchestration ----------------
    t("1.2", "Split the work, but keep one control point",
      "Hub and spoke: one coordinator agent holds the goal and calls specialised subagents. Subagents report back to the coordinator and never talk to each other.",
      "The exam scenario here is a research system: a coordinator splits a topic, hands slices to subagents, and assembles the report. Almost every failure question for this task is about the coordinator, not the workers.",
      ["The coordinator is the hub. It decomposes the task, chooses subagents, passes context, aggregates results, and routes errors.",
       "Subagents are the spokes. Each gets one slice of the work and its own fresh context.",
       "There are zero spoke-to-spoke links. No subagent can message another subagent.",
       "Routing everything through the hub is what makes the system observable: one node to log, inspect and reason about."],
      "A mesh of agents that talk freely becomes untraceable. With a single hub, every decision and result passes through one place, so you can see what each worker was told, deduplicate effort, enforce ordering, and decide exactly what each subagent is allowed to know.",
      "Direct agent-to-agent messaging looks like a shortcut around the coordinator, and teams try it to save a hop. The cost is that no single node holds the full picture any more: duplicated work is hard to spot and a failure has no obvious owner.",
      "The rule the exam tests most is that spokes do not connect. If an option routes a subagent's output straight to another subagent, it is wrong even when it sounds faster.",
      "One hub, many spokes, zero spoke-to-spoke links.",
      diagram="hub-spoke", caption="The star topology. Every arrow returns to the coordinator."),

    gate("1.2", "Commit: why did the report miss two industries?",
         "Every subagent reports success and the final report is still incomplete. Diagnose before you fix.",
         "A coordinator produces a report on AI regulation across five industries. Each subagent returns a complete, correct analysis of the slice it was given. The finished report covers only three of the five industries.",
         ["The subagents were too slow in two of the industries.",
          "The synthesis step dropped two sections when merging.",
          "The coordinator needs a larger context window.",
          "The coordinator decomposed the topic too narrowly, so two industries were never assigned to anyone."],
         3,
         "Each worker returned a complete, correct analysis of the slice it was given, so the fault sits upstream of the workers: nothing was slow, nothing was dropped in the merge, and a bigger context window does not create missing slices. The coordinator's decomposition never produced those two industries as work items, which is narrow decomposition failure - and the pattern to remember is that when every worker succeeds and the whole is still incomplete, you look at the split.",
         "sounds-thorough",
         "All workers succeeded and the output is still incomplete: blame the decomposition."),

    t("1.2", "Let the query choose the workers",
      "A good coordinator reads the incoming question and invokes only the subagents that question needs - not a fixed pipeline that runs everyone every time.",
      "Dynamic selection is what separates a coordinator from a workflow. The shape of the work decides the shape of the team.",
      ["Simple fact-finding needs one subagent.",
       "Comparisons typically need two to four, one per thing being compared.",
       "Open-ended research scales to ten or more.",
       "Running every subagent on every request is a fixed pipeline wearing a coordinator's costume."],
      "You pay for every subagent you spawn, in latency and in tokens. Selecting per query means effort tracks the question, so a simple question stays fast and an expensive one still gets the depth it needs.",
      "Spawning the full set every time feels safer, because coverage is guaranteed. But it wastes work on easy questions and buries the answer in material nobody asked for - and the exam labels exactly that option as the trap.",
      "If an option has the coordinator always invoking a fixed set of subagents, it is the wrong answer. The right one describes selection based on the query.",
      "Match the team to the question, not the other way round."),

    # ---------------- 1.3 spawning and context ----------------
    t("1.3", "A subagent starts blank",
      "A subagent gets a fresh context window. It does not inherit the coordinator's conversation, its tool results, or any memory of a previous invocation.",
      "This is the single most commonly misunderstood idea in multi-agent design, and the exam tests it deliberately, because getting it wrong produces agents that fail in confusing ways.",
      ["The only channel from coordinator to subagent is the prompt used to spawn it.",
       "The subagent does not see the coordinator's history, earlier tool results, or its system prompt.",
       "The subagent does not remember its own previous run. A second invocation is as blank as the first.",
       "Anything the subagent must know has to be written into the spawning prompt."],
      "Isolation is a feature, not a side effect. Because a subagent's reading and reasoning stay inside its own window, it can explore dozens of files without bloating the coordinator's context. The coordinator gets a concise summary back, not every page the subagent read.",
      "The temptation is to assume the subagent can just see what the coordinator knows - a customer ID, an earlier finding, a constraint from three turns ago. The subagent works from a partial picture, produces something plausible, and nothing crashes. The bug surfaces much later.",
      "Questions about a subagent returning generic or subtly wrong work are usually isolation questions in disguise. The fix is to pass the missing context in the spawn prompt, not to enlarge a model or add instructions to remember.",
      "The spawn prompt is the only door into a subagent.",
      code="# the coordinator's prompt is the entire channel in\nTask(\"Analyse this document. Requirements: ... Constraints: ...\nReturn: a JSON object with findings and source page numbers.\")"),

    t("1.3", "Pass content and its provenance together",
      "Structured context passing means putting complete findings in the spawn prompt, with the content kept separate from where it came from.",
      "A subagent cannot look anything up that you did not give it. So what you put in the prompt is the whole world it can reason about.",
      ["Carry source URLs, document names and page numbers alongside the content itself.",
       "Separate fields for the claim, the excerpt, its source and its date keep provenance machine-readable.",
       "A single formatted string that welds content and metadata together breaks attribution downstream."],
      "The final report has to cite sources. If provenance is baked into prose, no later agent can reliably pull the claim apart from its origin, and the citation chain dies at the synthesis step.",
      "One tidy prose paragraph per finding is easier to write. It also destroys the mapping between a claim and its source the moment anyone needs to check or merge it.",
      "Attribution-loss questions are answered by structured fields for claim, excerpt, source and date. Anything that collapses them into a string is the wrong option.",
      "Ship the claim and its receipt together."),

    t("1.3", "Give goals, not procedures",
      "A goal-based prompt says what to achieve and how the result will be judged. A step-based prompt dictates the exact sequence to follow.",
      "This is the difference between a subagent that adapts and one that follows a script off a cliff.",
      ["State the objective and the quality criteria; leave the method to the subagent.",
       "Goal-based prompts let a subagent change approach when the evidence changes.",
       "Step-based prompts buy predictability at the cost of adaptability.",
       "Use step-based prompts when the procedure is genuinely fixed and already known to be correct."],
      "You do not know what the subagent will find. A procedure written before the investigation cannot account for it, so a step-based prompt wastes exactly the work that surprises are made of.",
      "Spelling out every step feels like good engineering - it looks deterministic and reviewable. It also means the subagent cannot adapt to what it discovers, which is the whole reason you delegated in the first place.",
      "When a question asks how to brief a research subagent, the answer describes goals plus quality criteria. Answers that list a fixed procedure for an open-ended task are the distractors.",
      "Brief the destination and the standard, not the route."),

    t("1.3", "Emit parallel tool calls, don't loop",
      "To run independent subtasks at once, put several Task calls in a single coordinator response. The workers then run concurrently.",
      "One response can request more than one tool. That is the only thing standing between you and the sum of every worker's runtime.",
      ["Independent subtasks belong in one response, so total time approaches the slowest worker rather than the sum of all of them.",
       "Spawning them one per turn serialises work that had no reason to be serial.",
       "Check for a real dependency before parallelising: if task B needs task A's output, they are not independent."],
      "Latency is spent waiting. If five workers each take a minute and none needs another's output, sequential spawning costs five minutes of wall clock for no benefit.",
      "Spawning sequentially feels more controlled and is easier to debug, so teams default to it. On independent work it is pure waste.",
      "A question about reducing end-to-end time on independent subtasks wants the parallel-spawn answer. The trap is a more elaborate sequential design that looks more careful.",
      "Independent work goes in one response."),

    gate("1.3", "Commit: the subagent returned generic advice",
         "The coordinator has the facts. The subagent produced something a search engine could have written. Why?",
         "A coordinator investigates a billing problem. It knows the account ID, the invoice number and the customer's stated complaint. It spawns a research subagent with the prompt: Investigate this billing issue and report findings. The subagent returns generic advice on billing disputes.",
         ["The spawn prompt omitted the facts that live in the coordinator's context, and a subagent inherits none of it.",
          "The subagent's model is too weak for the task.",
          "The subagent needs its own copy of the tool definitions.",
          "The coordinator should have asked the subagent to remember the account details."],
         0,
         "The account ID, invoice number and stated complaint all lived in the coordinator's history, and the only channel into a subagent is the spawn prompt, which contained none of them. A stronger model cannot invent facts it was never given, and tool definitions were never the missing piece. Telling the subagent to remember does not help either, because it starts blank every time - the second invocation is as empty as the first.",
         "sounds-simple",
         "Blank subagent plus a vague prompt equals generic output."),

    # ---------------- 1.4 enforcement ----------------
    t("1.4", "A prompt asks. Code enforces.",
      "Prompt-based enforcement puts a rule in the system prompt and trusts the model. Programmatic enforcement puts the rule in code that physically blocks the action.",
      "The moment a rule protects money, identity or compliance, instructions stop being good enough - not because the model is careless, but because a non-zero failure rate compounds.",
      ["Prompt rules are usually followed, never certainly. The failure rate is small and never zero.",
       "Code rules hold on every run: a hook or a gate cannot be talked out of the decision.",
       "The decision rule is one question - what happens when the rule fails?",
       "Financial, security or compliance consequences mean code. Cosmetic consequences such as tone or formatting can stay in the prompt."],
      "You are choosing between a probability and a guarantee. Probabilities are fine when the cost of being wrong is a slightly awkward sentence; they are not fine when it is a refund to the wrong account.",
      "Strengthening the prompt is the natural first move, and it does move the number. It just never reaches zero, and at volume a fraction of a percent is still an incident. Few-shot examples have the same property.",
      "High-stakes ordering questions want a programmatic prerequisite gate or hook. Any answer that is a better-worded instruction is wrong, however emphatic it sounds.",
      "Ask what a failure costs. Then choose the mechanism.",
      diagram="hook-gate", caption="The gate sits in front of the tool. A denied call never reaches it."),

    gate("1.4", "Commit: 1.5% of refunds skipped verification",
         "The instruction is unambiguous and the failure rate is small. That is exactly the shape of this exam's favourite question.",
         "A refund agent is instructed in its system prompt to verify customer identity before calling `process_refund`. Telemetry over three months shows 1.5% of refunds processed without a verification call. The volume is high and the amounts are significant.",
         ["Add the rule to the prompt a second time, in capitals, at the start.",
          "Add five few-shot examples of the correct call order.",
          "Add a programmatic prerequisite gate that blocks `process_refund` until a verified customer ID is recorded.",
          "Lower the temperature so the model follows instructions more consistently."],
         2,
         "The rule is already written and already clear, so restating it in capitals targets the wording rather than the mechanism. Few-shot examples and a lower temperature are the same probabilistic machinery that just failed 1.5% of the time, and at this volume 1.5% is a business problem, not a rounding error. A programmatic prerequisite gate blocks the refund tool until a verified customer ID is recorded, so the guarantee holds on every run regardless of conversation order, phrasing or adversarial pressure.",
         "sounds-smart",
         "High stakes means code, however good the prompt already is."),

    t("1.4", "A handoff is a deliverable, not a redirect",
      "When an agent escalates, it hands the human a finished package: who, what, why, how much, and what to do next.",
      "Assume the human cannot read the transcript. They have a queue and thirty seconds, so the handoff has to stand alone.",
      ["Customer ID, so the human can find the account without asking.",
       "A short conversation summary in the agent's words.",
       "The root cause the agent established, plus any amount in dispute.",
       "A recommended action - the human should be able to act, not re-investigate."],
      "A handoff that requires re-investigation has moved the work rather than finishing it, and the customer waits through a second discovery pass. Escalating is only cheap if the receiving human can act immediately.",
      "Dumping the full history feels thorough and is the most common mistake: it is technically complete and practically useless. Escalating with no context at all is the opposite failure and equally costly.",
      "Mid-process escalation questions want a structured handoff brief. Answers offering the raw transcript, or an immediate transfer with nothing attached, are the distractors.",
      "Hand over a conclusion with its evidence, not the paperwork."),

    # ---------------- 1.5 hooks ----------------
    t("1.5", "Pre runs before. Post runs after.",
      "`PreToolUse` fires before a tool executes and can allow, deny or rewrite the call. `PostToolUse` fires after it succeeded and can reshape the result.",
      "Two hook names, two different jobs, and the exam swaps them constantly. The name tells you which side of the tool call you are on.",
      ["`PreToolUse`: inspect the proposed call, then deny it, approve it, or rewrite its arguments.",
       "`PostToolUse`: fires after the tool succeeds but before the model reads the result.",
       "A `PreToolUse` deny is deterministic and holds even when permissions are skipped.",
       "`PostToolUse` cannot block anything, because the tool has already run. It can only reshape what comes back."],
      "Placement is forced by timing. You can only prevent something before it happens, and you can only clean up a result after you have one. Pick the hook by asking which of those you need.",
      "Reaching for `PostToolUse` to enforce a rule is a common slip, because the hook can see the call and rewrite it. It cannot un-run the tool. The money has already moved.",
      "If a question asks how to prevent an action, the answer is `PreToolUse`. If it asks how to make heterogeneous results consistent, the answer is `PostToolUse`.",
      "Pre prevents, post reshapes."),

    gate("1.5", "Commit: three servers, three date formats",
         "The model keeps reasoning about the wrong dates. The tools are behaving exactly as documented.",
         "Three MCP servers return dates differently: ISO 8601, a Unix epoch integer, and a human-readable string. The agent regularly misreads them when comparing deadlines, even though each tool is correct.",
         ["Fix the servers so they all return ISO 8601.",
          "Add a `PreToolUse` hook that rewrites each call to request ISO 8601.",
          "Add few-shot examples showing the three formats so the model learns to convert them.",
          "Add a `PostToolUse` hook that normalises every date into one canonical format before the model sees it."],
         3,
         "This is a normalisation problem, and normalisation happens on the way back. Two of those servers are outside your control, so editing them is not yours to do, and rewriting the outgoing call does not dictate what a server chooses to return. Few-shot examples push a mechanical formatting job onto the model when the fix belongs in code. A `PostToolUse` hook fires after the tool succeeds and before the model reads the result, which is exactly where heterogeneous output becomes one canonical shape.",
         "sounds-pragmatic",
         "Heterogeneous results get normalised on the way back, not on the way out."),

    t("1.5", "What hooks are not for",
      "Hooks are for guarantees, not for teaching. They cannot make the model understand something, and they do not replace good tool descriptions.",
      "Knowing the boundary keeps you from recommending a hook where a description or a schema belongs.",
      ["Use a hook when a rule must hold on every run - ordering, permission, compliance.",
       "Use tool descriptions and schemas when the problem is that the model picks the wrong tool.",
       "Use `PostToolUse` normalisation when the data arrives in inconsistent shapes.",
       "Never route on keywords in the system prompt to fix tool selection: that fights the descriptions rather than improving them."],
      "A hook is a wall, and walls are for things that must not happen. If the actual problem is that the model cannot tell two tools apart, a wall does not help - it just blocks a call the model should never have made.",
      "Adding a hook feels decisive and shows up in a diff, which is satisfying. On a selection problem it adds enforcement without fixing the misunderstanding underneath.",
      "When tool selection is wrong, the exam wants descriptions, names and schemas improved - or the generic tool split into typed ones. A hook is the distractor.",
      "Fix the understanding with descriptions. Fix the guarantee with hooks."),

    # ---------------- 1.6 decomposition ----------------
    t("1.6", "Fixed pipeline or adaptive path?",
      "Prompt chaining runs a known sequence of steps. Adaptive decomposition decides the next step from what the last one found.",
      "The choice is driven by one question: do you already know the steps before you start?",
      ["Prompt chaining fits work where the stages are known and stable - decompose, analyse each part, then integrate.",
       "Adaptive decomposition fits investigation, where each finding decides what to look at next.",
       "A fixed sequence applied to an unknown problem explores layers that do not matter and misses the one that does.",
       "Generate the next subtask from the evidence rather than from a plan written in advance."],
      "A plan is a guess about a system you have not seen yet. When the failing layer is unknown, a plan encodes your assumptions, and the evidence is what should be steering.",
      "Planning everything up front feels rigorous and produces a document that looks like engineering. On an open-ended bug it is a script that answers the wrong question efficiently.",
      "For an unknown failure path the exam wants adaptive, evidence-driven steps. Answers that plan all layers first, or brute-force all layers in parallel, are the traps.",
      "Known steps: chain them. Unknown steps: follow the evidence."),

    gate("1.6", "Drill: the intermittent 500s",
         "One question, then a second decision that most people get wrong. Think about what the first finding changes.",
         "A pipeline fails with intermittent 500s. The failing layer is unknown: it could be the gateway, the auth service, the database client, or the serialiser. You have logs but no reproduction case yet.",
         ["Plan an investigation of all four layers up front and execute it in order.",
          "Run all four layers in parallel to maximise the chance of catching the failure.",
          "Start with the layer the logs point at, then generate the next investigation step from what that turns up.",
          "Escalate to a larger model and re-run the whole pipeline."],
         2,
         "The first finding changes what is worth checking next, so the plan has to be built as evidence arrives. Brute-forcing every layer in parallel burns cost and still misses the real path, and a plan written before any evidence encodes your guesses. A larger model does not tell you which layer is failing.",
         "sounds-thorough",
         "Unknown path means the evidence picks the next step."),

    t("1.6", "Two passes, and the attention problem",
      "Split a large review into a pass per file and then a pass across the files, and keep any one context from carrying too much.",
      "Decomposition is also about where attention lands. Long inputs are read unevenly, and material buried in the middle is where reviewers get it wrong.",
      ["Per-file pass first, so each unit gets full attention.",
       "Cross-file pass second, to catch integration problems the per-file pass cannot see.",
       "Keep contexts small enough that the middle of the input is not neglected.",
       "Summarise or trim before appending, rather than accumulating everything and hoping."],
      "Attention is not uniform across a long context. Decomposing keeps each unit small enough to be read properly, and the second pass restores the cross-cutting view the first pass gave up.",
      "One giant pass over everything feels simpler and keeps all the context in one place, so it looks like it preserves relationships. What it actually does is dilute attention across too much material.",
      "Questions about review quality at scale want the two-pass structure. A single large-context pass is the distractor.",
      "Per-file for depth, cross-file for integration."),

    # ---------------- 1.7 sessions ----------------
    t("1.7", "Resume, fork, or start fresh",
      "Resume continues an existing session. Fork branches from a point to explore separately. A fresh session starts clean with a summary you supply.",
      "Three moves, three costs, and a clear rule for which one the situation calls for.",
      ["Resume: keep going in the same session, carrying its history and accumulated context.",
       "Fork: create a branch from an existing point so one line of exploration does not disturb another.",
       "Fresh: start clean and inject a structured summary of what matters.",
       "If the tool results you would resume with are stale, do not resume - start fresh with the findings."],
      "Session state is a cache of what the agent knew at a moment in time. Cached facts go off, and an agent acting on an old snapshot reasons confidently from a world that has moved.",
      "Resuming is one command and feels like the efficient choice - all that context for free. When the context includes hours-old tool results, you have bought reasoning anchored to yesterday's database.",
      "The exam pairs resume with stale results deliberately. The right answer is a new session plus a structured summary; the trap is the efficiency of resuming.",
      "Keep the findings. Discard the stale evidence.",
      code="claude --resume <session>        # continue the same history\nclaude --fork-session            # branch, leaving the original intact\n# fresh + summary: start clean, paste the structured findings"),

    gate("1.7", "Commit: two strategies, one expensive baseline",
         "Both options continue the work. Only one of them is safe to reason from.",
         "A pricing investigation ran yesterday and produced a baseline figure from a live database query. The number has since changed upstream. You want to continue the analysis today without re-running the whole investigation.",
         ["Resume yesterday's session so the earlier reasoning and tool results carry over.",
          "Start a new session and inject a structured summary of the findings, re-fetching the figures that may have changed.",
          "Fork yesterday's session and continue from the branch.",
          "Resume the session and ask the model to re-check its own earlier numbers."],
         1,
         "The stale part is the evidence, not the reasoning. A new session with a structured summary keeps the conclusions and drops the expired tool results, and re-fetching restores the facts. Resuming replays the old results as if current, and forking inherits exactly the same stale state - the branch point does not refresh anything.",
         "sounds-efficient",
         "Stale tool results poison a resumed session. Carry the summary instead."),

    t("1.7", "Why stale context is worse than a cold start",
      "An agent with no context asks a useful question. An agent with wrong context acts confidently on it.",
      "This is the reasoning behind the rule, and it is where these questions are decided.",
      ["Tool results are a snapshot: a database row, a file listing, an API response at a moment in time.",
       "Resuming replays that snapshot as though it were still true.",
       "A fresh session with a summary separates conclusions from evidence, so evidence can be refreshed.",
       "Fork is for divergent exploration from a shared point, not for refreshing state."],
      "Confidence scales with context. A cold agent knows it does not know, so it looks things up; a warm agent with expired facts has no signal that anything changed.",
      "Resuming feels respectful of work already done, and often it is - right up until the underlying state moves. The failure is invisible, which makes it expensive.",
      "Expect a question that offers a cheap continuation containing stale results. The answer is always the fresh session with a structured summary.",
      "Conclusions travel forward. Evidence gets re-fetched.",
      code="# carry the reasoning, not the stale readings\nsummary = \"Findings: ...\\nOpen question: ...\\nDo not trust: figures from 2026-09-18\""),

    {"task": "1.7", "kind": "recap", "title": "Domain 1 spine, from memory",
     "inshort": "Seven ideas, and every one of them is a version of the same habit: prefer the structured signal, keep one control point, and put guarantees in code.",
     "lead": "Read these back to yourself until they are one motion. If you can say them without the page, Domain 1 is yours - it is 27% of the paper.",
     "points": [
       "`stop_reason` decides the loop. `tool_use` continues, `end_turn` stops. Text heuristics, caps-as-completion and content-type checks all misfire.",
       "Hub and spoke: one coordinator, isolated subagents, zero spoke-to-spoke links. When workers succeed and the whole is incomplete, the decomposition is at fault.",
       "A subagent starts blank. The spawn prompt is its only channel in, so pass the facts and the provenance with them.",
       "Brief goals and quality criteria, not procedures - unless the procedure is genuinely fixed.",
       "High stakes means code: a prerequisite gate or hook. Prompts have a non-zero failure rate that compounds at volume.",
       "`PreToolUse` prevents, `PostToolUse` reshapes. Neither one teaches the model to choose better tools.",
       "Resume keeps history, fork branches it, fresh starts clean with a summary. Stale tool results mean start fresh."],
     "diagram": None, "caption": None, "code": None, "ask": None,
     "why": "Domain 1 is 27% of the exam - roughly 16 of the 60 questions - so these seven ideas carry more marks than any other domain's full set.",
     "contrast": "Most wrong answers in this domain add a moving part: another agent, another cap, another prompt clause. The pattern is to prefer the signal that already exists and the guarantee that cannot be argued with.",
     "exam": "Expect the scenario to describe a production symptom and ask which change you would ship. Sort the options by whether they add a probability or a guarantee.",
     "takeaway": "Structured signal over prose, one hub over a mesh, code over instruction."},
]

lesson = {
    "domain": 1,
    "title": "Agentic Architecture",
    "weight": "27%",
    "goal": "Given a production scenario, decide the architecture that actually fits: a stop_reason-driven loop, a hub-and-spoke coordinator, a prompt or a programmatic gate, and the right resume, fork or fresh-start call.",
    "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"],
    "steps": steps,
}

# ---- validate before writing ----
ALLOWED = {"teach", "check", "diagram", "drill", "recap"}
DIAS = {"agentic-loop", "hook-gate", "hub-spoke", "context-window", "escalation-tree",
        "batch-timeline", "schema-contract", "claude-md-hierarchy", "wrapper-alias", "error-propagation"}
TRAPS = {"sounds-enterprise", "sounds-efficient", "sounds-smart", "sounds-helpful",
         "sounds-thorough", "sounds-simple", "sounds-pragmatic"}
errs = []
kinds, tasks, traps, answers = {}, {}, {}, []
for i, s in enumerate(steps, 1):
    kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
    tasks[s["task"]] = tasks.get(s["task"], 0) + 1
    if s["kind"] not in ALLOWED:
        errs.append("step %d bad kind" % i)
    if s["diagram"] and s["diagram"] not in DIAS:
        errs.append("step %d bad diagram" % i)
    if s["kind"] == "diagram" and not s["diagram"]:
        errs.append("step %d diagram step without a key" % i)
    if s["ask"]:
        a = s["ask"]
        if len(a["options"]) != 4:
            errs.append("step %d options != 4" % i)
        if not isinstance(a["answer"], int) or not 0 <= a["answer"] <= 3:
            errs.append("step %d bad answer index" % i)
        if a["trap"] not in TRAPS:
            errs.append("step %d bad trap" % i)
        if not a.get("why"):
            errs.append("step %d gate without rationale" % i)
        traps[a["trap"]] = traps.get(a["trap"], 0) + 1
        answers.append(a["answer"])
    elif s["kind"] in ("check", "drill"):
        errs.append("step %d is a gate without an ask" % i)
    for f in ("inshort", "lead", "why", "contrast", "exam", "takeaway"):
        v = s.get(f)
        if v and len(v) > 700:
            errs.append("step %d %s is very long (%d)" % (i, f, len(v)))
    if any(len(p) > 300 for p in s["points"]):
        errs.append("step %d has an over-long point" % i)
    if s["kind"] != "recap" and len(s["points"]) > 5:
        errs.append("step %d has %d points (max 5)" % (i, len(s["points"])))

for tsk in ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"]:
    if tasks.get(tsk, 0) < 2:
        errs.append("task %s has only %d steps" % (tsk, tasks.get(tsk, 0)))
if steps[-1]["kind"] != "recap":
    errs.append("final step is not a recap")
if len(set(answers)) < 3:
    errs.append("answer indices are not varied: %s" % answers)

print("steps: %d   kinds: %s" % (len(steps), kinds))
print("per-task: %s" % dict(sorted(tasks.items())))
print("gates: %d   diagrams: %d   traps: %s" % (sum(1 for s in steps if s["ask"]),
      sum(1 for s in steps if s["diagram"]), sorted(traps)))
print("answer spread: %s" % answers)
if errs:
    print("\nERRORS:")
    for e in errs:
        print("  - " + e)
    raise SystemExit(1)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(lesson, fh, ensure_ascii=False, indent=1)
back = json.load(open(OUT, encoding="utf-8"))
print("\nwrote %s (%d bytes, %d steps, revalidated ok)"
      % (OUT, os.path.getsize(OUT), len(back["steps"])))
print("blocks used: inshort=%d why=%d contrast=%d exam=%d"
      % (sum(1 for s in steps if s["inshort"]), sum(1 for s in steps if s["why"]),
         sum(1 for s in steps if s["contrast"]), sum(1 for s in steps if s["exam"])))