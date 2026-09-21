# CCAF Preparation Class — Syllabus

Coach: Hermes (Claude Code Architect Foundations tutor)
Student: Colbert Low
Started: 2026-09-19
Class home: `/home/colb/.openclaw/workspace/ccaf/class/`
Source corpus: `/home/colb/.openclaw/workspace/ccaf/resources/`

---

## Exam facts (verify before booking — vendor pages drift)

| Parameter | Value |
|---|---|
| Code | CCA-F / CCAR-F |
| Questions | 60 multiple choice, 4 options, scenario-based |
| Duration | 120 minutes |
| Scoring | Scaled 100–1000, **pass = 720** |
| Guessing penalty | None — never leave a blank |
| Scenarios | Drawn from 8 production scenarios |
| Fee | ~USD 99–125 (free for first 5,000 partner-company employees) |
| Delivery | Online proctored or test centre |
| Prerequisite | Anthropic Academy access request (Skilljar) |

## Domain weights (drives session time, not just order)

| # | Domain | Weight | Tasks |
|---|---|---|---|
| 1 | Agentic Architecture | **27%** | 1.1–1.7 |
| 2 | Tool Design & MCP | **18%** | 2.1–2.5 |
| 3 | Claude Code Config | **20%** | 3.1–3.6 |
| 4 | Prompt & Structured Output | **20%** | 4.1–4.6 |
| 5 | Context & Reliability | **15%** | 5.1–5.6 |

Total 30 tasks. Domain 1 gets two sessions because 27% of 60 questions ≈ 16 questions.

---

## Session plan (10 sessions, ~50 min each)

| # | Session | Covers | Weight covered |
|---|---|---|---|
| S0 | Diagnostic | 20-question baseline across all 5 domains | — |
| S1 | Agentic loop + orchestration | 1.1, 1.2, 1.3, 1.7 | 27% (half) |
| S2 | Enforcement + investigation | 1.4, 1.5, 1.6 | 27% (half) |
| S3 | Tool design + MCP | 2.1–2.5 | 18% |
| S4 | Claude Code configuration | 3.1–3.3, 3.6 | 20% (half) |
| S5 | Claude Code workflow | 3.4, 3.5 + plan mode/explore | 20% (half) |
| S6 | Prompting + structured output | 4.1–4.4, 4.6 | 20% (half) |
| S7 | Batch API + reliability | 4.5, 5.1–5.6 | 15% + 4.5 |
| S8 | Scenario drills | All 6 documented scenarios, cross-domain | — |
| S9 | Full mock #2 + trap repair | Timed 60Q, miss → trap taxonomy | — |
| S10 | Final readiness gate | Readiness score, booking decision | — |

Cadence: 1 session/day is 10 days; 2/day is 5 days. Adjust at S0.

## Session anatomy (every session, same shape)

1. **Recall warm-up** — 5 rapid questions from the previous session (spaced repetition; no notes).
2. **Core teaching** — task-by-task. For each task: the principle, why the exam wants it, the exact API/config term, the distractor that will tempt you.
3. **Trap drill** — 6 questions built around the 7 trap types.
4. **Scenario application** — the production scenario that maps to this domain.
5. **Exit quiz** — 8 questions. **Gate: 6/8 (75%) to advance.** Below that, the session is re-run on the missed tasks.
6. **Log** — written to `PROGRESS.md`.

## The 7 trap types (every wrong answer is one of these)

| Trap | Sounds like | Correct reflex |
|---|---|---|
| Sounds enterprise | structured data layer, reference IDs | progressive summarization when narrative matters |
| Sounds efficient | re-fetch via MCP, parallel workers | trim context; adaptive single path |
| Sounds smart | confidence threshold, routing classifier | explicit criteria; programmatic gates |
| Sounds helpful | immediate escalation, try unauthorized action | calibrated: brief, one question, or resolve |
| Sounds thorough | plan everything first | evidence-driven adaptive steps |
| Sounds simple | better description on the generic tool | split tools + typed schemas |
| Sounds pragmatic | post-processing normalization | canonical format at extraction |

## Gates and stop rules

- Exit quiz < 75% → re-run the missed tasks, do not advance.
- Mock exam < 800 → repair weak domains before booking.
- Mock exam 900+ twice → book the exam.
- After 3 misses on the same task ID → switch method (write the code, don't just read).

## Assets

| Path | Purpose |
|---|---|
| `SYLLABUS.md` | this file |
| `PROGRESS.md` | scores, mastery %, weak-trap log |
| `domains/dN-*.md` | merged master note per domain (dnacenta + hamza + guide cross-ref) |
| `banks/dN-questions.md` | 20-question bank per domain, answer + trap + task ID |
| `sessions/sNN-*.md` | lesson + quiz for each session |
| `MOCKS.md` | mock exam log (CyberSkill, Certification Guide, local 60Q) |

## How to use the class (web)

Site: **http://100.93.37.80:8081/** (Tailscale only — reachable from any device on the tailnet).
Served by the systemd user unit `ccaf-site.service`; rebuild after editing notes with `node /home/colb/build_ccaf_site.mjs`.

| Page | What it is |
|---|---|
| `index.html` | this syllabus |
| `lesson-d1..d5.html` | **interactive tutor lessons** — the primary way to learn each domain |
| `d1..d5.html` | the master reference note per domain |
| `bank-d1..d5.html` | 20 drill questions per domain, answer keys collapsed |
| `s00-diagnostic.html` | the 20-question baseline test |
| `progress.html` | scores and mastery tracking |

### How a lesson works

Each lesson is a stepper, one idea per screen:

1. A **teach** or **diagram** step explains a single concept in the tutor's voice. Diagrams are inline SVG.
2. A **check** or **drill** step is an answer gate — the four options are clickable, and **Next stays locked until you answer**. Picking wrong shows why, and names the trap type you fell for.
3. The final **recap** step restates the spine of the domain.
4. Progress, score and trap counts are stored in the browser (localStorage, key `ccaf.lesson.v1.<domain>`), so a refresh resumes where you left off. "Restart this lesson" clears it.

Keyboard: `1`–`4` to answer, `Enter` or `→` for next, `←` to go back.

### The study loop

Interactive lesson → drill bank → send the bank letters to Hermes on Telegram for grading. Lessons teach, banks test, and Hermes updates `PROGRESS.md` from what the grading shows.

## Official prerequisite

Anthropic Academy exam guide: https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request
Read it at least three times. This class is the compression layer, not a replacement for the guide.
