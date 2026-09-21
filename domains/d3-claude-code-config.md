# Domain 3 — Claude Code Configuration & Workflows (20%) — Master Note

Merged from the written module notes, the Domain 3 cheatsheet, the concept map (tasks 3.1–3.6), the anti-patterns catalog, the mock trap guide, the API/product FAQ, the paullarionov guide Ch. 5, the daronyondem §10, and the timothywarner 60-question practice set.

Three global rules decide most questions:
1. **Configuration > invocation.** If it must happen consistently for everyone, the answer is a file in the right location — not a command someone must remember to run.
2. **Path prefix is the whole answer.** `~/.claude/` = personal, never shared. `.claude/` = project, shared via git. Same filename, opposite scope.
3. **Load only what is needed.** Always-loaded standards → CLAUDE.md. Pattern-matched standards → `.claude/rules/` with `paths:`. On-demand workflows → skills/commands. Do not make one mechanism do another mechanism's job.

## Task index

| Task | One-line principle | Exam tell |
|---|---|---|
| 3.1 | Team standards live in project-level `.claude/CLAUDE.md` committed to VCS; split monoliths with `@import` / `.claude/rules/`; `/memory` diagnoses what loaded | "one developer gets different behaviour"; "CLAUDE.md is 400+ lines" |
| 3.2 | Skills and slash commands are on-demand workflows; CLAUDE.md is always-loaded standards; frontmatter controls isolation and tool scope | "produces verbose output"; "must not modify anything"; "prompt for the parameter" |
| 3.3 | Conventions for a file *pattern* spread across the codebase go in `.claude/rules/` with `paths:` globs, not N directory CLAUDE.md files | "tests scattered everywhere"; "pattern of files across the codebase" |
| 3.4 | Plan mode when decisions remain; direct execution when the thing to do is known; Explore subagent for noisy reconnaissance | "45+ files"; "boundaries undecided"; "main conversation filling with grep output" |
| 3.5 | When prose fails, switch modality: I/O examples, test-driven iteration, interview pattern; batch interacting fixes, sequence independent ones | "interprets the instruction differently each time"; "unfamiliar domain" |
| 3.6 | `-p` for non-interactive CI; `--output-format json --json-schema` for machine-parseable findings; review in an independent instance | "job hangs"; "inline PR comments"; "ignoring the bot" |

## Task 3.1 — CLAUDE.md Hierarchy, Loading, and /memory

- **Principle**: CLAUDE.md files load broader → more specific; project-level files are the only ones teammates receive because they are committed to version control.
- Loading order: managed policy (admin, cannot be excluded) → user (`~/.claude/CLAUDE.md`, personal, not version-controlled) → project (`./CLAUDE.md` or `./.claude/CLAUDE.md`, committed) → local (`./CLAUDE.local.md`, personal, gitignored) → directory-level subtrees (loaded on demand).
- Directory-level CLAUDE.md scopes **downward and local, never upward**: `src/backend/CLAUDE.md` does not affect work in `src/`.
- Files in the working directory and ancestors load at launch; files in subdirectories below the working directory load on demand when Claude reads files in those subtrees.
- `@import` syntax (`@path/to/file.md`, no space) modularises CLAUDE.md; relative paths resolve relative to the file containing the import; `@~/` resolves to home; maximum import depth **5** hops.
- `.claude/rules/` is the other modular option: topic files (`testing.md`, `api-conventions.md`, `deployment.md`). Without frontmatter they load unconditionally at session start; with `paths:` frontmatter they load conditionally.
- AGENTS.md interop: normal sessions read `CLAUDE.md`, **not** `AGENTS.md`; `/init` does read an existing `AGENTS.md`. Keep one source of truth by importing it (`@AGENTS.md`).
- `/memory` is the **diagnostic** command: it lists which memory files are currently loaded and opens CLAUDE.md for editing. Use it to **confirm** the diagnosis; the fix is putting the file in the right location.
- Auto memory lives at `~/.claude/projects/<project>/memory/MEMORY.md`; first 200 lines or 25 KB load at session start; machine-local, not version-controlled; `autoMemoryEnabled: false` disables, `autoMemoryDirectory` relocates.
- CLAUDE.md and rules are loaded as *context*, not enforced configuration — there is no compliance guarantee. For behaviour that must always apply, use hooks or `permissions.deny`.
- Monorepo controls: `claudeMdExcludes` (glob list of CLAUDE.md files to skip), `--add-dir <path>`, `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`.
- **Why the exam wants this**: this is the most-tested task in the domain, and most questions reduce to one question — is this file in a location the team receives, or only in one developer's home directory?
- **Distractors**: "run `/memory reload` to pick up the project's instructions" (cannot refresh a file that does not exist on that machine); "restart Claude Code" (same non-problem); "the new developer's user-level file is overriding project settings" (the symptom is missing guidance, not conflicting guidance); "Claude Code caches CLAUDE.md, clear the cache" (Claude Code re-reads CLAUDE.md per session); "move team standards into `~/.claude/CLAUDE.md` to load them on demand" (that removes them from sharing); "compress the 400-line CLAUDE.md by deleting examples and rationale" (hides the structural problem).
- **Exact terms**: `~/.claude/CLAUDE.md`, `.claude/CLAUDE.md`, root `./CLAUDE.md`, `./CLAUDE.local.md`, `<subdir>/CLAUDE.md`, `@path`, `@AGENTS.md`, `.claude/rules/`, `paths:` frontmatter, `/memory`, `/init`, `autoMemoryEnabled`, `autoMemoryDirectory`, `claudeMdExcludes`, `--add-dir`, import depth 5.
- **Scenario tie-in**: Scenario 2 (Code Generation with Claude Code) and Scenario 4 (Developer Productivity Tools) — the divergent-developers bug and the monolithic-CLAUDE.md restructure.

