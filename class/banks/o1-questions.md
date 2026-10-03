# Domain 1 — Prompting and Task Execution (14%) — Question Bank (20 questions)

Coverage: 1.1 ×5, 1.2 ×4, 1.3 ×4, 1.4 ×3, 1.5 ×4.
Trap types used: sounds-simple, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-thorough, sounds-smart, sounds-enterprise.

---

### Q1
A sales director at a B2B software firm asks Claude to "write an email to the client about the project delay." The note that comes back is bland and interchangeable, reading like a generic template. She has the project status details in hand and knows the client is a long-standing account that is already frustrated.

**Which approach is most effective?**
A) Keep the one-line prompt and add "make it sound more professional and sincere" until the tone improves.
B) Switch to the most capable Claude model and re-send the same one-line request.
C) Rewrite the prompt to supply the status facts, name the client's history and frustration, set a 150-word limit, and specify a non-defensive tone with a clear recovery plan.
D) Ask Claude to review its own draft and revise whatever seems weak.

**Answer:** C
**Why:** The credited prompt fills in the missing inputs — source material, audience, format, and constraints — which is the only thing that changes the output. Adding "more professional" (A) is emphasis, not new information; changing the model (B) executes the same under-specified request; self-review (D) delegates quality control to the model that produced the generic draft.
**Trap:** sounds-simple
**Task:** 1.1
**Source:** newly written

### Q2
A project manager needs a one-page status summary for a client who is frustrated about delays, and she has ten pages of raw meeting notes to work from.

**Which approach is most effective?**
A) Ask for "a professional one-page summary of our project status" and edit whatever comes back.
B) Paste the meeting notes and ask for a one-page summary written for a frustrated client: acknowledge the delays, explain the recovery plan, end with next steps, calm and non-defensive tone.
C) Ask Claude to draft the summary, then rate its own draft for client-readiness and revise accordingly.
D) Use the most capable model available to produce the best possible summary of the project.

**Answer:** B
**Why:** The credited prompt supplies the source material, the audience and its emotional state, the structure, and the tone — everything that determines whether the summary lands. A vague "professional summary" (A) leaves audience and sensitivity to guesswork; self-rating (C) is not a quality control; the top model (D) executes the same missing-inputs request with more polish but the same gaps.
**Trap:** sounds-efficient
**Task:** 1.1
**Source:** newly written

### Q3
A team lead pastes the same one-line prompt — "summarize this for me" — for a board memo, a Slack status update, and a new-hire training doc. All three come back in the same generic register, none of them suited to its reader.

**Which approach is most effective?**
A) Specify the role, audience, format, and constraints for each document separately, so each prompt states what its output is for.
B) Add "make this the best possible summary" to each request so Claude understands quality matters.
C) Ask Claude to choose the appropriate audience and format for each document on its own.
D) Keep the single prompt but ask Claude to produce three versions and pick the best.

**Answer:** A
**Why:** The credited move supplies the per-task inputs that were missing, which is what makes each summary fit its reader. Adding a quality adjective (B) changes emphasis, not inputs; letting Claude choose the audience (C) outsources the spec the human owns; asking for three versions of one vague request (D) just multiplies the same generic output.
**Trap:** sounds-helpful
**Task:** 1.1
**Source:** newly written

### Q4
A consultant wants a proposal section written in her firm's voice. She has two past proposals she liked and can state the audience and word count.

**Which approach is most effective?**
A) Describe the desired voice with a long list of adjectives — confident, warm, authoritative, precise.
B) Ask Claude to "write like a top-tier consulting firm would."
C) Give Claude the audience and word count but no examples, then edit the tone herself afterward.
D) Paste the two past proposals as examples and ask Claude to write the new section in that style, for the stated audience and length.

**Answer:** D
**Why:** The credited option supplies evidence — real samples — plus audience and length, so the model has a concrete target for both content and voice. Adjective lists (A) and "write like a top-tier firm" (B) describe style abstractly with nothing to match; giving audience and length but no examples (C) leaves the voice unspecified and guarantees manual rework.
**Trap:** sounds-pragmatic
**Task:** 1.1
**Source:** newly written

### Q5
An operations lead asks Claude to draft a process-change announcement. The draft reads well but includes two cost-saving claims the team has not verified, and it names a vendor the company is not ready to disclose publicly.

**Which approach is most effective?**
A) Ask Claude to make the announcement more detailed and comprehensive so nothing important is left out.
B) Rewrite the prompt to state the constraints explicitly — which figures may be used, the vendor that must not be named, and the sections that must appear — then re-run it.
C) Have Claude fact-check its own draft and remove anything it cannot confirm.
D) Accept the draft and manually delete the two claims and the vendor name before sending.

