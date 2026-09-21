# Domain 4 — Question Bank (20 questions)

Covers tasks 4.1–4.6 of the CCAF exam guide. 4.1 ×3, 4.2 ×3, 4.3 ×4, 4.4 ×3, 4.5 ×4, 4.6 ×3.
Ten questions are reused from `timothywarner-practice-60q.md` (Claude Code for CI scenario); ten are newly written and grounded in `dnacenta-domains/d4-prompt-engineering.md`, `hamzafarooq-cheatsheets/domain4.md`, `04-api-and-product-faq.md`, `paullarionov-guide_en.md` and `daronyondem-study-guide.md`.

---

### Q1

An automated review analyses comments and docstrings. The prompt says "check that comments are accurate and up to date". Findings regularly flag acceptable patterns such as TODO markers and simple descriptions, while missing comments that describe behaviour the code no longer implements.

**Which approach is most effective?**

A) Include `git blame` data so Claude can identify comments that predate recent code changes.
B) Add few-shot examples of misleading comments so the model recognises similar patterns in this codebase.
C) Filter TODO, FIXME and descriptive comment patterns before analysis to reduce noise.
D) Specify explicit criteria: flag a comment only when the behaviour it claims contradicts the code's actual behaviour.

**Answer:** D
**Why:** The root cause is an undefined target criterion, not a formatting problem. Explicit categorical criteria define what qualifies and what does not, which removes both the false positives on acceptable patterns and the misses on genuinely misleading comments. Examples fix output shape, filtering narrows the symptom, and comment age is not the criterion.
**Trap:** sounds-smart
**Task:** 4.1
**Source:** reused from timothywarner-practice-60q.md (Q22)

---

### Q2

False-positive rates vary widely by finding category: security and correctness findings run at 8%, performance at 18%, style and naming at 52%, documentation at 48%. Developer surveys show growing distrust — many now dismiss findings without reading, saying "half are wrong".

**Which approach is most effective?**

A) Temporarily disable the high-false-positive categories and keep only the high-precision categories while their prompts are improved.
B) Keep all categories enabled but display a confidence score with each finding so developers can decide what to investigate.
C) Keep all categories enabled and add few-shot examples to improve accuracy for each category over the next few weeks.
D) Apply a uniform strictness reduction across all categories to bring the overall false-positive rate down.

**Answer:** A
**Why:** High false positives in some categories destroy trust in the accurate ones, so the immediate fix is to remove the noisy categories from output instead of leaving them on screen while accuracy improves slowly. Disabling also buys the space to iterate on those criteria before re-enabling. A uniform strictness reduction trades away the true positives in the accurate security and correctness categories.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** reused from timothywarner-practice-60q.md (Q29)

---

### Q3

A review bot's prompt says "report only high-confidence findings" and "use your best judgment on severity". Across runs the same null-dereference risk is rated critical in one PR and low in the next, and developers say they cannot predict what will be reported. The team wants findings that are stable and defensible.

**Which approach is most effective?**

A) Add a five-level severity rubric written in prose so the model has finer granularity to choose from.
B) Have the model emit a 0–1 confidence score per finding and act only on scores above 0.8.
C) Define explicit categorical criteria for what to flag and what to skip, and anchor each severity level with a concrete code example.
D) Lower temperature to 0 so severity ratings are deterministic across runs.

**Answer:** C
**Why:** Vague confidence adjectives produce inconsistent results; categorical criteria plus code-anchored severity definitions give the model a boundary it can apply the same way each run. A prose rubric sounds thorough but still drifts, and both the threshold and the temperature change treat a definition problem as a randomness problem.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

---

### Q4

Automated reviews find real issues, but developers report the feedback is not actionable — phrases like "complex ticket routing logic" or "potential null pointer" with no indication of what to change. Adding the instruction "always include concrete fix suggestions" still produces output that is sometimes detailed and sometimes vague.

**Which approach is most effective?**

A) Refine the instructions further with more explicit requirements for each part of the feedback format.
B) Expand the context window to include more surrounding code so the model has enough information to propose concrete fixes.
C) Split into a two-pass approach where one prompt identifies issues and a second generates fixes.
D) Add 3–4 few-shot examples showing the exact required format: identified issue, location in code, concrete fix suggestion.

