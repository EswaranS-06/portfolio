/* =========================================================
   app.js
   Main controller: loads data.json, drives rendering,
   navigation, animations, command palette, media viewer,
   and keyboard interactions.
   ========================================================= */
(function (global) {
  "use strict";

  const C = global.PComponents;
  if (!C) {
    console.error("components.js must load before app.js");
    return;
  }

  const state = {
    data: null,
    activeSection: "overview",
    sections: [],
    searchIndex: [],
    paletteMasterIndex: [],
    paletteOpen: false,
    paletteItems: [],
    paletteActive: -1,
    modalOpen: false,
    mediaOpen: false,
    lastFocus: null,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    mobileNavOpen: false
  };

  function showToast(message, isError) {
    const container = document.getElementById("toasts");
    if (!container) return;
    const t = document.createElement("div");
    t.className = "toast" + (isError ? " is-error" : "");
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
      t.style.transform = "translateX(20px)";
      setTimeout(() => t.remove(), 320);
    }, 2800);
  }

  global.PApp = {
    showToast: showToast
  };

  /* =========================================================
     1. ENTRY POINT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", boot);

  async function boot() {
    runBootSequence([
      "Initializing workspace",
      "Loading profile",
      "Rendering interface",
      "Ready"
    ]);

    const ok = await loadPortfolioData();
    if (!ok) {
      finishBoot(false);
      return;
    }

    try {
      renderPortfolio(state.data);
      finishBoot(true);
    } catch (err) {
      console.error("Render failed:", err);
      showError("Failed to render portfolio: " + (err && err.message ? err.message : "unknown error"));
      finishBoot(false);
    }
  }

  /* =========================================================
     2. DATA LOADING
     ========================================================= */
  async function loadPortfolioData() {
    try {
      const res = await fetch("data.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
      const data = await res.json();
      if (!data || typeof data !== "object") throw new Error("data.json is not a valid object");
      if (!data.profile) {
        console.warn("data.json: missing 'profile' object");
      }
      state.data = data;
      return true;
    } catch (err) {
      console.error("Failed to load data.json:", err);
      showError(
        "Portfolio data could not be loaded.\n\n" +
        "Check that data.json exists and the website is being served through HTTP/HTTPS.\n\n" +
        (err && err.message ? "Detail: " + err.message : "")
      );
      if (location.protocol === "file:") {
        console.warn("Hint: fetch() does not work over file://. Run: python -m http.server 8000, then open http://localhost:8000");
      }
      return false;
    }
  }

  /* =========================================================
     3. BOOT SEQUENCE
     ========================================================= */
  function runBootSequence(steps) {
    if (state.reducedMotion) return;
    const status = document.getElementById("bootStatus");
    const bar = document.getElementById("bootBar");
    if (!status || !bar) return;

    let i = 0;
    function next() {
      if (i >= steps.length) return;
      status.textContent = steps[i];
      bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      i++;
      if (i < steps.length) setTimeout(next, 220 + Math.random() * 160);
    }
    next();
  }

  function finishBoot(success) {
    const boot = document.getElementById("boot");
    if (!boot) return;
    boot.classList.add("is-done");
    setTimeout(() => {
      boot.style.display = "none";
    }, state.reducedMotion ? 0 : 700);

    if (success) {
      const app = document.getElementById("app");
      if (app) app.hidden = false;
      document.title = (state.data && state.data.profile && state.data.profile.name ? state.data.profile.name : "Portfolio") + " | Cybersecurity Workspace";
    }
  }

  function showError(message) {
    const err = document.getElementById("errorState");
    if (!err) return;
    err.hidden = false;
    const detail = document.getElementById("errorDetail");
    if (detail && message) {
      detail.textContent = message;
      detail.hidden = false;
    }
  }

  /* =========================================================
     4. PORTFOLIO RENDERING ORCHESTRATION
     ========================================================= */
  function renderPortfolio(data) {
    state.sections = computeSections(data);

    renderProfile(data);
    renderNavigation(data);
    renderOverview(data);
    renderExperience(data);
    renderProjects(data);
    renderLabs(data);
    renderSkills(data);
    renderCertifications(data);
    renderAchievements(data);
    renderEducation(data);
    renderDocuments(data);
    renderContact(data);
    renderSeo(data);

    initInteractions();
    initAnimations();
    initClock();
    initPointerGlow();
    initSectionSpy();

    // Initial route + scroll behaviour
    handleRouteChange();
    window.addEventListener("hashchange", handleRouteChange);
  }

  /* Compute which sections will be visible (data-driven) */
  function computeSections(data) {
    const sections = [{ id: "overview", label: "Overview", count: 0 }];
    if (data.experience && data.experience.length) sections.push({ id: "experience", label: "Experience", count: data.experience.length });
    if (data.projects && data.projects.length) sections.push({ id: "projects", label: "Projects", count: data.projects.length });
    if (data.labs && data.labs.length) sections.push({ id: "labs", label: "Labs", count: data.labs.length });
    if (data.skills && data.skills.length) sections.push({ id: "skills", label: "Skills", count: data.skills.reduce((n, g) => n + (g.items ? g.items.length : 0), 0) });
    if (data.certifications && data.certifications.length) sections.push({ id: "certifications", label: "Certifications", count: data.certifications.length });
    if (data.achievements && data.achievements.length) sections.push({ id: "achievements", label: "Achievements", count: data.achievements.length });
    if (data.education && data.education.length) sections.push({ id: "education", label: "Education", count: data.education.length });
    if (data.documents && data.documents.length) sections.push({ id: "documents", label: "Documents", count: data.documents.length });
    sections.push({ id: "contact", label: "Contact", count: 0 });
    return sections;
  }

  /* =========================================================
     5. SECTION RENDERERS
     ========================================================= */

  function renderProfile(data) {
    const p = data.profile || {};
    setText("brandName", p.title || "Security Workspace");
    setText("brandMark", (p.initials || (p.name || "?").slice(0, 2).toUpperCase()));
    setText("topStatusLabel", p.statusLabel || (p.availability || "Available"));
    setStatusDot(p.status || "open");
    setText("bottomLeft", "portfolio / " + (p.name || "owner").toLowerCase());
    setText("bottomRight", "schema v" + (data.schemaVersion || "1.0") + "  \u00b7  " + new Date().toISOString().slice(0, 10));

    if (p.location) {
      const coords = approxCoords(p.location);
      setText("topCoord", coords);
    }
  }

  function approxCoords(location) {
    if (!location) return "";
    const s = location.toLowerCase();
    if (s.includes("chennai")) return "N 13.08 \u00b7 E 80.27";
    if (s.includes("bengaluru") || s.includes("bangalore")) return "N 12.97 \u00b7 E 77.59";
    if (s.includes("mumbai")) return "N 19.07 \u00b7 E 72.87";
    if (s.includes("delhi")) return "N 28.61 \u00b7 E 77.20";
    if (s.includes("hyderabad")) return "N 17.38 \u00b7 E 78.48";
    return "[ " + location + " ]";
  }

  function setStatusDot(status) {
    document.querySelectorAll(".status-dot").forEach((d) => d.dataset.status = status);
  }

  function renderNavigation(data) {
    const navList = document.getElementById("navList");
    if (!navList) return;
    navList.textContent = "";

    const identity = document.getElementById("navIdentity");
    if (identity) {
      identity.textContent = "";
      identity.appendChild(C.createNavIdentity(data.profile || {}, data.socials || []));
    }

    state.sections.forEach((sec, i) => {
      navList.appendChild(C.createNavLink(sec, i, sec.count));
    });

    const navStatus = document.getElementById("navStatus");
    if (navStatus) {
      navStatus.textContent = "";
      navStatus.appendChild(C.createStatusPanel(data.profile || {}, data.currentFocus || []));
    }
  }

  function renderOverview(data) {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.textContent = "";
      hero.appendChild(C.createHero(data.profile || {}, data.about || {}, (data.about && data.about.focus) || []));
    }

    const container = document.getElementById("overviewPanels");
    if (container) {
      container.textContent = "";
      const abNode = C.createAboutPanel(data.about);
      if (abNode) container.appendChild(abNode);
      const focNode = C.createFocusPanel(data.currentFocus);
      if (focNode) container.appendChild(focNode);
      const stNode = C.createStatsPanel(buildStats(data));
      if (stNode) container.appendChild(stNode);
      const ctNode = C.createContactQuickPanel(data.contact, data.socials);
      if (ctNode) container.appendChild(ctNode);
    }
  }

  function buildStats(data) {
    const stats = [];
    if (data.experience && data.experience.length) stats.push({ value: String(data.experience.length), label: "Roles" });
    if (data.projects && data.projects.length) stats.push({ value: String(data.projects.length), label: "Projects" });
    if (data.certifications && data.certifications.length) stats.push({ value: String(data.certifications.length), label: "Certifications" });
    if (data.achievements && data.achievements.length) stats.push({ value: String(data.achievements.length), label: "CTF / Honours" });
    return stats;
  }

  function renderExperience(data) {
    if (!data.experience || !data.experience.length) return hideView("experience");
    showView("experience");
    setText("experienceSub", "Investigation log of professional and training engagements, in reverse chronological order.");
    const tl = document.getElementById("experienceTimeline");
    tl.textContent = "";
    data.experience.forEach((item, i) => tl.appendChild(C.createTimelineItem(item, i)));
  }

  function renderProjects(data) {
    if (!data.projects || !data.projects.length) return hideView("projects");
    showView("projects");
    setText("projectsSub", "Case files of security projects, with attack simulation, detection engineering, and tooling.");

    const grid = document.getElementById("projectsGrid");
    grid.textContent = "";

    // Domain filters
    const filters = document.getElementById("projectFilters");
    if (filters) {
      filters.textContent = "";
      const domains = Array.from(new Set(data.projects.map((p) => p.domain || "Other").filter(Boolean)));
      const allBtn = makeFilterChip("all", "All", true);
      filters.appendChild(allBtn);
      domains.forEach((d) => filters.appendChild(makeFilterChip(d, d, false)));
    }

    data.projects.forEach((p, i) => grid.appendChild(C.createProjectCase(p, i)));

    if (filters) initProjectFilters(filters, grid);
  }

  function makeFilterChip(domain, label, active) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.role = "tab";
    chip.className = "filter-chip" + (active ? " is-active" : "");
    chip.dataset.domain = domain;
    chip.setAttribute("aria-selected", active ? "true" : "false");
    chip.textContent = label;
    return chip;
  }

  function initProjectFilters(filters, grid) {
    filters.addEventListener("click", (e) => {
      const t = e.target.closest(".filter-chip");
      if (!t) return;
      filters.querySelectorAll(".filter-chip").forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      t.classList.add("is-active");
      t.setAttribute("aria-selected", "true");
      const domain = t.dataset.domain;
      grid.querySelectorAll(".case").forEach((c) => {
        const show = domain === "all" || c.dataset.domain === domain;
        c.style.display = show ? "" : "none";
      });
    });
  }

  function renderLabs(data) {
    if (!data.labs || !data.labs.length) return hideView("labs");
    showView("labs");
    setText("labsSub", "Self-built security environments for hands-on detection engineering and adversary simulation.");
    const grid = document.getElementById("labsGrid");
    grid.textContent = "";
    data.labs.forEach((l) => grid.appendChild(C.createLabCard(l)));
  }

  function renderSkills(data) {
    if (!data.skills || !data.skills.length) return hideView("skills");
    showView("skills");
    setText("skillsSub", "Categorised view of technical and operational capabilities.");
    const groups = document.getElementById("skillGroups");
    groups.textContent = "";
    data.skills.forEach((g) => {
      const node = C.createSkillGroup(g);
      if (node) groups.appendChild(node);
    });
    initSkillSearch();
  }

  function initSkillSearch() {
    const input = document.getElementById("skillSearch");
    const countTag = document.getElementById("skillSearchCount");
    const clearBtn = document.getElementById("skillSearchClear");
    const emptyState = document.getElementById("skillEmptyState");
    const emptyQuery = document.getElementById("skillEmptyQuery");
    if (!input) return;

    function update() {
      const q = input.value.toLowerCase().trim();
      let totalMatch = 0;

      if (clearBtn) clearBtn.hidden = !q;

      document.querySelectorAll(".skill-group").forEach((grp) => {
        let visible = 0;
        grp.querySelectorAll(".skill-item").forEach((item) => {
          const txt = (item.dataset.skill || item.textContent || "").toLowerCase();
          const match = !q || txt.includes(q);
          item.style.display = match ? "" : "none";
          if (match) { visible++; totalMatch++; }
        });
        grp.classList.toggle("is-empty", visible === 0);
      });

      if (countTag) {
        if (q) {
          countTag.textContent = totalMatch + " match" + (totalMatch === 1 ? "" : "es");
          countTag.hidden = false;
        } else {
          countTag.hidden = true;
        }
      }

      if (emptyState) {
        if (q && totalMatch === 0) {
          if (emptyQuery) emptyQuery.textContent = '"' + input.value + '"';
          emptyState.hidden = false;
        } else {
          emptyState.hidden = true;
        }
      }
    }

    input.addEventListener("input", update);

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        update();
        input.focus();
      });
    }
  }

  function renderCertifications(data) {
    if (!data.certifications || !data.certifications.length) return hideView("certifications");
    showView("certifications");
    setText("certsSub", "Verified credentials and completed learning paths.");
    const list = document.getElementById("certsList");
    list.textContent = "";
    data.certifications.forEach((c, i) => list.appendChild(C.createCertificateItem(c, i)));
  }

  function renderAchievements(data) {
    if (!data.achievements || !data.achievements.length) return hideView("achievements");
    showView("achievements");
    setText("achSub", "CTF placements, commendations, and competition outcomes.");
    const grid = document.getElementById("achievementsGrid");
    grid.textContent = "";
    data.achievements.forEach((a) => grid.appendChild(C.createAchievementCard(a)));
  }

  function renderEducation(data) {
    if (!data.education || !data.education.length) return hideView("education");
    showView("education");
    setText("eduSub", "Academic history and qualifications.");
    const list = document.getElementById("educationList");
    list.textContent = "";
    data.education.forEach((e) => list.appendChild(C.createEducationItem(e)));
  }

  function renderDocuments(data) {
    if (!data.documents || !data.documents.length) return hideView("documents");
    showView("documents");
    setText("docsSub", "R\u00e9sum\u00e9s, CVs, and downloadable documents. DOC/PDF files open directly or download.");
    const list = document.getElementById("documentsList");
    list.textContent = "";
    data.documents.forEach((d) => {
      const node = C.createDocumentCard(d);
      if (node) list.appendChild(node);
    });
  }

  function renderContact(data) {
    showView("contact");
    setText("contactSub", getContactSub(data));
    const panel = document.getElementById("contactPanel");
    panel.textContent = "";
    panel.appendChild(C.createContactPanel(data.contact || {}, data.socials || []));
  }

  function getContactSub(data) {
    if (data.contact && data.contact.email) return "Direct channels for collaboration, recruitment, and technical conversations.";
    return "Reach out via the channels below.";
  }

  function renderSeo(data) {
    const p = data.profile || {};
    if (p.name) document.title = p.name + (p.title ? " \u00b7 " + p.title : "") + " | Cybersecurity Workspace";
    setMeta("description", ((data.about && data.about.summary) || p.tagline || "Cybersecurity portfolio workspace."));
    setMeta("author", p.name || "");
    setMetaProperty("og:title", document.title);
    setMetaProperty("og:description", ((data.about && data.about.summary) || p.tagline || ""));
  }

  /* =========================================================
     6. VIEW VISIBILITY HELPERS
     ========================================================= */
  function showView(id) {
    const v = document.getElementById("view-" + id);
    if (v) v.hidden = false;
  }

  function hideView(id) {
    const v = document.getElementById("view-" + id);
    if (v) v.hidden = true;
    const navLink = document.querySelector('.nav__link[data-section="' + id + '"]');
    if (navLink) navLink.closest(".nav__item").style.display = "none";
  }

  function setText(id, text) {
    const n = document.getElementById(id);
    if (n) n.textContent = text;
  }

  function setMeta(name, content) {
    if (!content) return;
    let m = document.querySelector('meta[name="' + name + '"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  function setMetaProperty(prop, content) {
    if (!content) return;
    let m = document.querySelector('meta[property="' + prop + '"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("property", prop);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  /* =========================================================
     7. NAVIGATION (hash + sidebar)
     ========================================================= */
  function handleRouteChange() {
    const hash = location.hash || "";
    let target = "overview";

    // Project deep link: #project/<id>
    const projMatch = hash.match(/^#project\/([\w-]+)/i);
    if (projMatch) {
      const id = projMatch[1];
      const project = (state.data.projects || []).find((p) => p.id === id);
      if (project) {
        navigateTo("projects");
        setTimeout(() => openProjectModal(project), 320);
        return;
      }
    }

    // Plain hash number like #02 — treat as section ordinal
    if (/^#\d+$/.test(hash)) {
      const n = parseInt(hash.slice(1), 10) - 1;
      if (n >= 0 && n < state.sections.length) target = state.sections[n].id;
    } else if (hash.startsWith("#")) {
      const candidate = hash.slice(1).split("/")[0];
      const view = document.getElementById("view-" + candidate);
      if (view && !view.hidden) target = candidate;
    }

    navigateTo(target);
  }

  function navigateTo(sectionId) {
    if (!state.sections.some((s) => s.id === sectionId)) sectionId = "overview";
    state.activeSection = sectionId;

    const target = document.getElementById("view-" + sectionId);
    if (target) {
      const top = target.getBoundingClientRect().top + (document.getElementById("workspace")?.scrollTop || 0) - 12;
      const ws = document.getElementById("workspace");
      if (ws) {
        ws.scrollTo({ top: top, behavior: state.reducedMotion ? "auto" : "smooth" });
      } else {
        target.scrollIntoView({ behavior: state.reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }

    setActiveNav(sectionId);
    history.replaceState(null, "", "#" + sectionId);
    closeMobileNav();
  }

  function setActiveNav(sectionId) {
    document.querySelectorAll(".nav__link").forEach((lnk) => {
      lnk.classList.toggle("is-active", lnk.dataset.section === sectionId);
    });
    state.activeSection = sectionId;
  }

  /* IntersectionObserver spy for active-section highlight */
  function initSectionSpy() {
    if (!("IntersectionObserver" in window)) return;
    const ws = document.getElementById("workspace");
    if (!ws) return;
    const views = Array.from(document.querySelectorAll(".view:not([hidden])"));
    if (!views.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        const id = visible[0].target.id.replace(/^view-/, "");
        if (id !== state.activeSection) setActiveNav(id);
      }
    }, { root: ws, rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] });
    views.forEach((v) => io.observe(v));
  }

  function initNavigation() {
    const navList = document.getElementById("navList");
    if (navList) {
      navList.addEventListener("click", (e) => {
        const lnk = e.target.closest(".nav__link");
        if (!lnk) return;
        e.preventDefault();
        navigateTo(lnk.dataset.section);
      });
    }

    // Topbar status → contact
    const topStatus = document.getElementById("topStatus");
    if (topStatus) topStatus.addEventListener("click", () => navigateTo("contact"));

    const cmdTrigger = document.getElementById("cmdTrigger");
    if (cmdTrigger) cmdTrigger.addEventListener("click", openPalette);
  }

  /* =========================================================
     8. INTERACTIONS (project modal + media viewer)
     ========================================================= */
  function initInteractions() {
    initNavigation();
    initProjectClicks();
    initMediaButtons();
    initModalClosers();
    initPalette();
    initKeyboard();
    initResponsiveNavToggle();
    initTopStatusButton();
    initScrollProgressAndFab();
  }

  function initTopStatusButton() {
    const btn = document.getElementById("topStatus");
    if (!btn) return;
    btn.addEventListener("click", () => {
      navigateTo("contact");
      showToast("Status: Available for cybersecurity roles & security consultations");
    });
  }

  function initScrollProgressAndFab() {
    const ws = document.getElementById("workspace");
    const prog = document.getElementById("scrollProgress");
    const fab = document.getElementById("backToTop");

    if (ws) {
      ws.addEventListener("scroll", () => {
        const top = ws.scrollTop;
        const max = ws.scrollHeight - ws.clientHeight;
        const pct = max > 0 ? Math.min(100, Math.max(0, (top / max) * 100)) : 0;

        if (prog) prog.style.width = pct + "%";
        if (fab) fab.hidden = top < 360;
      });
    }

    if (fab) {
      fab.addEventListener("click", () => {
        if (ws) ws.scrollTo({ top: 0, behavior: state.reducedMotion ? "auto" : "smooth" });
        else window.scrollTo({ top: 0, behavior: state.reducedMotion ? "auto" : "smooth" });
      });
    }
  }

  function initProjectClicks() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".case");
      if (!card) return;
      openProjectModalById(card.dataset.id);
    });
    grid.addEventListener("keydown", (e) => {
      const card = e.target.closest(".case");
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModalById(card.dataset.id);
      }
    });
  }

  function openProjectModalById(id) {
    const project = (state.data.projects || []).find((p) => p.id === id);
    if (!project) return;
    openProjectModal(project);
  }

  function openProjectModal(project) {
    const modal = document.getElementById("modalProject");
    const content = document.getElementById("modalProjectContent");
    if (!modal || !content) return;

    content.textContent = "";
    const node = C.createProjectModal(project);
    if (node) content.appendChild(node);

    state.lastFocus = document.activeElement;
    state.modalOpen = true;
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    const closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);

    // Re-bind media buttons inside modal
    initMediaButtons(content);
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    const modal = document.getElementById("modalProject");
    if (!modal) return;
    state.modalOpen = false;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => { modal.hidden = true; }, 200);
    document.body.style.overflow = "";
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function initModalClosers() {
    const modal = document.getElementById("modalProject");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target.closest("[data-modal-close]")) closeProjectModal();
      });
    }
    const media = document.getElementById("mediaViewer");
    if (media) {
      media.addEventListener("click", (e) => {
        if (e.target.closest("[data-media-close]")) closeMediaViewer();
      });
    }
    const palette = document.getElementById("palette");
    if (palette) {
      palette.addEventListener("click", (e) => {
        if (e.target.closest("[data-palette-close]")) closePalette();
      });
    }
  }

  /* Media viewer ------------------------------------------------- */
  function initMediaButtons(scope) {
    const root = scope || document;
    root.querySelectorAll("[data-media-type]").forEach((btn) => {
      if (btn.dataset.mediaBound) return;
      btn.dataset.mediaBound = "1";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = btn.dataset.mediaType;
        const path = btn.dataset.mediaPath;
        const label = btn.dataset.mediaLabel || "Media";
        openMedia(type, path, label);
      });
    });
  }

  function openMedia(type, path, label) {
    const viewer = document.getElementById("mediaViewer");
    const body = document.getElementById("mediaBody");
    const caption = document.getElementById("mediaViewerCaption");
    if (!viewer || !body) return;

    body.textContent = "";

    if (type === "image") {
      const img = document.createElement("img");
      img.src = path;
      img.alt = label || "Image";
      img.onerror = () => {
        body.textContent = "";
        body.appendChild(C.el("div", { class: "palette__empty", text: "Image could not be loaded.\n\n" + path }));
        body.appendChild(createDownloadLink(path, "Open file directly"));
      };
      body.appendChild(img);
    } else if (type === "pdf") {
      const iframe = document.createElement("iframe");
      iframe.className = "media-viewer__pdf";
      iframe.src = path;
      iframe.title = label || "PDF document";
      iframe.setAttribute("aria-label", label || "PDF document");
      body.appendChild(iframe);
      body.appendChild(createDownloadLink(path, "Open / download PDF"));
    } else if (type === "markdown" || type === "text") {
      const wrap = document.createElement("div");
      wrap.className = "media-viewer__markdown";
      fetch(path)
        .then((r) => r.text())
        .then((txt) => {
          wrap.textContent = txt;
        })
        .catch(() => {
          wrap.textContent = "Failed to load " + type + ": " + path;
        });
      body.appendChild(wrap);
      body.appendChild(createDownloadLink(path, "Open file directly"));
    } else {
      // Generic download/open
      body.appendChild(C.el("div", { class: "palette__empty", text: "Preview not available for this file type." }));
      body.appendChild(createDownloadLink(path, "Open / download file"));
    }

    if (caption) caption.textContent = label || "";
    state.mediaOpen = true;
    viewer.hidden = false;
    viewer.classList.add("is-open");
    state.lastFocus = state.mediaOpen ? state.lastFocus : document.activeElement;
    document.body.style.overflow = "hidden";
    const closeBtn = viewer.querySelector(".media-viewer__close");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  }

  function createDownloadLink(href, label) {
    const a = document.createElement("a");
    a.className = "btn media-viewer__download";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    return a;
  }

  function closeMediaViewer() {
    const viewer = document.getElementById("mediaViewer");
    if (!viewer) return;
    state.mediaOpen = false;
    viewer.classList.remove("is-open");
    document.body.style.overflow = (state.modalOpen ? "hidden" : "");
    setTimeout(() => {
      viewer.hidden = true;
      const body = document.getElementById("mediaBody");
      const caption = document.getElementById("mediaViewerCaption");
      if (body) body.textContent = "";
      if (caption) caption.textContent = "";
    }, 200);
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  /* =========================================================
     9. COMMAND PALETTE / SEARCH
     ========================================================= */
  function buildSearchIndex(data) {
    if (!data) return [];
    const items = [];

    function add(item) {
      const textParts = [
        item.title || "",
        item.subtitle || "",
        item.content || "",
        item.category || ""
      ];
      item.searchableText = textParts.join(" ").toLowerCase();
      items.push(item);
    }

    // 1. Navigation Sections
    state.sections.forEach((s) => {
      add({
        action: "section",
        target: s.id,
        title: s.label + " Section",
        subtitle: "Navigation · Jump to " + s.label,
        content: s.label + " " + s.id + " overview section navigation link",
        icon: "arrow"
      });
    });

    // 2. Profile & Overview
    if (data.profile) {
      const p = data.profile;
      add({
        action: "section",
        target: "overview",
        title: p.name || "Profile",
        subtitle: "Profile · " + (p.title || ""),
        content: [p.name, p.title, p.tagline, p.location, p.availability, p.statusLabel].filter(Boolean).join(" "),
        icon: "folder"
      });
    }

    if (data.about) {
      const ab = data.about;
      add({
        action: "section",
        target: "overview",
        title: "About & Objective",
        subtitle: "Overview · " + (ab.focus ? ab.focus.join(", ") : "Summary"),
        content: [ab.summary, ab.objective, (ab.focus || []).join(" ")].filter(Boolean).join(" "),
        icon: "doc"
      });
    }

    if (data.currentFocus && data.currentFocus.length) {
      add({
        action: "section",
        target: "overview",
        title: "Current Security Focus",
        subtitle: "Overview · Active Learning & Labs",
        content: data.currentFocus.join(" "),
        icon: "search"
      });
    }

    // 3. Work Experience
    (data.experience || []).forEach((exp) => {
      add({
        action: "section",
        target: "experience",
        title: exp.role + " @ " + exp.company,
        subtitle: "Experience · " + (exp.type || "Role") + " (" + (exp.start || "") + ")",
        content: [
          exp.company, exp.role, exp.type, exp.summary, exp.location,
          (exp.responsibilities || []).join(" "),
          (exp.technologies || []).join(" ")
        ].filter(Boolean).join(" "),
        icon: "folder"
      });
    });

    // 4. Projects & Cases
    (data.projects || []).forEach((p) => {
      add({
        action: "project",
        target: p.id,
        title: p.name,
        subtitle: "Project · " + (p.subtitle || p.domain || ""),
        content: [
          p.name, p.subtitle, p.domain, p.summary, p.description, p.problem,
          p.solution, p.role, (p.technologies || []).join(" "),
          (p.securityAreas || []).join(" "), (p.features || []).join(" "),
          (p.highlights || []).join(" ")
        ].filter(Boolean).join(" "),
        icon: "folder"
      });

      // Index individual technology keywords directly to project case
      (p.technologies || []).forEach((tech) => {
        add({
          action: "project",
          target: p.id,
          title: tech + " (" + p.name + ")",
          subtitle: "Project Keyword · " + p.name,
          content: tech + " " + p.name + " " + (p.domain || ""),
          icon: "search"
        });
      });
    });

    // 5. Security Labs
    (data.labs || []).forEach((lab) => {
      add({
        action: "section",
        target: "labs",
        title: lab.name,
        subtitle: "Security Lab · " + (lab.subtitle || lab.domain || ""),
        content: [
          lab.name, lab.subtitle, lab.domain, lab.status, lab.summary,
          lab.description, (lab.technologies || []).join(" "),
          (lab.highlights || []).join(" "), lab.architecture
        ].filter(Boolean).join(" "),
        icon: "folder"
      });
    });

    // 6. Skills & Competencies
    (data.skills || []).forEach((g) => {
      (g.items || []).forEach((it) => {
        const name = typeof it === "string" ? it : (it.name || "");
        const level = typeof it === "object" && it.level ? it.level : "";
        const note = typeof it === "object" && it.note ? it.note : "";
        add({
          action: "section",
          target: "skills",
          title: name,
          subtitle: "Skill · " + g.category + (level ? " [" + level + "]" : ""),
          content: [name, g.category, level, note].filter(Boolean).join(" "),
          icon: "search"
        });
      });
    });

    // 7. Certifications & Badges
    (data.certifications || []).forEach((c) => {
      add({
        action: "section",
        target: "certifications",
        title: c.name,
        subtitle: "Certification · " + (c.issuer || ""),
        content: [c.name, c.issuer, c.code, c.date, c.status, c.summary, (c.skills || []).join(" ")].filter(Boolean).join(" "),
        icon: "cert"
      });
    });

    // 8. Achievements & Placements
    (data.achievements || []).forEach((a) => {
      add({
        action: "section",
        target: "achievements",
        title: a.title,
        subtitle: "Achievement · " + (a.issuer || a.type || ""),
        content: [a.title, a.issuer, a.date, a.type, a.highlight, a.description].filter(Boolean).join(" "),
        icon: "arrow"
      });
    });

    // 9. Education
    (data.education || []).forEach((ed) => {
      add({
        action: "section",
        target: "education",
        title: ed.degree,
        subtitle: "Education · " + (ed.institution || ""),
        content: [ed.degree, ed.institution, ed.score, ed.location, ed.summary, (ed.courses || []).join(" ")].filter(Boolean).join(" "),
        icon: "folder"
      });
    });

    // 10. Documents & CV
    (data.documents || []).forEach((d) => {
      add({
        action: "download",
        target: d.path,
        title: d.label,
        subtitle: "Document · " + (d.type || "").toUpperCase() + (d.description ? " - " + d.description : ""),
        content: [d.label, d.type, d.path, d.description].filter(Boolean).join(" "),
        icon: "doc"
      });
    });

    // 11. Contact Details & Social Links
    if (data.contact) {
      if (data.contact.email) {
        add({
          action: "link",
          target: "mailto:" + data.contact.email,
          title: "Email: " + data.contact.email,
          subtitle: "Contact · Send email",
          content: "email mail contact " + data.contact.email,
          icon: "mail"
        });
      }
      if (data.contact.phone) {
        add({
          action: "link",
          target: "tel:" + data.contact.phone.replace(/[^+0-9]/g, ""),
          title: "Phone: " + data.contact.phone,
          subtitle: "Contact · Call phone number",
          content: "phone call contact " + data.contact.phone,
          icon: "phone"
        });
      }
    }

    if (data.socials && data.socials.length) {
      data.socials.forEach((s) => {
        add({
          action: "link",
          target: s.url,
          title: s.label + " (@" + (s.handle || "") + ")",
          subtitle: "Social Profile · " + s.url,
          content: [s.label, s.handle, s.url, s.id].filter(Boolean).join(" "),
          icon: s.icon || "external"
        });
      });
    }

    return items;
  }

  function initPalette() {
    state.paletteMasterIndex = buildSearchIndex(state.data);
    state.paletteItems = state.paletteMasterIndex;
    const input = document.getElementById("paletteInput");
    const results = document.getElementById("paletteResults");
    if (!input || !results) return;

    const onSearch = () => renderPaletteResults(input.value);
    input.addEventListener("input", onSearch);
    input.addEventListener("keyup", onSearch);
    input.addEventListener("change", onSearch);
    input.addEventListener("keydown", onPaletteKeydown);
    results.addEventListener("click", (e) => {
      const li = e.target.closest(".palette__item");
      if (!li) return;
      executePalette(li.dataset.action, li.dataset.target);
    });
  }

  function renderPaletteResults(query) {
    const results = document.getElementById("paletteResults");
    if (!results) return;
    results.textContent = "";
    state.paletteActive = -1;

    const q = (query || "").trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    let filtered = [];
    if (!tokens.length) {
      filtered = state.paletteMasterIndex.slice(0, 10);
    } else {
      const scored = [];
      state.paletteMasterIndex.forEach((item) => {
        const text = item.searchableText;
        const matchesAll = tokens.every((tok) => text.includes(tok));
        if (!matchesAll) return;

        let score = 0;
        const titleLower = item.title.toLowerCase();
        const subLower = item.subtitle.toLowerCase();

        tokens.forEach((tok) => {
          if (titleLower === tok) score += 100;
          else if (titleLower.startsWith(tok)) score += 50;
          else if (titleLower.includes(tok)) score += 25;
          else if (subLower.includes(tok)) score += 12;
          else score += 5;
        });

        scored.push({ item, score });
      });

      scored.sort((a, b) => b.score - a.score);
      filtered = scored.map((s) => s.item).slice(0, 20);
    }

    state.paletteItems = filtered;

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "palette__empty";
      empty.textContent = "No matches found for \u201c" + query + "\u201d";
      results.appendChild(empty);
      return;
    }

    filtered.forEach((item, i) => {
      const node = C.createPaletteItem(item, i === 0);
      node.dataset.index = String(i);
      results.appendChild(node);
    });
    state.paletteActive = filtered.length > 0 ? 0 : -1;
    if (state.paletteActive >= 0) highlightPalette();
  }

  function onPaletteKeydown(e) {
    const results = document.getElementById("paletteResults");
    if (!results) return;
    const items = results.querySelectorAll(".palette__item");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.paletteActive = Math.min(state.paletteActive + 1, items.length - 1);
      highlightPalette();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.paletteActive = Math.max(state.paletteActive - 1, 0);
      highlightPalette();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[state.paletteActive]) {
        executePalette(items[state.paletteActive].dataset.action, items[state.paletteActive].dataset.target);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  }

  function highlightPalette() {
    const results = document.getElementById("paletteResults");
    if (!results) return;
    results.querySelectorAll(".palette__item").forEach((li, i) => {
      const on = i === state.paletteActive;
      li.classList.toggle("is-active", on);
      li.setAttribute("aria-selected", on ? "true" : "false");
      if (on) li.scrollIntoView({ block: "nearest" });
    });
  }

  function openPalette() {
    const palette = document.getElementById("palette");
    if (!palette) return;
    state.paletteOpen = true;
    state.lastFocus = document.activeElement;
    palette.hidden = false;
    palette.classList.add("is-open");
    if (!state.reducedMotion) {
      const input = document.getElementById("paletteInput");
      if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 30);
      }
      renderPaletteResults("");
    } else {
      const input = document.getElementById("paletteInput");
      input.value = "";
      input.focus();
      renderPaletteResults("");
    }
    document.body.style.overflow = "hidden";
  }

  function closePalette() {
    const palette = document.getElementById("palette");
    if (!palette) return;
    state.paletteOpen = false;
    palette.classList.remove("is-open");
    document.body.style.overflow = (state.modalOpen || state.mediaOpen) ? "hidden" : "";
    setTimeout(() => { palette.hidden = true; }, 200);
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function executePalette(action, target) {
    closePalette();
    if (!action) return;
    setTimeout(() => {
      if (action === "section") {
        navigateTo(target);
      } else if (action === "project") {
        navigateTo("projects");
        setTimeout(() => openProjectModalById(target), 240);
      } else if (action === "link") {
        if (target) window.open(target, "_blank", "noopener,noreferrer");
      } else if (action === "download") {
        if (target) window.open(target, "_blank", "noopener,noreferrer");
      }
    }, 60);
  }

  /* =========================================================
     10. KEYBOARD SHORTCUTS
     ========================================================= */
  function initKeyboard() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K → palette
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (state.paletteOpen) closePalette();
        else openPalette();
        return;
      }
      // Escape
      if (e.key === "Escape") {
        if (state.paletteOpen) { closePalette(); return; }
        if (state.mediaOpen) { closeMediaViewer(); return; }
        if (state.modalOpen) { closeProjectModal(); return; }
        if (state.mobileNavOpen) { closeMobileNav(); return; }
      }
      // Slash focuses palette (avoid clobbering inputs)
      if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  function isTypingTarget(node) {
    if (!node) return false;
    const tag = (node.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || node.isContentEditable;
  }

  /* =========================================================
     11. RESPONSIVE NAV TOGGLE
     ========================================================= */
  function initResponsiveNavToggle() {
    if (!document.querySelector(".mob-toggle")) {
      const t = document.createElement("button");
      t.className = "mob-toggle";
      t.type = "button";
      t.setAttribute("aria-label", "Toggle navigation");
      t.setAttribute("aria-controls", "nav");
      t.setAttribute("aria-expanded", "false");
      t.textContent = "MENU";
      t.addEventListener("click", toggleMobileNav);
      const topbar = document.querySelector(".topbar");
      if (topbar) topbar.appendChild(t);
    }
  }

  function toggleMobileNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    state.mobileNavOpen = !state.mobileNavOpen;
    nav.classList.toggle("is-open", state.mobileNavOpen);
    const t = document.querySelector(".mob-toggle");
    if (t) {
      t.setAttribute("aria-expanded", state.mobileNavOpen ? "true" : "false");
      t.textContent = state.mobileNavOpen ? "CLOSE" : "MENU";
    }
  }

  function closeMobileNav() {
    if (!state.mobileNavOpen) return;
    state.mobileNavOpen = false;
    const nav = document.getElementById("nav");
    if (nav) nav.classList.remove("is-open");
    const t = document.querySelector(".mob-toggle");
    if (t) {
      t.setAttribute("aria-expanded", "false");
      t.textContent = "MENU";
    }
  }

  /* =========================================================
     12. ANIMATIONS
     ========================================================= */
  function initAnimations() {
    initAmbientBackground();
    initScrollReveal();
  }

  function initAmbientBackground() {
    if (state.reducedMotion) return;
    initParticleNetwork();
  }

  function initParticleNetwork() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let raf = null;
    let lastFrame = 0;
    let running = true;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const targetCount = Math.max(18, Math.min(42, Math.round((w * h) / 36000)));
      nodes = [];
      for (let i = 0; i < targetCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.8 + Math.random() * 1.4
        });
      }
    }

    function step(now) {
      if (!running) return;
      if (now - lastFrame < 33) {
        raf = requestAnimationFrame(step);
        return;
      }
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);

      // Move nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Connections
      const maxDist = 130;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = "rgba(78, 162, 255, " + alpha + ")";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.fillStyle = "rgba(140, 200, 255, 0.35)";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running && raf) return;
      running = true;
      raf = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    }

    resize();
    window.addEventListener("resize", debounce(resize, 200));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    start();
  }

  function initPointerGlow() {
    if (state.reducedMotion) return;
    const glow = document.querySelector(".atmosphere__pointer");
    if (!glow) return;
    // Disable on touch devices
    if (matchMedia("(hover: none)").matches) return;

    let visible = false;
    document.addEventListener("pointermove", (e) => {
      glow.style.transform = "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0)";
      if (!visible) {
        glow.classList.add("is-active");
        visible = true;
      }
    });
    document.addEventListener("pointerleave", () => {
      glow.classList.remove("is-active");
      visible = false;
    });
  }

  function initScrollReveal() {
    if (state.reducedMotion) {
      document.querySelectorAll("[data-appear]").forEach((n) => n.classList.add("is-visible"));
      return;
    }
    scanReveals(document);
  }

  function scanReveals(root) {
    const nodes = (root || document).querySelectorAll("[data-appear]:not(.is-visible)");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    nodes.forEach((n) => io.observe(n));
  }

  /* =========================================================
     13. LIVE CLOCK
     ========================================================= */
  function initClock() {
    const clock = document.getElementById("topClock");
    if (!clock) return;
    function tick() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  /* =========================================================
     14. UTILITIES
     ========================================================= */
  function debounce(fn, delay) {
    let t;
    return function () {
      const a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(self, a), delay);
    };
  }

})(window);
