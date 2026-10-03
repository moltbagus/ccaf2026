# Domain 7 — Developer Productivity & Operational Enablement (7%) — Question Bank (20 questions)

Coverage: 7.1 ×5, 7.2 ×5, 7.3 ×5, 7.4 ×5.
Trap types used: sounds-enterprise, sounds-efficient, sounds-smart, sounds-helpful,
sounds-thorough, sounds-simple, sounds-pragmatic.

---

### Q1
A platform team has rolled Claude Code out to fourteen product teams using a shared repository. The first team asks for a custom CLAUDE.md and an extra MCP server.

**Which approach is most effective?**
A) Put both in the requesting engineer's personal local settings so the other thirteen teams are unaffected.
B) Commit both to the shared, version-controlled repository configuration and route them through the normal review, so every team inherits them.
C) Record the custom CLAUDE.md on the team wiki and ask the team to copy it into their local settings when they clone.
D) Keep the changes on a private branch of the shared config that the team merges only when it is convenient.

**Answer:** B
**Why:** Shared, version-controlled configuration is the inheritance mechanism — a committed CLAUDE.md and .mcp.json mean every developer who clones gets the same conventions, tools, and guardrails. A personal settings file hides the change, a wiki page is documentation rather than enforcement, and an unmerged branch forks the standard silently.
**Trap:** sounds-helpful
**Task:** 7.1
**Source:** newly written

### Q2
A platform team needs non-negotiable rules — denied tools and network policy — that an individual project must not be able to loosen on its own.

**Which approach is most effective?**
A) Place the rules in each project's .claude/settings.json, so every team controls its own rules.
B) Place the rules in the shared CLAUDE.md, listed as instructions the model should follow.
C) Place the rules in a system prompt that tells Claude which tools it may not use.
D) Place the rules in managed (organization-level) settings, which take precedence and cannot be loosened by an individual project.

**Answer:** D
**Why:** Managed settings are the enforcement layer for the non-negotiables. Project settings, a shared CLAUDE.md, and a system prompt can all be edited or ignored at the project level, so they are advisory rather than binding.
**Trap:** sounds-simple
**Task:** 7.1
**Source:** newly written

### Q3
A team requests a change to the shared platform configuration. The architect must decide how to handle it.

**Which approach is most effective?**
A) Convene a cross-functional governance board to review every configuration change before any team may proceed.
B) Let the requesting team own the change and document it, since only that team was affected.
C) Ask whether every team should inherit the change; if yes, land it in the shared, reviewed config, and if no, keep it local and scoped.
D) Give every team its own settings file so no team is ever blocked by another team's request.

**Answer:** C
**Why:** The test is inheritance — anything the team should get belongs in the shared, version-controlled layers under review. A heavyweight board for every change is enterprise theater, letting the team self-own the change forks the standard, and per-team files end the shared standard altogether.
**Trap:** sounds-enterprise
**Task:** 7.1
**Source:** newly written

### Q4
One engineer adds an MCP server to their local config. CI that relies on the same tool now fails for teammates who never had it, and the tool is missing from a fresh clone.

**Which approach is most effective?**
A) Tell every developer to add the server to their own local config by following the README.
B) Keep the server local and add a fallback path so builds stop failing.
C) Move the MCP server into the checked-in .mcp.json so every developer who clones the repository gets the same tool.
D) Pin the server to one machine and have the team SSH into it when needed.

**Answer:** C
**Why:** The repository-level .mcp.json is the shared inheritance point, so the tool becomes part of the standard for everyone. A README instruction is documentation rather than enforcement, a fallback hides the divergence instead of fixing it, and SSH pinning is a bespoke workaround outside the standard.
**Trap:** sounds-efficient
**Task:** 7.1
**Source:** newly written

### Q5
A team, blocked by the repo-wide config, maintains a forked copy of the platform configuration with a couple of rules removed. After a quarter the fork has drifted and missed two security updates.

