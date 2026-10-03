# Domain 5 — Configuration and Knowledge Management (12%) — Question Bank (20 questions)

Coverage: 5.1 ×5, 5.2 ×5, 5.3 ×5, 5.4 ×5.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A regional sales team's reps each retype the same product positioning and tone rules into
every new Claude conversation. Outputs vary from rep to rep, and they drift whenever
someone forgets a rule.

**Which approach is most effective?**
A) Create a shared Project holding the positioning and tone rules as custom instructions, with the approved messaging deck as knowledge, and have reps work inside it.
B) Save the rules in a shared document so reps can copy and paste them faster.
C) Ask each rep to keep a personal checklist of context to paste before every request.
D) Ask Claude to infer the house style from each rep's past conversations.

**Answer:** A
**Why:** A Project makes the context structural — every conversation inside it inherits the instructions and knowledge without depending on anyone remembering. A faster paste still fails the day it is skipped, a personal checklist is discipline rather than configuration, and chats do not carry reliable memory across conversations.
**Trap:** sounds-simple
**Task:** 5.1
**Source:** newly written

### Q2
A team already has a Project, but its custom instructions field is empty. Instead, someone
pastes a one-page "context brief" at the top of every conversation because it feels faster
than filling out the instructions box.

**Which approach is most effective?**
A) Keep pasting the brief, since it is faster than configuring the instructions field.
B) Move the brief's standing rules into the Project's custom instructions so every conversation inherits them, and keep only request-specific detail in the chat.
C) Save the brief as a knowledge file and leave the instructions field empty.
D) Ask Claude to re-read the previous conversation's brief at the start of each new chat.

**Answer:** B
**Why:** Standing rules belong in the Project's instructions, where they apply to every conversation automatically; only the parts that change per request belong in the chat. Leaving the field empty and relying on a knowledge file or on Claude re-reading past chats keeps the setup dependent on manual effort.
**Trap:** sounds-efficient
**Task:** 5.1
**Source:** newly written

### Q3
A Project's knowledge contains both the current employee handbook and a superseded draft
of the same handbook. Claude sometimes cites figures from the draft.

**Which approach is most effective?**
A) Add an instruction to prefer the current handbook while keeping both files in place.
B) Rename both files so the current one sorts alphabetically first.
C) Remove the superseded draft from the Project's knowledge so only the current handbook remains.
D) Ask users to double-check every figure against the handbook before using an output.

**Answer:** C
**Why:** An old copy left in the Project competes with the new one and Claude has no way to know which wins, so the fix is to prune it, not to supplement it. A preference instruction still leaves the competing source, renaming does not change what the model reads, and pushing verification onto users pays the tax on every output.
**Trap:** sounds-helpful
**Task:** 5.1
**Source:** newly written

### Q4
An onboarding team wants every new hire to get consistent answers. Today each hire starts
their own chat from scratch and receives different guidance depending on how they phrase
the question.

**Which approach is most effective?**
A) Paste the entire 200-page handbook into the first message of each new hire's chat so nothing is missed.
B) Have a senior staffer answer new-hire questions directly instead of using Claude.
C) Tell new hires to search past chats for a relevant answer before asking.
D) Create an onboarding Project with the policy handbook as knowledge and role-specific instructions, and direct all hires to it.

**Answer:** D
**Why:** A Project gives every new hire the same instructions and knowledge automatically, so answers stay consistent without anyone re-supplying context. Pasting the whole handbook per chat is thorough but unmanageable, routing questions to a person abandons the setup, and searching past chats depends on someone having asked before.
**Trap:** sounds-thorough
**Task:** 5.1
**Source:** newly written

### Q5
A 40-person department wants one standard Claude setup for recurring client work. A
manager proposes building a bespoke, centrally provisioned enterprise knowledge base with
its own approval process before anyone can standardise.

**Which approach is most effective?**
A) Build one shared team Project with the department's standard instructions and knowledge, and have everyone use it for client work.
B) Let each employee build a personal Project so the setup matches their individual working style.
C) Assign one person to paste the department context into each new conversation on the team's behalf.
D) Wait for a bespoke enterprise template to be procured before standardising anything.

**Answer:** A
**Why:** One shared Project is the durable way to standardise a team's context: everyone inherits the same instructions and knowledge, and updates reach the whole team at once. Personal Projects fragment the standard, a designated paster depends on one person, and blocking on a heavyweight procurement delays a setup a Project already provides.
**Trap:** sounds-enterprise
**Task:** 5.1
**Source:** newly written

