# CCAF 2026 — Kanban Board

## Current State — All 5 Domains Complete

### ✅ Done
- [x] Clone ccaf-repo from WSL2 biglinux-2
- [x] Push all 5 domains to GitHub (moltbagus/ccaf2026)
- [x] Deploy to Vercel (class/site/ static hosting)
- [x] Security audit (no secrets)
- [x] GitNexus analysis
- [x] Create PRD.md, spec.md, kanban.md, learnings.md, TODO.md
- [x] .gitignore, vercel.json, index.html, package.json setup

### 📋 Domain Status
- [x] **D1** Agentic Architecture (8 steps, YouTube ldqOnljDINc integrated)
- [x] **D2** Tool Design & MCP (22 steps)
- [x] **D3** Claude Code Config
- [x] **D4** Prompt & Structured Output
- [x] **D5** Context & Reliability

### 🎨 Site experience
- [x] Diagrams on all 108 tutor steps (14-archetype engine + 92 authored specs, 10 legacy library diagrams kept)
- [x] Theme toggle: Auto → Daylight → Night, top right of every page (from build_ccaf_site.mjs shared shell)

### 🐛 Queued (found by visual QA of the night theme)
- [x] Night theme chips/badges: fixed 2026-10-04 — dark `--line` was #2e2c33 (1.32:1 border contrast, i.e. invisible). Raised to #4a4750 (2.0:1) and gave chips/kbd a card fill. Measured in-browser, both themes.
- [x] Night theme keyboard hints: fixed 2026-10-04 — same root cause (`--line`). The hint TEXT was always 6.5:1; it was the key outlines at 1.32:1. Now 2.0:1 plus a fill.
- [~] Lesson pages: "sticky answer bar clips the last line" — NOT REPRODUCED 2026-10-04. Measured all 32 steps of d2 at 1280x800 plus 390x700 and 320x568 (footer grows to 85px there): clearance is a consistent ~35-49px, no negative gap. Only fixed elements are the sticky header and `.foot`; there is no separate answer bar. Leaving open pending a screenshot of the actual case.

### 🎓 CCAO-F Associate lane (second lane, opened 2 Oct)
- [x] Official exam guide + Certification Exam Policy PDFs filed under class/external/, plus the ccao-f.html overview page (facts, eligibility, retakes, full blueprint)
- [x] Seven domain lessons o1-o7 authored from the public blueprint (72 steps, teach/check gates + recap), all validated
- [x] Second-lane nav, syllabus section, progress tracker; the build now emits 36 pages / 12 lesson pages
- [x] Diagram specs for o1-o7 wired into the engine (72 diagrams, all 72 associate steps covered)
- [ ] Push the lane to origin main + Vercel and walk it live
- [ ] Associate drill banks + a 60-question timed mock, matching the CCAR-F lane

### ✅ Shipped 2026-10-03: CCDV-F + CCAR-P lanes
- [x] **CCDV-F Developer lane** — 8 lessons / 86 steps / 86 diagrams, built from the official exam guide (dev1-dev8). Live on the site.
- [x] **CCAR-P Architect-Professional lane** — 7 lessons / 79 steps / 79 diagrams, built from the official exam guide (pro1-pro7). Live on the site.
- [x] Official CCDV-F and CCAR-P exam guides filed under `class/external/` and in the Obsidian vault.
- [x] Braindump survey for both exams (neon-dumps/pass4success/dumpsbase/examtopics etc.) — reported, not ingested.

### 🟡 In progress 2026-10-04: drills + mocks for the three newer lanes
- [x] 19 of 22 domain drill banks authored and parent-verified (380 questions).
- [ ] Re-author the three D1 banks (`o1`, `dev1`, `pro1`) — destroyed by an accidental fixture cleanup in the parent session, not by their authors.
- [x] CCAO-F timed mock (60 Q, weight-matched) live and walked in the browser.
- [ ] CCDV-F timed mock (53 Q) and CCAR-P timed mock (63 Q) still being authored.
- [ ] After the mocks land: rename to `mocks/mock-<lane>-1.json`, rebuild, walk all three live, push.

### ⏸ Deferred
- [ ] Refresh the Obsidian `Learning/CCAF/Class/` master-note mirrors — they were mirrored 2026-09-19 and predate the video-series merges (D1 17->27 steps etc.)

### 🎬 Queued: video material for the two new lanes
- [ ] Fetch the CCDV-F "Claude Certified Developer" (Ep 01-12) and CCAR-P "Claude Certified Architect Professional" (Ep 01-08) transcripts — **YouTube rate-limited the box (HTTP 429 on both the transcript API and yt-dlp) after the 21-episode CCAR-F batch**. Retry later, then merge as a second pass over the two new lanes.
- [ ] Save the same transcripts into the Obsidian vault under `Learning/CCAF/CCDV-F/` and `Learning/CCAF/CCAR-P/`.

### 🔜 Next Steps
- [ ] Custom domain for Vercel (ccaf2026.com)
- [ ] CI/CD pipeline setup
- [ ] Progress tracking improvements
- [ ] Mock exam integration
- [ ] Add topic to GitHub repo

### 📝 Sprint Workflow
1. `git sync to origin/main`
2. `gitnexus analyze`
3. Update docs (PRD, spec, kanban, learnings, TODO)
4. `git sync new code to origin/main`
