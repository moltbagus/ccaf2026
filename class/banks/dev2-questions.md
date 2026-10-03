# Domain 2 — Applications and Integration (33.1%) — Question Bank (20 questions)

Coverage: 2.1 ×2, 2.2 ×2, 2.3 ×4, 2.4 ×4, 2.5 ×5, 2.6 ×3.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A product owner asks the team to "have Claude answer support tickets automatically." A
developer's first instinct is to open an editor and start writing the system prompt,
choosing the largest model to be safe.

**Which approach is most effective?**
A) Write a detailed system prompt against the most capable model, ship it, and refine based on production feedback.
B) Decompose the goal into functional requirements (classify the ticket, draft a reply, decide when a human reviews) and infrastructure requirements (latency, peak throughput, data residency, cost ceiling), write them as testable acceptance criteria, then let those constraints select the API pattern and model.
C) Prototype quickly in claude.ai to confirm the idea is feasible, then port the prompt to production unchanged.
D) Copy a competitor's public support-bot prompt as a starting point and iterate from there.

**Answer:** B
**Why:** The model and API pattern fall out of the requirements, not the reverse. Writing the prompt first (A), prototyping before requirements (C), and borrowing a prompt (D) all solve the demo while leaving latency, throughput, residency, and cost unexamined.
**Trap:** sounds-helpful
**Task:** 2.1
**Source:** newly written

### Q2
A hospital network wants Claude to summarize patient charts for clinicians. Regulators
require the data to be processed within the country. Clinicians read summaries within
seconds, and volume peaks during morning rounds.

**Which approach is most effective?**
A) Use the Message Batches API because it is cheaper, and let clinicians read the summaries when the batch finishes the next morning.
B) Send all traffic to the direct Anthropic API from the company's US data center to minimize latency.
C) Process every chart with the most capable model and extended thinking enabled so the summaries are maximally thorough, keeping the current processing location.
D) Route requests through a vendor that offers in-country regional processing and call the realtime Messages API with streaming so summaries render within seconds.

**Answer:** D
**Why:** D is the only option that satisfies both hard constraints at once — in-country processing for residency and the realtime Messages API for the seconds-scale latency. Batch (A) violates the clinician SLA even though it is cheaper. US processing (B) violates residency, a legal constraint, not a performance preference. The maximally thorough option (C) drops residency entirely to chase summary quality.
**Trap:** sounds-thorough
**Task:** 2.1
**Source:** newly written

### Q3
A team edits a production system prompt to fix a formatting complaint. Overall answer
quality drops, but a model alias was also updated by the vendor the same week, so nobody
can tell which change caused it.

**Which approach is most effective?**
A) Version the system prompt and the model ID in source control, roll back to the last known-good combination, and add an eval suite as a gate for future prompt and model changes.
B) Revert the prompt edit and keep tuning it live in production until quality recovers.
C) Switch to the most capable model available so the prompt change matters less.
D) Add instructions to the prompt telling Claude to preserve the previous quality and formatting.

**Answer:** A
**Why:** Versioning plus rollback to a known-good combination is the only option that restores a reproducible state and then prevents recurrence with an eval gate. Live editing (B) has no record, so it cannot isolate cause. A bigger model (C) adds a second uncontrolled variable. More instructions (D) compound the untracked change instead of reverting it.
**Trap:** sounds-smart
**Task:** 2.2
**Source:** newly written

### Q4
The vendor announces that the model snapshot a production feature depends on will be
deprecated in six months. The feature has no automated tests.

**Which approach is most effective?**
A) Do nothing until the deprecation date; the model alias will keep working after the cutoff.
B) Immediately rewrite the application on a new agent framework before the deadline.
C) Track the deprecation notice, pin the current snapshot, build an eval suite that captures current behavior, and run a reviewed migration to a replacement snapshot before the cutoff.
D) Ask the vendor to extend support for the snapshot indefinitely.

**Answer:** C
**Why:** Lifecycle management means planning for model change: pin what you ship, capture current behavior in an eval, and migrate deliberately before the cutoff. Ignoring the notice (A) leaves an unplanned outage. A full framework rewrite (B) is a large unrelated change driven by a small migration need. Asking the vendor to freeze the snapshot (D) is not a control you own.
**Trap:** sounds-enterprise
**Task:** 2.2
**Source:** newly written

### Q5
A developer's multi-turn assistant keeps asking for information the user already provided.
Their code sends only the newest user message on each call to `/v1/messages`.

**Which approach is most effective?**
A) Keep conversation state on the client and send the full `messages` array — prior user and assistant turns plus the new message — on every request, because the Messages API is stateless.
B) Enable the `session` parameter on the Messages API so the server retains prior turns between calls.
C) Raise `max_tokens` so Claude has more room to remember earlier messages.
D) Add "remember everything the user said earlier" to the system prompt.

