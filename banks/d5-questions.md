# Domain 5 — Context Management & Reliability — Question Bank (20 items)

Exam framing: 60 MCQs, 120 minutes, pass 720/1000, no guessing penalty. Domain 5 is 15% (tasks 5.1–5.6) but is the most trap-dense domain. Every wrong option below is deliberately one of the seven trap types: sounds-enterprise, sounds-efficient, sounds-smart, sounds-helpful, sounds-thorough, sounds-simple, sounds-pragmatic.

Coverage: 5.1 ×4, 5.2 ×4, 5.3 ×3, 5.4 ×3, 5.5 ×3, 5.6 ×3.

---

### Q1

Customers keep citing specific figures ("the 15% discount I mentioned") and the agent answers with the wrong value. Logs show those details were stated 20+ turns ago and were condensed into vague summaries such as "promotional pricing was discussed." The conversation is a long multi-issue support thread and cannot be shortened.

**Which approach is most effective?**

A) Raise the summarization threshold from 70% to 85% so conversations have more room before summarization triggers.
B) Store the full conversation history in external storage and retrieve it when the agent detects references like "as I mentioned."
C) Extract transactional facts (amounts, dates, order numbers, customer-stated expectations) into a persistent case-facts block included in every prompt outside the summarized history.
D) Revise the summarization prompt to explicitly preserve all numbers, percentages and dates verbatim.

**Answer:** C
**Why:** Summarization is inherently lossy on exact values; a case-facts block injected verbatim makes preservation deterministic instead of best-effort. A only delays the loss to the next threshold, B depends on the agent detecting the reference at all, and D still relies on the model choosing to preserve every value on every pass.
**Trap:** sounds-thorough
**Task:** 5.1
**Source:** reused from timothywarner-practice-60q.md

---

### Q2

Production monitoring shows the synthesis agent reliably cites content from the first 15K tokens of a 75K-token aggregate and from the final 10K tokens, but frequently omits findings from the middle 50K — including findings that directly answer the research question.

**Which approach is most effective?**

A) Compress all subagent outputs to under 20K tokens before aggregation so content sits inside the reliably processed range.
B) Restructure the aggregate so key findings appear at the beginning with explicit section headers, keeping the detailed material behind that.
C) Stream subagent results to the synthesis agent incrementally, completing one source before adding the next.
D) Rotate which subagent's results appear first across research tasks so both sources get equal top positioning over time.

**Answer:** B
**Why:** The failure is content placement, not volume — the model does attend to the start and end of long inputs. A throws away detail the synthesis agent needs, C still leaves the second batch in the low-attention middle, and D only balances positioning on average rather than fixing any single report.
**Trap:** sounds-efficient
**Task:** 5.1
**Source:** reused from timothywarner-practice-60q.md

---

### Q3

Subagents return raw search results, full page text and long reasoning traces to the coordinator. By the time synthesis runs, the context is saturated and conclusions are being buried under bulk. You want to reduce downstream context growth without weakening the findings.

**Which approach is most effective?**

A) Modify the upstream subagents to return structured key facts, citations, relevance scores and confidence values instead of verbose prose and reasoning.
B) Add an intermediate summarization agent that condenses each subagent's output before passing it to synthesis.
C) Give the synthesis agent a higher token budget so it can process the full payload.
D) Summarize all subagent outputs together in one pass immediately before the final report.

**Answer:** A
**Why:** Fixing verbosity at the source removes the bulk instead of paying to clean it up later; reasoning belongs inside the subagent's own context and only distilled conclusions cross the boundary. B adds a lossy extra hop for noise that should never have been emitted, C treats a placement and dilution problem as a capacity problem, and D compresses after the context is already polluted.
**Trap:** sounds-thorough
**Task:** 5.1
**Source:** reused from timothywarner-practice-60q.md

---

### Q4

A support agent runs 45-turn conversations that touch three separate issues (a refund, a subscription question, a payment update). Two of the three issues were resolved by turn 20; the refund is still active. Under the current strategy the agent keeps re-reading all 45 turns, and when the customer returns to a resolved issue the details are gone.

**Which approach is most effective?**

A) Keep a sliding window of the last 10 turns plus the system prompt, and ask the customer to restate anything older.
B) Replace resolved threads with structured summaries while keeping the active thread and recent turns verbatim.
C) Summarize the whole conversation uniformly at a fixed interval so every thread is treated the same way.
D) Increase the sliding window from 10 to 25 turns so older topics stay reachable.

