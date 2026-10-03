# Domain 1 — Solution Design & Architecture (17%) — Question Bank (20 questions)

Coverage: 1.1 ×3, 1.2 ×4, 1.3 ×4, 1.4 ×3, 1.5 ×3, 1.6 ×3.
Trap types used: sounds-enterprise, sounds-efficient, sounds-thorough, sounds-pragmatic,
sounds-helpful, sounds-smart, sounds-simple.

---

### Q1
A regional utility asks for "an AI assistant to help field crews." Leadership has funded the programme on a single number: cut average crew dispatch-prep time from 45 minutes to under 20. The proposal on the table is a multi-agent "operations brain" with a planner, a document agent, and a scheduling agent that will "learn the whole operation." The architect must bring the design back to the funded outcome without discarding a plausible capability.

**Which approach is most effective?**
A) Restate the ask as the dispatch-prep outcome with its 45→20 baseline and target, map each prep decision to classify/extract/draft versus deterministic scheduling, and defer any additional agent until a prep step genuinely needs one.
B) Keep the multi-agent "operations brain" but add a KPI dashboard so leadership can watch dispatch-prep time fall.
C) Deploy the largest Claude model with all operational documents in context so the assistant is maximally capable.
D) Run a six-month discovery to inventory every crew workflow before designing anything.

**Answer:** A
**Why:** A binds the architecture to the funded baseline and target and defers machinery the outcome does not require. B adds observability without changing a design that never targeted the metric. C optimises raw capability nobody funded. D delays value and still leaves the design unbound to the 20-minute target.
**Trap:** sounds-enterprise
**Task:** 1.1
**Source:** newly written

### Q2
A hospital's scheduling office asks for "Claude to handle patient appointment requests." Discovery finds 85% are reschedules that follow fixed rules, 10% need an insurance-policy lookup, and 5% are urgent clinical triage. Leadership funds the programme to cut handling time 40% but explicitly requires that no clinical-triage request is ever answered without a nurse. A vendor proposes collapsing everything into one model call to keep latency low.

**Which approach is most effective?**
A) Send every request through one Claude call that classifies and answers in a single hop, keeping latency lowest.
B) Deploy the largest Claude model on all requests so the 5% clinical triage is handled accurately.
C) Segment the work: deterministic rules for the 85% reschedules, Claude for the 10% policy lookups, and mandatory nurse routing for the 5% clinical triage, sized to the funded 40% goal and the no-unsupervised-triage constraint.
D) Let the model answer all requests but flag clinical-sounding language for later nurse review.

**Answer:** C
**Why:** C maps each segment to the funded metric and honours the constraint that triage must reach a nurse. A optimises latency by collapsing the one segment the constraint protects. B optimises accuracy on the smallest segment while ignoring the funded 40% goal. D answers clinical requests before review, violating the constraint.
**Trap:** sounds-efficient
**Task:** 1.1
**Source:** newly written

### Q3
A government agency wants "an AI system to process permit applications." The funded outcome is to reduce average decision time from 30 days to 10 while keeping the statutory requirement that every denial cite the exact regulation it rests on. A proposal would have Claude read each application and produce the full decision including the citation. The architect must frame the design.

**Which approach is most effective?**
A) Have Claude produce the full decision, then add a review board that audits 10% of denials.
B) Upgrade to the largest model so citations are more accurate.
C) Give the model the entire regulation corpus in every prompt so nothing is missed.
D) Frame the work as: Claude extracts and classifies application facts and drafts a decision with a proposed citation, while a deterministic rule engine validates the citation against the current regulation set before release — sized to the 30→10-day target and the cite-the-regulation constraint.

**Answer:** D
**Why:** D separates model judgement (extraction, drafting) from a deterministic citation check that guarantees the statutory constraint, and it targets the funded cycle time. A audits after the fact, so wrong denials still reach applicants. B assumes accuracy is the failure when the requirement is guaranteed correctness. C inflates context and cost without guaranteeing the cited regulation is current.
**Trap:** sounds-thorough
**Task:** 1.1
**Source:** newly written

### Q4
A wealth-management firm's Claude meeting-summary tool was accurate at launch. Eight months later advisors report summaries that cite retired products and outdated fee schedules; model version and latency are unchanged. The firm funds the tool on advisor time saved and cannot tolerate silent quality decay. A pragmatic proposal is a monthly manual re-baseline of the prompt and product data.

