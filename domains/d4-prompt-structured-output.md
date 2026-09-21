# Domain 4 — Prompt Engineering & Structured Output (20%) — Master Note

Exam framing: 60 multiple-choice questions, 120 minutes, passing score 720 on a 100–1000 scale, no guessing penalty. This domain is 20% and covers tasks 4.1–4.6. Questions are scenario stems: a production situation, then "which approach is most effective?". Wrong options are engineered traps that sound smart, efficient, thorough, helpful, simple, pragmatic, or enterprise, but violate a documented principle.

Primary scenarios: Scenario 5 (Claude Code for CI/CD) and Scenario 6 (Structured Data Extraction).

---

## Task index

| Task | One-line principle | Exam tell |
|------|--------------------|-----------|
| 4.1 | Define what to flag, what to report, and what to skip — in categories, with code anchors for severity. | Stem says "inconsistent judgement" or "developers distrust the findings"; an option contains *conservative*, *careful*, or *high-confidence* without a categorical definition. |
| 4.2 | Few-shot examples (2–4, with reasoning) fix consistency; more instructions do not. | "Despite detailed instructions, output is inconsistent" or "duplicate/empty fields across varied documents". |
| 4.3 | `tool_use` + JSON schema eliminates syntax errors only; schema design (nullable, `unclear`, `other`) prevents fabrication. | Malformed JSON, missing fields, values invented for absent source data, heterogeneous document types. |
| 4.4 | Retry with the specific validation error feeds back output errors; schema design handles source gaps. | A failure rate on validation, a mix of format errors and genuinely absent data, a bot whose findings are dismissed. |
| 4.5 | Blocking work is synchronous; latency-tolerant single-shot work is batch. Batch is 50% off, up to 24h, no SLA, no in-request tool loop, joined by `custom_id`. | "Reduce API cost", "manager proposes moving everything to batch", "the job polls overnight", "the workflow calls tools mid-request". |
| 4.6 | An instance that produced output must not review it; large reviews split per-file then cross-file. | "Claude reviewed its own work and missed it", "14 files, inconsistent depth", "second opinion", "confidence threshold". |

---

## Task 4.1 — Designing Prompts with Explicit Criteria to Improve Accuracy

- **Principle**: Replace vague instructions with explicit categorical criteria. For every judgement the model must make, define what qualifies, what does not qualify, and give examples showing the boundary.
- **Principle**: Explain adversarial cases in the same structure — e.g. flag when a comment's claimed behaviour contradicts the code; do not flag comments that are merely incomplete or could be more detailed.
- **Principle**: Anchor severity levels with real code examples, not prose. Prose definitions of severity drift across runs; code anchors do not.
- **Principle**: A high false-positive rate in one category destroys trust in all categories, including the accurate ones. Developers dismiss the whole report.
- **Principle**: The fix is to temporarily disable the noisy category entirely while improving its criteria, then re-enable. Do not tighten in place, because the noise keeps flowing while you iterate.
- **Why the exam wants this**: This is the recurring "instructions exist but the output is unpredictable" stem. The tested distinction is categorical vs adjectival. Any option whose content is a confidence adjective or a threshold is a distractor.
- **Distractors**:
  - "Lower the confidence threshold for that category" — keeps the noise flowing; the category stays untrustworthy.
  - "Add more instructions to the prompt for that category" — more prose does not create a boundary.
  - "Lower the temperature" — deterministic bad criteria are still bad criteria; judgement is not a randomness problem.
  - "Add a five-level severity rubric described in prose" — sounds thorough, fails because it has no code anchors.
  - "Apply a uniform strictness reduction across all categories" — suppresses true positives in the accurate categories.
- **Exact terms**: no API surface — this task is prompt content. The mandatory structure is three categories: what to flag, what to report, what to skip.
- **Scenario tie-in**: CI/CD code review (the review bot that developers stop reading), and severity calibration in the review findings schema.

---

## Task 4.2 — Using Few-shot Prompting to Improve Output Consistency

