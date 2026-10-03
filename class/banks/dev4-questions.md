# Domain 4 — Eval, Testing, and Debugging (2.6%) — Question Bank (20 questions)

Coverage: 4.1 error taxonomy ×5, 4.1 retry/backoff/stopping ×5, 4.1 structured logging ×5, 4.1 eval/regression ×5.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A service calling the Messages API is throwing a mix of errors under load: 429
`rate_limit_error`, occasional 529 overloaded responses, and — after a bad deploy — a 400
`invalid_request_error` and a 401 `authentication_error`. A teammate wants one retry
policy for all of them so the service "heals itself" without operator involvement.

**Which approach is most effective?**
A) Retry only the 429 and 529 with bounded backoff, and fail fast on the 400 and 401 so the malformed request and the bad credentials surface immediately.
B) Retry all four error types with backoff so the service recovers automatically with no operator involvement.
C) Retry only the 401 (re-authenticating each time) and the 429, and drop the others silently.
D) Fail fast on all four so no extra load is added to the API during the spike.

**Answer:** A
**Why:** Only the transient failures can succeed on a later attempt, so they get backoff retries, while the deterministic client errors must fail fast and stay visible. Retrying all four loops forever on a 400 and a 401, burying the bad request and bad key behind a minute of latency; the 401 needs a corrected credential, not a re-auth retry; failing fast on the 429 and 529 abandons failures a retry would recover.
**Trap:** sounds-simple
**Task:** 4.1
**Source:** newly written

### Q2
A batch job is hitting transient 429 and 529 responses during a brief overload. A
teammate proposes retrying each failed request immediately in a tight loop until it
succeeds, arguing this clears the backlog in the shortest time.

**Which approach is most effective?**
A) Retry immediately in a tight loop until the request succeeds.
B) Use exponential backoff with jitter, honor `Retry-After` when present, bound both attempts and total elapsed time, and fail with context once the budget is exhausted.
C) Apply a single fixed long delay to every failed request, regardless of error type.
D) Retry indefinitely with backoff so a request never returns a failure to the caller.

**Answer:** B
**Why:** Backoff plus jitter eases pressure on the recovering service, `Retry-After` follows the server's own guidance, and a bounded budget makes a persistent outage surface instead of hanging. A tight loop amplifies the very overload causing the 429s and 529s; a fixed delay ignores `Retry-After`, applies the same wait to non-retryable errors, and wastes time; retrying indefinitely pins workers and hides an outage that should have been reported.
**Trap:** sounds-efficient
**Task:** 4.1
**Source:** newly written

### Q3
An intermittent parse failure has been in the backlog for weeks. The logs show only
`JSON decode error` with no payload, so nobody can reproduce the exact call that failed.
A teammate suggests raising log verbosity to DEBUG across the whole application so "more
data shows up somewhere."

**Which approach is most effective?**
A) Raise log verbosity to DEBUG across the whole application so more data shows up somewhere.
B) Wrap the parse step in a try/except that returns an empty object on failure so the pipeline keeps running.
C) Log the raw request and raw response, keyed by a request id, alongside the parsed result so the exact failing call can be replayed.
D) Add a retry around the parse step so a transient bad parse is retried.

**Answer:** C
**Why:** A parse failure hides the real output; without the raw bytes of the request and response you cannot replay the call, and a correlation id lets you find the exact invocation. Broad DEBUG verbosity floods logs without guaranteeing the payload is captured; returning an empty object hides the failure; retrying a parse does not change a deterministic malformed payload.
**Trap:** sounds-helpful
**Task:** 4.1
**Source:** newly written

### Q4
A developer is about to ship a system-prompt change that fixes one customer case. The
last prompt change shipped by the team silently broke a case that used to work, so the
manager wants a real check this time and suggests generating a 5,000-case synthetic suite
with a mandatory perfect score.

