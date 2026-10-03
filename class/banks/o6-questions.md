# Domain 6 — Governance, Risk, and Responsible Use (15%) — Question Bank (20 questions)

Coverage: 6.1 ×5, 6.2 ×6, 6.3 ×5, 6.4 ×4.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A staffing team proposes using Claude to screen incoming applications for an open role.
They want Claude to score each candidate and automatically reject anyone below a
threshold, with the rejection emailed to applicants. Which use of Claude is most
appropriate?

**Which approach is most effective?**
A) Build the automated scoring pipeline as proposed; consistency from a machine removes the human bias a manual screen would introduce.
B) Have Claude organize and summarize each application against the posted criteria, and a trained recruiter reviews the summaries before any candidate is advanced or declined.
C) Keep the automated rejection but add a link letting rejected applicants request a human review afterward.
D) Do not use Claude for any part of hiring, because applicant data is sensitive.

**Answer:** B
**Why:** A decision about people's jobs needs a named human owner, so the recruiter must make the call and Claude does the language work. Handing the decision to unreviewed output (A) crosses the line, an after-the-fact appeal (C) documents the gap instead of closing it, and blocking all use (D) discards work a review step makes safe.
**Trap:** sounds-enterprise
**Task:** 6.1
**Source:** newly written

### Q2
An associate drafts a client-facing memo on a legal question using Claude and wants to
send it directly, since the draft reads as though a lawyer wrote it and the client
deadline is tight. Which approach is most appropriate?

**Which approach is most effective?**
A) Send the draft as-is; the deadline justifies skipping a review this once.
B) Send the draft and add a footer noting that AI assisted with it.
C) Rewrite the memo in the associate's own words so the AI's role is less visible, then send it.
D) Have a qualified attorney review the memo and take responsibility for it before it reaches the client.

**Answer:** D
**Why:** Presenting AI text as professional advice the sender is not qualified to give is inappropriate; a qualified human must own it. Rushing the draft out (A) skips the review the situation requires, disclosing AI's role (B) still sends unqualified advice, and disguising authorship (C) hides the problem rather than fixing it.
**Trap:** sounds-efficient
**Task:** 6.1
**Source:** newly written

### Q3
A manager wants to save the team time and proposes having Claude handle a whole process
end to end: collect the inputs, make the call, and notify the people affected, with no
one checking in between. For which task would that end-to-end use be appropriate?

**Which approach is most effective?**
A) Summarizing public regulatory updates and emailing the summary to the team.
B) Scoring employees' performance and sending each person their rating.
C) Deciding which customers receive a refund and issuing it automatically.
D) Choosing which job applicants to interview and scheduling only those.

**Answer:** A
**Why:** An end-to-end flow is acceptable when it ends in information rather than a decision about a person. Options B, C, and D put unreviewed model output in charge of outcomes about people's jobs, money, and opportunities, which is the no-go zone regardless of how smoothly the flow runs.
**Trap:** sounds-helpful
**Task:** 6.1
**Source:** newly written

### Q4
A consulting firm wants to speed up a high-value deliverable. A partner suggests Claude
draft the final recommendation on which of three vendors should win a $2M contract and
post it straight into the client's selection record. Which approach is most appropriate?

**Which approach is most effective?**
A) Post the ranking as-is; the scoring criteria are objective and the vendor data is non-confidential.
B) Post the ranking with a note that it was machine-generated, so readers know no human was involved.
C) Have Claude draft a structured comparison, then a named partner reviews, adjusts, and signs the recommendation.
D) Avoid Claude for the deliverable entirely because the contract value is high.

**Answer:** C
**Why:** Drafting the comparison keeps a qualified human as the decision-owner while Claude does the heavy lifting. Posting the ranking unreviewed (A) hands a consequential call to a model with no accountability, a machine-generated disclaimer (B) documents the gap instead of closing it, and refusing Claude altogether (D) discards assistance the accountability test would allow.
**Trap:** sounds-pragmatic
**Task:** 6.1
**Source:** newly written

### Q5
A manager plans to have Claude draft a performance-improvement plan for a struggling
employee and email it directly to them. A colleague suggests a one-line fix: add "be
fair and objective" to the prompt and send the result. Which approach is most
appropriate?

**Which approach is most effective?**
A) Add the instruction to the prompt and send the draft, since fairness guidance addresses the concern.
B) Have Claude generate a first draft, and the manager edits, personalizes, and signs the plan before it reaches the employee.
C) Send the draft with the fairness instruction and copy HR so they are aware of it.
D) Have Claude email the plan and tell the employee a manager wrote it, to keep the process moving.

