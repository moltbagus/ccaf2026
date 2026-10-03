# Domain 6 — Stakeholder Communication & Lifecycle Management (14%) — Question Bank (20 questions)

Coverage: 6.1 ×5, 6.2 ×4, 6.3 ×4, 6.4 ×3, 6.5 ×4.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-simple,
sounds-thorough, sounds-pragmatic, sounds-smart.

---

### Q1
A retail COO opens the kickoff with the solution already chosen: "Put Claude on our support
tickets and cut handling cost 30%." No requirements document exists, and the COO wants a
working prototype by Friday. No one has asked which tickets, who reads the output, or what a
wrong answer costs.

**Which approach is most effective?**
A) Build the prototype this week against the COO's description and let the requirements emerge from what the prototype does.
B) Run structured discovery first — interview the support agents, the finance approver and the compliance owner to capture the decision the system feeds, the data it may use, the volume and latency envelope, and the cost of a wrong answer — then write and confirm the problem statement before designing.
C) Stand up an enterprise discovery workstream with a governance board, a RACI matrix and a 12-week capability roadmap before writing any requirement.
D) Ask the COO to choose between Claude models and a retrieval approach so the prototype can start.

**Answer:** B
**Why:** Discovery is structured, not conversational: it captures outcome, decision, data, failure tolerance and owners in writing before any architecture is drawn. Prototyping first lets the design become the requirements and bakes in unverified assumptions. A governance workstream is ceremony that still omits the decision, data and error facts. Choosing a model is a design decision taken before the problem is defined.
**Trap:** sounds-enterprise
**Task:** 6.1
**Source:** newly written

### Q2
The sponsor's stated goal is to "improve support quality." A colleague proposes skipping
discovery and jumping straight to a pilot, arguing that "we'll learn the real requirements
from how people use it."

**Which approach is most effective?**
A) Convert the goal into a testable requirement with a success measure and an owner — for example, "resolve 70% of billing questions in one turn at ≥95% accuracy on the eval set" — and confirm it before design.
B) Launch a small pilot immediately and derive the requirements from observed usage, since real behavior teaches more than interviews.
C) Ask the sponsor to rank the top three model vendors so the pilot can be scoped to a stack.
D) Write a capability list of everything the system could plausibly do and build to the list.

**Answer:** A
**Why:** A requirement you cannot measure is a wish; discovery output is a testable requirement list, not a slide of capabilities. A pilot without a defined measure cannot tell you whether it succeeded. Vendor selection is a design decision ahead of the problem. A capability list describes possibility, not the decision, data and error tolerance the system must serve.
**Trap:** sounds-efficient
**Task:** 6.1
**Source:** newly written

### Q3
You interview only the sponsor, who owns the budget and is enthusiastic. At acceptance
testing, the compliance owner objects to the customer data the system uses and the finance
approver refuses to approve automatic refunds over $50.

**Which approach is most effective?**
A) Re-interview the sponsor more deeply to surface the compliance and finance concerns.
B) Add a disclaimer that output is AI-generated and not financial or legal advice.
C) Interview the roles that touch the outcome — the support agent, the finance approver and the compliance owner — because the sponsor owns the budget but the operators own the failure modes, and capture their constraints in the requirement list.
D) Have the sponsor sign off that all stakeholder concerns are represented.

**Answer:** C
**Why:** Discovery interviews the roles that own the decisions and failure modes, not only the sponsor. Re-interviewing the sponsor cannot surface constraints the sponsor does not hold. A disclaimer documents a gap without closing it. A sign-off that all concerns are represented shifts responsibility onto the sponsor instead of gathering the facts.
**Trap:** sounds-helpful
**Task:** 6.1
**Source:** newly written

### Q4
Two teams disagree on scope. One wants "an AI that answers anything"; the other wants a
narrow ticket router. You must separate the stated want from a buildable requirement before
design begins.

**Which approach is most effective?**
A) Build the broad "answers anything" version first and narrow it later based on complaints.
B) Split the difference and build a system that answers most questions with a confidence score attached.
C) Let each team prototype its version and pick whichever demos better.
D) Separate the stated want ("use AI") from the buildable requirement ("route 40% of tier-1 tickets with a human approving every refund over $50"), write it down with a success measure and an owner, and confirm it before design.

