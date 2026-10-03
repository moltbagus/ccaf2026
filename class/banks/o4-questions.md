# Domain 4 — Workflow Integration and Solution Design (16%) — Question Bank (20 questions)

Coverage: 4.1 ×4, 4.2 ×4, 4.3 ×4, 4.4 ×4, 4.5 ×4.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A retail operations manager forwards a one-page email from a store manager complaining that
weekly stock counts take three days, and asks you to "work out what we actually need to
fix." You have the email, a short intake form, and notes from a five-minute call.

**Which approach is most effective?**
A) Read the sources yourself and write the requirements list alone, keeping Claude out of a decision-sensitive process.
B) Ask Claude to extract stated needs, unstated assumptions, constraints, and open questions as separate lists, then confirm with the operations manager which extracted items are real requirements.
C) Ask Claude to score every request by business impact and hand the ranked list straight to the build team.
D) Ask Claude to redesign the stock-count process from the email and circulate the design for the team to approve.

**Answer:** B
**Why:** Claude's value is converting messy input into an organised picture; the process owner validates which extracted items are genuine business requirements. Hand-ranking priorities and hand-designing the process delegate authority calls to a tool, and doing the structuring by hand throws away the tool's leverage on exactly the step it is strongest at.
**Trap:** sounds-smart
**Task:** 4.1
**Source:** newly written

### Q2
Two departments send conflicting requests about a new expense-approval process: Finance
wants more sign-off levels, Sales wants fewer. You have both sets of meeting notes and need
a shared understanding of the requirements before anyone proposes changes.

**Which approach is most effective?**
A) Tell Claude to pick the department whose request fits the company best and build the requirements around it.
B) Combine both requests into one list and leave the conflict for the build team to resolve when it surfaces.
C) Ask Claude to organise both sets into themes and flag exactly where the two departments conflict, then have the process owner decide which request wins.
D) Forward both departments' full notes to every stakeholder so everyone has all the context before the meeting.

**Answer:** C
**Why:** Structuring both inputs and surfacing the conflict gives the owner the decision the objective requires. Leaving the conflict unresolved pushes a judgment call downstream, letting Claude pick hands authority to a tool, and forwarding raw notes floods stakeholders with context but no synthesis.
**Trap:** sounds-helpful
**Task:** 4.1
**Source:** newly written

### Q3
A requirements list was drafted from a single team's input. A reviewer worries it silently
rests on assumptions that other groups do not share and that some questions were never
asked.

**Which approach is most effective?**
A) Ask Claude to review the draft and call out the assumptions it rests on and the questions still open, then have the process owner confirm each with the groups it concerns.
B) Interview every employee in the company exhaustively so no requirement can possibly be missed.
C) Ask Claude to generate a longer requirements list covering every conceivable edge case so nothing is left out.
D) Accept the draft as complete, since the team closest to the process provided the input.

**Answer:** A
**Why:** Naming the assumptions and open questions targets the real gap — unstated beliefs that become rework — and routes confirmation to the owner. Exhaustive interviewing and endless edge-case lists inflate scope without confirming anything, and accepting the draft leaves the assumptions hidden.
**Trap:** sounds-thorough
**Task:** 4.1
**Source:** newly written

### Q4
Requirements for a claims-intake change arrive from five teams with overlapping and
contradictory asks. Leadership wants a defensible requirements set quickly.

**Which approach is most effective?**
A) Ask Claude to merge all five asks into a single list and mark the whole thing approved to save time.
B) Have each team's manager vote on every requirement line before Claude is involved.
C) Ask Claude to decide which asks matter and drop the rest so the list stays short.
D) Ask Claude to consolidate the five sets into themes, map overlaps and contradictions, and list open questions, then have the accountable process owner rule on priorities.

**Answer:** D
**Why:** Consolidation plus an explicit decision point with the owner is the defensible path; the owner carries authority over the process. A blanket approval skips that call, a standing vote adds process without improving the requirements, and letting Claude drop asks delegates a priority judgment.
**Trap:** sounds-enterprise
**Task:** 4.1
**Source:** newly written

### Q5
A project manager must deliver a project plan by Friday from forty pages of process notes,
past post-mortems, and a half-empty wiki.

**Which approach is most effective?**
A) Write the plan entirely by hand because planning accountability cannot be shared with a tool.
B) Ask Claude to produce the final plan and circulate it so work can start immediately.
C) Ask Claude to synthesise the notes into a working picture and draft two or three plan approaches with pros and cons, then verify key claims and add stakeholder judgment before finalising.
D) Split the notes among four people so each drafts a section in parallel and stitch them together without review.

