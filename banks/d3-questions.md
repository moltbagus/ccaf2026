# Domain 3 — Claude Code Configuration & Workflows — Question Bank (20)

Exam framing: 60 multiple-choice questions, 120 minutes, pass 720/1000, no guessing penalty. Each stem is a production scenario; wrong options are engineered traps drawn from the seven-type taxonomy (sounds-enterprise, sounds-efficient, sounds-smart, sounds-helpful, sounds-thorough, sounds-simple, sounds-pragmatic).

### Q1
Your team has used Claude Code on the same repo for months. Three developers report that Claude follows the team's guidance to "always include comprehensive error handling," but a fourth developer who joined last week says Claude ignores it. All four have up-to-date clones of the same branch.
**Which approach is most effective?**
A) Move the guidance from the original developers' user-level `~/.claude/CLAUDE.md` into the project-level `.claude/CLAUDE.md` and commit it.
B) Have the new developer delete the conflicting section from their own `~/.claude/CLAUDE.md`.
C) Tell the new developer to repeat the requirement in prompts until Claude remembers it for their sessions.
D) Clear the Claude Code cache on all four machines so the current instructions are re-read.
**Answer:** A
**Why:** Personal configuration in `~/.claude/CLAUDE.md` is never carried by git, so teammates never receive it; team standards belong in the version-controlled project file. B assumes a conflict where the symptom is a missing instruction, C assumes per-user learning the product does not do, and D assumes a cache that does not exist.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** reused from timothywarner-practice-60q.md

### Q2
Your project CLAUDE.md has grown past 400 lines mixing coding standards, testing conventions, a PR review checklist, deployment instructions, and database migration procedures. Coding standards and testing conventions must apply in every session; the PR review, deploy, and migration guidance should only apply when doing that work.
**Which approach is most effective?**
A) Move all guidance into separate skills organised by workflow, leaving only a brief project description in CLAUDE.md.
B) Keep everything in CLAUDE.md but use `@import` to organise it into separately maintained files by category.
C) Split CLAUDE.md into files under `.claude/rules/` with path-bound globs so each rule loads only for matching file types.
D) Keep the universal standards in CLAUDE.md and move the workflow-specific guidance (PR review, deploy, migrations) into skills that are invoked on demand.
**Answer:** D
**Why:** CLAUDE.md loads in every session, which is exactly what the always-on standards need, while a skill loads its context only when invoked — the correct home for workflow-specific guidance. A strips the always-on standards out of CLAUDE.md, B still pulls every @imported file into context each session, and C cannot distinguish "deploying" from "editing a file that happens to match a glob."
**Trap:** sounds-thorough
**Task:** 3.1
**Source:** reused from timothywarner-practice-60q.md

### Q3
A developer insists their session is loading the right project standards, but a teammate reviewing the same change sees different conventions applied. Before changing any file, you want to confirm which memory files a session actually loaded.
**Which approach is most effective?**
A) Run `/memory` and read the list of memory files that are currently loaded.
B) Run `/compact` to compress the transcript so the current instructions surface again.
C) Search the repository for every file named CLAUDE.md and compare them by hand.
D) Restart Claude Code so the configuration is re-discovered from scratch.
**Answer:** A
**Why:** `/memory` is the diagnostic command whose purpose is to show which memory files a session has loaded — the direct evidence you need. B compresses history and can lose detail, C cannot tell you which of those files was actually loaded for that session, and D is a restart that changes nothing about configuration discovery.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q4
Your team's `/migration` skill generates database migration files and takes the migration name via `$ARGUMENTS`. Three problems appear in production: developers run it with no arguments and get poorly named files; the skill sometimes picks up schema details from unrelated prior conversations; and a developer once triggered destructive test cleanup because the skill had broad tool access.
**Which approach is most effective?**
A) Use positional `$1`/`$2` instead of `$ARGUMENTS`, add explicit schema file references with `@` syntax, and add a frontmatter description warning about destructive operations.
B) Add `argument-hint` so a required parameter is requested, set `context: fork` to isolate execution, and restrict `allowed-tools` to the file-write operations the skill needs.
C) Split the skill into `/migration-create` and `/migration-apply` with different `allowed-tools` scopes.
D) Add prose validation in SKILL.md to check `$ARGUMENTS`, plus instructions to ignore prior conversation context and a list of prohibited operations.
**Answer:** B
**Why:** Three problems map to three frontmatter controls: `argument-hint` for the missing argument, `context: fork` so prior conversation context does not leak in, and `allowed-tools` to make destructive tools unavailable. A warning is not a restriction, C leaves the missing-argument and context-leak problems unsolved, and D relies on advisory prose where a declaration is required.
**Trap:** sounds-helpful
**Task:** 3.2
**Source:** reused from timothywarner-practice-60q.md

