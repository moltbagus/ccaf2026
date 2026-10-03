# Domain 5 — Model Selection and Optimization (16.8%) — Question Bank (20 questions)

Coverage: 5.1 ×6, 5.2 ×7, 5.3 ×3, 5.4 ×4.
Trap types used: sounds-enterprise ×2, sounds-efficient ×4, sounds-helpful ×4,
sounds-pragmatic ×3, sounds-simple ×3, sounds-smart ×2, sounds-thorough ×2.

---

### Q1
An engineer sends a long contract in a single Claude API call and asks for a summary. The
request fails with a context-length error, and an earlier, shorter attempt returned a
summary that silently omitted the last third of the document.

**Which approach is most effective?**
A) Switch to the largest model available, on the assumption that a bigger model must have a bigger context window and will accept the whole contract.
B) Measure the request in tokens, keep the system prompt, history, tools, and document inside the context window, and chunk or summarise the document so nothing is dropped.
C) Raise `max_tokens` until the whole contract fits and the error goes away.
D) Send the document twice so the model is more likely to read all of it.

**Answer:** B
**Why:** The context window is a hard token budget shared by every part of the request — system prompt, history, tool definitions, documents, and the model's own output — so the fix is to count tokens and fit or chunk the input. A larger model may have a larger window, but that is not guaranteed and does not fix an input that exceeds capacity; the error is about capacity, not capability. `max_tokens` caps output length and does nothing for an oversized input. Sending the document twice doubles the token count and makes overflow worse.
**Trap:** sounds-simple
**Task:** 5.1
**Source:** newly written

### Q2
A support-ticket classifier passes on every prompt the team tries by hand but occasionally
misfiles tickets in production. Nothing in the code changed, and a scheduled model upgrade
is weeks away.

**Which approach is most effective?**
A) Set temperature to 0 and ship, because deterministic sampling removes the variation.
B) Add an instruction telling the model to always classify correctly and never make mistakes.
C) Pin the current model version, build a labelled eval set, measure accuracy on it, and re-run the eval against any new model version before promoting it.
D) Upgrade to the newest model immediately so the change happens before the deadline.

**Answer:** C
**Why:** Generation samples from a probability distribution, so the same prompt can produce different valid outputs across calls and across model versions; the only way to know accuracy is to measure it on a representative set. Temperature 0 reduces variance but does not make the model a pure function and yields no accuracy number. An instruction to "always be correct" gives the model nothing it can act on. Upgrading first is exactly the unmeasured change an eval exists to catch.
**Trap:** sounds-helpful
**Task:** 5.1
**Source:** newly written

### Q3
A summarisation endpoint sets `max_tokens` to 256. Users report that answers are cut off
mid-sentence, and the response's `stop_reason` is `"max_tokens"`.

**Which approach is most effective?**
A) Raise `max_tokens` to a value that fits the expected output and treat a `"max_tokens"` stop reason as output truncation rather than a refusal.
B) Raise the temperature so the model produces shorter, complete sentences within the cap.
C) Add "keep answers short" to the system prompt so the output fits the existing cap.
D) Switch to a model with a larger context window so the answer has more room.

**Answer:** A
**Why:** `max_tokens` is an output-length cap; when the model reaches it, generation stops mid-stream and `stop_reason` reports `"max_tokens"`. The fix is to size the cap to the expected output and branch on that stop reason explicitly. Temperature does not control length. A "keep it short" instruction changes the content to fit an arbitrary cap instead of meeting the requirement. The context window governs total input-plus-output capacity, not an output that had room to continue.
**Trap:** sounds-efficient
**Task:** 5.1
**Source:** newly written

### Q4
A pipeline tags each of a few million short records with one of six categories. It was
configured with extended thinking "to be safe", so latency and cost are high while accuracy
is unchanged from a plain fast response.

