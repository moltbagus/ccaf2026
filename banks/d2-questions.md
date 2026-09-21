# Domain 2 — Question Bank (20 questions)

Tasks 2.1–2.5. Scenario-based, four options, one correct. Wrong options are engineered to sound smart, efficient, thorough, helpful, enterprise, simple, or pragmatic. Reused questions come from `resources/timothywarner-practice-60q.md` (original question number noted); the rest are newly written and grounded in the Domain 2 master note.

### Q1

Production logs show requests like "analyze the uploaded quarterly report" are routed to the web-search agent 45% of the time instead of the document analysis agent. The web-search agent has a tool `analyze_content` described as "analyzes content and extracts key information"; the document analysis agent has `analyze_document`, described as "analyzes documents and extracts key information."

**Which approach is most effective?**

A) Add a pre-routing classifier that detects whether the user refers to uploaded files or web content before the coordinator delegates.
B) Rename the web-search tool to `extract_web_results` and update its description to "processes and returns information retrieved from web search and URLs."
C) Add few-shot examples to the coordinator prompt showing correct routing for uploaded files versus web pages.
D) Expand the document analysis tool description with usage examples, leaving the web-search tool unchanged.

**Answer:** B
**Why:** Tool names and descriptions are the selection mechanism, so eliminating the semantic overlap between `analyze_content` and `analyze_document` fixes the root cause. A classifier and few-shot examples both mask the collision, and fixing only one of the two descriptions leaves the other still claiming to "analyze content."
**Trap:** sounds-smart
**Task:** 2.1
**Source:** reused from timothywarner-practice-60q.md (Q7)

### Q2

While testing a support agent you observe it often calls `get_customer` when users ask about order status, even though `lookup_order` would be more appropriate.

**Which approach is most effective?**

A) Implement a preprocessing classifier that detects order-related requests and routes them directly to `lookup_order`.
B) Reduce the number of tools available to the agent to simplify the choice.
C) Add few-shot examples to the system prompt covering all possible order-request patterns.
D) Check the tool descriptions to confirm they clearly differentiate each tool's purpose and usage boundaries.

**Answer:** D
**Why:** The tool description is the primary input the model uses to decide which tool to call, so the first diagnostic step is verifying that the descriptions separate purpose and boundaries. A classifier is heavy infrastructure over a description problem, removing tools degrades capability without addressing the ambiguity, and enumerating "all possible patterns" is unbounded effort built on a weak foundation.
**Trap:** sounds-smart
**Task:** 2.1
**Source:** reused from timothywarner-practice-60q.md (Q46)

### Q3

A single `manage_refund` tool is described as "processes refunds, partial refunds, store credits, or exchanges depending on policy and customer status." Production output shapes are inconsistent and the agent frequently sends the wrong parameter set.

**Which approach is most effective?**

A) Keep one tool but add a `mode` enum parameter listing the four behaviours.
B) Rename the tool to `refund_processor` and expand its description to explain each mode.
C) Split it into purpose-specific tools with tight contracts: `issue_full_refund`, `issue_partial_refund`, `issue_store_credit`, `process_exchange`.
D) Add few-shot examples to the system prompt showing each mode in use.

**Answer:** C
**Why:** A description containing "or"/"depending on" is unsplittable at runtime, and purpose-specific tools with typed contracts make each parameter set unambiguous. An enum on one generic tool and a rename both leave the over-broad contract intact, and examples treat the symptom rather than the contract.
**Trap:** sounds-simple
**Task:** 2.1
**Source:** newly written

### Q4

A research subagent queries three source categories: academic databases return 15 relevant papers, industry reports return "0 results", and patent databases return "Connection timeout". You are designing how these outcomes reach the coordinator.

**Which approach is most effective?**

A) Aggregate the outcomes into a single success-percentage metric such as "67% source coverage", with detailed logs available on demand.
B) Report both "timeout" and "0 results" as failures requiring coordinator intervention.
C) Retry transient failures internally and report only persistent errors.
D) Distinguish access failures (the timeout) that require a retry decision from valid empty results ("0 results") that represent a successful query.

