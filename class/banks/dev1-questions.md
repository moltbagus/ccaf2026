# Domain 1 — Agents and Workflows (14.7%) — Question Bank (20 questions)

Coverage: 1.1 ×6, 1.2 ×7, 1.3 ×7.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A support feature reads a customer email, classifies it into one of five fixed
categories, routes it to a category-specific prompt, and returns a templated reply. The
path is fully known in advance, yet the team proposes building a fully autonomous agent
with a general tool set "so it can handle anything."

**Which approach is most effective?**
A) Build a workflow: classify with one call, route to the category-specific prompt, and return the templated reply.
B) Build an autonomous agent with all five reply prompts exposed as tools so it can choose a path.
C) Build an autonomous agent and put a router agent in front of it to pick the category first.
D) Build the autonomous agent but cap it at ten iterations to bound the cost.

**Answer:** A
**Why:** The sequence is fixed and drawable, so a workflow is predictable, cheap, and testable. Exposing the five prompts as tools hands the model a decision it never needed to make and makes output nondeterministic; a router agent in front is just the workflow's router with an agent wrapped around it; and an iteration cap bounds runaway cost but leaves the unnecessary nondeterminism in place.
**Trap:** sounds-simple
**Task:** 1.1
**Source:** newly written

### Q2
A research coordinator is asked for "AI's impact on creative industries." Every subagent completes successfully, yet the final report covers only visual art and misses music, literature, and film. Logs show the coordinator decomposed the topic into "AI in digital art," "AI in graphic design," and "AI in photography."

**Which approach is most effective?**
A) Add coverage-gap detection instructions to the synthesis agent so it flags missing areas.
B) Fix the root cause: the coordinator's task decomposition is too narrow and must partition the space to cover all relevant areas.
C) Loosen the document-analysis agent's relevance criteria so it stops filtering non-visual sources.
D) Broaden the web-search agent's queries to sweep more industry sectors.

**Answer:** B
**Why:** The subagents executed their briefs correctly, so the defect is upstream at the coordinator's decomposition — a synthesis gap-detector only sees what upstream returned and cannot recover topics never assigned, and no query rewrite covers sectors absent from the decomposition. Loosening relevance or widening queries cannot add a category the plan never named.
**Trap:** sounds-thorough
**Task:** 1.1
**Source:** newly written

### Q3
A long-running agent must research a topic across dozens of pages and then write a report. Its single context fills with raw page text and it begins to lose the original instructions. A teammate suggests switching to a larger-context model.

**Which approach is most effective?**
A) Switch to a larger-context, more capable model so the single agent can hold everything.
B) Give the single agent a summarization tool and instruct it to summarize each page before reading the next.
C) Use an orchestrator that dispatches a research subagent per source; each subagent returns only the extracted facts, and the orchestrator writes the report from those.
D) Split into one subagent per page but give every subagent the full tool set so any of them can write the report.

**Answer:** C
**Why:** Subagents isolate context: each research subagent absorbs the raw page text and returns a distilled fact, so the orchestrator's context holds only what the report needs. A larger-context model just delays the overflow and costs more; a self-summarization instruction is non-deterministic and still grows the same single context; and one subagent per page with the full tool set multiplies cost and hands report-writing authority to every worker.
**Trap:** sounds-smart
**Task:** 1.1
**Source:** newly written

### Q4
A single-agent loop already resolves 84% of support tickets; the remainder are mostly policy gaps that escalate to humans. A proposal recommends refactoring into a coordinator with four specialist subagents plus an evaluator–optimizer quality loop.

**Which approach is most effective?**
A) Refactor to a coordinator with four subagents so each concern type gets a specialist.
B) Refactor to subagents but give every subagent the identical prompt so behavior stays consistent.
C) Wrap the existing agent in an evaluator–optimizer loop that iterates until quality criteria pass.
D) Keep the single agent, and add subagents only where a task floods the coordinator's context, needs a genuinely different prompt or tool set, or can run in parallel.