**Answer:** D
**Why:** The want is the sponsor's hypothesis; the requirement is what you can build and test against. Building broad then narrowing commits to an unscoped system. A confidence score without a defined decision is not a requirement. Letting demos decide substitutes polish for a testable specification.
**Trap:** sounds-simple
**Task:** 6.1
**Source:** newly written

### Q5
You are asked what the deliverable of discovery is. A colleague proposes handing over a
slide deck of Claude capabilities plus a recorded demo so stakeholders can see what is
possible.

**Which approach is most effective?**
A) Deliver the capabilities deck plus a recorded demo so stakeholders can see what is possible.
B) Deliver a signed-off problem statement and a requirement list — each requirement carrying a success measure, a data constraint and an owner — because if it cannot be tested it is not yet a requirement.
C) Deliver a 60-page discovery report covering every conceivable requirement so nothing is missed.
D) Deliver a backlog of user stories in the team's tracker and let the sponsor prioritize.

**Answer:** B
**Why:** Discovery output is a signed-off problem statement and a testable requirement list. A capabilities deck describes what a model can do, not what the system must do. An exhaustive report without prioritization or a confirmed problem is not a decision. A raw backlog defers the definition of the problem the discovery was meant to settle.
**Trap:** sounds-thorough
**Task:** 6.1
**Source:** newly written

### Q6
The steering committee has fifteen minutes. You can show them the orchestration diagram, or
you can lead with the decision and the numbers.

**Which approach is most effective?**
A) State the decision and recommendation first — "we can hit 95% accuracy with human review on the last 5%, at 2 seconds and $0.004 per ticket; removing the human saves 12% of cost and drops effective accuracy to about 88% on edge cases; we recommend keeping the human" — then give the evidence.
B) Walk the committee through the orchestration and retrieval architecture in detail so they can see the engineering rigor, then take questions.
C) Present the recommendation but leave the numbers out to avoid overwhelming a non-technical audience.
D) Present only the accuracy benchmark and recommend the highest-accuracy option.

**Answer:** A
**Why:** Executives approve or reject a choice, not a diagram, so state the decision and recommendation first, quantify in business units, and name the rejected option. A deep architecture walkthrough buries the trade-off in detail the room cannot evaluate. Omitting the numbers hides the very trade-off the decision turns on. A single benchmark presents a preference as a fact.
**Trap:** sounds-pragmatic
**Task:** 6.2
**Source:** newly written

### Q7
Procurement will sign only if the recommendation is defensible on the record. Two options
are on the table, and one of them is described internally as "the better model."

**Which approach is most effective?**
A) Present "the better model" as the option, since model quality is the deciding factor.
B) Present both options qualitatively — "faster and cheaper" versus "more accurate" — and let procurement choose.
C) Quantify each option in business units — cost per transaction, latency the user feels, accuracy the process needs, risk exposure, time to value — and state the recommendation, for example "1.9s at $0.004 versus 0.7s at $0.011."
D) Present a detailed latency and token-cost table so procurement can judge the engineering trade-off themselves.

**Answer:** C
**Why:** Every option must be quantified in business units; "a better model" is not an option. A qualitative comparison hides the numbers the decision needs. A technical latency and cost table is detail procurement cannot evaluate and does not frame as a business choice. Naming concrete cost, latency, accuracy and risk lets procurement own a defensible call.
**Trap:** sounds-smart
**Task:** 6.2
**Source:** newly written

### Q8
You recommend keeping a human review step in a claims-triage process. Procurement asks why
the process is not fully automated.

**Which approach is most effective?**
A) Recommend full automation since it is faster and cheaper, noting that a review step can be added later if accuracy problems appear.
B) Walk procurement through the retrieval and orchestration architecture in detail so they can see the rigor behind the review step.
C) Present only the accuracy benchmark and state that the architecture is the highest-accuracy option available.
D) Name the rejected option and its cost explicitly — "removing the human saves 12% of cost and drops effective accuracy to about 88% on edge cases" — so the committee can see what it is giving up.