### Q5
Including two or three full endpoint implementation examples in context markedly improves consistency when generating new API endpoints. That context is useful only during endpoint creation — not while debugging, reviewing, or doing other work in the same API directory.
**Which approach is most effective?**
A) Add the endpoint examples and pattern documentation to the project CLAUDE.md so they are always available.
B) Copy the examples into the prompt manually on each generation request.
C) Configure a path-scoped rule under `.claude/rules/` that activates whenever work touches the API directory.
D) Create a skill that embeds the examples and pattern-following instructions, invoked on demand.
**Answer:** D
**Why:** A skill loads its context only when invoked, so the examples are present for generation and absent during review and debugging. A burns context in every session, B is unversioned manual toil, and C cannot distinguish creating an endpoint from debugging one inside the same directory.
**Trap:** sounds-efficient
**Task:** 3.2
**Source:** reused from timothywarner-practice-60q.md

### Q6
A team `/review` skill implements the shared review checklist. One developer wants a stricter variant that also fails any change without a test, but they work in the same repository as everyone else.
**Which approach is most effective?**
A) Create `~/.claude/skills/review-strict/SKILL.md` with a different name so the stricter behaviour is personal and teammates are unaffected.
B) Edit the project skill so it enforces the stricter rules for everyone.
C) Add the stricter rules to the developer's `~/.claude/CLAUDE.md` and keep invoking the team skill.
D) Add a copy of the project skill under a second name inside `.claude/skills/` so both variants are version-controlled.
**Answer:** A
**Why:** Personal customisation lives in the user-level skills directory and must use a different name so nothing overrides the team's skill. B changes teammates' behaviour, C leaves the skill itself unchanged and adds an ambiguous always-on standard, and D puts a personal preference into the shared, committed configuration.
**Trap:** sounds-simple
**Task:** 3.2
**Source:** newly written

### Q7
Conventions differ across your codebase: React components use functional style, API handlers use async/await with specific error handling, and models follow the repository pattern. Test files sit next to the code they test (`Button.test.tsx` beside `Button.tsx`) and must follow identical conventions wherever they live.
**Which approach is most effective?**
A) Put all conventions in the root CLAUDE.md under headings for each area and rely on Claude to infer which section applies.
B) Create a skill per code type with the conventions embedded in each SKILL.md.
C) Place a separate CLAUDE.md file in each subdirectory holding that area's conventions.
D) Create rule files under `.claude/rules/` with YAML frontmatter declaring glob patterns, so conventions apply based on file path.
**Answer:** D
**Why:** Glob-frontmatter rules apply conventions deterministically by path, including to test files distributed next to their source. A relies on inference and fails when conventions overlap, B is opt-in so conventions do not apply automatically as code is generated, and C cannot reach tests that live outside any convention-specific directory.
**Trap:** sounds-smart
**Task:** 3.3
**Source:** reused from timothywarner-practice-60q.md

