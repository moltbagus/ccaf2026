# Domain 7 — Troubleshooting and Optimization (10%) — Question Bank (20 questions)

Coverage: 7.1 ×8, 7.2 ×6, 7.3 ×6.

Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful,
sounds-pragmatic, sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A monthly client-update summary produced sharp, specific drafts for months. This month
every draft is generic filler that could apply to any client. The prompt text itself has
not been edited, but last week the source report it summarizes was reorganized into a new
section layout.

**Which approach is most effective?**
A) Rewrite the prompt from scratch with fresh wording until the summaries sharpen again.
B) Compare last month's good draft with this month's failing one, identify that the reorganized source is the cause, and update the prompt to match the new layout.
C) Switch to a more capable model so the summaries recover their specificity.
D) Assign a person to enrich each month's draft by hand before it is sent.

**Answer:** B
**Why:** Output changed exactly when the source's structure changed, so the root cause is the mismatch between the prompt and the reorganized report; comparing the last good output against the failing one isolates that and points at the small fix. A full rewrite discards months of working instructions and replaces one unknown with another, a model switch spends cost on a problem the model did not cause, and hand-enriching every draft pays the same cost forever without removing the cause.
**Trap:** sounds-simple
**Task:** 7.1
**Source:** newly written

### Q2
An associate keeps asking Claude to "improve this proposal," and each revision comes back
polished but still missing the client's decision criteria and a clear recommendation. The
proposal text itself is complete and accurate.

**Which approach is most effective?**
A) State the audience, the decision the reader must make, and the required recommendation and length directly in the prompt.
B) Keep asking for "improve this even more" and repeat until the result happens to land.
C) Switch to a more capable model to infer what the reader needs.
D) Ask a colleague to rewrite the request for the associate.

**Answer:** A
**Why:** The output is polished but off-target because the ask was vague — it never named the audience or the decision the reader must make, so the model cannot supply them. Adding those specifics to the prompt fixes the cause. Repeating the same vague ask produces the same gap, a stronger model still has no audience to aim at, and having a colleague rewrite the request is a one-off workaround rather than a change to what generates the output.
**Trap:** sounds-smart
**Task:** 7.1
**Source:** newly written

### Q3
A research assistant asked Claude to summarize "the attached findings," but attached an
early internal draft instead of the final reviewed version. Claude's summary is coherent
and confident, but it states figures that were revised before the report was finalized.

**Which approach is most effective?**
A) Add an instruction telling Claude to flag any figures it is uncertain about.
B) Ask Claude to double-check its own summary for accuracy before returning it.
C) Recognize that the wrong document was supplied, attach the final reviewed version, and regenerate the summary from it.
D) Switch to a more capable model to produce a more accurate summary.

**Answer:** C
**Why:** The summary is wrong because the input was wrong — an early draft, not the final report — so the fix is to supply the correct source and regenerate. An instruction to flag uncertainty cannot make revised figures disappear, self-checking runs against the same flawed input, and a stronger model would faithfully summarize the same outdated draft.
**Trap:** sounds-thorough
**Task:** 7.1
**Source:** newly written

### Q4
An employee pastes a question about the company's current expense policy into a plain chat
with no company documents attached. The answer describes a generic expense process that
does not match the company's actual policy.

**Which approach is most effective?**
A) Add "use the company policy" to the message and resend it in the same chat.
B) Recognize that the answer came from general knowledge because the policy was never provided, and ask the question in the configured Project that holds the current policy documents.
C) Switch to a more capable model so it can recall the company's policy.
D) Paste the policy in by hand each time and edit the answer to match.

**Answer:** B
**Why:** The output is off because it was produced on the wrong surface — a bare chat with no access to the company's documents — so moving the question to the configured Project that holds the current policy fixes the cause. Adding a phrase to a chat with no policy attached cannot conjure the document, a stronger model still has no company policy to read, and pasting and editing by hand leaves the wrong surface in place for every future question.
**Trap:** sounds-simple
**Task:** 7.1
**Source:** newly written

### Q5
A project is connected to the team's shared drive so Claude can answer policy questions
from the latest documents. A key policy was updated in the drive last month, but Claude's
answers still describe the old process, and staff have started second-guessing every
answer.

**Which approach is most effective?**
A) Add an instruction telling Claude to always use the newest policy version.
B) Switch to a more capable model to reason about which version is correct.
C) Recognize that the connected source has not been refreshed to the updated document, update the connection so Claude reads the current version, and re-test a policy question.
D) Have staff manually correct answers until the old policy stops appearing.

