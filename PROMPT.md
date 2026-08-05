# Build a Dynamic Data-Driven Cybersecurity Portfolio

I want you to build a complete, production-ready personal portfolio website for me.

This is NOT supposed to be a traditional resume converted into a website. I want a distinctive, modern, interactive cybersecurity/technology portfolio that presents my skills, projects, experience, certifications, achievements, education, and technical work.

The website will be hosted using **AWS S3 Static Website Hosting**, so the entire frontend MUST work as a purely static website.

---

# 1. Technology Constraints

Use ONLY:

* HTML5
* CSS3
* Vanilla JavaScript
* Bootstrap only if genuinely useful
* JSON for portfolio content

DO NOT use:

* React
* Vue
* Angular
* Next.js
* Node.js backend
* Express
* PHP
* Python backend
* databases
* build tools
* npm dependencies that require compilation
* server-side rendering

The final site must work by uploading the files directly to an AWS S3 bucket.

The preferred structure is:

```text
portfolio/
│
├── index.html
├── data.json
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── components.js
│
└── assets/
    ├── profile/
    ├── projects/
    ├── certificates/
    ├── documents/
    ├── resume/
    └── icons/
```

You may improve this structure if necessary, but keep it simple and static-hosting compatible.

---

# 2. MOST IMPORTANT REQUIREMENT — DATA-DRIVEN ARCHITECTURE

The portfolio MUST NOT contain my personal information hardcoded throughout `index.html`.

Instead:

```text
data.json
        ↓
fetch()
        ↓
JavaScript
        ↓
Reusable rendering functions
        ↓
DOM
        ↓
Portfolio UI
```

`data.json` must act as the central source of truth for the portfolio.

Almost everything that could reasonably change must come from `data.json`, including:

* Name
* Professional title
* Tagline
* About
* Profile image
* Contact information
* Social links
* GitHub
* LinkedIn
* Location
* Resume
* Education
* Experience
* Skills
* Tools
* Technologies
* Projects
* Certifications
* Achievements
* CTF participation
* Training
* Cybersecurity labs
* Currently learning
* Areas of interest
* Career focus
* Documents
* Project screenshots
* Project reports
* Certificate images
* External URLs

I should normally be able to update the portfolio WITHOUT editing `index.html`.

---

# 3. Dynamic Rendering

Every repeatable section must be generated dynamically from arrays inside `data.json`.

For example:

```json
{
  "projects": [
    {
      "name": "Project One",
      "description": "Description",
      "technologies": ["Python", "Splunk"],
      "github": "...",
      "media": "assets/projects/project-one.png"
    },
    {
      "name": "Project Two",
      "description": "Description",
      "technologies": ["AWS", "Terraform"],
      "github": "...",
      "media": "assets/projects/project-two.png"
    }
  ]
}
```

JavaScript must automatically create two project entries.

If I later add:

```json
{
  "name": "Project Three"
}
```

the website must automatically render the third project without requiring HTML modifications.

Apply this architecture everywhere.

For example:

```javascript
renderProjects(data.projects);
renderSkills(data.skills);
renderExperience(data.experience);
renderEducation(data.education);
renderCertifications(data.certifications);
renderAchievements(data.achievements);
```

Do NOT manually create:

```html
<div id="project1"></div>
<div id="project2"></div>
<div id="project3"></div>
```

Instead create reusable templates/renderers.

---

# 4. Optional Sections

The system must tolerate missing information.

For example, if:

```json
"certifications": []
```

then the Certifications section should automatically disappear.

If an individual project doesn't have a PDF, GitHub URL, screenshot, or demo, the corresponding button should simply not render.

Do not show:

* empty cards
* empty headings
* broken buttons
* "undefined"
* missing-image placeholders unless intentionally designed

Use defensive JavaScript.

---

# 5. Flexible JSON Schema

Design a clean and understandable `data.json` schema.

Avoid unnecessarily complicated nested structures.

It should be easy for me to manually edit.

Use objects for individual entities and arrays for collections.

For example:

```json
{
  "profile": {},
  "socials": [],
  "education": [],
  "experience": [],
  "skills": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "labs": [],
  "learning": []
}
```

Document the schema.

Add a:

```text
README.md
```