**Answer:** B
**Why:** Progressive summarization of resolved threads preserves narrative continuity at low token cost while the thread still in play stays exact — which is what the customer returns to. A drops the resolved thread entirely, C destroys the transactional spine of the thread that is still active, and D only defers the same failure to a longer conversation.
**Trap:** sounds-pragmatic
**Task:** 5.1
**Source:** newly written

---

### Q5

Your agent achieves 55% first-contact resolution against an 80% target. Logs show it escalates simple, well-defined cases (standard replacements for damaged goods with photo proof) while attempting complex situations requiring policy exceptions autonomously.

**Which approach is most effective?**

A) Require the agent to self-rate confidence on a 1–10 scale before each response and auto-route to a human below a threshold.
B) Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the agent starts.
C) Add explicit escalation criteria to the system prompt with few-shot examples showing when to escalate versus resolve autonomously.
D) Implement sentiment analysis and escalate automatically past a negative-sentiment threshold.

**Answer:** C
**Why:** The root cause is an unclear decision boundary, and explicit criteria with examples teach exactly that. A relies on self-rated confidence, which is poorly calibrated and uncorrelated with real difficulty; B is disproportionate infrastructure for a prompt-level boundary problem; D routes on mood, so calm policy exceptions still get mishandled and angry-but-simple cases get escalated.
**Trap:** sounds-smart
**Task:** 5.2
**Source:** reused from timothywarner-practice-60q.md

---

### Q6

After calling `get_customer` and `lookup_order`, the agent has all available system data but still faces an ambiguous case. Which situation is the most justified trigger for calling `escalate_to_human`?

A) A customer wants to cancel an order shipped yesterday and arriving tomorrow; the agent should escalate because the customer might change their mind after delivery.
B) A customer claims an order never arrived, but tracking shows it was delivered and signed for at their address three days ago; the agent should escalate because presenting contradictory evidence could harm the relationship.
C) A customer requests competitor price matching; company policy covers price adjustments for price drops on your own site within 14 days but says nothing about competitor prices.
D) A customer message contains both a billing question and a product return; the agent should escalate so a human can coordinate both issues in one interaction.

**Answer:** C
**Why:** This is a genuine policy gap — the agent cannot invent policy and must escalate for human judgment. A is a routine, well-defined operation plus speculation about future regret; B involves clear system data the agent should state factually, and difficult news is not a policy gap; D is handled by decomposing the message and issuing the tool calls, since multi-issue volume alone never justifies a human.
**Trap:** sounds-helpful
**Task:** 5.2
**Source:** reused from timothywarner-practice-60q.md

---

### Q7

Your `get_customer` tool returns every match when searching by name. The agent currently picks the customer with the most recent order, and production data shows this selects the wrong account 15% of the time for ambiguous matches, causing misapplied refunds.

**Which approach is most effective?**

A) Implement confidence scoring that acts autonomously above 85% confidence and requests clarification only below that threshold.
B) Instruct the agent to request an additional identifier (email, phone, or order number) when `get_customer` returns multiple matches, before taking any customer-specific action.
C) Modify `get_customer` to return only a single most-likely match chosen by a ranking algorithm, eliminating the ambiguity.
D) Add few-shot examples demonstrating correct reasoning and tool sequencing for ambiguous matches.

**Answer:** B
**Why:** Only the customer holds the fact that disambiguates them, and one extra turn is cheap against a 15% wrong-account action rate. A keeps guessing inside the confident band, C hides the ambiguity inside a ranking algorithm that makes the same wrong pick, and D teaches reasoning but cannot supply the missing identifying fact.
**Trap:** sounds-smart
**Task:** 5.2
**Source:** reused from timothywarner-practice-60q.md

---

### Q8

A customer opens with "This is ridiculous, I have been passed around for an hour!" The agent has not looked anything up yet and has no case context. The complaint itself turns out to describe a routine, resolvable billing question.

**Which approach is most effective?**

A) Escalate immediately to a human because the customer is clearly distressed and the interaction has already gone badly.
B) Ask the customer to complete a structured intake form covering the full account and issue history, then decide.
C) Acknowledge the frustration and ask one targeted question to establish what the billing question actually is.
D) Resolve the billing question silently without commenting on the frustration, since the issue is routine.

**Answer:** C
**Why:** With no context yet, one targeted question is the cheap move that both respects the frustration and gives the agent something to act on. A escalates on sentiment rather than complexity, B is a long intake questionnaire where one question suffices, and D ignores the frustration the customer just raised.
**Trap:** sounds-helpful
**Task:** 5.2
**Source:** newly written

---

### Q9

The web-search subagent times out partway through a complex research topic, having already collected some usable sources. You are designing how the failure is reported to the coordinator.

**Which error-propagation approach best enables intelligent recovery?**