**Answer:** D
**Why:** Few-shot examples are the most effective technique when instructions alone produce variable output, because they demonstrate the required shape concretely rather than describing it abstractly. The scenario has already shown that more instructions do not converge; wider context does not constrain the shape of the feedback; and a two-pass split still relies on instruction-only prompting in each pass.
**Trap:** sounds-thorough
**Task:** 4.2
**Source:** reused from timothywarner-practice-60q.md (Q20)

---

### Q5

A function must transform API responses into an internal normalised format. After two iterations the output still does not match expectations — fields are nested differently and timestamps are formatted incorrectly. The requirements were given in prose, and the model interprets them differently each time.

**Which approach is most effective?**

A) Write a JSON schema describing the expected output structure and validate the model's output against it after each iteration.
B) Provide 2–3 concrete input-output examples showing the expected transformation for representative API responses.
C) Rewrite the requirements with more technical precision: exact field mappings, nesting rules and timestamp format strings.
D) Ask the model to explain its current understanding of the requirements to identify where interpretations diverge.

**Answer:** B
**Why:** Concrete input-output examples remove the ambiguity that prose cannot, giving an unambiguous pattern for field nesting and timestamp format that generalises to new responses. A schema validates structure after the fact and does not teach the transformation; more precise prose uses the channel that already misfired twice; restating the understanding diagnoses the gap without supplying the ground truth.
**Trap:** sounds-smart
**Task:** 4.2
**Source:** reused from timothywarner-practice-60q.md (Q31)

---

### Q6

An extraction pipeline for research summaries receives documents in mixed shapes: some cite sources inline, some in a bibliography, some state figures only in narrative prose. Field audits show invented citation years and figures attached to the wrong source. Precision-focused instructions such as "extract only values stated in the source" have not reduced the rate.

**Which approach is most effective?**

A) Add 2–4 few-shot examples showing complete input-output pairs for each document structure, including the reasoning for each extraction.
B) Add 10 examples drawn from the most common document type so more cases are covered.
C) Add a `do_not_fabricate` boolean field to the schema that the model must set to true.
D) Retry any extraction that fails validation up to three times with the same prompt.

**Answer:** A
**Why:** Few-shot examples that span varied document structures reduce hallucination because the model learns the shape of a valid extraction across formats instead of inventing data to fit the schema. Ten examples of one structure overfit to that structure; a boolean flag is a declaration rather than a demonstration; and retrying the same request does not change what the model understood.
**Trap:** sounds-thorough
**Task:** 4.2
**Source:** newly written

---

### Q7

A shared intake service receives invoices, receipts, purchase orders and contracts, and no reliable document classifier exists. Each document type has its own extraction tool with its own schema. Prompt-based JSON requests sometimes return prose and sometimes drop fields. The team needs guaranteed schema-conformant output for every document, without knowing the type in advance.

**Which approach is most effective?**

A) Force `tool_choice: {"type": "tool", "name": "extract_invoice"}` so the model always returns a schema-conformant object.
B) Keep `tool_choice: "auto"` and add "always respond with valid JSON" to the system prompt.
C) Set `tool_choice: "any"` so the model must call one of the extraction tools, then parse and validate the returned `tool_use.input` against that tool's schema.
D) Use one generic `analyze_document` tool with a free-text field and post-process the output into the per-type structure.

**Answer:** C
**Why:** `any` guarantees a tool call while letting the model choose the tool that fits the document, which is the correct pattern when the type is unknown and several schemas exist. A named tool routes every document through one schema that fits most of them; `auto` still allows an escape into prose; and a generic free-text tool reintroduces the inconsistent output shape the pipeline is trying to remove.
**Trap:** sounds-simple
**Task:** 4.3
**Source:** newly written

---

### Q8

An invoice extractor marks `purchase_order_number` and `payment_terms` as required in its tool schema with `strict: true`. About 30% of invoices in the corpus do not carry a PO number. Field-level audits show the extractor returns plausible-looking PO numbers for exactly those documents, and downstream reconciliation fails.

**Which approach is most effective?**

A) Add "do not fabricate values" to the extraction prompt while keeping both fields required.
B) Increase the retry limit so the model has more attempts to locate the PO number.
C) Run a second LLM call to verify every extracted PO number against the source.
D) Make both fields nullable — `type: ["string", "null"]` — and instruct the model to return null when the source does not state the value.