**Answer:** D
**Why:** A timeout and a valid empty result are semantically different and demand different responses — retry the patent source, accept "0 results" as an informative finding. A coverage percentage discards which portion is retryable, treating "0 results" as failure forces needless intervention, and internal-only retries strip the partial-progress detail the coordinator needs.
**Trap:** sounds-enterprise
**Task:** 2.2
**Source:** reused from timothywarner-practice-60q.md (Q12)

### Q5

The web-search subagent times out while researching a complex topic. You need to design how information about this failure is returned to the coordinator.

**Which approach is most effective?**

A) Return structured error context to the coordinator including the failure type, the query executed, any partial results, and potential alternative approaches.
B) Catch the timeout within the subagent and return an empty result set marked as successful.
C) Implement exponential-backoff retries inside the subagent and return a generic "search unavailable" status after exhausting them.
D) Propagate the timeout exception directly to the top-level handler, terminating the workflow.

**Answer:** A
**Why:** Structured error context gives the coordinator what it needs to retry with a modified query, use partial results, or reroute. Marking a timeout as a successful empty result makes a search that never ran look like one that found nothing, a generic status strips the failure type and attempted query, and propagating the raw exception kills the whole workflow instead of one branch.
**Trap:** sounds-pragmatic
**Task:** 2.2
**Source:** reused from timothywarner-practice-60q.md (Q9)

### Q6

A `get_customer` tool returns an empty array in two different situations: no customer matches the search, and the customer database is unreachable. The agent currently retries on both and eventually escalates with the message "customer not found".

**Which error contract is most effective?**

A) Return `isError: true` whenever the results array is empty, so the agent always escalates rather than guessing.
B) Return `isError: false` with an empty array when no customer matches, and `isError: true` with `errorCategory: "transient"` and `isRetryable: true` when the database is unreachable.
C) Increase the retry count and raise the timeout so transient database failures resolve on their own.
D) When the result is empty, have the agent ask the user to confirm their customer ID before proceeding.

**Answer:** B
**Why:** A valid empty result is information, not an error — `isError: false` with an empty array lets the agent say "no customer found", while a genuine access failure carries `isError: true` and a transient category so the agent can decide whether to retry. Always escalating mislabels success, more retries cannot fix a misclassified empty result, and asking the user to confirm an ID that simply does not exist burns a turn on a non-problem.
**Trap:** sounds-efficient
**Task:** 2.2
**Source:** newly written

### Q7

A `process_refund` tool returns a generic "Operation failed" in two distinct cases: the refund exceeds the self-service policy limit, and the payment gateway times out *after* the refund was submitted. The current wrapper marks both retryable.

**Which error contract is most effective?**

A) For the policy case return `isError: true` with `errorCategory: "business"`, `isRetryable: false` and a customer-friendly description; for the post-submission timeout return `isError: true` with `errorCategory: "transient"`, `isRetryable: false` and an explicit "outcome unknown — do not retry without an idempotency check" message.
B) Mark both `isRetryable: true` so the agent can retry with backoff.
C) Retry both cases internally inside the tool up to five times before surfacing anything.
D) Return both as empty results so the workflow continues without noise.

**Answer:** A
**Why:** Business-rule violations are never retryable and need a user-facing explanation, and a write that may already have executed must report uncertainty rather than invite a retry that duplicates the charge. Retrying a policy failure cannot succeed, internal retries on an uncertain write risk double refunds, and returning empty hides both failures entirely.
**Trap:** sounds-pragmatic
**Task:** 2.2
**Source:** newly written

### Q8

The document analysis agent was given a general-purpose `fetch_url` tool so it could download documents by URL. Logs show it now frequently downloads search engine results pages to do ad hoc web search, which should route through the web-search agent, producing inconsistent results.

**Which fix is most effective?**