**Which approach is most effective?**
A) Keep extended thinking but lower the temperature to claw back latency.
B) Switch to the largest model with extended thinking enabled, since accuracy is the priority.
C) Keep extended thinking and raise `max_tokens` so the reasoning has room to finish.
D) Use the fast, low-effort mode for this simple, well-specified task and reserve extended or adaptive thinking for steps that genuinely need multi-step reasoning.

**Answer:** D
**Why:** Thinking modes and effort levels trade latency and cost for reasoning depth, so they should be spent only where reasoning is needed. A well-specified six-way classification gains nothing from extended thinking, and turning it off restores speed and cost without changing accuracy. Lowering temperature does not reduce thinking tokens; a larger model with thinking pays for capability the task cannot use; raising `max_tokens` pays for reasoning that is not improving the result.
**Trap:** sounds-thorough
**Task:** 5.1
**Source:** newly written

### Q5
A model reliably answers questions but keeps returning output in a slightly different
structure than the team's parser expects, even though the instructions describe the format
in prose. The task is nuanced and the format matters.

**Which approach is most effective?**
A) Raise the temperature so the model explores different structures until one matches.
B) Add a few worked examples (multi-shot) that show the exact input-to-output structure, so the model imitates the format rather than interpreting prose.
C) Increase `max_tokens` so the model has room to produce the full structure.
D) Tell the model to "try harder" to follow the format.

**Answer:** B
**Why:** Zero-shot prose instructions leave the exact structure under-specified; single- and multi-shot examples trade prompt tokens for reliability on nuanced formats by demonstrating the shape concretely. Temperature does not steer toward a target structure, `max_tokens` bounds length rather than structure, and "try harder" adds no information the model can act on.
**Trap:** sounds-helpful
**Task:** 5.1
**Source:** newly written

### Q6
A developer needs byte-identical output for a given input and is frustrated that repeated
calls return different but equally valid JSON ordering and wording.

**Which approach is most effective?**
A) Set temperature to 0 and top_p to 1.0 and assume the output is now a fixed, reproducible string.
B) Re-run each request until two consecutive outputs match, then return that one.
C) Accept that sampling produces variation, constrain the output with a schema, and validate and normalise the response programmatically instead of expecting a fixed string.
D) Cache the first response and replay it for every future identical prompt, ignoring changed inputs.

**Answer:** C
**Why:** The next-token loop samples from a probability distribution, so output varies across calls and versions and cannot be relied on to be a fixed string; the robust approach is to constrain and validate the shape of the output. Temperature 0 with top_p 1.0 reduces but does not remove variation. Re-running until two outputs match is expensive and still not a guarantee. Replaying a cached response ignores that behaviour can change and does not handle the general case.
**Trap:** sounds-smart
**Task:** 5.1
**Source:** newly written

### Q7
A chat UI built on an Anthropic SDK helper waits for the full response before rendering and
appears to hang until the answer is complete. The team cares about time-to-first-token.

**Which approach is most effective?**
A) Consume the streamed server-sent events as they arrive and render each increment, rather than waiting for a single complete JSON body.
B) Increase the request timeout so the UI eventually gets the full body and renders it.
C) Switch to a smaller model so the whole answer arrives faster in one piece.
D) Disable streaming and poll the API repeatedly until the answer is ready.

**Answer:** A
**Why:** A streamed response arrives as a sequence of incremental server-sent events; a client that expects one complete JSON body waits for the whole answer, so the first token is never rendered early. Handling each event is exactly what time-to-first-token measures. A longer timeout only makes the user wait longer for the same single render. A smaller model may finish sooner but still returns one body. Disabling streaming and polling adds latency and cost.
**Trap:** sounds-simple
**Task:** 5.2
**Source:** newly written

### Q8
Under a traffic spike, a client receives a burst of 429 responses and immediately retries
every failed request in a tight loop, which raises the request rate and makes the throttling
worse.

**Which approach is most effective?**
A) Retry each 429 immediately in a tight loop until it succeeds.
B) Switch to a smaller model so requests complete before they are throttled.
C) Increase `max_tokens` so each request is less likely to be rejected.
D) Back off with exponential delay and jitter (respecting any `retry-after`) before retrying, since a 429 signals rate limiting rather than a bad request.

