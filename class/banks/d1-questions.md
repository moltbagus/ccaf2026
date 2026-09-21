# Domain 1 — Agentic Architecture (27%) — Question Bank (20 questions)

Coverage: 1.1 ×3, 1.2 ×5, 1.3 ×3, 1.4 ×2, 1.5 ×2, 1.6 ×3, 1.7 ×2.
Trap types used: sounds-enterprise, sounds-efficient, sounds-smart, sounds-helpful,
sounds-thorough, sounds-simple, sounds-pragmatic.

---

### Q1
A customer-support agent runs a manual loop over `client.messages.create` with tools. A
teammate proposes exiting the loop when the assistant's text contains "resolved" or
"done", because that avoids an extra API call. Production shows the agent sometimes
presents a partial answer and stops before finishing the work.

**Which approach is most effective?**
A) Keep the phrase check but expand the list of completion words to cover more cases.
B) Branch on `stop_reason`: keep looping while it is `"tool_use"`, and present the final text when it is `"end_turn"`.
C) Exit after a fixed maximum of eight iterations so the loop is always bounded.
D) Treat any response whose first content block is type `"text"` as complete.

**Answer:** B
**Why:** `stop_reason` is the only authoritative termination signal. A response can contain both a text block and a `tool_use` block, so text heuristics misfire; an iteration cap is a safety net, not the stopping mechanism.
**Trap:** sounds-simple
**Task:** 1.1
**Source:** newly written

### Q2
Operations wants a hard bound on a long-running research agent and asks you to make a
five-iteration cap the primary stop condition. Since the change, agents are frequently
cut off mid-task with partial results and no error.

**Which approach is most effective?**
A) Keep the cap as primary and rewrite the prompts so the work fits inside five turns.
B) Let `stop_reason` terminate the loop, and keep a generous safety cap as a guardrail rather than the control.
C) Parse the assistant's prose for a "task complete" marker so the loop can exit early.
D) Raise temperature so Claude completes the task in fewer tool calls.

**Answer:** B
**Why:** The loop is `stop_reason`-driven; caps exist only to prevent runaway loops. A token budget that the model can see (`output_config.task_budget`, beta, per dnacenta-domains/d1-agentic-architecture.md and beyond the exam guide) is the modern way to pace the loop, but `stop_reason` still terminates it.
**Trap:** sounds-efficient
**Task:** 1.1
**Source:** newly written

### Q3
A tool call returns two results from a pair of parallel `tool_use` blocks emitted in one
coordinator response. The harness appends a single `tool_result` block summarising both,
and the agent now re-calls the same tool repeatedly instead of continuing.

**Which approach is most effective?**
A) Append one `tool_result` block per tool call, all in a single `role: "user"` message, each carrying its matching `tool_use_id`.
B) Send each `tool_result` in its own separate user message, one after the other.
C) Combine both results into one prose `tool_result` block and let the model split them.
D) Mark the second result `is_error: true` so the model stops calling the tool again.

**Answer:** A
**Why:** Every `tool_use` must be answered by a `tool_result` carrying the exact `tool_use_id`; parallel calls require multiple blocks in the same user turn so the loop can match results to requests. Collapsing them leaves requests unanswered and the loop re-fires.
**Trap:** sounds-simple
**Task:** 1.1
**Source:** newly written

### Q4
After running a research system on "AI impact on creative industries", every subagent
completes successfully: search finds relevant articles, analysis summarises them
correctly, and synthesis produces coherent text. Final reports cover only visual art and
completely miss music, literature, and film. The coordinator's logs show it decomposed the
topic into "AI in digital art", "AI in graphic design", and "AI in photography".

**Which approach is most effective?**
A) Add coverage-gap detection instructions to the synthesis agent.
B) Loosen the document analysis agent's relevance criteria so it stops filtering non-visual sources.
C) Broaden the web-search agent's queries to cover more industry sectors.
D) Fix the root cause: the coordinator's task decomposition is too narrow and must partition the research space to cover all relevant areas.

