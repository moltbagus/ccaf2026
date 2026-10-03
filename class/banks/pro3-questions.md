# Domain 3 — Integration (19%) — Question Bank (20 questions)

Coverage: 3.1 ×3, 3.2 ×2, 3.3 ×3, 3.4 ×2, 3.5 ×3, 3.6 ×2, 3.7 ×3, 3.8 ×2.
Trap types used: sounds-enterprise, sounds-efficient, sounds-helpful, sounds-pragmatic,
sounds-simple, sounds-smart, sounds-thorough.

---

### Q1
A field-service agent is provisioned with 22 tools, including `update_contract_price`,
`issue_credit`, and `close_account`. Technicians only ever need to read job orders and
attach photos. A platform team proposes putting an enterprise SSO-gated human approval
workflow and full audit logging in front of the three write tools, keeping them reachable
for "exceptional cases". The auditor notes the agent's scope is broader than any
technician's role.

**Which approach is most effective?**
A) Add the approval workflow and audit logging, keeping the three write tools reachable for exceptions.
B) Remove the three write tools from the agent's configuration and expose a read-and-attach tool set only.
C) Keep the tools but require a second technician to co-approve each write.
D) Replace the model with a larger one that follows the "never write" instruction more reliably.

**Answer:** B
**Why:** Least privilege eliminates the capability rather than guarding it: a tool the role never needs should not exist, so a bypass or prompt injection has nothing to reach. An approval gate and audit logging are compensating and detective controls — they change what you notice, not what the agent may do — and a larger model holds exactly the same write scope.
**Trap:** sounds-enterprise
**Task:** 3.1
**Source:** newly written

### Q2
An operations agent has a `run_shell` tool that accepts an unconstrained command string;
it is used to check disk usage and restart services. Audit shows the model has invoked it
to edit configuration files and list secrets. The team must keep the restart capability.

**Which approach is most effective?**
A) Add a prompt instruction listing the shell commands the agent is permitted to run.
B) Keep `run_shell` but block the specific dangerous binaries with a denylist.
C) Replace `run_shell` with two narrow tools — `check_disk` and `restart_service` — whose input schemas accept only a validated service name.
D) Increase logging on `run_shell` and alert on any configuration-file edit.

**Answer:** C
**Why:** Constrain capability at the interface, following least privilege, so the unwanted behaviour is impossible rather than discouraged: a schema that accepts only a service name cannot express "edit config". A prompt instruction is probabilistic, a binary denylist is brittle and bypassable, and logging only records the misuse after it has happened.
**Trap:** sounds-simple
**Task:** 3.1
**Source:** newly written

### Q3
A procurement agent's tool list grew from 6 to 41 tools as teams each added "just one
more" integration. Latency is up 30% and the agent increasingly selects the wrong tool
among near-duplicates (`get_invoice`, `fetch_invoice`, `lookup_invoice`). The binding
constraint is decision noise and turn latency.

**Which approach is most effective?**
A) Prune to the tools the role actually needs, deduplicate the overlapping tools, and move the rest behind progressive discovery.
B) Keep all 41 tools but improve each description so the model can disambiguate.
C) Add a routing classifier in front that selects the correct tool before the model sees them.
D) Move to a larger model so it can hold all 41 tool definitions reliably.

**Answer:** A
**Why:** Capability bloat widens the model's decision space and blast radius, so the fix is to remove tools the role never uses, collapse the near-duplicates, and load the remainder on demand — reducing both latency and mis-selection at the source. Better descriptions and a larger model still present 41 choices, and a routing classifier adds a layer and a new failure mode without shrinking the surface the model reasons over.
**Trap:** sounds-thorough
**Task:** 3.1
**Source:** newly written

### Q4
A support agent acts on behalf of end users and calls the ticketing API with a shared
service account that holds broad scope, so any customer's ticket is reachable regardless
of who is chatting. Security demonstrates a user can prompt the agent into reading
another customer's ticket. The requirement is that the agent only accesses data the
requesting user is entitled to.