**Answer:** D
**Why:** A 429 is a rate-limit signal, so the correct response is to slow down and retry with backoff and jitter, not to retry instantly — immediate retries amplify load and deepen the throttle. Switching models does not change the rate limit, and `max_tokens` is unrelated to throttling. Distinguishing 429 from a 4xx request error is part of the integration layer's job.
**Trap:** sounds-efficient
**Task:** 5.2
**Source:** newly written

### Q9
Finance's cost model, built by counting characters and dividing by four, does not match the
provider bill, and the cache-related line items are unexplained.

**Which approach is most effective?**
A) Estimate cost from the prompt text length, since token counts are proportional to characters.
B) Read the input, output, cache-write, and cache-read token counts from the response `usage` object and bill from those fields as the source of truth.
C) Assume every request consumes the full `max_tokens` value and bill accordingly.
D) Count words in the prompt and multiply by a fixed rate per word.

**Answer:** B
**Why:** The API returns exact token counts — including the cache-write and cache-read fields — in the response `usage` object, and those are the authoritative basis for cost. Character- and word-based estimates are approximations that drift, especially with caching. Assuming full `max_tokens` usage overstates cost, since `max_tokens` is a cap, not a consumption figure.
**Trap:** sounds-pragmatic
**Task:** 5.2
**Source:** newly written

### Q10
A team runs a nightly batch enrichment job (request/response, no interactivity) and an
interactive chat surface. Someone proposes moving both onto a persistent websocket
connection because "real-time is more modern".

**Which approach is most effective?**
A) Move both workloads onto websockets, since a persistent connection is more capable than REST.
B) Move both workloads to polling so neither depends on a long-lived connection.
C) Choose the transport per interaction pattern: request/response (or batch) for the nightly job and a persistent or streaming connection only where interactive push is genuinely needed.
D) Keep one transport for both workloads and tune timeouts until latency is acceptable.

**Answer:** C
**Why:** The transport should match the interaction pattern: batch and tool-calling work fits request/response REST (or the batch API), while persistent and streaming transports fit interactive or push-style integrations. Moving a non-interactive nightly job onto websockets adds connection-management complexity for no benefit; polling everything ignores the interactive case; tuning timeouts does not change the underlying fit.
**Trap:** sounds-enterprise
**Task:** 5.2
**Source:** newly written

### Q11
A team treats the SDK as a black box. When costs are unexplained and retries storm, they
cannot tell whether the fault is the payload, the rate limit, or the server, and someone
proposes discarding the SDK and hand-rolling raw HTTP for full control.

**Which approach is most effective?**
A) Inspect the HTTP request and response the SDK builds — status, headers, body, and `usage` — and handle error classes explicitly, rather than treating the SDK as opaque.
B) Discard the SDK and hand-roll raw HTTP so nothing is hidden.
C) Add a blanket retry on every error so transient failures are covered.
D) Log only the prompt text and infer the cause from the model output.

**Answer:** A
**Why:** The SDKs are thin wrappers over a REST API: they build the request and parse the JSON response, including the usage and error fields. Understanding that layer is what lets you tell a 4xx payload problem from a 429 limit from a 5xx fault and to account for cost. Rewriting raw HTTP adds maintenance for no new information; a blanket retry on all errors retries the ones that will never succeed; logging only the prompt discards the response evidence you need.
**Trap:** sounds-enterprise
**Task:** 5.2
**Source:** newly written

### Q12
A report generator's output sometimes ends abruptly. The response's `stop_reason` is
`"max_tokens"`, and `usage.output_tokens` equals the configured cap.

**Which approach is most effective?**
A) Assume the model is refusing and add a stronger instruction to comply.
B) Lower the temperature so the model stays on task and finishes.
C) Add "please complete the whole report" to the system prompt.
D) Treat it as output truncation: raise `max_tokens` or continue generation, and check `stop_reason` to distinguish a length stop from a natural end.

