# Domain 1 — Agentic Architecture (27%) — Master Note

Heaviest domain on the exam. 7 tasks (1.1–1.7). Scenario-based questions: a production
situation is described, then "which approach is most effective?". Wrong options are
engineered traps that sound smart, efficient, thorough, helpful, enterprise, simple, or
pragmatic while violating a documented principle.

Exam framing: 60 multiple-choice questions, 120 minutes, pass 720 on a 100–1000 scale,
no guessing penalty — answer every question. Domain weights: D1 27%, D2 18%, D3 20%,
D4 20%, D5 15%.

Global rules that decide most Domain 1 items (hamzafarooq-cheatsheets/domain1.md):
- Deterministic beats probabilistic when stakes are real. Money, identity, safety,
  compliance = hooks or programmatic gates. Tone, style, formatting = prompts.
- Trace a failure to its origin. Scope problems = upstream (decomposition, partitioning,
  context passing). Quality problems = subagent prompts or tools.
- Proportionate fixes only. A single agent beats multi-agent when a single agent
  suffices. Do not over-engineer.

## Task index

| Task | One-line principle | Exam tell |
|---|---|---|
| 1.1 | Terminate the loop on `stop_reason`, never on prose or an iteration cap | "How does the loop know it is finished?" |
| 1.2 | One coordinator decomposes, selects, routes, aggregates, recovers | "subagents talk directly", "topics missing", "duplicate work" |
| 1.3 | Subagent context is isolated — the prompt is the universe | "the subagent did not know X", "the orchestrator will not delegate" |
| 1.4 | Financial/safety ordering is programmatic, never prompt-only | "must always happen before" + refund / identity / approval |
| 1.5 | PreToolUse gates and captures prior state; PostToolUse normalizes results | "heterogeneous formats", "prior state for audit", "before compaction" |
| 1.6 | Match decomposition shape to the work; chain when fixed, adapt when unknown | "intermittent bug", "14-file PR", "every request follows the same flow" |
| 1.7 | Resume only while tool results stay valid; fork to branch from a shared baseline | "files changed since", "compare two approaches" |

## Task 1.1 — The Agentic Loop Lifecycle

- **Principle**: Send a request with tools, inspect `stop_reason`, and branch on it before
  reading `content`. `"tool_use"` → execute the tool, append `tool_result`, loop.
  `"end_turn"` → present the final text and stop. Claude decides which tool to call and
  when to stop; you do not pre-configure decision trees or fixed tool sequences.
- **Why the exam wants this**: It is the domain's foundational mechanism, and every
  "when does the agent stop?" item resolves to one answer. It also separates agentic
  systems from traditional workflow automation, where steps are predetermined.
- **Distractors**: Parsing natural language for "I'm done" (non-deterministic — model
  prose varies); an arbitrary iteration cap as the *primary* stop condition (cuts work off
  mid-task; a cap is a safety net, not termination); checking that the response contains
  text, or `content[0].type == "text"` (a `tool_use` response can begin with a text block).
- **Exact terms**: `stop_reason` with values `"tool_use"`, `"end_turn"`, `"stop_sequence"`,
  `"pause_turn"`, `"max_tokens"`, `"refusal"`, `"model_context_window_exceeded"`;
  `tool_result` blocks carrying `tool_use_id`, `content`, `is_error: true`; multiple
  `tool_use` blocks in one response for simultaneous calls; the `messages` array stays
  append-only. `pause_turn` (server-side tool loop hit its cap) and `max_tokens` are
  resumable, not terminal. `refusal` arrives as HTTP 200 — check `stop_reason` before
  reading `content`, or you silently process an empty response.
- **Scenario tie-in**: 1. Customer Support Agent; 8. Agentic AI Tools (scenario reported
  by candidates but its content is missing from the corpus — paullarionov-guide_en.md).

## Task 1.2 — Multi-Agent Orchestration

