# Domain 3 — Claude Code (3.1%) — Question Bank (20 questions)

Coverage: 3.1 ×20 (CLAUDE.md memory hierarchy ×5, settings.json configuration ×4, component set ×5, session management ×3, execution modes ×3).
Trap types used: sounds-enterprise ×3, sounds-efficient ×2, sounds-helpful ×4, sounds-pragmatic ×3, sounds-simple ×4, sounds-smart ×2, sounds-thorough ×2.

---

### Q1
A repo needs a coding standard that applies to every teammate who clones it, plus a private style note that must never be committed. A teammate suggests keeping both in `./CLAUDE.md` so there is only one file to manage.

**Which approach is most effective?**
A) Put both the shared standard and the private note in `./CLAUDE.md`, since one file is simpler to maintain.
B) Put both in `~/.claude/CLAUDE.md` so neither is committed to the repo.
C) Commit the shared standard to `./CLAUDE.md` and keep the private note in `./CLAUDE.local.md`.
D) Put the shared standard in `./CLAUDE.local.md` and the private note in `./CLAUDE.md`.

**Answer:** C
**Why:** `./CLAUDE.md` is committed and reaches every teammate; `./CLAUDE.local.md` is gitignored and reaches only your working copy. Combining them either commits the private note or hides the shared standard, and putting both in user memory reaches no teammate while following you into every other repo.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q2
A platform team must ensure every developer in the organization inherits a mandatory security instruction that individual projects cannot disable.

**Which approach is most effective?**
A) Copy the instruction into every repository's `./CLAUDE.md` so it is present on each checkout.
B) Place it in the enterprise managed CLAUDE.md file (e.g. `/etc/claude-code/CLAUDE.md`), which applies org-wide and cannot be overridden by lower layers.
C) Add it to each developer's `~/.claude/CLAUDE.md` user memory.
D) Put it in `./CLAUDE.local.md` in each working copy.

**Answer:** B
**Why:** The per-repo copy is editable and must be maintained in every project, so nothing enforces it; user memory is per-developer and each person can edit or remove it; a local file is gitignored and reaches no one else. The managed enterprise file is deployed centrally and takes precedence over every lower layer.
**Trap:** sounds-enterprise
**Task:** 3.1
**Source:** newly written

### Q3
A developer wants a personal preference (a preferred response style) to apply in every project they work in, without committing it anywhere.

**Which approach is most effective?**
A) `~/.claude/CLAUDE.md`, the user memory layer that applies in all of your projects and is not committed.
B) `./CLAUDE.md` in each repo, committed so it travels with the project.
C) `./CLAUDE.local.md`, so it stays out of git.
D) `settings.json`, under an "instructions" field.

**Answer:** A
**Why:** User memory is the layer scoped to you across every project and is not committed. A project file reaches teammates who did not ask for the preference, `CLAUDE.local.md` is scoped to one repo rather than all of them, and natural-language guidance belongs in memory, not in `settings.json`.
**Trap:** sounds-helpful
**Task:** 3.1
**Source:** newly written

### Q4
A repo's root `./CLAUDE.md` says "use two-space indentation." A `./frontend/CLAUDE.md` says "use four-space indentation." You ask Claude to edit a component under `frontend/`, and the two instructions conflict.

**Which approach is most effective?**
A) The root file always wins because it was read first.
B) Claude merges the two files and applies the average indentation.
C) The root file wins because it is committed.
D) The frontend file wins because deeper, more specific memory files are read later and take precedence on conflict.

**Answer:** D
**Why:** Claude Code walks parent and subdirectory CLAUDE.md files, and the more specific (deeper) file is read later and wins on conflict. Read order is not authority, merging is not defined behavior, and commit status does not affect precedence.
**Trap:** sounds-smart
**Task:** 3.1
**Source:** newly written

### Q5
You join a fresh repository with no CLAUDE.md and want Claude Code to follow the project's conventions in future sessions.

**Which approach is most effective?**
A) Create `settings.json` with an "instructions" field listing the conventions.
B) Run `/init` to scaffold a starter CLAUDE.md, then refine it for the project.
C) Add the conventions to `~/.claude/CLAUDE.md` so they apply everywhere.
D) Put them in `.claude/commands/conventions.md`.

**Answer:** B
**Why:** `/init` scaffolds a project CLAUDE.md, the correct committed home for project conventions. Natural-language guidance does not belong in `settings.json`; user memory would follow the developer into unrelated repos and never reach teammates; a command file defines a slash command, not standing guidance.
**Trap:** sounds-helpful
**Task:** 3.1
**Source:** newly written

### Q6
The same setting is present with different values in `.claude/settings.json` (committed) and `.claude/settings.local.json` (not committed).

**Which approach is most effective?**
A) The value in `.claude/settings.local.json`, because local settings outrank committed project settings in the precedence order.
B) The value in `.claude/settings.json`, because committed settings are authoritative.
C) Neither; conflicting settings make Claude Code error out.
D) Whichever file was modified most recently.

