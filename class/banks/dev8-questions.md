# Domain 8 — Tools and MCPs (10.6%) — Question Bank (20 questions)

Coverage: 8.1 ×8, 8.2 ×4, 8.3 ×8.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A team wires two tools into an agent: `search_products` described as "Searches products"
and `find_product` described as "Finds a product." Asked to look up one product by name,
Claude frequently calls the wrong one, and when it guesses wrong it reports the product is
missing.

**Which approach is most effective?**
A) Add a third tool that both searches and finds products, so an always-applicable option exists.
B) Rewrite both descriptions to state precisely what each returns and when to use it, so the two are mutually distinct with no overlap.
C) Merge them into one tool that takes a mode parameter, letting the model pick the behavior.
D) Raise max_tokens so the model has more room to reason about which tool to pick.

**Answer:** B
**Why:** The model selects among tools by matching the request against their descriptions, so two near-identical descriptions split the decision and it guesses. Distinct descriptions fix selection at the layer the model actually controls; a third tool (A) or a mode-parameter merge (C) adds more ambiguity, and a larger token budget (D) changes nothing because the model is not out of room, it is out of signal.
**Trap:** sounds-simple
**Task:** 8.1
**Source:** newly written

### Q2
A `schedule_meeting` tool accepts a `timezone` parameter in its handler, but the model
almost never sends it, so meetings land in the wrong zone. The developer confirms the
parameter exists in the Python function signature.

**Which approach is most effective?**
A) Add a system-prompt instruction telling the model to always include a timezone.
B) Add a second tool, `schedule_meeting_with_timezone`, so the model has an explicit option.
C) Add `timezone` to the tool's `input_schema` with its type and description, since the model only reliably sends arguments the schema declares.
D) Have the handler silently default to UTC and never ask the model for a timezone.

**Answer:** C
**Why:** The model shapes arguments from the JSON Schema, not from your function signature, so a parameter absent from `input_schema` will not be sent reliably. Declaring it in the schema fixes the contract; a prompt instruction (A) is probabilistic guidance, a parallel tool (B) adds another lookalike, and a silent default (D) writes the wrong value instead of asking for the right one.
**Trap:** sounds-helpful
**Task:** 8.1
**Source:** newly written

### Q3
A `create_issue` tool returns the generic string "Error: request failed" whenever an
argument is rejected. The agent reads it, re-sends the identical arguments, gets the same
string, and loops until the retry limit stops it.

**Which approach is most effective?**
A) Return a structured error flagged `is_error: true` that names the invalid field and the accepted values, so the model can correct the call.
B) Increase the retry limit so the agent has more attempts to get the argument right.
C) Add a tool per failure case so each error has its own dedicated path.
D) Loosen validation so any value is accepted and the call never fails.

**Answer:** A
**Why:** A specific, flagged error teaches the model what to change, so the next attempt differs from the last. A higher retry limit (B) repeats the same opaque failure more times; a tool per case (C) multiplies surface without adding signal; removing validation (D) hides a real data problem and can write a wrong record.
**Trap:** sounds-efficient
**Task:** 8.1
**Source:** newly written

### Q4
An `update_quantity` tool passes the raw model arguments straight to the database. When
the model sends the string `"5"` or a negative number, the insert throws mid-write and the
tool returns the raw SQL error text.

**Which approach is most effective?**
A) Let the database reject bad values and surface the raw SQL error to the model.
B) Add a prompt instruction telling the model to always send valid values.
C) Wrap the whole handler in try/except and return "something went wrong."
D) Validate arguments against the schema (type, range, enum) before executing, and return a specific error the model can act on.

**Answer:** D
**Why:** Checking types, ranges, and enums at the boundary stops a bad value before it reaches the database and lets the tool return a message that names the fix. Leaning on the database (A) leaks an opaque error the model cannot map to a correction; a prompt instruction (B) is guidance the model can still miss; a catch-all message (C) is the same useless signal the model already receives.
**Trap:** sounds-thorough
**Task:** 8.1
**Source:** newly written

### Q5
An agent can send email through a `send_email` tool. Policy requires a human to approve
each send before it leaves the system, without changing the model's behavior otherwise.

**Which approach is most effective?**
A) Add a prompt instruction asking the model to wait for human approval before sending.
B) Use a tool-approval pattern in the harness: intercept the `send_email` tool_use, obtain human approval, then execute and return the `tool_result`.
C) Give the model a `request_approval` tool it should call before sending.
D) Route all email through a subagent whose prompt always asks for approval.