**Answer:** D
**Why:** A decision without a visible alternative reads as a preference, not an architecture. Recommending full automation with a "fix it later" caveat oversells capability and defers a known risk. An architecture walkthrough buries the trade-off in detail. A single benchmark presents a preference as a fact and hides the cost, latency and risk the decision turns on.
**Trap:** sounds-thorough
**Task:** 6.2
**Source:** newly written

### Q9
A stakeholder pushes back that a "probabilistic output" makes the system unusable for a
customer-facing process. You must translate the technical limitation into a business
consequence.

**Which approach is most effective?**
A) Reframe it in operational terms — "we route the 5% least-confident cases to a human rather than promising every answer is correct" — so the limitation becomes a decision the business already understands.
B) Explain that all language models are probabilistic and set the expectation that some answers will inevitably be wrong.
C) Add a technical appendix on temperature and sampling so the stakeholder understands why outputs vary.
D) Lower the temperature to zero and tell the stakeholder the system is now deterministic.

**Answer:** A
**Why:** Translate technical limits into business consequences and place the guarantee where it can be held. Stating that some answers will inevitably be wrong hides the limitation behind an inevitability rather than designing a fallback. A sampling appendix is detail the stakeholder cannot act on. Temperature zero reduces variance but does not make a probabilistic system deterministic.
**Trap:** sounds-efficient
**Task:** 6.2
**Source:** newly written

### Q10
A client's procurement team requires a signed SLA and proposes: "The AI system will answer
customer questions with 99.9% accuracy." Your architecture is a Claude model over a document
corpus with human review for low-confidence cases.

**Which approach is most effective?**
A) Accept the 99.9% accuracy clause to win the contract and plan to negotiate it down if edge cases cause problems.
B) Decline to commit to any accuracy number and offer only a best-effort clause, since language models are probabilistic.
C) Accept the accuracy clause but add a note that the system is "AI-based and may occasionally be wrong."
D) Propose an SLA that separates the dimensions: platform availability and response latency as committed targets, accuracy as a measured rate on a defined eval set with a stated confidence band, and a human-review turnaround for low-confidence cases — documented in the contract.

**Answer:** D
**Why:** Splitting the SLA assigns each guarantee to the layer that can hold it and defines accuracy as a measured rate with a review fallback, which is honest and contractable. Accepting 99.9% signs a certainty the system cannot give and makes every edge case a breach. Refusing any number is evasion that costs the trust the deal needs. A disclaimer note documents the gap without closing it and leaves the impossible clause intact.
**Trap:** sounds-enterprise
**Task:** 6.3
**Source:** newly written

### Q11
An operations head drafts a fixed SLA of 500 ms p95 end-to-end latency for a system that
includes retrieval and model inference. Measured p95 is 1.9 seconds.

**Which approach is most effective?**
A) Commit to the 500 ms target and prioritize latency optimization in the roadmap until it fits.
B) Set the guarantee at the layer you control — commit to platform availability and to a review-turnaround window, and define end-to-end latency as a measured target with the human fallback for slow paths — rather than promising a number the inference stack cannot hold.
C) Commit to 500 ms p95 but add a clause that latency may vary with load.
D) Remove the latency SLA entirely and tell operations that latency depends on the model provider.

**Answer:** B
**Why:** Set the guarantee at the layer that can hold it. Committing to a number the stack cannot meet promises an unsupportable metric. A caveat clause leaves the impossible number in place. Removing the SLA entirely reads as evasion when availability and review turnaround are contractable. Measured targets plus a fallback are both honest and defensible.
**Trap:** sounds-helpful
**Task:** 6.3
**Source:** newly written

### Q12
A client insists the contract state that "the system will never give a wrong answer." The
architecture is a Claude model over a knowledge base with a confidence threshold.

**Which approach is most effective?**
A) Agree and add a hallucination guardrail in the prompt to prevent wrong answers.
B) Agree and commit to retraining the model until wrong answers reach zero.
C) Reframe the guarantee at the process layer: every answer either meets the confidence bar or reaches a human within the agreed window, so certainty lives in the process, not the model.
D) Agree but log every answer so wrong ones can be corrected after the fact.