**Answer:** D
**Why:** Multi-agent adds latency, cost, and failure surface, so delegate only when a single agent genuinely cannot do the job. Refactoring a working loop is the over-engineering trap; identical prompts across subagents isolate nothing; and an evaluator–optimizer spins when the evaluator cannot reliably distinguish good output from bad.
**Trap:** sounds-enterprise
**Task:** 1.1
**Source:** newly written

### Q5
While researching a broad topic, the web-search agent and the document-analysis agent investigate the same subtopics, producing substantial duplication. Token usage nearly doubles with no proportional increase in breadth or depth.

**Which approach is most effective?**
A) Let both agents finish in parallel, then have the coordinator deduplicate overlapping results before synthesis.
B) Have the coordinator explicitly partition the research space before delegating, assigning each agent distinct subtopics or source types.
C) Add a shared live focus log so the agents can dynamically avoid duplication while running.
D) Switch to sequential execution, running document analysis only after web search so it can reuse the results.

**Answer:** B
**Why:** Partitioning before delegation fixes the root cause (unclear task boundaries) while preserving parallelism. Post-hoc deduplication still pays the token cost of the duplicated work; a shared live focus log assumes isolated subagents can watch each other mid-run; and forcing sequential execution discards the parallelism that justifies the design.
**Trap:** sounds-enterprise
**Task:** 1.1
**Source:** newly written

### Q6
A research system's fact-checking subagent was granted the full production tool set, including a `write_record` tool, "so it can fix problems it finds." An audit flags the agent's ability to mutate production data.

**Which approach is most effective?**
A) Remove the write tool and grant the fact-checker only the read-only lookup tools it needs, following least privilege.
B) Keep the write tool but add a system-prompt instruction never to write production records.
C) Keep the write tool and add logging on every write so mutations can be reviewed.
D) Give every subagent the full tool set so all of them can act consistently.

**Answer:** A
**Why:** Constrain capability at the interface so the unwanted action is impossible rather than discouraged — a fact-checker needs to read, not write. A prompt instruction leaves the over-broad capability intact and can be overridden; logging is detective, not preventive; and giving everyone the full tool set multiplies both cost and the permission surface.
**Trap:** sounds-helpful
**Task:** 1.1
**Source:** newly written

### Q7
A developer needs an agent that reads files, runs tests, and edits code in a repository, with a permission prompt before any write. They plan to write a custom while-loop over the Messages API that parses `tool_use` blocks and implements its own approval flow.

**Which approach is most effective?**
A) Build the custom loop so the approval flow can be tuned exactly as needed.
B) Use the Claude Agent SDK: configure the built-in file and test tools and a permission mode so writes require approval, and write only the logic unique to their task.
C) Build the custom loop but reuse the SDK's tool schemas by copy-pasting them into the code.
D) Skip tools entirely and ask the model to output file edits as text for the developer to apply by hand.

**Answer:** B
**Why:** The SDK already ships the loop, the built-in file and test tools, and a permission system, so the team writes only what is unique to their task. A custom loop reimplements all of it and inherits the maintenance; copy-pasting schemas still leaves the loop, dispatch, and approvals hand-rolled; and abandoning tools for text output throws away the agentic capability the task requires.
**Trap:** sounds-pragmatic
**Task:** 1.2
**Source:** newly written

### Q8
An agent with shell access must be prevented from running destructive commands like `rm -rf` or pushing to a protected branch — no matter what a prompt or a retrieved document says.

**Which mechanism is most effective?**
A) Add "never run destructive commands or push to protected branches" to the system prompt.
B) Switch to a more capable model, which follows safety instructions more reliably.
C) Register a `PreToolUse` hook that inspects the command and blocks destructive patterns and protected-branch pushes before they execute.
D) Log every command the agent runs so violations can be reviewed afterward.