### Q8
Your monorepo has migration directories in four separate services — `services/billing/migrations/`, `services/orders/migrations/`, and so on. All must follow one set of migration rules (naming, reversibility, no data backfills in the same PR), and new services are added regularly.
**Which approach is most effective?**
A) Add a CLAUDE.md to each service's `migrations/` directory with a copy of the rules.
B) Add one rule file under `.claude/rules/` with `paths: ["**/migrations/**/*"]` so the rules load wherever a migration file is touched.
C) Add the migration rules to the root CLAUDE.md so they are always loaded.
D) Create a `/migration-check` slash command that developers run before writing a migration.
**Answer:** B
**Why:** One glob-keyed rule covers every current and future migrations directory from a single source of truth. A duplicates the rules and guarantees drift, C makes every session pay for migration rules it will not use, and D makes an ambient standard opt-in — developers must remember to run it.
**Trap:** sounds-thorough
**Task:** 3.3
**Source:** newly written

### Q9
Three sibling directory trees (`web/`, `api/`, `workers/`) must all follow the same Terraform conventions. The team is arguing about where to put them.
**Which approach is most effective?**
A) Three directory-level CLAUDE.md files, one per tree, each carrying the same rules.
B) Root CLAUDE.md sections for each tree, leaving Claude to infer which section applies.
C) One rule file under `.claude/rules/` whose `paths:` frontmatter lists `**/*.tf` across the repository.
D) A `/terraform-review` command that developers invoke on Terraform changes.
**Answer:** C
**Why:** One path-scoped rule with a glob expresses a single convention that spans several trees, and it loads only for matching files. A creates three copies that drift, B is non-deterministic inference where a declaration is available, and D converts a standard into an invocation someone must remember.
**Trap:** sounds-pragmatic
**Task:** 3.3
**Source:** newly written

### Q10
You need to add Slack as a notification channel. The codebase has established patterns for email, SMS, and push. Slack offers fundamentally different integration approaches — incoming webhooks (one-way), bot tokens (delivery confirmation, programmatic control), or a Slack App (two-way events, workspace approval) — and the task says only "add Slack support."
**Which approach is most effective?**
A) Start direct execution using incoming webhooks, matching the existing one-way channel pattern.
B) Start plan mode: explore the integration options and their architectural implications, then present a recommendation before implementing.
C) Start direct execution by scaffolding a Slack channel class from the existing pattern and defer the integration-method decision.
D) Start direct execution with bot tokens, which keeps delivery confirmation available later.
**Answer:** B
**Why:** Multiple valid approaches with materially different architectural consequences, plus ambiguous requirements, is exactly the plan-mode trigger. A and D each commit to an integration method before the trade-off is ever reviewed, and C builds throwaway structure because the integration method determines the class shape.
**Trap:** sounds-efficient
**Task:** 3.4
**Source:** reused from timothywarner-practice-60q.md

### Q11
A production endpoint is throwing `NullPointerException` in `UserService.getById()`. The stack trace points at one line in one file, the null case is obvious, and the fix is adding a guard clause.
**Which approach is most effective?**
A) Implement the fix directly, then run the endpoint's tests to confirm.
B) Enter plan mode, explore the service layer, present an approach, then implement after approval.
C) Enter plan mode with several alternative guard-clause designs for the team to choose between.
D) Rename the method and restructure the service layer while you are in the file.
**Answer:** A
**Why:** Direct execution is correct when scope is narrow, the approach is known, and the change is contained to one file. B and C add approval ceremony with no decision left to make, and D expands a one-line fix into unrequested architectural change.
**Trap:** sounds-thorough
**Task:** 3.4
**Source:** newly written

