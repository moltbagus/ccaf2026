# Domain 2 — Claude Models, Prompting & Context Engineering (13%) — Question Bank (20 questions)

Coverage: 2.1 ×2, 2.2 ×2, 2.3 ×2, 2.4 ×2, 2.5 ×2, 2.6 ×2, 2.7 ×2, 2.8 ×2, 2.9 ×2, 2.10 ×1, 2.11 ×1.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A media platform runs two pipelines. One tags roughly five million clips a day under a 200 ms
p95 latency SLA and a fixed per-item cost ceiling. The other produces a monthly editorial risk
review of long-form content that a lawyer signs off on. The CTO proposes running both on the
most capable model "so quality is never the bottleneck."

**Which approach is most effective?**
A) Run both pipelines on the most capable model, since one consistent configuration avoids a second setup.
B) Route the high-volume tagging to the fast, cheap tier and the editorial risk review to the most capable tier, tuning thinking effort per route.
C) Run both on the fast, cheap tier — if tagging passes quality, the review will too.
D) Run both on the mid-tier with thinking disabled so the tagging SLA is met.

**Answer:** B
**Why:** Capability is not the binding constraint on five million well-specified tags — the SLA and the cost ceiling are — so the capable-everywhere answer inflates cost and latency for no gain, while the review's constraint is quality and it earns the top tier. C puts the hardest judgment on the weakest tier; D collapses two different constraints into one and disables the reasoning the review depends on.
**Trap:** sounds-enterprise
**Task:** 2.1
**Source:** newly written

### Q2
A planning route in a scheduling agent is missing correct multi-step dependencies. The route
already runs on the mid-tier workhorse, and the team wants better reasoning without moving to a
larger, slower, costlier model that would breach the service's cost ceiling.

**Which approach is most effective?**
A) Switch the whole service to the largest model so every route reasons more deeply.
B) Shorten the system prompt so fewer instructions compete for the model's attention.
C) Add chain-of-thought examples to every route, including the high-volume extraction route.
D) Raise thinking effort on the planning route only, keeping the mid-tier model and the other routes unchanged.

**Answer:** D
**Why:** On models that support adaptive thinking, reasoning depth is a per-route dial, so the planning route buys more reasoning without climbing to a bigger model and breaching the cost ceiling. A pays the top-tier price across all traffic for a fix one route needs; B trades a capability problem for a prompt-size change; C bloats routes that never needed reasoning and makes the prompt cache-hostile.
**Trap:** sounds-smart
**Task:** 2.1
**Source:** newly written

### Q3
A bank runs a single assistant on one global model tier for three routes: high-volume
transaction categorisation (cost- and latency-bound), customer-facing summaries
(quality-sensitive), and a nightly fraud-pattern analysis that a risk officer reviews. Ops
reports the categorisation route is blowing the cost ceiling while fraud analysis keeps missing
subtle patterns.

**Which approach is most effective?**
A) Route each workload to the tier its own constraint demands — fast and cheap for categorisation, the most capable tier for fraud analysis — and keep summaries on a balanced tier.
B) Move everything to the fast, cheap tier and rely on retrieval to supply the missing judgment.
C) Move everything to the most capable tier so no route is under-served.
D) Keep one global tier but raise temperature on the fraud route so it explores more.

**Answer:** A
**Why:** The two failures have opposite causes — over-provisioning the cheap route and under-provisioning the hard one — which a single global tier cannot fix; per-route selection matches each constraint. B starves the judgment-heavy route; C over-spends on the volume route; D confuses sampling randomness with reasoning depth.
**Trap:** sounds-pragmatic
**Task:** 2.2
**Source:** newly written

### Q4
A well-specified field-extraction route pulls dates, amounts, and IDs from clean invoices against
a fixed JSON schema. It currently runs on the most capable model, costs are rising, and evals
show the fast tier matches it on this schema. The schema and inputs are stable and unambiguous.