## Task 3.2 — Slash Commands and Skills

- **Principle**: Skills and slash commands are on-demand workflows; CLAUDE.md is always-loaded standards. Never use one for the other's job.
- Custom slash commands are merged into skills: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and behave the same; when a skill and a command share a name, the skill wins.
- Locations and priority: Enterprise > Personal (`~/.claude/skills/<name>/SKILL.md`) > Project (`.claude/skills/<name>/SKILL.md`) > Plugin (`plugin-name:skill-name`). Legacy `.claude/commands/` still works and supports the same frontmatter.
- Each skill is its own directory containing `SKILL.md`; the directory name defaults the `/name`.
- Frontmatter that the exam tests: `context: fork` (runs in an isolated subagent — verbose output stays in the fork, only the summary returns), `allowed-tools` (restricts which tools the skill may call — prevents destructive actions), `argument-hint` (prompts for a required parameter when invoked without one).
- Other frontmatter: `name`, `description` (Claude uses it to decide auto-loading), `when_to_use`, `arguments` / `$name`, `disable-model-invocation`, `user-invocable`, `model`, `effort`, `agent` (which subagent runs under `context: fork`), `hooks`, `paths`, `shell`.
- Substitutions: `$ARGUMENTS`, `$ARGUMENTS[N]` / `$N` (0-indexed), `$name`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_SKILL_DIR}`.
- Dynamic context injection: `` !`cmd` `` runs before the skill body is sent; `` ```! `` blocks for multi-line; `@path` includes files; disable globally with `"disableSkillShellExecution": true`.
- `context: fork` still loads CLAUDE.md but not main conversation history — the isolation move for noisy operations.
- Skill body enters the conversation once as a single message and is not re-read on later turns: write standing instructions, not one-time steps. Auto-compaction re-attaches recently invoked skills (first 5 000 tokens of each, 25 000-token combined budget).
- A skill can be project-scoped AND forked; personal AND unforked — location and isolation are orthogonal axes.
- Plugins (`claude plugin eval`) are the packaging unit for shipping and regression-testing a team's Claude Code conventions.
- **Why the exam wants this**: it tests whether you can tell a category error — "must happen every time" is CLAUDE.md; "invoked when needed" is a skill; "noisy output" is a fork.
- **Distractors**: "move all guidance into skills so CLAUDE.md stays brief" (strips the always-on standards out of every session); "edit the project skill to add a stricter variant for one developer" (affects teammates — create a personal skill under `~/.claude/skills/` with a different name); "add a frontmatter description warning about destructive operations" (a warning is not a tool restriction); "prose validation inside SKILL.md to enforce a required argument" (advisory, not enforcement); "put the convention in a slash command everyone must remember to run" (standards must be ambient, not opt-in).
- **Exact terms**: `.claude/skills/<name>/SKILL.md`, `.claude/commands/<name>.md`, `~/.claude/skills/`, `context: fork`, `agent:` (`Explore`, `Plan`, `general-purpose`), `allowed-tools`, `argument-hint`, `$ARGUMENTS`, `${CLAUDE_SKILL_DIR}`, `disableSkillShellExecution`.
- **Scenario tie-in**: Scenario 4 (Developer Productivity Tools) — team `/review` and `/migration` skills, personal variants, noisy-output skills.