**Which approach is most effective?**
A) Ship the change and watch production error rates for a week, rolling back only if users report problems.
B) Generate a large suite of 5,000 synthetic cases and require a perfect score before shipping.
C) Expand the prompt with extra edge-case instructions so nothing is missed.
D) Run a small labelled set of representative cases — including the previously failing one and known edge cases — before and after the change, and gate the release on no regression.

**Answer:** D
**Why:** A small labelled set with a pass criterion, run before and after and compared to a baseline, catches a fix that breaks another case and is cheap enough to actually run each time. A 5,000-case generated suite is expensive to maintain and its aggregate score can mask a single regression; shipping to production is where regressions reach users; a longer prompt is not a test.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

### Q5
A team is standardising how every service retries the Messages API during spikes. A
platform architect proposes adopting a shared enterprise retry framework whose retry
budget is configured centrally, so individual teams never hand-roll a policy.

**Which approach is most effective?**
A) Retry transient failures with exponential backoff plus jitter, honor `Retry-After`, bound attempts and total elapsed time, and fail with context once the budget is exhausted.
B) Adopt the shared enterprise retry framework and let the platform team own the retry budget centrally.
C) Use a fixed delay with no cap so retry latency is predictable.
D) Route every failed request through a dedicated retry queue serviced by a separate worker pool.

**Answer:** A
**Why:** The correct policy is defined by its behaviour — backoff, jitter, honoring server guidance, a hard bound, and a loud end — not by which framework owns it. A centrally configured budget still has to get those mechanics right, and hides them from the team that owns the failure; a fixed uncapped delay ignores `Retry-After` and can hang; a retry queue adds infrastructure without changing what makes a retry safe.
**Trap:** sounds-enterprise
**Task:** 4.1
**Source:** newly written

### Q6
After a transient timeout, an automatic retry re-submitted a payment request and the
customer was charged twice. The team wants to keep retrying transient failures but must
guarantee the side effect can never be applied twice.

**Which approach is most effective?**
A) Disable retries on the payment call entirely so a charge can never be duplicated.
B) Make the retry safe with an idempotency key, so re-submitting the same operation cannot apply the side effect twice.
C) Retry only after a longer delay so duplicates become unlikely.
D) Retry freely and deduplicate duplicate charges downstream in the ledger afterwards.

**Answer:** B
**Why:** Retry only idempotent work, or make it idempotent with an idempotency key so a retry can never duplicate a charge, a ticket, or a sent message. Disabling retries discards recovery for a genuinely transient failure; a longer delay only makes duplication less likely, not impossible; downstream deduplication runs after the customer has already been charged twice.
**Trap:** sounds-smart
**Task:** 4.1
**Source:** newly written

### Q7
A support agent occasionally gets malformed JSON, an occasional refusal, and now and then
wrong tool arguments. The harness treats these the same as a 429: it retries the identical
request with backoff. Success rate has not improved and latency has grown.

**Which approach is most effective?**
A) Keep the backoff retry loop but raise the attempt cap, since output problems are intermittent.
B) Lower the temperature so the model stops producing malformed output.
C) Treat model-output failures as their own class: validate the output, repair or re-ask with a corrective instruction, and do not blindly retry them as transport errors.
D) Catch the parse error and pass the raw text through to the caller.

**Answer:** C
**Why:** Malformed JSON, refusals, and wrong tool arguments are output problems — validate, repair, or re-ask — not transport errors that a blind retry fixes; the identical prompt tends to reproduce them. Raising the cap just retries the same failure more; lowering temperature does not address a refusal or wrong tool arguments and is not a fix; passing raw text through pushes an unvalidated value to the caller.
**Trap:** sounds-pragmatic
**Task:** 4.1
**Source:** newly written

### Q8
A long-context request returns a 400 `request_too_large` / context-length-exceeded error.
An engineer wraps the call in the standard backoff retry used for 429s, expecting it to
get through on a later attempt.

**Which approach is most effective?**
A) Retry the identical request with backoff until it fits.
B) Raise `max_tokens` so the request is accepted.
C) Re-send the same request on a larger-context model.
D) Treat it as a deterministic request error: shorten, summarise, or chunk the input and resend, because the identical request fails identically every time.