**Answer:** D
**Why:** A required field whose value is often absent is a fabrication factory: required guarantees something will be present, not that it is true. Nullable fields let the first call signal absence directly, which is cheaper and more honest than a verification pass that adds cost and can rationalise the original answer. Prompt wording cannot override structural pressure, and more retries produce more fabrications rather than more accuracy.
**Trap:** sounds-thorough
**Task:** 4.3
**Source:** newly written

---

### Q9

Support-ticket classification uses a strict enum of `["billing", "technical", "account", "other"]`. Over a quarter, 22% of tickets land in `other` with no explanation, so analysts cannot tell whether a ticket is a genuinely ambiguous case or a category the taxonomy does not cover. New categories appear roughly monthly.

**Which approach is most effective?**

A) Expand the enum each time a new category appears and redeploy the schema.
B) Instruct the model to choose the closest existing category rather than `other`.
C) Keep the enum and add "report only high-confidence classifications" to the prompt.
D) Add an `"unclear"` enum value for ambiguous cases and a paired `category_detail` free-string field that captures the source's own wording when the value is `other`.

**Answer:** D
**Why:** `unclear` gives an ambiguous case an honest option instead of a forced wrong bucket, and `other` plus a detail field handles the long tail without rewriting the schema every month. Expanding the enum per category is a maintenance treadmill, forcing the closest category manufactures misclassifications, and a confidence adjective adds no boundary.
**Trap:** sounds-simple
**Task:** 4.3
**Source:** newly written

---

### Q10

An extraction service uses `strict: true` with `additionalProperties: false`, and the output always validates against the schema. Even so, 4% of invoices report a `total_amount` that does not equal the sum of the line items, and due dates occasionally appear under `invoice_date`.

**Which approach is most effective?**

A) Add domain validation in application code and extract both `stated_total` and `calculated_total` so the mismatch is detectable automatically.
B) Add `minimum`, `maximum` and `pattern` constraints to the schema so the values themselves are constrained.
C) Switch from `tool_use` to prompt-based JSON so the model has more freedom to correct itself.
D) Fine-tune the model on the invoice corpus to eliminate the arithmetic and placement errors.

**Answer:** A
**Why:** Strict mode guarantees syntax, not semantics — type, presence and enum errors are caught, but arithmetic and field placement are not. Extracting both totals makes the discrepancy machine-detectable instead of silently trusting one value. `minimum`, `maximum` and `pattern` are not supported in strict mode, prompt-only JSON is less reliable than the schema already in place, and fine-tuning is a heavy intervention for a validation-layer gap.
**Trap:** sounds-smart
**Task:** 4.3
**Source:** newly written

---

### Q11

A batch extraction over 8,000 contracts requires `governing_law` and `termination_notice_days` on every document. Validation rejects 900. Sampling shows 700 of those contracts simply do not state a governing law; the other 200 use a date format the schema rejects.

**Which approach is most effective?**

A) Retry all 900 failed documents three more times with the same prompt.
B) Raise the retry limit from 3 to 10 for the failed documents.
C) Retry the 200 format failures with the source document, the failed extraction and the exact validation error, and accept null for the 700 documents where the value is genuinely absent.
D) Route all 900 failed documents to human review.

**Answer:** C
**Why:** The failures are two different populations and must be treated differently. Retry-with-feedback recovers output errors because the error message tells the model what specifically went wrong, while information that is absent from the source is not recoverable by retrying and needs a nullable field instead. Retrying everything produces fabrications, and escalating everything discards the majority that a targeted fix resolves.
**Trap:** sounds-thorough
**Task:** 4.4
**Source:** newly written

---

### Q12

A code review bot's findings are dismissed by developers 35% of the time, but the team cannot tell which categories drive the dismissals. Prompt changes are currently guesswork, and the dismissal rate has not moved.

**Which approach is most effective?**

A) Ask the model to self-report a confidence score per finding and suppress everything below 0.8.
B) Add "be conservative" to the review prompt.
C) Insert a second filtering pass before the findings reach developers.
D) Add `detected_pattern` and `rule_id` fields to each finding so dismissal rates can be aggregated by code construct and the over-reporting criteria revised.