A) Return structured error context including the failure type, the query executed, any partial results, and potential alternative approaches.
B) Catch the timeout inside the subagent and return an empty result set marked as successful.
C) Implement automatic exponential-backoff retries inside the subagent and return a generic "search unavailable" status only after retries are exhausted.
D) Log the exception for later review and return whatever the coordinator expects on the success path.

**Answer:** A
**Why:** Structured error context gives the coordinator what it needs to choose between retry, a modified query, or proceeding with partial results. B is silent suppression with zero recovery path, C strips the type, query and partial results even though local retry itself was reasonable, and D means the running model receives no signal at all.
**Trap:** sounds-simple
**Task:** 5.3
**Source:** reused from timothywarner-practice-60q.md

---

### Q10

During one research run the web-search subagent queries three source categories: academic databases return 15 relevant papers, industry reports return "0 results," and a patent database returns "Connection timeout." You are deciding how these outcomes reach the coordinator.

**Which approach enables the best recovery decisions?**

A) Aggregate the outcomes into a single success-percentage metric (for example "67% source coverage") with detailed logs available on demand.
B) Treat all three as errors and ask the coordinator to retry the entire query set.
C) Distinguish the access failure (timeout), which requires a retry decision, from the valid empty result ("0 results"), which is a successful query that found nothing.
D) Retry the timeout internally and report only persistent failures as a generic unavailable status.

**Answer:** C
**Why:** The timeout and the "0 results" are semantically different outcomes and demand opposite responses — retry the patent database, accept the industry-report result as an informative finding. A collapses the failure type so the coordinator cannot tell which part is retryable, B retries a query that already succeeded and found nothing, and D discards the partial-progress detail the coordinator could route.
**Trap:** sounds-enterprise
**Task:** 5.3
**Source:** reused from timothywarner-practice-60q.md

---

### Q11

The document-analysis subagent frequently fails on PDFs: some have corrupted sections that raise parsing exceptions, some are password-protected, and the parsing library occasionally hangs on large files. Any exception currently terminates the subagent and returns an error to the coordinator, which must decide on every routine retry, skip, or abort.

**Which architectural improvement is most effective?**

A) Create a dedicated error-handling agent that monitors failures on a shared queue and sends restart commands directly to subagents.
B) Configure the subagent to always return partial results with a success status and embed error details in metadata.
C) Have the coordinator validate every document before dispatch and reject any that might cause failures.
D) Implement local recovery in the subagent for transient failures and escalate to the coordinator only errors it cannot resolve, including attempted steps and partial results.

**Answer:** D
**Why:** Errors belong at the lowest level capable of resolving them — local retry removes routine load from the coordinator while unrecoverable failures still arrive with full context. A creates a second orchestrator competing with the coordinator, B hides failures behind a success status, and C pushes all validation upstream without handling the failures that still occur.
**Trap:** sounds-thorough
**Task:** 5.3
**Source:** reused from timothywarner-practice-60q.md

---

### Q12

Your error-handling wrapper refactor spans 120 files in three phases: discover every call site, design the approach collaboratively, then implement consistently. Phase 1 produces enormous output listing hundreds of call sites with surrounding context and fills the context window before discovery finishes, so there is no room left for the phases that need retained context.

**Which approach is most effective?**

A) Use an Explore subagent for Phase 1 to isolate the verbose discovery output and return a summary, then run Phases 2 and 3 in the main conversation.
B) Run all three phases in the main conversation and use `/compact` periodically while moving through the files.
C) Switch to headless mode with `--continue`, passing explicit context summaries between batch calls to maintain continuity.
D) Write the discovery output to a file and rely on the agent to recall the relevant parts when implementing.

**Answer:** A
**Why:** Isolation keeps the high-volume discovery output out of the context that the design and implementation phases actually need. B compacts after the pollution and does so lossily, risking the design decisions needed for consistent implementation; C is brittle hand-passed orchestration that a subagent handles natively; D is the failure mode itself, since the agent will not reliably recover specific findings.
**Trap:** sounds-pragmatic
**Task:** 5.4
**Source:** reused from timothywarner-practice-60q.md

---

### Q13

Thirty minutes into a codebase investigation the agent starts describing "typical patterns" instead of the classes and files it found earlier, gives inconsistent answers about the same module, and begins assuming instead of checking. The exploration is expected to continue for another hour across unfamiliar code.

**Which approach is most effective?**

A) Switch to a larger model with a bigger context window so the earlier findings stay available.
B) Have the agent write key findings (file:line, entry points, known issues) to a scratchpad file and consult it for subsequent questions.
C) Restart the exploration with a fresh context and tighter prompts to avoid the drift.
D) Increase the model temperature so responses stay specific rather than generic.