**Answer:** D
**Why:** A `"max_tokens"` stop reason with output tokens at the cap is unambiguous truncation — the model was cut off, not refusing. The fix is to raise the cap or continue, and to branch on `stop_reason` in the client. Stronger compliance instructions, a lower temperature, and a "finish the report" line do not change a length limit.
**Trap:** sounds-helpful
**Task:** 5.2
**Source:** newly written

### Q13
A malformed tool schema causes the API to return 400 errors. The client retries each
failure with exponential backoff, burning time and never succeeding.

**Which approach is most effective?**
A) Retry all errors with backoff, since retries eventually resolve most failures.
B) Treat 4xx errors (other than 429) as non-retryable and fix the request — the malformed payload — instead, reserving retries for 429 and 5xx.
C) Switch to a different model so the request is accepted.
D) Increase `max_tokens` so the request has room to succeed.

**Answer:** B
**Why:** Error classes drive the retry-versus-fix decision: a 4xx is a client/request problem that fails identically on every retry, so the fix is the payload, while 429 and 5xx are transient and warrant backoff. Blanket retries waste budget on a deterministic failure. A model switch does not repair a malformed schema, and `max_tokens` is unrelated.
**Trap:** sounds-pragmatic
**Task:** 5.2
**Source:** newly written

### Q14
A product sends three workloads to the most capable model: tagging 200,000 messages per day
with one of eight labels, reviewing pull requests, and analysing complex legal clauses where
errors are costly. Cost and latency matter for the tagging.

**Which approach is most effective?**
A) Keep all three on the top model so behaviour stays consistent across workloads.
B) Move all three to the cheapest tier and accept some accuracy loss on the legal analysis to cut cost.
C) Route the high-volume, well-specified tagging to the fast cheap tier, use a balanced mid-tier for code review, and reserve the top tier for the complex legal analysis.
D) Move all three to the cheapest tier and disable extended thinking everywhere to save tokens.

**Answer:** C
**Why:** Match the tier to the task: simple high-volume work fits the fast cheap tier, general production tasks fit the balanced mid-tier, and hard, error-costly reasoning justifies the top tier. One model everywhere pays a premium for capability the tagging cannot use. Cheapest-everywhere, with or without thinking disabled, degrades the workload that needs quality — the "optimise cost by degrading quality" trap.
**Trap:** sounds-simple
**Task:** 5.3
**Source:** newly written

### Q15
A team plans a nuanced reasoning task on the cheapest tier and enables adaptive thinking and
a high effort level, assuming every option is available on every model.

**Which approach is most effective?**
A) Confirm that the required thinking mode and effort level are supported on the chosen tier, and select a tier that supports them for that task, since these options are capability-dependent.
B) Assume all options are available on all tiers and ship; the API will honour whatever is requested.
C) Replace adaptive thinking with temperature 0, which provides the same reasoning depth.
D) Enable every thinking and effort option at once to maximise quality.

**Answer:** A
**Why:** Extended and adaptive thinking and effort levels are not available on every model, so the tier and the feature must be checked together. Assuming universal support leads to settings that are unsupported or silently ignored; temperature does not substitute for thinking depth; stacking every option increases cost without a task-linked reason.
**Trap:** sounds-smart
**Task:** 5.3
**Source:** newly written

### Q16
A new version of the same model tier is released. The team plans to switch immediately and
monitor in production, reasoning that a point release within the same tier cannot change
behaviour.

**Which approach is most effective?**
A) Switch immediately and watch dashboards, since same-tier releases are behaviour-preserving.
B) Switch only for the cheapest workload and leave the rest pinned.
C) Move to the top tier instead, since a more capable model is always safer.
D) Pin the version validated in the eval and re-run the eval against the new version before promoting it, because releases can change behaviour even within the same tier.

**Answer:** D
**Why:** Model releases can change behaviour across versions, so a version bump is treated like a code change: pin, re-evaluate, and promote only if quality holds. Monitoring in production exposes users to an unmeasured change; assuming same-tier equivalence is exactly the assumption the eval exists to test; escalating tiers is not a substitute for measurement.
**Trap:** sounds-pragmatic
**Task:** 5.3
**Source:** newly written