**Answer:** C
**Why:** Claude answers from the material it is connected to, and the connection is still serving the pre-update document, so refreshing the source to the current version fixes every future answer at once. An instruction to "use the newest" cannot supply a document the source has not updated, a stronger model would read the same stale copy, and correcting answers by hand repeats the same cost indefinitely.
**Trap:** sounds-helpful
**Task:** 7.1
**Source:** newly written

### Q6
Output from a long-standing saved prompt dropped sharply this week, and no one can say
why. A colleague wants to start editing the prompt immediately.

**Which approach is most effective?**
A) Rewrite the prompt's wording and keep editing until quality returns.
B) Add more detail and constraints to strengthen the prompt.
C) Switch to a more capable model tier to lift quality.
D) Compare the most recent good output with the failing one to isolate exactly what changed, then fix only that.

**Answer:** D
**Why:** When output that used to work fails, the reliable first move is diagnosis — comparing the last good run against the failing one names the actual cause and points at the smallest fix. Rewriting, adding constraints, and switching models are all remedies chosen before any cause is known, so they spend effort while leaving the real failure in place.
**Trap:** sounds-smart
**Task:** 7.1
**Source:** newly written

### Q7
A single saved prompt asks Claude to research a topic, outline a document, draft it, format
it to the team template, and check every claim. The drafts come back long, and the middle
sections are consistently the weakest.

**Which approach is most effective?**
A) Split the work into separate reviewed steps — research, outline, draft, format, verify — so each job gets full attention.
B) Add stronger wording demanding high quality and thoroughness across all five tasks.
C) Switch to the most capable model and keep the single five-task prompt.
D) Run the prompt twice and merge the strongest sections by hand.

**Answer:** A
**Why:** The weak middle is a structural signal: five jobs are competing inside one response, so early requirements get attention and later ones get squeezed. Splitting the work into separate reviewed steps removes the competition and makes the weak step obvious. Demanding thoroughness asks the same single response to do more, not less; a stronger model raises the ceiling while the overload stays; running twice pays double for manual patchwork that leaves the structure failing.
**Trap:** sounds-thorough
**Task:** 7.1
**Source:** newly written

### Q8
A weekly report is assembled in several steps, and only the "key risks" section has gone
wrong — the rest of the report is fine. A teammate proposes rebuilding the whole workflow
from the beginning.

**Which approach is most effective?**
A) Rebuild the entire workflow from the start to be safe.
B) Diagnose the single failing step — check whether its input or its instruction changed — and fix only that step.
C) Add a reviewer to check the whole report every week.
D) Add extra instructions to every step so no part is missed.

**Answer:** B
**Why:** One section failing while the rest is fine localizes the fault to that step, so the efficient fix is to inspect that step's input and instruction and repair only it. Rebuilding the whole workflow throws away the parts that are working, a standing reviewer pays a permanent cost for a single-step problem, and adding instructions everywhere raises the competition between steps instead of removing the fault.
**Trap:** sounds-enterprise
**Task:** 7.1
**Source:** newly written

### Q9
A sales team reports that Claude's weekly product-update drafts read like engineering
documentation. The drafts are generated by a saved prompt in the team's project.

**Which approach is most effective?**
A) Simplify this week's draft by hand before it goes out to the team.
B) Ask each salesperson to rewrite their own portion before the update is sent.
C) Update the saved prompt and the project instructions to name the customer audience and plain language, then regenerate the next draft to confirm the fix.
D) Switch to a faster model tier so drafts arrive earlier and the team has more time to edit.

**Answer:** C
**Why:** The feedback points at the saved prompt's missing audience definition, so changing the prompt and project instructions makes the fix apply to every future draft, and regenerating confirms it worked. Hand-simplifying only this week's draft leaves next week's batch with the identical problem, having each salesperson rewrite their own part multiplies the manual effort, and a faster model changes when the draft arrives, not whether it fits the audience.
**Trap:** sounds-efficient
**Task:** 7.2
**Source:** newly written

### Q10
The same report is generated every Monday, but its format varies from week to week —
sometimes tight bullets, sometimes long paragraphs — so downstream staff reformat it every
time before it can be used.

**Which approach is most effective?**
A) Ask staff to standardize each report by hand as it arrives.
B) Add "be consistent" to the prompt and hope the format settles.
C) Switch models until one happens to produce a steady format.
D) Specify the exact required format in the saved prompt — the section order and the bullet style — so every run produces the same structure.