**Answer:** B
**Why:** A scratchpad externalizes findings so they survive context compression, and it is re-readable exactly when the agent starts drifting. A treats attention dilution as a capacity problem, C hits the same wall at the same turn count and wastes the work done, and D changes sampling, not what the model retains.
**Trap:** sounds-efficient
**Task:** 5.4
**Source:** newly written

---

### Q14

A long-running multi-agent job crashes at hour three after four of six subagents had completed substantial work. On restart the coordinator begins from zero because the only record of progress is the conversation history, which was lost in the crash.

**Which approach is most effective?**

A) Have each agent export structured state to a known file location at checkpoints and have the coordinator load a manifest on resume to pick up where it left off.
B) Write a narrative summary of the run into a single log file at the end of each subagent so a human can restart the work manually.
C) Increase the session length limit so the job is more likely to finish before a crash occurs.
D) Have the coordinator re-run all six subagents from the beginning to guarantee consistent output.

**Answer:** A
**Why:** The manifest is the source of truth across crashes, not the conversation history — it makes the crash a resume-from-checkpoint instead of a restart. B leaves recovery manual and unstructured, C does not survive an independent failure, and D discards hours of completed work and can fail identically.
**Trap:** sounds-thorough
**Task:** 5.4
**Source:** newly written

---

### Q15

Your extraction pipeline reports 97% overall accuracy on the validation set and the team wants to automate without human review. The set is dominated by clean, printed invoices; the highest-value documents in production are handwritten notes and foreign-language scans.

**Which information is most important before automating?**

A) Run a larger volume of documents through the same pipeline to raise confidence in the 97% figure.
B) Break accuracy down by document type and by field segment to confirm performance on each stratum.
C) Compare the 97% figure against published accuracy of competing systems to confirm it meets the industry standard.
D) Set the confidence threshold to 0.9 so that only high-confidence extractions proceed without review.

**Answer:** B
**Why:** Aggregate accuracy masks stratum-level failure — 97% overall can hide a 45% error rate on handwritten notes, exactly the high-value class here. A cannot reveal a stratum gap that the validation sample does not represent, C measures the wrong thing, and D sets an uncalibrated threshold that means nothing without ground truth.
**Trap:** sounds-simple
**Task:** 5.5
**Source:** newly written

---

### Q16

Six months after deployment the extraction system's metrics are stable and the review queue stays short, because only low-confidence extractions are routed to humans. Operations reports a rise in errors on a new document template that the system had not seen before, and every one of those extractions carried high confidence.

**Which approach is most effective?**

A) Lower the review threshold so more low-confidence extractions reach a human.
B) Continue a stratified sampling audit that also samples high-confidence extractions across document types, fields and confidence bands.
C) Add the new document template to the validation set and re-run the original accuracy test.
D) Escalate every extraction from the new template to human review indefinitely.

**Answer:** B
**Why:** Novel error patterns appear over time and by definition never trigger a low-confidence threshold, so only sampling the high-confidence band catches them. A keeps the audit blind to confident failures, C measures a fixed set rather than monitoring live drift, and D is an unbounded permanent manual queue.
**Trap:** sounds-pragmatic
**Task:** 5.5
**Source:** newly written

---

### Q17

A small human review team is the bottleneck in your extraction pipeline. You need to route extractions to it reliably, and you have a labeled validation set available for each document type.

**Which approach is most effective?**

A) Emit per-field confidence scores, calibrate the routing thresholds against the labeled validation set, and route low-confidence fields to review, prioritising the highest-uncertainty items.
B) Emit a single document-level confidence score and review any document scoring below 0.8.
C) Review a fixed 10% random sample of all extractions regardless of confidence.
D) Review every extraction until the team has enough examples to justify loosening the criteria.

**Answer:** A
**Why:** Fields within a document vary widely in difficulty, so routing must be field-level, and a threshold only means something once calibrated against ground truth. B hides per-field variance inside one document score and uses an uncalibrated number, C ignores confidence entirely and spends scarce capacity evenly, and D is an unbounded cost that calibrated routing is designed to replace.
**Trap:** sounds-thorough
**Task:** 5.5
**Source:** newly written

---

### Q18

A document-analysis subagent finds that two credible sources contain directly contradictory figures for a key metric: a government report states 40% growth, an industry analysis states 12%. Both look legitimate and the discrepancy could materially affect the conclusions.

**Which approach is most effective?**