**Answer:** D
**Why:** The subagents executed their briefs correctly, so the defect is upstream at the coordinator's decomposition — a synthesis gap-detector only sees what upstream returned and cannot recover topics never assigned, and no query rewrite covers sectors absent from the decomposition.
**Trap:** sounds-thorough
**Task:** 1.2
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q4)

### Q5
The web-search and document-analysis agents have completed their tasks and returned
results to the coordinator. You now need an integrated research report from both result
sets.

**Which approach is most effective?**
A) Each agent sends its results directly to the report-writing agent, bypassing the coordinator.
B) The document analysis agent requests the web-search results and merges them internally.
C) The coordinator passes both result sets to the synthesis agent for unified integration.
D) The coordinator concatenates the raw outputs from both agents and returns them as the final result.

**Answer:** C
**Why:** In hub-and-spoke, the coordinator forwards both result sets to synthesis for centralised integration, preserving control and quality. Direct agent-to-agent handoff bypasses the coordinator's visibility; concatenating raw outputs skips synthesis so contradictions reach the user unresolved.
**Trap:** sounds-efficient
**Task:** 1.2
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q2)

### Q6
While researching a broad topic, the web-search agent and the document analysis agent
investigate the same subtopics, producing substantial duplication. Token usage nearly
doubles without a proportional increase in research breadth or depth.

**Which approach is most effective?**
A) Have the coordinator explicitly partition the research space before delegating, assigning each agent distinct subtopics or source types.
B) Let both agents finish in parallel, then have the coordinator deduplicate overlapping results before synthesis.
C) Add a shared-state focus log so agents can dynamically avoid duplication while running.
D) Switch to sequential execution, running document analysis only after web search so it can reuse the results.

**Answer:** A
**Why:** Partitioning before delegation fixes the root cause (unclear task boundaries) while preserving parallelism. Post-hoc deduplication still pays the token cost of the duplicated work; a shared live focus log assumes subagents in isolated contexts can watch each other; forcing sequential execution discards the parallelism that justifies the design.
**Trap:** sounds-pragmatic
**Task:** 1.2
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q11)

### Q7
A document analysis subagent frequently fails on PDFs: some have corrupted sections,
some are password-protected, and the parser sometimes hangs on large files. Today any
exception immediately terminates the subagent and returns an error to the coordinator,
which must decide whether to retry, skip, or fail the whole task — causing excessive
coordinator involvement in routine error handling.

**Which approach is most effective?**
A) Create a dedicated error-handling agent that monitors failures via a shared queue and sends restart commands directly to subagents.
B) Configure the subagent to always return partial results with a success status, embedding error details in metadata.
C) Have the coordinator pre-validate every document before delegation, rejecting documents that might fail.
D) Implement local recovery in the subagent for transient failures and escalate to the coordinator only errors it cannot resolve, including attempted steps and partial results.

**Answer:** D
**Why:** Handle errors at the lowest level capable of resolving them, and escalate the rest with full context and partial progress. A separate error-handling agent creates a second orchestrator competing with the coordinator; reporting failures as success defeats the `tool_use` `is_error` signal; pre-validating in the coordinator pushes parsing concerns up the hierarchy and cannot predict a hang.
**Trap:** sounds-enterprise
**Task:** 1.2
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q3)

### Q8
A colleague proposes that the document analysis agent should send its results straight to
the synthesis agent, bypassing the coordinator, to save a hop. You argue for keeping the
coordinator as the central hub for all inter-subagent communication.

**Which approach is most effective?**
A) Keep the coordinator as hub: it observes all interactions, handles errors uniformly, and decides what information each subagent receives.
B) Bypass the coordinator because it batches subagent requests and reduces total API calls and latency.
C) Bypass the coordinator because central routing is the only way to get automatic retry logic.
D) Bypass the coordinator because isolated subagent memory requires serialization only the coordinator can perform.