- **Principle**: Few-shot examples are the most effective technique for output consistency. Not more instructions, not confidence thresholds, not temperature changes.
- **Principle**: Use 2–4 targeted examples on ambiguous scenarios. Not 1, not 10. Ten examples on solved cases wastes context and can overfit.
- **Principle**: Each example shows input, output, and the reasoning for why that output is correct over plausible alternatives. Reasoning is what makes the pattern generalise to novel cases.
- **Principle**: Three deployment triggers: detailed instructions alone produce inconsistent formatting; the model makes inconsistent judgement calls on ambiguous cases; extraction produces empty or null fields for information that exists in the document.
- **Principle**: Few-shot reduces hallucination in extraction when examples cover varied document structures — inline citations vs bibliographies, narrative prose vs tables, informal units. The model learns the shape of a valid extraction instead of inventing data to fit the schema.
- **Principle**: For strict schemas, pair the schema with format normalisation rules in the prompt (ISO-8601 dates, numeric amount plus currency code, decimal fractions). The schema validates types; the prompt specifies formats.
- **Why the exam wants this**: the stem will already have failed the cheap fixes (more instructions, more examples of the wrong kind, temperature). The correct option names 2–4 targeted examples with rationale, or examples across varied structures.
- **Distractors**:
  - "Add more detailed step-by-step instructions covering all edge cases" — instructions grow linearly, edge cases grow combinatorially.
  - "Add 10 diverse examples" — wrong count; targeted beats broad.
  - "Add few-shot examples of the problem pattern" when the failure is an undefined criterion — examples fix format, not an undefined target.
  - "Lower temperature to 0 and take the union of two runs" — determinism is not a judgement problem.
  - "Add a `do_not_fabricate` boolean to the schema" — sounds smart, but a flag is not a demonstration.
- **Exact terms**: no API surface. Count is 2–4; each example carries its rationale.
- **Scenario tie-in**: CI review findings that are sometimes actionable and sometimes vague; extraction from documents with mixed citation styles and informal measurement units.

---

## Task 4.3 — Enforcing Structured Output with `tool_use` and JSON Schemas

- **Principle**: `tool_use` with a JSON schema is the most reliable way to get structured output. It eliminates JSON syntax errors — malformed JSON, missing braces, trailing commas. That is the entire guarantee.
- **Principle**: It does **not** guarantee semantic correctness. Three persistent failure modes survive: semantic errors (line items do not sum to the total), field placement errors (right value, wrong field), and fabrication (invented values for required fields).
- **Principle**: Strict mode requires `additionalProperties: false` on every object and every property listed in `required`. Because `required` is not optional in strict mode, the anti-fabrication move is to make the field nullable — `type: ["string","null"]` — and instruct the model to return null when the source does not state the value.
- **Principle**: An all-required schema is a fabrication factory. *Required* guarantees something will be present, not that it is true.
- **Principle**: `tool_choice` has four settings: `"auto"` (model may answer in text), `"any"` (must call some tool, model picks which), `{"type": "tool", "name": "..."}` (must call this specific tool), `"none"` (cannot call tools).
- **Principle**: Use `"any"` when several extraction tools exist and the document type varies — guaranteed structured output without pre-selecting the schema. Use a named tool only to mandate a specific first step or a single-tool workflow.
- **Principle**: An enum without an escape hatch creates validation failures when new categories keep appearing. Add `"other"` plus a paired `_detail` string field to capture the source's own wording, and `"unclear"` so an ambiguous case has an honest option instead of a forced wrong bucket.
- **Why the exam wants this**: the highest-yield task in the domain. Distractors are wrong-layer answers — asking the prompt to do what the schema must do, or asking the schema to do what validation code must do.
- **Distractors**:
  - "Use tool_use with all fields required to guarantee complete extractions" — fabrication factory.
  - "Add 'do not fabricate' to the prompt while leaving the field required" — the prompt cannot override structural pressure.
  - "Use tool_use so the line items sum to the total" — schemas do not do arithmetic.
  - "Force `{"type": "tool", "name": "extract_invoice"}` for documents of unknown type" — a named tool routes heterogeneous documents through one schema that fits none of them.
  - "Use `tool_choice: "auto"` when structured output is required" — lets the model escape into prose.
  - "Add `minimum`, `maximum`, `pattern`, or `minLength` to the schema" — numeric range, string length, and regex constraints are not supported in strict mode; they belong in validation code.
  - "Use prefill to start the assistant turn with `{`" — assistant prefill is removed on modern models.
