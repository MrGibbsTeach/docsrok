<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-handover -->
# Project handover (read this too)

This repo is **Docs Rok**, AI-generated business-ops documents for Australian trade businesses. Before working, read `docs/HANDOVER.md` (technical state, lessons, engineering task cards T-XX).

Business context, live numbers and decisions are private. They live in the owner's OneDrive control-room folder (`AGENTS.md`, `HANDOVER.md`, `TASKS.md`, `MEMORY.md`, `ROADMAP.md`, `TEAM.md`) and in the Claude Project "Docs Rok". If you can reach that folder, read its `AGENTS.md` first: it is the master rule file. If you cannot (for example Codex cloud), work only from `docs/HANDOVER.md` and say so in your session-log line.

Team: Claude Code and Codex share code work. One task per branch (`t-XX-short-name`), PR into `master`, the other agent reviews before merge. Never edit files another agent holds a lock on (locks are listed in the private HANDOVER and mirrored in `docs/HANDOVER.md` "Locks").

Rules: no WHS/SWMS/safety-compliance documents (closed on purpose). This repo is PUBLIC: no money figures, customer data or secrets, ever. Name env vars, never values. A green push is not a deploy, check Vercel. At the end of a session, update `docs/HANDOVER.md` (session log line: `- <date> <member> T-XX: did <what>. Unfinished: <what>. Next: <one line>.`) and the private copies if you can reach them.
<!-- END:project-handover -->