**Which approach is most effective?**
A) Retire the fork: reconcile the team's legitimate needs into the shared config under review, so the standard stays single-source and inherits future updates.
B) Keep the fork and set a reminder to diff it against the upstream config each quarter.
C) Keep the fork and copy security updates across manually whenever someone remembers.
D) Merge the fork back once, then let the team resume forking for future changes.

**Answer:** A
**Why:** A fork is a divergent standard that silently misses updates. A periodic manual diff and a manual copy are not enforcement and drift again; merging once does not prevent the next fork, so the single-source fix is the only durable one.
**Trap:** sounds-pragmatic
**Task:** 7.1
**Source:** newly written

### Q6
A team has adopted Claude for code review and test generation, but results vary widely between developers, and the most effective prompts live in one engineer's chat history.

**Which approach is most effective?**
A) Distribute a shared document of the best prompts so developers can paste them when needed.
B) Capture the effective prompts as versioned commands, hooks, and skills committed to the repository, so every developer runs the same workflow.
C) Buy licenses for the rest of the team and ask everyone to experiment until they find what works.
D) Loosen the code-review requirement so AI-generated changes ship faster.

**Answer:** B
**Why:** This turns tribal knowledge into an executable, versioned standard the tooling runs for everyone. A prompt document depends on each developer remembering to paste it and decays as prompts evolve; more licenses without a shared workflow multiply inconsistency; loosening review trades governance for speed and does nothing for consistency.
**Trap:** sounds-helpful
**Task:** 7.2
**Source:** newly written

### Q7
A team wants consistent gains from Claude, but drafting PR descriptions, generating tests, and triaging failing CI are done ad hoc, with quality depending on who is typing.

**Which approach is most effective?**
A) Ask each developer to keep their own prompt library and share tips in standup.
B) Add a system prompt that reminds developers to use Claude for these steps.
C) Buy a larger model so the results improve regardless of workflow.
D) Codify the routine steps as repo hooks and commands — a hook that drafts the PR description on push, a command that triages CI failures — so the gain is consistent for everyone.

**Answer:** D
**Why:** Workflow-embedded tooling runs identically for every developer, so the gain compounds. Personal libraries and prompt reminders depend on individual discipline and evaporate when a developer changes teams, and a larger model does not standardize the workflow.
**Trap:** sounds-simple
**Task:** 7.2
**Source:** newly written

### Q8
A team has automated drafting pull requests and tests with Claude. To remove the review bottleneck, a proposal would auto-merge AI-generated changes whenever the generated tests pass.

**Which approach is most effective?**
A) Keep the human at the merge gate — the agent drafts, the developer reviews and merges — and automate the drafting and review preparation, not the approval.
B) Auto-merge AI-generated changes when the generated tests pass, to clear the review queue.
C) Auto-merge only changes below a size threshold.
D) Let a second Claude instance approve the first one's changes so no human is needed.

**Answer:** A
**Why:** Keep the human at the gate for anything that ships. Generated tests and a size threshold do not replace review, and model self-approval removes the control entirely.
**Trap:** sounds-efficient
**Task:** 7.2
**Source:** newly written

### Q9
A team's Claude adoption is enthusiastic, and leadership asks for evidence that the workflow change actually improved delivery.

**Which approach is most effective?**
A) Survey the developers on how much they like Claude.
B) Instrument every prompt and report the total volume run this quarter.
C) Track cycle time, review latency, and rework before and after the workflow change, so the gain is justified with evidence rather than enthusiasm.
D) Report the number of licenses activated across the team.

**Answer:** C
**Why:** Measure the effect on delivery, not activity. Prompt volume and license counts measure usage, and a satisfaction survey measures sentiment — none of them shows whether the workflow change improved outcomes.
**Trap:** sounds-thorough
**Task:** 7.2
**Source:** newly written

### Q10
Developers copy prompts between a chat window and their editor; the prompts that work live in individual chat histories and evaporate when a developer changes teams.

**Which approach is most effective?**
A) Standardize on a shared chat workspace where all prompts are visible to the team.
B) Move the repeated prompts into the repository as slash commands, hooks, and skills, so the workflow runs inside the toolchain for everyone.
C) Procure an enterprise prompt-management platform to store and share prompts centrally.
D) Require developers to log every prompt in a shared spreadsheet.