- **Exact terms**:
  - `tool_use`, `input_schema`, `tool_choice`, `strict: true`, `additionalProperties: false`, `required`.
  - `output_config.format` with `{"type": "json_schema", "schema": {...}}` for a direct JSON answer.
  - `client.messages.parse()` wraps `output_config.format`, validates against a Pydantic or Zod schema, and returns `response.parsed_output`.
  - The top-level `output_format` parameter is deprecated; the `structured-outputs-2025-11-13` beta header is no longer required.
  - Supported in strict mode: `type`, `properties`, `required`, `enum`, `const`, `items`, `anyOf`/`allOf`, `$ref`/`$defs`, `additionalProperties: false`, `format` (date-time, date, time, duration, email, hostname, uri, ipv4, ipv6, uuid).
  - Not supported: `minimum`/`maximum`/`multipleOf`, `minLength`/`maxLength`, `pattern`/`patternProperties`, `oneOf`, `if`/`then`/`else`, recursive schemas, `additionalProperties` set to anything other than `false`.
  - Assistant message prefilling returns HTTP 400 on Opus 5, Sonnet 5, Fable 5, and the 4.6/4.7/4.8 family. Use `output_config.format` instead.
  - Structured outputs and API-level citation features are hard to combine, because citations need interleaved citation blocks and a JSON schema needs constrained JSON. Put `source_location` and `source_quote` fields in the schema instead.
- **Scenario tie-in**: the Structured Data Extraction scenario — invoices, contracts, maintenance reports, and a shared intake service receiving documents of unknown type.

---

## Task 4.4 — Implementing Validation, Retries, and Feedback Loops for Extraction Quality

- **Principle**: On validation failure, resend three things: the original document, the failed extraction, and the specific validation error. A targeted correction beats a blind retry, and far beats `temperature: 0`, which only removes variability without addressing the mismatch.
- **Principle**: The retry boundary is the most-tested concept in this task. Retry is effective for format mismatches, structural errors, misplaced values, locale-formatted numbers, and datetimes that need truncating to a date. Retry is ineffective when the information is absent from the source or lives in a document that was not provided.
- **Principle**: Memorise the sentence: *Retry handles output errors. Schema design handles source gaps.* More retries on absent data produce more fabrications, not more accuracy.
- **Principle**: Separate absence from format error before deciding anything. A field that is null because the contract does not state it is a correct extraction; a date in the wrong format is a recoverable output error.
- **Principle**: For fields prone to internal inconsistency, extract both values and let the mismatch surface: `stated_total` alongside `calculated_total`, plus `totals_match` or `conflict_detected` and a `conflict_note`. This catches OCR errors, extraction mistakes, and source contradictions without asking the model to reconcile figures it cannot verify.
- **Principle**: Add `detected_pattern` (and `rule_id` or `evidence`) to each finding so dismissals can be aggregated by code construct. Without it you know "35% are dismissed" but not which constructs to suppress.
- **Principle**: When the same defect recurs across many runs, change the prompt or schema structurally — add a few-shot example, make the field nullable, split the tool — rather than adding another retry. Prompt-level fixes generalise; per-instance retries do not.
- **Why the exam wants this**: stems deliberately mix two failure populations in one number (e.g. "900 of 8,000 failed"). The correct option splits them: retry the format errors, accept null for the absent values.
- **Distractors**:
  - "Add retry-with-feedback to handle all extraction failures" — conflates output errors with source gaps.
  - "Increase the retry limit from 3 to 10" — if three retries did not fix it, more produce fabrications.
  - "Run a second LLM call to verify each value against the source" — adds cost and latency, can itself rationalise the original answer, and does not fix the schema that demanded a value. Use verification only as a sampling-based audit on already-good extractions.
  - "Escalate every failed document to human review" — sounds helpful; throws away the 80% that a targeted retry or a nullable field resolves.
  - "Set temperature to 0" — removes variability, not the mismatch.
- **Exact terms**: `stated_total`, `calculated_total`, `totals_match`, `conflict_detected`, `conflict_note`, `detected_pattern`, `rule_id`, `evidence`, `requires_review`, `review_reasons`, and per-field `confidence` with `value`. Absence semantics: optional or nullable field, empty array allowed, item with `value: null` plus `reason`, `unclear` enum value, `other` plus `_detail`.
- **Scenario tie-in**: contract and invoice reconciliation; the review bot whose findings developers dismiss; the extraction service with a partial failure rate.