**Answer:** A
**Why:** Central visibility, uniform error handling, and control over what each subagent receives are the defining advantages of the star topology. Batching is an optional optimisation, retries do not require a hub, and subagents already exchange plain structured `tool_result` content needing no bespoke serialization.
**Trap:** sounds-efficient
**Task:** 1.2
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q8)

### Q9
The document analysis agent was given a general-purpose `fetch_url` tool so it could
download documents by URL. Production logs show it now downloads search engine results
pages to perform ad hoc web search — behaviour that should route through the web-search
agent — producing inconsistent results.

**Which approach is most effective?**
A) Replace `fetch_url` with a `load_document` tool whose `input_schema` validates that URLs point to document formats.
B) Remove `fetch_url` from the document analysis agent and route all URL fetching through the coordinator to the web-search agent.
C) Block `fetch_url` calls to known search engine domains while allowing all other URLs.
D) Add a prompt instruction telling the document analysis agent to use `fetch_url` only for document URLs.

**Answer:** A
**Why:** Constrain capability at the interface, following least privilege, so the unwanted behaviour is impossible rather than discouraged. Routing legitimate downloads through the search agent overloads the wrong role; a domain blocklist is brittle; a prompt instruction leaves the over-broad capability intact.
**Trap:** sounds-simple
**Task:** 1.3
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q10)

### Q10
The synthesis agent often needs to verify specific claims while merging results. Today it
returns control to the coordinator, which calls the web-search agent and re-invokes
synthesis — adding 2–3 extra loops per task and 40% latency. Assessment shows 85% of
these verifications are simple fact checks (dates, names, stats) and 15% need deeper
research.

**Which approach is most effective?**
A) Give the synthesis agent the full web-search toolset so it can handle any verification directly.
B) Have the synthesis agent accumulate all verification needs and return them to the coordinator as one batch at the end.
C) Have the web-search agent proactively cache extra context around each source in anticipation of verification needs.
D) Give the synthesis agent a limited-scope `verify_fact` tool for simple checks, and route complex verifications through the coordinator to the web-search agent.

**Answer:** D
**Why:** A narrowly scoped tool removes most loops while preserving the coordinator path for the 15% that needs real research — least privilege at the interface. Full web-search access over-provisions the role; batching to the end lets unverified claims shape the draft; speculative caching inflates tokens for sources never questioned.
**Trap:** sounds-efficient
**Task:** 1.3
**Source:** reused from timothywarner-practice-60q.md (Multi-agent Research System, Q15)

### Q11
A coordinator spawns a document-analysis subagent with the prompt "Analyze the customer's
issue." The subagent returns generic advice. The coordinator's own context already holds
the customer ID, order ID, order date, and disputed amount.

**Which approach is most effective?**
A) Create a shared scratchpad file that both the coordinator and the subagent read during the run.
B) Include the relevant case facts explicitly in the subagent's prompt, with the goal, constraints, and expected output shape.
C) Let the subagent call `get_customer` and `lookup_order` itself to fetch whatever context it needs.
D) Resume the coordinator's session so the subagent inherits the conversation history.

**Answer:** B
**Why:** Subagents have isolated context and do not inherit the coordinator's history, so every fact the subagent needs must be in the prompt it receives. A shared file adds a coordination mechanism where a prompt suffices; self-fetching pushes coordinator duties down; resuming a session does not transfer history into a new subagent's context.
**Trap:** sounds-helpful
**Task:** 1.3
**Source:** newly written

### Q12
A customer-support agent must verify identity with `get_customer` before `process_refund`.
The system prompt already states this requirement. An audit of 20,000 refunds finds 1.5%
processed without a completed verification step.

**Which approach is most effective?**
A) Strengthen the system prompt to state that verification is mandatory and must never be skipped.
B) Add few-shot examples demonstrating refunds that follow the verification step first.
C) Add a PreToolUse hook on `process_refund` that blocks the call unless a verified customer ID exists, returning a denial reason with the next step.
D) Route refund requests to a specialised subagent whose prompt emphasises verification before action.