explaining how I can add/remove/edit portfolio content through `data.json`.

---

# 6. Asset Management

I will have an `assets/` directory containing things such as:

```text
assets/
├── profile/
│   └── profile.jpg
│
├── certificates/
│   ├── certificate-01.jpg
│   └── certificate-02.pdf
│
├── projects/
│   ├── evidex/
│   │   ├── screenshot.png
│   │   └── report.pdf
│   └── aisa/
│       └── architecture.png
│
├── documents/
│   └── project-report.pdf
│
└── resume/
    └── resume.pdf
```

Asset paths must come from `data.json`.

Example:

```json
{
  "certificate": {
    "title": "Example Certificate",
    "media": {
      "type": "image",
      "path": "assets/certificates/example.png"
    }
  }
}
```

Do not hardcode asset paths into HTML.

---

# 7. Media Handling

Create reusable media handling.

The portfolio may reference:

* PNG
* JPG
* JPEG
* WEBP
* SVG
* GIF
* PDF
* Markdown
* TXT
* DOC/DOCX
* downloadable files

Handle them appropriately.

Images should be viewable inside the portfolio.

PDF files should support opening/viewing.

Markdown files should ideally be fetched and displayed in a readable modal/panel when possible.

DOC/DOCX files should primarily be treated as downloadable/openable documents because this is a static website.

Do not attempt server-side document conversion.

