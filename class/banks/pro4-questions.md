# Domain 4 — Evaluation, Testing & Optimization (16%) — Question Bank (20 questions)

Coverage: 4.1 ×4, 4.2 ×4, 4.3 ×4, 4.4 ×4, 4.5 ×4.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-smart,
sounds-thorough, sounds-simple, sounds-pragmatic.

---

### Q1
A fraud-screening assistant reports 97% precision on its evaluation set and clears launch
review. Two weeks in, the high-value transfer segment — transfers over $50k — produces most
of the confirmed missed-fraud complaints. The overall precision figure has not moved, and
latency and cost are flat.

**Which approach is most effective?**
A) Accept the 97% precision figure as validated, since the model has not changed since review, and treat the complaints as expected noise from a small segment.
B) Re-run the evaluation set; if precision still reads 97%, add a retry loop so flagged-then-cleared transactions are re-scored until they pass.
C) Report precision, recall, and false-negative rate by segment (transfer value band), rebuild the evaluation set to include high-value cases, and state the precision/recall trade-off before deciding.
D) Upgrade to the most capable model so the high-value segment improves, then confirm the overall precision still meets the bar.

**Answer:** C
**Why:** Only the segment-aware response finds the real number, exposes the coverage gap in the evaluation set, and forces an explicit precision/recall decision. Option A trusts an aggregate that has already demonstrably failed and blames the users; Option B's retry loop raises cost and latency while hiding the failure instead of measuring it; Option D upgrades by reflex without measuring the segment first, and re-checking only the overall average repeats the original mistake.
**Trap:** sounds-simple
**Task:** 4.1
**Source:** newly written

### Q2
A team scores a summarization system only with an LLM-as-judge, which rates it 4.6/5.
Downstream consumers nonetheless report broken citation formats and a handful of
unsupported claims. No deterministic checks and no human review exist.

**Which approach is most effective?**
A) Retune the judge prompt until its scores correlate with the consumer complaints.
B) Adopt a mixed methodology: deterministic assertions for what has a right answer (citation format, schema, length), human review for judgment-heavy quality, and model-graded scoring for scale — each method covering the others' blind spots.
C) Drop the LLM-as-judge entirely and route every output through human review so quality is never inferred.
D) Raise the judge to the most capable model and re-score the full set to get more reliable numbers.

**Answer:** B
**Why:** The judge missed format and grounding failures because a single method has blind spots; a mixed methodology covers them. Option A tunes the same flawed instrument to the complaint set rather than adding an independent check; Option C is unusably slow and expensive at scale and still leaves no deterministic format gate; Option D swaps one model-graded method for another, leaving the format and grounding failures undetected.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

### Q3
A support assistant's evaluation set is 500 tickets drawn from the last 30 days of routine,
well-formed English tickets, and it scores 96%. A pilot with a multilingual enterprise
customer produces frequent failures on short, code-switched, and adversarial tickets that
never appear in the set.

**Which approach is most effective?**
A) Add more routine tickets to the set so the sample size is larger and the 96% is more statistically stable.
B) Lower the pass threshold so the current set reflects real-world conditions more fairly.
C) Add a retry loop in production so unusual tickets are resubmitted until they produce acceptable output.
D) Rebuild the evaluation set as a versioned golden set that deliberately includes the hard, rare, and adversarial cases — multilingual, code-switched, malformed — and measure results by segment.

**Answer:** D
**Why:** The set measures the wrong population, so only rebuilding it to include the cases that actually fail — and reporting by segment — makes the number honest. Option A grows the easy majority and reinforces the blind spot; Option B moves the bar instead of improving the system; Option C masks the failures with retries while inflating cost and latency.
**Trap:** sounds-pragmatic
**Task:** 4.1
**Source:** newly written

### Q4
An internal agent that reads documents and executes actions is evaluated on task accuracy
and latency only; both are excellent. A red-team exercise shows a crafted document can make
the agent ignore its instructions and call a destructive tool. Leadership asks how to close
the gap.

**Which approach is most effective?**
A) Add explicit security and safety metrics — prompt-injection resistance, unauthorized-action rate, and data-leakage checks — to the evaluation set and gate releases on them alongside accuracy and latency.
B) Add a few prompt-injection examples to the training documentation and re-run the existing accuracy evaluation.
C) Stand up a dedicated safety-review subagent that inspects every response before it is returned to the user, so unsafe outputs are filtered.
D) Increase the retry count so a request that produces a suspicious action is regenerated until it looks safe.