**Answer:** D
**Why:** Without a field naming the construct that triggered each finding, the team can only see "35% are dismissed" and cannot tell which criteria to tighten; with it, the black box becomes a measurable system and prompt changes follow evidence. Self-reported confidence is unreliable for routing, and both a filtering pass and a vaguer instruction reduce what developers see without improving the underlying criteria.
**Trap:** sounds-efficient
**Task:** 4.4
**Source:** newly written

---

### Q13

An extraction endpoint fails JSON-schema validation for an unknown share of requests. The current handler retries the identical request up to three times, which rarely succeeds.

**Which approach is most effective?**

A) Increase the retry count and add exponential backoff around the same request.
B) Escalate to a larger model on the third attempt.
C) Resend the original document, the failed extraction and the specific validation error, and ask for a corrected call.
D) Set temperature to 0 before retrying so the same input cannot produce a different error.

**Answer:** C
**Why:** Retry-with-feedback is far more effective than a blind retry because the model receives signal about what specifically went wrong and can correct exactly that. More attempts, a bigger model or a lower temperature all change the conditions rather than supplying the missing diagnosis.
**Trap:** sounds-simple
**Task:** 4.4
**Source:** newly written

---

### Q14

A code review component is iterative: the model analyses the changed file, requests related files (imports, base classes, tests) through a tool, receives the results, and continues analysis before giving final feedback. The team is evaluating batch processing to reduce API cost.

**Which approach is most effective?**

A) Proceed with batch processing; the batch API provides `custom_id` for correlating the extra tool-call requests with their responses.
B) Keep the workflow on the synchronous API, because the asynchronous batch model cannot execute a tool mid-request and return results for the model to continue analysis.
C) Proceed with batch processing; the batch API accepts tool definitions in request parameters, which is all the workflow requires.
D) Proceed with batch processing, accepting that the up-to-24-hour latency is slow for pull request feedback even though the workflow would otherwise function.

**Answer:** B
**Why:** A batch request is fire-and-forget: there is no mechanism to intercept a tool call during a request, execute it, and return the result so the model continues in the same interaction. The workflow cannot function on batch at all, so latency is not the primary constraint. The batch API does carry `custom_id` and does accept tool definitions — the block is executing those tools mid-request.
**Trap:** sounds-pragmatic
**Task:** 4.5
**Source:** reused from timothywarner-practice-60q.md (Q18)

---

### Q15

A CI/CD system runs three analyses: fast style checks on every PR that block merging until completion; a comprehensive weekly security audit of the entire codebase; and nightly test-case generation for recently changed modules. The Message Batches API offers 50% savings but can take up to 24 hours. The team wants to reduce API cost without hurting developer experience.

**Which approach is most effective?**

A) Use the Message Batches API for all three tasks to maximise the 50% savings, with the pipeline polling for batch completion.
B) Use synchronous calls for the PR style checks and the Message Batches API for the weekly audit and the nightly test generation.
C) Use synchronous calls for all three tasks for consistent response times, relying on prompt caching to reduce cost across workloads.
D) Use synchronous calls for the PR style checks and the nightly test generation, and the Message Batches API only for the weekly audit.

**Answer:** B
**Why:** Match the API to whether something is waiting. The style check is a blocking gate that must stay synchronous, while the weekly audit and nightly generation are scheduled, deadline-flexible workloads that can absorb the batch window and take the discount. Batching the gate stalls merges for up to 24 hours, keeping everything synchronous forfeits savings on the delay-tolerant work, and excluding nightly generation leaves the same savings on the table.
**Trap:** sounds-efficient
**Task:** 4.5
**Source:** reused from timothywarner-practice-60q.md (Q19)

---

### Q16

A CI pipeline has two review modes: a pre-merge-commit hook that blocks the merge until completion, and a "deep analysis" that already runs overnight, polls for batch completion, and posts suggestions to the PR. The team wants to use the Message Batches API, which offers 50% savings and requires polling, to reduce cost.

**Which approach is most effective?**

A) Only the pre-merge-commit hook.
B) Only the deep analysis.
C) Both modes.
D) Neither mode.

**Answer:** B
**Why:** The deep analysis already runs overnight, tolerates delay and uses a polling model, which matches the asynchronous batch architecture exactly and captures the discount. The pre-merge hook blocks the merge, so a batch window of up to 24 hours would stall every PR, and running both inherits that stall for no additional benefit.
**Trap:** sounds-efficient
**Task:** 4.5
**Source:** reused from timothywarner-practice-60q.md (Q21)

