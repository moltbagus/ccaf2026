# Domain 3 — Product and Model Selection (12%) — Question Bank (20 questions)

Coverage: 3.1 ×5, 3.2 ×5, 3.3 ×6, 3.4 ×4.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful,
sounds-pragmatic, sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A compliance team starts every conversation by pasting the same 30-page policy manual and a
set of tone rules, and each session ends with the manual pasted again so the next analyst can
pick it up. The manual almost never changes.

**Which approach is most effective?**
A) Keep pasting the manual each session but compress it to a summary first.
B) Switch the team to the most capable model so it retains the manual across sessions.
C) Create a Project for the policy work, upload the manual and tone rules as project knowledge, and run every conversation inside it.
D) Save the manual to a shared drive and link it at the top of each new chat.

**Answer:** C
**Why:** Recurring context belongs in a Project, where it is loaded once and every conversation inside starts already primed. Compressing still repeats the manual work, a more capable model does not carry memory across separate chats, and a link on a shared drive leaves the manual outside the conversation.
**Trap:** sounds-efficient
**Task:** 3.1
**Source:** newly written

### Q2
A strategy lead must survey the current landscape of a fast-moving market — many sources, no single answer — and wants the findings cited before drafting a brief.

**Which approach is most effective?**
A) Ask chat to draft the brief directly from the lead's existing knowledge.
B) Use research mode to search broadly and return cited findings, then draft the brief from them.
C) Ask Claude to list every source it can recall from training on the topic.
D) Paste three articles into chat and ask for a summary.

**Answer:** B
**Why:** Research mode is built for breadth with sources: it searches extensively and returns cited findings, at the cost of taking longer. Recall from training fabricates sources, three pasted articles narrow the survey, and drafting from existing knowledge supplies no sourcing at all.
**Trap:** sounds-thorough
**Task:** 3.1
**Source:** newly written

### Q3
A consultant drafts a client proposal over many rounds of edits. The client wants to see each revision and compare versions, and the consultant keeps losing track of the latest draft in the scrollback.

**Which approach is most effective?**
A) Develop the proposal as an artifact so each revision stays editable and versioned in one place.
B) Keep drafting in chat and scroll back to copy the latest version each time.
C) Restart a fresh chat for every revision so the versions stay separate.
D) Ask Claude to reprint the entire proposal at the end of every message.

**Answer:** A
**Why:** Artifacts are the editable output layer: a deliverable lives in a panel you revise version by version instead of hunting through scrollback. Scrolling back is exactly the failure being described, splitting revisions across chats severs the comparison, and reprinting the whole document each turn bloats the conversation.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q4
An associate needs one quick answer to a single factual question about a public policy and will not return to the topic afterward.

**Which approach is most effective?**
A) Build a Project with uploaded policy documents to house the question.
B) Run research mode to produce a sourced report on the topic.
C) Set up a reusable artifact to store the answer for future reference.
D) Ask the question in a regular chat, since it is a one-off with no recurring context.

**Answer:** D
**Why:** Chat is the default surface for one conversation and one task with nothing carried over. Standing up a Project, a research report, or an artifact for a single throwaway question spends setup on context that never recurs.
**Trap:** sounds-enterprise
**Task:** 3.1
**Source:** newly written

### Q5
A product team runs weekly review conversations against the same product spec and needs a living "known issues" document that everyone edits between sessions.

**Which approach is most effective?**
A) Paste the spec into each weekly chat and keep the issues in a chat message.
B) Put the spec in a Project as project knowledge and maintain the known-issues document as an artifact.
C) Email the spec before each meeting and draft issues in a fresh chat.
D) Use research mode each week to rediscover the spec from the web.

**Answer:** B
**Why:** Two recurring patterns, two surfaces: the unchanged spec belongs in a Project, and the living deliverable belongs in an artifact that stays editable across sessions. Re-pasting and emailing repeat work, and rediscovering the spec from the web adds sourced breadth nobody asked for.
**Trap:** sounds-helpful
**Task:** 3.1
**Source:** newly written

