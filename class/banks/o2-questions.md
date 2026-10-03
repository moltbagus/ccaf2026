# Domain 2 — Output Evaluation and Validation (21%) — Question Bank (20 questions)

Coverage: 2.1 ×3, 2.2 ×3, 2.3 ×2, 2.4 ×1, 2.5 ×2, 2.6 ×2, 2.7 ×2, 2.8 ×1, 2.9 ×1, 2.10 ×1, 2.11 ×2.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A sales-ops analyst asks Claude to brief a regional sales report and answer three
questions: did the quarter hit target, which product line underperformed, and the top
driver of churn. Claude's reply is well-written and factually correct on the first two
questions but says nothing about churn. The analyst is about to paste it into a leadership
update.

**Which approach is most effective?**
A) Treat the answer as incomplete: follow up specifically for the churn driver, verify it against the source data, and add it before circulating.
B) Accept it as-is, since every claim it did make is accurate and matches the report.
C) Ask Claude to "make the summary more comprehensive" and use whatever comes back.
D) Add a line noting that churn data was unavailable, so the reader knows a question went unanswered.

**Answer:** A
**Why:** Accuracy and completeness are independent checks — a response can be entirely true and still miss a question the reader needs answered, so the fix is to obtain and verify the missing piece. B confuses accuracy with completeness; C is an unaimed rewrite that may still skip churn and adds no verification; D documents the gap instead of closing it and misstates why it exists.
**Trap:** sounds-helpful
**Task:** 2.1
**Source:** newly written

### Q2
An associate must produce a two-page market brief that includes a competitor pricing table
and a risk section. Claude's first draft is accurate but runs six pages and buries the risk
section in the middle. The deadline is end of day.

**Which approach is most effective?**
A) Send the six-page draft as-is so nothing is lost.
B) Brief Claude explicitly on the required length and sections, keep the pricing figures exact, then check the shorter draft still contains every required element and no changed numbers.
C) Delete the risk section to hit the length target.
D) Ask Claude to summarize itself until it fits two pages.

**Answer:** B
**Why:** The problem is fit to a defined deliverable, so the fix is an explicit brief plus a verification pass that substance survived. A ignores the format requirement; C drops required content; D compresses without knowing what must survive, risking a lost caveat or an altered figure.
**Trap:** sounds-efficient
**Task:** 2.1
**Source:** newly written

### Q3
A financial analyst asks Claude to extract every figure from a board pack into a summary.
Reviewing the output, the analyst notices it reports total revenue but omits the segment
breakdown the pack clearly contains. The analyst wants confidence nothing else is missing.

**Which approach is most effective?**
A) Accept the summary since the headline revenue figure is correct.
B) Ask Claude whether the summary is complete.
C) Ask Claude to list every figure present in the source and reconcile that list against the summary to find anything omitted.
D) Assume the segment figures were not important because Claude left them out.

**Answer:** C
**Why:** Completeness is checked by enumerating the source and comparing, not by trusting the draft. A accepts an incomplete extract; B asks the model to grade its own coverage; D treats an omission as a judgment rather than a defect.
**Trap:** sounds-simple
**Task:** 2.1
**Source:** newly written

### Q4
An associate asks Claude to draft a compliance memo, and Claude cites "Section 4.2(b) of
the Data Handling Regulation" and a specific effective date. The memo will go to the legal
team.

**Which approach is most effective?**
A) Ask Claude how confident it is in the citation and proceed if it says it is certain.
B) Reword the memo to say "applicable regulations require" and drop the section number.
C) Send it because a section number indicates Claude consulted the regulation.
D) Verify the cited section and date against the actual regulation text before the memo leaves the team.

**Answer:** D
**Why:** Specific citations are exactly the detail models fabricate, and a compliance audience requires checking the claim against the source that owns it. A relies on self-reported confidence; B hides the risk without resolving it; C mistakes a specific-looking detail for evidence.
**Trap:** sounds-smart
**Task:** 2.2
**Source:** newly written

### Q5
A consultant gets a polished industry briefing from Claude that includes a market-growth
percentage attributed to a named research firm. The client presentation is in two hours and
the number anchors the recommendation.