**Answer:** C
**Why:** Claude compresses synthesis and drafting while humans verify claims and add the judgment the notes do not contain. Forwarding the draft skips verification, hand-writing rejects the leverage, and parallel sectioning multiplies coordination cost without adding any judgment.
**Trap:** sounds-efficient
**Task:** 4.2
**Source:** newly written

### Q6
You ask Claude to research a proposed vendor-onboarding change and it returns a timeline
with specific figures and a claim about the vendor's current contract terms.

**Which approach is most effective?**
A) Include the full research output in the plan verbatim so stakeholders have every detail.
B) Ask Claude to state how confident it is in the figures and trust anything it marks as high confidence.
C) Present the figures as researched facts since they came from a carefully written prompt.
D) Treat each figure and contract claim as a draft to verify against the source documents before it enters the plan.

**Answer:** D
**Why:** Anything Claude states is a draft claim, not researched truth, until checked against a source. Self-reported confidence is not a reliable accuracy signal, and shipping unverified figures into a plan invites rework when the claim turns out wrong.
**Trap:** sounds-helpful
**Task:** 4.2
**Source:** newly written

### Q7
A manager wants to choose how to sequence a rollout and asks how to use Claude in the
planning work.

**Which approach is most effective?**
A) Ask Claude for three sequencing approaches with pros, cons, and what each assumes, then have the team choose using judgment Claude does not have about internal politics and risk appetite.
B) Ask Claude to recommend one sequence and follow it, since generating options wastes time when a decision is needed.
C) Ask Claude for the options now and defer all fact-checking until after the rollout starts, so momentum is not lost.
D) Have the team build one sequence by hand, since comparing options is a distraction from execution.

**Answer:** A
**Why:** Claude's planning value is the option set plus explicit assumptions; the human adds the judgment about which estimate is realistic and which risk the sponsor cares about. A single recommendation, deferred checking, and skipping options all remove the human judgment this objective tests.
**Trap:** sounds-pragmatic
**Task:** 4.2
**Source:** newly written

### Q8
Under deadline pressure, a colleague suggests skipping the verification pass on Claude's
drafted plan and adding a note that the figures are "indicative."

**Which approach is most effective?**
A) Keep the verification pass but shorten it to a single spot-check of the plan's title and summary.
B) Keep the verification pass on the load-bearing claims — figures, timelines, contract terms — and add stakeholder judgment, even under deadline.
C) Skip verification and add the "indicative" note, since the deadline is the binding constraint.
D) Ask Claude to re-read its own plan and remove any errors it finds.

**Answer:** B
**Why:** Deadline pressure is exactly when an unverified claim does the most damage, and verifying the load-bearing claims is a bounded task. An "indicative" label does not make a wrong figure safe, a title spot-check misses the substance, and asking the model to catch its own errors does not validate against a source.
**Trap:** sounds-simple
**Task:** 4.2
**Source:** newly written

### Q9
A team has three candidate designs for a document-intake redesign and a client review on
Monday. None has been stress-tested.

**Which approach is most effective?**
A) Keep Claude out of design and use it only to document the process after the client approves a design.
B) Ask Claude to design a fourth option from scratch so the team has more to compare.
C) Ask Claude to score the three designs and present the winner to keep the review focused.
D) Give Claude the agreed requirements and ask it to critique each candidate against them and draft variations, then have the team review the critiques and select with the client.

**Answer:** D
**Why:** Critique against agreed requirements plus variations is the iteration support that hardens a design before a review, with the team keeping design authority. Letting Claude pick the winner hands authority to a tool with no accountability, and generating from scratch discards the team's context.
**Trap:** sounds-smart
**Task:** 4.3
**Source:** newly written

### Q10
A design team wants to strengthen how it uses Claude across repeated iterations on a long
engagement.

**Which approach is most effective?**
A) Run a tight loop — draft, critique against the requirements with Claude, revise with human judgment, repeat — with a named human owner who approves each design decision.
B) Stand up a standing design-review board that must approve every Claude output before any iteration continues.
C) Let Claude run unattended iterations until the design stops changing, then present the result.
D) Have Claude produce a single final design in one pass and present it, to avoid the overhead of iteration.