### Q12
You have inherited an unfamiliar 200-file service and must understand its data flow before you can plan the change. The first exploratory pass has already flooded the main conversation with directory listings and search results, and the context window is filling fast.
**Which approach is most effective?**
A) Delegate the reconnaissance to the Explore subagent so it holds the verbose search output and returns only a summary.
B) Standardise the team on a larger-context model configuration so directory listings and search results fit in a single pass.
C) Run `/compact` after every exploration step to keep the window clear.
D) Ask Claude to keep searching but to print less text.
**Answer:** A
**Why:** The Explore subagent is the context-preservation move: it runs read-only discovery in its own context and returns a concise summary to the main conversation. B raises the ceiling instead of reducing what is pulled in, C loses detail and has to be repeated, and D asks the same context window to hold the same material in a smaller font.
**Trap:** sounds-enterprise
**Task:** 3.4
**Source:** newly written

### Q13
You have asked Claude Code three times to normalise API response fields into your internal format. Each attempt is wrong in a different way — fields nested differently, timestamps formatted inconsistently. You keep rewriting the prose description more carefully, and each rewrite produces a new misinterpretation.
**Which approach is most effective?**
A) Rewrite the requirement once more with more precise adjectives.
B) Provide two or three concrete input/output examples of the exact transformation required.
C) Raise the model's temperature so Claude explores different structures.
D) Add an instruction at the end of the prompt telling Claude to remember the format.
**Answer:** B
**Why:** The model generalises from worked examples far more reliably than from descriptions; when prose has failed repeatedly, switch modality instead of rewording it. A tends to produce a different misinterpretation rather than fewer, C makes the output less determined, and D is another prose instruction of the kind that is already failing.
**Trap:** sounds-smart
**Task:** 3.5
**Source:** newly written

### Q14
Behaviour for a new validation function is precisely specified — the team already agrees on which inputs are valid and which are not — but the implementation keeps coming out wrong. You want the iteration to be driven by something checkable rather than by your description of the bug.
**Which approach is most effective?**
A) Describe the failing cases in prose and ask Claude to fix them in one pass.
B) Have Claude ask you clarifying questions about the validation rules before writing code.
C) Ask Claude to review its own implementation and explain why it is correct.
D) Write the tests first, run them to failure, share the failing assertions, and iterate until the suite is green.
**Answer:** D
**Why:** Test-driven iteration makes the requirement machine-checkable, so each round has an unambiguous pass/fail signal. A is prose again, B helps when requirements are unclear — here they are settled, and C is a self-review that will rationalise the implementation rather than correct it.
**Trap:** sounds-simple
**Task:** 3.5
**Source:** newly written

### Q15
Your team must add a compliance export that follows a regulator's retention rules. Nobody on the team has built one before, and you are worried about edge cases you would not think to specify.
**Which approach is most effective?**
A) Have Claude ask clarifying questions about the requirements before implementing anything.
B) Write a detailed prose specification first and hand it over for implementation in one pass.
C) Ask Claude to implement its best interpretation immediately and correct whatever looks wrong afterwards.
D) Provide three input/output examples of the export and implement in one pass.
**Answer:** A
**Why:** The interview pattern surfaces considerations the team does not know it is missing — the right move in an unfamiliar domain. B encodes the team's blind spots into the specification, C discovers the gaps only after building the wrong thing, and D constrains output shape, which is not the problem here.
**Trap:** sounds-efficient
**Task:** 3.5
**Source:** newly written

### Q16
Your auth middleware has two defects that interact: it does not check token expiry, and it returns HTTP 500 instead of 401 for invalid tokens. Fixing the status code changes which branch handles expired tokens, so the two fixes must be decided together. Separately, you have three unrelated typos in the docs.
**Which approach is most effective?**
A) Report the two middleware defects together in one message, then feed the doc typos back sequentially.
B) Report all five issues in one message so Claude sees the complete picture.
C) Report the two middleware defects sequentially, one per turn, so each change stays reviewable.
D) Fix the doc typos first because they are quick, then describe the middleware defects in prose over several turns.
**Answer:** A
**Why:** Interacting fixes belong in a single message so they are decided consistently, while independent issues are sequenced so each change stays clean. C inverts the rule for the defects that interact, B mixes interacting and independent work into one undifferentiated batch, and D delays the coupled change behind unrelated edits.
**Trap:** sounds-pragmatic
**Task:** 3.5
**Source:** newly written