**Which approach is most effective?**
A) Check the percentage against the named firm's published report; if it cannot be confirmed, replace it with a verified figure or remove it.
B) Keep the number but attribute it to "industry estimates" so no specific source is claimed.
C) Present it as-is since the briefing is only for discussion.
D) Ask Claude to re-run the analysis and keep the number if it appears again.

**Answer:** A
**Why:** A decision-anchoring statistic with a named attribution must be confirmed against its owner's publication. B launders an unverified number; C understates the stakes of a number shaping a recommendation; D uses the model as its own reference, and two runs can agree on the same fabrication.
**Trap:** sounds-pragmatic
**Task:** 2.2
**Source:** newly written

### Q6
Claude produces a competitor overview stating that a rival launched a loyalty program in
2019. Your own knowledge is that the program launched in 2023, and the output offers no
source for the 2019 date.

**Which approach is most effective?**
A) Keep both dates and note a discrepancy for the reader to resolve.
B) Treat the date as a likely fabrication, verify it against the competitor's own announcements, and correct or cut the claim.
C) Assume Claude found an earlier pilot program and leave the 2019 date.
D) Remove all dates from the overview to avoid any risk.

**Answer:** B
**Why:** A concrete detail you cannot trace or corroborate is the signature of a hallucination, and the repair is to verify against the owning source, then correct or cut. A publishes the error with a shrug; C invents a justification for the fabrication; D discards good content along with the bad.
**Trap:** sounds-thorough
**Task:** 2.2
**Source:** newly written

### Q7
A long Claude-generated report on customer feedback says there were 412 survey
respondents, but the chart in the same report totals 380, and a recommendation near the end
contradicts a finding two paragraphs earlier. A colleague suggests it still "reads well."

**Which approach is most effective?**
A) Ship it and let reviewers flag any inconsistencies they notice.
B) Ask Claude to rate the report's internal consistency out of ten and fix anything below eight.
C) Run an explicit consistency pass: reconcile the respondent counts against the source data and resolve the recommendation so it follows from the findings.
D) Add a footnote that figures may vary.

**Answer:** C
**Why:** A long output has no built-in cross-check, so the associate reconciles internal contradictions against the source and repairs the logic. A outsources the check to chance; B asks the model to grade its own work; D annotates the contradiction instead of resolving it.
**Trap:** sounds-enterprise
**Task:** 2.3
**Source:** newly written

### Q8
A Claude-drafted segment analysis includes the line "these customers rarely engage with
digital channels." The survey it was based on never asked about channel preferences; it
measured purchase frequency only.

**Which approach is most effective?**
A) Keep the line because it matches how the segment behaves in the data.
B) Soften the wording to "may prefer other channels."
C) Ask Claude to confirm the statement is supported.
D) Cut the claim or rebase it on what the survey actually measured, then ask Claude to argue the opposite characterization as a bias check.

**Answer:** D
**Why:** An unsupported generalization is bias, and the repair is to ground the profile in measured data plus a deliberate counter-framing check. A assumes provenance equals support; B keeps the same unsupported claim in softer clothing; C asks the process that produced the flaw to detect it.
**Trap:** sounds-simple
**Task:** 2.3
**Source:** newly written

### Q9
Claude analyzes your uploaded survey and produces demographic profiles. One profile
describes a group as "traditional, change-resistant, and uncomfortable with new tools,"
though the survey only captured purchase and satisfaction data. Leadership will use the
profiles to target campaigns.

**Which approach is most effective?**
A) Rebase the profile on the measured attributes, remove the unsupported characterizations, and add a counter-framing pass to your review routine.
B) Keep the profile and add a note that it is AI-generated and may contain bias.
C) Ask Claude to review the profiles for bias and revise whatever it flags.
D) Keep the profile because it came from analysis of your own uploaded data.

**Answer:** A
**Why:** The fix is to replace unsupported generalizations with what the data shows and to build a bias check into review. B transfers risk to the reader while shipping the stereotype; C relies on self-audit; D assumes the data itself contained the attitude, but the bias entered after the analysis.
**Trap:** sounds-helpful
**Task:** 2.4
**Source:** newly written

### Q10
An associate needs to confirm whether a regulation requires a specific retention period.
Claude states "seven years." The associate wants the fastest reliable path to certainty.

**Which approach is most effective?**
A) Re-run the prompt and keep "seven years" if Claude repeats it.
B) Check the regulation text itself, since the regulation is the source that owns the requirement.
C) Ask Claude to explain its reasoning and trust the answer if the reasoning is coherent.
D) Ask a second Claude conversation to confirm the first answer.