### Q6
A support operation must classify thousands of incoming messages into categories overnight. Speed and cost matter, and the categories are well defined.

**Which approach is most effective?**
A) Use the fast, low-cost tier for the classification and reserve the most capable tier for cases that genuinely need judgment.
B) Use the most capable tier for all messages so the classification is as accurate as possible.
C) Run every message through two tiers and reconcile the results.
D) Switch to a different platform that advertises cheaper generation.

**Answer:** A
**Why:** The task is high-volume and shallow, so the fast tier fits and the capable tier is reserved for the judgment cases. The top tier by reflex pays premium reasoning across the whole batch, a double pass doubles the cost for no gain, and switching platforms abandons a trade-off that exists everywhere.
**Trap:** sounds-smart
**Task:** 3.2
**Source:** newly written

### Q7
A general counsel must analyze a complex, ambiguous contract clause with significant legal exposure and produce a nuanced risk assessment.

**Which approach is most effective?**
A) Use the fast tier to save time, then have a junior lawyer review the output.
B) Use the balanced tier, since most business work is balanced.
C) Use the most capable tier, because complex reasoning and high-stakes judgment justify the extra cost and latency.
D) Use the fast tier with a longer, more detailed prompt to make up for the depth.

**Answer:** C
**Why:** This is the deep, low-volume corner where the extra capability earns its cost and wait. A fast tier plus junior review still starts from a shallow analysis, "most work is balanced" ignores this task's specific demand, and a longer prompt does not add reasoning depth.
**Trap:** sounds-pragmatic
**Task:** 3.2
**Source:** newly written

### Q8
A marketing manager drafts weekly campaign briefs and short competitive analyses — routine business writing where quality and speed both matter and the volume is moderate.

**Which approach is most effective?**
A) Use the fast tier for everything to keep costs low.
B) Use the most capable tier for every brief to guarantee quality.
C) Use research mode for every brief to add sources.
D) Use the balanced tier as the default, escalating only briefs that prove unusually complex.

**Answer:** D
**Why:** Everyday business work is the balanced tier's home: it holds quality and speed together and escalates only the outliers. The fast tier risks quality on work that is not purely volume, the top tier overspends by reflex, and research mode adds sourced breadth this drafting task never asked for.
**Trap:** sounds-efficient
**Task:** 3.2
**Source:** newly written

### Q9
A team lead believes the Claude models are effectively interchangeable, picks whichever is the default each time, and is puzzled that some tasks feel slow while others feel shallow.

**Which approach is most effective?**
A) Always pick the most capable model so the differences stop mattering.
B) Match the tier to the task: fast tier for high-volume simple work, balanced for everyday work, most capable for complex or high-stakes reasoning.
C) Pick the fastest tier for everything to avoid slowness.
D) Alternate tiers randomly so the load stays even.

**Answer:** B
**Why:** The three tiers trade capability against speed and cost, and the exam tests naming that trade. A single tier for everything is exactly the reflex causing the mixed results; the top tier overspends and the fast tier underserves, and random selection is not selection at all.
**Trap:** sounds-simple
**Task:** 3.2
**Source:** newly written

### Q10
An operations manager routes every task — ticket triage, one-page summaries, and a client-recovery plan — through the most capable model. The queue is falling behind and costs are climbing.

**Which approach is most effective?**
A) Move routine triage and short summaries to the fast tier and keep the most capable tier for the client-recovery plan.
B) Keep everything on the most capable tier but instruct it to answer faster.
C) Move everything to the fast tier, including the recovery plan, to clear the queue.
D) Open more parallel conversations on the most capable tier to catch up.