**Answer:** B
**Why:** Approval is a control that belongs to the harness, which can deterministically hold a tool call and gate its execution. Prompt instructions (A) and a voluntary approval tool (C) are probabilistic and can be skipped; a subagent (D) is the same probabilistic mechanism with extra latency.
**Trap:** sounds-smart
**Task:** 8.1
**Source:** newly written

### Q6
A `get_forecast` tool fails two ways: sometimes the model sent a malformed date it could
fix, sometimes the upstream API is down and no retry will help. Today both return the same
generic message, and the agent retries endlessly during outages.

**Which approach is most effective?**
A) Return the same generic error for both, since the model cannot tell the difference anyway.
B) Always mark both as `is_error` and let the model retry either way.
C) Distinguish the two: for a validation error, name the field and the valid format so the model can fix the call; for a system error, state plainly that retrying will not help.
D) Add an internal retry wrapper that re-calls the upstream API on any failure.

**Answer:** C
**Why:** A validation error is fixable by the model and should describe the correction; a system error is not, and saying so stops the loop. One generic message (A) or one blanket flag (B) gives the model no basis to tell them apart, and an internal retry wrapper (D) hides an outage behind latency and still fails.
**Trap:** sounds-enterprise
**Task:** 8.1
**Source:** newly written

### Q7
A single tool named `process` is described as "Processes data" and handles orders, refunds,
and shipments by a `mode` argument. The agent frequently sends the wrong mode with fields
that do not match it.

**Which approach is most effective?**
A) Split it into purpose-specific tools (`create_refund`, `ship_order`) each with a clear description and a schema specific to its arguments.
B) Keep one tool but add few-shot examples of each mode to the prompt.
C) Add more modes to the `process` tool to cover the cases it misses.
D) Rename the tool to `process_anything` for clarity.

**Answer:** A
**Why:** A vague umbrella tool forces the model to infer both the mode and the fields from one thin description. Purpose-specific tools carry a description and a schema matched to each job, so selection and argument shaping both improve; few-shot examples (B) paper over the ambiguity, more modes (C) widen it, and a clearer name (D) does not touch the schema that shapes arguments.
**Trap:** sounds-pragmatic
**Task:** 8.1
**Source:** newly written

### Q8
When the model cannot find what it needs, a developer's reflex has been to add a tool per
case. The tool list has grown to thirty near-duplicate search helpers, and selection is now
worse than it was with three.

**Which approach is most effective?**
A) Add a tool for each remaining case so nothing is missing.
B) Keep all thirty but raise max_tokens so the model can reason over the full list.
C) Give the model a meta-tool that picks among the thirty.
D) Consolidate to a small set of well-described, non-overlapping tools rather than many thin wrappers.

**Answer:** D
**Why:** The more tools that sound alike, the more the model guesses, and every schema costs context on every request, so consolidation fixes both accuracy and cost. Adding more tools (A) increases the ambiguity that caused the failures; a larger token budget (B) pays more for the same over-broad set; a meta-tool (C) hides the ambiguity behind one more decision.
**Trap:** sounds-simple
**Task:** 8.1
**Source:** newly written

### Q9
A team is authoring an MCP server. They want to expose callable functions the model
invokes, a browsable set of documents the client can attach as context, and a set of
reusable user-selected workflows.

**Which approach is most effective?**
A) Documents as tools, workflows as resources, functions as prompts.
B) Everything as tools, since tools are the most flexible primitive.
C) Functions as tools (model-invoked), documents as resources (application-controlled context addressed by URI), workflows as prompts (user-invoked templates).
D) Everything as prompts so the user drives every step.

**Answer:** C
**Why:** MCP has three primitives with distinct control: tools are model-invoked functions, resources are application-controlled context addressed by URI, and prompts are user-invoked templates closer to a slash command. Flattening everything into tools (B) or prompts (D) misuses the control model the primitives exist to express, and A swaps the roles.
**Trap:** sounds-efficient
**Task:** 8.2
**Source:** newly written

### Q10
An MCP server wraps a local command-line tool on a developer's machine. It must run as a
subprocess of the host application with no network exposure.