A) Apply credibility heuristics to choose the most likely correct number, finish the analysis with it, and add a footnote noting the discrepancy.
B) Include both numbers without marking them as conflicting and let the synthesis agent decide which fits the broader context.
C) Stop the analysis and escalate to the coordinator to decide which source is authoritative before continuing.
D) Complete the analysis with both values, explicitly annotate the conflict with source attribution, and let the coordinator decide how to reconcile before passing to synthesis.

**Answer:** D
**Why:** The subagent finishes its own work without blocking, preserves both values with attribution, and defers the cross-source reconciliation to the layer that has the broader picture. A hides a coordinator-level decision behind a heuristic footnote, B strips the annotation so the conflict can be merged away, and C blocks on a decision that can be deferred and wastes the work in flight.
**Trap:** sounds-smart
**Task:** 5.6
**Source:** reused from timothywarner-practice-60q.md

---

### Q19

A synthesis draft states that renewable energy's share of global generation is 30% in one citation and 32% in another from a different source, and a reviewer flags the two as an unresolved contradiction that should be reduced to one figure.

**Which approach is most effective?**

A) Include publication and collection dates with each figure so a difference across reporting periods is read as a trend rather than a contradiction.
B) Average the two figures into a single 31% value with both sources cited.
C) Report the more conservative figure and note that sources vary.
D) Omit the statistic until the two sources can be reconciled.

**Answer:** A
**Why:** Dates turn an apparent conflict into change over time and preserve both claims intact. B fabricates a number neither source reported, C is an arbitrary heuristic that erases the disagreement, and D destroys information the reader needs.
**Trap:** sounds-simple
**Task:** 5.6
**Source:** newly written

---

### Q20

A research pipeline ends with a report that states "studies show the market is growing" with no path back to which study, by whom, or when. Each upstream subagent had the source in hand when it made the claim, and the synthesis step merged everything into narrative prose.

**Which approach is most effective?**

A) Have subagents output structured claim-source mappings (claim, source URL, document name, supporting excerpt, publication date) and require downstream agents to preserve and merge those mappings rather than flatten them into prose.
B) Write a bibliography at the end of the report listing every source consulted, with the claims left in the narrative.
C) Have the synthesis agent re-derive the sources by searching for the numbers it included.
D) Split the report into established findings and contested findings, leaving contested claims unsourced.

**Answer:** A
**Why:** Attribution survives synthesis only if it travels with the claim as structured data through every agent. B separates sources from claims so the link is lost on merge, C depends on re-finding sources and can invent matches, and D separates certainty levels — which is useful — but does not restore provenance.
**Trap:** sounds-enterprise
**Task:** 5.6
**Source:** newly written

---

## Answer key

| # | Ans | Task | Trap | Origin |
|---|---|---|---|---|
| 1 | C | 5.1 | sounds-thorough | reused |
| 2 | B | 5.1 | sounds-efficient | reused |
| 3 | A | 5.1 | sounds-thorough | reused |
| 4 | B | 5.1 | sounds-pragmatic | new |
| 5 | C | 5.2 | sounds-smart | reused |
| 6 | C | 5.2 | sounds-helpful | reused |
| 7 | B | 5.2 | sounds-smart | reused |
| 8 | C | 5.2 | sounds-helpful | new |
| 9 | A | 5.3 | sounds-simple | reused |
| 10 | C | 5.3 | sounds-enterprise | reused |
| 11 | D | 5.3 | sounds-thorough | reused |
| 12 | A | 5.4 | sounds-pragmatic | reused |
| 13 | B | 5.4 | sounds-efficient | new |
| 14 | A | 5.4 | sounds-thorough | new |
| 15 | B | 5.5 | sounds-simple | new |
| 16 | B | 5.5 | sounds-pragmatic | new |
| 17 | A | 5.5 | sounds-thorough | new |
| 18 | D | 5.6 | sounds-smart | reused |
| 19 | A | 5.6 | sounds-simple | new |
| 20 | A | 5.6 | sounds-enterprise | new |

Totals: 20 questions; 11 reused from timothywarner-practice-60q.md, 9 newly written. Task coverage: 5.1 ×4, 5.2 ×4, 5.3 ×3, 5.4 ×3, 5.5 ×3, 5.6 ×3.

## Sources

- resources/timothywarner-practice-60q.md (Q1, Q3, Q5, Q9, Q12, Q45, Q49, Q50, Q54, Q55 stems adapted and re-pitched to Domain 5 wording)
- resources/dnacenta-domains/d5-context-reliability.md
- resources/hamzafarooq-cheatsheets/domain5.md
- resources/00-concept-map.md
- resources/02-mock-exam-trap-guide.md
- resources/03-anti-patterns-catalog.md
- resources/paullarionov-guide_en.md
- resources/daronyondem-study-guide.md