**Answer:** A
**Why:** Accuracy and latency are two of five metric classes, and the untested classes are exactly where the red-team finding lives; the fix is to define and gate on safety and security metrics. Option B leaves them unmeasured; Option C adds a costly component without a metric to prove it works or a gate to stop the release; Option D hides unsafe actions behind retries instead of measuring them.
**Trap:** sounds-enterprise
**Task:** 4.1
**Source:** newly written

### Q5
A team replaces a summarization prompt and rolls it to 100% of production because it scored
8% higher on the offline evaluation set. Within three days the support escalation rate climbs
20% — the new summaries are more fluent but drop the policy exceptions agents relied on.

**Which approach is most effective?**
A) Roll the prompt back only for the customers who complained, and keep the new prompt everywhere else.
B) Revert to the previous prompt, then run a controlled A/B test with a randomly assigned control group, judging the variant on the primary metric plus guardrail metrics such as escalation rate, latency, and cost.
C) Keep the new prompt and add a second model pass that re-checks each summary for missing policy exceptions before it is shown.
D) Roll the new prompt out to a small percentage of traffic and watch the overall average quality score.

**Answer:** B
**Why:** Offline scores are a hypothesis, not evidence, and the change silently regressed a guardrail the business depends on; a controlled test judged on the primary metric plus guardrails is the proof. Option A leaves the regression in place for everyone who did not complain; Option C adds cost and latency to patch a symptom rather than testing the change; Option D keeps watching a blended average that would not reveal the escalation regression.
**Trap:** sounds-efficient
**Task:** 4.2
**Source:** newly written

### Q6
Quality has dropped, and an engineer proposes to fix it by upgrading the model tier,
rewriting the retrieval chunking, and adding a new system prompt — all in one release, since
each change is believed to help.

**Which approach is most effective?**
A) Ship all three changes together and roll back the whole release if quality does not improve.
B) Ship all three but add extensive logging so the team can infer afterwards which change mattered.
C) Change one variable at a time against a stable control, measuring the full metric set after each, so the effect of every change is attributable.
D) Ship only the model upgrade, since the other two changes are cheaper to defer indefinitely.

**Answer:** C
**Why:** Bundling three changes makes attribution impossible, so a win cannot be kept and a regression cannot be located; one variable at a time against a control preserves attribution. Option A can only accept or reject the bundle; Option B collects data it cannot disambiguate because the variables moved together; Option D abandons two candidate fixes without measuring them.
**Trap:** sounds-efficient
**Task:** 4.2
**Source:** newly written

### Q7
A variant raises measured answer accuracy from 88% to 93% on the golden set. The team wants
to ship immediately, but p95 latency rises from 1.2s to 3.4s, crossing the 2s interactive SLA
the product depends on. No control group was run; the accuracy number comes from the offline
set.

**Which approach is most effective?**
A) Ship it — a five-point accuracy gain outweighs a latency regression, and users will adapt to slower responses.
B) Ship it but add a loading spinner and a progress message so the extra latency feels shorter.
C) Trim the golden set to the cases the variant handles well so the accuracy gain is reported more cleanly.
D) Hold the rollout: the change regresses a guardrail the business depends on, so run a controlled test, measure accuracy and p95 latency together, and ship only a variant that clears both the primary metric and the SLA.

**Answer:** D
**Why:** An optimisation that lifts accuracy while breaking the interactive SLA has not improved the system, and the offline number is unproven without a control. Option A trades a business-critical guarantee for a metric in isolation; Option B disguises the regression rather than resolving it; Option C corrupts the evaluation set to make the result look better.
**Trap:** sounds-helpful
**Task:** 4.2
**Source:** newly written

### Q8
A team is three weeks into an A/B test of a new retrieval strategy. Early data shows a small
accuracy gain but a growing cost per task; the engineer who built the change wants to let it
run to significance regardless. There is no pre-agreed rule for when to stop.