**Which approach is most effective?**
A) Keep the most capable model, since extraction errors are expensive to fix downstream.
B) Keep the most capable model but reduce the input by truncating each invoice to its first page.
C) Downgrade this route to the fast, cheap tier — the task is well-specified and evals confirm parity — while reserving the capable tier for routes where judgment binds.
D) Downgrade every route to the fast tier at once so cost savings are maximised.

**Answer:** C
**Why:** When a route is well-specified and evals show the cheaper tier matches, the capability upgrade buys nothing and the cost ceiling is the binding constraint; the change should be scoped to the route the evidence covers. A pays for capability the task does not use; B drops content that may hold fields; D generalises a route-specific eval to routes it never measured.
**Trap:** sounds-efficient
**Task:** 2.2
**Source:** newly written

### Q5
A legal-tech assistant drafts contract summaries. Its system prompt is a 2,000-token block of
adjectives — "be accurate, be conservative, be helpful" — and reviewers complain that
out-of-scope requests (tax advice, litigation strategy) are answered anyway, while in-scope
summaries come out inconsistently.

**Which approach is most effective?**
A) Add more adjectives so the model has a stronger sense of the desired tone.
B) Restructure the system prompt as a contract — role and scope, explicit criteria for what is in and out of scope with boundary examples, an output format, and refusal/escalation behaviour — and enforce the hard boundaries outside the prompt.
C) Move the entire policy block into a few-shot example so the model treats it as a pattern.
D) Switch to a larger model, since it will follow the existing instructions more reliably.

**Answer:** B
**Why:** Adjectives are interpreted differently on every call; explicit criteria plus boundary examples produce consistent behaviour, and an out-of-scope refusal is a control best enforced at the guardrail layer. A compounds the vagueness; C does not make reference content more reliable and breaks the cacheable prefix; D treats capability as a substitute for a clear contract.
**Trap:** sounds-helpful
**Task:** 2.3
**Source:** newly written

### Q6
A healthcare assistant must never surface a patient's full record when answering a scheduling
question. The team has written "never reveal protected health information" three times in the
system prompt, in different words, to be safe.

**Which approach is most effective?**
A) Keep the repeated prompt lines and add a fourth, more emphatic version.
B) Move the three lines into the tool description so the model sees them at call time.
C) Rely on the model's safety training rather than any explicit rule.
D) State the boundary once in the system prompt as explicit criteria, and enforce it with an output filter and field-level redaction in the guardrail layer.

**Answer:** D
**Why:** A prompt is a request, and repetition does not turn it into a control; a regulated never-reveal requirement needs enforcement outside the model, so an output filter and redaction close the gap. A burns tokens on the same instruction; B relocates a control into a suggestion; C removes the contract entirely and trusts probabilistic behaviour.
**Trap:** sounds-simple
**Task:** 2.3
**Source:** newly written

### Q7
A regulated assistant must never output unredacted account numbers, and an existing output filter
already redacts them. A new requirement adds "never give investment advice." The proposed change
is a second output filter that also scans for account numbers, plus a prompt rule for advice.

**Which approach is most effective?**
A) Add a refusal-and-escalation rule for advice to the system prompt, enforce it with a dedicated guardrail that routes advice-seeking requests to a human, and leave the existing account-number filter as the single control for that risk.
B) Add the second account-number filter as well, for defense in depth.
C) Put both rules in the system prompt and remove the account-number filter to simplify the pipeline.
D) Raise the model tier so it follows the advice rule more reliably.

**Answer:** A
**Why:** The missing risk is investment advice, so the change adds a control for it; a second account-number filter duplicates a control already in place, raising cost and false positives with no new risk reduction. C converts a regulated control into a suggestion; D mistakes capability for an enforcement layer.
**Trap:** sounds-thorough
**Task:** 2.4
**Source:** newly written

### Q8
A financial assistant already has an input validator that rejects malformed requests and an output
filter that redacts PII. A new policy forbids the assistant from executing trades. Compliance
proposes adding three more PII redaction passes "to be safe" alongside a trade-refusal rule.