**Answer:** D
**Why:** Request-too-large and context-length-exceeded are deterministic client errors — the fix is the request, not a retry, and the recovery is to shorten and resend. Backoff cannot shrink an oversized payload; raising `max_tokens` affects the output budget, not the input length; switching models does not make an over-limit prompt valid for the same context window.
**Trap:** sounds-simple
**Task:** 4.1
**Source:** newly written

### Q9
A batch job's retries made an overload worse: every worker retries on the same fixed
cadence, so they hammer the endpoint at the exact moment it is trying to recover. The
429 rate rose after retries were added.

**Which approach is most effective?**
A) Add jitter to the backoff so workers do not retry in lockstep and re-create the overload.
B) Increase the retry count so every worker eventually gets through.
C) Reduce the base delay so retries happen sooner and clear the backlog faster.
D) Remove the backoff entirely so failed requests are retried as soon as possible.

**Answer:** A
**Why:** Jitter randomises each wait and stops synchronized clients from retrying in lockstep — the thundering-herd that turned the retry loop into the spike. More retries or shorter delays add more concurrent pressure at the worst moment; removing backoff maximises the lockstep hammering that caused the problem.
**Trap:** sounds-efficient
**Task:** 4.1
**Source:** newly written

### Q10
A production agent fails only on the largest 2% of inputs, and the on-call engineer can
see that a call failed but not why: the parsed object looks fine, the error class is
generic, and the request that produced it is gone.

**Which approach is most effective?**
A) Add a broad try/except around the whole loop that logs "request failed" with the error class.
B) Log the raw request and raw response alongside the parsed output, keyed by a correlation id, so a failure on any input still has the exact bytes that produced it.
C) Log only the parsed object so downstream behaviour is visible in the history.
D) Keep logs in memory and dump them only when the process crashes.

**Answer:** B
**Why:** The parsed result is not the payload — a parse or validation failure hides the real output, and without the raw request and response you cannot replay the exact call. A broad handler with a generic message loses the data that matters; logging the parsed object loses the raw bytes that failed to parse; an in-memory buffer dumped on crash loses everything from a failure that did not crash the process.
**Trap:** sounds-helpful
**Task:** 4.1
**Source:** newly written

### Q11
A team is setting up an eval for a structured-output feature. One engineer proposes
testing with the single case that currently fails, arguing that is the whole point of the
change; another wants a huge randomly generated suite.

**Which approach is most effective?**
A) Test only the single failing case, since that is the case the change targets.
B) Generate a large random suite of synthetic inputs and require a high aggregate score.
C) Build a small labelled set of representative cases — including the previously failing case and known edge cases — each with an expected output or an explicit pass criterion.
D) Test only the happy path, since edge cases are rare and cost time.

**Answer:** C
**Why:** A labelled set of representative cases with explicit pass criteria is what makes a change verifiable and catches a regression in a case you did not set out to fix. The single failing case passes the moment the targeted fix lands even if it broke something else; a large random suite is expensive and an aggregate score can hide a single regression; testing only the happy path is not a test of the failure you are trying to fix.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

### Q12
An agent intermittently returns unusable output. The team is unsure whether the fault is
in their own integration layer — bad parameters, a parsing bug, a client timeout — or in
the model's output. A manager suggests escalating straight to the API provider's support
with the failing request id.

**Which approach is most effective?**
A) Escalate to the API provider's support immediately with the failing request id.
B) Add retries across the whole pipeline so any intermittent fault clears on its own.
C) Roll back to the previous model version and see if the errors stop.
D) Trace one request id across the integration layer and the API to isolate whether the fault is bad parameters, parsing, or a timeout on your side, versus malformed model output, and fix the layer that owns it.

**Answer:** D
**Why:** Origin isolation — deciding whether the fault is in your integration layer or in model output — comes first, because the recovery differs completely and a fix in the wrong layer wastes the outage. Escalating before isolating hands the provider a symptom you have not located; blanket retries mask a deterministic bug and inflate cost; a blind rollback discards the evidence and may not address an integration-layer fault.
**Trap:** sounds-enterprise
**Task:** 4.1
**Source:** newly written