**Answer:** A
**Why:** Iteration is a loop with human decision points, and a single accountable owner is the control. A board approving every output adds cost uniformly, unattended iteration removes the human judgment, and one-shot generation skips the critique that surfaces weaknesses before the client does.
**Trap:** sounds-enterprise
**Task:** 4.3
**Source:** newly written

### Q11
A design lead wants Claude to expand the option set for a new support-triage flow.

**Which approach is most effective?**
A) Ask Claude for a single best-practice design and adopt it to save review time.
B) Ask Claude for a few deliberately different variations — a lighter-weight one, one that splits a step — then evaluate them against the requirements with the team.
C) Ask Claude to generate every conceivable variation so no possibility is overlooked before choosing.
D) Skip variations and harden the team's first design through critique alone.

**Answer:** B
**Why:** A small set of deliberately different variations widens the option space in a reviewable way. An exhaustive variation set is unreviewable and adds noise, adopting one design skips the comparison, and hardening a single design never tests whether a better structure exists.
**Trap:** sounds-thorough
**Task:** 4.3
**Source:** newly written

### Q12
A team iterating on a design finds each critique round slow because drafts and feedback
bounce back and forth between people.

**Which approach is most effective?**
A) Ask Claude to approve its own revisions so the loop can close without a human each pass.
B) Batch all critique into one round at the end so the design is finalised in fewer cycles.
C) Keep each critique round short and focused on the agreed requirements, with the team revising between rounds.
D) Drop the critique rounds and rely on the team's experience to catch design flaws.

**Answer:** C
**Why:** Short, requirements-anchored critique rounds keep the loop cheap while the human stays in the decision seat. Self-approval removes accountability, end-loading critique lets flaws compound across drafts, and dropping critique discards the value iteration provides.
**Trap:** sounds-efficient
**Task:** 4.3
**Source:** newly written

### Q13
An HR team's hiring workflow has six steps: screen resumes, run a phone screen, write the
hiring-manager summary, schedule interviews, run the interview, and make the hiring
decision. The HR lead wants to integrate Claude.

**Which approach is most effective?**
A) Delegate the entire screening-and-decision pipeline to Claude so recruiters can focus on closing candidates.
B) Have Claude draft the resume-screening notes and hiring-manager summaries, keep the interview and the hiring decision human, and have recruiters make shortlist calls using Claude's notes.
C) Keep the whole workflow human and use Claude only for general hiring-best-practice questions, since the workflow touches people's careers.
D) Insert a mandatory committee review between Claude and every downstream step so each output gets an approval layer.

**Answer:** B
**Why:** Sorting per step puts pattern-based drafting with Claude and keeps judgment, relationship, and accountability steps human, with the human deciding where prep helps. Delegating the pipeline hands over irreversible decisions, keeping everything manual rejects the low-risk drafting leverage, and a blanket committee adds cost without matching oversight to risk.
**Trap:** sounds-enterprise
**Task:** 4.4
**Source:** newly written

### Q14
An insurance claims workflow has these steps: read the claim, extract the incident
details, flag coverage questions, decide whether to pay, and notify the claimant.
Leadership wants Claude integrated where it helps most.

**Which approach is most effective?**
A) Have Claude read claims and draft the extracted details and coverage questions, keep the pay/no-pay decision and the claimant notification human, and let adjusters work from Claude's drafts.
B) Have Claude run the whole claims pipeline end to end and route only disputed claims to a human, since most claims are routine.
C) Keep Claude entirely out of claims and use it only to write the team's internal newsletter.
D) Have Claude make the pay/no-pay decision and have a human rubber-stamp it to keep throughput high.

**Answer:** A
**Why:** The drafting steps are information-heavy and low-risk, while the payment decision and the claimant conversation carry accountability and stay human. Running the whole pipeline, or letting Claude decide with a rubber-stamp, delegates the irreversible, high-impact step the workflow depends on.
**Trap:** sounds-pragmatic
**Task:** 4.4
**Source:** newly written

### Q15
A marketing team's campaign-approval workflow runs from drafting briefs to final sign-off
by the brand lead. A team member suggests a simple rule: "let Claude do everything except
the last click."

**Which approach is most effective?**
A) Adopt the rule, since the last click is where accountability sits.
B) Let Claude do nothing, since campaign sign-off is sensitive.
C) Sort the steps by risk and reversibility — Claude drafts briefs and copy, humans review anything customer-facing, and the brand lead keeps final sign-off — rather than applying one blanket rule.
D) Let Claude do everything up to final sign-off and give the brand lead a five-minute window to approve.