A) Replace `fetch_url` with a `load_document` tool that validates that URLs point to document formats.
B) Remove `fetch_url` and route all URL fetching through the coordinator to the web-search agent.
C) Add domain filtering that blocks `fetch_url` calls to known search engine domains.
D) Add a prompt instruction telling the agent to use `fetch_url` only for document URLs.

**Answer:** A
**Why:** Constraining capability at the interface level makes undesired search behaviour impossible rather than discouraged — the principle of least privilege applied to the tool contract. Routing all fetches through the coordinator adds a hop for legitimate downloads, a domain blocklist is brittle against unlisted engines, and a prompt instruction leaves the over-broad capability intact.
**Trap:** sounds-simple
**Task:** 2.3
**Source:** reused from timothywarner-practice-60q.md (Q10)

### Q9

The synthesis agent must verify specific claims while merging results. Today it returns control to the coordinator, which calls the web-search agent before re-invoking synthesis — adding 2–3 loops per task and 40% latency. Assessment shows 85% of verifications are simple fact checks (dates, names, stats) and 15% need deeper research.

**Which approach is most effective?**

A) Give the synthesis agent access to all web-search tools so it never loops through the coordinator.
B) Have the synthesis agent accumulate all verification needs and return them as one batch to the coordinator at the end.
C) Have the web-search agent proactively cache extra context around each source during initial research.
D) Give the synthesis agent a limited-scope `verify_fact` tool for simple checks, with complex verifications routed through the coordinator to the web-search agent.

**Answer:** D
**Why:** A scoped tool absorbs the 85% high-frequency case directly while preserving the delegation path for the 15% that needs it — least privilege plus a large latency cut. The full web-search toolset over-provisions and blurs roles, batching to the end lets unverified claims shape the draft, and proactive caching guesses at what will be questioned and inflates tokens.
**Trap:** sounds-efficient
**Task:** 2.3
**Source:** reused from timothywarner-practice-60q.md (Q15)

### Q10

One agent has 18 tools configured and frequently selects the wrong one. Its task mix genuinely requires all 18 capabilities.

**Which approach is most effective?**

A) Expand all 18 tool descriptions with I/O contracts, examples, and explicit boundaries.
B) Set `tool_choice: "any"` so the model must commit to a tool rather than answering in text.
C) Distribute the tools across specialized subagents, giving each 4–5 role-relevant tools.
D) Add few-shot selection examples for all 18 tools to the system prompt.

**Answer:** C
**Why:** Selection reliability degrades with the number of tools in front of the model, and each subagent should carry only its role-relevant set. Better descriptions do not change the count, `tool_choice: "any"` forces a call without improving which one, and examples for 18 tools add token cost on every request while leaving the overload in place.
**Trap:** sounds-thorough
**Task:** 2.3
**Source:** newly written

### Q11

Every customer message must call `extract_intent` before routing, currently enforced by a system prompt instruction. Roughly 15% of messages skip the extraction step.

**Which approach is most effective?**

A) Strengthen the system prompt to state that intent extraction is mandatory before routing.
B) Set `tool_choice: {"type": "tool", "name": "extract_intent"}` on the first turn, then switch to `"auto"` for subsequent turns.
C) Set `tool_choice: "any"` on the first turn so the model must call some tool.
D) Add a post-hoc validation step that re-runs routing whenever the extraction output is missing.

**Answer:** B
**Why:** A forced tool choice makes the first call structurally guaranteed where a prompt only makes it probable. "any" still lets the model pick a different tool, stronger prose is the same probabilistic mechanism that already failed 15% of the time, and post-hoc validation pays a second pass after the wrong action may already have been taken. Note the corpus caveat: forced `tool_choice` returns 400 on Fable 5.1 / Mythos 5.1, where `auto` plus an explicit instruction naming the tool is the replacement; Opus 5, Sonnet 5, and the 4.x family accept forced values.
**Trap:** sounds-simple
**Task:** 2.3
**Source:** newly written

### Q12