### Q13
Under load, the API returns 429 responses with a `Retry-After` header. A developer is
writing the backoff logic and asks how to treat that header, suggesting they ignore it
because it "varies" and instead always add a flat 50% to their own computed delay "to be
safe."

**Which approach is most effective?**
A) Honor `Retry-After` when the server provides it; otherwise use exponential backoff from a small base delay, doubling up to a cap.
B) Ignore `Retry-After` and use a fixed 60-second delay for every failed request, since the header varies.
C) Retry immediately but attach an idempotency key so any duplicate is safe.
D) Ignore `Retry-After` and always add a flat 50% to the computed delay to be safe.

**Answer:** A
**Why:** `Retry-After` is the server telling you exactly how long to wait; honoring it is the most reliable way to stop amplifying the overload, and exponential backoff from a small base up to a cap covers the case where no header is present. A fixed delay over-waits on short limits and under-waits on long ones; ignoring the header and padding your own estimate is a guess the server already answered; retrying immediately re-creates the overload.
**Trap:** sounds-smart
**Task:** 4.1
**Source:** newly written

### Q14
A persistent outage has one worker pinned: it has been retrying a single request with
backoff for forty minutes. The teammate who wrote the loop argues this is correct because
"the request never returns a failure, so nothing upstream has to handle it."

**Which approach is most effective?**
A) Retry forever with backoff so the request never returns a failure to the caller.
B) Bound the retry with both a maximum attempt count and a maximum total elapsed time, then fail loudly with context so a persistent outage surfaces.
C) Cap the attempt count but remove the time bound so a slow success still lands.
D) Retry until a human notices and cancels the job.

**Answer:** B
**Why:** A retry policy is incomplete without a stopping rule: bounding both attempts and total time guarantees that a real outage fails fast with context instead of pinning a worker indefinitely. Retrying forever turns a thirty-second outage into hours of silent hang; a count-only cap can still run for an unbounded time; waiting for a human is not a control, it is the absence of one.
**Trap:** sounds-pragmatic
**Task:** 4.1
**Source:** newly written

### Q15
An agent must return JSON that downstream code parses. Occasionally the model emits
prose around the object or a missing brace, and the parse throws. A teammate proposes
catching the exception and returning an empty object so the application "never crashes on
a bad model day."

**Which approach is most effective?**
A) Wrap the parse in try/except and return an empty object so the application never crashes.
B) Retry the request at a higher temperature until the JSON happens to parse.
C) Validate the response against a schema, and on failure repair it or re-ask with a corrective instruction, logging the raw output so the failure is reproducible.
D) Add "always return valid JSON" to the system prompt and trust the model to comply.

**Answer:** C
**Why:** Validate and repair is the right recovery for an output problem: it produces a usable value, records the raw output for reproduction, and re-asks with a corrective instruction when repair is not possible. Swallowing the error returns a silently wrong empty object and leaves nothing to fix; higher temperature adds nondeterminism without guaranteeing validity; a prompt instruction is probabilistic and will still fail occasionally with no fallback.
**Trap:** sounds-simple
**Task:** 4.1
**Source:** newly written

### Q16
A user-facing endpoint wraps the Messages API call in retries. The team set the attempt
cap very high so that "no request is ever dropped," but p99 latency has tripled because a
slow dependency makes each retry wait before failing.

**Which approach is most effective?**
A) Keep raising the attempt cap so throughput is maximised and requests are never dropped.
B) Remove the cap entirely and let retries run until success.
C) Retry only on the fastest path with no delay between attempts.
D) Keep a modest attempt cap and a total-time budget sized to the caller's latency SLO, so a stuck retry cannot pin a worker past the time the caller is willing to wait.

