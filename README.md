# Eswaran S — Cybersecurity Portfolio

A static, data-driven cybersecurity portfolio presented as an interactive *security engineer workspace*. Built with **vanilla HTML, CSS, and JavaScript** — no framework, no build step, no backend.

Designed for **AWS S3 Static Website Hosting**.

---

## Highlights

- **Data-driven**: every repeatable section is generated from `data.json`. Add a record → UI renders it. Empty arrays → section hides itself.
- **Atmospheric dark workspace**: layered ambient background, sparse particle network on `<canvas>`, pointer-reactive glow, monospace technical metadata.
- **Reusable renderers** in `js/components.js` (DOM-based, never `innerHTML` for untrusted string values).
- **Project case files** with detailed modal: problem / solution / features / highlights / tech / security concepts / media.
- **Media viewer** for images, PDFs (iframe), and Markdown/text (fetched + rendered safely via `textContent`).
- **Command palette** (`Ctrl/Cmd + K` or `/`) with section / project / skill / certificate / document / contact search.
- **Deep linking** via URL hashes (`#projects`, `#project/evidex`, `#experience`).
- **Responsive**: desktop sidebar collapses into a `MENU` drawer on tablet / mobile.
- **Accessible**: semantic HTML, keyboard navigation, focus-visible rings, ARIA on modals, `prefers-reduced-motion` support, `prefers-contrast` support.
- **Reduced-motion safe** — particle canvas and pleasing transitions are disabled when the user requests it.

---

## Directory structure

```text
.
├── index.html              App shell — knows nothing about portfolio content
├── data.json           Single source of truth for portfolio content
├── README.md
├── css/
│   └── style.css           Design system + components + responsive
├── js/
│   ├── components.js       Reusable DOM renderers (return Element, not strings)
│   └── app.js              Controller: data load, render, animations, palette, modals
└── assets/
    ├── profile/            Profile photo (e.g. profile.jpg)
    ├── projects/           Per-project media (screenshots, reports) in subfolders
    ├── certificates/       Certificate images and PDFs
    ├── documents/          Standalone documents (e.g. project reports)
    └── resume/             Resume variants and CV
```

Empty asset folders are kept with `.gitkeep` so the structure survives version control.

---

## How the architecture works

```
data.json
    │
    ▼ fetch()
JavaScript loader (app.js)
    │
    ▼
Reusable renderers (components.js)
    │
    ▼
DOM
    │
    ▼
Portfolio UI (atmospheric + interactive, static-hostable)
```

`index.html` only provides the **shell**: anchored containers with IDs like `#projectsGrid` and `#certsList`. The controller (`app.js`) reads `data.json`, computes which sections should exist, and asks each renderer in `components.js` to build the appropriate DOM nodes.

Adding new content never requires editing `index.html`.

---

## Run locally

`fetch("data.json")` will **fail** if you open `index.html` directly over `file://` due to browser security. Always serve over HTTP.

```bash
# Option A — Python
python -m http.server 8000

# Option B — Node.js
npx serve .

# Then open
http://localhost:8000
```

---

## Deploy to AWS S3

```bash
# 1. Sync everything into your bucket
aws s3 sync . s3://YOUR-BUCKET-NAME --delete --exclude ".git/*"

# 2. Enable Static Website Hosting on the bucket
#    Index document: index.html
#    Error document: index.html   (optional — keeps SPA-like behaviour for hashes)

# 3. (Recommended) CloudFront in front for HTTPS + caching
```

A few deployment checks:

- All paths in `data.json` are **relative** — works from any bucket subpath.
- No backend, no SPA routes, no server-side fallback required.
- No credentials, tokens, or secrets anywhere in this repo.

---

## `data.json` overview

### Top-level schema

```text
{
  "schemaVersion": "1.0.0",
  "profile":        { name, title, tagline, location, status, profileImage },
  "contact":        { email, phone, location, resume },
  "socials":        [ { id, label, handle, url, icon } ],
  "about":          { summary, objective, focus: [] },
  "currentFocus":   [],

  "experience":     [],   // timeline entries
  "projects":       [],   // case files
  "skills":         [],   // { category, items[] }
  "certifications": [],   // { name, issuer, date, credentialId, credentialUrl, image, document }
  "achievements":   [],   // CTF / honours
  "education":      [],   // degrees
  "labs":           [],   // personal environments
  "documents":      [],   // resumes / CVs / PDFs / docs
  "interests":      []
}
```