Your team wants to add a GitHub MCP server for searching PRs and checking CI status in Claude Code. Six developers each have a personal GitHub token. You want consistent tooling across the team without committing credentials.

**Which configuration approach is most effective?**

A) Have each developer add the server in user scope with `claude mcp add --scope user`.
B) Create an MCP server wrapper that reads tokens from a `.env` file and proxies GitHub API calls, then add the wrapper to the project `.mcp.json`.
C) Add the server to the project `.mcp.json` using environment variable substitution (`${GITHUB_TOKEN}`) for auth, and document the required variable in the project README.
D) Configure the server in project scope with a placeholder token and tell developers to override it in local config.

**Answer:** C
**Why:** A version-controlled `.mcp.json` with `${VAR}` expansion gives one shared source of truth for the config while each developer supplies their own secret locally. User-scope setup loses the shared source of truth, a custom proxy is unnecessary engineering when built-in expansion exists, and a committed placeholder token risks accidental use.
**Trap:** sounds-enterprise
**Task:** 2.4
**Source:** reused from timothywarner-practice-60q.md (Q44)

### Q13

At the start of every conversation a support agent makes a dozen exploratory tool calls to work out what data the backend exposes, burning context before any real work happens.

**Which approach is most effective?**

A) Build a natural-language aggregator tool that re-routes to the correct underlying tool automatically.
B) Expose MCP resources that catalogue what is available — schemas, issue summaries, content listings — so the agent reads the catalogue once and then queries precisely.
C) Load the full data catalogue into the system prompt and raise the MCP output token limit.
D) Add a disambiguation tool that returns only the single best-matching data source per call.

**Answer:** B
**Why:** Resources exist to reduce exploratory tool calls by showing the agent what data exists before it acts. An aggregator hides the real tool surface and makes selection worse, preloading the catalogue is token bloat, and returning one best match per call removes the model's ability to judge across options.
**Trap:** sounds-smart
**Task:** 2.4
**Source:** newly written

### Q14

A code-analysis MCP server exposes a tool that understands transitive dependencies and ranks results, but the agent keeps using Grep instead because Grep's description is tighter.

**Which approach is most effective?**

A) Enhance the MCP tool's description with inputs, outputs, examples, and an explicit boundary clause such as "use this for semantic queries like 'where do we handle payment retries'; prefer Grep for exact-string searches".
B) Remove Grep and other overlapping built-in tools from the agent so the MCP tool is the only option.
C) Add a hook that redirects Grep calls to the MCP tool.
D) Add a system prompt line telling the agent to prefer the MCP tool.

**Answer:** A
**Why:** MCP tools compete with built-ins on description quality, and the documented fix is to strengthen the MCP tool's description with the concrete advantages built-ins cannot provide. Removing built-ins discards tools the agent still needs, a hook is the wrong layer for an API/MCP selection problem, and a bare prompt line is weaker than the description the model actually routes on.
**Trap:** sounds-efficient
**Task:** 2.4
**Source:** newly written

### Q15

A team wants Jira integration for its research and support agents. A maintained community MCP server exists and covers the workflow, but its search tool returns more fields than the team needs.

**Which approach is most effective?**

A) Write a custom MCP server so the team controls the tool surface exactly.
B) Skip MCP and give the agents a Bash script that calls the Jira REST API.
C) Adopt the community server and add a `PostToolUse` hook to reshape its output.
D) Adopt the community server and post-process its responses (or fork it) to trim the fields the team does not need.

**Answer:** D
**Why:** "Configuration over construction" and "fork over fresh build" — a community server that covers 90% of the need is the starting point, and a field-shape gap is handled by post-processing or a fork. A custom server is wasted effort for a standard integration, a Bash script discards the whole MCP integration, and a hook is the wrong layer when the gap is in the response shape.
**Trap:** sounds-enterprise
**Task:** 2.4
**Source:** newly written

### Q16

You need to find every caller of `legacyAuth` and then the test files that cover those callers. Test files follow the `<source>.test.ts` convention.