**Answer:** D
**Why:** A retry budget is sized to the caller's tolerance, not to "never drop anything" — bounding both attempts and total elapsed time keeps p99 within the SLO while still recovering transient failures. A high or absent cap is what tripled latency; retrying with no delay amplifies load and ignores `Retry-After`; throughput is not the metric a user-facing call is judged on.
**Trap:** sounds-efficient
**Task:** 4.1
**Source:** newly written

### Q17
An intermittent failure appears only for one customer and one prompt version, but the
service logs a human-readable sentence per call: "called model, got a response." The team
cannot filter by model, prompt version, or error type to find the pattern.

**Which approach is most effective?**
A) Emit structured fields — a correlation/request id echoing the API's, model and version, every request parameter, prompt version or hash, token usage, stop reason, and latency — so failures can be filtered and aggregated by type, model, or prompt version.
B) Log a clearer human-readable sentence for each call so the team can read the history.
C) Log only errors, to keep log volume down.
D) Log nothing and rely on reproducing the issue locally from the customer's description.

**Answer:** A
**Why:** Structured fields are what let you filter and aggregate failures by type, model, or prompt version and correlate one request id across the integration layer and the API — the whole point of logging for debugging. A clearer prose sentence is still not machine-filterable; logging only errors discards the successful calls that show the pattern around the failure; reproducing from a description is guesswork when you already have the traffic.
**Trap:** sounds-helpful
**Task:** 4.1
**Source:** newly written

### Q18
A prompt change passes the three cases it was written to fix. The engineer plans to ship
it and rely on the next scheduled suite run to catch any problem, arguing the full suite
covers everything anyway.

**Which approach is most effective?**
A) Ship the change now; the next scheduled suite run will catch any problem it caused.
B) Run the labelled set before and after the change, compare the pass rate to the pre-change baseline, and block the release if any previously passing case regresses.
C) Run only the cases the change was meant to fix and ship if they pass.
D) Ship the change and review any suite failures manually after release.

**Answer:** B
**Why:** A regression check is run before the change ships, comparing the new pass rate against the baseline so a fix that breaks another case is caught while it can still be blocked. Relying on the next run means the regression is already in front of users; running only the targeted cases cannot detect the regression by construction; reviewing failures after release is production being used as the test environment.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

### Q19
A team pins no model version and upgrades whenever a new release lands. Historically,
quality regressions after an upgrade were only discovered from a rising production error
dashboard weeks later.

**Which approach is most effective?**
A) Pin the model version forever so behaviour can never change.
B) Rely on the vendor's release notes to flag any breaking changes before upgrading.
C) Re-run the same labelled set on every model or config change and gate the release in CI, so drift is caught before users see it.
D) Build a production error-rate dashboard and watch it closely after each upgrade.

**Answer:** C
**Why:** Re-running the labelled set on model or config changes is exactly how drift is detected before it reaches users, and gating in CI makes the check binding. Pinning forever forfeits new capabilities and is not a fix for evaluating them; release notes describe intent, not the behaviour of your specific cases; a production dashboard is where a regression is discovered after it has already reached users.
**Trap:** sounds-enterprise
**Task:** 4.1
**Source:** newly written

### Q20
A retry budget for a flaky upstream is exhausted for a particular request. The current
code catches the final exception and returns an empty result with HTTP 200, so the caller
"always gets a value." Downstream consumers are now silently processing empty payloads.

**Which approach is most effective?**
A) Keep returning an empty result so the caller always gets a value and never has to handle an error.
B) Log the error at DEBUG level and continue so log volume stays low.
C) Swallow the error and increment a counter that nobody reads.
D) When the budget is exhausted, surface the error with its context — request id, error class, and attempts made — instead of silently returning empty or partial results.

**Answer:** D
**Why:** When the retry budget is gone, the failure must be heard: surfacing it with its context lets the caller decide and keeps the outage visible. Returning an empty success hides a real failure and pushes it into silent downstream corruption; DEBUG logging buries it below the level anyone watches; an unread counter is not an alert.
**Trap:** sounds-pragmatic
**Task:** 4.1
**Source:** newly written