### Q17
Your pipeline script runs `claude "Analyze this pull request for security issues"`. The job hangs indefinitely, and the logs show Claude Code awaiting interactive input.
**Which approach is most effective?**
A) Increase the job timeout so the process has more time to complete.
B) Add the `-p` flag so Claude Code runs non-interactively and exits when the prompt completes.
C) Redirect stdin from `/dev/null` so nothing can block the process.
D) Set `CLAUDE_HEADLESS=true` in the job environment before invoking the CLI.
**Answer:** B
**Why:** `-p` / `--print` is the documented non-interactive mode: it processes the prompt, prints to stdout, and exits without waiting for input. A treats the symptom and never terminates, C is not the documented headless mode and skips print-mode structured output and exit behaviour, and D names an environment variable that does not exist.
**Trap:** sounds-pragmatic
**Task:** 3.6
**Source:** reused from timothywarner-practice-60q.md

### Q18
Your CI pipeline runs Claude Code in `--print` mode with CLAUDE.md supplying project context. Reviews are substantive, but integrating them is hard: Claude returns narrative paragraphs that developers paste into PR comments by hand. The team wants each finding posted automatically as an inline comment carrying file path, line number, severity, and suggested fix.
**Which approach is most effective?**
A) Add an "Output Format for Review" section to CLAUDE.md with examples of structured findings.
B) Ask the model in the prompt to return JSON instead of prose.
C) Post-process the narrative with a regex extractor that pulls out file paths and severities.
D) Run the review with `--output-format json` and `--json-schema` describing the finding object, then parse the output.
**Answer:** D
**Why:** A CLI-enforced output format plus schema validation is what guarantees a machine-parseable shape for downstream automation. A provides guidance that cannot guarantee the structure, B relies on the model's compliance rather than enforcement, and C is brittle and fails whenever the narrative phrasing shifts.
**Trap:** sounds-simple
**Task:** 3.6
**Source:** reused from timothywarner-practice-60q.md

### Q19
Your team uses Claude Code for code generation, and non-obvious defects — performance optimisations that break edge cases, cleanups that silently change behaviour — are caught only when another person reviews the PR. Claude's own reasoning trace during generation shows it considered those cases and concluded its approach was correct.
**Which approach is most effective?**
A) Add a self-review step at the end of generation asking Claude to re-check its own changes.
B) Run a second, independent Claude Code instance to review the changes without access to the generator's reasoning.
C) Reuse the generating session for review, since it already holds all the code context.
D) Require two developers to review every PR, one of them the author's pair.
**Answer:** B
**Why:** The generator retains its reasoning context and is therefore less likely to question its own decisions, so review must come from an instance without that context. A is the same session attempting self-critique, C is the anti-pattern the symptom describes, and D adds human overhead without addressing the model's blind spot.
**Trap:** sounds-efficient
**Task:** 3.6
**Source:** reused from timothywarner-practice-60q.md

### Q20
CI-generated tests for new modules are consistently low value: they exercise getters, assert trivial truths, and never use the suite's existing fixtures. The team asks how to raise their quality.
**Which approach is most effective?**
A) Tighten the project-level `.claude/CLAUDE.md` with the team's testing standards, criteria for a valuable test, and the available fixtures and helpers.
B) Add a rule under `.claude/rules/` banning mocks so generated tests must hit real services.
C) Ask the CI prompt to "write high-quality tests that focus on behaviour" and leave configuration alone.
D) Have a developer fix the generated tests by hand after each CI run.
**Answer:** A
**Why:** CLAUDE.md is the always-loaded place where the CI-invoked agent learns what a valuable test means in this codebase, including fixtures. B bans a mechanism instead of stating the standard, C restates the goal in prose that has already failed, and D makes the defect a permanent manual tax.
**Trap:** sounds-thorough
**Task:** 3.6
**Source:** newly written