**Which approach is most effective?**

A) Glob every source file first, then Grep each one for `legacyAuth`.
B) Grep for `legacyAuth(` to collect the caller files, derive the expected test filenames, then Glob patterns such as `**/{userService,paymentService}.test.{ts,tsx}`.
C) Grep for `*.test.ts` to enumerate the test files, then Read each one.
D) Ask the user which files contain the callers.

**Answer:** B
**Why:** Content-seeded discovery starts with Grep to find the callers, then Glob narrows paths around the results. Glob-first inverts seed and filter and touches far more files, a glob pattern is not a content search so Grep `*.test.ts` returns nothing useful, and asking the user dodges a lookup the tools can perform.
**Trap:** sounds-thorough
**Task:** 2.5
**Source:** newly written

### Q17

An Edit call fails with "multiple matches": the target snippet appears identically in six places in a 400-line config, and only one occurrence should change.

**Which approach is most effective?**

A) Run `sed -i` over the file to replace the target string.
B) Set `replace_all: true` so the edit applies to every occurrence.
C) Expand `old_string` with surrounding context until it is unique; if no unique anchor exists at all, Read the full file and Write the corrected version.
D) Delete the file and Write it again from scratch.

**Answer:** C
**Why:** Edit's failure mode is structural — it needs a unique anchor — so the first move is to widen the anchor, with Read-then-Write as the fallback when nothing unique exists. Shell text tools are the wrong category, `replace_all` rewrites five sites that should not change, and deleting the file is destructive and loses content.
**Trap:** sounds-pragmatic
**Task:** 2.5
**Source:** newly written

### Q18

`formatDate` is defined in `date.ts` and re-exported from `index.ts` as `formatDateISO`. Grepping only `formatDate` finds the definition but misses the production callers.

**Which approach is most effective?**

A) Grep the original name across the repository and accept the results as complete.
B) Read the wrapper module, list its exports and any aliases, then Grep each alias name across the codebase.
C) Glob all `.ts` files and Read them all to see every use.
D) Grep for the import of `./date` and infer the callers from that.

**Answer:** B
**Why:** Re-exporting wrappers hide call sites behind aliases, so the trace is: read the wrapper, list exports and aliases, grep each. Grepping only the original name misses every alias caller, reading every file is a context-budget killer, and grepping imports finds the module boundary rather than the calls.
**Trap:** sounds-thorough
**Task:** 2.5
**Source:** newly written

### Q19

You must explore an unfamiliar 200-file codebase to locate where request retries are handled, and the context window is already partly used.

**Which approach is most effective?**

A) Grep for entry points, Read those files, Grep for the identifiers they reference, then Read only the implementations that matter.
B) Read every file in the target directory upfront to build a complete picture.
C) Spawn one subagent per file so the whole directory is read in parallel.
D) Index the repository into a vector store and query it semantically.

**Answer:** A
**Why:** Understanding is built incrementally — Grep to find entry points, Read selectively, Grep again from what you learned. Reading everything upfront burns tens of thousands of tokens before any reasoning begins, per-file subagents multiply that cost, and a vector store is heavyweight infrastructure for a bounded lookup.
**Trap:** sounds-thorough
**Task:** 2.5
**Source:** newly written

### Q20

Before running a codemod you need to enumerate every React component file in the repository so the tool can be pointed at them. A teammate suggests Grepping for `import React`.

**Which approach is most effective?**

A) Grep for `import React` and treat every matching file as a component.
B) Glob every JavaScript file, then Grep each for `export default`.
C) Ask the user to list the component files.
D) Glob `**/*.tsx` to enumerate the component files by path.

**Answer:** D
**Why:** "Which files exist" is a path question, so Glob matches by name and extension. `import React` is a content pattern and misses components on modern runtimes that do not import React, Glob-then-Grep reads far more files than needed, and asking the user replaces a mechanical lookup with a manual step.
**Trap:** sounds-smart
**Task:** 2.5
**Source:** newly written