- **Principle**: Use hub-and-spoke. One coordinator decomposes the task, selects which
  subagents are needed, partitions scope, passes context, aggregates and validates
  results, handles errors, and iteratively refines. Subagents never talk to each other;
  all communication routes through the coordinator.
- **When a single agent stops being enough** (two named triggers, both worth stating in
  your own words): the **context ceiling** — one agent's window fills before the task
  finishes, so it loses the thread of its own work; and the **specialization gap** — one
  agent doing everything produces generic results, because it cannot be specialised for
  every part of the job. If neither is true, a single agent beats multi-agent.
- **Hierarchy is permitted, not required**: a subagent may itself spawn subagents when its
  own definition allows it (sub-coordinator). The control-point rule still holds — every
  hop still routes through a coordinator, so visibility and error handling stay uniform.
- **Parallel vs sequential spawning is a cost decision**: parallel means emitting several
  spawn calls in ONE coordinator response; sequential means one per turn. Parallel buys
  latency but enlarges the coordinator's payload and output, so a coordinator that spends
  its budget spawning has less left to aggregate and validate.
- **Why the exam wants this**: Most multi-agent failures in the corpus are *scope*
  failures at the coordinator, not execution failures at the subagents. The exam tests
  whether you blame the right component.
- **Distractors**: A subagent sending results directly to another subagent (removes
  central visibility and uniform error handling); concatenating raw subagent outputs
  instead of synthesising them (contradictions and overlap reach the user); a shared
  live-state mechanism so agents "avoid duplication during execution" (subagents run in
  isolated contexts and cannot watch each other mid-flight); post-hoc deduplication
  (cleans the output but still pays the token cost of duplicated work); broad-brush
  symptom fixes such as "give the synthesis agent gap detection" or "widen the search
  queries" when the decomposition itself was too narrow.
- **Exact terms**: hub-and-spoke coordinator; dynamic subagent selection; isolated
  subagent context; iterative refinement loop (evaluate → identify gaps → targeted round
  2); coverage annotations; single-control-point design.
- **Failure-tracing table** (hamzafarooq domain1): missing topics → decomposition too
  narrow. Duplicated work / redundant sources → scope partitioning sloppy. Shallow on
  every topic → subagent prompts or tool budgets. Missing source attribution →
  context-passing destroyed metadata.
- **Scenario tie-in**: 3. Multi-Agent Research System.

## Task 1.3 — Subagent Spawning and Context Passing

- **Principle**: Spawn subagents with the Task tool (the current Claude Code / Agent SDK
  canon name is `Agent`; older material and the exam guide say "Task" — they are the same
  mechanism). The coordinator's `allowedTools` must include `"Task"` or it physically
  cannot delegate. Context does not inherit: everything a subagent needs goes in its
  prompt.
- **Why the exam wants this**: "The subagent returned something generic" and "the
  orchestrator never delegates" are both single-cause items — missing explicit context,
  and a missing `"Task"` entry in `allowedTools`.
- **The diagnostic that settles most of these items**: when a subagent returns something
  generic, wrong, or off-scope, the cause is almost never the subagent's own prompt — it is
  the coordinator failing to inject what that subagent needed into its agent definition at
  spawn time. Fix the injection, not the subagent's wording. The same reflex resolves
  "the subagent did not know X": context does not inherit, so X had to be handed over
  explicitly and was not.
- **Structured context, not prose**: the fix for a generic subagent is not better wording but a
  structured handoff — pass findings as an object of *claims* (each with a claim id, the claim
  text, a source id and a confidence) plus a *sources* array keyed by source id. Pass the whole
  object; never extract the claims and drop the sources. Summarising results into a prose
  paragraph before synthesis is the classic failure — it destroys provenance, so no individual
  claim can be traced back. The synthesis prompt should require every claim to cite its source
  URL and preserve the retrieved-at date.
- **Conflicts are annotated, never silently resolved**: when two sources disagree, the subagent
  adds a conflict object carrying *both* claims with their source ids, marks the resolution state
  `unresolved`, and escalates to the coordinator, which makes the final call. Letting a subagent
  pick a winner — or merge the two into one statement — is a direct exam distractor.