**Answer:** A
**Why:** Match tiers per task, not per person: the shallow high-volume work drops to the fast tier while the high-stakes deliverable keeps the depth it needs. A speed instruction does not change what the top tier costs, moving everything to the fast tier risks the recovery plan, and adding parallel top-tier conversations multiplies the waste.
**Trap:** sounds-helpful
**Task:** 3.2
**Source:** newly written

### Q11
A PM must turn 40 internal team emails into a daily leadership digest by 9 a.m. The content is routine and internal.

**Which approach is most effective?**
A) Run the digest on the most capable tier so nothing is missed.
B) Have a person read all 40 emails to be safe.
C) Use the fast tier, because high volume and a tight turnaround with low per-item risk make speed and cost the binding constraints.
D) Use research mode to source background on each email's topic.

**Answer:** C
**Why:** Name the binding constraint first: here it is speed and cost, so the fast tier protects the corner the task cannot lose. The top tier overspends on routine internal work, manual reading is the throughput bottleneck itself, and research mode adds sourced breadth while letting the digest slip.
**Trap:** sounds-thorough
**Task:** 3.3
**Source:** newly written

### Q12
The same PM must also produce a client-facing strategy narrative that will anchor a seven-figure renewal discussion.

**Which approach is most effective?**
A) Draft it with the fast tier and patch it manually if time allows.
B) Reuse the internal digest's fast-tier output as the narrative.
C) Use the balanced tier because it is the safe middle.
D) Develop it with the most capable tier, because one weak deliverable costs more than the extra usage ever will.

**Answer:** D
**Why:** Here the binding constraint is quality, so the capable tier is the fit. A fast-tier draft patched by hand risks the renewal on cleanup, the internal digest was written for a different audience, and "the safe middle" is a reflex, not a reading of this task's stakes.
**Trap:** sounds-pragmatic
**Task:** 3.3
**Source:** newly written

### Q13
A team runs a broad mix of everyday work — drafting, analysis, routine summaries — with occasional complex items. Today everything goes through the most capable tier.

**Which approach is most effective?**
A) Keep the top tier for all tasks to maintain a single standard.
B) Default to the balanced tier and escalate only the items that prove they need more depth.
C) Move everything to the fast tier to cut cost.
D) Build a separate workflow for every task type before doing any work.

**Answer:** B
**Why:** Mixed everyday work defaults to the balanced tier, escalating only the items that earn it. A single top-tier standard overspends by reflex, moving everything to the fast tier underserves the complex items, and pre-building a workflow per task type is setup the work has not yet justified.
**Trap:** sounds-enterprise
**Task:** 3.3
**Source:** newly written

### Q14
A nonprofit must respond to a high volume of short donor thank-you notes on a tight budget. A template plus light personalization is enough.

**Which approach is most effective?**
A) Use the fast, low-cost tier for the bulk, since per-item depth adds little and the cost multiplies across the volume.
B) Use the most capable tier so every donor gets the best possible note.
C) Use the most capable tier but shorten the prompts to control cost.
D) Switch to a different platform to find cheaper generation.

**Answer:** A
**Why:** Cost is the binding constraint and the work is shallow, so the fast tier fits and depth adds little. The top tier spends premium reasoning on templated notes, shortening prompts does not change the tier's price, and switching platforms dodges a trade-off that exists on every platform.
**Trap:** sounds-smart
**Task:** 3.3
**Source:** newly written

### Q15
A board-facing risk memo will be read by regulators and must be precise. There is no hard deadline pressure and the volume is a single document.

**Which approach is most effective?**
A) Use the fast tier, since only one document is needed.
B) Split the memo across the fast tier and stitch the sections together.
C) Use the most capable tier, because quality is the binding constraint and one weak sentence carries real cost.
D) Use the balanced tier and hope it is enough.

**Answer:** C
**Why:** Low volume plus high stakes points at the capable tier, where depth is worth the cost and wait. Low volume is not a reason to under-serve it, stitching fast-tier sections loses the through-line, and "hope it is enough" is not alignment with a regulator-facing standard.
**Trap:** sounds-efficient
**Task:** 3.3
**Source:** newly written