Create a generic media object such as:

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
    }
  ]
}
```

The renderer should determine the appropriate UI based on `type`.

---

# 8. Portfolio Identity

This is a cybersecurity portfolio.

The visual identity should communicate:

* Security engineering
* SOC operations
* Threat detection
* Cloud security
* Security automation
* Investigation
* Infrastructure
* Engineering
* Technical experimentation

But DO NOT make it a stereotypical "hacker website."

Avoid excessive:

* Matrix rain
* neon green
* skulls
* random binary
* fake terminal spam
* glowing hacker imagery
* cliché cybersecurity graphics

I want something sophisticated enough to show recruiters and cybersecurity professionals.

---

# 9. Make the Portfolio Visually Different

Do NOT create the typical portfolio structure:

```text
Huge Hero
About Me
Skills Cards
Projects Cards
Experience
Contact
Footer
```

Avoid making every section a collection of identical rounded cards.

Instead, design it more like an interactive **security engineer workspace / technical dossier / operations console**.

Possible inspiration:

* SOC investigation workspace
* engineering dashboard
* developer workspace
* security intelligence interface
* technical case-file system
* knowledge graph
* command palette
* IDE/workbench
* investigation timeline

The site should still be understandable to recruiters.

Creativity must not reduce usability.

---

# 10. Suggested UX Concept

Consider presenting the portfolio as a personal security workspace.

For example, the navigation could expose:

```text
Overview
Experience
Projects
Security Labs
Skills
Certifications
Achievements
Education
Documents
Contact
```

The user feels like they are exploring my technical workspace rather than scrolling through a resume.

A desktop layout could potentially use:

```text
┌─────────────────────────────────────────────────────────────┐
│ Portfolio / Security Workspace                     Status   │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Navigation   │               Main Workspace                 │
│              │                                              │
│ Overview     │                                              │
│ Projects     │                                              │
│ Experience   │                                              │
│ Labs         │                                              │
│ Skills       │                                              │
│ Certs        │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│ Status / Current Focus / Contact                            │
└─────────────────────────────────────────────────────────────┘
```

This is only conceptual guidance. Improve it if you have a stronger design.

---

# 11. Projects Must Be Major Portfolio Objects

Projects are one of the most important parts of the site.

Each project should support fields such as:

```json
{
  "id": "evidex",
  "name": "EVIDEX",
  "subtitle": "Web VAPT Reporting Platform",
  "status": "Active",
  "featured": true,
  "summary": "...",
  "description": "...",
  "problem": "...",
  "solution": "...",
  "role": "...",
  "technologies": [],
  "securityAreas": [],
  "features": [],
  "highlights": [],
  "github": "...",
  "demo": "...",
  "media": []
}
```

Do not force every property to exist.

Projects should support a compact overview and a detailed view.

Clicking a project could open:

* detailed panel
* modal
* expandable workspace
* case-study view

The detailed project view can show:

```text
Overview
Problem
Solution
Architecture
Features
Security Concepts
Technology
Screenshots
Documents
GitHub
```

---

# 12. Populate It Using My Information

Use the information you already have about me to populate the initial `data.json`.

My portfolio should emphasize my cybersecurity background and technical work.

Relevant areas include:

* Cybersecurity
* SOC / Security Operations
* Threat Detection
* Incident Investigation
* Vulnerability Assessment
* DFIR fundamentals
* SIEM
* Splunk
* Wazuh
* Networking
* Linux
* Windows
* AWS
* Terraform
* Python
* Security automation
* Web application security
* AI-assisted security tooling

Include my relevant education, experience, projects, skills, achievements, and cybersecurity work based on the information available to you.

Important projects/work that may be represented include:

* EVIDEX — Web VAPT/report automation platform
* AISA — AI SOC Analyst
* ML-based log anomaly detection / UEBA
* AWS SOC environment
* Splunk lab
* Wazuh/Sysmon lab
* Recon/security automation work
* MARA research assistant if relevant
* VULNIX/NVD-related work if relevant

Do NOT invent missing facts.

If a fact is uncertain, either omit it or use an obvious placeholder in `data.json` that I can update.

---

# 13. Skills Presentation

Do not use meaningless progress bars such as:

```text
Python █████████ 95%
Splunk ████████ 90%
```

unless actual proficiency percentages exist.

Instead categorize skills.

Possible categories:

```text
Security Operations
SIEM & Monitoring
Offensive Security
Cloud & Infrastructure
Programming & Automation
Operating Systems
Networking
AI / ML
Tools
```

The categories themselves should also come from JSON.

Example:

```json
{
  "skills": [
    {
      "category": "SIEM & Monitoring",
      "items": [
        "Splunk",
        "Wazuh",
        "Sysmon",
        "Log Analysis"
      ]
    }
  ]
}
```

---

# 14. Experience

Experience should support:

```json
{
  "company": "...",
  "role": "...",
  "type": "...",
  "start": "...",
  "end": "...",
  "location": "...",
  "summary": "...",
  "responsibilities": [],
  "technologies": []
}
```

Display experience using something more interesting than generic cards.

A timeline or investigation-log style presentation would work well.

---

# 15. Certifications

Certifications must be generated from JSON.

Support:

```json
{
  "name": "...",
  "issuer": "...",
  "date": "...",
  "credentialId": "...",
  "credentialUrl": "...",
  "image": "...",
  "document": "..."
}
```

Clicking a certificate should allow viewing the certificate image/PDF where available.

---

# 16. Achievements

Create a dedicated achievements representation.

For example, my cybersecurity CTF achievement can be represented as an achievement rather than being buried inside About.

Fields could include:

```json
{
  "title": "...",
  "organization": "...",
  "date": "...",
  "result": "...",
  "description": "...",
  "media": []
}
```

---

# 17. Current Focus

Include a small dynamically populated section showing what I am currently working on/learning.

Example:

```json
{
  "currentFocus": [
    "AWS Security",
    "SOC Automation",
    "AI-assisted security analysis"
  ]
}
```

This should feel like a live status panel rather than a resume section.

---

# 18. Navigation

Navigation must be generated dynamically where practical.

Do not assume every section exists.

If there are no certifications, don't show:

```text
Certifications
```

in navigation.

If Labs exists, automatically show it.

Navigation and content should remain synchronized.

---

# 19. Search / Command Palette

If feasible without introducing unnecessary complexity, implement a keyboard-accessible command/search palette.

Example:

```text
Ctrl / Cmd + K
```

It could search/navigate:

```text
Projects
Skills
Certifications
Experience
Education
Documents
```

Example queries:

```text
splunk
aws
evidex
python
wazuh
```

Search results should navigate to the relevant portfolio item.

Implement this entirely client-side.

---

# 20. UI Interactions

Use subtle, professional interactions.

Possible interactions:

* expandable project details
* smooth navigation
* command palette
* keyboard navigation
* modal media viewer
* image lightbox
* PDF viewer/open action
* Markdown viewer
* project filtering
* skill filtering
* active navigation state
* subtle hover states
* responsive sidebar
* project search

Avoid unnecessary animation.

Animations should be lightweight and respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 21. Responsive Design

The site must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop can use the full workspace/dashboard layout.

Mobile should transform into an appropriate mobile navigation system rather than simply shrinking the desktop sidebar.

Test at least around:

```text
375px
768px
1024px
1440px
```

Do not allow horizontal overflow.

---

# 22. Accessibility

Use proper accessibility practices:

* semantic HTML
* keyboard-accessible navigation
* visible focus states
* sufficient contrast
* ARIA only where appropriate
* accessible modals
* meaningful alt text
* proper heading hierarchy
* reduced-motion support

---

# 23. Performance

Keep the site lightweight.

Avoid giant libraries for trivial functionality.

Use:

```html
<script src="js/app.js" defer></script>
```

Optimize images where possible.

Lazy-load portfolio images:

```html
loading="lazy"
```

Avoid unnecessary network requests.

---

# 24. Security

Because this is a static site, still follow safe frontend practices.

When rendering JSON content:

* prefer `textContent`
* avoid unsafe `innerHTML` for untrusted values
* sanitize Markdown rendering if HTML is supported
* use `rel="noopener noreferrer"` for appropriate external links
* validate media paths
* handle failed fetches gracefully

Do not expose API keys, AWS credentials, tokens, secrets, or private information anywhere in the frontend or `data.json`.

---

# 25. AWS S3 Compatibility

This is going to AWS S3 Static Website Hosting.

Therefore make sure:

* all asset paths work with static hosting
* there is no backend dependency
* there is no filesystem API dependency
* there is no runtime Node dependency
* there are no SPA routes requiring server-side fallback
* URLs work from static paths
* `fetch("data.json")` works when served over HTTP/HTTPS
* files are referenced using portable relative paths

Also mention that `fetch()` may fail when opening `index.html` directly using `file://`.