### Q17
A coding assistant sends an identical 20,000-token system prompt and tool-definition block
on every one of thousands of daily requests, with only the user's question changing. The
team wants to lower cost without reducing quality.

**Which approach is most effective?**
A) Cache the user's question on each call, since that is the part that differs.
B) Mark the stable system-and-tools block as cacheable so repeated calls read it at a fraction of the input rate, and keep the changing user question outside the cached prefix.
C) Shorten the system prompt and tool definitions by deleting rules until the token count drops, accepting weaker instructions.
D) Disable caching and lower `max_tokens` so every response is shorter.

**Answer:** B
**Why:** The cost is a large, unchanging prefix sent thousands of times — exactly what prompt caching is for: the write premium is paid once and reads are billed at a small fraction of the input rate. Caching the volatile question writes a cache that is never reused. Deleting rules trades quality for tokens, and disabling caching leaves the big prefix at full price while clipping output hurts answers.
**Trap:** sounds-efficient
**Task:** 5.4
**Source:** newly written

### Q18
A service builds each request from a large document that is unique per user and read once. A
developer proposes marking the whole request cacheable because "caching always lowers cost".

**Which approach is most effective?**
A) Cache the whole request, since caching always reduces cost.
B) Cache a random middle section of the document to capture some of the saving.
C) Recognise that caching pays off only on a stable prefix reused before it expires; when every prefix is unique and read once, skip caching (or cache only genuinely shared material) rather than paying a write premium on every call.
D) Cache everything and set a long expiry so the entries are never evicted.

**Answer:** C
**Why:** A cache write costs a premium over standard input and pays off only if the prefix is read enough times before it expires. A prefix that is unique per request and read once is never reused, so caching adds the write premium with no read benefit — it costs more than it saves. Caching a random section does not create reuse, and a long expiry does not help content that is never requested again.
**Trap:** sounds-helpful
**Task:** 5.4
**Source:** newly written

### Q19
A team caches a 30,000-token prefix that is rewritten every hour and read only a couple of
times before it changes. Their bill went up after enabling caching.

**Which approach is most effective?**
A) Cache more blocks of the prompt so the discount compounds.
B) Cache the model's output as well so repeats are free.
C) Lower the temperature to reduce the number of tokens generated.
D) Stop caching this prefix: a cache write is billed at a premium over standard input and only recovers that premium when the cached prefix is read many times before it expires, so a prefix with few reads per write loses money.

**Answer:** D
**Why:** Caching economics depend on reuse: the write is a premium and the read is a small fraction of input, so a prefix rewritten frequently and read only a couple of times never recovers the write cost. Adding more cached blocks multiplies the premium; caching output is not how prompt caching works; temperature does not affect cache cost.
**Trap:** sounds-efficient
**Task:** 5.4
**Source:** newly written

### Q20
To "avoid ever cutting off an answer", a service sets `max_tokens` to the model's maximum on
every request. Most calls return short answers, but some ramble and the bill is far above
forecast.

**Which approach is most effective?**
A) Set `max_tokens` to a budget tied to the expected output for each call, track input/output/cache tokens from the response, and shape prompts so answers stay within budget.
B) Keep `max_tokens` maxed, since it is only a ceiling and the model stops when it is done.
C) Reduce cost by deleting context from the prompt regardless of what the model needs.
D) Move every request to the cheapest model regardless of the task's quality bar.

**Answer:** A
**Why:** `max_tokens` is a per-request output budget, and an unbounded value invites long, expensive completions; budgeting it against expected output and measuring actual usage is how cost stays predictable. Leaving it maxed relies on the model to self-limit, which it does not always do. Deleting needed context degrades answers, and downgrading every task ignores quality requirements — both are quality-for-cost trades the exam penalises.
**Trap:** sounds-thorough
**Task:** 5.4
**Source:** newly written
