# CCAR-F — official exam facts and blueprint

*Source: **Claude Certified Architect – Foundations Exam Guide**, Version 1.0, effective July 2026 —
the official PDF from the Anthropic Partner Academy. The guide's own words: "This guide is the
authoritative reference for candidates preparing to sit the exam."*

Filed here: `external/ccar-f-exam-guide.pdf` (39 pages). Also filed: the Certification Terms and
Conditions, the Anthropic Certification Exam Policy, and the Exam Registration Guide.

## Exam facts

| Parameter | Value |
|---|---|
| Code | CCAR-F |
| Time limit | 120 minutes |
| Passing score | Scaled score of **720** on a scale of 100–1,000 |
| Exam fee | **$125 USD** |
| Validity | 12 months from the date the credential is awarded |
| Result reporting | Pass/fail with scaled score, plus percent-correct by domain |
| Delivery | Pearson VUE — online proctoring or a test centre |
| Registration | Anthropic Partner Academy, then schedule via Pearson VUE |

The passing score was set by a formal standard-setting study, not a fixed percentage.

## Domains and weights

| # | Domain | Weight | Task statements | Our material |
|---|---|---|---|---|
| 1 | Agentic Architecture & Orchestration | **27%** | 7 | [lesson-d1.html](lesson-d1.html) · [bank-d1.html](bank-d1.html) |
| 2 | Tool Design & MCP Integration | **18%** | 5 | [lesson-d2.html](lesson-d2.html) · [bank-d2.html](bank-d2.html) |
| 3 | Claude Code Configuration & Workflows | **20%** | 6 | [lesson-d3.html](lesson-d3.html) · [bank-d3.html](bank-d3.html) |
| 4 | Prompt Engineering & Structured Output | **20%** | 6 | [lesson-d4.html](lesson-d4.html) · [bank-d4.html](bank-d4.html) |
| 5 | Context Management & Reliability | **15%** | 6 | [lesson-d5.html](lesson-d5.html) · [bank-d5.html](bank-d5.html) |

All five domains carry **30 task statements** in total, and the tutor lessons tag every one of them —
the coverage is 1:1 with the official list.

## The 30 official task statements

### Domain 1: Agentic Architecture & Orchestration — 27%

- **1.1** — Design and implement agentic loops for autonomous task execution
- **1.2** — Orchestrate multi-agent systems with coordinator-subagent
- **1.3** — Configure subagent invocation, context passing, and spawning
- **1.4** — Implement multi-step workflows with enforcement and handoff
- **1.5** — Apply Agent SDK hooks for tool call interception and data
- **1.6** — Design task decomposition strategies for complex workflows
- **1.7** — Manage session state, resumption, and forking

### Domain 2: Tool Design & MCP Integration — 18%

- **2.1** — Design effective tool interfaces with clear descriptions and
- **2.2** — Implement structured error responses for MCP tools
- **2.3** — Distribute tools appropriately across agents and configure tool
- **2.4** — Integrate MCP servers into Claude Code and agent workflows
- **2.5** — Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob)

### Domain 3: Claude Code Configuration & Workflows — 20%

- **3.1** — Configure CLAUDE.md files with appropriate hierarchy, scoping,
- **3.2** — Create and configure custom slash commands and skills
- **3.3** — Apply path-specific rules for conditional convention loading
- **3.4** — Determine when to use plan mode vs direct execution
- **3.5** — Apply iterative refinement techniques for progressive
- **3.6** — Integrate Claude Code into CI/CD pipelines

### Domain 4: Prompt Engineering & Structured Output — 20%

- **4.1** — Design prompts with explicit criteria to improve precision and
- **4.2** — Apply few-shot prompting to improve output consistency and
- **4.3** — Enforce structured output using tool use and JSON schemas
- **4.4** — Implement validation, retry, and feedback loops for extraction
- **4.5** — Design efficient batch processing strategies
- **4.6** — Design multi-instance and multi-pass review architectures

### Domain 5: Context Management & Reliability — 15%