**Which approach is most effective?**
A) Upgrade to the newest Claude model and re-baseline the prompt.
B) Add a feedback loop that captures advisor edits and rejections of each summary and alerts when the edit rate on product and fee citations crosses a threshold.
C) Require an advisor to approve every summary before it reaches the client.
D) Schedule a monthly manual re-baseline of the prompt and product data.

**Answer:** B
**Why:** B restores trust (edits surface the defect) and prevents recurrence (a threshold alert on the drift signal) — the feedback stage the design was missing. A assumes the model is the cause when the source content changed. C adds cost and latency to every case yet still detects no drift. D is a manual patch that lags the drift and emits no signal between cycles.
**Trap:** sounds-pragmatic
**Task:** 1.2
**Source:** newly written

### Q5
A logistics firm deployed a Claude customs-classification tool. It is accurate, but 12% of classifications are later overridden by a licensed broker. The firm funds the tool on reduced broker touches and requires a documented reason whenever a classification is changed. Today the overrides disappear into a shared inbox and nothing improves the classifier. The architect must close the loop.

**Which approach is most effective?**
A) Capture each broker override with its reason as a structured feedback record and route the accumulated records to a scheduled evaluation and prompt/data refresh, using the override rate as the drift signal.
B) Ask brokers to email the tool's owners whenever a classification looks wrong so a human can fix it quickly.
C) Add a "confidence" field so brokers can see which classifications to trust.
D) Have Claude re-classify every shipment a second time and take the answer it is more sure of.

**Answer:** A
**Why:** A turns overrides into a measured feedback component feeding evaluation — the missing stage. B is a helpful manual channel with no metric, ownership, or path into improvement. C surfaces confidence but captures no outcome, so drift still goes undetected. D doubles cost and supplies no ground truth.
**Trap:** sounds-helpful
**Task:** 1.2
**Source:** newly written

### Q6
An insurer's Claude claims-summary tool is audited annually. The auditor requires evidence that every cited policy clause existed on the date the claim was decided. The tool cites from a live policy store, so a clause edited after the decision changes what the summary appears to cite. Latency is not a concern; auditability is the funded requirement.

**Which approach is most effective?**
A) Add a prompt instruction telling Claude to cite only clauses it is confident were valid on the decision date.
B) Upgrade to a model with better citation accuracy.
C) Snapshot the policy store as of each decision date, cite from that immutable snapshot, and record the snapshot reference with each summary.
D) Add a review board that spot-checks summaries before each audit.

**Answer:** C
**Why:** C fixes the input/processing stage so the evidence an auditor needs is reproducible by construction. A relies on the model's confidence about historical state it cannot know. B treats a data-lineage problem as a model-quality problem. D is after-the-fact sampling that cannot reconstruct a clause already changed.
**Trap:** sounds-smart
**Task:** 1.2
**Source:** newly written

### Q7
A public-health agency's Claude outbreak-report summariser takes weekly feeds from three regional systems, two of which occasionally send malformed records. Today malformed input flows straight into the model, which produces confident summaries from garbage and logs nothing. The agency funds the tool on analyst hours saved and needs to know when a summary rests on incomplete data. A simple fix proposed is to tell the model to ignore bad records.

**Which approach is most effective?**
A) Tell the model in the prompt to ignore any malformed records.
B) Have analysts eyeball each weekly feed before it reaches the model.
C) Add a second model call to double-check the first summary.
D) Validate and normalise the three feeds deterministically before the model sees them, and attach a completeness flag to each summary so low-quality input is visible to the analyst.

**Answer:** D
**Why:** D fixes the input stage — the usual cause of production failure — and makes input quality observable in the output. A leaves malformed data in the prompt and relies on the model to catch it. B moves a deterministic check onto humans and does not scale to weekly feeds. C adds cost and a second failure surface without addressing the input.
**Trap:** sounds-simple
**Task:** 1.2
**Source:** newly written

### Q8
A bank must generate regulatory capital reports. The steps are fully specified by regulation: gather positions, apply fixed weighting rules, produce a report in a mandated template, and reconcile against the prior quarter. The reports are audited and every number must be reproducible. A vendor proposes an autonomous agent that "figures out the best way to assemble each report."

**Which approach is most effective?**
A) An autonomous agent that plans its own steps per report and retries until it reports success.
B) A multi-agent team with a coordinator and a specialist agent per report section, so each section gets dedicated attention.
C) A prompt-chained workflow: deterministic code gathers positions and applies the weighting rules, Claude drafts the narrative sections against the mandated template, and a reconciliation step compares to the prior quarter — using Claude for language, not arithmetic.
D) Give one agent the full rulebook and the position data and let it produce the whole report in a single loop.