**Answer:** B
**Why:** Constraints are a prompt element, and stating them up front is what prevents the problems recurring. Adding length (A) adds surface without control; self-fact-checking (C) asks the model to catch its own unverified claims; hand-patching this draft (D) fixes one instance without fixing the prompt, so the next draft repeats the same errors.
**Trap:** sounds-thorough
**Task:** 1.1
**Source:** newly written

### Q6
An operations lead pastes forty pages of scattered interview notes and asks for "a complete training guide for new support hires, with modules, quizzes, and role-plays." The reply is a plausible skeleton with invented details wherever the notes ran thin.

**Which approach is most effective?**
A) Decompose the work: have Claude extract and organize the source facts, review that extraction, approve an outline, then draft one module at a time.
B) Re-send the same request but ask for the guide in one very detailed pass to save round-trips.
C) Ask Claude to review its own guide against the notes and produce an improved full version.
D) Start a fresh chat and re-ask the original request for a different result.

**Answer:** A
**Why:** The credited option sequences the work with checkpoints, so invented facts and a bad structure surface while they are cheap to fix. Asking for one detailed pass (B) is the same monolithic request with more words; self-review (C) is a single-shot gamble with an extra step; a fresh chat (D) re-rolls the same overloaded request from zero.
**Trap:** sounds-efficient
**Task:** 1.2
**Source:** newly written

### Q7
A marketing team asks Claude for a full campaign plan in one request — audience research, messaging, channel plan, and a content calendar. The output is coherent, but the messaging contradicts the audience analysis that sits above it.

**Which approach is most effective?**
A) Regenerate the whole plan, hoping the sections line up this time.
B) Add "make sure all sections are consistent with each other" to the same request.
C) Split the request: first agree the audience analysis, then build messaging from it, then the channel plan and calendar — checking each step against the last.
D) Ask Claude to output its reasoning so you can spot where the inconsistency came from.

**Answer:** C
**Why:** The credited option sequences dependent work so each later step inherits a verified input, which is what removes the contradiction at its source. Regenerating (A) re-rolls the dice; adding a consistency instruction (B) is emphasis, not structure; asking for reasoning (D) exposes the inconsistency after the fact but does not prevent it.
**Trap:** sounds-smart
**Task:** 1.2
**Source:** newly written

### Q8
A delivery lead is buried by a large request — build a client onboarding playbook from scattered emails, a policy document, and a spreadsheet. A colleague proposes standing up a multi-step AI workflow with a planning agent, a drafting agent, and a QA agent so each part gets a specialist.

**Which approach is most effective?**
A) Build the multi-agent workflow with planning, drafting, and QA agents so every part is handled by a specialist.
B) Ask Claude for the playbook in one comprehensive pass and fix the weak sections yourself.
C) Have Claude produce three independent drafts and merge the best parts of each.
D) Decompose into clear steps in a single conversation — extract the source facts, agree an outline, draft each section, then run a consistency pass — with checkpoints you review.

**Answer:** D
**Why:** The credited option adds the structure and checkpoints the task actually needs without overhead. Standing up a multi-agent workflow (A) is over-engineering a job a structured single conversation handles; one comprehensive pass (B) is the monolithic request that already fails on big builds; merging three independent drafts (C) blends incompatible content with no shared outline.
**Trap:** sounds-enterprise
**Task:** 1.2
**Source:** newly written

### Q9
A PM is drafting a product requirements document from a long discovery-call transcript. She asks Claude to "turn this transcript into a requirements doc," and it invents requirements the call never discussed.

**Which approach is most effective?**
A) Sequence it: first have Claude extract the decisions and open questions from the transcript, check that list against the call, then draft the doc from the verified list.
B) Re-ask with the transcript and add "only include what was actually discussed in the call."
C) Ask Claude to mark which requirements it is unsure about so she can review those.
D) Ask Claude to summarize the transcript first and then write the doc from the summary, all in the same request.

**Answer:** A
**Why:** The credited option grounds the document in a human-verified extraction, so invention is caught before it enters the draft. Adding "only include what was discussed" (B) is emphasis; asking the model to flag its own uncertainties (C) relies on it catching its own fabrications; summarizing and drafting in one unverified pass (D) still lets invented requirements into the final text.
**Trap:** sounds-simple
**Task:** 1.2
**Source:** newly written

### Q10
A consultant's client update comes back stiff and three times too long. The content is roughly right; the shape is wrong.

**Which approach is most effective?**
A) Open a new chat and re-run the original prompt to get a cleaner version.
B) Stay in the conversation and write: "Cut to one page. Open with the delay and what it costs the client. Drop the methodology paragraph. Write as if briefing a busy CFO."
C) Ask Claude to rate its own update out of ten and revise anything scoring below an eight.
D) Tell Claude the update is "not good enough" and ask it to try again with more care.