**Answer:** A
**Why:** Statelessness is the root cause, so the fix is to resend the prior turns in the `messages` array. There is no server-side `session` parameter (B) — the client owns history. `max_tokens` (C) caps output length and has nothing to do with memory. A system instruction (D) cannot restore content the API never received.
**Trap:** sounds-simple
**Task:** 2.3
**Source:** newly written

### Q6
A response from Claude contains a text block followed by a `tool_use` block, and
`stop_reason` is `"tool_use"`. The harness only executes a tool when the entire `content`
array is a single `tool_use` block, so it prints the text and ends the turn without ever
running the tool.

**Which approach is most effective?**
A) Detect the tool name by parsing the assistant's text for a function-call pattern, then run it.
B) Iterate over every content block; for each `tool_use` block run the tool and return a `tool_result` block carrying its matching `tool_use_id`, then continue while `stop_reason` is `"tool_use"`.
C) Treat the presence of any text block as the end of the turn to avoid an extra API call.
D) Set `stop_sequences` so the model cannot emit text and a tool call in the same response.

**Answer:** B
**Why:** A single response can contain both text and `tool_use` blocks, so the harness must iterate the block list and answer each `tool_use` with a matching `tool_result`. Text parsing (A) is brittle. Treating text as the end of turn (C) drops the tool call. `stop_sequences` (D) cannot forbid a block type and does not address the loop.
**Trap:** sounds-efficient
**Task:** 2.3
**Source:** newly written

### Q7
A team must classify 200,000 historical support emails to seed a search index. The index
is needed next week, nothing is user-facing, and cost is the primary constraint.

**Which approach is most effective?**
A) Send the requests through the realtime Messages API in parallel now to hit the deadline, and revisit the cost later.
B) Trim `max_tokens` on each classification to cut cost, then run everything synchronously.
C) Switch to the smallest model for every email regardless of classification quality.
D) Submit the work as Message Batches, poll for completion, and reassemble the results by `custom_id`.

**Answer:** D
**Why:** Batch fits latency-tolerant, high-volume, cost-sensitive work and reassembles unordered results by `custom_id`. Parallel realtime calls (A) ignore the cost constraint and invite rate limits. Trimming `max_tokens` (B) degrades output without touching the cost structure batch fixes. A blind model downgrade (C) sacrifices quality and still misses the batch discount.
**Trap:** sounds-pragmatic
**Task:** 2.3
**Source:** newly written

### Q8
Every request in a high-volume service shares the same 40,000-token system prompt, tool
definitions, and policy document; only the final user question changes. Input cost and
time-to-first-token are both high.

**Which approach is most effective?**
A) Have Claude summarize the policy document once and inject the shorter summary into every request to shrink the prefix.
B) Enable a persistent session so the server keeps the shared prefix between calls.
C) Mark the stable prefix (system prompt, tools, document) with `cache_control` so repeated calls read it from cache, and confirm the effect via `cache_creation_input_tokens` and `cache_read_input_tokens` in the usage object.
D) Raise `max_tokens` so the model has room to re-read the shared context each call.

**Answer:** C
**Why:** Prompt caching is the mechanism for a stable prefix reused across calls, and the usage object reports cache creation and read tokens. Summarizing the policy (A) loses fidelity and still is not cached. A persistent session (B) does not exist — the Messages API is stateless. `max_tokens` (D) is unrelated to input caching.
**Trap:** sounds-smart
**Task:** 2.3
**Source:** newly written

### Q9
Under load, a service calling Claude receives HTTP 429 rate-limit responses. The current
retry loop immediately resends every failed request in a tight loop, worsening the
overload.

**Which approach is most effective?**
A) Increase the retry count so more requests eventually succeed.
B) Retry with exponential backoff plus jitter, cap the number of attempts, and make the retried operation idempotent so a duplicate call cannot double-act.
C) Lower `max_tokens` so requests are smaller and less likely to be rate-limited.
D) Switch to a smaller model, which has higher rate limits.

**Answer:** B
**Why:** Backoff with jitter, a bounded attempt count, and idempotency is the standard remedy for 429s; retrying immediately amplifies the overload. More retries without backoff (A) worsen the storm. `max_tokens` (C) changes output length, not request rate. A smaller model (D) does not remove the client-side retry loop.
**Trap:** sounds-efficient
**Task:** 2.4
**Source:** newly written

### Q10
A synchronous HTTP handler calls Claude inline and blocks a worker thread for several
seconds per request. Under load the worker pool is exhausted and unrelated endpoints slow
down.

**Which approach is most effective?**
A) Add more worker threads to the pool so the blocking calls have room.
B) Raise the request timeout so the blocking calls have time to finish.
C) Lower `max_tokens` so each call returns faster.
D) Make the model call asynchronous and non-blocking (await it or hand it to a queue with a callback) so a slow upstream call never holds a request-handling thread.