Provide simple local testing instructions such as:

```bash
python -m http.server 8000
```

and then:

```text
http://localhost:8000
```

---

# 26. Error Handling

If `data.json` cannot be loaded, don't leave a blank page.

Show a professional error state such as:

```text
Portfolio data could not be loaded.

Check that data.json exists and the website is being served through HTTP/HTTPS.
```

Log useful debugging information to the browser console.

Individual broken images/documents should not break the rest of the portfolio.

---

# 27. Theme

Create a sophisticated dark-first theme suitable for a security engineer.

Think:

```text
Security Operations Workspace
+
Developer IDE
+
Modern SaaS Dashboard
+
Technical Portfolio
```

Use restrained accent colors and strong typography.

Avoid turning everything into bordered rounded rectangles.

Use hierarchy through:

* typography
* whitespace
* panels
* separators
* subtle borders
* depth
* layout
* information density

The UI should feel polished rather than flashy.

---

# 28. CSS Architecture

Keep CSS maintainable.

Use variables such as:

```css
:root {
    --bg-primary: ...;
    --bg-secondary: ...;
    --surface: ...;
    --border: ...;
    --text-primary: ...;
    --text-secondary: ...;
    --accent: ...;
    --success: ...;
    --warning: ...;
}
```

Avoid scattering raw values everywhere.

Organize CSS logically:

```text
Reset
Variables
Typography
Layout
Navigation
Workspace
Components
Projects
Timeline
Media Viewer
Command Palette
Responsive
Accessibility
```

---

# 29. JavaScript Architecture

Do not put 2,000 lines of spaghetti JavaScript into one function.

Use small reusable functions.

For example:

```javascript
loadPortfolioData()
renderPortfolio()
renderProfile()
renderNavigation()
renderProjects()
renderProject()
renderExperience()
renderSkills()
renderCertifications()
renderAchievements()
renderMedia()
openMediaViewer()
initializeSearch()
initializeNavigation()
```

You can split code between:

```text
app.js
components.js
```

if beneficial.

No unnecessary overengineering.

---

# 30. Reusable DOM Components

Create reusable JavaScript component/rendering functions.

For example:

```javascript
createProjectView(project)
createSkillGroup(group)
createTimelineItem(item)
createCertificateItem(cert)
createMediaButton(media)
createTag(label)
```

Changing the number of JSON records must never require editing HTML.

---

# 31. Deep Linking Without SPA Complexity