**Answer:** B
**Why:** The credited follow-up carries specific new direction — length, structure, cut, audience — which is the only kind of instruction that narrows the output. Starting over (A) discards the content that was right; self-rating (C) invites a polite score; "not good enough, try harder" (D) is a complaint with no actionable instruction.
**Trap:** sounds-helpful
**Task:** 1.3
**Source:** newly written

### Q11
A product marketer asked Claude for a launch announcement. The content is right, but the tone is stiff and corporate while the company's voice is casual and direct. Two past announcements in the right voice exist.

**Which approach is most effective?**
A) Regenerate the announcement from the original prompt in a new conversation.
B) Ask Claude to review its draft and improve the tone to match the brand's casual, direct voice.
C) Rewrite the tone yourself by editing the draft line by line.
D) In the same conversation, paste the two past announcements and ask Claude to rewrite the draft in that style.

**Answer:** D
**Why:** Style is learned from examples, so pasting real announcements gives a concrete target while staying in the conversation preserves the content the marketer already likes. Regenerating (A) discards good content to re-solve a style problem; "improve the tone" (B) names the goal but supplies no reference for "casual and direct"; hand-editing (C) treats a durable style fix as a one-off chore.
**Trap:** sounds-pragmatic
**Task:** 1.3
**Source:** newly written

### Q12
A researcher asked Claude to draft an executive brief. The draft is close, but it buries the main finding in paragraph four and uses jargon the audience will not know.

**Which approach is most effective?**
A) Accept the draft and fix the order and wording yourself.
B) Start a new chat and re-ask with a more detailed description of the audience.
C) In the same conversation, ask Claude to lead with the main finding, define the jargon in plain language, and cut the background section — then review the revision.
D) Ask Claude to rewrite the brief so it is more thorough and reader-friendly.

**Answer:** C
**Why:** The credited option gives specific corrective instructions — structure, language, and a cut — and iterates in place. Hand-fixing (A) abandons iteration for work the model can do; restarting (B) throws away context for a fix that only needs a follow-up; "more thorough and reader-friendly" (D) is a vague verdict with no direction, and "more thorough" is the opposite of the trim the brief needs.
**Trap:** sounds-thorough
**Task:** 1.3
**Source:** newly written

### Q13
A consultant has iterated on a proposal three times and each round improved it. The latest version is nearly there, but the pricing table has a formatting glitch and one client name is misspelled.

**Which approach is most effective?**
A) Make the final corrections herself and send it — the model has done its part and she owns the deliverable.
B) Ask Claude to rate the proposal out of ten and keep revising until it scores a nine or higher.
C) Run one more full regeneration to get a fresh version that might come back cleaner.
D) Ask Claude to explain each of its formatting choices so she can decide what to change.

**Answer:** A
**Why:** Iteration has a stopping point, and last-mile edits are fastest and safest done by hand on a draft that is already good. An open-ended self-scoring loop (B) has no reliable stopping rule; regenerating (C) risks losing the content that three rounds improved; asking for an explanation of formatting (D) adds analysis where a two-second correction suffices.
**Trap:** sounds-smart
**Task:** 1.3
**Source:** newly written

### Q14
A new hire at a consulting firm asks Claude to "write a client report in our firm's style." Claude has never seen a single report from the firm, and the draft arrives in competent but generic consulting-cliché style.

**Which approach is most effective?**
A) Instruct Claude to "write in our firm's distinctive, professional house style" and re-run.
B) Ask Claude to research how top consulting firms write and imitate that style.
C) Describe the firm's style in a detailed paragraph of adjectives.
D) Add three redacted past reports to a Project and ask for the new report using them as the style reference.

**Answer:** D
**Why:** The credited option supplies real examples of the target voice inside a reusable Project, so the style is evidenced rather than guessed. A "distinctive house style" instruction (A) and a paragraph of adjectives (C) describe the style abstractly; imitating famous firms (B) imports someone else's voice entirely.
**Trap:** sounds-helpful
**Task:** 1.4
**Source:** newly written

### Q15
A communications lead wants a weekly update email that sounds like the company's CEO. Several authentic past weekly emails from the CEO exist.

**Which approach is most effective?**
A) Instruct Claude to "write in a confident, visionary, executive tone" and provide the weekly facts.
B) Ask Claude to imitate how well-known CEOs write their weekly updates.
C) Add three of the CEO's past emails to a Project along with a note on the recurring structure, then ask for this week's update from the same bullet-point facts.
D) Describe the desired tone in fine detail — sentence length, vocabulary, rhythm — without providing any sample emails.

**Answer:** C
**Why:** Real samples of the target voice are the only reliable style evidence, and a Project makes them reusable every week. A tone instruction (A) and a detailed tone spec (D) describe style abstractly and still leave the model guessing what this CEO actually sounds like; imitating famous CEOs (B) supplies the wrong voice.
**Trap:** sounds-thorough
**Task:** 1.4
**Source:** newly written

