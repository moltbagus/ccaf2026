# CCAF 2026 — Product Requirements Document

## Overview
CCAF (Claude Certified Architect Foundations) preparation class. All 5 domains with interactive tutor lessons.

## Exam Facts
| Parameter | Value |
|---|---|
| Code | CCA-F / CCAR-F |
| Questions | 60 multiple choice, 4 options, scenario-based |
| Duration | 120 minutes |
| Scoring | Scaled 100–1000, pass = 720 |
| Guessing penalty | None |
| Delivery | Online proctored or test centre |

## Domains
| # | Domain | Weight | Status |
|---|---|---|---|
| 1 | Agentic Architecture | 27% | Complete — 8 steps, YouTube integrated |
| 2 | Tool Design & MCP | 18% | Complete — 22 steps |
| 3 | Claude Code Config | 20% | Complete |
| 4 | Prompt & Structured Output | 20% | Complete |
| 5 | Context & Reliability | 15% | Complete |

## Repo Contents
- `class/lessons/d1.json`–`d5.json` — Lesson data (all 5 domains)
- `class/banks/` — Question banks (d1–d5)
- `class/domains/` — Domain reference notes
- `class/site/` — Full web interface (tutor.js, tutor.css, index.html, lesson-d1.html through lesson-d5.html)
- `video_transcript_ldqOnljDINc.json` — YouTube transcript (D1)
- `build_lesson_d1.py` — Lesson data builder

## Deployment
- **GitHub**: `https://github.com/moltbagus/ccaf2026` (public, `main`)
- **Vercel**: `https://ccaf2026.vercel.app` — serves `class/site/` as static site
- **Source**: WSL2 at `biglinux-2` (`/home/colb/ccaf-repo`)

## Sprint Workflow
1. `git sync to origin/main`
2. `gitnexus analyze`
3. Update docs (PRD.md, spec.md, kanban.md, learnings.md, TODO.md)
4. `git sync new code to origin/main`
