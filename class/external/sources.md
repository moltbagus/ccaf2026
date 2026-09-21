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