## Task 3.3 — Path-Specific Rules

- **Principle**: When a convention applies to a *pattern* of files spread across the codebase, one rule file with a glob beats N directory CLAUDE.md files.
- Mechanism: a file in `.claude/rules/` with YAML frontmatter declaring `paths:` globs; the rule loads **only** when Claude Code is about to work on a matching file.
- Example globs: `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `src/api/**/*.ts`, `**/migrations/**/*`, `**/*.tf`.
- Why it beats directory CLAUDE.md: single source of truth, applies in new directories automatically, loads only on matching files (no token cost on unrelated work), and cannot drift into N copies.
- Why it beats the root CLAUDE.md: always-loaded content burns context on every interaction, including debugging and review where the convention is irrelevant.
- Why it beats a skill: skills are opt-in and must be invoked; unrelated tasks would also trigger them, and "creating a new endpoint" cannot be distinguished from "debugging in the API directory" by a path glob — that case is a skill, not a rule.
- When to reach for which: universal standards → project CLAUDE.md; one specific subdirectory → directory CLAUDE.md; a pattern across the codebase → path-specific rules; on-demand workflow → skill.
- Rules without frontmatter load unconditionally at session start — adding `paths:` is what makes loading conditional.
- **Why the exam wants this**: it is the "load only what's needed" rule made concrete, and the exam repeatedly contrasts it with duplicate-per-directory CLAUDE.md files.
- **Distractors**: "put one CLAUDE.md in every directory that contains test files" (maintenance disaster, drift inevitable); "put all conventions in the root CLAUDE.md under headings and let Claude infer which applies" (non-deterministic, fails when conventions overlap); "create a `/migrate` slash command everyone invokes first" (opt-in where the standard must be ambient); "create a skill per code type with the conventions embedded" (skills do not apply automatically as code is generated); "define a `.claude/config.yaml` mapping file patterns to sections of CLAUDE.md" (not a documented mechanism).
- **Exact terms**: `.claude/rules/*.md`, `paths:` frontmatter with a glob list, `**` glob matching, conditional load on matching files.
- **Scenario tie-in**: Scenario 2 — testing conventions for tests that sit next to their source, migration or Terraform conventions spread across directories.

## Task 3.4 — Plan Mode vs Direct Execution

- **Principle**: Plan mode when decisions remain to be made; direct execution when the thing to do is already known. The dividing line is decisions vs known work.
- Plan mode is one entry in a permission-mode system: `--permission-mode <mode>` or `Shift+Tab` to cycle; modes are `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`.
- In plan mode Claude explores read-only (Glob, Grep, Read), identifies affected files, designs an approach, presents the plan, and implements only after approval.
- Plan mode indicators: multi-file changes, architectural decisions, multiple valid approaches, large scope (library migration affecting 45+ files), unclear requirements.
- Direct execution indicators: single-file fix with a clear stack trace, adding a null check, a stated mechanical edit, typo or constant update.
- The hybrid is valid and commonly tested: plan mode for investigation and design → user approves → exit plan mode → direct execution file by file.
- The Explore subagent is the context-preservation move: it runs Glob/Grep/Read in its own context and returns a concise summary, keeping raw search output out of the main conversation. Built-in subagents: Explore, Plan (both read-only, skip CLAUDE.md and git status), general-purpose, claude.
- Same goal, different mechanism: `context: fork` isolates a noisy skill; the Explore subagent isolates a noisy investigation.
- Plan mode is not extended thinking: plan mode is workflow control gating thinking→doing; extended thinking is reasoning budget. Use plan mode when the agent jumps to edits without surfacing trade-offs; use more thinking when analysis is shallow.
- **Why the exam wants this**: it is a judgement task statement — the exam describes a task and you classify it — and the traps are scale framing ("it's mechanical") and ceremony framing ("planning always helps").
- **Distractors**: "direct execution — start editing and adjust as you go" (for an unfamiliar 80-file refactor with open architectural questions); "plan mode — even small changes benefit from explicit planning" (ceremony for a one-line fix with a clear stack trace); "call a library migration mechanical because the file edits are repetitive" (different APIs mean decisions remain); "switch to plan mode only after complexity surfaces" (edits across dozens of files may already be wrong); "use a larger model with a bigger context window" instead of isolating output.
- **Exact terms**: `--permission-mode plan`, `Shift+Tab`, `acceptEdits`, `bypassPermissions`, Explore / Plan / general-purpose / claude subagents, `.claude/agents/`.
- **Scenario tie-in**: Scenario 2 (designing boundaries before editing) and Scenario 5 (CI tasks that must not start editing).

## Task 3.5 — Iterative Refinement

- **Principle**: When prose instructions produce inconsistent results, switch modality — the model generalises from examples far more reliably than from descriptions, and rewriting the prose produces different misinterpretations, not fewer.
- Technique 1, concrete I/O examples: give 2–3 input → output pairs for the transformation instead of an adjective ("Format dates consistently" → state the format and show three examples).
- Technique 2, test-driven iteration: write the test first, run it to failure, share the failure, let Claude fix the implementation, repeat until green. Iteration is against a machine-checkable specification, not prose.
- Technique 3, interview pattern: have Claude ask clarifying questions **before** implementing — the move when the domain is unfamiliar and you want edge cases surfaced.
- Technique 4, linking fixes: multiple **interacting** issues go in a single message so the fixes are decided together; **independent** issues are fed back sequentially, one at a time, so each change stays clean and reviewable.
- Default behaviour when standards are ignored: tighten the instruction where it is loaded (project CLAUDE.md), rather than banning the symptom in rules.
- **Why the exam wants this**: it tests modality choice under failure, and whether you can name the right feedback shape (batch vs sequential) from a description of the bugs.
- **Distractors**: "rewrite the prose description more carefully" (prose has already failed repeatedly); "increase the model's temperature" (randomness is not specification); "add 'remember' instructions to the prompt" (prose again); "ban all mocks in a rules file" when integration-test standards are being ignored (tighten CLAUDE.md instead of banning the symptom); "fix independent issues in one big message" or "resolve interacting issues one at a time" (each inverts the other's correct shape).
- **Exact terms**: input/output examples, test-first iteration, interview pattern, batched vs sequential feedback.
- **Scenario tie-in**: Scenario 2 (a refactor whose output shape keeps drifting) and Scenario 5 (generated tests that miss the standard).

## Task 3.6 — CI/CD Integration

- **Principle**: In CI, the CLI must never wait for input, the findings must be machine-parseable, and the review must not run in the session that generated the code.
- `-p` / `--print` is non-interactive mode: process the prompt, print to stdout, exit. **Without it the CI job hangs waiting for interactive input.** This is the single most-tested CI detail.
- Structured output: `--output-format json` (or `stream-json`) plus `--json-schema '{...}'` to constrain the shape for reliable downstream parsing (e.g. file path, line number, severity, suggested fix for inline PR comments).
- Guardrails: `--max-turns N` (hard cap, exits with error), `--max-budget-usd X` (spend cap), `--fallback-model sonnet`, `--permission-prompts none` when no host can answer a prompt, `--no-session-persistence` for ephemeral runs.
- Other CI-facing flags: `--input-format stream-json`, `--bare` (skip auto-discovery: hooks, skills, plugins, MCP, auto memory, CLAUDE.md), `--safe-mode` (all customisations off, permissions still apply — for troubleshooting a broken config), `--setting-sources user,project,local`, `--strict-mcp-config`, `--include-hook-events`, `--session-id` / `--resume` / `--continue` / `--fork-session`.
- Session context isolation: the same session that generated code is **less** effective at reviewing it — it retains the reasoning context and is less likely to question its own decisions. Use an independent review instance with no generation context.
- Incremental review context: when re-reviewing after new commits, include prior findings and instruct Claude to report **only new or still-unaddressed issues**. Without it, duplicate comments on every push cause comment fatigue and developers start ignoring the bot — the fix is incremental context, not removing the bot.
- Full-file review still applies to unchanged code: running only the incremental diff misses pre-existing issues; prior-findings context handles deduplication.
- Test generation has two distinct context problems: **low-quality** tests (boilerplate, getters) are fixed by documenting valuable-test criteria, frameworks, and available fixtures in `.claude/CLAUDE.md`; **duplicate** tests (scenarios already covered) are fixed by passing the existing test files in the prompt context.
- Integration-test standards being ignored is a CLAUDE.md problem: tighten the project file rather than banning mocks in a rules file.
- Pre-compaction logging uses the **PreCompact** hook (log before context is compacted), not a PreToolUse hook on a Compact event.
- Managed CI paths exist (GitHub Actions, GitLab CI/CD, GitHub Code Review, Routines), but the `-p` + `--output-format json` primitive is the right answer when the question needs full control.
- Message Batches API is **not** for pre-merge blocking checks (up to 24-hour window, no latency SLA); it suits overnight analysis, weekly audits, nightly test generation. Batch results arrive in any order — key by `custom_id`.
- **Why the exam wants this**: the highest-density memorisation task in the domain, and every failure pattern has a named symptom → fix mapping.
- **Distractors**: "increase the CI timeout to 90 minutes" (treats the symptom); "redirect /dev/null to stdin" (wrong layer, not the documented headless mode); "set `CLAUDE_HEADLESS=true`"; "add a `--batch` flag" (no such flag); "switch to `--output-format text` so output isn't buffered" (the hang is not an output problem); "have CLAUDE.md describe the output format with examples" (guidance cannot guarantee a machine-parseable shape); "reuse the generating session for review — it already knows the code" (motivated reasoning); "remove the review bot, developers find it noisy" (incremental review context is the fix); "run three full-PR passes and take the majority" (multiplies cost, attention dilution remains); "use a larger-context model" for attention dilution.
- **Exact terms**: `-p` / `--print`, `--output-format json` / `stream-json`, `--json-schema`, `--max-turns`, `--max-budget-usd`, `--bare`, `--safe-mode`, `--permission-prompts none`, `--no-session-persistence`, PreCompact hook, `custom_id`.
- **Scenario tie-in**: Scenario 5 (Claude Code for Continuous Integration) — hanging jobs, inline PR comments, self-review blind spots, duplicate comments, low-value generated tests.

## Configuration surface map

- `~/.claude/CLAUDE.md` — user-level instructions; personal, not version-controlled.
- `./CLAUDE.md` or `./.claude/CLAUDE.md` — project-level instructions; committed, the only file teammates receive.
- `<subdir>/CLAUDE.md` — directory-level instructions; loads on demand when Claude reads files in that subtree; scopes downward only.
- `./CLAUDE.local.md` — personal project-only preferences; gitignored.
- Managed policy CLAUDE.md at the OS-specific path — org-wide, admin-controlled, cannot be excluded.
- `@path` inside CLAUDE.md — file import for modular configuration; depth limit 5; `@~/` resolves to home.
- `.claude/rules/<topic>.md` — topic rules; unconditional without frontmatter, conditional with `paths:` globs.
- `.claude/skills/<name>/SKILL.md` — project skill, version-controlled, creates `/name`.
- `~/.claude/skills/<name>/SKILL.md` — personal skill; use a different name to avoid affecting teammates.
- `.claude/commands/<name>.md` — legacy project slash command; still supported, superseded by skills on name collision.
- `.claude/agents/*` — custom subagent definitions used by `context: fork` and `--agent`.
- `~/.claude/projects/<project>/memory/MEMORY.md` — auto memory index; first 200 lines or 25 KB per session.
- `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` — also load CLAUDE.md from `--add-dir` paths.
- `CLAUDE_CODE_NEW_INIT=1` — interactive multi-phase `/init`.
- `claudeMdExcludes` — glob list of CLAUDE.md files to skip in a monorepo.
- `autoMemoryEnabled` / `autoMemoryDirectory` — disable or relocate auto memory.
- `disableSkillShellExecution` — disable shell execution in skills.
- `/memory` — diagnostic: lists loaded memory files; it does not create them.
- `/init` — scaffold a CLAUDE.md.
- `--permission-mode <mode>` (`default` / `acceptEdits` / `plan` / `auto` / `dontAsk` / `bypassPermissions`), `Shift+Tab` to cycle — session workflow mode.
- `-p` / `--print` — non-interactive CI mode; without it the job hangs.
- `--output-format text|json|stream-json` and `--json-schema` — machine-parseable CI findings.
- `--max-turns`, `--max-budget-usd`, `--fallback-model`, `--permission-prompts none`, `--no-session-persistence` — CI guardrails.
- `--bare`, `--safe-mode`, `--setting-sources`, `--strict-mcp-config` — start-up surface control.
- Built-in subagents: Explore, Plan (read-only, skip CLAUDE.md and git status), general-purpose, claude.
- Hooks: PreCompact (log before compaction), PostToolUse, PreToolUse — enforcement where memory is only guidance.

## Recall card

- Two devs, same repo, divergent behaviour → conventions are in someone's `~/.claude/CLAUDE.md` and were never committed. Fix: move to project `.claude/CLAUDE.md`.
- `/memory` is for diagnosis, not for fix — it tells you what is loaded.
- Directory CLAUDE.md scopes downward and local, never upward.
- Monolithic CLAUDE.md → `@import` and/or `.claude/rules/`; import depth limit 5.
- "Must happen every time" → CLAUDE.md. "Invoked when needed" → skill. Do not swap them.
- "Produces verbose output" / "clutters the main conversation" → `context: fork`.
- "Must not modify anything" → `allowed-tools` restricted to read-only.
- "Prompt the developer for the parameter" → `argument-hint`.
- Personal variant of a team skill → new name under `~/.claude/skills/`; never edit the team skill.
- "Pattern of files spread across the codebase" → `.claude/rules/` with `paths:` globs. Never N directory CLAUDE.md files, never a slash command.
- Standards must be ambient, not opt-in — a slash command for a convention is always wrong.
- Plan mode = decisions still to be made. Direct execution = a known thing to do.
- "45+ files", "boundaries undecided", "multiple valid approaches" → plan mode, even when the edits look mechanical.
- Plan mode → approve → direct execution is a valid hybrid, not a wrong answer.
- "Main conversation filling with grep output" → Explore subagent.
- Prose failed repeatedly → stop rewording, give 2–3 concrete input/output examples.
- Unfamiliar domain, edge cases unknown → interview pattern (Claude asks first).
- Interacting fixes → one message. Independent fixes → sequential.
- CI job hangs after the banner → add `-p`. Always. Not a timeout, not `/dev/null`.
- Auto-post inline PR comments → `--output-format json` with `--json-schema`.
- Same session reviewing its own code → motivated reasoning; use an independent instance.
- Duplicate review comments on every push → pass prior findings and report only new or unaddressed issues.
- CI generates low-value tests → document testing standards and fixtures in `.claude/CLAUDE.md`. CI generates duplicate tests → pass the existing test files in context.
- Log before compaction → PreCompact hook.
- Batch API is never the answer for a blocking pre-merge check.

## Sources

- `/home/colb/.openclaw/workspace/ccaf/resources/dnacenta-domains/d3-claude-code-config.md`
- `/home/colb/.openclaw/workspace/ccaf/resources/hamzafarooq-cheatsheets/domain3.md`
- `/home/colb/.openclaw/workspace/ccaf/resources/00-concept-map.md` (Domain 3 section, tasks 3.1–3.6)
- `/home/colb/.openclaw/workspace/ccaf/resources/03-anti-patterns-catalog.md`
- `/home/colb/.openclaw/workspace/ccaf/resources/02-mock-exam-trap-guide.md`
- `/home/colb/.openclaw/workspace/ccaf/resources/04-api-and-product-faq.md` (`/memory` FAQ)
- `/home/colb/.openclaw/workspace/ccaf/resources/paullarionov-guide_en.md` (Chapter 5, and the Domain 3 practice questions)
- `/home/colb/.openclaw/workspace/ccaf/resources/daronyondem-study-guide.md` (§10 Claude Code and Claude Agent SDK Workflows)
- `/home/colb/.openclaw/workspace/ccaf/resources/timothywarner-practice-60q.md` (Code Generation with Claude Code, Claude Code for Continuous Integration)