If any top-level array is `[]` or missing, the matching **section + nav entry** is hidden automatically.

### Media object (reused by projects, certificates, achievements, education)

```json
{
  "media": [
    {
      "type": "image",
      "label": "Architecture",
      "path": "assets/projects/example/architecture.png"
    },
    {
      "type": "pdf",
      "label": "Project Report",
      "path": "assets/projects/example/report.pdf"
    },
    {
      "type": "markdown",
      "label": "Notes",
      "path": "assets/projects/example/notes.md"
    }
  ]
}
```

Supported types: `image`, `pdf`, `markdown`, `text`, `file`. If `type` is omitted, the renderer infers from the file extension.

---

## How to add / edit content

### Update your name / title / tagline / status

Edit `data.json` → `profile`:

```json
"profile": {
  "name": "Eswaran S",
  "title": "Security Operations Analyst",
  "tagline": "Building security tooling, investigating systems, and automating analysis."
}
```

Leave `status` as `"open"` for the green pulse, or use `"idle"` / `"busy"`.

### Change contact info

`contact` and `socials`. Both feed the top bar, the sidebar footer, and the Contact panel.

```json
"socials": [
  { "id": "github", "label": "GitHub", "handle": "EswaranS-06", "url": "https://github.com/EswaranS-06", "icon": "github" }
]
```

Built-in icons: `github`, `linkedin`, `tryhackme`. For other services, use `"icon": "external"` and the renderer shows a generic external-link glyph.

### Add a project

1. Drop the project's media files under `assets/projects/<id>/`.
2. Append a new object to `projects`:

```json
{
  "id": "ai-ueba",
  "name": "ML UEBA",
  "subtitle": "User & Entity Behaviour Analytics",
  "status": "Active",
  "featured": false,
  "domain": "Detection Engineering",
  "summary": "Short overview shown on the case card.",
  "description": "Longer body shown in the case file modal.",
  "problem": "...",
  "solution": "...",
  "role": "Sole builder",
  "technologies": ["Python", "scikit-learn", "Splunk"],
  "securityAreas": ["UEBA", "Anomaly Detection"],
  "features": ["Feature A", "Feature B"],
  "highlights": ["Result 1", "Result 2"],
  "github": "https://github.com/...",
  "demo": "",
  "media": [
    { "type": "image", "label": "Screenshot", "path": "assets/projects/ai-ueba/screenshot.png" }
  ]
}
```

The new project automatically gets:
- a card on the Projects view
- a domain filter chip
- an entry in the command palette (and its technologies become searchable)
- keyboard-accessible Enter to open the modal
- deep-linkable via `#project/ai-ueba`

### Add a certification

```json
{
  "id": "secplus",
  "name": "Security+ ce",
  "issuer": "CompTIA",
  "date": "2026-08",
  "credentialId": "C00123",
  "credentialUrl": "https://verify.compay.../C00123",
  "image": "",
  "document": "assets/certificates/comptia-sec.pdf"
}
```

The renderer shows a `View` button if `image` is set, a `Document` button if `document` is set, and a `Credential` link if `credentialUrl` is set. Empty fields hide their respective buttons.

### Add experience

```json
{
  "id": "second-role",
  "company": "Example Inc",
  "role": "Cyber Security Analyst L1",
  "type": "Full-time",
  "start": "2024-01",
  "end": "",
  "location": "Chennai, India",
  "summary": "Short framing.",
  "responsibilities": ["...", "..."],
  "technologies": ["Splunk", "Wazuh"]
}
```

Use `end: ""` for *Present*.

### Add skills

Each group has a `category` and a flat `items[]`. Items can be strings or objects with `name` + optional `level`:

```json
{
  "skills": [
    {
      "category": "SIEM & Log Analysis",
      "items": ["Wazuh", "Splunk", { "name": "KQL", "level": "Basics" }]
    }
  ]
}
```