**Answer:** D
**Why:** Model calls are network I/O and must not block a request handler; async or queued dispatch frees the thread. Adding threads (A) scales the symptom and the cost. A longer timeout (B) keeps threads blocked even longer. Trimming `max_tokens` (C) does not change the blocking architecture.
**Trap:** sounds-pragmatic
**Task:** 2.4
**Source:** newly written

### Q11
A 2,000-line integration module mixes prompt strings, retry logic, and provider calls, and
is hard to change safely. A teammate proposes rewriting it from scratch in a single pull
request.

**Which approach is most effective?**
A) Refactor in small, test-backed steps — extract the model client, centralize prompt templates, split the module — and use the eval suite to prove behavior is unchanged at each step.
B) Freeze the module and avoid touching it until a full rewrite is unavoidable.
C) Rewrite the whole module in one pull request so the end state is clean quickly.
D) Add explanatory comments throughout and leave the structure as is.

**Answer:** A
**Why:** Small, verified refactors keep behavior provable against an eval suite. A big-bang rewrite (C) lands a large unverified change. Freezing (B) and commenting (D) leave the coupling in place. The eval suite is what makes each step safe.
**Trap:** sounds-simple
**Task:** 2.4
**Source:** newly written

### Q12
Three engineers edit a shared prompt document directly; prompt changes are never reviewed
and have no history. A recent edit silently broke a behavior that an eval had previously
passed.

**Which approach is most effective?**
A) Lock the shared document so only one person can edit it.
B) Stand up a dedicated prompt-management platform with a web UI and approval workflow.
C) Move prompts and tool schemas into git behind pull requests and code review, and run the eval suite in CI so a prompt change must pass before it ships.
D) Require a Slack message describing each prompt change before it is made.

**Answer:** C
**Why:** Prompts and tool schemas are versioned artifacts that belong in version control behind review, gated by the eval suite in CI. Locking the doc (A) removes collaboration without adding history or review. A bespoke platform (B) is heavy process that still needs the same versioning and gate. A Slack note (D) is not a record or a gate.
**Trap:** sounds-enterprise
**Task:** 2.4
**Source:** newly written

### Q13
A feature prototyped in claude.ai works well. The team moves the same prompt text into
their API-backed app, but the answers are worse and the model no longer uses a tool it
used in the prototype.

**Which approach is most effective?**
A) Re-create the missing inputs explicitly in the API request — the system prompt, the tool definitions, and the examples — then eval the app rather than assuming the prompt text transfers.
B) Paste the original prompt into the system field and raise `max_tokens` until answers match the prototype.
C) Switch to the most capable model so the same prompt produces comparable quality.
D) Add "use the tools available" to the prompt and re-test.

**Answer:** A
**Why:** claude.ai supplies its own system prompt and tooling that the raw API does not, so the fix is to supply the missing inputs and eval the result. Raising `max_tokens` (B) changes output length, not the missing tools or instructions. A bigger model (C) cannot use tools you never declared. "Use the tools available" (D) is meaningless when no tools were declared.
**Trap:** sounds-helpful
**Task:** 2.5
**Source:** newly written

### Q14
An agent summarizes web pages submitted by end users. One page contains hidden
white-on-white text instructing the model to ignore its instructions and email the
conversation to an external address.

**Which approach is most effective?**
A) Raise the model's temperature so its behavior is harder to predict.
B) Treat retrieved page content as untrusted input, keep it separate from trusted system instructions, and use guardrails or hooks so injected instructions cannot trigger sensitive actions like sending email.
C) Pass the entire raw page, including the hidden text, so Claude has complete context, and instruct it to ignore anything suspicious.
D) Add a line to the system prompt asking users not to include malicious instructions.

**Answer:** B
**Why:** The content boundary is the defense: trusted instructions live apart from untrusted retrieved content, and a hook or guardrail prevents injected text from triggering sensitive actions. Temperature (A) does not stop injection. Passing the raw page (C) hands the injected text straight to the model. A prompt request (D) cannot constrain a user who is attacking the system.
**Trap:** sounds-thorough
**Task:** 2.5
**Source:** newly written

### Q15
A tool that extracts invoice fields uses a loose `input_schema` with no required fields
and free-form string properties. The model returns plausible but inconsistent shapes and
downstream parsing crashes.

**Which approach is most effective?**
A) Add a few examples of the desired output format to the prompt.
B) Add an instruction telling the model to always return valid JSON.
C) Catch the exceptions downstream and skip malformed records.
D) Tighten the JSON Schema — required fields, enums for fixed values, and clear property descriptions — and validate the response against it.