**Answer:** D
**Why:** Variable format is a missing-specification problem, so naming the exact structure in the saved prompt makes every run match and ends the manual reformatting. Asking staff to standardize by hand leaves the cause untouched, a vague "be consistent" gives the model nothing concrete to follow, and shopping for a model that happens to be steady is luck rather than a defined requirement.
**Trap:** sounds-simple
**Task:** 7.2
**Source:** newly written

### Q11
A saved prompt consistently omits the required "next steps" section, no matter how many
times the associate rephrases the other parts of the prompt.

**Which approach is most effective?**
A) Make the missing requirement explicit and specific in the saved prompt — name the section, its position, and what it must contain — rather than rephrasing unrelated parts.
B) Keep rephrasing the whole prompt each run until the section appears.
C) Add a general instruction to "include everything important."
D) Ask a colleague to add the section to each output afterward.

**Answer:** A
**Why:** The prompt keeps missing the same requirement because that requirement is never stated specifically, so making it explicit — the section, its place, its contents — fixes the cause. Rephrasing unrelated parts changes nothing about the missing section, a vague "include everything" gives the model no target, and having a colleague patch each output forever leaves the prompt producing the same gap.
**Trap:** sounds-helpful
**Task:** 7.2
**Source:** newly written

### Q12
After an hour of back-and-forth corrections, a chat's output keeps contradicting earlier
instructions, and every new fix introduces another problem. The conversation has
accumulated many corrections and several reversed decisions.

**Which approach is most effective?**
A) Keep patching with more corrections in the same conversation until it settles.
B) Start a fresh conversation and provide a clean summary of the confirmed requirements and decisions.
C) Switch to a more capable model inside the same conversation.
D) Ask the assistant to "forget everything and start over" within the same chat.

**Answer:** B
**Why:** When a conversation has accumulated contradictory corrections and reversed decisions, more patching adds to the conflict, so a clean restart that carries only the confirmed requirements removes it. Continuing to patch compounds the contradiction, a stronger model still reads the tangled history, and telling the assistant to "forget everything" inside the same chat leaves the conflicting record in place.
**Trap:** sounds-pragmatic
**Task:** 7.2
**Source:** newly written

### Q13
A long drafting session began with an outline that has since been revised three times. New
output still reflects the old structure and ignores the revisions. The work is far enough
along that restarting feels wasteful.

**Which approach is most effective?**
A) Keep correcting the output until it matches the current outline.
B) Add an instruction to "use the latest outline" and continue.
C) Switch to a more capable model to reconcile the versions.
D) Restart with a clean prompt built from the current outline, carrying forward only the confirmed content.

**Answer:** D
**Why:** The session's output keeps reverting to a superseded structure, so continuing to correct it fights the accumulated context; restarting from the current outline with only the confirmed content forward fixes the cause. Correcting indefinitely repeats the same failure, a single instruction cannot outweigh the stale structure already in the conversation, and a stronger model would still be working from the outdated outline.
**Trap:** sounds-efficient
**Task:** 7.2
**Source:** newly written

### Q14
A team retypes the same background, tone, and format instructions into the chat at the
start of every task, and results still vary from one team member to the next.

**Which approach is most effective?**
A) Move the recurring background, tone, and format into saved project instructions so every task starts from the same defined setup.
B) Have each member write a better one-off prompt each time.
C) Switch the whole team to the most capable model.
D) Accept the variation and fix outputs by hand as they arrive.

**Answer:** A
**Why:** Consistency comes from a single defined setup that every run reads, so moving the recurring instructions into saved project instructions removes the person-to-person variation at its source. One-off prompts re-introduce variation each time, a stronger model does not standardize instructions that differ between users, and fixing outputs by hand leaves the inconsistency in place.
**Trap:** sounds-smart
**Task:** 7.2
**Source:** newly written

### Q15
A research team routes every question through the same heavyweight process — a deep
analysis on the most capable model with a ten-section output — including quick one-line
checks. Costs and turnaround keep climbing.

**Which approach is most effective?**
A) Keep the heavyweight process for everything so quality never drops.
B) Cut the process down for every task, including genuinely complex analysis.
C) Match the treatment to the task: quick questions get a short prompt and a fast model, and only genuinely complex analysis gets the deep treatment.
D) Add more reviewers to the heavyweight process to speed it up.