Where practical, use URL hashes.

Example:

```text
/#projects
/#experience
/#skills
```

Potentially project IDs:

```text
/#project/evidex
```

But do not build a complicated router.

The website must remain reliable on S3.

---

# 32. SEO / Metadata

Include sensible metadata:

```html
<title>Eswaran S | Cybersecurity Portfolio</title>
<meta name="description" content="...">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Add Open Graph metadata where practical.

Avoid hardcoding content in metadata that is likely to change frequently unless necessary because HTML metadata cannot be reliably populated before crawlers parse the page.

---

# 33. No Fake Information

This is critical.

DO NOT invent:

* certifications
* companies
* employment dates
* technologies I have never used
* project statistics
* GitHub stars
* vulnerabilities discovered
* security incidents
* customer names
* job responsibilities
* credentials
* awards

Use only known information.

Where information is incomplete, use clearly marked values such as:

```json
"github": "ADD_GITHUB_URL"
```

instead of guessing.

---

# 34. Editing Experience

A major goal is that six months from now I should be able to update this site easily.

For example, adding a project should require ONLY:

1. Add project files to:

```text
assets/projects/new-project/
```

2. Add one object to:

```json
"projects": []
```

3. Upload changed files to S3.

The UI should handle everything else.

The same principle should apply to:

* certifications
* experience
* skills
* education
* achievements
* documents
* labs

---

# 35. README

Create a detailed but concise `README.md`.

Explain:

* directory structure
* how the architecture works
* how `data.json` works
* how to add a project
* how to add a certificate
* how to add experience
* how to add media
* how to change profile information
* how to run locally
* how to deploy to S3
* common mistakes

Provide JSON examples.

---

# 36. Code Quality

Before finishing:

* validate HTML structure
* check JSON syntax
* check relative paths
* check responsive layout
* check keyboard navigation
* check missing-property handling
* check empty arrays
* check broken assets
* check console errors
* remove dead code
* remove placeholder Lorem Ipsum
* remove debug logs except useful error reporting
* ensure no secrets exist
* ensure no backend dependency exists

---

# 37. Deliverables

Create the COMPLETE working project.

I expect actual files, not pseudocode.

At minimum:

```text
portfolio/
├── index.html
├── data.json
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── components.js
│
└── assets/
    ├── profile/
    ├── projects/
    ├── certificates/
    ├── documents/
    └── resume/
```

Create placeholder `.gitkeep` files where empty directories need to be preserved.

---

# 38. Implementation Priority

Build this in this order:

```text
1. data.json schema
       ↓
2. HTML application shell
       ↓
3. JSON loader
       ↓
4. Dynamic rendering engine
       ↓
5. Navigation
       ↓
6. Overview
       ↓
7. Projects
       ↓
8. Experience
       ↓
9. Skills
       ↓
10. Certifications / Achievements / Education
       ↓
11. Media system
       ↓
12. Search / command palette
       ↓
13. Responsive behavior
       ↓
14. Accessibility
       ↓
15. Visual polish
       ↓
16. README
       ↓
17. Final testing
```

Architecture and maintainability are more important than adding flashy visual effects.

---

# 39. Core Design Principle

Treat:

```text
data.json = portfolio database/content layer
HTML      = application shell
JavaScript = rendering engine
CSS       = visual system
assets/   = media repository
```

The HTML should know almost nothing about the number of projects, certifications, experiences, skills, or achievements.

JavaScript reads the data and constructs the interface.

The portfolio must adapt to the data — the data must NOT have to adapt to hardcoded HTML.

---

# 40. Final Goal

The final result should make someone think:

> "This feels like exploring a cybersecurity engineer's technical workspace."

rather than:

> "This is another resume template."

It should showcase both my cybersecurity profile and my ability to build structured technical projects.

Keep it professional enough for recruiters but technical enough that security engineers can explore the details.

Most importantly:

**Build the complete working implementation. Do not just explain how I could build it. Create every required file and populate the initial `data.json` using the information you already know about me, without fabricating missing details.**

---

# 41. Resume Is the Primary Source for My Portfolio Data

I have added/provided my **resume with this project/request**.

Use that resume as the **primary authoritative source** for populating the initial `data.json`.

Read the resume carefully and extract all relevant information that belongs in the portfolio, including where available:

* Name
* Professional title
* Career objective / summary
* Contact information
* Location
* Education
* Degree
* University
* CGPA
* Experience
* Internships / training
* Roles
* Employment dates
* Responsibilities
* Skills
* Cybersecurity skills
* Programming languages
* Security tools
* Technologies
* Projects
* Project descriptions
* Project technologies
* Certifications
* Achievements
* CTF participation
* Relevant coursework
* GitHub
* LinkedIn
* Portfolio/contact links

Transform the resume information into the structured `data.json` schema used by the website.

Do NOT simply copy the resume paragraph-for-paragraph.

The resume is the source of truth, while `data.json` should restructure that information into portfolio-friendly content.

For example:

```text
Resume
   ↓