**Which approach is most effective?**
A) Add a prompt instruction telling the agent to fetch only the current user's tickets.
B) Log every ticket read and alert when a session reads more than one account.
C) Keep the shared service account but add a per-request rate limit.
D) Replace the shared service account with per-user delegated (on-behalf-of) tokens scoped to the requesting user's entitlements.

**Answer:** D
**Why:** The gap is that the agent's identity is broader than the user's, so authorization must be enforced at the token boundary — per-user delegated tokens make the over-reach impossible, not merely discouraged. A prompt instruction is probabilistic, alerting is detective, and a rate limit changes volume rather than scope.
**Trap:** sounds-pragmatic
**Task:** 3.2
**Source:** newly written

### Q5
An integration authenticates to three SaaS APIs with long-lived static keys stored in an
env file shared across dev, staging, and production. Each key carries every scope the
provider offers. A review asks to close the authorization gaps without redesigning the
agent's behaviour.

**Which approach is most effective?**
A) Rotate the static keys quarterly and move them into a secrets manager.
B) Move to short-lived OAuth tokens scoped to only the operations the agent performs, with separate per-environment credentials.
C) Put an API gateway in front that logs every call and rate-limits per key.
D) Encrypt the env file and restrict read access to the deploy pipeline.

**Answer:** B
**Why:** The gap is standing, over-scoped, shared-across-environment privilege; short-lived least-scope tokens per environment shrink both the window and the breadth of exposure. Rotating a static key still leaves it long-lived, over-scoped, and shared; a gateway and encryption are protective layers that do not reduce the scope the credential actually holds.
**Trap:** sounds-enterprise
**Task:** 3.2
**Source:** newly written

### Q6
A customer-facing answer service has an SLA of 1.2 s at p95 and a quality bar of 90%.
A retrieval-heavy configuration with a large model and eight retrieved chunks reaches 95%
quality at 3.1 s p95. A single-pass configuration with three chunks reaches 90% at 0.9 s
p95. The two designs are the ones on the table.

**Which approach is most effective?**
A) Ship the single-pass configuration: it clears the 90% quality bar while respecting the 1.2 s p95 SLA, and document the trade-off.
B) Ship the retrieval-heavy configuration because 95% quality is worth the extra latency.
C) Ship the retrieval-heavy configuration but add caching to bring the mean latency down.
D) Ship the retrieval-heavy configuration and renegotiate the SLA up to 3.5 s.

**Answer:** A
**Why:** Name the binding constraint — the 1.2 s p95 SLA with a 90% quality floor — and choose the cheapest configuration that clears it; the single pass does, and the extra seven quality points are not worth breaching a stated SLA. B treats accuracy as unconditional, C optimises the mean while the SLA is set at p95, and D changes the requirement instead of meeting it.
**Trap:** sounds-efficient
**Task:** 3.3
**Source:** newly written

### Q7
A triage agent must decide within 900 ms at p95. About 80% of cases are simple and a
small model resolves them at 400 ms; the remaining 20% are ambiguous and a large model
resolves them at 2.8 s. The team wants one configuration for all cases.

**Which approach is most effective?**
A) Use the large model for every case so accuracy is uniform.
B) Use the small model for every case to guarantee the SLA.
C) Use the large model and add few-shot examples to make it faster.
D) Use a cascade: run the small model first and escalate only the ambiguous 20% to the large model, keeping the p95 under budget while hard cases still get depth.

**Answer:** D
**Why:** Right-size each step against the binding constraint: the cascade keeps the p95 inside 900 ms because only a fifth of traffic pays the large-model cost, and hard cases still get the reasoning they need. A single large model blows the SLA on every case, a single small model sacrifices accuracy on the ambiguous fifth, and few-shot examples do not remove the large model's per-call latency.
**Trap:** sounds-helpful
**Task:** 3.3
**Source:** newly written

### Q8
A nightly batch enrichment job processes 5 million records under a fixed cost ceiling.
A deep multi-pass configuration costs four times the single-pass configuration and would
breach the ceiling; the single-pass configuration fits. The accuracy floor is 88%:
single-pass delivers 89%, deep delivers 96%.