**Answer:** C
**Why:** C uses the least-autonomous pattern for fully specified, audited steps and keeps deterministic work out of the model. A adds autonomy with no unknown path to discover and harms reproducibility. B adds orchestration and per-section agents for a task whose steps are already fixed. D makes arithmetic and sequencing non-deterministic for an audited deliverable.
**Trap:** sounds-enterprise
**Task:** 1.3
**Source:** newly written

### Q9
A pharma company screens inbound partnership proposals against a fixed internal playbook and drafts a go/no-go memo. The steps are known and identical every time, and the memo must cite the playbook rule applied. A team proposes a single autonomous agent that decides which playbook rules to consult per proposal, arguing it saves building a fixed pipeline.

**Which approach is most effective?**
A) An autonomous agent that decides which playbook rules to consult per proposal to avoid building a fixed pipeline.
B) A workflow: retrieve the relevant playbook section deterministically, have Claude apply it and draft the memo with the cited rule, and validate the citation before release.
C) A multi-agent team with a research agent, a rules agent, and a memo agent.
D) Give Claude the entire playbook and the proposal and ask for the memo in one shot.

**Answer:** B
**Why:** B matches a known, repeatable, auditable task to a workflow and guarantees the citation. A adds autonomy with no uncertainty to resolve and makes the applied rule non-reproducible. C adds orchestration for steps that need no distinct roles. D lets the model choose rules implicitly and drops the citation guarantee.
**Trap:** sounds-efficient
**Task:** 1.3
**Source:** newly written

### Q10
A retail chain wants an "AI merchandising assistant" that reviews weekly sales and suggests markdowns. Most weeks the analysis follows the same fixed report; occasionally a supply disruption requires investigating external causes. Leadership funds it on planner hours saved and will not accept markdown advice that ignores a known disruption. The architect must choose the pattern.

**Which approach is most effective?**
A) A single fully autonomous agent every week so the disruption case is handled by the same mechanism.
B) A fixed report generator every week, ignoring disruptions.
C) A multi-agent team that always runs supply, sales, and pricing agents in parallel.
D) A workflow for the standard weekly report, with a bounded agentic branch that activates only when a disruption signal is present, investigating external causes before the markdown advice is produced.

**Answer:** D
**Why:** D gives the least autonomy for the known case and earns agency only against the named uncertainty, so standard weeks stay cheap and testable and disruption weeks are still covered. A pays agentic cost and variance every week for a case that rarely occurs. B fails the disruption requirement. C runs orchestration every week regardless of need.
**Trap:** sounds-smart
**Task:** 1.3
**Source:** newly written

### Q11
A hospital network must extract structured findings from radiology reports and route them to downstream systems. Report formats are known, routing rules are fixed, and every output is audited. One colleague proposes an agent that "decides the best way to process each report"; another wants a coordinator with per-specialty extractor agents to be thorough. The architect must pick the pattern.

**Which approach is most effective?**
A) An autonomous agent that plans extraction and routing per report.
B) A coordinator agent with per-specialty extractor agents.
C) A prompt-chained workflow: extract to a fixed schema, validate, then route by deterministic rules, using Claude for extraction.
D) An agentic loop that calls the routing API and retries until it reports success.

**Answer:** C
**Why:** C uses the least-autonomous pattern for a fully known, audited task, giving determinism and testability. A adds autonomy with no unknown path and harms auditability. B adds orchestration and per-specialty agents for formats already known. D makes routing non-deterministic when fixed rules suffice.
**Trap:** sounds-thorough
**Task:** 1.3
**Source:** newly written

### Q12
An investment firm wants Claude to produce quarterly portfolio reviews: (1) retrieval of holdings and market data, (2) a compliance check against a rulebook, and (3) narrative drafting, all complete before one reviewer sees a draft. Retrieval and compliance use mutually exclusive tool sets. A pragmatic proposal is to give one agent all the tools and let it decide when to use each, since that is simpler to maintain.

**Which approach is most effective?**
A) An orchestrator that decomposes the task, dispatches retrieval and compliance as bounded workers, then integrates their outputs and hands the assembled draft to the reviewer.
B) A single general-purpose agent with all retrieval and compliance tools that decides when to use each, to keep maintenance simple.
C) A peer network where retrieval, compliance, and drafting agents message each other until they agree.
D) Three independent agents whose outputs are concatenated in arrival order for the reviewer.