**Answer:** C
**Why:** A hook is deterministic code that runs on the tool call before execution, so the block holds regardless of what the model was told or ingested. A prompt line is only a request that injected content or a confused model can override; a more capable model improves compliance but still gives no guarantee; and logging is detective, not preventive — by the time the log is read, the destructive command has already run.
**Trap:** sounds-simple
**Task:** 1.2
**Source:** newly written

### Q9
A regulated team must run an agent that touches customer PII. Data residency and network isolation are hard requirements, and API credentials must never leave their own VPC. They are choosing between an Anthropic-hosted managed agent and running the loop themselves.

**Which approach is most effective?**
A) Use the managed/hosted agent because it ships fastest with the least operational burden.
B) Use the managed agent and add a prompt instruction to avoid processing PII.
C) Use the managed agent with a redaction step before any content leaves their environment.
D) Self-host the agent (the Agent SDK on their own compute) so secrets, network egress, data residency, and audit stay under their control.

**Answer:** D
**Why:** When residency, secret handling, and network isolation are hard constraints, self-hosting is the choice that satisfies them, at the cost of operating the infrastructure. A managed agent routes data through the vendor's environment; a prompt instruction is not an isolation control; and redaction cannot guarantee the residency and egress requirements the team must meet.
**Trap:** sounds-pragmatic
**Task:** 1.2
**Source:** newly written

### Q10
A developer needs a long-lived interactive agent that holds a session across many user turns, plus a small one-shot script that runs a single agent prompt and exits. They want to use the Claude Agent SDK for both.

**Which approach is most effective?**
A) Use `ClaudeSDKClient` for the multi-turn session and `query()` for the one-shot script, configuring both with `ClaudeAgentOptions`.
B) Hand-roll a while-loop over the Messages API for both cases.
C) Use `query()` for both, re-passing the entire prior conversation on every turn.
D) Use `ClaudeSDKClient` for both, opening and closing a fresh client for each one-shot call.

**Answer:** A
**Why:** `query()` runs a one-shot agent loop and `ClaudeSDKClient` holds a session for multi-turn interaction, so each tool matches its case. Hand-rolling discards the SDK's loop and dispatch; driving a multi-turn session through repeated `query()` calls means manually re-feeding history the client would manage; and wrapping a single-shot call in a client is unnecessary ceremony.
**Trap:** sounds-efficient
**Task:** 1.2
**Source:** newly written

### Q11
A team needs a custom tool available to their Agent SDK agent, and they want it versioned and deployed together with the agent code rather than as a separate process or network service.

**Which approach is most effective?**
A) Stand up a separate MCP server over HTTP and register it with the agent.
B) Hard-code the tool's logic into the system prompt so the model performs it inline.
C) Define the tool in-process with the SDK's tool decorator and register it via an in-process SDK MCP server (for example `create_sdk_mcp_server`) so it ships with the code.
D) Give the model a generic `Bash` tool and let it invoke a script on disk.

**Answer:** C
**Why:** An in-process SDK MCP server lets the custom tool ship and version with the agent code, with no separate service to operate. A standalone HTTP server is exactly the extra deployment the team wants to avoid; putting logic in the prompt removes the tool contract and makes behavior nondeterministic; and a generic `Bash` escape hatch is an over-broad capability that bypasses the tool's schema and approval path.
**Trap:** sounds-helpful
**Task:** 1.2
**Source:** newly written

### Q12
Three MCP servers return dates differently: one as Unix epoch integers, one as "Mar 5, 2025", and one as ISO 8601. The agent frequently misreads the values and creates duplicate records. A colleague proposes normalizing the formats in the downstream reporting code.

**Which approach is most effective?**
A) Add a prompt instruction listing the three formats the model may encounter.
B) Add a `PostToolUse` hook that normalizes every tool result to ISO 8601 before the model sees it.
C) Add few-shot examples showing one correctly parsed value in each format.
D) Handle all format conversion in the downstream reporting pipeline and leave tool results untouched.