**Which approach is most effective?**
A) Use the deep configuration and request a budget increase, since 96% accuracy is materially better.
B) Use the deep configuration only on weekends when spend is less scrutinised.
C) Use the single-pass configuration: it clears the 88% accuracy floor within the fixed cost ceiling, and the extra seven points are not worth breaching the binding constraint.
D) Add a third pass to the deep configuration to push accuracy above 96%.

**Answer:** C
**Why:** The binding constraint is cost, and the accuracy floor is already met, so the defensible choice is the cheapest configuration that clears the bar — spending 4× for quality beyond the requirement is not architecture. A and B breach the ceiling, and D spends even more in the direction already over budget.
**Trap:** sounds-smart
**Task:** 3.3
**Source:** newly written

### Q9
An agent platform runs three million requests a day across forty tools. A silent
regression in tool selection — the agent calls `refund` where it should call `void` —
produces no errors and normal latency, and is only noticed when support complaints spike
weeks later. Observability cost must stay bounded.

**Which approach is most effective?**
A) Emit structured decision logs (chosen tool, arguments, trace ID), aggregate tool-selection distribution as a metric and alert on shifts, and score a sampled fraction of runs against a rubric.
B) Store every full prompt and response and have an engineer review a daily sample.
C) Raise the log level to debug across all services to capture more detail.
D) Add error-rate alerting only, on the assumption that regressions surface as errors.

**Answer:** A
**Why:** At volume you cannot read traces by hand, so the strategy is decision-level structured logs aggregated into metrics you can alert on, plus sampled rubric scoring for the quality signal metrics cannot express. Full capture does not scale and carries PII risk, debug verbosity raises cost without adding a signal, and error-only alerting assumes exactly the error signal the scenario says is absent.
**Trap:** sounds-thorough
**Task:** 3.4
**Source:** newly written

### Q10
Multi-hop runs (agent → tool → API → agent) fail intermittently, and support cannot
reconstruct what happened across the hops. The platform must be able to reconstruct a run
end to end without capturing full request and response payloads, which contain PII.

**Which approach is most effective?**
A) Log full request and response bodies at every hop so nothing is missing.
B) Add a separate debug agent that watches the queue and reports anomalies.
C) Reduce the number of hops by merging the downstream services.
D) Propagate a correlation/trace ID through every hop and log structured decision metadata — not full payloads — so runs are reconstructable without PII exposure.

**Answer:** D
**Why:** A trace ID threads the hops into one reconstructable run, and structured decision metadata gives the signal without copying PII into the log. Full payload logging is exactly the PII exposure the constraint forbids, a watcher agent adds a second moving part without end-to-end linkage, and merging services is a redesign that does not by itself make runs traceable.
**Trap:** sounds-simple
**Task:** 3.4
**Source:** newly written

### Q11
A legal RAG system indexes 400,000 contracts and must answer two very different
questions: "what is the liability cap in this MSA?" (semantic) and "which clauses changed
in Q3?" (exact term plus a date filter). Fixed 512-token chunks over a single vector index
keep returning the wrong passages.

**Which approach is most effective?**
A) Increase the embedding model size to improve semantic similarity.
B) Chunk on document structure (sections and clauses), keep provenance, and add a hybrid index — vectors plus keyword — with metadata filters for clause ID and date.
C) Halve the chunk size to 256 tokens for finer granularity.
D) Raise top-k to 50 and let the model locate the clause itself.

**Answer:** B
**Why:** The data shape is structured clauses and the query pattern spans semantic, exact, and filtered asks, so chunk boundaries should follow document structure and the index should carry the representations each query needs. A bigger embedding model helps only the semantic half, halving the window changes granularity without respecting structure, and a larger top-k raises recall of noise rather than precision on an exact identifier.
**Trap:** sounds-efficient
**Task:** 3.5
**Source:** newly written

### Q12
A policy RAG system's chunks routinely cut a rule in half, so a retrieved passage states a
condition but not its exception, and answers misstate policy. Retrieved units must be
self-contained and attributable to their source section.

**Which approach is most effective?**
A) Add a reranker over the existing fixed-window chunks.
B) Reduce the chunk size so each chunk is more focused.
C) Chunk on document structure (headings and rules) with overlap only where sentences genuinely span boundaries, and store section provenance so each retrieved unit is self-contained and attributable.
D) Increase top-k so both halves of a rule are usually retrieved together.

