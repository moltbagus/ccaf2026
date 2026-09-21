# CCAF 2026 — Learnings

## Repo Origin
- WSL2 server `biglinux-2` (100.93.37.80) at `/home/colb/ccaf-repo`
- SSH via `ssh biglinux-2` with `~/.ssh/id_ed25519` key
- GitHub repo: `moltbagus/ccaf2026` (public)
- Vercel: `ccaf2026.vercel.app`

## Key Findings
- WSL2 repo has ALL 5 domains (d1.json through d5.json)
- `class/site/` contains the full web interface (tutor.js, tutor.css, all lesson HTML)
- `video_transcript_ldqOnljDINc.json` is YouTube transcript for D1 only
- d2.json has NO YouTube material (video covers Domain 1 only)
- Repo structure: source of truth is WSL2, Mac is clone, GitHub is sync target

## Technical Lessons
- `tutor.js` is browser-side IIFE — NOT a serverless function
- `vercel.json` must route to `class/site/` and `class/lessons/`
- `class/site/index.html` is the full syllabus with navigation
- Root `index.html` redirects to `class/site/index.html`

## Git Workflow
- Branch naming: `main`
- Push from WSL2 with `git push --force origin main` to override Mac history
- `gh repo create --public --source=. --remote=origin --push` for new repos