**Answer:** B
**Why:** Intercept the result before the model reasons over it — `PostToolUse` is the boundary for normalizing timestamps, dates, and status codes. Prompt guidance and few-shot examples are probabilistic; and downstream normalization leaves the model working with inconsistent values for the rest of the loop, which is where the duplicate records originate.
**Trap:** sounds-smart
**Task:** 1.2
**Source:** newly written

### Q13
A team must interleave bespoke deterministic domain logic between every model turn and control exactly how messages are constructed — validation, retries, and state transitions the SDK's turn loop does not expose. They are deciding whether the Agent SDK still fits.

**Which approach is most effective?**
A) Use the Agent SDK anyway and move the domain logic into hook callbacks and prompt instructions.
B) Adopt a heavyweight multi-agent graph framework to gain the missing control.
C) Use `ClaudeSDKClient` and describe the interleaved logic in the system prompt so the model performs it.
D) Hand-roll a custom loop over the Messages API when the required control flow genuinely cannot be expressed with the SDK.

**Answer:** D
**Why:** The SDK-first rule has an explicit exception: when the control flow truly cannot be expressed in the SDK, a custom loop over the Messages API is the right tool. Forcing the logic into hooks and prompts distorts both; a graph framework adds a dependency without providing this specific interleaving; and asking the model to perform deterministic logic is nondeterministic by construction.
**Trap:** sounds-efficient
**Task:** 1.2
**Source:** newly written

### Q14
A customer-support agent runs a manual loop over `client.messages.create` with tools. A teammate proposes exiting the loop when the assistant's text contains "resolved" or "done," to avoid an extra API call. Production shows the agent sometimes presents a partial answer and stops before finishing.

**Which approach is most effective?**
A) Branch on `stop_reason`: keep looping while it is `"tool_use"`, and present the final text when it is `"end_turn"`.
B) Keep the phrase check but expand the list of completion words to cover more cases.
C) Exit after a fixed maximum of eight iterations so the loop is always bounded.
D) Treat any response whose first content block is type `"text"` as complete.

**Answer:** A
**Why:** `stop_reason` is the only authoritative termination signal. A response can contain both a text block and a `tool_use` block, so text heuristics misfire; an iteration cap is a safety net, not the stopping mechanism; and "first block is text" ignores the case where more tool work follows.
**Trap:** sounds-simple
**Task:** 1.3
**Source:** newly written

### Q15
A multi-step agent that processes support tickets runs 30 or more tool calls per ticket. Its per-ticket cost and latency keep rising, and late in each run it ignores formatting rules set at the start.

**Which change is most effective?**
A) Increase `max_tokens` so the model has more room to think on each call.
B) Switch to a larger-context model and keep the full history for every ticket.
C) Compact the conversation as it grows — summarize completed steps, prune stale tool output, cache the stable prefix — and offload bulky sub-tasks to subagents.
D) Reduce the agent to a single tool call per ticket so the context never grows.

**Answer:** C
**Why:** Rising cost and ignored early instructions are the classic symptoms of context bloat, so the fix is active context management: compact, prune, cache, and isolate. Raising `max_tokens` adds output room but no context hygiene; a bigger window only lets the bloat grow larger before it fails the same way; and collapsing to one tool call removes the multi-step capability the task requires.
**Trap:** sounds-thorough
**Task:** 1.3
**Source:** newly written

### Q16
An agent must remember a customer's stated preferences and prior resolutions across separate runs that happen days apart. Each run today starts with an empty conversation.

**Which approach is most effective?**
A) Keep appending to the conversation and resume the same session indefinitely so nothing is lost.
B) Rely on prompt caching, which persists the preferences across runs.
C) Store everything in the system prompt, growing it on every run so all history is always present.
D) Use a long-term memory store (an external file, database, or memory tool) that survives across sessions, loading the relevant items into context each run.

**Answer:** D
**Why:** Short-term memory is the context window and long-term memory is an external store that outlives a session, which is what cross-session recall requires. Resuming one session forever accumulates unbounded bloat; prompt caching only makes a stable prefix cheaper within its lifetime and does not persist state across runs; and stuffing all history into the system prompt grows cost and drifts.
**Trap:** sounds-helpful
**Task:** 1.3
**Source:** newly written