**Answer:** C
**Why:** Financial operations require deterministic, programmatic enforcement: a PreToolUse gate is 100% enforced, while prompt instructions and few-shot examples are probabilistic with a non-zero failure rate. A subagent with a stronger prompt is the same probabilistic mechanism with extra latency.
**Trap:** sounds-simple
**Task:** 1.4
**Source:** newly written

### Q13
Mid-investigation, a support agent escalates to a human. The human queue shows agents
forwarding full transcripts; reviewers take three times longer and often re-ask the
customer for details the agent had already established.

**Which approach is most effective?**
A) Forward the full conversation transcript so the human has every detail.
B) Compose a structured handoff brief: customer ID, 2–3 sentence issue summary, root cause, actions taken, recommended action including the amount, and urgency/compliance flags.
C) Have the human re-interview the customer to rebuild context from scratch.
D) Escalate earlier, before investigation starts, so the transcript stays short.

**Answer:** B
**Why:** The receiving human does not have access to the transcript, so the handoff must be self-contained and must carry the two fields items most often omit — root-cause analysis and the recommended action including the refund amount. A raw transcript is thorough but unusable; escalating before investigating discards work the agent could complete.
**Trap:** sounds-thorough
**Task:** 1.4
**Source:** newly written

### Q14
Three MCP servers return dates differently: one as Unix epoch integers, one as
"Mar 5, 2025", and one as ISO 8601. The agent frequently misreads the values and creates
duplicate records. A colleague proposes normalising the formats in the downstream
reporting code.

**Which approach is most effective?**
A) Add a PostToolUse hook that normalises every tool result to ISO 8601 before the model sees it.
B) Add a prompt instruction listing the three formats the model may encounter.
C) Add few-shot examples showing one correctly parsed value in each format.
D) Handle all format conversion in the downstream reporting pipeline and leave tool results untouched.

**Answer:** A
**Why:** Intercept the result before the model processes it — PostToolUse is the boundary for normalising timestamps, dates, and status codes. Prompt guidance and few-shot examples are probabilistic, and downstream normalization leaves the model reasoning over inconsistent values for the rest of the loop.
**Trap:** sounds-pragmatic
**Task:** 1.5
**Source:** newly written

### Q15
Auditors require the pre-change value of every record a mutating tool touches. Separately,
the agent keeps choosing between two similar write tools and should prefer one of them.

**Which approach is most effective?**
A) A PreToolUse hook on the mutating tool captures the prior state hash for audit; tool descriptions and prompts express which tool is preferred.
B) A PostToolUse hook captures the record state after each mutation for the audit trail.
C) A compliance subagent reviews tool calls asynchronously and flags policy problems afterwards.
D) A prompt instruction asks the model to log prior values; a hook ranks which tool the model should prefer.

**Answer:** A
**Why:** PreToolUse is the only point where prior state exists to capture, and it is the gate for pre-conditions. PostToolUse fires after the mutation, so the prior value is already gone; an asynchronous reviewer cannot prevent the write; hooks gate, block, and transform but do not rank tool preference, so D's second half is wrong.
**Trap:** sounds-smart
**Task:** 1.5
**Source:** newly written

### Q16
Production shows intermittent 500s in one service. The cause is unknown. The current
investigation runs a fixed six-step checklist every time: it burns budget on irrelevant
layers and repeatedly misses the actual cause.

**Which approach is most effective?**
A) Use adaptive decomposition: commit to the goal, then generate the next subtask from what the previous step revealed.
B) Run all six checklist layers in parallel so every layer is covered in one pass.
C) Expand the checklist to twelve steps so more of the system is covered.
D) Hand the whole investigation to a larger model with a bigger context window.