**Which approach is most effective?**
A) Define the kill criteria and guardrail thresholds the test should have had up front — the cost and latency ceilings that trigger a stop — and decide against those numbers rather than continuing open-endedly.
B) Let the test run until the accuracy difference reaches statistical significance, then decide, since cost can be optimised later.
C) Stop the test now and ship the change, because an accuracy gain is the goal and the cost increase is small in absolute terms.
D) Extend the test indefinitely and add a second variant so the comparison set is richer.

**Answer:** A
**Why:** Without pre-agreed kill criteria the decision drifts to whoever is most attached to the change; setting cost and latency ceilings makes the stop condition objective. Option B commits to running past a guardrail breach; Option C ships without evidence and ignores the cost trend; Option D expands a test that has already lost its stop rule.
**Trap:** sounds-pragmatic
**Task:** 4.2
**Source:** newly written

### Q9
A policy assistant built on RAG begins giving confident but incorrect answers about refund
eligibility right after the source document library is re-indexed. The model version,
temperature, and latency are all unchanged from the week before.

**Which approach is most effective?**
A) Upgrade to a larger model, since confident errors usually mean the current model is under-powered.
B) Investigate the retrieval stage first — inspect which chunks the re-index is returning for the failing queries, and check for stale, missing, or mis-chunked documents — before changing the prompt or model.
C) Add a system-prompt instruction telling the model never to state eligibility unless it is certain.
D) Raise the temperature so the model explores more of the retrieved context before answering.

**Answer:** B
**Why:** A quality drop that tracks a data change, with model version and latency unchanged, points at retrieval — the model is faithfully grounding its answer in bad chunks. Option A changes the wrong layer by reflex; Option C patches the symptom with a probabilistic instruction; Option D is backwards, since higher temperature increases variance and does not fix ungrounded context.
**Trap:** sounds-smart
**Task:** 4.3
**Source:** newly written

### Q10
A data-extraction assistant is instructed to return a JSON object with a fixed schema. Audits
show roughly one in ten responses wraps the JSON in prose, sometimes adds extra keys, and
occasionally returns valid JSON that violates the required types. The retrieved source
documents are correct in every failing case.

**Which approach is most effective?**
A) Replace the model with a more capable tier so it follows the schema more reliably.
B) Add a retry loop that re-sends any response that fails to parse until valid JSON is returned.
C) Treat it as a prompt/format-enforcement failure: tighten the instruction and apply a structured-output constraint so the schema is enforced, then re-measure the format-failure rate.
D) Post-process every response with a regex that strips the prose wrapper before the JSON is parsed.

**Answer:** C
**Why:** The retrieved context is correct and the failures are format violations, so the defect is prompt and format enforcement — enforce the schema rather than ask for it. Option A changes the model when the model is not the cause; Option B masks the failures and inflates cost and latency; Option D strips the wrapper but leaves the extra keys and type violations untouched.
**Trap:** sounds-simple
**Task:** 4.3
**Source:** newly written

### Q11
A reasoning-heavy assistant must reconcile multi-page contracts. On the failing cases the
retrieved context is correct and the prompt is unambiguous, yet the answers miss multi-step
dependencies. The same failing inputs, run through a more capable model tier, produce correct
answers.

**Which approach is most effective?**
A) Rewrite the prompt to be longer and more emphatic, since more instruction should fix the misses.
B) Add few-shot examples of correct multi-step reasoning so the current model can imitate them.
C) Accept the failures as edge cases and add a retry loop for low-confidence answers.
D) Diagnose it as a model mismatch: the task exceeds the deployed tier's capability, so route these cases to the capable tier and confirm the fix on the same failing inputs, stating the cost/latency trade-off.

**Answer:** D
**Why:** The controlled comparison already shows the capability gap — same inputs, capable tier succeeds — so the diagnosis is a model mismatch and the fix is routing with the trade-off named. Option A and Option B change the wrong layer, since the prompt was unambiguous and retrieval was correct; Option C leaves the failures in place and adds cost.
**Trap:** sounds-simple
**Task:** 4.3
**Source:** newly written

### Q12
A nightly batch job fails on about 6% of records. The current handling re-runs each failed
record up to five times and reports success if any attempt passes. Over a quarter, cost has
risen sharply and the same records keep failing — the retries succeed only intermittently and
the underlying cause has never been found.