### Q6
A sales Project was given an uploaded copy of the pricing sheet. Finance now revises prices
in Google Drive every month, and Claude keeps quoting last month's numbers.

**Which approach is most effective?**
A) Keep the upload but instruct Claude that prices may be outdated and to hedge its answers.
B) Connect the Project to Google Drive so it references the pricing sheet at its source, and remove the stale uploaded copy.
C) Re-upload the current pricing sheet at the start of every week so the copy stays fresh.
D) Instruct the sales team to verify every price Claude quotes against the Drive file before sending anything.

**Answer:** B
**Why:** A connector makes currency structural — the Project reads the version that exists now — and removing the stale upload eliminates the competing copy. Hedging instructions teach Claude to be vague instead of correct, weekly re-uploads are a manual sync loop that fails the week it is skipped, and per-quote verification pays the staleness tax on every message.
**Trap:** sounds-pragmatic
**Task:** 5.2
**Source:** newly written

### Q7
A Project's knowledge is a mix of stable and living material: a finished brand book that
rarely changes, and a weekly status log that lives in Gmail. Everything was uploaded as
files at setup.

**Which approach is most effective?**
A) Re-upload every file at the start of each week so nothing is more than seven days old.
B) Keep everything as uploads and add an instruction telling Claude to flag any answer that might be outdated.
C) Keep the stable brand book as an upload, and connect Gmail so the weekly status log is read at its source.
D) Ask Claude to notice when an uploaded file looks stale and pull the current version from its original location automatically.

**Answer:** C
**Why:** Pick the source type by change rate: upload what is stable, connect what changes. The brand book is a snapshot that belongs as an upload; the status log changes weekly and belongs behind a connector. Weekly re-uploads are a manual loop, a flagging instruction makes Claude vague rather than current, and uploads cannot fetch their own newer versions.
**Trap:** sounds-smart
**Task:** 5.2
**Source:** newly written

### Q8
A team connects their Project to an entire shared drive so Claude "always has everything."
Answers now mix in unrelated files and outdated drafts, and quality drops.

**Which approach is most effective?**
A) Add an instruction telling Claude to ignore the files it does not need.
B) Connect to more drives so Claude has even more context to choose from.
C) Tell users to phrase their questions more precisely so Claude picks the right files.
D) Narrow the connector to the specific folders the Project actually needs, so the knowledge set stays relevant and curated.

**Answer:** D
**Why:** Managing connectors means scoping them to the material the Project actually needs, not granting blanket access and hoping the model filters. An ignore instruction leaves the noise in scope, more drives add more of it, and pushing the problem onto users' phrasing does not change what is connected.
**Trap:** sounds-simple
**Task:** 5.2
**Source:** newly written

### Q9
A support Project is connected to a shared Gmail inbox, and the connected label includes an
archive of resolved tickets from three years ago that no longer reflect current process.
Agents report Claude quoting retired procedures.

**Which approach is most effective?**
A) Restrict the connected mailbox scope to the current-process labels the Project needs, so retired material is out of scope.
B) Add a note to the instructions listing which old procedures to ignore.
C) Keep the full connection but ask Claude to weigh recent emails more heavily.
D) Have agents open the current procedure manually whenever Claude cites an old one.

**Answer:** A
**Why:** Scoping the connector removes the retired material from the knowledge set entirely, which is the durable fix. An ignore list is brittle and must be maintained, weighting recency leaves the old material in scope, and manual correction repairs one answer while the connection keeps supplying the outdated procedure.
**Trap:** sounds-helpful
**Task:** 5.2
**Source:** newly written

### Q10
A Project's knowledge holds the same policy twice — as an uploaded PDF and through a
connected folder. When the policy changed, the PDF was updated but the folder still holds
the old copy, and Claude sometimes cites the outdated version.

**Which approach is most effective?**
A) Tell Claude the PDF is authoritative and hope it prefers the correct copy.
B) Remove the duplicate and keep one authoritative source for the policy, so Claude cannot pick the outdated copy.
C) Keep both so Claude has redundancy if one source becomes unavailable.
D) Add version numbers to both files' names so the newer one is obvious.

**Answer:** B
**Why:** Two copies of the same document compete, and Claude has no reliable way to choose between them; the fix is to keep a single source of truth. A preference instruction and filename version numbers are hints rather than guarantees, and redundancy here guarantees that one copy will drift out of date.
**Trap:** sounds-efficient
**Task:** 5.2
**Source:** newly written

