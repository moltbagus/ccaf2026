# CCAF Prep — S0 Diagnostic (20 questions, closed book)

Time: 25 minutes. Closed book, no resources, no search. Answer with **letters only** in the form
`1C 2B 3A …` and send them back to Hermes. Partial guesses are fine — there is no guessing penalty on the real exam either.

Questions are weighted to the real exam: D1 ×5, D2 ×4, D3 ×4, D4 ×4, D5 ×3.

---

**1. [D1]** An agentic loop runs a coding task. The team wants a reliable termination check. Which control is correct?
A) Parse the model's text output for the string "TASK_COMPLETE"
B) Cap the loop at 10 iterations as the primary stop
C) Continue while `stop_reason == "tool_use"`; end the loop when it returns `"end_turn"`
D) Have the model self-report a completion boolean in a JSON block each turn

**2. [D1]** A coordinator must produce a broad report ("AI regulation across three industries"). Subagents keep returning incomplete coverage. Best fix?
A) Give the coordinator a fixed step-by-step pipeline applied to every query
B) Coordinator dynamically selects and partitions subagents by research goals plus explicit quality criteria
C) Add more subagents of the same type
D) Give the coordinator web search so it fills the gaps itself

**3. [D1]** `process_refund` must never run before customer identity is verified. Prompt-level instructions still fail occasionally. Best control?
A) Strengthen the prompt with MUST/CRITICAL wording
B) Add few-shot examples of the correct call order
C) A programmatic prerequisite gate (hook) that blocks `process_refund` until identity verification is recorded
D) `tool_choice` forcing `get_customer` first

**4. [D1]** Intermittent 500s in a pipeline of unknown failing layer. Best investigation design?
A) plan all layers first, then execute the plan
B) generate the next investigation subtask from the evidence the previous one returned
C) run all layers in parallel workers and compare
D) escalate to a larger model and re-run

**5. [D1]** You need to continue yesterday's session, but its tool results are 12 hours stale. Best?
A) `--resume` the session so context carries over
B) fork the session and branch
C) start a new session with a structured summary of findings
D) `/compact` and keep going

**6. [D2]** One `analyze_document` tool with a free-text `mode` parameter returns inconsistent output shapes. Best fix?
A) Rewrite the tool description to be more explicit
B) Split into purpose-specific typed tools (`extract_data_points`, `summarize_content`) with schemas
C) Add an enum to the existing `mode` parameter
D) Post-process the free-text output into a canonical shape

**7. [D2]** A tool returns `"Operation failed"`, and the agent retries blindly or gives up. Best fix?
A) Add retry logic in the calling application
B) Return structured errors: `isError`, `errorCategory`, `isRetryable`, plus context
C) Escalate every tool failure to a human
D) Return an empty result and let the agent continue

**8. [D2]** A coordinator has web-search and document-analysis subagents, plus a synthesis agent. Which tool set belongs to synthesis?
A) web search, so it can fill gaps
B) a scoped `verify_fact` tool only
C) the full catalogue, for flexibility
D) no tools at all

**9. [D2]** A refactor renamed a function, but Grep for the original name finds no callers — callers go through a wrapper module with aliases. Best method?
A) Grep the original name across more file types
B) Read the wrapper modules, list their exports/aliases, then Grep each alias
C) Grep for `import` statements only
D) Ask the model which callers it remembers

**10. [D3]** Team coding standards live in your personal `~/.claude/CLAUDE.md`. Teammates don't get them. Best fix?
A) Tell teammates to copy the file into their home directory
B) Move the standards into project-level `.claude/CLAUDE.md`, committed to version control
C) Turn the standards into a skill
D) Move the standards into an output style

**11. [D3]** A project `CLAUDE.md` has grown to 800 lines and is loaded on every request. Best fix?
A) Trim it aggressively to the essentials
B) Split it with `@import` and move path-specific conventions into `.claude/rules/`
C) Move all of it into skills so it loads on demand
D) Replace it with a summary at the top