**Which approach is most effective?**
A) Add the three extra redaction passes and the trade-refusal rule together.
B) Handle trade refusal only in the system prompt and skip the guardrail.
C) Add the trade-refusal control — a dedicated guardrail that blocks trade-execution requests and escalates — while leaving the existing PII and input controls untouched as the single controls for their risks.
D) Remove the input validator so the new trade guardrail has fewer controls to coordinate with.

**Answer:** C
**Why:** Close the actual gap (trade execution) with a control, and do not stack duplicates of controls you already own — extra PII passes add cost and false positives without reducing risk. B makes a hard requirement a prompt suggestion; D removes a working control.
**Trap:** sounds-enterprise
**Task:** 2.4
**Source:** newly written

### Q9
A support-triage classifier returns the right label for obvious tickets but misroutes about twenty
percent of borderline cases — calling a billing dispute a refund request. Output is always valid
JSON, and the category definitions are already in the prompt.

**Which approach is most effective?**
A) Add a chain-of-thought instruction so the model reasons before labelling.
B) Add three to four few-shot examples showing borderline tickets on both sides of the boundary, each explaining why it belongs to its category.
C) Switch to the largest model so it classifies more accurately.
D) Replace the definitions with longer descriptions and ask the model to use its best judgment.

**Answer:** B
**Why:** The failure is a boundary-definition gap — the format is valid and the definitions are present — and few-shot examples with near-misses teach where the line sits. A adds reasoning the task does not need at a latency cost; C reaches for capability to fix a definitional gap; D substitutes prose and "best judgment" for the boundary the model is missing.
**Trap:** sounds-smart
**Task:** 2.5
**Source:** newly written

### Q10
A reconciliation agent must total disputed charges across several invoices and confirm the
arithmetic balances. Its current zero-shot prompt returns confident totals that do not add up,
and the model is on a tier that supports adaptive thinking.

**Which approach is most effective?**
A) Add two few-shot examples of correctly totalled disputes.
B) Truncate the invoices to reduce the numbers the model has to hold.
C) Ask the model to output only the final total, with no intermediate steps, so it commits to one number.
D) Ask for the reasoning before the answer and raise thinking effort on this route so the model works through the intermediate steps.

**Answer:** D
**Why:** The symptom is a multi-step arithmetic failure, which chain-of-thought or higher thinking effort addresses; on thinking-capable models, raising effort is preferred over hand-writing "step by step." A's examples do not teach the computation; B drops data the total depends on; C removes exactly the intermediate work that makes the arithmetic checkable.
**Trap:** sounds-helpful
**Task:** 2.5
**Source:** newly written

### Q11
An extraction service returns clean, well-specified fields from structured forms. A separate
classification service on the same pipeline mislabels a subset of ambiguous requests, while a
summarisation route produces multi-step counts that are sometimes wrong. The team wants one
prompt template to cover all three.

**Which approach is most effective?**
A) Match the technique to each symptom: keep the extraction route zero-shot with an output schema, add few-shot boundary examples to classification, and add chain-of-thought or higher thinking effort to the summarisation route.
B) Stack all three techniques — examples, "think step by step," and a schema — on every route to cover every case.
C) Use few-shot examples on all routes, since examples never hurt.
D) Use chain-of-thought on all routes so every task reasons before answering.

**Answer:** A
**Why:** Each route fails differently, so each needs the technique its symptom calls for; stacking all three bloats tokens, makes the prompt cache-hostile, and still leaves the format problem unsolved. C adds examples where a schema is the fix; D adds reasoning to well-specified tasks that do not need it.
**Trap:** sounds-simple
**Task:** 2.6
**Source:** newly written

### Q12
A downstream service cannot parse a summarisation route's output: it sometimes emits prose,
sometimes bullet lists, sometimes a partial JSON object. The model is given the instruction
"return the summary clearly."

**Which approach is most effective?**
A) Add three few-shot examples of the desired output to every route.
B) Add "think step by step about the format" before answering.
C) Replace the vague instruction with an explicit output contract — a fixed JSON schema with required fields and types — so the format is unambiguous.
D) Switch to the largest model so it infers the format more reliably.