**Answer:** B
**Why:** The fix is embedding the workflow in the repo so it runs the same way for everyone. A shared chat workspace, an enterprise prompt platform, and a spreadsheet all keep the AI beside the workflow rather than in it.
**Trap:** sounds-enterprise
**Task:** 7.2
**Source:** newly written

### Q11
An operations team wants Claude to assist with production incident triage. They already have runbooks, centralized logs and metrics, and a change-management process.

**Which approach is most effective?**
A) Give the agent read-only access to logs, metrics, and recent change history, have it work from the existing runbooks, and require human approval before any remediation action.
B) Give the agent administrative credentials to production so it can apply fixes directly and reduce mean time to resolution.
C) Have the agent summarize incidents after the fact from exported logs, without live access to the environment.
D) Disable the change-management gate during incidents so remediation can proceed without delay.

**Answer:** A
**Why:** Match the agent's access to the diagnostic task and keep a human gate on every state change. Admin credentials let a wrong action escalate one incident into two, post-hoc summaries give no live triage capability, and disabling the change gate removes the control exactly when a wrong action is most costly.
**Trap:** sounds-efficient
**Task:** 7.3
**Source:** newly written

### Q12
A triage agent keeps proposing fixes without enough context. A teammate suggests giving it broad production access so it can gather whatever data it needs.

**Which approach is most effective?**
A) Give the agent broad production write access so it can gather any data and fix issues directly.
B) Have the agent ask an engineer for each log line it needs.
C) Let the agent work from the incident ticket alone and guess at the rest.
D) Grant scoped, read-only access to the specific observability sources the runbook references — logs, traces, metrics, and topology — and gate any write behind human approval.

**Answer:** D
**Why:** Scope production access to the diagnostic task. Broad write access converts a diagnosis problem into a second incident, asking an engineer per log line defeats the purpose, and guessing from the ticket produces ungrounded fixes.
**Trap:** sounds-smart
**Task:** 7.3
**Source:** newly written

### Q13
After an incident, the root cause is well understood, but the same class of incident has already recurred at two other teams.

**Which approach is most effective?**
A) Send a postmortem email to leadership describing the root cause.
B) Add the finding to the incident ticket and close it.
C) Hold a one-time training session for the on-call team.
D) Feed the root cause back into the runbook and the shared configuration so the next team inherits the lesson instead of rediscovering it.

**Answer:** D
**Why:** The loop closes only when the lesson lands in the runbook and the shared configuration. An email, a closed ticket, and a one-time session are not inherited by the next team, so the recurrence continues.
**Trap:** sounds-pragmatic
**Task:** 7.3
**Source:** newly written

### Q14
An operations team hands the agent a static checklist to follow during incidents, but gives it no access to logs, traces, or metrics.

**Which approach is most effective?**
A) Give the agent administrative access so it can bypass the checklist and act directly.
B) Replace the runbook with a longer, more detailed document.
C) Pair the runbook with the observability access it needs — logs, traces, metrics, and service topology — so the agent can actually follow it, and keep the human gate on writes.
D) Have the agent memorize the runbook and skip the steps it judges unnecessary.

**Answer:** C
**Why:** A runbook the agent cannot execute against is theater. Admin access bypasses the control instead of enabling diagnosis, a longer document adds no capability, and skipping steps abandons the runbook that keeps remediation consistent.
**Trap:** sounds-simple
**Task:** 7.3
**Source:** newly written

### Q15
A team proposes giving the agent only a nightly batch of exported logs, summarized the next day, arguing it is safer to keep the agent out of the live environment.

**Which approach is most effective?**
A) Provide scoped, read-only live access so the agent can diagnose during the incident, with every write gated by a human.
B) Keep the post-hoc batch only, since keeping the agent out of the live environment is the safer default.
C) Run the batch every hour so the summary arrives sooner.
D) Grant write access so the agent can both diagnose and remediate live.

**Answer:** A
**Why:** Post-hoc summarization gives no live triage capability, so it does not help resolve the incident. A faster batch is still after the fact, and write access over-provisions the role beyond diagnosis.
**Trap:** sounds-thorough
**Task:** 7.3
**Source:** newly written