---

## Task 4.5 — Designing Efficient Batch Processing Strategies

- **Principle**: The Message Batches API is approximately 50% cheaper than synchronous calls, has a processing window of up to 24 hours, and carries no guaranteed latency SLA. Design for the 24-hour worst case, not the typical case.
- **Principle**: Batch is right for high-volume, non-blocking, independent, deadline-flexible work: overnight technical-debt reports, weekly security audits, nightly test generation, bulk document processing.
- **Principle**: Batch is wrong whenever a human or a gate is waiting: pre-merge checks, IDE suggestions, customer-facing chat, latency-sensitive alerts. A 50% saving is dwarfed by developers blocked for hours.
- **Principle**: Never answer "migrate everything to batch to save 50%". The correct answer is always the mixed strategy — batch the latency-tolerant workloads, keep the blocking ones synchronous. Route per-document, not per-batch, when urgency is mixed.
- **Principle**: Multi-turn tool calling is not supported inside a single batch request. A workflow where the model calls a tool, sees the result, and continues cannot run on batch at all — this is a technical incompatibility, not a latency problem.
- **Principle**: `custom_id` correlates request to response. Results may arrive in any order; join by `custom_id`, never by position. Use stable unique identifiers so a partial re-run is straightforward.
- **Principle**: On partial failure, resubmit only the failures identified by `custom_id`, after fixing the cause — chunk the over-long inputs, add validation-error feedback, refine the prompt. Do not resubmit the whole batch.
- **Principle**: Refine prompts on a small sample synchronously before submitting a large batch. Each iteration inside a batch loop costs up to 24 hours.
- **Why the exam wants this**: the "manager proposes switching everything to batch" stem is a recurring shape. Any option that routes a blocking workflow through batch is wrong, including "batch with a synchronous fallback", because the fallback only fires after the queue delay.
- **Distractors**:
  - "Use batch for the CI code-review bot" / "batch the pre-merge hook" — CI is blocking.
  - "Use batch for the multi-turn support agent" — no in-request tool loop.
  - "Batch everything and expedite urgent documents inside the batch" — batch latency is exactly why urgent items cannot use it.
  - "A fallback to synchronous if the batch takes too long" — the blocking job still waits in the queue first.
  - "Resubmit the entire batch when 0.4% fail" — wastes the savings and reprocesses successes.
  - "Iterate on the prompt while the batch runs" — iteration loops are 24h+.
  - "Keep everything synchronous" — forfeits the savings on workloads that tolerate the window.
- **Exact terms**: Message Batches API, `custom_id`, `messages.batches.create(requests=[{"custom_id": ..., "params": {...}}])`, `batches.retrieve(id).processing_status` (poll until `"ended"`), `batches.results(id)` streamed as JSONL, result states `succeeded` / `errored` / `canceled` / `expired`. Batch supports tools in `params`; the block is executing them mid-request. Batch and prompt caching can stack, but cache hits inside an asynchronous batch are best-effort.
- **Scenario tie-in**: Claude Code for CI/CD — the pre-merge gate versus the overnight deep analysis; bulk extraction of 50,000 documents.

---

## Task 4.6 — Designing Multi-instance and Multi-pass Review Architectures