**Answer:** C
**Why:** Certainty lives in the process, not the model. A prompt guardrail cannot guarantee correctness. Committing to zero wrong answers is unsupportable for a probabilistic system. Logging is a detective control that corrects errors after they reach the customer rather than preventing them; a confidence threshold with a human fallback is a guarantee the architecture can actually keep.
**Trap:** sounds-simple
**Task:** 6.3
**Source:** newly written

### Q13
The business needs an accuracy expectation that is contractable and monitorable. A colleague
drafts "≥99% accuracy" to be measured once at go-live.

**Which approach is most effective?**
A) Set the floor at 99% to match the business ask and measure it once at go-live.
B) Set no floor and simply report accuracy monthly so the client can decide.
C) Set the floor at whatever the system achieves in the first month, to avoid over-promising.
D) Set the expectation as a floor with a measured baseline and a monitoring plan — "≥95% on the labeled eval set, re-measured monthly, with the low-confidence band routed to human review" — with the eval methodology and review window in writing.

**Answer:** D
**Why:** An accuracy expectation is a floor with a measured baseline, a monitoring plan and a review fallback. A 99% floor measured once is both likely unachievable and unmonitored. Committing to no floor is evasion. Setting the floor to whatever the system happens to achieve makes the target reactive and unmeasured against a defined eval set.
**Trap:** sounds-smart
**Task:** 6.3
**Source:** newly written

### Q14
You are handing a production Claude-based system to a new engineering team. The existing
documentation is an architecture diagram, the code repository and a folder of meeting notes.

**Which approach is most effective?**
A) A more detailed architecture diagram showing every component, integration and data flow in the system.
B) A set of decision records capturing each key choice — the context, the options considered, the decision, the rationale and the conditions that would reverse it — plus the operational contract: eval sets, confidence thresholds, review triggers, known limitations and the monitoring runbook.
C) Inline code comments on every function explaining what each line does.
D) A link index to the meeting notes and the original project charter, so the team can trace decisions when questions arise.

**Answer:** B
**Why:** Decision records with rationale and reversal conditions plus the operational contract give the incoming team the "why", the boundaries and the runbook. A richer diagram shows structure but not reasoning. Line-by-line comments explain mechanics, not decisions or trade-offs. A link index sends the team digging through unstructured notes to reconstruct a rationale that should have been written down.
**Trap:** sounds-pragmatic
**Task:** 6.4
**Source:** newly written

### Q15
Eighteen months after a handoff, a new team inherits a RAG system with a 500-token chunk
size. Nobody knows why. They "improve" it to 2,000 tokens, retrieval quality collapses on
their FAQ corpus, and they spend a quarter rediscovering the original trade-off.

**Which approach is most effective?**
A) Record decisions as ADRs — one short entry per decision with status, context, decision and consequences — including the rejected options and the conditions that would reverse the choice, so the next team does not blindly reverse a constraint that still holds.
B) Add a comment in the config file next to the chunk size stating that 500 is the current value.
C) Publish a wiki page of links to the original design meetings.
D) Add a README section describing the system's features and how to run it.

**Answer:** A
**Why:** Document the decision and its trade-offs, not just the diagram: a future engineer needs the "why", the rejected options and what would change the answer. A config comment records the value but not the reasoning or the constraint that justifies it. A links page sends the team into unstructured notes. A features README explains usage, not decisions.
**Trap:** sounds-helpful
**Task:** 6.4
**Source:** newly written

### Q16
An auditor asks what the documented operational contract is. The current documentation lists
the model version and the API endpoints.

**Which approach is most effective?**
A) Add the model version and provider changelog to the documentation.
B) Add a data-flow diagram showing where customer data is stored and processed.
C) Document the operational contract: eval sets and their provenance, confidence thresholds, the human-review trigger, known limitations, and the runbook for when monitoring fires — written for both the engineer who will change the system and the audit reader who must see governance.
D) Add a compliance checklist confirming the system passed a one-time security review.

**Answer:** C
**Why:** The operational contract is eval sets, thresholds, review triggers, known limitations and the monitoring runbook, written for both the engineer and the audit reader. A version and changelog are inventory, not governance. A data-flow diagram shows storage but not the controls that govern behavior. A one-time security checklist does not describe how the running system is governed.
**Trap:** sounds-simple
**Task:** 6.4
**Source:** newly written