**Answer:** C
**Why:** The cost and delay come from a mismatch — heavyweight treatment applied to trivial questions — so matching the approach to the task removes the waste while preserving depth where it matters. Keeping the heavy process for everything preserves the waste, flattening everything to shallow treatment starves the complex work, and adding reviewers to a process that is already too heavy only adds cost.
**Trap:** sounds-enterprise
**Task:** 7.3
**Source:** newly written

### Q16
To cut costs, a team switched all requests — including complex multi-source analysis — to
the fastest model with a short one-paragraph format. Turnaround improved, but the complex
analyses now miss key findings and are being redone.

**Which approach is most effective?**
A) Keep the fast model for everything and accept weaker analyses.
B) Return every task, simple or complex, to the most capable model.
C) Add a reviewer to catch weak analyses after the fact.
D) Match the treatment to the task: keep the fast model for simple requests and route genuinely complex analysis to the deeper treatment.

**Answer:** D
**Why:** The redesign overcorrected — flattening complex analysis to a fast, shallow path starves it — so matching treatment to task keeps the savings on simple work while restoring depth for the analyses that need it. Keeping the fast model for everything accepts the rework, sending everything back to the top model restores the original cost problem, and a reviewer catches failures after they have already cost a redo.
**Trap:** sounds-efficient
**Task:** 7.3
**Source:** newly written

### Q17
A weekly analysis is delivered as a ten-section document, but staff report they only ever
read the first two sections. The remaining eight sections add cost and delay with no
reader.

**Which approach is most effective?**
A) Redesign the output to what the audience actually reads — lead with the two sections they use and drop or condense the rest.
B) Keep all ten sections and instruct readers to skim faster.
C) Add a summary section on top of the ten existing sections.
D) Switch to a faster model to reduce the delay.

**Answer:** A
**Why:** Effectiveness means the output fits its audience, and eight unread sections are pure cost, so redesigning the output to what readers use removes the waste at the source. Keeping the sections and asking readers to skim leaves the cost in place, adding a summary on top increases the volume nobody reads, and a faster model shortens the delay without removing the unread work.
**Trap:** sounds-thorough
**Task:** 7.3
**Source:** newly written

### Q18
A knowledge assistant's answers are accurate but built on a process document that was
replaced two months ago, so its guidance quietly drifts from current practice. The
outdated document is still the one in the project's knowledge.

**Which approach is most effective?**
A) Add an instruction telling Claude to prefer current practice over the document.
B) Recognize the stale source and update the project's knowledge with the current process document, then re-test.
C) Move the assistant to a more capable model.
D) Have staff flag outdated answers as they appear.

**Answer:** B
**Why:** Claude can only be as current as the material it is given, so the replaced document is the root cause and updating the project's knowledge fixes every future answer at once. An instruction to "prefer current practice" cannot supply information the source lacks, a stronger model would read the same outdated document, and flagging answers after they appear is a permanent manual tax on a problem that a source update removes.
**Trap:** sounds-helpful
**Task:** 7.3
**Source:** newly written

### Q19
A workflow includes a manual approval step that every output passes through. Data shows
the approval has never changed an output in six months, but it adds two days to every
request.

**Which approach is most effective?**
A) Keep the step in place to be safe.
B) Add a second reviewer to the step to make it worthwhile.
C) Remove the step that adds delay without value, and confirm outputs are still acceptable.
D) Replace the step with a faster model.

**Answer:** C
**Why:** A step that never changes an output and costs two days is pure overhead, so removing it optimizes the workflow, with a confirmation that outputs are still acceptable. Keeping it "to be safe" preserves a cost with no demonstrated benefit, adding a reviewer doubles down on the same waste, and a faster model does not address a step whose value is the problem.
**Trap:** sounds-enterprise
**Task:** 7.3
**Source:** newly written

### Q20
A team simplified its workflow — shorter prompts, a faster model for routine tasks, a
trimmed output. Leadership asks whether the change actually helped.

**Which approach is most effective?**
A) Assume the change helped because the workflow feels lighter than before.
B) Ask the team whether it seems faster now.
C) Add a new review step to double-check the results.
D) Measure after the change — compare turnaround, cost, and output quality against the previous workflow — to confirm the optimization worked.

**Answer:** D
**Why:** An optimization is verified by measurement, so comparing turnaround, cost, and output quality against the previous workflow confirms whether the change actually helped. Assuming it helped from a feeling and asking the team for an impression both substitute belief for evidence, and adding a review step adds cost without answering whether the optimization worked.
**Trap:** sounds-pragmatic
**Task:** 7.3
**Source:** newly written