- **5.1** — Manage conversation context to preserve critical information
- **5.2** — Design effective escalation and ambiguity resolution patterns
- **5.3** — Implement error propagation strategies across multi-agent systems
- **5.4** — Manage context effectively in large codebase exploration
- **5.5** — Design human review workflows and confidence calibration
- **5.6** — Preserve information provenance and handle uncertainty in multi-

## How Anthropic says to prepare

The guide's own preparation list:

1. **Build an agent with the Claude Agent SDK** — a complete agentic loop with tool calling, error
   handling and session management; spawn subagents and pass context between them.
2. **Configure Claude Code for a real project** — a CLAUDE.md hierarchy, path-specific rules in
   `.claude/rules/`, custom skills with frontmatter options, and at least one MCP server.
3. **Design and test MCP tools** — descriptions that differentiate similar tools, structured error
   responses with categories and retryable flags, and tool-selection testing on ambiguous requests.
4. **Build a structured data extraction pipeline** — `tool_use` with JSON schemas, validation-retry
   loops, optional/nullable fields, and batch processing with the Message Batches API.
5. **Practise prompt engineering** — few-shot examples for ambiguous scenarios, explicit review
   criteria to cut false positives, multi-pass review architectures for large code reviews.
6. **Study context management patterns** — extracting structured facts from verbose tool output,
   scratchpad files for long sessions, subagent delegation to manage context limits.
7. **Review escalation and human-in-the-loop** — when to escalate versus resolve autonomously, and
   human review workflows with confidence-based routing.

### The four hands-on exercises the guide prescribes

1. **Build a Multi-Tool Agent with Escalation Logic**
2. **Configure Claude Code for a Team Development Workflow**
3. **Build a Structured Data Extraction Pipeline**
4. **Design and Debug a Multi-Agent Research Pipeline**

## Official sample questions

These are the guide's own published samples, with its explanations. They are the best available
signal for the exam's register and difficulty.


**Customer Support Resolution Agent — Question 1**

Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?

- A. Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer I
- D.
- B. Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.
- C. Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.
- D. Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type.

*Correct answer: A* — When a specific tool sequence is required for critical business logic (like verifying

**Code Generation with Claude Code — Question 4**

You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?

- A. In the .claude/commands/ directory in the project repository
- B. In ~/.claude/commands/ in each developer's home directory
- C. In the CLAUDE.md file at the project root
- D. In a .claude/config.json file with a commands array Claude Certification Program Exam guide

*Correct answer: A* — Project-scoped custom slash commands should be stored in the

**Multi-Agent Research System — Question 7**

After running the system on the topic "impact of AI on creative industries," you observe that each subagent completes successfully: the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. When you examine the coordinator's logs, you see it decomposed the topic into three subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?

- A. The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.
- B. The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.
- C. The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.
- D. The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.

*Correct answer: B* — The coordinator's logs reveal the root cause directly: it decomposed "creative

**Claude Code for Continuous Integration — Question 10**

Your pipeline script runs claude "Analyze this pull request for security issues" but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?

- A. Add the -p flag: claude -p "Analyze this pull request for security issues" Claude Certification Program Exam guide
- B. Set the environment variable CLAUDE_HEADLESS=true before running the command
- C. Redirect stdin from /dev/null: claude "Analyze this pull request for security issues" < /dev/null
- D. Add the --batch flag: claude --batch "Analyze this pull request for security issues"

*Correct answer: A* — The -p (or --print) flag is the documented way to run Claude Code in non-

## Where the rest of the prep lives

- Tutor: [lesson-d1.html](lesson-d1.html) … [lesson-d5.html](lesson-d5.html) — 164 steps, one per
  official task statement, each with a diagram.
- Drills: [bank-d1.html](bank-d1.html) … [bank-d5.html](bank-d5.html) — 20 questions per domain.
- Mocks: [mock-1.html](mock-1.html) … [mock-6.html](mock-6.html) — six 60-question timed sittings.
- Registration guide: `external/exam-registration-guide.pdf`; policy and terms in the same folder.