### Q17
A team is building a multi-agent system where the workflow has cycles, must resume after a pause, and must hold a human-approval checkpoint before the final step. Each step's state must be inspectable.

**Which approach is most effective?**
A) Use a single agent with a large system prompt describing all the steps and let it decide the order.
B) Use an abstraction framework that models the workflow as a stateful graph with checkpointing and human-in-the-loop support (for example LangGraph).
C) Hand-roll the orchestration on the raw Messages API so nothing is constrained by a framework.
D) Give every agent the full tool set and let them message each other freely until the task completes.

**Answer:** B
**Why:** Explicit state, resumability, cycles, and human-in-the-loop are exactly what a stateful graph framework provides out of the box. A single mega-prompt agent enforces no ordering and cannot resume; hand-rolling reimplements checkpointing and approvals and maintains them yourself; and free-form agent-to-agent messaging with full tool sets removes the guarantees the requirements demand.
**Trap:** sounds-enterprise
**Task:** 1.3
**Source:** newly written

### Q18
A pipeline passes structured data between agent steps. Each step must emit a schema-validated object consumed by the next, and an invalid object must be rejected and retried at the boundary rather than silently flowing downstream.

**Which approach is most effective?**
A) Use a type-safe framework where inputs, dependencies, and outputs are validated models (for example PydanticAI).
B) Use a graph framework with untyped dict state and no validation at step boundaries.
C) Ask the model in the prompt to always emit valid JSON, and parse with a bare `try/except`.
D) Let each agent write free text and pass the prose along to the next step.

**Answer:** A
**Why:** Validated, typed contracts between steps are the defining strength of a type-safe agent framework, which rejects and retries invalid output at the boundary. Untyped dict state offers no validation; a prompt request plus a bare `try/except` is probabilistic and swallows failures; and free-text handoff removes the structure the pipeline depends on.
**Trap:** sounds-smart
**Task:** 1.3
**Source:** newly written

### Q19
A long tool-use loop resends the same large system prompt and tool definitions on every iteration. The content of that prefix never changes, yet per-iteration cost keeps climbing as the loop runs.

**Which approach is most effective?**
A) Shorten the system prompt by removing the tool descriptions so the prefix is smaller.
B) Reduce `max_tokens` so each call costs less.
C) Use prompt caching on the stable prefix (system prompt plus tool definitions) so it stays cheap across iterations, keeping cache checkpoints aligned to stable content.
D) Switch to a cheaper model for the whole loop.

**Answer:** C
**Why:** Prompt caching keeps a stable prefix cheap across loop iterations, which is exactly the recurring cost being paid. Trimming tool descriptions degrades the model's ability to call tools correctly; lowering `max_tokens` caps output but not input cost; and dropping to a cheaper model trades away quality the task needs rather than fixing the repeated-prefix cost.
**Trap:** sounds-efficient
**Task:** 1.3
**Source:** newly written

### Q20
A coordinator response emits two parallel `tool_use` blocks in one turn. The harness appends a single `tool_result` block summarizing both, and the agent now re-calls the same tools repeatedly instead of continuing.

**Which approach is most effective?**
A) Send each `tool_result` in its own separate user message, one after the other.
B) Combine both results into one prose `tool_result` block and let the model split them.
C) Mark the second result `is_error: true` so the model stops calling the tool again.
D) Append one `tool_result` block per tool call, all in a single `role: "user"` message, each carrying its matching `tool_use_id`.

**Answer:** D
**Why:** Every `tool_use` must be answered by a `tool_result` carrying the exact matching `tool_use_id`; parallel calls require multiple blocks in the same user turn so the loop can pair results to requests. Splitting them across messages leaves the pairing ambiguous; collapsing them leaves requests unanswered and the loop re-fires; and a spurious `is_error` misrepresents a valid result.
**Trap:** sounds-thorough
**Task:** 1.3
**Source:** newly written