- **Principle**: A model reviewing its own output in the same session retains the reasoning context that produced it. It is biased toward its prior conclusions and less likely to question its own decisions. This is reasoning context bias.
- **Principle**: The fix is an independent instance — a fresh session with no knowledge of why the decisions were made, receiving only the artifact and the criteria. Self-critique instructions inside the generating session are the failure mode, not the fix.
- **Principle**: Large multi-file reviews need two passes: a per-file local analysis pass for consistent depth per file, then a separate cross-file integration pass for data flow, interface mismatches, and boundary error handling.
- **Principle**: Single-pass review of 10+ files fails on attention dilution (early files get more attention than late ones), inconsistent standards (a pattern is flagged in one file and approved in another), and missed cross-file issues. A larger context window does not cure attention dilution — it is not a token problem.
- **Principle**: Self-reported confidence is unreliable for routing. Calibrate thresholds on a labelled validation set, and measure accuracy by segment — document type, field, source quality, confidence band — before raising an automation threshold. A pipeline that is 97% accurate overall can be 80% accurate on one field or document type.
- **Principle**: Field-level confidence with a reason is more actionable than a bare score: `value`, `confidence`, `requires_review`, `review_reasons`. Route to human review on low calibrated confidence, ambiguous or contradictory source content, high-impact fields, failed semantic validation, or new and historically error-prone document types.
- **Why the exam wants this**: the stem describes a review that caught nothing, or a review whose depth varied across files. Options offering more deliberation, more context, or a confidence threshold in the same session are all wrong-layer.
- **Distractors**:
  - "Ask the model to review its own findings before returning" — self-review in session; motivated reasoning.
  - "Enable extended thinking for the generation stage" — deeper deliberation on the same chain of reasoning preserves the bias.
  - "Use a larger context window so the whole codebase fits in one pass" — attention dilution.
  - "Run three full-PR passes and keep findings that appear twice" — three passes carry three times the cost and the same dilution.
  - "Set the confidence threshold to 0.9 to guarantee quality" — an uncalibrated number is meaningless; 0.9 is permissive in one system and prohibitive in another.
  - "Filter low-confidence findings before developers see them" — violates a no-filtering constraint and hides findings rather than calibrating routing.
- **Exact terms**: independent review instance, reasoning context bias, per-file pass, cross-file integration pass, attention dilution, calibrated threshold, labelled validation set, stratified sampling, `requires_review`, `review_reasons`, segment-level accuracy.
- **Scenario tie-in**: code generated and reviewed in the same CI session; a 14-file PR review with inconsistent depth; routing review findings to humans.

---

## Schema design rules

Do:

- Make a field required only if the information is always available in the source.
- Use `"type": ["string", "null"]` for anything the source may omit, and say so in the description: "null if not found".
- Allow `null` rather than an empty array when the distinction is semantic — an empty `pros` array claims "the reviewer mentioned no pros", `null` means "the document did not address pros".
- Add `"unclear"` to a classification enum so ambiguity has an honest option.
- Add `"other"` plus a paired `_detail` string field for long-tail categories, capturing the source's own wording.
- Put format normalisation in the prompt (ISO-8601 dates, numeric amount plus currency code, decimal fractions), because schemas validate types, not formats.
- Include provenance fields for high-stakes extraction: `source_location`, `source_quote`, `effective_date`.
- Capture original and amended values with effective dates when documents contain amendments.
- Add reconciliation fields: `stated_total`, `calculated_total`, `totals_match`.
- Add `detected_pattern` or `rule_id` to findings so over-reporting can be measured by construct.
- Keep schemas small: tool definitions and output schemas count as input tokens, and a large schema plus a long document crowds the attention boundary and degrades accuracy near the end of the document.

Don't:

- Don't make an absent-from-source field required — that is the fabrication factory.
- Don't rely on `required` for correctness; it guarantees presence, not truth.
- Don't use `minimum`, `maximum`, `pattern`, `minLength`, or `oneOf` expecting schema enforcement — unsupported in strict mode; validate in application code.
- Don't omit `additionalProperties: false` in strict mode.
- Don't use a strict enum with no escape hatch where new categories keep appearing.
- Don't assume schema compliance is source truth. Syntax validation is the first layer only.
- Don't hardcode a scalar field for a value that amendments rewrite.
- Don't try to attach API citations to JSON fields; put source locations in the schema.

---

## Batch API decision table

| Workload | API | Why |
|----------|-----|-----|
| Pre-merge gate, PR style check, IDE suggestion, customer chat | Synchronous | A human or a gate is waiting; 24h is unacceptable |
| Overnight technical-debt report, weekly security audit, nightly test generation, bulk extraction | Batch | Non-blocking, deadline-flexible, ~50% cheaper |
| Workflow that calls tools mid-request and continues | Synchronous | No in-request tool loop on Batch, regardless of latency tolerance |
| Mixed urgency across documents | Route per-document | Standard documents to Batch, urgent ones to synchronous — not per-batch |

Latency arithmetic for a batch-backed deadline:

| Variable | Meaning |
|----------|---------|
| 24h | Worst-case batch processing window |
| SLA | Your downstream deadline |
| SLA − 24h | Buffer available for downstream work |
| Submission cadence | Must be shorter than (deadline − batch window − buffer) |