**Answer:** A
**Why:** Dynamic adaptive decomposition suits investigations where the next move depends on the current finding. Brute-force parallel layers and a longer fixed checklist both collect data the evidence does not call for, and a bigger model does not replace evidence-driven sequencing.
**Trap:** sounds-thorough
**Task:** 1.6
**Source:** newly written

### Q17
A 14-file pull request was reviewed in a single pass. Findings are inconsistent — the same
pattern is flagged in one file and approved in another — and no cross-file issues were
found at all, even though the change alters a shared interface.

**Which approach is most effective?**
A) Review in two passes: per-file local analysis for consistent depth, then a separate cross-file integration pass for data flow and interface mismatches.
B) Keep one pass but use a larger context window so all 14 files fit comfortably.
C) Keep one pass and instruct the model to be thorough about every file.
D) Review only the files with the largest diffs and trust the rest.

**Answer:** A
**Why:** Single-pass review of a large PR causes attention dilution and inconsistent standards, and structurally cannot see cross-file integration problems. A bigger window or a "be thorough" instruction does not change how the model allocates attention, and reviewing only large diffs skips the interface changes.
**Trap:** sounds-efficient
**Task:** 1.6
**Source:** newly written

### Q18
A single-agent loop already resolves 84% of support tickets, with the remainder mostly
policy gaps that escalate to humans. A proposal recommends refactoring into a coordinator
with four specialist subagents and an evaluator–optimiser quality loop.

**Which approach is most effective?**
A) Refactor to a coordinator with four subagents so each concern type gets a specialist.
B) Keep the single agent, and add subagents only where a task floods the coordinator's context, needs a genuinely different prompt or tool set, or can run in parallel.
C) Refactor to subagents but give every subagent the identical prompt so behaviour stays consistent.
D) Wrap the existing agent in an evaluator–optimiser loop that iterates until quality criteria pass.

**Answer:** B
**Why:** Multi-agent adds latency, cost, and failure surface, so delegate only when a single agent genuinely cannot do the job. Refactoring a working loop is the over-engineering trap, and an evaluator–optimiser spins when the evaluator cannot reliably distinguish good from bad.
**Trap:** sounds-enterprise
**Task:** 1.6
**Source:** newly written

### Q19
You have a three-day-old named session, `investigation-auth-bug`. Since then `auth.py` was
rewritten to use JWT tokens instead of session cookies. Resuming it is cheaper than
re-priming, but the agent's earlier tool results reflect the old file contents.

**Which approach is most effective?**
A) Start a fresh session and pass a structured summary of prior findings, or resume and explicitly state what changed since the last session.
B) Resume the session unchanged and trust the agent to re-read the files it needs.
C) `--fork-session` so both branches keep the old tool results available for comparison.
D) Start a fresh session with no context at all, to avoid any contamination from the old state.

**Answer:** A
**Why:** Resume only while tool results are still valid; when files changed, either restart with a structured summary of prior findings or resume and explicitly tell Claude what changed — it will not notice on its own. Forking preserves the stale state rather than fixing it, and discarding all context throws away findings that are still valid.
**Trap:** sounds-simple
**Task:** 1.7
**Source:** newly written

### Q20
You must evaluate two refactoring strategies — Redux versus Context API — starting from
the same expensive codebase analysis that took 40 minutes to build.

**Which approach is most effective?**
A) `--fork-session` the existing session under a new session ID and explore one strategy in each branch, leaving the original untouched.
B) Run both strategies inside the original session, alternating prompts, so both share the analysis and the cost.
C) Start two brand-new sessions with no inherited context and re-run the analysis in each.
D) `--resume` the same session name twice and interleave the two strategies.

**Answer:** A
**Why:** Forking branches from a shared baseline so each alternative stays isolated and the original session is never contaminated. Alternating inside one session mixes the two reasoning paths, re-running the analysis from scratch discards the expensive baseline, and resume does not create independent branches.
**Trap:** sounds-efficient
**Task:** 1.7
**Source:** newly written