(No progress bars — we deliberately don't render meaningless skill percentages.)

### Add an achievement (CTF / honours)

```json
{
  "id": "my-ctf",
  "title": "Some CTF — Placing",
  "organization": "AcmeSec",
  "date": "2026-05",
  "result": "2nd place",
  "description": "What you did and which skills you demonstrated.",
  "tags": ["Reverse Engineering", "OSINT"],
  "media": []
}
```

### Add education

```json
{
  "id": "ms-infosec",
  "degree": "M.Sc Information Security",
  "institution": "Example University",
  "location": "City, Country",
  "start": "2026",
  "end": "2028",
  "score": "In Progress",
  "specialisation": "Defensive Security",
  "notes": ""
}
```

### Add a document

```json
{
  "id": "report-2026",
  "label": "Threat Hunt Report",
  "description": "Quarterly threat hunt write-up.",
  "type": "pdf",
  "path": "assets/documents/threat-hunt-q1-2026.pdf"
}
```

Each document becomes a clickable row. `pdf` and `docx`/`doc` files open in a new tab; the viewer does not attempt to convert them server-side.

### Add a lab

```json
{
  "id": "aws-soc-stack",
  "name": "AWS SOC Stack",
  "type": "Cloud Detection Lab",
  "status": "Active",
  "description": "CloudTrail + GuardDuty + Athena automation.",
  "technologies": ["AWS", "GuardDuty", "Terraform"],
  "link": "#project/aws-soc-stack"
}
```

`link` can deep-link to a project via `#project/<id>`.

---

## Editing rules (so things keep working)

- **IDs are immutable and unique** within their collection. They drive deep links (`#project/<id>`) and command palette navigation.
- **Don't repeat yourself**: shared values (location, email) live in `profile` / `contact`; sections reference them when relevant.
- **Media paths are relative from the repository root**, e.g. `assets/projects/foo/bar.png`, not `./projects/foo/bar.png`.
- **Avoid trailing commas** in JSON arrays / objects.
- **For private links you don't want shown yet**, leave the field as `""` instead of inventing one. Empty buttons / chips simply don't render.

---

## Keyboard & accessibility

| Action | Shortcut |
|---|---|
| Open command palette | `Ctrl/Cmd + K` or `/` |
| Dismiss any overlay | `Esc` |
| Navigate palette results | `↑` / `↓` |
| Open focused project card | `Enter` or `Space` |
| Keyboard navigation | Full `Tab` cycle, visible focus rings |
| Skip to content | `Skip` link at top of workspace |
| Status / availability | Green dot pulses when `status === "open"` |

Reduced-motion users automatically get:
- no boot animation sequence
- no canvas particle network
- no scroll-fade transforms
- instant view transitions

---

## Customizing the look

Colours, fonts, motion timings live in CSS variables at the top of `css/style.css`:

```css
:root {
  --bg-primary:   #05070d;
  --accent:       #4ea2ff;
  --accent-ice:   #8fd6ff;
  --accent-violet:#8a7bff;
  --font-sans:    "Sora", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", monospace;
  --nav-width:    260px;
}
```

Swap fonts by editing the `<link>` tags in `index.html` (Google Fonts) and the corresponding `--font-sans` / `--font-mono` variables.

---

## Common mistakes

- **`file://` blank page / console `Failed to fetch`** — open over HTTP. See "Run locally".
- **New project not showing** — check JSON syntax (no trailing commas, balanced brackets), then verify the project `id` is unique.
- **Certificate buttons missing** — they only appear when the matching field (`image` / `document` / `credentialUrl`) is non-empty.
- **Image not loading** — paths are case-sensitive on S3. Match the exact filename.
- **Dark scrollbars look wrong on mobile** — the workspace swaps to native vertical scroll under 768px.
- **Animations feel heavy on a slow laptop** — set `prefers-reduced-motion: reduce` in your OS; the canvas pauses.

---

## Privacy & security

- No analytics, no external API calls, no cookies.
- All content is local. The only external requests are Google Fonts (you can self-host if needed).
- Links to GitHub / LinkedIn / TryHackMe include `rel="noopener noreferrer"`.
- The renderer prefers `textContent` and never injects untrusted JSON values via `innerHTML`.
- **Do not** put API keys, AWS credentials, or private contact info in `data.json` — everything here is publicly visible.

---

## Tech summary

| Layer | Files | Responsibility |
|---|---|---|
| Content | `data.json` | Single source of truth |
| Shell | `index.html` | Anchored empty containers only |
| Rendering | `js/components.js` | Reusable DOM renderers |
| Controller | `js/app.js` | Data load + orchestration + interactions + animations |
| Visual | `css/style.css` | Design system + components + responsive |
| Media | `assets/` | Project media, certificates, documents, resumes |

---

## License

Personal portfolio content (resume, certifications, projects) © Eswaran S, all rights reserved.

The underlying static-workspace code architecture (HTML/CSS/JS) is yours to reuse.