**Which approach is most effective?**
A) stdio, running the server as a local subprocess over stdin/stdout.
B) Streamable HTTP so any client on the network can reach it.
C) A TCP socket bound to 0.0.0.0.
D) Polling a shared database table for requests.

**Answer:** A
**Why:** Transport follows location: a local process that must not be networked speaks over stdin/stdout as a stdio server. HTTP (B) and a socket on 0.0.0.0 (C) expose it to the network the requirement forbids, and database polling (D) is not an MCP transport at all.
**Trap:** sounds-helpful
**Task:** 8.2
**Source:** newly written

### Q11
A team needs Claude to call an internal pricing service. Three separate Claude
applications need the same pricing operations, and the pricing team wants to version and
deploy them on its own schedule.

**Which approach is most effective?**
A) Copy the pricing logic into each application's tool definitions.
B) Build an MCP server that exposes the pricing operations, so all three applications connect to one server the pricing team maintains.
C) Paste the current prices into each application's context window.
D) Rely on a built-in web-search tool to find the prices.

**Answer:** B
**Why:** The stem names reuse across applications and independent maintenance, which is exactly what an MCP server provides: one implementation, many clients, one lifecycle. Copying (A) is three diverging copies to fix; pasting prices (C) gives no live access and wastes context; a built-in search tool (D) cannot reach an internal API.
**Trap:** sounds-thorough
**Task:** 8.2
**Source:** newly written

### Q12
A developer building an MCP server asks where the model loop and the connection should
live.

**Which approach is most effective?**
A) The MCP server owns the model loop and calls the model itself.
B) The server must own both the model loop and the tools so the client stays thin.
C) The model connects directly to the server with no host application involved.
D) The host application (client) owns the connection and the model loop; the server you author exposes capability and answers requests.

**Answer:** D
**Why:** The client-versus-server split is the point: the host application runs the model loop and holds the connection, while the server only exposes capability and answers requests. Putting the loop in the server (A, B) inverts the roles, and a model connecting directly to the server (C) removes the host that owns the loop.
**Trap:** sounds-smart
**Task:** 8.2
**Source:** newly written

### Q13
A developer wants Claude to read the contents of a local file the user points to in Claude
Code. They propose building a custom MCP server to expose file reading.

**Which approach is most effective?**
A) Build the MCP server, since custom is more reliable.
B) Write a custom tool that shells out to `cat`.
C) Use the built-in file-reading capability, since it already does this with nothing to build or maintain.
D) Add the file contents to the system prompt on every request.

**Answer:** C
**Why:** If a built-in already provides the capability, it wins outright: zero build and zero maintenance. A custom server (A) or a shell-out tool (B) adds runtime and upkeep for something that already exists, and preloading file contents (D) is not live access and wastes context.
**Trap:** sounds-pragmatic
**Task:** 8.3
**Source:** newly written

### Q14
A team wants Claude to always write commit messages in a fixed house style with a specific
structure. No external system is contacted and no live data is needed. A developer
proposes building an MCP server.

**Which approach is most effective?**
A) Express the house style as a Skill or project instructions, since it is pure behavior needing no executable capability.
B) Build the MCP server exposing a `format_commit_message` tool.
C) Write a custom tool that returns the style guide text.
D) Add a new built-in tool for commit formatting.

**Answer:** A
**Why:** A style guide is behavior, not capability: it needs no code, no external system, and no reuse across apps, so a Skill or project instructions carries it with no maintenance. An MCP server (B) and a custom tool (C) both add runtime for text, and a developer cannot add built-in tools (D).
**Trap:** sounds-enterprise
**Task:** 8.3
**Source:** newly written

### Q15
A single application needs a live call to the company's internal holiday-calendar API to
answer scheduling questions. No other client will ever need it.

**Which approach is most effective?**
A) Build an MCP server, since servers are the reusable way to expose APIs.
B) Wire a custom tool into this application that calls the API, since only one app needs it and an MCP server would add packaging overhead with no reuse.
C) Give the agent the built-in web-search tool and let it find holidays.
D) Paste the holiday list into the context window.

**Answer:** B
**Why:** A custom tool wired into one application gives precise control and live access without packaging a server no one else will reuse. An MCP server (A) is the highest-setup option, justified only by reuse or an independent lifecycle, neither of which the stem names; a web-search tool (C) cannot reach the internal API, and pasting data (D) is not live.
**Trap:** sounds-simple
**Task:** 8.3
**Source:** newly written