---

### Q17

Two workflows currently use synchronous calls: a blocking pre-merge check that must complete before developers can merge, and a technical-debt report generated overnight for review the next morning. The manager proposes moving both to the Message Batches API to save 50%.

**Which approach is most effective?**

A) Move both to batch processing with a fallback to synchronous calls if the batches take too long.
B) Move both workflows to batch processing with status polling to verify completion.
C) Use batch processing only for the technical-debt report and keep synchronous calls for the pre-merge check.
D) Keep synchronous calls for both workflows to avoid any issues with batch result ordering.

**Answer:** C
**Why:** The 24-hour window with no latency SLA is acceptable for an overnight report and unacceptable for a gate that developers are waiting on, so the correct answer is the mixed strategy rather than all-or-nothing. A synchronous fallback still places the blocking job in the batch queue first, polling does not shorten the window, and avoiding batch entirely forfeits savings that the overnight report tolerates well. Result ordering is not a real constraint, because results are joined by `custom_id`.
**Trap:** sounds-efficient
**Task:** 4.5
**Source:** reused from timothywarner-practice-60q.md (Q30)

---

### Q18

Non-obvious issues — performance optimisations that break edge cases, cleanups that unexpectedly change behaviour — are only caught when another team member reviews the PR. The generation reasoning shows the model considered these cases and concluded its own approach was correct.

**Which approach is most effective?**

A) Run a second independent instance to review the changes without access to the generator's reasoning.
B) Enable extended thinking for the generation stage so the model deliberates more thoroughly before producing suggestions.
C) Add self-review instructions to the generation prompt asking the model to critique its own suggestions before finalising.
D) Include full test files and documentation in the prompt context so the model better understands expected behaviour during generation.

**Answer:** A
**Why:** The model retained the reasoning context that produced the output and stayed biased toward its own conclusions, so the fix is a fresh instance with no generation history — the same reason human peer review works. More deliberation on the same chain of reasoning preserves the bias, self-critique instructions are the rationalisation loop that already failed, and extra context does not break a single-perspective bias.
**Trap:** sounds-thorough
**Task:** 4.6
**Source:** reused from timothywarner-practice-60q.md (Q17)

---

### Q19

A pull request changes 14 files in an inventory module. A single-pass review produces inconsistent results: detailed feedback on some files, shallow comments on others, missed obvious bugs, and contradictory feedback where a pattern is flagged in one file and identical code is approved in another in the same PR.

**Which approach is most effective?**

A) Run three independent full-PR review passes and flag only issues that appear in at least two of the three runs.
B) Split into focused passes: review each file individually for local issues, then run a separate integration-oriented pass for cross-file data flows.
C) Require developers to split large PRs into submissions of 3–4 files before running automated review.
D) Switch to a larger model with a bigger context window so it can pay sufficient attention to all 14 files in one pass.

**Answer:** B
**Why:** Per-file passes fix attention dilution by giving every file consistent depth, and the separate integration pass covers cross-file interactions that a per-file view cannot see. Three full-PR passes multiply cost while carrying the same dilution, forcing developers to split PRs moves the problem to humans, and a larger context window does not change how attention is distributed across 14 files.
**Trap:** sounds-thorough
**Task:** 4.6
**Source:** reused from timothywarner-practice-60q.md (Q27)

---

### Q20

A review agent produces findings, and a second agent is meant to mark findings that are already fixed or merely speculative before anything is posted. The team proposes reusing the original session: the reviewing agent asks the same agent that produced the findings to re-examine them and drop the weak ones. Precision does not improve.

**Which approach is most effective?**

A) Run the verification pass in a separate instance with no access to the generation reasoning, passing only the artifact and the review criteria.
B) Ask the original agent to write a justification for each finding before it finalises.
C) Raise the threshold applied to the original agent's self-reported confidence scores.
D) Give the original agent more codebase context so it can re-evaluate its own findings.

**Answer:** A
**Why:** The instance that produced the findings keeps the reasoning that produced them, so it is the wrong reviewer regardless of how it is instructed — an independent instance with only the artifact and the criteria catches subtle issues the original rationalised away. A written justification is still self-critique, and both the confidence threshold and the extra context leave the same single perspective in place.
**Trap:** sounds-thorough
**Task:** 4.6
**Source:** newly written