**12. [D3]** A CI review step runs in the same Claude Code session that generated the code. Which change matters most?
A) Reduce token cost by truncating the diff
B) Run the review in an independent instance — the generating session keeps its reasoning bias
C) Increase the model size for the review step
D) Add a review checklist to the prompt of the generating session

**13. [D3]** You need Claude Code in a CI job, non-interactive, machine-readable output. Correct invocation?
A) `-p` with `--output-format json`
B) `--headless` with `--ci`
C) `--batch` mode
D) the interactive TUI with a scripted keystroke feed

**14. [D4]** A content-moderation prompt says "be conservative when flagging". Precision is inconsistent. Best fix?
A) Say "be very conservative" instead
B) Replace with explicit categorical criteria plus severity examples that show the boundaries
C) Lower the temperature
D) Add random few-shot examples of flagged content

**15. [D4]** A tool is declared with `strict: true` and a JSON schema. What does strict mode actually guarantee?
A) the values are semantically correct
B) the tool input is syntactically valid against the schema
C) the model won't hallucinate field values
D) identical output across identical inputs

**16. [D4]** An extraction schema marks `termination_date` as required, but many contracts omit it — the model invents dates. Best fix?
A) keep it required and retry when the value looks implausible
B) make the field optional/nullable and allow an `unclear` enum value
C) post-process to blank out invented values
D) add few-shot examples of missing dates

**17. [D4]** Reviews must block PR merges. Which API for the review step?
A) Message Batches API for the 50% discount
B) synchronous Messages API
C) Batch API with `custom_id` tracking
D) Batch API plus a polling loop

**18. [D5]** A long support conversation covers five issues; resolved threads are eating the context window. Best?
A) sliding window keeping only the last N turns
B) progressive summarization of resolved threads, active thread kept verbatim
C) a structured issue-data layer with reference IDs replacing the transcript
D) clear the context and let the customer restate

**19. [D5]** Two customer records match the supplied name. The agent needs to act on the account. Best?
A) pick the record with the higher match confidence
B) ask for another identifier — email, phone, or order ID
C) infer from conversational context which one is meant
D) escalate to a human immediately

**20. [D5]** Extraction accuracy is 97% overall across document types, and the pipeline is about to ship. What should you check first?
A) nothing — 97% clears the bar
B) stratified sampling by document type and field to find weak segments the aggregate hides
C) add more training documents
D) lower the confidence threshold for auto-accept

---

## Answer key (do not read before answering)

1. **C** — `stop_reason` drives the loop. A, B, D are the loop anti-patterns (Trap: sounds pragmatic).
2. **B** — dynamic decomposition with goals + quality criteria (Trap: sounds thorough → A).
3. **C** — programmatic prerequisite gate (Trap: sounds smart → D; `tool_choice` only forces the first turn).
4. **B** — adaptive evidence-driven subtasks (Trap: sounds thorough/efficient → A or C).
5. **C** — new session + structured summary; resuming replays stale tool results (Trap: sounds efficient).
6. **B** — split into typed tools (Trap: sounds simple → A, sounds efficient → D).
7. **B** — structured error contract (Trap: sounds pragmatic).
8. **B** — scoped `verify_fact`; search belongs upstream (Trap: sounds helpful).
9. **B** — wrapper alias tracing (Trap: sounds simple).
10. **B** — project-level `.claude/CLAUDE.md` in VCS (Trap: sounds helpful → A).
11. **B** — `@import` + `.claude/rules/` (Trap: sounds simple → A).
12. **B** — independent review instance (Trap: sounds smart → D).
13. **A** — `-p --output-format json`.
14. **B** — explicit categorical criteria + boundary examples (Trap: sounds thorough → D).
15. **B** — strict is syntax, not semantics (Trap: sounds smart → A/C).
16. **B** — optional/nullable + `unclear`; required fields cause fabrication (Trap: sounds thorough → A).
17. **B** — synchronous API for anything blocking (Trap: sounds efficient → A).
18. **B** — progressive summarization of resolved threads (Trap: sounds enterprise → C).
19. **B** — ask for identifiers; never heuristic identity selection (Trap: sounds smart → A).
20. **B** — stratified sampling to expose weak segments (Trap: sounds simple → A).