### Q16
Two days before a release, a product team is blocked by a platform security guardrail and asks the architect to disable it just for them. The guardrail protects data handling across all teams.

**Which approach is most effective?**
A) Keep the guardrail, identify whether the shared standard can be refined to meet the team's legitimate need, and if it cannot, grant a scoped, time-boxed, reviewed exception through the governed process.
B) Disable the guardrail for that team only so they can make the release, and note the exception in the team's documentation.
C) Let the team maintain a forked copy of the platform configuration with the guardrail removed.
D) Escalate to leadership to waive the guardrail permanently, since the deadline is business-critical.

**Answer:** A
**Why:** Keep the control and either fix the standard for everyone or grant an exception that is scoped, reviewed, and expires. A per-team disabled guardrail is a silent hole, a fork breaks the shared standard for every downstream team, and a permanent waiver trades the platform's safety for one team's deadline.
**Trap:** sounds-pragmatic
**Task:** 7.4
**Source:** newly written

### Q17
Adoption is surging and several teams complain the compliant path is slow; some have started bypassing the platform guardrails to keep shipping.

**Which approach is most effective?**
A) Relax the guardrails so adoption is not slowed.
B) Let teams bypass a guardrail with a manager's approval email.
C) Keep the controls and make the compliant path faster — better templates, self-service onboarding, and clearer defaults — so adoption scales without weakening governance.
D) Pause adoption across the company until governance catches up.

**Answer:** C
**Why:** Adoption pressure is a reason to make the compliant path faster, not to weaken the control. Relaxing guardrails or approving email bypasses trades the platform's safety for speed, and pausing adoption forfeits the enablement.
**Trap:** sounds-efficient
**Task:** 7.4
**Source:** newly written

### Q18
Governance of the shared platform currently depends on memory and goodwill; teams drift from the standard between audits.

**Which approach is most effective?**
A) Hire a governance team to manually review every team's configuration each quarter.
B) Automate the standard: put policy in the shared configuration and CI checks, so the standard enforces itself across every team instead of relying on memory or goodwill.
C) Publish a governance handbook that teams are expected to follow.
D) Send a monthly reminder email about the standard to all teams.

**Answer:** B
**Why:** Governance that scales is automated. A manual review team, a handbook, and reminder emails are all documentation or periodic human effort that the tooling never enforces, so drift returns between checks.
**Trap:** sounds-enterprise
**Task:** 7.4
**Source:** newly written

### Q19
A team's bespoke setup was approved verbally and recorded on a wiki page. A later audit finds the exception is invisible to the platform tooling, which keeps treating the team as non-compliant.

**Which approach is most effective?**
A) Add more detail to the wiki page and require teams to read it before making changes.
B) Move the wiki page to a more prominent location.
C) Ask managers to confirm their teams have followed the wiki.
D) Replace the informal record with an enforced standard — the change lives in shared, reviewed configuration, or as a scoped, expiring exception the tooling enforces — so the platform sees it automatically.

**Answer:** D
**Why:** Documentation is not enforcement. More detail, a more prominent page, and manager confirmations all rely on people, while the tooling that gates changes never sees any of them — so the exception stays invisible.
**Trap:** sounds-thorough
**Task:** 7.4
**Source:** newly written

### Q20
A platform team is deciding how to expose a new guardrail to product teams. One team offers to build its own version, arguing it knows its own needs best.

**Which approach is most effective?**
A) Let the team build its own guardrail; the platform can adopt it later if it works well.
B) Define the guardrail once in the shared platform standard so every team inherits the same protection, and route refinements through review.
C) Let each team implement its own version and compare results at the next quarterly review.
D) Have the team build it and mark it experimental so other teams can copy it if they want.

**Answer:** B
**Why:** A standard other teams inherit must be defined once in the shared platform. A team-built one-off, per-team implementations, and an experimental copy all fork the standard and leave the protection uneven across teams.
**Trap:** sounds-smart
**Task:** 7.4
**Source:** newly written