**Which approach is most effective?**
A) Stop masking the failure: capture the failing records and the pipeline stage where each breaks, localize the cause (retrieval, prompt, or model), and fix that stage so the record passes deterministically.
B) Raise the retry count to ten so more records eventually pass.
C) Lower the batch's success threshold so a record is marked complete after fewer attempts.
D) Move the retry loop inside the model call so failures are handled faster.

**Answer:** A
**Why:** Retry-until-it-passes hides an unreproducible cause while inflating cost and latency; the fix is to localize the failing stage and repair it. Option B and Option C both lean harder on the masking mechanism; Option D relocates the retries without finding the cause.
**Trap:** sounds-efficient
**Task:** 4.3
**Source:** newly written

### Q13
To hit a 40% cost-reduction target, all traffic is moved to the smallest model tier. Cost per
task falls 42% and average latency improves, but golden-set accuracy for the complex-contract
segment falls from 90% to 73% while the overall average still looks acceptable.

**Which approach is most effective?**
A) Keep the change — the overall average meets the bar, and complex contracts are a small share of traffic.
B) Keep the change but add a retry loop for complex contracts so weak answers are regenerated until they pass.
C) Measure per segment and route by task difficulty — fast tier for simple requests, capable tier for complex contracts — then report the cost/quality trade-off with the measured numbers.
D) Upgrade the entire workload to the largest model so no segment is under-served, accepting the higher cost.

**Answer:** C
**Why:** The saving is real where the fast tier holds quality and a failure where it does not, so the answer is to measure by segment and route on that evidence, preserving both objectives. Option A accepts a hidden segment failure because the average looks fine; Option B masks the regression with retries while inflating latency and cost; Option D abandons the cost objective and over-provisions.
**Trap:** sounds-helpful
**Task:** 4.4
**Source:** newly written

### Q14
Every request sends the same 6,000-token policy document and 2,000-token system prompt before
a short, varying user question. Latency and cost are both over budget, and the static portion
never changes between calls.

**Which approach is most effective?**
A) Truncate the policy document to its first 1,000 tokens so each request carries less text.
B) Place the static system prompt and policy document first and enable prompt caching, so the repeated prefix is served cheaper and faster with no change to output quality.
C) Move the policy document into a few-shot example block so it is processed differently.
D) Switch to the smallest model tier so the whole request is cheaper regardless of the prefix.

**Answer:** B
**Why:** A stable, repeated prefix is exactly what prompt caching is for: it cuts cost and latency with no quality change. Option A discards policy content the task may depend on; Option C relocates the same tokens without caching them; Option D changes model capability to fix a token-cost problem, trading quality for a saving caching would have delivered for free.
**Trap:** sounds-efficient
**Task:** 4.4
**Source:** newly written

### Q15
A document-QA assistant is given the entire 200-page manual on every query. Answer quality on
questions whose evidence sits mid-document is noticeably worse than for evidence near the
start or end, and token cost is high. A proposal is to double the context window to fit even
more.

**Which approach is most effective?**
A) Double the context window so all pages fit with more room, since a larger window cannot hurt.
B) Keep the full manual but move it to the end of the prompt so the model reads it last.
C) Compress the manual into a single dense paragraph so it uses fewer tokens.
D) Retrieve and include only the passages relevant to the query, trimming the context so the model reasons over a focused set — improving quality and cost together.

**Answer:** D
**Why:** A bloated context costs tokens and degrades quality through the lost-in-the-middle effect, so trimming to the relevant passages helps both metrics. Option A adds cost and worsens the middle-loss; Option B shuffles the ordering without reducing the dilution; Option C compresses aggressively and risks discarding the evidence the answer needs.
**Trap:** sounds-smart
**Task:** 4.4
**Source:** newly written

### Q16
A team runs two workloads: an interactive chat assistant that users wait on, and an overnight
job that re-scores historical records with no deadline. To cut cost, a proposal suggests
batching both workloads through the batch API.

**Which approach is most effective?**
A) Batch only the overnight re-scoring job, which has no latency SLA, and keep the interactive assistant on the real-time path; report the latency/cost trade-off for each.
B) Batch both workloads so the cost saving applies everywhere.
C) Keep both workloads real-time so no user ever waits longer, and absorb the cost.
D) Batch the interactive assistant only, since users are already used to occasional delays.