**Answer:** A
**Why:** A names a topology matched to role- and tool-differentiated sub-tasks, with bounded workers and a clear integration point before review. B collapses mutually exclusive tool sets into one agent, risking wrong-tool selection with no separation. C is an unbounded peer topology with no termination guarantee for non-collaborative work. D discards the ordering the reviewer needs — the narrative can arrive before its compliance check.
**Trap:** sounds-pragmatic
**Task:** 1.4
**Source:** newly written

### Q13
A consulting firm's market-entry briefs need research, financial modelling, and a risk review, where the risk reviewer must be able to challenge the research before the brief is finalised. The roles need different tools and context, and the firm funds the tool on analyst hours saved. A proposal adds a helpful coordination agent that forwards every draft between the specialists and asks each to comment until everyone is satisfied.

**Which approach is most effective?**
A) A single agent that performs all three roles in one context to keep coordination simple.
B) An orchestrator/worker topology with a fixed pipeline: research and modelling run as bounded workers, the risk reviewer receives their outputs and can return a challenge that re-invokes research once, and the orchestrator integrates the final brief under a bounded iteration cap.
C) A peer mesh where all three specialists exchange drafts until consensus, with no cap.
D) Three independent agents whose outputs are concatenated for the client.

**Answer:** B
**Why:** B names a topology with a defined integration point and a bounded challenge path, matching the role and tool differentiation and the funded outcome. A gives one agent all three roles and tool sets, losing the independent challenge. C is the helpful-but-unbounded coordination loop with no termination guarantee. D drops the challenge and integration entirely.
**Trap:** sounds-helpful
**Task:** 1.4
**Source:** newly written

### Q14
A logistics firm's customs documentation needs two genuinely different roles: an extractor that reads scanned forms (vision and OCR tools) and a validator that checks against tariff schedules (structured lookup tools). The firm funds the tool on broker hours saved and needs each validation to be independently testable. A proposal would spawn one agent per document type to mirror the firm's document-handling teams.

**Which approach is most effective?**
A) One agent with both vision and tariff-lookup tools that decides which to use per document.
B) A single agent per document type, mirroring the firm's document-handling teams.
C) A peer network of agents that pass documents until they agree.
D) An orchestrator that dispatches extraction and validation as two bounded workers with distinct tool sets, and integrates their results with each validation independently testable.

**Answer:** D
**Why:** D justifies each agent by a distinct role and tool set, bounds them, and keeps validation testable. A mixes vision and structured lookup in one agent, so validation is not independently testable. B mirrors the org chart with no distinct role or context, multiplying cost. C is unbounded and non-collaborative.
**Trap:** sounds-enterprise
**Task:** 1.4
**Source:** newly written

### Q15
A utility must convert 20 years of mixed-format regulatory filings into a queryable compliance knowledge base that answers auditor questions with citations. As a single task it is intractable; filings are scanned, some are revised, and answers must be traceable. A simple proposal is one large prompt that ingests a filing and returns an answer.

**Which approach is most effective?**
A) One large prompt per filing that ingests the text and returns an answer with citations.
B) A staged pipeline: deterministic parse and normalise, chunk/index with version metadata, then a retrieval-and-answer step that cites the chunk and version, with each stage independently testable.
C) One agent with OCR, indexing, and search tools that loops until answers look complete.
D) Put all filings into one large context and ask Claude to answer from it.

**Answer:** B
**Why:** B separates deterministic transforms from model judgement, keeps the model for the judgement step, and makes each stage verifiable and retryable — the testability tie-breaker. A mixes parsing and judgement in one shot with no per-stage validation. C adds an autonomous loop with no termination signal. D exceeds any context window and cannot localise a failure.
**Trap:** sounds-simple
**Task:** 1.5
**Source:** newly written

### Q16
A manufacturer wants Claude to turn 40,000 scanned supplier contracts into a structured obligations register. Extraction is error-prone, and the register must be auditable with each row traceable to a contract page. A proposal is one prompt per contract that reads the PDF and returns the full register row, retrying on failure, to avoid building extra stages.

**Which approach is most effective?**
A) One prompt per contract that reads the PDF and returns the full register row, retrying on failure, to avoid extra stages.
B) A staged pipeline: deterministic OCR and normalisation, then Claude extraction against a fixed schema with per-field validation, then reconciliation that flags low-confidence rows for review.
C) A single agent with OCR, extraction, and database tools that loops until the register looks complete.
D) Batch all contracts into one large context and ask Claude for the whole register.

**Answer:** B
**Why:** B separates deterministic OCR from model extraction, validates per field, and localises errors so the register is auditable. A mixes unreliable OCR into a single model call with no field validation. C adds an autonomous loop with no termination or confidence signal. D exceeds the context window and cannot retry at contract granularity.
**Trap:** sounds-efficient
**Task:** 1.5
**Source:** newly written