Extract factual information
   ↓
Categorize information
   ↓
Normalize into data.json
   ↓
Dynamic renderer
   ↓
Interactive portfolio
```

You may improve wording slightly for presentation, but **never change the factual meaning**.

Do not invent information that does not exist in the resume.

If some optional information needed by the template is unavailable, omit the property or use an obvious editable placeholder where appropriate.

The portfolio should expand on the resume visually and structurally rather than simply recreating the resume as a webpage.

---

# 42. Visual Direction — Atmospheric · Cool · Technical

The visual identity is extremely important.

I want the portfolio to feel:

**Atmospheric · Cool · Technical · Cinematic · Modern · Intelligent · Minimal · Immersive**

The experience should feel like entering a sophisticated digital environment belonging to a cybersecurity engineer.

NOT:

```text
Generic Bootstrap Portfolio
Generic SaaS Dashboard
Generic Resume Website
Matrix Hacker Screen
Neon Green Terminal
Gaming UI
Overdone Cyberpunk
```

Instead think of the visual atmosphere as a combination of:

```text
Dark atmospheric interface
        +
Modern developer tooling
        +
Security operations workspace
        +
Subtle futuristic computing
        +
Cinematic lighting
        +
Minimal technical UI
```

The website should feel visually impressive immediately, even before the visitor starts reading.

---

# 43. Atmospheric Background System

Create a **living animated background** rather than using a plain solid-color background.

The background should be subtle enough that content remains easy to read.

Possible techniques include:

* animated gradients
* slowly moving radial gradients
* ambient light blobs
* subtle grid
* perspective grid
* noise/grain texture
* particles
* floating points
* network nodes
* connecting lines
* constellation-like structures
* soft glows
* mouse-reactive illumination
* parallax depth
* subtle scanning effects
* blurred atmospheric shapes

Do NOT randomly implement all of them.

Choose a small combination that creates a cohesive visual system.

For example:

```text
Layer 1 — deep atmospheric base
Layer 2 — animated radial gradients
Layer 3 — extremely subtle technical grid
Layer 4 — sparse particles/network
Layer 5 — mouse-reactive ambient glow
Layer 6 — page content
```

The animation should feel slow and ambient rather than constantly demanding attention.

---

# 44. Canvas Background

If appropriate, use a lightweight HTML5 `<canvas>` background implemented in vanilla JavaScript.

Possible concept:

```text
          •
        /   \
   •───•     •
       │    /
       •───•
          \
           •