**Answer:** A
**Why:** Batching trades latency for cost, so it is sound only where no one is waiting — the overnight job — and wrong where it blocks a user. Option B applies the saving to a workload that cannot absorb the latency; Option C abandons a legitimate cost win; Option D batches the one workload that must not be batched.
**Trap:** sounds-simple
**Task:** 4.4
**Source:** newly written

### Q17
A production assistant's dashboards show 99.9% uptime and flat average latency for three
months. After an upstream model update, output quality on one customer segment degrades for
three weeks before anyone notices — because the only monitored signals are availability and
average latency.

**Which approach is most effective?**
A) Add more frequent uptime probes and a tighter latency alert so anomalies surface sooner.
B) Add structured per-request logging (prompt and model version, retrieved IDs, token counts, cost, outcome, trace ID), end-to-end tracing by stage, continuous sampling and scoring of output quality, and segment-level drift alerts.
C) Ask customers to report bad outputs through a feedback form so regressions are caught by the people who notice them.
D) Pin the model to a fixed version and stop monitoring, since the version can no longer change.

**Answer:** B
**Why:** The failure was in output quality, which nothing was watching; logging, tracing, quality sampling, and segment-level alerts monitor the thing that actually broke. Option A strengthens the two signals that stayed green; Option C outsources detection to users who see the damage only after the fact; Option D removes one drift source but monitoring nothing is not observability and cannot catch retrieval or data drift.
**Trap:** sounds-thorough
**Task:** 4.5
**Source:** newly written

### Q18
A vendor silently updates a model version behind an unchanged API alias. The team's dashboards
stay green, and the only way they eventually learned of the change was a customer complaint
about a shift in tone and factuality.

**Which approach is most effective?**
A) Add a note to the runbook asking engineers to check the vendor's release notes weekly.
B) Switch to the largest model so version changes matter less.
C) Log and pin the exact model version on every request, alert on any version change, and include the model version in the quality-sampling records so drift becomes visible rather than silent.
D) Rely on the vendor's status page and trust that breaking changes will be announced.

**Answer:** C
**Why:** A silent external change is only visible if the version is recorded and monitored; pinning plus alerting turns an invisible drift into a detectable event. Option A depends on a human remembering to look; Option B changes capability without making the change observable; Option D trusts an external process that already failed.
**Trap:** sounds-enterprise
**Task:** 4.5
**Source:** newly written

### Q19
A monitoring system alerts whenever the global average quality score drops more than 2 points.
A regression in the medical-terminology segment cuts that segment's score by 20 points, but
its share of traffic is small enough that the global average moves only 0.4 points, so no
alert fires for two weeks.

**Which approach is most effective?**
A) Lower the global alert threshold to 0.2 points so smaller shifts trigger an alert.
B) Increase the sample size of scored outputs so the global average is more sensitive.
C) Alert on uptime and cost instead, since those are more stable signals.
D) Add segment-level alerting — monitor each segment's quality against its own threshold — so a small segment's regression fires even when the blended average barely moves.

**Answer:** D
**Why:** The blended average is precisely what hid the failure, so the fix is to alert per segment against segment thresholds. Option A makes the global alert noisier without addressing the masking; Option B sharpens a statistic that is structurally blind to the segment; Option C swaps in signals unrelated to output quality.
**Trap:** sounds-simple
**Task:** 4.5
**Source:** newly written

### Q20
A multi-stage pipeline (retrieve → rerank → generate → post-process) produces a wrong answer.
The team has aggregate dashboards but no way to see which stage introduced the error; each
stage logs only its own summary, with no shared identifier linking a single request's stages
together.

**Which approach is most effective?**
A) Add end-to-end tracing with a shared trace ID per request and stage-level spans, so a failure can be attributed to the specific stage that introduced it.
B) Add more dashboards showing each stage's average latency and throughput.
C) Add a retry loop after generation so obviously wrong answers are regenerated.
D) Ask the model to explain its reasoning so the error can be read from the output.

**Answer:** A
**Why:** Without a request-level identifier the stages cannot be correlated, so tracing with a shared trace ID is what makes attribution possible. Option B adds aggregate views that still cannot follow one request; Option C masks the error rather than locating it; Option D inspects only the generation stage and cannot reveal an upstream retrieval or rerank fault.
**Trap:** sounds-thorough
**Task:** 4.5
**Source:** newly written