**Answer:** B
**Why:** Verification means comparing the claim to the source that owns the fact — here the regulation itself. A and D treat model agreement as evidence, and two runs can share the same fabrication; C rewards fluent reasoning, which is exactly how a wrong answer sounds.
**Trap:** sounds-efficient
**Task:** 2.5
**Source:** newly written

### Q11
A vendor's claimed price appears in a Claude-generated comparison. With limited time before
the comparison informs a purchasing decision, the associate must decide which claims to
check first.

**Which approach is most effective?**
A) Verify the descriptive adjectives and marketing phrases first, since they set the tone.
B) Verify claims in the order they appear, top to bottom.
C) Prioritize the claims that carry consequences — the price figures, contractual terms, and anything attributed to the vendor — against the vendor's own published pages.
D) Skip verification since the comparison is internal.

**Answer:** C
**Why:** Verification effort should follow stakes: numbers driving decisions, contractual specifics, and attributed claims are checked against their owner first. A spends effort on low-stakes wording; B ignores priority; D assumes internal use lowers the bar when the output still drives a purchase.
**Trap:** sounds-smart
**Task:** 2.5
**Source:** newly written

### Q12
Claude's research mode returns a report comparing three software vendors, and every claim
carries a clickable citation. Leadership will use it to choose a vendor. The associate wants
to confirm the report is trustworthy.

**Which approach is most effective?**
A) Trust the report because research mode already found and cited sources.
B) Ask Claude to confirm that its citations are real and accurate.
C) Regenerate the report and present the version that reads as better supported.
D) Open the primary sources behind the claims driving the recommendation, confirm they say what the report claims, and check they are current and credible.

**Answer:** D
**Why:** A citation is a pointer, not proof — diligence means reading the sources behind the decision-driving claims. A trusts the format; B asks the model to validate itself; C selects on style rather than evidence.
**Trap:** sounds-pragmatic
**Task:** 2.6
**Source:** newly written

### Q13
A Claude research-mode report cites a study for a key statistic. When the associate clicks
through, the linked page is a blog post that references the study rather than the study
itself, and the blog's date is older than the reported finding.

**Which approach is most effective?**
A) Trace the claim to the underlying study, confirm the figure and its context, and only then cite it.
B) Cite the blog post since it is what the citation linked to.
C) Drop the statistic and keep the report otherwise unchanged.
D) Keep the citation because it is at least a real, reachable source.

**Answer:** A
**Why:** A secondary mention is not the source that owns the fact; the claim must be traced to the study and confirmed. B and D accept a proxy for the source; C discards a claim that may be salvageable once properly grounded.
**Trap:** sounds-thorough
**Task:** 2.6
**Source:** newly written

### Q14
Claude drafts an internal FAQ explaining employee eligibility for a government-subsidized
benefits program. The draft is clear and confident. Staff will make personal financial
decisions based on it.

**Which approach is most effective?**
A) Publish it because benefits rules are a standard topic Claude handles well.
B) Route it to the benefits specialist with program expertise to verify each rule and sign off before publication.
C) Ask Claude to verify each rule against the latest program guidance, then publish once it confirms accuracy.
D) Publish it with a line telling staff to confirm details with HR if unsure.

**Answer:** B
**Why:** Eligibility content that people rely on is consequential and belongs with a qualified human who verifies and owns it. A equates topic familiarity with accuracy; C lets the model grade its own work; D shifts the organization's duty onto each employee.
**Trap:** sounds-enterprise
**Task:** 2.7
**Source:** newly written

### Q15
Claude produces a hiring-shortlist summary that ranks candidates with brief rationales. The
hiring manager plans to use it to decide whom to interview, and the summary includes a claim
about one candidate's "communication style" drawn from ambiguous notes.

**Which approach is most effective?**
A) Send the shortlist as-is since the manager will interview the candidates anyway.
B) Ask Claude to soften the questionable rationale and send it.
C) Have a human reviewer assess the rationales against the underlying materials and correct or remove unsupported judgments before the manager uses the list.
D) Add a disclaimer that the ranking is AI-assisted.