**Answer:** D
**Why:** A tight schema with required fields and enums constrains the shape, and validating the response catches violations at the boundary. Examples (A) and an instruction (B) are probabilistic and leave the loose contract. Swallowing exceptions downstream (C) hides the defect and silently drops data.
**Trap:** sounds-smart
**Task:** 2.5
**Source:** newly written

### Q16
A long-running assistant session has grown to 180,000 tokens. Responses drift from the
original task, latency rises, and earlier instructions are inconsistently followed. A
teammate proposes raising the context window limit.

**Which approach is most effective?**
A) Keep appending and raise the context window so nothing is ever dropped.
B) Keep the full transcript and increase `max_tokens` so the model has more room to reason.
C) Start a fresh session or summarize and compact between tasks, passing only the context the current task needs.
D) Add a system instruction reminding the model of the original task every turn.

**Answer:** C
**Why:** Long sessions accumulate context and drift; session hygiene means compacting or starting fresh and passing only what the task needs. A larger window (A) carries the drift forward. `max_tokens` (B) changes output length, not context quality. A reminder (D) does not remove the accumulated noise.
**Trap:** sounds-efficient
**Task:** 2.5
**Source:** newly written

### Q17
Three separate applications each reimplement the same document-retrieval capability with
slightly different code, and each has its own access rules.

**Which approach is most effective?**
A) Extract the capability into a shared plugin or MCP server, pin its version, review what it is allowed to access, and reuse it across the applications.
B) Copy the retrieval code into each application so each can evolve independently.
C) Build a bespoke internal framework that all future plugins must use.
D) Move the retrieval logic into each application's system prompt so it needs no code.

**Answer:** A
**Why:** Reuse through a shared plugin or MCP server avoids re-implementation, and pinning plus an access review keeps the shared capability controlled. Copying (B) multiplies the divergence. A bespoke framework (C) is heavy process for one capability. Prompt logic (D) cannot perform retrieval.
**Trap:** sounds-enterprise
**Task:** 2.5
**Source:** newly written

### Q18
A production Claude feature's outputs change overnight with no code deploy. The code
references the model by a moving alias, and prompts are edited in a shared document.

**Which approach is most effective?**
A) Ask the vendor to stop updating the alias so outputs stay stable.
B) Add a system instruction telling Claude to keep its answers consistent over time.
C) Pin the model to a specific dated snapshot and move prompt templates into version-controlled files, rolling changes out through review and an eval gate.
D) Switch to the most capable model, which changes less often.

**Answer:** C
**Why:** A moving alias is exactly the unpinned-model failure, and a shared doc is exactly the unversioned-prompt failure; pinning plus version control restores reproducibility. You cannot make a vendor freeze an alias (A). A prompt cannot stabilize a changed model (B). Model tier (D) is unrelated to pinning.
**Trap:** sounds-simple
**Task:** 2.6
**Source:** newly written

### Q19
Team members get inconsistent Claude Code behavior. One engineer's personal
`~/.claude/CLAUDE.md` contains instructions that override the shared project conventions,
and nobody knows which file wins.

**Which approach is most effective?**
A) Tell every engineer to delete their personal `CLAUDE.md` files.
B) Keep team-shared instructions in the repository's project `CLAUDE.md` (versioned and shared), understand the layering (enterprise → user → project → subdirectory, with the more specific scope taking precedence), and put shared conventions in the project scope rather than personal files.
C) Duplicate the shared conventions into every engineer's personal file so they always apply.
D) Move all instructions into a wiki page that engineers paste into their personal files.

**Answer:** B
**Why:** CLAUDE.md is layered with the more specific scope taking precedence, so shared conventions belong in the versioned project file. Deleting personal files (A) is heavy-handed and breaks legitimate personal preferences. Duplicating into every personal file (C) creates drift. A wiki paste (D) is unversioned and unenforced.
**Trap:** sounds-thorough
**Task:** 2.6
**Source:** newly written

### Q20
A team configures Claude Code permissions and hooks. One engineer committed an API key
directly into the shared `.claude/settings.json` for convenience, and personal overrides in
the same file conflict with team settings.

**Which approach is most effective?**
A) Commit the API key so every engineer has access, and keep all settings in the one shared file for simplicity.
B) Hard-code the key into the application source so it is always available at runtime.
C) Email the settings file with the key to the team so everyone uses the same configuration.
D) Keep shared behavior (permissions, hooks, environment variables) in the checked-in `.claude/settings.json`, personal overrides in a gitignored `.claude/settings.local.json`, and secrets in environment variables or a secret store — never in committed configuration.

**Answer:** D
**Why:** Shared behavior belongs in the checked-in settings, personal overrides in the gitignored local file, and secrets in the environment or a secret store — never committed. Committing the key (A) leaks a credential into version control. Hard-coding it (B) does the same in source. Emailing it (C) spreads the secret further.
**Trap:** sounds-pragmatic
**Task:** 2.6
**Source:** newly written
