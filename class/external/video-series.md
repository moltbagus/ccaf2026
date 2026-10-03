# The video series

**Claude Certified Architect (CCAR-F)** by **Peace Of Code**
([@peaceofcode](https://www.youtube.com/@peaceofcode)) is a free, third-party YouTube course:
**20 episodes plus a bonus exam-traps episode — 21 videos, ≈ 14.0 hours total runtime**
(sum of the transcripts' last-segment offsets: 50,436 s). It walks the five CCAF domains in
syllabus order and closes with a bonus episode that solves official-style questions and names
the exam's distractor traps.

> **Caveat.** This is a community series — **not** Anthropic material and **not** real exam
> content. It is a study aid only. The
> [official exam guide](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
> remains the authority.

Domain weights it targets: **D1 Agentic Architecture 27% · D2 Tool Design & MCP 18% ·
D3 Claude Code Configuration 20% · D4 Prompt & Structured Output 20% · D5 Context & Reliability 15%**.

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

## How we use it

The lessons and domain notes on this site were enriched from these transcripts — each episode was read as a
second opinion against the corpus and folded into the relevant domain note, and the bonus episode's distractor
traps were merged into [`distractor-heuristic.md`](./distractor-heuristic.md). Where a transcript disagreed with
another source, **the official exam guide won**.

The series is a *source*, not a *spec*: it is third-party and can be wrong. Treat the exam guide as the
authority and these episodes as worked explanations of the same concepts.