### Q16
A week-long working thread has accumulated research notes, abandoned drafts, and side questions. Claude now contradicts instructions set early on, but the analysis must continue with the agreed constraints.

**Which approach is most effective?**
A) Switch to the most capable model in the same thread so it holds the history more reliably.
B) Ask Claude to summarize the decisions, constraints, and next steps, then continue in a fresh chat from that summary.
C) Keep the thread and re-paste the original instructions at the bottom of each new message.
D) Start a completely fresh chat with no summary and restate the task from memory.

**Answer:** B
**Why:** The work must continue with established decisions, so summarize to compress what matters and restart to restore usable context. A model upgrade does not recover instructions crowded out of a full thread, re-pasting adds load to the very overload causing the failures, and a bare restart discards the constraints the continuation depends on.
**Trap:** sounds-helpful
**Task:** 3.4
**Source:** newly written

### Q17
A conversation that began as a market analysis has drifted into unrelated drafting and side questions. The original analysis is finished and will not be revisited.

**Which approach is most effective?**
A) Keep the thread and paste the analysis conclusion again to anchor it.
B) Upgrade to the most capable model within the thread.
C) Summarize the entire thread before continuing in a new chat.
D) Start a fresh chat for the new work, since the original task is done and the thread has drifted.

**Answer:** D
**Why:** Restart is the move when the task has changed or the thread has hopelessly drifted and nothing needs carrying forward. Re-pasting anchors the drift, a model upgrade does not clear the thread, and summarizing spends effort compressing history the new task does not need.
**Trap:** sounds-thorough
**Task:** 3.4
**Source:** newly written

### Q18
Every new chat a consultant starts requires re-establishing the same brand voice and client background. The material almost never changes.

**Which approach is most effective?**
A) Move the stable brand voice and client background into a Project so no conversation has to re-establish it.
B) Paste the background into each new chat but keep it in a saved note.
C) Ask the most capable model to remember it between chats.
D) Summarize the background at the start of every chat.

**Answer:** A
**Why:** When context recurs across sessions, persist it: a Project loads stable instructions and knowledge once for every conversation inside it. A saved note still requires the pasting, a more capable model does not remember across separate chats, and summarizing every time is the recurring cost the Project removes.
**Trap:** sounds-enterprise
**Task:** 3.4
**Source:** newly written

### Q19
A long thread keeps forgetting constraints set early on. A teammate suggests switching to the most capable model to fix it.

**Which approach is most effective?**
A) Switch to the most capable model and continue in the same thread.
B) Paste the constraints again at the bottom of each message.
C) Treat it as a memory problem: summarize the constraints and continue in a fresh chat, since a more capable model does not restore context crowded out of a full thread.
D) Increase the length limit so more of the thread fits.

**Answer:** C
**Why:** A degraded long conversation is a memory problem, not a model problem. Depth does not restore forgotten instructions, re-pasting adds load to an already-full context, and more capacity for a crowded thread keeps the drift rather than clearing it.
**Trap:** sounds-smart
**Task:** 3.4
**Source:** newly written

### Q20
A manager wants Claude to make the final hiring decision for a candidate and to sign off on the legal sufficiency of a contract, with no human review.

**Which approach is most effective?**
A) Use the most capable tier so the decisions are as reliable as possible.
B) Recognize these are tasks requiring human accountability and judgment — use Claude to organize information and draft, but keep the hiring decision and legal sign-off with a person.
C) Use research mode to gather more sources before deciding.
D) Split the decision across two models and go with the majority.

**Answer:** B
**Why:** Some tasks carry accountability and judgment that must stay with a person; the model can assist by organizing information and drafting, but not own the decision. A more capable tier does not transfer accountability, more sources do not make a hiring call the model's to make, and a two-model majority vote is still an unreviewed automated decision.
**Trap:** sounds-pragmatic
**Task:** 3.3
**Source:** newly written