**Answer:** B
**Why:** A plan about a person's job needs a named manager to own it before it reaches the employee. A prompt instruction (A) is not a review step, copying HR (C) still ships unreviewed text about an employee, and misrepresenting the authorship (D) compounds the problem.
**Trap:** sounds-simple
**Task:** 6.1
**Source:** newly written

### Q6
A payroll analyst wants Claude to analyze a spreadsheet of employee names and salary
details to identify pay-equity patterns. Organizational policy restricts sharing regulated
personal data with third-party services. Which approach is most appropriate?

**Which approach is most effective?**
A) Replace the names with employee IDs and remove other identifying fields, then have Claude analyze the anonymized data for pay-equity patterns.
B) Upload the data as-is because it is internal and the analysis is for internal use only.
C) Upload the data with an instruction that Claude must not retain or remember the salary details.
D) Skip the analysis because salary data is too sensitive to use with an AI tool.

**Answer:** A
**Why:** Redacting identifiers lets the pay-equity analysis proceed without exposing regulated data. Uploading as-is (B) violates policy regardless of internal intent, a non-retention instruction (C) does not stop the data leaving approved systems because a prompt is not a policy control, and abandoning the task (D) is unnecessary once anonymization enables it.
**Trap:** sounds-smart
**Task:** 6.2
**Source:** newly written

### Q7
An HR analyst wants themes from exit-interview transcripts that contain employee names
and medical-leave details. Policy restricts sharing regulated personal data outside
approved systems. A colleague suggests uploading the full transcripts so Claude has
complete context. Which approach is most appropriate?

**Which approach is most effective?**
A) Upload the full transcripts so the analysis is thorough and nothing important is missed.
B) Upload the transcripts with an instruction that Claude treat everything as strictly confidential.
C) Remove employee names and medical details, replacing them with role and department labels, then have Claude summarize the anonymized text.
D) Cancel the analysis and have the analyst read every transcript manually.

**Answer:** C
**Why:** Redaction preserves the insight while removing the exposure. Uploading everything (A) confuses thoroughness with compliance, a confidentiality instruction (B) does not substitute for a data-handling control, and reading every transcript by hand (D) is unnecessary once anonymization enables the summary.
**Trap:** sounds-thorough
**Task:** 6.2
**Source:** newly written

### Q8
A team wants to run sentiment analysis on customer survey comments that contain names,
emails, and phone numbers. Policy requires regulated identifiers be protected before data
leaves approved systems. A director proposes forming a review committee to approve each
upload after it happens, to keep the workflow fast. Which approach is most appropriate?

**Which approach is most effective?**
A) Form the review committee as proposed and upload the comments as-is; the committee will catch problems afterward.
B) Upload the comments as-is and rely on Claude to ignore the personal details during analysis.
C) Upload only the comments from customers who did not object, since silence implies consent.
D) Strip names, emails, and phone numbers from the comments before upload, then run the sentiment analysis on the redacted text.

**Answer:** D
**Why:** The safeguard has to precede the exposure. A retroactive committee (A) reviews a breach rather than preventing one, relying on the model to ignore details (B) is a prompt, not a control, and treating non-objection as consent (C) misreads what consent requires.
**Trap:** sounds-enterprise
**Task:** 6.2
**Source:** newly written

### Q9
A support team wants Claude to draft replies to customer emails, and plans to paste each
customer's full account history and payment details into the chat so the replies are
accurate. Which approach is most appropriate?

**Which approach is most effective?**
A) Paste the full history and payment details so Claude's replies are accurate and fast.
B) Include only the details the reply needs, with account numbers and payment information masked or referenced by the last four digits, keeping the full records in the approved system.
C) Paste the full history but ask Claude to omit the payment details from its reply.
D) Avoid using Claude for support replies because customer emails are sensitive.

**Answer:** B
**Why:** Share the minimum necessary data. Pasting everything (A) over-exposes regulated details, asking Claude to omit them (C) does not un-send what was already pasted, and refusing to use Claude (D) is unnecessary when limiting the data enables the work.
**Trap:** sounds-efficient
**Task:** 6.2
**Source:** newly written

### Q10
A program manager is drafting a lessons-learned document and wants Claude to summarize a
set of incident reports. The reports include employees' names and details of a workplace
injury. Which approach is most appropriate?

**Which approach is most effective?**
A) Replace employees' names and injury details with role labels and generic descriptions before asking Claude to summarize the themes.
B) Upload the reports as-is so Claude has full context and can give the most helpful summary.
C) Upload the reports and instruct Claude not to include any names in the summary.
D) Do not use Claude; have the program manager write the summary from scratch.

