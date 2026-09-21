import json, collections, re

P = '/home/colb/.openclaw/workspace/ccaf/class/lessons/d4.json'
d = json.load(open(P))

REQUIRED_TOP = {"domain","title","weight","goal","tasks","steps"}
KINDS = {"teach","check","diagram","recap","drill"}
DIAGRAMS = {"agentic-loop","hook-gate","hub-spoke","context-window","escalation-tree",
            "batch-timeline","schema-contract","claude-md-hierarchy","wrapper-alias","error-propagation"}
TRAPS = {"sounds-enterprise","sounds-efficient","sounds-smart","sounds-helpful",
         "sounds-thorough","sounds-simple","sounds-pragmatic"}
STEP_KEYS = {"task","kind","title","lead","points","diagram","caption","code","ask","takeaway"}
TASKS = ["4.1","4.2","4.3","4.4","4.5","4.6"]

fails = []
def chk(cond, msg):
    if not cond: fails.append(msg)

# top level
chk(REQUIRED_TOP <= set(d), "missing top-level keys: %s" % sorted(REQUIRED_TOP - set(d)))
chk(d["domain"] == 4, "domain must be 4")
chk(d["tasks"] == TASKS, "tasks list mismatch")
chk(isinstance(d["steps"], list), "steps must be a list")

steps = d["steps"]
n = len(steps)
chk(20 <= n <= 26, "step count %d outside 20-26" % n)

per_task = collections.Counter()
kinds = collections.Counter()
diagrams_used = []
gates = 0
asks = 0

for i, s in enumerate(steps):
    tag = "step[%d] %r" % (i, s.get("title"))
    chk(STEP_KEYS <= set(s), "%s missing keys %s" % (tag, sorted(STEP_KEYS - set(s))))
    chk(s.get("kind") in KINDS, "%s bad kind %r" % (tag, s.get("kind")))
    chk(s.get("task") in TASKS, "%s bad task %r" % (tag, s.get("task")))
    chk(isinstance(s.get("title"), str) and 0 < len(s["title"]) <= 60, "%s title len bad" % tag)
    chk(isinstance(s.get("lead"), str) and s["lead"], "%s lead empty" % tag)
    chk(isinstance(s.get("points"), list) and len(s["points"]) <= 5, "%s points not 0-5 list" % tag)
    for p in s.get("points", []):
        chk(isinstance(p, str) and len(p) <= 140, "%s bullet too long (%d)" % (tag, len(p)))
    chk(isinstance(s.get("takeaway"), str) and len(s["takeaway"]) <= 140, "%s takeaway len bad" % tag)
    dg = s.get("diagram")
    chk(dg is None or dg in DIAGRAMS, "%s bad diagram %r" % (tag, dg))
    if dg is not None:
        diagrams_used.append(dg)
        chk(isinstance(s.get("caption"), str) and s["caption"], "%s diagram without caption" % tag)
    else:
        chk(s.get("caption") is None, "%s caption set without diagram" % tag)
    if s.get("kind") in ("check","drill"):
        gates += 1
        chk(isinstance(s.get("ask"), dict), "%s kind %s needs ask" % (tag, s.get("kind")))
    if s.get("kind") not in ("check","drill"):
        chk(s.get("ask") is None, "%s ask must be null for kind %s" % (tag, s.get("kind")))

    a = s.get("ask")
    if a is not None:
        asks += 1
        chk(set(a) == {"q","options","answer","why","trap"}, "%s ask keys wrong: %s" % (tag, sorted(a)))
        chk(len(a["options"]) == 4, "%s needs exactly 4 options (has %d)" % (tag, len(a["options"])))
        chk(isinstance(a["answer"], int) and not isinstance(a["answer"], bool) and 0 <= a["answer"] <= 3,
            "%s answer not int 0..3: %r" % (tag, a["answer"]))
        chk(a["trap"] in TRAPS, "%s bad trap %r" % (tag, a["trap"]))
        chk(isinstance(a["q"], str) and "Which approach is most effective?" in a["q"],
            "%s q missing stem question" % tag)
        lengths = [len(o) for o in a["options"]]
        chk(min(lengths) > 20, "%s option too short" % tag)
        chk(len(set(a["options"])) == 4, "%s duplicate options" % tag)
        chk(all(isinstance(o, str) for o in a["options"]), "%s non-string option" % tag)

    per_task[s["task"]] += 1

# task coverage
for t in TASKS:
    chk(per_task[t] >= 3, "task %s has only %d steps (need >=3)" % (t, per_task[t]))

# gates
chk(5 <= gates <= 7, "check/drill count %d outside 5-7" % gates)
chk(3 <= len(diagrams_used) <= 4, "diagram count %d outside 3-4" % len(diagrams_used))

# final step is recap
chk(steps[-1]["kind"] == "recap", "final step kind is %r, must be recap" % steps[-1]["kind"])
chk(5 <= len(steps[-1]["points"]) <= 8, "recap points %d, need 5-8" % len(steps[-1]["points"]))
chk(all(len(s["points"]) <= 5 for s in steps), "a non-recap step exceeds the 5-point generic cap")

# hygiene: no markdown/html/emoji/bullets in any string
BAD = ["**", "<p>", "<div>", "<br", "```", "•", "→", "-\t"]
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF]")
def walk(o, path=""):
    if isinstance(o, str):
        for b in BAD:
            chk(b not in o, "markdown/html token %r in %s" % (b, path))
        chk(not EMOJI.search(o), "emoji in %s" % path)
        chk("\u2014" not in o, "em dash in %s" % path)
    elif isinstance(o, dict):
        for k, v in o.items(): walk(v, path + "/" + str(k))
    elif isinstance(o, list):
        for j, v in enumerate(o): walk(v, path + "/%d" % j)

walk(d)

print("steps: %d" % n)
print("per-task counts: " + ", ".join("%s=%d" % (t, per_task[t]) for t in TASKS))
print("check/drill gates: %d   asks: %d" % (gates, asks))
print("kinds: " + ", ".join("%s=%d" % kv for kv in sorted(kinds.items())) if False else
      "kinds: " + ", ".join("%s=%d" % (k, v) for k, v in sorted(collections.Counter(s["kind"] for s in steps).items())))
print("diagram keys used: " + ", ".join(diagrams_used))
print("answer index spread: " + str(collections.Counter(a["answer"] for a in (s["ask"] for s in steps) if a)))
print("trap spread: " + str(dict(collections.Counter(a["trap"] for a in (s["ask"] for s in steps) if a))))
print("final step kind: %s (points=%d)" % (steps[-1]["kind"], len(steps[-1]["points"])))
print()
if fails:
    print("FAILED %d check(s):" % len(fails))
    for f in fails: print("  - " + f)
else:
    print("ALL CHECKS PASSED")