- Worked case: SLA 30h, window 24h, buffer 6h. Submit every 4h. A record arriving just after a submission waits at most ~4h for the next batch plus up to 24h processing = ~28h < 30h.
- The 4h is the submission interval, not an addition to the 24h cap. The constraint is start_time + 24h ≤ deadline.
- Other cadences from the corpus: SLA 36h with a 24h window allows roughly a 12h cadence; SLA 26h forces a 2h cadence because there is almost no margin.
- Submitting once a day is only safe when the SLA is at least 48h.
- Cadence refers to when you submit; the worst case is set by the slowest record, not the average.

---

## Recall card

- Categorical criteria beat confidence adjectives. "Flag X, report Y, skip Z" wins. *Conservative*, *careful*, *high-confidence* in an option means distractor. Anchor each severity level with a real code example — prose severity drifts across runs.
- High false positives in one category destroy trust in all categories. Disable the noisy category, improve its criteria, re-enable.
- Inconsistent output despite detailed instructions → 2–4 targeted few-shot examples on ambiguous cases, each showing the reasoning. Not 1, not 10. More instructions do not converge.
- Few-shot over varied document structures reduces hallucination in extraction.
- `tool_use` with a JSON schema eliminates syntax errors. That is the whole guarantee.
- Schema compliance ≠ semantic correctness. Line items summing to the total is your validation code's job.
- All-required schemas are fabrication factories. Make the field nullable and teach the model to return null.
- `"auto"` for optional; `"any"` for must-call-something (heterogeneous documents); named tool for must-call-this; `"none"` to forbid tools.
- Nullable fields, `"unclear"` enums, `"other"` + detail — the anti-fabrication toolkit.
- Strict mode: `additionalProperties: false`, every property in `required`, and no `minimum`/`pattern`/`oneOf`.
- Retry fixes output errors. Schema design fixes source gaps. Never retry an absent value. Retry-with-feedback = original document + failed extraction + the specific validation error.
- Extract `stated_total` and `calculated_total`; flag the mismatch instead of trusting either.
- `detected_pattern` turns a black-box review bot into a measurable system.
- Assistant prefill is gone on modern models. Use `output_config.format` with a `json_schema` type.
- Batch: ~50% cost, up to 24h, no SLA, no in-request tool loop, `custom_id` correlates.
- Blocking → synchronous. Latency-tolerant → batch. Multi-turn tool calls → synchronous, always.
- Refine prompts synchronously on a sample before batching. Resubmit failures by `custom_id`, never the whole batch.
- Same session reviewing its own work = motivated reasoning. Use a fresh independent instance.
- Per-file pass + separate cross-file integration pass beats one giant pass. A bigger context window does not fix attention dilution.
- Self-reported confidence is unreliable uncalibrated. Measure by segment on a labelled validation set.

---

## Sources

Files actually read for this note:

- `resources/dnacenta-domains/d4-prompt-engineering.md` (tasks 4.1–4.6 sections and Domain 4 practice questions)
- `resources/hamzafarooq-cheatsheets/domain4.md` (full)
- `resources/00-concept-map.md` (Domain 4 task index, tradeoff table, correlation graph)
- `resources/04-api-and-product-faq.md` (full: prefill deprecation, `output_config.format`, batch FAQ, `custom_id`, 30h/24h SLA arithmetic, exam-vs-production table)
- `resources/03-anti-patterns-catalog.md` (extraction and review anti-patterns)
- `resources/02-mock-exam-trap-guide.md` (trap taxonomy)
- `resources/paullarionov-guide_en.md` (Chapter 1 §1.1–1.5, Chapter 2 §2.1–2.5, Chapter 6, Chapter 7, §8.3, Domain 4 key knowledge and key skills)
- `resources/daronyondem-study-guide.md` (§1 API Fundamentals and Output Control, §4 Structured Data Extraction and Validation, §6 System Prompt Engineering, §11 Iterative Refinement/Testing/Evaluation, §12 Model Selection and Inference Controls, §14 Batch Processing, Cost, and Latency)
- `resources/timothywarner-practice-60q.md` (Claude Code for CI scenario, questions 16–31)