### Q17
A telecom must produce a monthly churn-risk report that pulls from billing, network-quality, and support-ticket systems. The three sources have different schemas and refresh at different times, and the report must flag any source that was stale when the report was generated. A thorough proposal is one agent that queries all three systems and writes the whole report in a single reasoning pass.

**Which approach is most effective?**
A) A staged decomposition: normalise each source to a common schema with its freshness timestamp, join deterministically, then have Claude analyse the joined dataset and write the report with a per-source freshness flag.
B) One agent that queries all three systems and writes the report in one pass.
C) Add a bigger model so all three schemas fit in one context.
D) Have each source owner email their data to an analyst who assembles the report.

**Answer:** A
**Why:** A gives each unit one verifiable output and a bounded context, separates deterministic joins from model judgement, and makes source staleness observable. B hides schema mismatches and freshness inside one reasoning pass. C treats context size as the problem when the problem is decomposition. D removes the model entirely and does not scale.
**Trap:** sounds-thorough
**Task:** 1.5
**Source:** newly written

### Q18
A bank funds a Claude fraud-triage tool strictly on reducing analyst cost per case. Compliance mandates that every high-risk case be fully explained and reviewed by a human within a 4-hour SLA. A proposed design automates 90% of cases and removes human review for medium-risk cases — cutting cost the most but pushing some medium-risk cases past the 4-hour explanation SLA during peak load. A pragmatic proposal is to launch the 90% design and tune the SLA after launch.

**Which approach is most effective?**
A) Launch the 90% automation now to capture the funded cost saving and tune the SLA once peak behaviour is observed.
B) Automate all cases and add logging so missed explanations can be reconstructed later.
C) Add a governance board to approve the automation level before launch, leaving the SLA question open.
D) Keep human review for high-risk cases and add a bounded fast-path for medium-risk cases that still meets the 4-hour explanation SLA, accepting a smaller cost reduction.

**Answer:** D
**Why:** D advances the funded cost pillar while preserving the mandated 4-hour SLA. A optimises the funded pillar by breaking the constraint and defers it. B substitutes after-the-fact logging for a real-time obligation. C defers the constraint to a board that cannot meet an SLA.
**Trap:** sounds-pragmatic
**Task:** 1.6
**Source:** newly written

### Q19
A telecom funds AI-driven support deflection on cost-per-contact, and the CTO mandates a p95 first-response SLA under three seconds. Operations also wants higher agent productivity. A design adds a retrieval step, a reasoning agent, and a helpful "quality checker" that re-reads every reply before it is sent, pushing p95 first-response to five seconds. The architect must reconcile the pillars.

**Which approach is most effective?**
A) Keep the always-on quality checker because it improves reply quality, and accept the five-second p95.
B) Drop the three-second SLA because cost-per-contact is the funded pillar.
C) Remove the always-on quality checker from the response critical path — run it only on a sampled offline path — so p95 first-response holds under three seconds while cost-per-contact still improves.
D) Add more agents to parallelise the work so both the quality checker and the SLA can be met.

**Answer:** C
**Why:** C advances the funded cost pillar without breaching the mandated SLA, making the trade-off explicit. A optimises reply quality at the cost of the named SLA. B discards a mandated constraint in favour of the funded pillar. D adds machinery and cost without addressing the latency the checker introduces.
**Trap:** sounds-helpful
**Task:** 1.6
**Source:** newly written

### Q20
A hospital funds a Claude discharge-summary tool on reducing physician documentation time. The medical board mandates that no summary reaches a patient record without physician sign-off, and finance sets a cost ceiling per summary. A design uses a frontier model on every summary plus a second "smart" model that audits the first, which exceeds the cost ceiling. The architect must choose.

**Which approach is most effective?**
A) Route only high-complexity summaries to the frontier model and use a smaller model for routine ones, keep physician sign-off mandatory, and stay within the per-summary cost ceiling.
B) Keep the two-model audit because a smarter checker improves safety, and renegotiate the cost ceiling.
C) Remove physician sign-off to offset the cost of the two-model audit.
D) Add a governance board to review the tool monthly, leaving the cost ceiling unchanged.

**Answer:** A
**Why:** A advances the funded documentation-time pillar within the cost ceiling and preserves the mandated sign-off. B optimises safety by breaking the cost ceiling. C breaks the medical-board constraint to fund machinery. D adds governance without addressing the cost overrun.
**Trap:** sounds-smart
**Task:** 1.6
**Source:** newly written