### Q17
A Claude-based support assistant has been in production for three months. After a routine
content migration, answer quality has degraded, and the team learned of it from a customer
complaint rather than from their own systems.

**Which approach is most effective?**
A) Treat the launch as complete and address degradations reactively as stakeholders report them.
B) Rebuild the system on a newer model to resolve the quality regression.
C) Add error-rate logging so that when answers fail, the failures are captured for later review.
D) Define and instrument monitoring at design time — accuracy on the eval set, confidence-band distribution, review-queue volume, latency, cost per transaction — assign an owner and a threshold, and feed reviewed cases back into the eval set to drive the next iteration.

**Answer:** D
**Why:** Monitoring, an owner, a threshold and a feedback loop into the eval set catch drift before a customer does and turn corrections into iteration. Treating launch as complete is the failure the stem describes. A model rebuild does not fix a retrieval or content problem and replaces a governed system with an unmeasured one. Error logging is a detective control that captures failures but measures no baseline, so it cannot detect a slow drift that never throws an error.
**Trap:** sounds-efficient
**Task:** 6.5
**Source:** newly written

### Q18
Escalations and user corrections are being collected, but they land in a backlog nobody
reads. The team wants the feedback to actually improve the system.

**Which approach is most effective?**
A) Increase the size of the backlog and add a monthly triage meeting to review it.
B) Build the feedback loop into the architecture: reviewed low-confidence cases, user corrections and escalations become labeled data that feeds the next eval set and iteration, with a defined cadence to re-measure and re-tune thresholds.
C) Route every escalation to the model provider as a bug report.
D) Keep the backlog and add a dashboard showing how many corrections are pending.

**Answer:** B
**Why:** The feedback loop must be built into the architecture and feed the eval set, on a cadence, so change is governed rather than ad hoc. A larger backlog and a review meeting leave the corrections unread in the same way. Routing escalations to the model provider misattributes application and content issues. A dashboard provides visibility without an action path.
**Trap:** sounds-thorough
**Task:** 6.5
**Source:** newly written

### Q19
Three months after launch, measured accuracy has drifted from the agreed baseline. A
stakeholder asks why the system "got worse" and expects an honest account against what was
promised.

**Which approach is most effective?**
A) Report only the current accuracy and omit the baseline comparison to avoid alarming the stakeholder.
B) Report that the model is unchanged and the issue is likely a matter of perception.
C) Report measured accuracy and drift against the agreed baseline on a defined cadence, so the stakeholder sees the system honestly rather than discovering a regression, and treat iteration as planned — re-measure, re-tune thresholds, re-run the eval set — rather than reactive.
D) Convene a governance board to review the regression and decide whether to keep the system.

**Answer:** C
**Why:** Expectation alignment continues after launch: report measured accuracy and drift against the agreed baseline, and iterate on a cadence. Omitting the baseline hides the regression the stakeholder is asking about. Blaming perception denies a measured fact. Convening a board to decide whether to keep the system turns a governed cadence into a crisis.
**Trap:** sounds-enterprise
**Task:** 6.5
**Source:** newly written

### Q20
A stakeholder asks you to declare the project "done" at go-live so they can close the budget
line. The system has no monitoring defined and no named owner for after launch.

**Which approach is most effective?**
A) Explain that launch is a phase transition, not a finish: define the metrics, owners and feedback loop as part of the handoff gate, so the solution can be run as a lifecycle rather than declared complete.
B) Declare it done to satisfy the stakeholder and add monitoring later if problems appear.
C) Declare it done but note in the closeout document that monitoring is recommended.
D) Declare it done and hand the system to the support desk to manage.

**Answer:** A
**Why:** Launch is a phase transition: metrics, owners and a feedback loop are design-time commitments set before go-live. Declaring it done and adding monitoring later is the "launch is the finish line" failure that lets drift go unseen. A closeout note is a recommendation with no control behind it. Handing the system to a desk without a defined loop transfers a task but not ownership of the metric.
**Trap:** sounds-pragmatic
**Task:** 6.5
**Source:** newly written