**Answer:** C
**Why:** Chunk boundaries set by document structure keep a rule with its exception, and provenance makes each unit attributable — the two properties the constraint names. A reranker reorders the same severed chunks, smaller chunks worsen the amputation, and a larger top-k hopes both halves appear and leaves attribution unsolved.
**Trap:** sounds-smart
**Task:** 3.5
**Source:** newly written

### Q13
A RAG corpus is refreshed daily, but after each refresh answers become confidently wrong
and cite content that was deleted. Latency and model version are unchanged. Retrieval
must reflect the current documents.

**Which approach is most effective?**
A) Raise the temperature so the model is less confident in its answers.
B) Add a prompt instruction telling the model to prefer recent content.
C) Re-embed the entire corpus every hour to keep it fresh.
D) Fix the indexing/refresh pipeline so stale chunks are deleted and re-indexed with versioned provenance, then verify retrieval returns the current versions.

**Answer:** D
**Why:** The symptom points at stale indexing, so the fix is in the pipeline: delete superseded chunks, re-index, and carry versioned provenance so freshness is verifiable. Temperature and a "prefer recent" instruction change nothing about what is retrieved, and hourly full re-embeds cost far more while still not deleting the deleted content.
**Trap:** sounds-helpful
**Task:** 3.5
**Source:** newly written

### Q14
One assistant must answer three queries: (a) "summarize our refund policy" (prose),
(b) "status of order 88213-B" (an exact identifier), and (c) "what depends on service
payments-api?" (a relationship question). The team proposes a single large vector index
over everything.

**Which approach is most effective?**
A) Route by shape: vectors for the prose, lexical/ID lookup for the order, and graph traversal for the dependency question — hybrid-fused where the patterns mix.
B) Use one vector index with a larger embedding model.
C) Fine-tune the model on all three corpora so retrieval becomes unnecessary.
D) Increase top-k and raise temperature so the model can handle all three query types.

**Answer:** A
**Why:** Retrieval quality is a function of fit — prose suits vectors, an exact ID suits lexical lookup, and a dependency question suits graph traversal — which is what matching retrieval to data shape and query pattern means. A single vector index chosen by fashion cannot resolve exact identifiers or relationships, fine-tuning cannot supply live order status, and raising top-k and temperature increases confident errors.
**Trap:** sounds-pragmatic
**Task:** 3.6
**Source:** newly written

### Q15
A product catalog holds two million structured rows (SKU, price, stock, category). Users
ask filtered and aggregate questions such as "in-stock laptops under $900 with 16GB RAM".
A vendor pitches a vector database for the catalog.

**Which approach is most effective?**
A) Load the whole catalog into the model's context so it can filter directly.
B) Build a vector index over the rows and rely on semantic similarity for the filters.
C) Query the catalog with SQL and filters (exposed as a structured tool), and reserve vectors for the prose policy content rather than the rows.
D) Embed each row and raise top-k to 1000.

**Answer:** C
**Why:** Structured rows are queried with SQL and filters — exact, cheap, and correct for aggregates — while vectors are reserved for the prose where similarity actually helps, which is matching retrieval to data shape. Loading two million rows overflows context, and embedding the rows plus a large top-k approximates an exact filter with a fashionable method that cannot guarantee it.
**Trap:** sounds-enterprise
**Task:** 3.6
**Source:** newly written

### Q16
An agent needs one stable call to an internal HR API, plus access to a 200-tool partner
ecosystem that changes frequently. Neither context bloat nor protocol overhead where it is
unneeded is acceptable.

**Which approach is most effective?**
A) Wrap the HR call and all 200 partner tools as up-front MCP tools loaded on every turn.
B) Call the HR API directly (a single stable call) and use MCP with progressive discovery for the partner ecosystem.
C) Replace the HR call with a dedicated agent-to-agent delegation.
D) Expose everything through a single CLI wrapper to avoid protocols altogether.