**Answer:** C
**Why:** The symptom is an inconsistent format, which an explicit output contract or schema fixes deterministically; "return it clearly" is the vague instruction that caused it. A's examples help a boundary, not a schema gap; B reasons about a format the prompt never defined; D guesses at an unstated format.
**Trap:** sounds-thorough
**Task:** 2.6
**Source:** newly written

### Q13
A document-analysis agent concatenates the full conversation, all retrieved chunks, and the
current question into one prompt in arrival order. Answers degrade as the session grows, and the
cache hit rate is near zero. The team proposes buying a larger context window.

**Which approach is most effective?**
A) Buy the larger window so all the content fits without truncation.
B) Order the prompt stable-first — frozen system prompt, deterministically ordered tool list, reference documents — and put the volatile content (current question, timestamps, per-request IDs) last, so the cacheable prefix stays intact.
C) Rewrite the system prompt with stronger instructions to focus on the relevant content.
D) Interleave stable and volatile content so the model sees variety.

**Answer:** B
**Why:** The problem is context quality and cache structure, not capacity; ordering stable-first preserves the byte-stable prefix and puts the question where the model can act on it. A admits more irrelevant content and dilutes attention; C rewrites the instruction when the arrangement of context is the fault; D destroys the cacheable prefix deliberately.
**Trap:** sounds-pragmatic
**Task:** 2.7
**Source:** newly written

### Q14
A policy assistant must answer questions from a 400-page handbook. It currently loads the whole
handbook on every call, hitting the cost ceiling and slowing responses, and the team proposes
truncating the handbook to its first 1,000 tokens to cut tokens.

**Which approach is most effective?**
A) Truncate the handbook to the first 1,000 tokens to reduce cost.
B) Keep loading the full handbook but move it after the user question.
C) Switch to the smallest model so the full handbook is affordable.
D) Retrieve or select only the sections relevant to the question instead of truncating, so the answer keeps the passage it depends on.

**Answer:** D
**Why:** Trimming by relevance removes tokens that carry no signal while preserving the passage the answer needs; blind truncation silently drops the policy paragraph the answer depended on. A is the truncation anti-pattern; B reorders but keeps the cost; C changes the model to afford content that should not be there.
**Trap:** sounds-efficient
**Task:** 2.7
**Source:** newly written

### Q15
A retrieval assistant answers policy questions from an internal knowledge base. After a large
document refresh it returns confident but wrong answers; latency and the model version are
unchanged. The team proposes increasing the context window and rewriting the system prompt.

**Which approach is most effective?**
A) Investigate the retrieval and indexing step first — check for stale or mismatched chunks after the refresh — before touching the window or the prompt.
B) Increase the context window so the correct document is more likely to be included.
C) Rewrite the system prompt to answer only from retrieved documents.
D) Move the reference documents into few-shot examples so they are always present.

**Answer:** A
**Why:** The regression tracks a content change, not a capacity or instruction change, so the first move is to inspect what was retrieved — a better prompt cannot answer from a chunk that was never retrieved correctly. B treats an accuracy drop as a capacity problem; C rewrites the instruction when the model was fed wrong context; D bloats every request with non-cacheable content.
**Trap:** sounds-helpful
**Task:** 2.8
**Source:** newly written

### Q16
A support agent's answers get worse as its conversation grows, even though the questions
themselves are simple. Each turn appends the full ticket history, every retrieved article, and the
entire knowledge base index. Management proposes upgrading to a model with a much larger context
window.

**Which approach is most effective?**
A) Upgrade to the larger window so nothing is ever dropped.
B) Keep the current model but raise temperature so it ignores irrelevant content.
C) Keep the context to the smallest set that holds the signal — recent turns, the articles that answer the question, and a progressive index fetched on demand — rather than admitting more content.
D) Load the knowledge base index into a few-shot block so it is always available.