### Q11
A Project's custom instructions read "Be accurate, thorough, and helpful." Every week the
team re-explains that risk summaries must be one page, in plain language, list the top
three risks, and cite the source file.

**Which approach is most effective?**
A) Make the instructions longer and more encouraging so Claude tries harder.
B) Add a calendar reminder for the team to restate the format every Monday.
C) Rewrite the custom instructions to state the concrete requirements: one-page risk summary, plain language, top three risks, and cite the source file.
D) Paste an example risk summary into each conversation whenever the format comes out wrong.

**Answer:** C
**Why:** The format rule is standing policy, so it belongs as concrete, enforceable instructions the Project applies every time. Encouraging adjectives add no decision information, a weekly reminder manages the symptom instead of removing it, and pasting examples per conversation re-supplies context the configuration should already carry.
**Trap:** sounds-thorough
**Task:** 5.3
**Source:** newly written

### Q12
A department's Project instructions run to 2,000 words mixing hard rules, aspirational
values, and company history. Outputs are inconsistent and the rules are sometimes ignored.

**Which approach is most effective?**
A) Keep the long document but add a summary at the top highlighting the rules that matter most.
B) Split the document across several Projects so each set of instructions is shorter.
C) Formalise the instructions as a governed policy document with an approval and review workflow before any change is allowed.
D) Trim the instructions to the specific, enforceable rules — audience, format, authoritative source, hard constraints — and remove aspirational filler.

**Answer:** D
**Why:** Effective instructions name the audience, format, source, or a hard rule; length and ceremony are not specificity. A summary over an unfocused document still leaves the filler, splitting it across Projects fragments the standard, and a governance workflow adds process without making the rules any more enforceable.
**Trap:** sounds-enterprise
**Task:** 5.3
**Source:** newly written

### Q13
A Project's instructions say "use the house style guide for all formatting," but no one has
specified which file is the house style guide, and three candidate guides sit in the
knowledge.

**Which approach is most effective?**
A) Name the authoritative file explicitly in the instructions so Claude knows which guide governs formatting.
B) Tell Claude to average the three guides so no guide is left out.
C) Remove the instruction and let each user specify the guide every time.
D) Paste all three guides' contents into the instructions so the rule is self-contained.

**Answer:** A
**Why:** An instruction that points at a source must name that source; otherwise the rule cannot be enforced. Averaging guides produces a style none of them defines, dropping the instruction re-supplies context per session, and copying every guide into the instructions duplicates knowledge that belongs in a file.
**Trap:** sounds-pragmatic
**Task:** 5.3
**Source:** newly written

### Q14
A manager proposes adding "always reason like a top-tier strategy consultant and use
advanced frameworks" to a Project's instructions, believing it will raise the quality of
outputs. The concrete requirements already produce the desired result.

**Which approach is most effective?**
A) Add the line, since framing Claude as an expert can only improve its output.
B) Keep only the specific, enforceable requirements; the aspirational framing adds no decision information and cannot be enforced.
C) Replace the concrete requirements with the consultant framing.
D) Add several such expert framings to reinforce the effect.

**Answer:** B
**Why:** Instructions earn their place by naming audience, format, source, or a hard rule; flattering role framing gives the model nothing it can act on. If the concrete requirements already produce the desired output, adding aspirational language at best does nothing and at worst crowds out the rules that work.
**Trap:** sounds-smart
**Task:** 5.3
**Source:** newly written

### Q15
A Project's instructions tell Claude "don't make the memos too long." Memos still come back
at the wrong length.

**Which approach is most effective?**
A) Add "please" and "really" to the instruction to strengthen it.
B) Repeat the length rule at the start of every conversation.
C) Replace the negative, unmeasurable rule with a concrete one: every memo is at most one page.
D) Ask Claude at the end of each session whether it followed the length rule.

**Answer:** C
**Why:** Say what to do, not only what to avoid, and make it measurable; "not too long" gives no threshold to enforce, while "at most one page" does. Emphasis words add nothing, repeating the rule per conversation re-supplies context, and asking Claude to self-report is not a control.
**Trap:** sounds-simple
**Task:** 5.3
**Source:** newly written

### Q16
A company extended its returns window from 30 to 60 days and dropped the restocking fee in
July. The support Project still holds the January policy file, and an associate has been
manually correcting the return window in each of Claude's draft replies for two weeks.