**Answer:** B
**Why:** Match the mechanism to the boundary and lifecycle: a single stable call is cheapest as a direct API call, while a large, changing ecosystem fits MCP with progressive discovery so tool definitions load on demand instead of bloating every turn. A front-loads 200 tools, C adds an agent hop for what is one function call, and D hides many tools behind a CLI that still lacks per-tool auth and discovery.
**Trap:** sounds-efficient
**Task:** 3.7
**Source:** newly written

### Q17
A research coordinator must delegate to a peer research agent that owns its own context,
its own tools, and its own policy, and that returns findings over time. The team proposes
wrapping the peer as a single function call.

**Which approach is most effective?**
A) Wrap the peer as a single tool with a fixed input schema.
B) Give the coordinator the peer's full tool set directly.
C) Expose the peer through a CLI wrapper.
D) Use agent-to-agent delegation, because the peer owns its own context, tools, and policy rather than being a single function call.

**Answer:** D
**Why:** Protocol choice is governed by the boundary the integration crosses: an autonomous peer that owns its own context, tools, and policy is reached by agent-to-agent delegation, not by pretending it is one deterministic function. A single-schema tool and a CLI wrapper both erase the peer's own agency and policy, and handing the coordinator the peer's tools ignores that the peer, not the coordinator, owns them.
**Trap:** sounds-simple
**Task:** 3.7
**Source:** newly written

### Q18
Fourteen internal teams each maintain their own tools, changing weekly, and each needs
per-tool authentication. Leadership wants Claude agents to reach all of them through one
integration surface with discovery as the ecosystem evolves.

**Which approach is most effective?**
A) Adopt MCP: a common protocol with discovery and auth so many tools sharing a lifecycle reach the agent through one surface.
B) Have each team write bespoke function-calling glue for every agent.
C) Build one large CLI that fronts every service.
D) Give every agent a static list of all tools, refreshed manually each week.

**Answer:** A
**Why:** MCP standardises how the model reaches tools with a common protocol, discovery, and auth — the fit when many tools share a lifecycle and you want one integration surface. Bespoke glue multiplies maintenance, a single CLI still lacks per-tool auth and discovery, and a manually refreshed static list drifts out of date against a weekly-changing ecosystem.
**Trap:** sounds-helpful
**Task:** 3.7
**Source:** newly written

### Q19
An agent has access to a large tool ecosystem. Today all tool definitions and a
60k-token knowledge base are loaded on every turn, inflating cost and causing the model to
lose focus. Context must stay lean while the agent retains access to the capabilities it
actually needs.

**Which approach is most effective?**
A) Compress the knowledge base so more fits in the context window.
B) Load everything but move to a larger model with a bigger window.
C) Load capabilities progressively: expose a search-and-select step so tool definitions and context load on demand, keeping the working context small.
D) Cache the full context so repeat turns are cheaper.

**Answer:** C
**Why:** Progressive discovery loads capabilities on demand and keeps the working context small, which is the direct answer to context bloat and attention dilution. Compression loses fidelity, a bigger window still front-loads everything and does not fix focus, and caching reduces repeat-turn cost without shrinking the context the model must reason over.
**Trap:** sounds-smart
**Task:** 3.8
**Source:** newly written

### Q20
A narrow, stable workflow uses only three tools and a fixed 2k-token policy. A redesign is
proposed that front-loads eighty tool definitions and the entire knowledge base "so the
agent is never blocked". Context budget and latency both matter.

**Which approach is most effective?**
A) Front-load all eighty tools and the knowledge base so the agent is never blocked.
B) Load the three tools and the 2k policy directly: the task is narrow and stable, so progressive discovery would add machinery with no benefit here.
C) Front-load everything but enable prompt caching to offset the cost.
D) Add a routing agent that selects among the eighty tools on each turn.

**Answer:** B
**Why:** Progressive discovery is a means to keep context lean; where the task is narrow and stable, loading its three tools and small policy directly is the leaner design, and the monolithic alternative is capability bloat wearing a protocol badge. Front-loading eighty tools plus the whole knowledge base inflates every turn, caching does not remove the bloat, and a routing agent adds a layer to solve a problem the narrow task does not have.
**Trap:** sounds-pragmatic
**Task:** 3.8
**Source:** newly written