**Answer:** C
**Why:** A bigger window does not fix a context-quality problem — performance degrades as irrelevant content crowds the prompt, so the goal is the smallest context that contains the signal. A admits more noise; B confuses sampling with focus; D bloats every request with a non-cacheable block.
**Trap:** sounds-enterprise
**Task:** 2.8
**Source:** newly written

### Q17
A platform sends the same 8,000-token system prompt and policy document on every request,
followed by a short, varying user message. Cost and latency are both concerns. The team has
enabled prompt caching but has not changed how the prompt is assembled.

**Which approach is most effective?**
A) Truncate the policy document to the first 1,000 tokens to cut cost.
B) Place the static system prompt and policy first, keep the volatile user message after the last cache breakpoint, and put the breakpoint on the static block so the prefix is byte-stable.
C) Move the policy document into a few-shot example block so it is reused.
D) Switch to the smallest model so the shared prefix is affordable.

**Answer:** B
**Why:** Caching keys on an exact prefix, so the static content must be front-loaded and byte-stable with the breakpoint on the static block, letting reads cost a fraction of normal input. A drops content the answer may need; C is not a cacheable, reusable prefix; D changes the model instead of the structure.
**Trap:** sounds-efficient
**Task:** 2.9
**Source:** newly written

### Q18
The same 600-token compliance policy block has been copy-pasted into twenty different prompt
templates across the platform. A recent regulation change required editing all twenty, and two
were missed.

**Which approach is most effective?**
A) Add a reminder in each template to keep the policy in sync with the source of truth.
B) Move the policy block into each template's few-shot examples so it is embedded.
C) Increase the context window so the duplicated policy has room in every template.
D) Modularise the prompt into composable, versioned blocks — role, policy, task template, output schema — and package stable domain knowledge and procedures as Skills so the policy lives in one place.

**Answer:** D
**Why:** The root cause is duplication that drifts; a single versioned block or Skill keeps one source of truth so updates propagate. A is a reminder that already failed; B embeds a copy in each template; C gives the duplication more room rather than removing it.
**Trap:** sounds-pragmatic
**Task:** 2.9
**Source:** newly written

### Q19
A service sends a fixed 6,000-token system prompt and tool definitions with every request, then a
short user message. Prompt caching is enabled, but `cache_read_input_tokens` is zero on every
call and latency is unchanged.

**Which approach is most effective?**
A) Find the byte that changes on every request — a timestamp or session ID in the system prompt, or a tool list whose order varies — so the prefix becomes stable.
B) Conclude the model tier does not support caching and switch tiers.
C) Disable thinking, since caching only takes effect once thinking is off.
D) Move the system prompt into the first user turn, since caching applies only to user messages.

**Answer:** A
**Why:** Zero reads across repeated requests mean the prefix never matched, which points at a volatile field inside the supposedly stable prefix. B assumes caching is a per-tier toggle; C conflates unrelated settings; D rests on a false premise — the cacheable prefix is exactly the system and tool content.
**Trap:** sounds-simple
**Task:** 2.10
**Source:** newly written

### Q20
An architect must justify a single Domain 2 design across a service with three routes: a
latency-bound classifier, a cost-bound extractor, and a quality-bound reasoner that share one
prompt template and one cache prefix.

**Which approach is most effective?**
A) Standardise on the largest model and one long prompt so every route is covered.
B) Standardise on the smallest model and one short prompt so the cost ceiling holds for all routes.
C) Fit each strategy to its route's constraint — the tier to the failure cost and SLA, the technique to each route's symptom, the context to the signal, and a shared byte-stable prefix that all three can cache — then verify with evals.
D) Enable caching everywhere and assume the savings will absorb the cost of running every route on the top tier.

**Answer:** C
**Why:** Every Domain 2 decision follows its binding constraint — model to failure cost and SLA, technique to symptom, context to signal — and reuse works only on the genuinely stable prefix. A over-spends on the cheap routes; B starves the reasoner; D treats caching as free and assumes it can fund an unjustified tier choice.
**Trap:** sounds-smart
**Task:** 2.11
**Source:** newly written