**Which approach is most effective?**
A) Keep correcting the return window manually, since the associate is already fast at it.
B) Add an instruction that return-window answers may have changed, so Claude is less certain about policy details.
C) Have the support team verify every policy detail against the company intranet themselves.
D) Replace the outdated policy file in the Project with the current one and review the custom instructions for anything else the policy change affects.

**Answer:** D
**Why:** The stale file is the root cause, so replacing it in the Project fixes every future conversation at once. Manual correction leaves the wrong source producing the next wrong draft, a hedging instruction makes Claude vague instead of correct, and routing humans to the intranet for every detail abandons the Project's purpose when a one-time update restores it.
**Trap:** sounds-helpful
**Task:** 5.4
**Source:** newly written

### Q17
A compliance Project's knowledge was set up 18 months ago and has not been touched since,
even though the underlying regulations are reviewed quarterly. The outputs still look
confident and polished.

**Which approach is most effective?**
A) Put the Project on a review schedule tied to the regulation's quarterly cadence, and update the knowledge and instructions whenever the regulation changes.
B) Leave it as it is, since the polished outputs show the configuration is still correct.
C) Set up a job that re-uploads the existing files every quarter so the Project looks maintained.
D) Add an instruction telling Claude to caveat anything that might be out of date.

**Answer:** A
**Why:** A configuration is correct as of a date, and staleness is silent — polished output is not evidence the knowledge is current. Tying review to how fast the source material changes keeps the Project true; a scheduled re-upload of unchanged files changes nothing, and a caveat instruction makes Claude vague rather than accurate.
**Trap:** sounds-efficient
**Task:** 5.4
**Source:** newly written

### Q18
A department's Claude setup has drifted: several overlapping Projects, duplicated knowledge
files, contradictory instructions, and no one knows which Project is current. Leadership
proposes rebuilding everything from scratch under a new governance board.

**Which approach is most effective?**
A) Rebuild everything from scratch and require executive sign-off on each new Project.
B) Audit the existing Projects, consolidate duplicates, designate one authoritative Project per workstream, and assign an owner to maintain each.
C) Keep all the Projects but add a rule that everyone must use the newest one.
D) Leave the Projects alone and let each team keep working as they have.

**Answer:** B
**Why:** The maintenance move is to consolidate and assign ownership so each workstream has one authoritative setup that someone keeps current. A full rebuild under a governance board discards working configuration and adds process without fixing ownership, a "use the newest" rule leaves the duplicates in place, and doing nothing leaves the drift to compound.
**Trap:** sounds-enterprise
**Task:** 5.4
**Source:** newly written

### Q19
A Project's outputs have started citing an obsolete process. The team is debating whether
to fix the one bad output or to look into the Project itself.

**Which approach is most effective?**
A) Correct the single output and move on, since it is the fastest fix.
B) Ask Claude to be more careful with process details going forward.
C) Diagnose the configuration first — check whether the knowledge is current and the instructions still reflect the rules — then update the Project so every future conversation is fixed.
D) Replace the Project with a fresh one every time drift is suspected.

**Answer:** C
**Why:** When outputs go wrong, suspect the configuration before the model: fixing the source fixes every future conversation, while fixing one output fixes one output. Correcting the single reply leaves the stale source producing the next wrong one, a "be careful" instruction is not a control, and rebuilding the Project repeatedly throws away working configuration.
**Trap:** sounds-pragmatic
**Task:** 5.4
**Source:** newly written

### Q20
A team wants their Project's configuration to stay healthy over time. They propose asking
Claude to self-monitor and automatically update the Project's knowledge whenever it
notices something looks outdated.

**Which approach is most effective?**
A) Rely on Claude to self-monitor and update the knowledge automatically.
B) Add a monthly reminder to review the Project but change nothing else.
C) Rely on users to report wrong answers whenever they happen to notice one.
D) Assign an owner, tie review frequency to how fast the source material changes, and update the Project whenever reality moves.

**Answer:** D
**Why:** Maintenance is a deliberate, owned activity: someone reviews the instructions and knowledge on a cadence matched to the material's change rate and updates the Project when it moves. Self-monitoring is not a reliable control, a reminder with no owner or cadence is easy to ignore, and waiting for users to notice errors leaves the Project wrong in the meantime.
**Trap:** sounds-smart
**Task:** 5.4
**Source:** newly written