**Answer:** A
**Why:** Redacting identity and health details lets the theme analysis proceed without exposing regulated data. Uploading as-is (B) prioritizes helpfulness over the policy control, an instruction to omit names (C) does not remove the data already shared, and writing everything by hand (D) is unnecessary once redaction enables the summary.
**Trap:** sounds-helpful
**Task:** 6.2
**Source:** newly written

### Q11
An analyst wants Claude to summarize customer feedback that includes free-text complaints
naming individuals. A colleague suggests letting Claude see everything and removing the
names from the output afterward, so the analysis stays complete. Which approach is most
appropriate?

**Which approach is most effective?**
A) Let Claude see the full text and strip the names from the output afterward, so the analysis stays complete.
B) Upload the text as-is; the complaints are already shared across the team.
C) Remove the names from the feedback before upload, then have Claude summarize the anonymized text.
D) Skip the summary and read every complaint manually.

**Answer:** C
**Why:** The safeguard must precede exposure — removing names from the output does not stop the data leaving approved systems. Handling it downstream (A) acts after the exposure, prior internal sharing (B) is not consent to a new use, and reading everything by hand (D) is unnecessary once the names are removed.
**Trap:** sounds-pragmatic
**Task:** 6.2
**Source:** newly written

### Q12
Your company's AI policy routes Claude work through the enterprise workspace and requires
approval before uploading regulated data. A teammate suggests running a client's contract
drafts through a personal Claude account tonight because the enterprise login is "a
hassle," and says you can just delete the chat afterward. Which approach is most
appropriate?

**Which approach is most effective?**
A) Use the personal account and delete the chat history afterward; the client data never leaves the device.
B) Use the personal account but instruct Claude to treat the drafts as strictly confidential.
C) Use the personal account tonight and disclose it to your manager tomorrow.
D) Use the approved enterprise workspace, and if access is delayed, tell the client the timeline slipped rather than move their documents to an unapproved account.

**Answer:** D
**Why:** The approved tool carries the controls — data-handling terms, retention settings, audit trail — that a personal account lacks. Deleting history (A) does not create those controls, a confidentiality instruction (B) is not a contractual data protection, and disclosing after the fact (C) records a violation rather than preventing one.
**Trap:** sounds-simple
**Task:** 6.3
**Source:** newly written

### Q13
A new employee wants to use Claude for a task and finds the company's AI policy silent on
that specific use. Which approach is most appropriate?

**Which approach is most effective?**
A) Proceed, since the policy does not explicitly forbid the use.
B) Ask the governance or legal team how to handle the case before proceeding.
C) Proceed but keep a private log of the use in case it is questioned later.
D) Assume the use is allowed because a teammate does something similar.

**Answer:** B
**Why:** When policy is silent, escalate rather than guess — governance or legal is where the authority for the decision lives. Silence (A) is not permission, a private log (C) does not authorize the use, and a colleague's behavior (D) is not a standard.
**Trap:** sounds-smart
**Task:** 6.3
**Source:** newly written

### Q14
A team wants to use Claude on a client project. The client contract is stricter than the
company's internal AI policy: it requires that no client material be processed by
third-party AI services without written consent. Which approach is most appropriate?

**Which approach is most effective?**
A) Follow the client contract: obtain written consent, or keep client material out of Claude, even though internal policy would allow the use.
B) Follow the internal policy, since it is the company's official AI governance standard.
C) Follow whichever rule is easier to meet so the project stays on schedule.
D) Use Claude on the client material and document the deviation from the contract thoroughly in the project's risk register.

**Answer:** A
**Why:** Client contract terms override internal defaults. Internal policy (B) is a floor, not a ceiling, and it does not waive a contractual restriction; convenience (C) is not an authority; and documenting the deviation (D) records the violation without preventing it.
**Trap:** sounds-thorough
**Task:** 6.3
**Source:** newly written

### Q15
An employee is asked to produce a report quickly and learns that a colleague keeps a
separate, unmanaged Claude account that IT does not know about because it "works
better." Which approach is most appropriate?

**Which approach is most effective?**
A) Adopt the same unmanaged account because it produces better results.
B) Report the colleague's account and stop using Claude for the report.
C) Use the approved enterprise account, and if it lacks a needed capability, raise the gap with IT or governance through the approved channel.
D) Use the unmanaged account for this report only and switch to the approved one afterward.