**Answer:** C
**Why:** Decisions affecting individuals require qualified human review against the source, and unsupported judgments must be corrected or removed. A and B leave a consequential claim standing; D discloses the problem without fixing it.
**Trap:** sounds-helpful
**Task:** 2.7
**Source:** newly written

### Q16
HR asks Claude to draft an internal FAQ on parental-leave entitlements spanning three
jurisdictions. It reads flawlessly and is ready in minutes. Employees will rely on it to
plan leave.

**Which approach is most effective?**
A) Publish it, since parental leave is a standard HR topic.
B) Ask Claude to double-check each jurisdiction's rules and publish once it confirms.
C) Publish it with a note telling employees to verify with HR if in doubt.
D) Send it to the HR compliance specialist with jurisdiction expertise for verification and sign-off before publishing.

**Answer:** D
**Why:** Entitlements that employees rely on are consequential and vary by jurisdiction, so a qualified human must verify and own the content. A equates familiarity with accuracy; B is the model checking itself; C transfers the duty to each employee.
**Trap:** sounds-simple
**Task:** 2.8
**Source:** newly written

### Q17
A consultant has a verified, detailed research document. The client's non-technical board
has ten minutes and must decide whether to renew a contract. The consultant asks Claude to
adapt the document for the board.

**Which approach is most effective?**
A) Brief Claude explicitly — non-technical board, ten-minute read, decision to renew or not, keep the three cost figures and the risk finding exact — then compare the rewrite against the original to confirm the substance survived.
B) Ask Claude to make it shorter and more engaging, then send whichever version reads better.
C) Send the full document so the board has all the detail.
D) Send only the first paragraph Claude wrote at the top of the document.

**Answer:** A
**Why:** Adaptation needs an explicit audience brief plus a substance check so simplification does not change the claims. B edits without a brief and chooses on style; C outsources editing to the busiest readers; D sends an unchecked fragment that was never written for this decision.
**Trap:** sounds-efficient
**Task:** 2.9
**Source:** newly written

### Q18
A verified technical summary must become a one-page update for an executive who wants the
recommendation and the two key risks, with the figures unchanged. The associate wants to be
sure the executive version is faithful.

**Which approach is most effective?**
A) Ask Claude to "simplify for executives" and trust the result since the source was verified.
B) Give Claude the reader, the decision, the length, and the figures that must stay exact; then compare the new version against the source to confirm nothing material changed.
C) Cut paragraphs from the source until it fits one page.
D) Ask Claude to keep only the conclusions and drop the risks to stay short.

**Answer:** B
**Why:** A faithful adaptation combines an explicit brief with a comparison against the original so caveats and numbers survive. A assumes a verified source guarantees a faithful rewrite; C edits by cutting, which can drop required content; D removes the risks the executive needs.
**Trap:** sounds-pragmatic
**Task:** 2.10
**Source:** newly written

### Q19
An associate has Claude produce a 40-row comparison of vendors across ten criteria. The
team will score and weight the criteria in a meeting tomorrow and will also sort by price.

**Which approach is most effective?**
A) Keep the comparison as a long prose narrative so the reasoning is clear.
B) Put the comparison in a shared document so everyone can read it.
C) Deliver the comparison as a structured table (or spreadsheet) so it can be sorted, filtered, and scored.
D) Paste the comparison inline in the chat and let the team transcribe what they need.

**Answer:** C
**Why:** The output feeds downstream sorting, filtering, and scoring, which calls for structured data. A and B bury a dataset in prose or a document; D leaves the team to retype values, inviting transcription errors.
**Trap:** sounds-smart
**Task:** 2.11
**Source:** newly written

### Q20
An associate gets a one-paragraph answer explaining a policy question. It will be reused,
edited, and presented in a client deck next week, and the team will refine it over several
sessions.

**Which approach is most effective?**
A) Leave the answer inline in the chat since it is already written.
B) Expand the answer into a multi-page document to justify the effort.
C) Paste the paragraph into the deck manually and edit there.
D) Produce the content as a shareable artifact the team can reopen, edit, and present, rather than leaving it to dissolve in the chat scroll.

**Answer:** D
**Why:** Output that will be reused, edited, and presented belongs in an artifact that survives the conversation. A lets a reusable deliverable dissolve in the scroll; B inflates scope beyond the need; C scatters edits outside the tool, losing the ability to refine it as a unit.
**Trap:** sounds-thorough
**Task:** 2.11
**Source:** newly written