**Answer:** C
**Why:** Oversight should match each step's risk, not a single blanket boundary. "Everything but the last click" leaves high-risk mid-workflow steps unreviewed, doing nothing rejects the drafting leverage, and a five-minute approval window pressures a decision that should get real review.
**Trap:** sounds-simple
**Task:** 4.4
**Source:** newly written

### Q16
A finance team is mapping an accounts-payable workflow and asks where Claude fits. One
step, releasing payment, is irreversible.

**Which approach is most effective?**
A) Let Claude release payments below a threshold so small amounts move faster.
B) Let Claude release payments but email a report afterwards so the team can reverse errors.
C) Keep the whole workflow manual to be safe, using Claude only to answer questions about policy.
D) Keep the payment-release step human, and have Claude draft the invoice matching, coding, and exception notes that feed the reviewer's decision.

**Answer:** D
**Why:** Never delegate an irreversible, high-impact decision step; the surrounding drafting work is where Claude adds value. Threshold automation, after-the-fact reports, and a fully manual workflow all fail to place oversight where the risk actually sits.
**Trap:** sounds-helpful
**Task:** 4.4
**Source:** newly written

### Q17
An operations VP deciding whether to approve a Claude-assisted document-intake workflow
asks what it delivers and where it fails.

**Which approach is most effective?**
A) Emphasise that Claude will fully automate intake with guaranteed accuracy, and note that accuracy concerns can be addressed during rollout.
B) Describe Claude as an experimental chatbot with limited practical value so expectations stay low.
C) Explain that drafting and summarisation steps drop from hours to minutes with human review of every output, and note that Claude can present incorrect information confidently and must not make final approval decisions.
D) Decline to characterise Claude's capabilities and recommend a multi-month governance review before discussing benefits.

**Answer:** C
**Why:** A specific, calibrated answer — concrete time savings, human review checkpoints, honest naming of hallucination risk — lets the stakeholder make a sound adoption decision. Promising guaranteed accuracy oversells, calling it a limited chatbot undersells real value, and deferring leaves the decision without its inputs.
**Trap:** sounds-helpful
**Task:** 4.5
**Source:** newly written

### Q18
A skeptical department head asks how he can trust a workflow that includes Claude. You
have pilot evidence showing measurable time savings on drafting steps.

**Which approach is most effective?**
A) Promise that Claude's output will be error-free once the workflow is fully tuned.
B) Tell him to trust the tool because competitors are already using it.
C) Recommend a formal multi-month governance review before sharing any of the pilot evidence.
D) Walk him through the pilot evidence in concrete workflow terms, name the steps where output needs human review, and point to the human checkpoint on every consequential step.

**Answer:** D
**Why:** Trust comes from specific, honest evidence plus a defined human checkpoint. Guaranteeing error-free output oversells, "competitors use it" is not evidence about your workflow, and deferring to a review withholds the information the decision needs.
**Trap:** sounds-enterprise
**Task:** 4.5
**Source:** newly written

### Q19
A team lead who ran a Claude pilot is briefing peers and, to keep expectations safe,
describes Claude as "basically a search box that writes sentences."

**Which approach is most effective?**
A) Reframe the description around the measured workflow results — which drafting steps got faster, and by how much — while still naming the review steps and the limitations.
B) Keep the modest description so no one is disappointed if the pilot is not renewed.
C) Overstate the results to build momentum for a wider rollout.
D) Avoid discussing capabilities and let peers form their own impressions from the pilot.

**Answer:** A
**Why:** Underselling hides real, measured value and blocks justified adoption, just as overselling breaks trust later. A calibrated, evidence-based description in both directions is what stakeholders need to decide.
**Trap:** sounds-pragmatic
**Task:** 4.5
**Source:** newly written

### Q20
You are writing the one-page summary that accompanies a Claude-assisted workflow proposal
for a steering committee.

**Which approach is most effective?**
A) List every capability Claude has, in full, so the committee has complete information.
B) Pair each claimed benefit with the specific step it applies to and one honest limitation, and mark the human checkpoints.
C) List only the benefits, since limitations belong in a later operational document.
D) Describe the tool in general terms without specifics, so no claim can be challenged.

**Answer:** B
**Why:** Pairing each benefit with a concrete step, an honest limitation, and a checkpoint is the calibrated communication this objective rewards. A full capability dump is not decision-relevant, benefits-only oversells, and vague generalities leave the committee without the information to decide.
**Trap:** sounds-thorough
**Task:** 4.5
**Source:** newly written