```

Sparse nodes can slowly drift through the background.

Nearby nodes may create subtle connecting lines.

Important:

This should NOT look like a cheesy "hacker network animation."

Keep:

* particle count low
* movement slow
* opacity low
* connections sparse
* colors restrained
* CPU usage reasonable

The canvas should automatically resize with the viewport.

Use `requestAnimationFrame()` correctly.

Pause or reduce expensive animation when the page/tab is not visible where practical.

---

# 45. Mouse-Reactive Ambient Lighting

Consider implementing a subtle pointer-following ambient light.

For example, the cursor position could influence CSS variables:

```css
--mouse-x
--mouse-y
```

which control a large blurred radial gradient behind the interface.

The effect should feel like the environment is responding slightly to the user.

NOT like a flashlight following the cursor.

Keep the effect subtle.

Disable or simplify it on touch devices.

---

# 46. Foreground Motion

Foreground animation is encouraged where it improves the experience.

Possible effects:

* reveal-on-scroll
* subtle fade + translate
* staggered project entrance
* navigation transitions
* project expansion animations
* modal transitions
* timeline reveal
* tag entrance
* hover elevation
* image zoom
* command palette transition
* active section indicator
* animated separators
* subtle text reveal

Avoid excessive bouncing, spinning, pulsing, or dramatic movement.

Motion should communicate:

```text
Hierarchy
State
Navigation
Depth
Interaction
```

rather than existing purely as decoration.

---

# 47. Project Interaction

Projects should have particularly polished interaction.

For example, hovering over a project could subtly:

* shift its visual depth
* reveal technical metadata
* brighten its accent
* animate an architecture/background line
* expose an action indicator

Clicking it should transition smoothly into the detailed project view.

Avoid generic Bootstrap card hover effects.

Projects should feel like opening a **technical case file**.

---

# 48. Scroll Experience

Make scrolling feel polished.

Use Intersection Observer rather than heavy scroll-event calculations wherever possible.

Sections can subtly transition into view.

Example:

```text
opacity: 0
translateY: 20px

      ↓

opacity: 1
translateY: 0
```

But vary the presentation intelligently rather than applying exactly the same animation to every element.

The animation timing should be restrained and professional.

---

# 49. Layered Depth

Use visual layering to create depth.

For example:

```text
BACKGROUND
│
├── atmospheric gradient
├── animated particles/network
├── subtle grid/noise
│
CONTENT
│
├── navigation
├── workspace
├── project content
│
INTERACTION
│
├── hover states
├── command palette
├── media viewer
└── modal overlays
```

Use blur, opacity, shadows, borders, gradients, and transparency carefully.

Do not overuse glassmorphism.

Some surfaces may use:

```css
backdrop-filter: blur(...);
```

but the entire website should NOT become dozens of translucent glass cards.

---

# 50. Color Direction

Use a cool atmospheric color system.

Possible direction:

```text
Near-black / blue-black background
Slate / graphite surfaces
Cold blue
Muted cyan
Soft violet
Desaturated indigo
Cool white typography
Muted blue-gray secondary text
```

Potential atmospheric gradient concept:

```text
Deep Navy
    ↓
Blue Black
    ↓
Subtle Indigo
    ↓
Near Black
```

Accents can use carefully restrained combinations of:

```text
Electric Blue
Ice Blue
Cyan
Indigo
Violet
```

Do NOT make everything glow.

Bright colors should indicate important information or interaction.

---

# 51. Typography

Typography should contribute heavily to the visual identity.

Use a modern sans-serif for primary content.

A carefully selected monospace font can be used for:

* metadata
* technical labels
* project IDs
* dates
* technologies
* status
* command palette
* small navigation details

Do not make the entire website monospace.

The contrast between modern typography and technical monospace details should reinforce the engineering/workspace aesthetic.

---

# 52. Micro-Interactions

Add small micro-interactions throughout the site.

Examples:

Navigation:

```text
Projects
────────
```

where the indicator smoothly follows the active section.

Tags could have a very subtle hover response.

External-link icons could shift slightly.

Project actions could reveal arrows:

```text
View Case Study  →
```

with the arrow translating slightly on hover.

Buttons should feel responsive without exaggerated transformations.

---

# 53. Optional Technical Visual Elements

You may introduce subtle technical visual elements such as:

* coordinate labels
* section IDs
* tiny timestamps
* grid coordinates
* system-status indicators
* connection indicators
* node diagrams
* architecture-line motifs
* waveform-like separators
* technical annotations

Example:

```text
PROJECT / 001

EVIDEX
Web VAPT Reporting Platform

STATUS       ACTIVE
DOMAIN       APPLICATION SECURITY
STACK        ...
```

This can make the portfolio feel like an engineering workspace.

However, do not sacrifice readability just to make it look technical.

---

# 54. Hero / Opening Experience

The opening viewport should immediately establish the atmosphere.

Do NOT create the generic:

```text
Hi, I'm Eswaran 👋

Cybersecurity Student

[Contact Me] [Download Resume]
```

Instead create a distinctive introduction.

It could feel like the workspace initializing or presenting an identity dossier.

For example conceptually:

```text
ESWARAN S
────────────────────────────────────────