- **Every subagent is a full agentic loop**: a subagent is just an agent spawned by the
  coordinator, so it runs its own `stop_reason` loop. In Claude Code / the Agent SDK the spawn is
  a Task tool call; the raw Anthropic SDK has no Task tool, so the same pattern is reproduced with
  an ordinary function plus tool schemas. The exam tests the pattern, not the API name.
- **Fail fast on a failed precondition**: the coordinator spawns the downstream subagent only once
  the upstream subagent's structured finding satisfied the precondition. If customer verification
  returns "no such customer", the refund subagent is never spawned — rather than running and
  hallucinating a result from missing context.
- **Distractors**: Assuming the subagent inherits the coordinator's conversation; passing
  a pointer or "the document" instead of the content; collapsing structured findings into
  prose (attribution lost); asking subagent A to hand results straight to subagent B;
  writing step-by-step procedural coordinator prompts instead of goals plus quality
  criteria; giving a subagent one broad general-purpose tool then adding a prompt
  instruction to use it narrowly.
- **Exact terms**: Task tool for spawning subagents; `AgentDefinition` (`description` is
  used for selection — write it like a function docstring, plus `prompt`, `tools`,
  optionally `model`); the Task tool must be in the coordinator's `allowedTools`;
  `parent_tool_use_id` for attributing messages to a subagent run; parallel spawning by
  emitting multiple Task tool calls in a *single* coordinator response (separate turns =
  sequential); `fork_session` / `--fork-session` / `/subtask` for forks that inherit the
  full conversation and share the parent's prompt cache; scoped tool sets per subagent
  (a synthesis agent gets a narrow `verify_fact`, not web search).
- **Scenario tie-in**: 3. Multi-Agent Research System; 4. Developer Productivity Tools.

## Task 1.4 — Workflow Enforcement and Handoff

- **Principle**: Programmatic enforcement (hooks, prerequisite gates) is deterministic —
  100%. Prompt-based instructions are probabilistic and carry a non-zero failure rate.
  Use programmatic enforcement whenever a single failure causes financial loss, a
  security breach, a regulatory violation, or safety harm.
- **Why the exam wants this**: It is the highest-frequency fork in the whole exam. The
  four-distractor pattern for high-stakes items always offers a stronger prompt, few-shot
  examples, and a specialised subagent — all three are wrong.
