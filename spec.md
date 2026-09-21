# CCAF 2026 — Technical Specification

## Architecture
Static site served via Vercel. All HTML/CSS/JS in `class/site/`.

### Tech Stack
- **Frontend**: Vanilla JS (`class/site/tutor.js`), CSS (`class/site/tutor.css`)
- **Data**: JSON lesson files (`class/lessons/d1.json`–`d5.json`)
- **Build**: `build_lesson_d1.py` — Python lesson builder
- **Hosting**: Vercel static deployment
- **Source**: `biglinux-2` (`/home/colb/ccaf-repo`) → GitHub (`moltbagus/ccaf2026`)

### Routes (vercel.json)
- `/lessons/(.*)` → `class/lessons/$1`
- `/tutor.js` → `class/site/tutor.js`
- `/tutor.css` → `class/site/tutor.css`
- `/index.html` → `class/site/index.html`
- `/(.*)` → `class/site/$1` (fallback)

## Security
- No secrets or credentials in the repository
- `.gitignore` excludes node_modules/, .env, .ssh/
- All content is educational