### Q16
A general-purpose agent is loaded with every tool in the organization, around sixty, "just
in case." Tool selection is now unreliable and each request is expensive.

**Which approach is most effective?**
A) Add more tools to cover the cases the agent currently gets wrong.
B) Keep all sixty and raise max_tokens so the model can reason over the full list.
C) Merge all sixty into one tool that takes a mode parameter.
D) Scope the agent to the small set of tools its job needs, with distinct descriptions, and let other agents own other capabilities.

**Answer:** D
**Why:** Every tool's name, description, and schema is sent on every request, so tool count is a context and cost budget, and a large overlapping set degrades selection. Scoping fixes both accuracy and cost; adding tools (A) worsens the ambiguity, a larger token budget (B) pays more for the same set, and one mode-parameter tool (C) hides distinct capabilities behind a single vague description.
**Trap:** sounds-efficient
**Task:** 8.3
**Source:** newly written

### Q17
A platform team is configuring a fleet of agents and proposes giving every agent the full
tool catalogue so any agent can handle any request.

**Which approach is most effective?**
A) Give each agent only the tools its role needs, since tool definitions cost context on every request and a large overlapping set degrades selection.
B) Give every agent every tool so no request is unhandleable.
C) Give every agent every tool but describe them all identically for consistency.
D) Give every agent every tool and add a prompt telling it to ignore irrelevant ones.

**Answer:** A
**Why:** Loading every tool maximizes cost and blast radius while making the correct tool harder to find, so each agent should hold only what its job needs. Giving everyone everything (B) is the classic anti-pattern, identical descriptions (C) make selection worse, and a prompt to ignore irrelevant tools (D) pays the full context cost and still leaves the ambiguity.
**Trap:** sounds-helpful
**Task:** 8.3
**Source:** newly written

### Q18
A billing agent occasionally needs to look up a customer's shipping address. A developer
proposes adding the entire logistics tool set to the billing agent so it is covered.

**Which approach is most effective?**
A) Add the whole logistics tool set so the billing agent can do anything logistics can.
B) Add the logistics tools and a prompt telling the agent to ignore the ones it does not need.
C) Add only the single address-lookup tool the billing agent needs, keeping the set minimal and distinct.
D) Create a second billing agent with the same tools to spread the load.

**Answer:** C
**Why:** Add the smallest capability that satisfies the need: one address-lookup tool keeps the set minimal and distinct and pays context only for what is used. The full logistics set (A) spends context on every request for tools the job never calls, a prompt to ignore them (B) still pays that cost, and a duplicate agent (D) adds a second maintainer without changing the tool set.
**Trap:** sounds-thorough
**Task:** 8.3
**Source:** newly written

### Q19
An agent needs current news. The platform already provides a built-in web-search tool. A
developer proposes building a custom news-scraping MCP server with curated sources.

**Which approach is most effective?**
A) Build the custom news MCP server so the sources can be controlled.
B) Write a custom tool that returns hard-coded headlines.
C) Paste today's headlines into the system prompt.
D) Use the built-in web-search tool, since it already provides the capability with nothing to build or maintain.

**Answer:** D
**Why:** When a built-in already provides the capability, it wins: no build, no maintenance. A custom MCP server (A) or a scraping tool (B) adds runtime and upkeep for something already available, and pasting headlines (C) is not live and goes stale immediately.
**Trap:** sounds-smart
**Task:** 8.3
**Source:** newly written

### Q20
A team wants Claude to (i) follow a fixed escalation procedure and (ii) query a live
ticketing system that three separate applications need. They propose solving both with one
large MCP server.

**Which approach is most effective?**
A) Put both in the MCP server so everything is in one place.
B) Express the procedure as a Skill (pure behavior) and expose the ticketing queries as an MCP server (shared live capability across three clients).
C) Put both in the system prompt of each application.
D) Build two MCP servers, one per concern.

**Answer:** B
**Why:** Match each need by reach and cost: a procedure is pure behavior and belongs in a Skill, while a live capability shared by three clients justifies an MCP server. Bundling the procedure into the server (A) adds runtime for text, prompts in each app (C) give neither reuse nor live access, and two servers (D) over-builds the behavior half that needs no server at all.
**Trap:** sounds-pragmatic
**Task:** 8.3
**Source:** newly written