**Answer:** A
**Why:** The settings.json precedence order is enterprise managed > command-line arguments > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`, so the uncommitted local file wins over the committed project file. Commit status does not raise precedence, conflicts do not error out, and modification time is irrelevant.
**Trap:** sounds-enterprise
**Task:** 3.1
**Source:** newly written

### Q7
A developer needs a personal permission allow-rule that must not be committed, while the team's shared default model must apply to everyone who clones the repo.

**Which approach is most effective?**
A) Put both in `~/.claude/settings.json`.
B) Put both in `./CLAUDE.md`.
C) Put the permission rule in `.claude/settings.json` and the model default in `.claude/settings.local.json`.
D) Put the permission rule in `.claude/settings.local.json` and the model default in `.claude/settings.json`.

**Answer:** D
**Why:** The uncommitted personal rule belongs in the local settings file and the shared committed model belongs in the project settings file. User settings would scope the rule to every project and keep the model private; CLAUDE.md carries guidance, not enforced permission config; option C swaps the layers, committing the personal rule and hiding the shared model.
**Trap:** sounds-helpful
**Task:** 3.1
**Source:** newly written

### Q8
A team writes "never run `rm -rf` on the data directory" in `./CLAUDE.md`. A destructive command still runs, because CLAUDE.md is guidance the model may not follow every time.

**Which approach is most effective?**
A) Strengthen the wording in CLAUDE.md to make the prohibition explicit.
B) Repeat the prohibition in every subdirectory CLAUDE.md.
C) Add a deny permission rule for that command in `settings.json`, which is enforced configuration that blocks the command regardless of CLAUDE.md guidance.
D) Ask each developer to confirm before destructive commands.

**Answer:** C
**Why:** `settings.json` is enforced configuration; a deny rule blocks the command even if CLAUDE.md asked for it, whereas stronger wording, repetition, and manual confirmation are all probabilistic or human-dependent. Guidance shapes intent; permissions enforce it.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q9
After every file edit, a team wants a formatter to run deterministically, not only when Claude remembers to.

**Which approach is most effective?**
A) Add an instruction to CLAUDE.md telling Claude to run the formatter after each edit.
B) Configure a hook in `settings.json` that runs the formatter on the edit event, since hooks are deterministic shell handlers.
C) Add a `/format` command in `.claude/commands/` and rely on Claude to invoke it.
D) Package the formatter as a Skill so Claude loads it on demand.

**Answer:** B
**Why:** Hooks are deterministic shell handlers bound to events, so they fire every time. A CLAUDE.md instruction, a slash command, and a Skill all depend on the model choosing to act, which is probabilistic.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q10
A repo has a 4,000-line style guide. Putting all of it in CLAUDE.md means every session loads it at start, but most sessions never need it.

**Which approach is most effective?**
A) Package it as a Skill (SKILL.md under `.claude/skills/<name>/`) that Claude loads on demand, keeping CLAUDE.md for short always-on rules.
B) Keep the whole guide in CLAUDE.md so it is always available.
C) Split it across ten CLAUDE.md files in subdirectories.
D) Put it in `.claude/commands/` so it is available as a slash command.

**Answer:** A
**Why:** Skills use progressive disclosure — Claude loads them only when relevant, so a large reference does not tax every session. Keeping everything in memory bloats context on every run, scattering it across files still loads it wherever those files are read, and a command file is for an invoked action, not standing reference.
**Trap:** sounds-thorough
**Task:** 3.1
**Source:** newly written

### Q11
The team pastes the same 15-line review prompt into Claude Code several times a day.

**Which approach is most effective?**
A) Save the prompt in CLAUDE.md so Claude always has it.
B) Add it to `~/.claude/CLAUDE.md`.
C) Create a custom slash command as a markdown file in `.claude/commands/*.md`, invoked as `/name`, so the prompt is reusable and shareable.
D) Put the prompt in a hook.

**Answer:** C
**Why:** Custom slash commands are markdown files under `.claude/commands/` that become `/name`, the intended home for a reusable, invocable prompt. Standing memory is for always-on guidance rather than an on-demand prompt, and a hook runs shell logic on events and does not take a prompt.
**Trap:** sounds-smart
**Task:** 3.1
**Source:** newly written

### Q12
A task needs a focused subagent with its own context and tool set, defined so the team can reuse it.

**Which approach is most effective?**
A) `.claude/commands/*.md`
B) `.claude/agents/*.md`, as a subagent definition.
C) A SKILL.md under `.claude/skills/`.
D) `~/.claude/CLAUDE.md`.

**Answer:** B
**Why:** Agents are subagent definitions in `.claude/agents/*.md`, which is where an isolated context and tool set are declared. Commands define slash commands, Skills are on-demand knowledge packages, and memory files carry guidance rather than an agent definition.
**Trap:** sounds-pragmatic
**Task:** 3.1
**Source:** newly written

### Q13
A team wants project facts and decisions to persist and be available in future sessions without being re-explained each time.

**Which approach is most effective?**
A) Agent Memory — the persistent memory layer (the CLAUDE.md hierarchy plus memory files) that survives across sessions.
B) A custom slash command.
C) A hook.
D) `settings.json` env entries.

**Answer:** A
**Why:** Agent Memory is the persistent layer that carries project knowledge across sessions. A command is invoked on demand, a hook runs shell logic on events, and env entries are configuration values, none of which preserve project knowledge between sessions.
**Trap:** sounds-enterprise
**Task:** 3.1
**Source:** newly written

### Q14
You need to express a natural-language coding convention that shapes how Claude writes code in this project.

**Which approach is most effective?**
A) `settings.json` permissions.
B) A hook.
C) A Skill.
D) Rules — the CLAUDE.md memory and instruction files that shape behavior.

**Answer:** D
**Why:** Natural-language guidance that shapes behavior belongs in Rules (the CLAUDE.md files). Permissions are enforced allow/deny config, hooks run shell logic on events, and a Skill is on-demand knowledge — none is the home for standing coding conventions.
**Trap:** sounds-pragmatic
**Task:** 3.1
**Source:** newly written

### Q15
You want to pick up the most recent interactive Claude Code session.

**Which approach is most effective?**
A) Start a new session and paste the old transcript.
B) Run `claude --resume` and browse the list of past sessions to find it.
C) Run `claude --continue` to resume the most recent session.
D) Add the transcript to CLAUDE.md.

**Answer:** C
**Why:** `--continue` resumes the most recent session directly; `--resume` is for choosing among past sessions when the target is not simply the latest. Pasting a transcript is not a session, and memory files are not a conversation log.
**Trap:** sounds-thorough
**Task:** 3.1
**Source:** newly written

### Q16
A long session is running low on context window, but the work and findings so far are still needed to continue.

**Which approach is most effective?**
A) `/clear` to drop context so the window resets.
B) Start a brand-new session and re-run everything.
C) Raise `max_tokens` to fit more.
D) `/compact` to summarize and compress the conversation so the work continues with a smaller context.

**Answer:** D
**Why:** `/compact` summarizes and compresses the existing conversation, preserving the work while reclaiming context. `/clear` drops the context entirely, a fresh session discards the findings, and `max_tokens` does not enlarge the context window.
**Trap:** sounds-efficient
**Task:** 3.1
**Source:** newly written

### Q17
You resume a session from yesterday. Since then, a key module was refactored, so the earlier tool results describe the old code.

**Which approach is most effective?**
A) Resume and explicitly state what changed since the last session, or start fresh with a structured summary of prior findings.
B) Resume unchanged and trust Claude to notice the file changed.
C) `/clear` and re-run the entire investigation from scratch with no context.
D) Fork the session so both the old and new results stay available.

**Answer:** A
**Why:** Resumed tool results are only valid while they still match the files; when code changed, tell Claude what changed or restart with a summary of findings that remain true. Claude will not notice on its own, discarding all context throws away valid findings, and forking preserves the stale state.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q18
A CI pipeline must run Claude Code on every pull request with no human at the keyboard and parse a machine-readable result.

**Which approach is most effective?**
A) Run `claude` interactively and pipe keystrokes into it.
B) Run headless mode: `claude -p "..."` with `--output-format json`.
C) Run `claude --resume` and wait for a human to approve edits.
D) Put the review instructions in CLAUDE.md and run `claude` with no flags.

**Answer:** B
**Why:** Headless mode (`claude -p` / `--print`) runs one non-interactive turn and exits, and `--output-format json` yields a parseable result — purpose-built for CI. Interactive mode expects a terminal; `--resume` restores a session for a person to drive; CLAUDE.md shapes behavior but does not make the run non-interactive.
**Trap:** sounds-pragmatic
**Task:** 3.1
**Source:** newly written

### Q19
A program needs to consume Claude Code's output incrementally as events while the run proceeds, rather than waiting for one final result.

**Which approach is most effective?**
A) Use headless `-p` and buffer the whole output until the process exits.
B) Run interactively and scrape the terminal.
C) Use streaming mode: `--output-format stream-json` so events are emitted for a programmatic consumer.
D) Write the events to CLAUDE.md.

**Answer:** C
**Why:** Streaming mode emits events (`--output-format stream-json`, with `--input-format stream-json` to consume them) for a programmatic consumer that needs incremental output. Buffering defeats the incremental requirement, scraping a terminal is not programmatic, and memory files are not an event channel.
**Trap:** sounds-efficient
**Task:** 3.1
**Source:** newly written

### Q20
During a trusted, well-scoped refactor you want Claude to apply edits without a prompt for every change, but you must still prevent destructive commands.

**Which approach is most effective?**
A) Enable auto-accept edits and rely on the model to avoid dangerous commands.
B) Keep per-change approval and accept the slowdown.
C) Disable edits and apply every change by hand.
D) Enable auto mode (acceptEdits) to apply edits without per-change prompts, paired with deny rules in `settings.json` so destructive commands remain blocked.

**Answer:** D
**Why:** Auto mode speeds up trusted edits but removes a safety gate, so it should be paired with deny rules that deterministically block destructive commands. Relying on the model is probabilistic, and abandoning automation or doing everything by hand discards the benefit the mode exists to provide.
**Trap:** sounds-helpful
**Task:** 3.1
**Source:** newly written