### Q16
A PM wants Claude to draft a risk register for a specific client engagement, but the output is a list of generic risks that match neither the client's industry nor the project's constraints. The team holds the client's contract summary and last quarter's issue log.

**Which approach is most effective?**
A) Ask Claude to produce a more comprehensive risk register covering every standard risk category.
B) Give Claude the contract summary and issue log, state the client's industry and the project's constraints, and ask for risks tied to that material.
C) Build a Project containing every risk register the company has ever produced and ask Claude to synthesize the new one from that whole archive.
D) Ask Claude to identify which of its generic risks are most likely to apply and expand on those.

**Answer:** B
**Why:** The credited option supplies the specific source material the task requires, which is what ties the risks to this engagement. Asking for more categories (A) adds volume, not relevance; a Project stuffed with every historical register (C) is over-provisioning with unrelated documents; expanding the invented generic risks (D) builds on content that was never grounded.
**Trap:** sounds-enterprise
**Task:** 1.4
**Source:** newly written

### Q17
An analyst uploads a spreadsheet of regional sales figures and asks Claude to "find insights." The response contains several confident, actionable-sounding claims about customer behaviour.

**Which approach is most effective?**
A) Ask Claude to find the most interesting and actionable insights and highlight anything surprising.
B) Use the most capable model available so the analysis is as deep as possible, with the same one-line request.
C) Ask Claude to flag any errors or unsupported numbers in its own analysis before delivering it.
D) Ask Claude first to summarize what the data contains and which questions it can answer, run the analyses that matter, then check the key figures against the spreadsheet before using them.

**Answer:** D
**Why:** Analysis starts from what the data actually contains, so a structure-first pass with human verification anchors the work in real numbers. "Find interesting insights" (A) invites plausible but unsupported claims; the top model (B) deepens whatever direction it guesses at without changing the missing specification; self-flagging (C) asks the model to catch its own fabrications, which is not a reliable check.
**Trap:** sounds-simple
**Task:** 1.5
**Source:** newly written

### Q18
A researcher needs current market data on a fast-moving industry and wants a summary she can cite in a client deck.

**Which approach is most effective?**
A) Use research mode, ask for a source with each claim, and spot-check the key citations before using them.
B) Ask Claude to compile the most important market figures and note that accuracy is critical.
C) Ask Claude to produce the summary and then rate its own confidence in each figure.
D) Ask Claude for the summary and plan to verify the numbers later if any of them look off.

**Answer:** A
**Why:** Research is where confident fabrication does the most damage, so the credited approach uses research mode and requires sources with spot-checks. Telling Claude accuracy is critical (B) is emphasis; self-rated confidence (C) is not an accuracy signal; deferring verification to a vague "if it looks off" trigger (D) leaves the deck resting on unverified figures.
**Trap:** sounds-pragmatic
**Task:** 1.5
**Source:** newly written

### Q19
A strategist wants campaign name ideas. Claude's first ten suggestions are safe, forgettable, and nearly interchangeable.

**Which approach is most effective?**
A) Ask Claude to generate ten more names, this time being creative.
B) Ask for twenty names including deliberately odd options, then a second pass to critique and shortlist — and ask for the ideas Claude thinks she will reject.
C) Ask Claude to explain why its first ten names are weak so it can do better.
D) Switch to the most capable model and re-ask for the best campaign names.

**Answer:** B
**Why:** Brainstorming wants quantity and deliberate strangeness first, then a critique pass, because the first ideas are the average ones. Asking for ten more "creative" names (A) re-rolls the same request; asking the model to analyze why the names are weak (C) substitutes meta-analysis for more diverse output; a stronger model (D) changes the engine without changing the ask.
**Trap:** sounds-smart
**Task:** 1.5
**Source:** newly written

### Q20
A delivery lead needs three things this week: a routine client status update, a deep competitive analysis, and a set of onboarding checklist items extracted from a handbook. The team has one Claude plan.

**Which approach is most effective?**
A) Use the most capable model for all three tasks so nothing is underpowered.
B) Use the fastest model for all three tasks to save time and cost.
C) Match the model to the job: the fast model for the routine update and checklist extraction, the most capable model for the competitive analysis.
D) Ask the most capable model to do the competitive analysis and then reuse its output for the other two tasks.

**Answer:** C
**Why:** Task-execution economics means scaling the model to the job — routine drafts and extraction run fine on the fast model, while deep analysis benefits from the most capable one. Top-model-everything (A) wastes cost and latency; fastest-model-everything (B) under-powers the analysis; reusing analysis output for unrelated tasks (D) misapplies content to the wrong purpose.
**Trap:** sounds-enterprise
**Task:** 1.5
**Source:** newly written
