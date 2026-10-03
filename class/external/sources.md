# Where the material came from

Everything here is community material held locally under `resources/` and `resources/vendor/`.
None of it is Anthropic-authored, and none of it is real exam content. The only authoritative
document is the [official exam guide](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request).

## Original corpus (`resources/`)

| Source | What it gave us |
|---|---|
| `dnacenta-domains/d1-d5` | the written module notes each master note was built from |
| `hamzafarooq-cheatsheets/domain1-5` | the cheatsheet layer, merged into the master notes |
| `daronyondem-study-guide.md` | 181 KB cross-domain guide (16 sections) |
| `paullarionov-guide_en.md` | 194 KB guide: exam format, 8 scenarios, API fundamentals |
| `timothywarner-practice-60q.md` | the 60-question practice set mined into the drill banks |
| `00-concept-map.md` | all 30 tasks with 3-5 word takeaways |
| `02-mock-exam-trap-guide.md` | the 7-type trap taxonomy |
| `03-anti-patterns-catalog.md` | 43 guide-derived anti-patterns |
| `04-api-and-product-faq.md` | prefill, `/memory`, Batch API, exam-vs-production deltas |

## Cloned repositories (`resources/vendor/`)

| Repo | Used for |
|---|---|
| `claude-architect-exam-guide` (utkarsh1agarwal) | **the six 60-question mock exams** in the Mock exams section |
| `ccaf-exam-prep` (javiercriado) | the distractor heuristic, mapping notes, three worked exercises |
| `ClaudeStudyGuide` (kkaminsk) | per-domain notes plus question/answer pairs, five domains |
| `claude-certified-architect-foundations-study-guide` (Jameers23) | per-domain guides and a quick-revision cheatsheet |
| `claude-architect` (timothywarner-org) | mostly the Anthropic cookbooks, not exam-specific |
| `cloud-certification-exam-prep` (schinchli) | multi-cloud cert prep; one Claude CCA-F question file |
| `claude-certified-architect` (paullarionov) | the upstream of the 60Q practice set already in the corpus |

`daronyondem/claude-architect-exam-guide` could not be cloned — the repository is private or renamed.
The local copy of that guide in `resources/` is unaffected.

## Free mock exams (browser, outside the tailnet)

- **CyberSkill** — https://ccaf.cyberskill.world/ — reported as closest to the real thing
- **Certification Guide** — https://claudecertificationguide.com/
- **claudecertifiedarchitects.com** — 400 scenario questions, free readiness diagnostic
- **flashgenius.net / secuspark.com** — free sample sets

Sites selling question dumps (examheist, dumpsbase, skillcertpro) were deliberately skipped:
paid, unverifiable, and often a violation of the exam's terms.

## How the local material was used

Nothing was copied verbatim into the lessons or banks. The external notes were read as a second
opinion against the corpus, and the mock exams are rendered from their own repository data with
provenance kept on the page. Where two sources disagreed, the version matching the exam guide won.

## Video series — Peace Of Code (YouTube)

The lessons and domain notes were also enriched from the **CCAR-F** video series by **Peace Of Code**
(@peaceofcode): 20 episodes plus a bonus exam-traps episode (21 videos, ≈ 14.0 h). It is a free,
third-party course aligned to the exam guide's five domains — **not** Anthropic material. Full index
with per-episode notes: [`video-series.md`](./video-series.md).

| Episode | Video ID | Title | Domain | Covers |
|---|---|---|---|---|
| Ep 01 | `ldqOnljDINc` | Agentic Loops & stop_reason Explained | D1 | the agentic loop, `stop_reason` values, iteration and conversation-history handling |
| Ep 02 | `ejPWvBcc_DU` | Multi-Agent Systems & Coordinator Patterns | D1 | why one agent fails; coordinator / sub-agent patterns and delegation |
| Ep 03 | `a2N6vKdQUfE` | Subagent Context Passing & Session Management | D1 | passing context to sub-agents and managing session state |
| Ep 04 | `e7ijjK173zI` | Multi-Agent System in Python & Claude SDK (Hands On) | D1 | capstone: a coordinator + sub-agent refund flow in Python |
| Ep 05 | `JJBcpwpsKzk` | PreToolUse, PostToolUse Hooks & Task Decomposition | D1 | hooks for enforcement (gates) and proactive task decomposition |
| Ep 06 | `s1j1vTnCKns` | Tool Descriptions & Tool Misrouting Explained | D2 | writing tool descriptions so the model picks the right tool |
| Ep 07 | `eZj6FtTVV58` | Agent Error Handling & tool_choice Explained | D2 | tool error handling and the `tool_choice` modes |
| Ep 08 | `IVUxGTxSuH8` | MCP Servers, Config, Cline & More | D2 | MCP servers and `.mcp.json` / `.claude.json` configuration |
| Ep 09 | `eh-xxQpfBBY` | Claude Built-in Tools Explained | D2 | built-in tools — grep, glob, read, write, edit; incremental exploration |
| Ep 10 | `qIee1aqSAwY` | CLAUDE.md Hierarchy & Config Rules | D3 | CLAUDE.md hierarchy, imports, `.claude/rules` with `paths:` globs, `/memory` |
| Ep 11 | `v3tMqTmgg2Q` | Custom Slash Commands & Skills | D3 | project- vs user-level slash commands and skills |
| Ep 12 | `q-n1cut5e7c` | Plan Mode vs Execute | D3 | plan vs direct execution and when to plan |
| Ep 13 | `GWCnDhgH840` | Claude Code CI/CD Pipelines | D3 | wiring Claude Code into CI/CD and the `-p` non-interactive flag |
| Ep 14 | `HqwULqy1egw` | Prompt Engineering - Explicit Criteria & False Positives | D4 | explicit criteria, false positives, prompt structure |
| Ep 15 | `FbIcU6YFrhw` | Few-Shot Prompting Explained | D4 | few-shot examples for consistency and tool choice |
| Ep 16 | `CaDaLn7DcQ0` | Structured Output & JSON Schema | D4 | tool-use plus JSON schema for structured extraction |
| Ep 17 | `BXs7QoLQxX0` | Batch API & Multi-Pass Review | D4 | Batch API cost/latency trade-offs and multi-pass code review |
| Ep 18 | `7kaJdZ7veDs` | Why AI Agents Forget - Context Engineering | D5 | context engineering, agent memory, escalation traps |
| Ep 19 | `MqnElZw6NYk` | Subagent Error Propagation & Context Management | D2 / D5 | structured error propagation and code-based context management |
| Ep 20 | `tsIxzFg76Nw` | When AI Needs a Human | D5 | human-in-the-loop escalation triggers |
| Bonus | `-NymqBcFy6E` | Exam Questions Solved \| Exam Traps | all | exam-day tactics, the four distractor traps, worked questions across all five domains |

The video material is third-party and read as a second opinion; where it disagreed with the exam guide,
the guide won.