- **Why a hook beats a prompt**: prompts are probabilistic — the model follows an instruction
  *most* of the time, which is not a guarantee. A hook is code that intercepts the loop, and the
  model cannot override it. A prompt rule is also easy to under-specify ("refunds over $500 are
  not allowed" silently leaves verified customers exempt); the hook has no such gap. Exam trigger
  words — *guarantee*, *must never*, *policy requires* — always resolve to programmatic
  enforcement.
- **The canonical example**: a support agent told "only process refunds under $500" one day
  processes a $2,000 refund because the model weighed the instruction against its own judgement.
  The fix is a PreToolUse gate that blocks `process_refund` when the amount exceeds the limit and
  escalates to a human instead — the tool never runs, so there is nothing to override.
- **Distractors**: Strengthening the system prompt ("always verify identity before
  refunding"); adding few-shot examples of correct ordering; routing to a subagent whose
  prompt emphasises the rule; dumping the full conversation transcript into a human
  handoff; escalating immediately with zero context when the agent can still make
  progress.
- **Exact terms**: PreToolUse hook as a programmatic gate (exit code 2 blocks;
  `permissionDecision` values `"allow"`, `"deny"`, `"ask"`); prerequisite gate on
  `process_refund` gated on a verified customer ID from `get_customer`; structured handoff
  brief — customer ID, 2–3 sentence issue summary, root cause, actions taken,
  recommended action including refund amount, compliance/urgency flags (the human does
  not have the transcript, so the brief must be self-contained); multi-concern requests →
  decompose, investigate in parallel with shared context, synthesise a unified resolution.
- **Scenario tie-in**: 1. Customer Support Agent.

## Task 1.5 — Hooks: PreToolUse, PostToolUse, PreCompact

- **Principle**: PreToolUse fires before a tool executes — gates, authorization,
  prerequisite checks, financial limits, and capturing the *prior state* for audit.
  PostToolUse fires after the tool and before the model sees the result — normalization,
  redaction, truncation, enrichment. Hooks gate, block, or transform; they do not rank
  tools.
- **Why the exam wants this**: Two keyword triggers decide these items. "Prior state" /
  "pre-condition" / "before X happens" → PreToolUse. "Heterogeneous formats" /
  "normalize" / "the model is confused by varying outputs" → PostToolUse.
- **Hooks are pass-through by default**: a hook must return the result unchanged for every tool
  it does not care about (early-return when the tool name does not match); it transforms only the
  tools it was written for.
- **Prerequisite gates are the two-hook pattern**: a PreToolUse gate blocks a downstream tool
  (`lookup_order`, `process_refund`) until session state carries a `verified` flag; a companion
  PostToolUse hook flips that flag once the upstream tool (`get_customer`) has actually succeeded.
  This is the programmatic answer to "the agent occasionally calls `process_refund` before
  `get_customer`."
- **Concrete normalisation**: PostToolUse maps raw tool output — database status codes (3/5/8) to
  readable labels, an epoch timestamp to a date — before the model reasons over it, so the model
  never misreads a delivered order as pending.
- **Gate the delegation too**: the same precondition can be enforced one level up — the
  coordinator must not spawn the refund subagent if the verification subagent reported that the
  customer does not exist.
- **Distractors**: Capturing prior state in PostToolUse (the mutation already happened);
  normalizing formats downstream in reporting code instead of at the tool boundary;
  reordering tool preference with a hook (use descriptions and prompts); handling a
  compliance rule with a prompt instruction rather than a hook; a separate error-handling
  or compliance agent that commands subagents directly (second orchestrator, violates the
  single-control-point design).
- **Exact terms**: PreToolUse, PostToolUse, PostToolUseFailure (fires when the tool itself
  errored), PreCompact / PostCompact, PermissionRequest, SessionStart, SessionEnd,
  UserPromptSubmit, Stop, SubagentStart / SubagentStop. Hook types: `command` (exit 0 =
  pass, exit 2 = block), `http`, `mcp_tool`, `prompt`, `agent`. Config locations:
  `~/.claude/settings.json` (personal), `.claude/settings.json` (project, versioned),
  `.claude/settings.local.json` (gitignored), managed policy settings (org-wide).
- **Scenario tie-in**: 1. Customer Support Agent; 5. Claude Code for Continuous
  Integration.

## Task 1.6 — Task Decomposition Strategies

- **Principle**: Match the pattern to the shape of the work, not to a preference. Prompt
  chaining when the steps really are fixed; dynamic adaptive decomposition when the next
  step depends on what the last one revealed; orchestrator–workers for typing and
  delegation; multi-pass review for large diff sets.
- **Why the exam wants this**: The discriminating question is always which pattern fits —
  "every request follows the same flow" is chaining; "the cause is unknown until we look"
  is adaptive. It also guards the over-engineering trap: if a single-agent loop works, the
  preferred answer is not to refactor to multi-agent.
- **The one-line decision**: ask "do I know the exact steps before I start?" — yes → prompt
  chaining (a fixed pipeline: per-file review, then cross-file integration, then a summary); no →
  dynamic decomposition (start from the last 24h of error logs and let each finding choose the
  next step, with generic tools like read logs / query DB / check config / trace request). Never
  apply a fixed checklist to an open-ended task; the predefined steps become wrong the moment
  findings diverge from the initial assumptions.
- **Chaining lives inside subagents too**: a coordinator that always spawns verify → process in
  order is itself a chained workflow, and a subagent's own loop can be chained internally when its
  steps are known. The choice is per-workflow, not global.
- **Distractors**: A fixed checklist run unconditionally on an unknown bug path (wastes
  budget, misses the actual cause); brute-force parallelization across every layer "just
  in case"; expanding the checklist for more coverage; one giant single-pass review of a
  large PR (attention dilution, inconsistent findings, missed cross-file issues);
  refactoring a working single agent into a coordinator with subagents; an
  evaluator–optimiser loop over criteria the evaluator cannot reliably distinguish.
- **Exact terms**: prompt chaining (fixed sequential pipeline) vs adaptive decomposition;
  multi-pass review — pass 1 per-file local analysis, pass 2 cross-file integration;
  evaluator–optimiser; orchestrator–worker (uniform clones differentiated only by
  prompt-supplied scope); parallel subagents across a partition (elapsed time becomes
  max(subagent_durations), so balance by expected effort); serial decomposition →
  parallel execution → serial synthesis.
- **Scenario tie-in**: 2. Code Generation with Claude Code; 3. Multi-Agent Research
  System.

## Task 1.7 — Session Management: `--resume`, `fork_session`, Stale State

- **Principle**: `--resume <session-name>` continues a named prior conversation with full
  context — only while its tool results are still valid. `--fork-session` resumes an
  existing session under a new session ID so the original is untouched and each branch
  explores a different approach.
- **Why the exam wants this**: The trap is resuming because it is cheaper, then acting on
  stale tool results. Stale input produces confidently wrong work that costs more than a
  fresh start.
- **Named resume**: start a session with a name and continue it later by that name (`--resume
  <name>`; bare `--resume` takes the most recent). Always state explicitly what changed since the
  last session — the agent cannot detect modified files, updated dependencies or new requirements
  on its own.
- **Fork is for parallel exploration only**: `--fork-session` gives two branches the same
  expensive baseline so each can explore a different approach without touching the original. Do
  not use a fork to absorb targeted file edits — that is a resume, or a fresh start if the change
  is large.
- **Two fresh-start triggers**: (1) the prior tool results are fundamentally stale (a heavily
  changed codebase); (2) extended context degrades the model's reasoning capability. When starting
  fresh, inject a structured summary of prior findings and **frame it as a hypothesis to validate,
  not as established fact**.
- **Distractors**: Resuming after files changed and trusting the agent to notice;
  forking to give both branches the *old* state when the state itself is the problem;
  restarting with zero context when a structured summary would preserve valid findings;
  assuming a resumed session will detect file changes on its own.
- **Exact terms**: `--resume <session-name>`; `--fork-session` (resumes under a new ID);
  `fork_session` (the older API-level name for the same shared-baseline branch); `/subtask
  <prompt>` spawns a fork inheriting the full conversation and returning only its result;
  `/fork` copies the whole session into a separate background session; `/branch` switches
  you into a copy; when starting fresh, pass a structured summary of prior findings.
- **Scenario tie-in**: 2. Code Generation with Claude Code; 4. Developer Productivity
  Tools.

## Correlations

- Loops enforce the tool cycle; the coordinator delegates work into those loops; hooks
  gate what may pass through them. Reading them as one chain: `stop_reason` drives
  iteration → each `tool_use` is a chance for a PreToolUse gate → each result is a chance
  for PostToolUse normalization → the coordinator consumes aggregated results and decides
  the next delegation.
- Deterministic-compliance cluster: hooks + prerequisite gates + forced `tool_choice`
  (`{"type":"tool","name":"..."}`). Same answer family for identity-before-refund,
  trade limits, approvals, permission gates.
- Coordinator pattern cluster: hub-and-spoke + explicit context passing + scoped subagent
  tools + synthesis downstream. Decomposition, partitioning, and context-passing failures
  all present as output defects, so trace upstream first.
- Exploration cluster: adaptive decomposition + scratchpad/structured state + Explore
  subagent. Adaptive decomposition and prompt chaining are the two ends of one axis —
  predictability versus evidence-driven next steps.
- Session to context durability: because a session is a portable unit of state (resumable,
  forkable, teleportable), anything the agent must not lose belongs in files or a manifest,
  not in scrollback.
- Over-engineering guardrail ties 1.6 to 1.2: multi-agent adds latency, cost, and failure
  surface; delegate only when a task floods the coordinator's context, needs a genuinely
  different prompt or tool set, or can run in parallel.

## Recall card

- `stop_reason` is the only authoritative termination signal. Anything else is wrong.
- `"tool_use"` → execute, append `tool_result` with the matching `tool_use_id`, loop.
  `"end_turn"` → done. `"pause_turn"` and `"max_tokens"` are resumable, not terminal.
- Check `stop_reason` *before* reading `content`. A `refusal` is HTTP 200 with an empty or
  partial body.
- Iteration caps are safety nets. They are never the primary stop condition.
- Parallel tool calls need one `tool_result` per id, all in one user turn.
- Subagent state: nothing carries over. The prompt is the universe.
- Missing topics → the coordinator's decomposition was too narrow. Blame upstream.
- Duplicate work → sloppy scope partitioning. Missing citations → context-passing format.
- Won't delegate → `"Task"` is missing from the coordinator's `allowedTools`.
- Subagents never talk to each other. All communication routes through the coordinator.
- Parallel spawning = multiple Task calls in one coordinator response, not across turns.
- High stakes → hooks, every time, no matter how strong the prompt wording.
- The four distractors for a high-stakes item: stronger prompt, few-shot examples,
  specialised subagent, prompt-ordered tool sequence. All wrong.
- Prior state / pre-condition / "before X happens" → PreToolUse.
- Heterogeneous formats / normalize / redact / model confused by varying outputs →
  PostToolUse.
- Hooks gate, block, and transform. They do not rank tool preference.
- Human handoff must carry root cause *and* recommended action including the amount — the
  human has no transcript.
- Unknown bug path → adaptive decomposition, not a fixed checklist and not brute-force
  parallel layers.
- Large PR → two passes: per-file local analysis, then cross-file integration.
- Single-agent works? Do not refactor to multi-agent.
- Stale tool results → new session plus a structured summary, not `--resume`.
- `--fork-session` to branch from a shared expensive baseline under a new session ID.

## Sources

Files actually read for this note:
- `dnacenta-domains/d1-agentic-architecture.md` (full)
- `hamzafarooq-cheatsheets/domain1.md` (full)
- `00-concept-map.md` (Domain 1 section + correlation/tradeoff tables)
- `03-anti-patterns-catalog.md` (loop and coordinator anti-patterns)
- `02-mock-exam-trap-guide.md` (trap taxonomy)
- `paullarionov-guide_en.md` (lines 29–108 exam format and the 8 scenarios; §1.3
  `stop_reason`; §2.3–2.5 `tool_choice` and schemas; Chapter 3 Agent SDK 3.1–3.5; §5.10
  `fork_session`; Chapters 8–10 decomposition, escalation, multi-agent error handling)
- `daronyondem-study-guide.md` (§8 Agentic Patterns and Task Decomposition; §9 Customer
  Service and Production Workflow Design)
- `timothywarner-practice-60q.md` ("Multi-agent Research System" block, Q1–Q15)
- Peace Of Code CCAR-F series, Domain 1 episodes 03–05 — `a2N6vKdQUfE` (subagent context passing &
  session management), `e7ijjK173zI` (multi-agent Python / Claude SDK capstone), `JJBcpwpsKzk`
  (PreToolUse/PostToolUse hooks & task decomposition); transcripts in `ccaf2026/video-transcripts/`
- `README.md` (scenario → domain mapping)

Not stated in corpus: full content for Scenario 8 (Agentic AI Tools). The scenario is
listed in paullarionov-guide_en.md but its body is marked missing.