CYBERSECURITY / SECURITY OPERATIONS

Building security tooling,
investigating systems,
and automating analysis.

CURRENT FOCUS
SOC · CLOUD · AUTOMATION · AI

                                STATUS
                                AVAILABLE
```

This is only inspiration.

Design something original.

The user's name should remain the strongest visual element without becoming an oversized generic landing-page heading.

---

# 55. Subtle Initialization Sequence

Optionally implement a very short initial-load sequence.

For example:

```text
INITIALIZING WORKSPACE
        ↓
LOADING PROFILE
        ↓
READY
```

Then reveal the interface.

If implemented:

* keep it very short
* preferably under approximately 1–1.5 seconds
* do not replay unnecessarily
* do not block the user for dramatic effect

It should enhance polish, not slow down the site.

---

# 56. Reduced Motion Is Mandatory

All significant animation must respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

* disable particle movement where appropriate
* remove parallax
* disable smooth scrolling
* remove large transforms
* make reveals immediate
* preserve all functionality

The portfolio must remain fully usable without animation.

---

# 57. Performance Budget for Animation

Visual quality must NOT destroy performance.

Avoid:

* thousands of particles
* large continuous DOM animations
* expensive JavaScript scroll handlers
* huge WebGL libraries
* Three.js unless absolutely necessary — preferably do not use it
* continuously animating large CSS filters
* excessive `box-shadow`
* unnecessary `backdrop-filter`

Prefer:

```text
CSS transforms
CSS opacity
requestAnimationFrame
IntersectionObserver
Small Canvas implementation
CSS custom properties
```

Animations should target `transform` and `opacity` whenever practical.

The website should remain smooth on ordinary laptops and mobile devices.

---

# 58. Animation Architecture

Keep animation logic modular.

For example:

```javascript
initAmbientBackground()
initParticleNetwork()
initPointerGlow()
initScrollReveal()
initProjectInteractions()
initCommandPalette()
```

Do not mix animation logic throughout unrelated rendering functions.

The data-rendering system and animation system should remain separate.

Architecture:

```text
data.json
    │
    ▼
Rendering Engine
    │
    ▼
DOM
    │
    ├───────────────┐
    ▼               ▼
Interaction      Animation
System           System
```

This is important because portfolio content will change frequently while the visual system should continue working automatically.

---

# 59. Dynamic Content + Animation Compatibility

Remember that sections and items are dynamically generated from `data.json`.

Therefore animations MUST work with dynamically generated elements.

Example:

If `data.json` contains:

```text
3 projects
```

all three should receive the appropriate project interactions.

If I later add:

```text
Project #4
```

the fourth project should automatically receive:

* layout styling
* reveal animation
* hover interaction
* search indexing
* project-detail behavior

without modifying JavaScript specifically for Project #4.

Never write animation logic targeting specific portfolio items such as:

```javascript
animateProject1();
animateProject2();
animateProject3();
```

Use reusable selectors, data attributes, and generic initialization.

---

# 60. Desired Emotional Impression

The final site should feel:

```text
Calm
Technical
Atmospheric
Intelligent
Precise
Modern
Experimental
Premium
```

Not:

```text
Noisy
Gaming-oriented
Overly cyberpunk
Template-like
Corporate
Generic
Over-animated
```

Imagine opening the portfolio late at night on a high-resolution monitor.

The interface should feel like a quiet, sophisticated security engineering workspace with subtle movement happening beneath the surface.

The animation should make the website feel **alive**, not distracting.

---

# 61. Final Visual Quality Requirement

Do not treat animation as something added after the website is finished.

The background, layout, typography, motion, interaction, and information architecture should be designed together as one coherent visual system.

Before finalizing, ask:

> Does this look like something generated from a common portfolio template?

If yes, redesign it.

Then ask:

> Does the interface visually communicate cybersecurity, engineering, investigation, and technical curiosity without relying on hacker clichés?

That is the target.

The result should be visually memorable enough that someone can recognize the portfolio after seeing it once.

Most importantly:

**Use my attached resume to populate `data.json`, keep all portfolio content data-driven, make every repeated section automatically generated from JSON, and create a distinctive atmospheric animated experience that remains lightweight enough for AWS S3 static hosting.**