**Answer:** C
**Why:** An unmanaged account is shadow AI that bypasses the controls the approved tool provides; the fix is to stay on the approved tool and escalate the capability gap. Adopting it (A) and using it "just this once" (D) both adopt the workaround, and abandoning Claude (B) overreacts when the approved path still works.
**Trap:** sounds-efficient
**Task:** 6.3
**Source:** newly written

### Q16
A business unit wants to move faster and proposes standing up its own separate AI
workspace with its own rules, so it does not have to wait on the company's governance
process. Which approach is most appropriate?

**Which approach is most effective?**
A) Let the unit run its own workspace; local control will be more responsive than central governance.
B) Let the unit run its own workspace but require it to publish its rules to the company intranet.
C) Let the unit run its own workspace and merge it into the company's later, once it is proven.
D) Use the company's approved workspace and work with governance to remove the bottleneck, rather than create a parallel system outside the governance standard.

**Answer:** D
**Why:** Governance standards exist to apply controls consistently; a parallel workspace is shadow AI with extra steps. Local control (A), published local rules (B), and a later merge (C) all create an ungoverned system that the standard is meant to prevent.
**Trap:** sounds-enterprise
**Task:** 6.3
**Source:** newly written

### Q17
A marketing team used Claude to generate customer personas for a lending product, and the
personas skew toward a single demographic. Which approach is most appropriate before the
campaign uses them to prioritize outreach?

**Which approach is most effective?**
A) Launch with the personas as-is; they came from real market data, so they reflect real customers.
B) Have the team review the personas with diverse input, correct or regenerate the skewed ones, and document that AI was used before the campaign proceeds.
C) Have Claude rewrite the personas to be more balanced and ship them, since the model can correct its own output quickly.
D) Drop AI from persona work entirely, since outreach can influence financial decisions.

**Answer:** B
**Why:** A human bias review with correction and documentation keeps the campaign fair and accountable. Assuming real data cannot carry bias (A) ignores how models inherit patterns from their training, asking the model that produced the skew to certify it is gone (C) adds no independent check, and banning AI personas (D) discards work a review step makes safe.
**Trap:** sounds-helpful
**Task:** 6.4
**Source:** newly written

### Q18
A team used Claude to draft a customer-facing campaign. The copy reads well and the
deadline is tomorrow. Which approach is most appropriate?

**Which approach is most effective?**
A) Have a human verify the factual claims and follow the organization's disclosure norms for AI-assisted material before the campaign ships.
B) Ship the draft as-is; fluent copy signals it is ready, and the deadline is tight.
C) Ship the draft and quietly correct any errors if customers notice them later.
D) Ship the draft with a small footnote that AI was involved, so no further review is needed.

**Answer:** A
**Why:** Polished text is not verified text, so a human verifies the claims and applies the disclosure norms before the campaign faces customers. Treating fluency as readiness (B) skips the review, fixing errors after customers notice (C) handles harm after the fact, and a footnote (D) is disclosure, which does not replace verification.
**Trap:** sounds-pragmatic
**Task:** 6.4
**Source:** newly written

### Q19
Your team used Claude to compress a year of support tickets into a "top customer issues"
list that will shape how customers are treated next quarter. Which approach is most
appropriate before acting on the list?

**Which approach is most effective?**
A) Act on the list as-is; a summary of many tickets is more reliable than any single person's impression.
B) Add a note that the list was AI-generated, then act on it.
C) Have a human verify the themes against the underlying tickets, check whether the summary over-represents or misses groups of customers, and own the resulting priorities.
D) Abandon the summary and have staff re-read every ticket.

**Answer:** C
**Why:** A summary that drives how people are treated needs human verification and a bias check. Aggregation does not remove bias (A), a disclosure note (B) labels the output without verifying it, and re-reading every ticket (D) throws away a summary that a review step makes usable.
**Trap:** sounds-simple
**Task:** 6.4
**Source:** newly written

### Q20
An organization wants to be transparent about its use of AI. Which approach best reflects
responsible disclosure?

**Which approach is most effective?**
A) Disclose AI use only if a customer asks directly.
B) State broadly in the employee handbook that AI may be used, without saying where.
C) Avoid mentioning AI so customers judge the output on its merits alone.
D) Where AI-generated material faces customers or regulators, follow the organization's disclosure norms and make AI's role clear at the point it matters.

**Answer:** D
**Why:** Responsible disclosure makes AI's role clear where it matters, per the organization's norms. Reacting only when asked (A) is not disclosure, a blanket handbook statement (B) is too vague to inform anyone about a specific output, and hiding AI's role (C) is the ethical line the question is testing.
**Trap:** sounds-smart
**Task:** 6.4
**Source:** newly written
