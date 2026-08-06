/* =========================================================
   components.js
   Reusable DOM rendering functions.
   Every function returns a DOM node, never a string.
   Unsigned strings are inserted via textContent.
   ========================================================= */
(function (global) {
  "use strict";

  const SVG = {
    github: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path fill='currentColor' d='M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z'/></svg>",
    linkedin: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path fill='currentColor' d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 9.5H5.67V18h2.67V9.5zM7 5.5a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1zM18.34 18v-4.67c0-2.5-1.34-3.66-3.13-3.66a2.7 2.7 0 0 0-2.45 1.35h-.03V9.5H10.1V18h2.67v-4.13c0-1.09.2-2.14 1.55-2.14s1.34 1.24 1.34 2.21V18h2.68z'/></svg>",
    tryhackme: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path fill='currentColor' d='M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.34L18.5 8 12 11.66 5.5 8 12 4.34zM5 9.66l6 3.5v7l-6-3.5v-7zm14 0v7l-6 3.5v-7l6-3.5z'/></svg>",
    arrow: "<svg viewBox='0 0 24 24' aria-hidden='true' width='14' height='14'><path d='M5 12h14M13 6l6 6-6 6' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
    external: "<svg viewBox='0 0 24 24' aria-hidden='true' width='14' height='14'><path d='M14 5h5m0 0v5m0-5L9 15M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
    mail: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path d='M3 6h18v12H3z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M3 7l9 6 9-6' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/></svg>",
    phone: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path d='M4 4l3 1 1 4-2 1 2 4 2 4 1 4 4 2 0-4-3-1-1-4 2-1-2-4-2-4-4 1-3-3z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/></svg>",
    location: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5z' fill='none' stroke='currentColor' stroke-width='1.4'/></svg>",
    doc: "<svg viewBox='0 0 24 24' aria-hidden='true' width='20' height='20'><path d='M6 2h9l5 5v15H6z' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/><path d='M15 2v5h5M9 13h8M9 17h8M9 9h3' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/></svg>",
    cert: "<svg viewBox='0 0 24 24' aria-hidden='true' width='22' height='22'><circle cx='12' cy='9' r='5' fill='none' stroke='currentColor' stroke-width='1.4'/><path d='M9 13l-2 8 5-3 5 3-2-8' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/></svg>",
    download: "<svg viewBox='0 0 24 24' aria-hidden='true' width='15' height='15'><path d='M12 3v12m0 0l-4-5m4 5l4-5M4 19h16' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
    image: "<svg viewBox='0 0 24 24' aria-hidden='true' width='22' height='22'><rect x='3' y='4' width='18' height='16' rx='1' fill='none' stroke='currentColor' stroke-width='1.4'/><circle cx='8' cy='10' r='2' fill='none' stroke='currentColor' stroke-width='1.4'/><path d='M3 17l5-5 5 5 3-3 5 5' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/></svg>",
    folder: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path d='M3 6h6l2 2h10v11H3z' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/></svg>",
    search: "<svg viewBox='0 0 24 24' aria-hidden='true' width='16' height='16'><circle cx='11' cy='11' r='7' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M16.5 16.5L21 21' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/></svg>",
    close: "<svg viewBox='0 0 24 24' aria-hidden='true' width='18' height='18'><path d='M6 6l12 12M18 6L6 18' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'/></svg>"
  };

  /* Utility helpers --------------------------------------------------- */
  const ns = "http://www.w3.org/1999/xhtml";

  function el(tag, props) {
    const node = document.createElement(tag);
    if (!props) return node;
    if (props.class) node.className = props.class;
    if (props.id) node.id = props.id;
    if (props.dataset) for (const k in props.dataset) node.dataset[k] = props.dataset[k];
    if (props.attrs) for (const k in props.attrs) {
      if (props.attrs[k] == null) continue;
      node.setAttribute(k, props.attrs[k]);
    }
    if (props.text != null) node.textContent = props.text;
    if (props.html != null) node.innerHTML = props.html;
    if (props.children) props.children.forEach((c) => c && node.appendChild(c));
    if (props.onClick) node.addEventListener("click", props.onClick, false);
    if (props.role) node.setAttribute("role", props.role);
    return node;
  }

  function text(s) {
    return document.createTextNode(s == null ? "" : String(s));
  }

  function safeString(v) {
    return v == null ? "" : String(v);
  }

  function fragment(arr) {
    const f = document.createDocumentFragment();
    (arr || []).forEach((c) => { if (c) f.appendChild(c); });
    return f;
  }

  function chained(list, sep) {
    const f = document.createDocumentFragment();
    list.forEach((n, i) => {
      if (i && sep) f.appendChild(text(sep));
      if (n) f.appendChild(n);
    });
    return f;
  }

  function svg(name, size) {
    const wrapper = el("span", { class: "icon", html: SVG[name] || "" });
    return wrapper;
  }

  function fmtDate(yyyymm) {
    if (!yyyymm) return "";
    const parts = String(yyyymm).split("-");
    if (parts.length === 1) return parts[0];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = parseInt(parts[1], 10) - 1;
    if (Number.isNaN(m) || m < 0 || m > 11) return parts[0];
    return months[m] + " " + parts[0];
  }

  function dateRange(start, end) {
    const s = fmtDate(start);
    const e = fmtDate(end) || "Present";
    if (!s) return e;
    return s + " \u2014 " + e;
  }

  function extOf(path) {
    if (!path) return "";
    const m = String(path).toLowerCase().match(/\.([a-z0-9]+)$/);
    return m ? m[1] : "";
  }

  function mediaTypeOf(m) {
    if (!m) return "file";
    const ext = extOf(m.path);
    if (m.type) return m.type;
    if (["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (ext === "md" || ext === "markdown") return "markdown";
    if (ext === "txt") return "text";
    return "file";
  }

  function preferName(item, fallback) {
    if (!item) return fallback || "";
    return item.name || item.label || item.title || fallback || "";
  }

  function isExternalLink(url) {
    return /^https?:\/\//i.test(String(url || ""));
  }

  function copyTextToClipboard(val, label) {
    if (!val) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(() => {
        if (global.PApp && typeof global.PApp.showToast === "function") {
          global.PApp.showToast("Copied " + (label || "item") + ": " + val);
        }
      }).catch(() => {
        fallbackCopy(val, label);
      });
    } else {
      fallbackCopy(val, label);
    }
  }

  function fallbackCopy(val, label) {
    const ta = document.createElement("textarea");
    ta.value = val;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      if (global.PApp && typeof global.PApp.showToast === "function") {
        global.PApp.showToast("Copied " + (label || "item") + ": " + val);
      }
    } catch (e) {}
    document.body.removeChild(ta);
  }

  /* =========================================================
     Reusable atomic components
     ========================================================= */

  function createTag(label, variant) {
    if (!label) return null;
    const cls = variant ? "tag tag--" + variant : "tag";
    return el("span", { class: cls, text: String(label) });
  }

  function createTagList(items) {
    if (!items || !items.length) return null;
    return el("div", { class: "tag-row" },
      { children: items.map((t) => createTag(t)).filter(Boolean) });
  }

  function createLink(opts) {
    const node = el("a", {
      class: opts.class || "",
      attrs: { href: opts.href || "#" },
      text: opts.text
    });
    if (opts.icon) {
      node.classList.add("has-icon");
      const ic = svg(opts.icon);
      ic.classList.add("link__icon");
      node.insertBefore(ic, node.firstChild);
    }
    if (isExternalLink(opts.href)) node.setAttribute("rel", "noopener noreferrer");
    if (opts.ariaLabel) node.setAttribute("aria-label", opts.ariaLabel);
    return node;
  }

  function createSocialLink(social) {
    if (!social || !social.url) return null;
    const node = el("a", {
      class: "nav__social",
      attrs: { href: safeString(social.url), "aria-label": safeString(social.label || social.handle) },
      html: SVG[social.icon || "external"] || SVG.external
    });
    if (isExternalLink(social.url)) node.setAttribute("rel", "noopener noreferrer");
    return node;
  }

  /* News / status row in sidebar footer */
  function createStatusPanel(profile, focus) {
    const wrap = el("div", { class: "nav__status-panel" });
    wrap.appendChild(el("div", { class: "status-line", text: "> workspace ready" }));
    if (focus && focus.length) {
      wrap.appendChild(el("div", { class: "status-line", text: "> focus: " + focus.slice(0, 2).join(", ") }));
    }
    return wrap;
  }

  /* =========================================================
     Hero / Overview components
     ========================================================= */
  function createHero(profile, about, currentFocus) {
    const hero = el("section", { class: "hero" });
    const colL = el("div", { class: "hero__column hero__column--left" });
    const colR = el("div", { class: "hero__column hero__column--right" });

    colL.appendChild(el("div", { class: "hero__eyebrow", text: "Identity / Dossier" }));

    const name = el("h1", { class: "hero__name", text: safeString(profile.name || "Unknown") });
    colL.appendChild(name);

    const divider = el("div", { class: "hero__divider" });
    colL.appendChild(divider);

    if (profile.title) {
      colL.appendChild(el("div", { class: "hero__title", text: safeString(profile.title) }));
    }
    if (profile.tagline) {
      colL.appendChild(el("p", { class: "hero__tagline", text: safeString(profile.tagline) }));
    }
    if (currentFocus && currentFocus.length) {
      const focusWrap = el("div", { class: "hero__focus" });
      currentFocus.forEach((f) => focusWrap.appendChild(el("span", { class: "hero__focus-item", text: safeString(f) })));
      colL.appendChild(focusWrap);
    }

    colR.appendChild(createDossier(profile, currentFocus));

    hero.appendChild(colL);
    hero.appendChild(colR);
    return hero;
  }

  function createDossier(profile, currentFocus) {
    const dossier = el("div", { class: "hero__dossier", attrs: { "aria-label": "Identity dossier" } });

    const avail = el("div", { class: "hero__dossier-cell span-2" });
    avail.appendChild(el("span", { class: "hero__dossier-label", text: "Status" }));
    const status = el("span", { class: "hero__availability" });
    status.appendChild(el("span", { class: "status-dot", attrs: { "data-status": safeString(profile.status || "open") } }));
    status.appendChild(text("\u00a0 " + safeString(profile.statusLabel || profile.availability || "Available")));
    avail.appendChild(status);
    dossier.appendChild(avail);

    if (profile.location) {
      const location = el("div", { class: "hero__dossier-cell" });
      location.appendChild(el("span", { class: "hero__dossier-label", text: "Location" }));
      location.appendChild(el("span", { class: "hero__dossier-value", text: safeString(profile.location) }));
      dossier.appendChild(location);
    }

    if (currentFocus && currentFocus.length) {
      const cf = el("div", { class: "hero__dossier-cell" });
      cf.appendChild(el("span", { class: "hero__dossier-label", text: "Current Focus" }));
      cf.appendChild(el("span", { class: "hero__dossier-value", text: safeString(currentFocus[0]) }));
      dossier.appendChild(cf);
    }

    return dossier;
  }

  function createAboutPanel(about) {
    if (!about) return null;
    const panel = el("div", { class: "panel", dataset: { appear: "" } });
    panel.appendChild(el("div", { class: "panel__label", text: "About" }));
    if (about.summary) {
      panel.appendChild(el("p", { class: "panel__body", text: safeString(about.summary) }));
    }
    return panel;
  }

  function createObjectivePanel(about) {
    if (!about || !about.objective) return null;
    const panel = el("div", { class: "panel", dataset: { appear: "" } });
    panel.appendChild(el("div", { class: "panel__label", text: "Objective" }));
    const body = el("div", { class: "panel__body" });
    body.appendChild(el("p", { text: safeString(about.objective) }));
    if (about.focus && about.focus.length) {
      const list = el("div", { class: "focus-list" });
      about.focus.forEach((f) => list.appendChild(el("div", { class: "focus-list__item", text: safeString(f) })));
      body.appendChild(list);
    }
    panel.appendChild(body);
    return panel;
  }

  function createFocusPanel(currentFocus) {
    if (!currentFocus || !currentFocus.length) return null;
    const panel = el("div", { class: "panel", dataset: { appear: "" } });
    panel.appendChild(el("div", { class: "panel__label", text: "Currently Working On" }));
    const list = el("div", { class: "focus-list" });
    currentFocus.forEach((f) => list.appendChild(el("div", { class: "focus-list__item", text: safeString(f) })));
    panel.appendChild(list);
    return panel;
  }

  function createStatsPanel(stats) {
    if (!stats || !stats.length) return null;
    const panel = el("div", { class: "panel", dataset: { appear: "" } });
    panel.appendChild(el("div", { class: "panel__label", text: "At a Glance" }));
    const grid = el("div", { class: "stat-grid" });
    stats.forEach((s) => {
      const cell = el("div");
      cell.appendChild(el("div", { class: "stat-grid__value", text: safeString(s.value) }));
      cell.appendChild(el("div", { class: "stat-grid__label", text: safeString(s.label) }));
      grid.appendChild(cell);
    });
    panel.appendChild(grid);
    return panel;
  }

  function createContactQuickPanel(contact, socials) {
    if (!contact && (!socials || !socials.length)) return null;
    const panel = el("div", { class: "panel", dataset: { appear: "" } });
    panel.appendChild(el("div", { class: "panel__label", text: "Contact" }));
    const list = el("div", { class: "contact-quick" });
    if (contact && contact.email) {
      list.appendChild(createContactQuickRow("mail", "Email", contact.email, "mailto:" + encodeURIComponent(contact.email)));
    }
    if (contact && contact.phone) {
      list.appendChild(createContactQuickRow("phone", "Phone", contact.phone, "tel:" + String(contact.phone).replace(/[^\d+]/g, "")));
    }
    if (contact && contact.location) {
      list.appendChild(createContactQuickRow("location", "Location", contact.location, null));
    }
    panel.appendChild(list);
    return panel;
  }

  function createContactQuickRow(icon, label, value, href) {
    const row = href
      ? el("a", { class: "contact-quick__row", attrs: { href: href }, "aria-label": label + ": " + value })
      : el("div", { class: "contact-quick__row" });
    if (href && isExternalLink(href)) row.setAttribute("rel", "noopener noreferrer");
    const ic = el("div", { class: "contact-quick__row-icon", html: SVG[icon] || SVG.folder });
    const bodyWrap = el("div");
    bodyWrap.appendChild(el("span", { class: "contact-quick__row-label", text: label }));
    bodyWrap.appendChild(el("span", { class: "contact-quick__row-value", text: value }));
    row.appendChild(ic);
    row.appendChild(bodyWrap);
    return row;
  }

  /* =========================================================
     Timeline / Experience
     ========================================================= */
  function createTimelineItem(item, index) {
    if (!item) return null;
    const node = el("article", {
      class: "timeline__item",
      dataset: { appear: "", id: safeString(item.id) },
      attrs: { role: "listitem" }
    });

    const meta = el("div", { class: "timeline__meta" });
    meta.appendChild(el("span", { class: "timeline__period", text: dateRange(item.start, item.end) }));
    if (item.type) meta.appendChild(el("span", { class: "timeline__type", text: safeString(item.type) }));
    node.appendChild(meta);

    if (item.role) node.appendChild(el("h3", { class: "timeline__role", text: safeString(item.role) }));
    const company = el("div", { class: "timeline__company" });
    company.appendChild(text(safeString(item.company)));
    if (item.location) company.appendChild(el("span", { class: "timeline__location", text: " \u00b7 " + safeString(item.location) }));
    node.appendChild(company);

    if (item.summary) node.appendChild(el("p", { class: "timeline__summary", text: safeString(item.summary) }));

    if (item.responsibilities && item.responsibilities.length) {
      const ul = el("ul", { class: "timeline__responsibilities" });
      item.responsibilities.forEach((r) => ul.appendChild(el("li", { text: safeString(r) })));
      node.appendChild(ul);
    }

    if (item.technologies && item.technologies.length) {
      const tech = el("div", { class: "timeline__tech" });
      item.technologies.forEach((t) => tech.appendChild(createTag(t)));
      node.appendChild(tech);
    }
    return node;
  }

  /* =========================================================
     Projects / Cases
     ========================================================= */
  function createProjectCase(project, index) {
    if (!project) return null;
    const caseNode = el("article", {
      class: "case",
      dataset: {
        appear: "",
        id: safeString(project.id),
        domain: safeString(project.domain || "Other"),
        featured: project.featured ? "1" : "0"
      },
      attrs: {
        tabindex: "0",
        role: "button",
        "aria-label": "Open project case: " + safeString(project.name)
      }
    });
    if (project.featured) caseNode.classList.add("is-featured");

    const head = el("div", { class: "case__head" });
    head.appendChild(el("span", { class: "case__index", text: "PROJECT / " + String(index + 1).padStart(3, "0") }));
    if (project.status) {
      const status = el("span", { class: "case__status", text: safeString(project.status), attrs: { "data-status": safeString(project.status) } });
      head.appendChild(status);
    }
    caseNode.appendChild(head);

    if (project.domain) {
      caseNode.appendChild(el("div", { class: "case__domain", text: safeString(project.domain) }));
    }
    if (project.name) {
      caseNode.appendChild(el("h3", { class: "case__name", text: safeString(project.name) }));
    }
    if (project.subtitle) {
      caseNode.appendChild(el("div", { class: "case__subtitle", text: safeString(project.subtitle) }));
    }
    if (project.summary) {
      caseNode.appendChild(el("p", { class: "case__summary", text: safeString(project.summary) }));
    }
    if (project.technologies && project.technologies.length) {
      const tech = el("div", { class: "case__tech" });
      project.technologies.forEach((t) => tech.appendChild(createTag(t)));
      caseNode.appendChild(tech);
    }
    const footer = el("div", { class: "case__footer" });
    if (project.securityAreas && project.securityAreas.length) {
      footer.appendChild(el("div", { class: "case__areas", text: safeString(project.securityAreas.slice(0, 2).join(" \u00b7 ")) }));
    }
    const action = el("div", { class: "case__action" });
    action.appendChild(text("View case file"));
    action.appendChild(el("span", { class: "case__action-icon", html: SVG.arrow }));
    footer.appendChild(action);
    caseNode.appendChild(footer);
    return caseNode;
  }

  function createProjectModal(project) {
    if (!project) return null;
    const node = el("article", { class: "modal-case" });

    // Header
    const header = el("header", { class: "modal-case__header" });
    const indexRow = el("div", { class: "modal-case__index" });
    indexRow.appendChild(el("span", { text: "PROJECT " + String(project.id || "").toUpperCase() }));
    const rightSide = el("span", {});
    if (project.status) rightSide.appendChild(text(safeString(project.status) + " \u00b7 "));
    if (project.domain) rightSide.appendChild(text("\u00b7 " + safeString(project.domain)));
    indexRow.appendChild(rightSide);
    header.appendChild(indexRow);
    if (project.name) header.appendChild(el("h2", { class: "modal-case__name", text: safeString(project.name), id: "modalProjectTitle" }));
    if (project.subtitle) header.appendChild(el("div", { class: "modal-case__subtitle", text: safeString(project.subtitle) }));
    if (project.role) {
      const role = el("div", { class: "modal-case__tags" });
      role.appendChild(createTag("Role: " + safeString(project.role), "accent"));
      header.appendChild(role);
    }
    node.appendChild(header);

    // Problem
    if (project.problem) {
      node.appendChild(createModalSection("Problem", [el("p", { class: "modal-case__text", text: safeString(project.problem) })]));
    }
    // Solution
    if (project.solution) {
      node.appendChild(createModalSection("Solution / Approach", [el("p", { class: "modal-case__text", text: safeString(project.solution) })]));
    }
    // Description
    if (project.description) {
      node.appendChild(createModalSection("Overview", [el("p", { class: "modal-case__text", text: safeString(project.description) })]));
    }
    // Features
    if (project.features && project.features.length) {
      const ul = el("ul", { class: "modal-case__list" });
      project.features.forEach((f) => ul.appendChild(el("li", { text: safeString(f) })));
      node.appendChild(createModalSection("Features", [ul]));
    }
    // Highlights
    if (project.highlights && project.highlights.length) {
      const ul = el("ul", { class: "modal-case__list" });
      project.highlights.forEach((h) => ul.appendChild(el("li", { text: safeString(h) })));
      node.appendChild(createModalSection("Highlights", [ul]));
    }
    // Technologies
    if (project.technologies && project.technologies.length) {
      const tec = el("div", { class: "case__tech" });
      project.technologies.forEach((t) => tec.appendChild(createTag(t)));
      node.appendChild(createModalSection("Technology Stack", [tec]));
    }
    // Security areas
    if (project.securityAreas && project.securityAreas.length) {
      const sa = el("div", { class: "case__tech" });
      project.securityAreas.forEach((s) => sa.appendChild(createTag(s, "violet")));
      node.appendChild(createModalSection("Security Concepts", [sa]));
    }
    // Media
    if (project.media && project.media.length) {
      const mediaRow = el("div", { class: "case__tech" });
      project.media.forEach((m) => {
        const btn = createMediaButton(m);
        if (btn) mediaRow.appendChild(btn);
      });
      node.appendChild(createModalSection("Media", [mediaRow]));
    }
    // Actions
    const actions = el("div", { class: "modal-case__actions" });
    if (project.github) {
      actions.appendChild(createLink({
        href: project.github, class: "btn btn--accent", icon: "github", text: "View on GitHub", ariaLabel: "Open GitHub repository"
      }));
    }
    if (project.demo) {
      actions.appendChild(createLink({
        href: project.demo, class: "btn", icon: "external", text: "Live Demo", ariaLabel: "Open live demo"
      }));
    }
    if (!actions.children.length) {
      const note = el("span", { class: "btn btn--ghost", text: "Repository / demo link not provided yet." });
      actions.appendChild(note);
    }
    node.appendChild(actions);
    return node;
  }

  function createModalSection(title, children) {
    const sec = el("section", { class: "modal-case__section" });
    sec.appendChild(el("h3", { class: "modal-case__section-title", text: safeString(title) }));
    children.forEach((c) => c && sec.appendChild(c));
    return sec;
  }

  /* =========================================================
     Media system
     ========================================================= */
  function createMediaButton(media) {
    if (!media || !media.path) return null;
    const type = mediaTypeOf(media);
    const label = media.label || type.charAt(0).toUpperCase() + type.slice(1);
    const btn = el("button", {
      class: "tag tag--accent",
      type: "button",
      attrs: {
        "data-media-type": type,
        "data-media-path": safeString(media.path),
        "data-media-label": safeString(label)
      }
    });
    const icon = (type === "image") ? "image" : (type === "pdf" ? "doc" : "folder");
    if (SVG[icon]) {
      const ic = el("span", { class: "tag__icon", html: SVG[icon] });
      btn.appendChild(ic);
      btn.appendChild(text(" " + label));
    } else {
      btn.textContent = label;
    }
    return btn;
  }

  /* =========================================================
     Skills
     ========================================================= */
  function createSkillGroup(group) {
    if (!group || !group.items || !group.items.length) return null;
    const wrap = el("div", {
      class: "skill-group",
      dataset: { appear: "", category: safeString(group.category) }
    });
    const head = el("div", { class: "skill-group__head" });
    head.appendChild(el("h3", { class: "skill-group__title", text: safeString(group.category) }));
    head.appendChild(el("span", { class: "skill-group__count", text: String(group.items.length) + " items" }));
    wrap.appendChild(head);
    const items = el("div", { class: "skill-group__items" });
    group.items.forEach((it) => {
      let itemNode;
      if (typeof it === "string") {
        itemNode = el("div", { class: "skill-item", text: it });
      } else {
        itemNode = el("div", { class: "skill-item" });
        itemNode.appendChild(el("span", { text: safeString(it.name || it) }));
        if (it.level) {
          itemNode.appendChild(el("span", { class: "skill-item__level", text: safeString(it.level) }));
        }
      }
      itemNode.dataset.skill = safeString((typeof it === "string") ? it : (it.name || ""));
      items.appendChild(itemNode);
    });
    wrap.appendChild(items);
    return wrap;
  }

  /* =========================================================
     Certifications
     ========================================================= */
  function createCertificateItem(cert, index) {
    if (!cert) return null;
    const node = el("div", { class: "cert", dataset: { appear: "", id: safeString(cert.id) } });

    const badge = el("div", { class: "cert__badge", html: SVG.cert });
    node.appendChild(badge);

    const body = el("div", { class: "cert__body" });
    if (cert.name) body.appendChild(el("h3", { class: "cert__name", text: safeString(cert.name) }));
    if (cert.issuer) {
      const issuer = el("div", { class: "cert__issuer", text: safeString(cert.issuer) });
      if (cert.credentialId) issuer.appendChild(text(" \u00b7 " + safeString(cert.credentialId)));
      body.appendChild(issuer);
    }
    node.appendChild(body);

    const meta = el("div", { class: "cert__meta" });
    if (cert.date) meta.appendChild(el("span", { class: "cert__date", text: fmtDate(cert.date) }));
    const linkWrap = el("div");
    linkWrap.style.display = "flex";
    linkWrap.style.gap = "6px";
    if (cert.credentialUrl) {
      const lk = createLink({ href: cert.credentialUrl, class: "cert__link", icon: "external", text: "Credential", ariaLabel: "Open credential" });
      linkWrap.appendChild(lk);
    }
    if (cert.image) {
      const vk = el("button", {
        class: "cert__link",
        attrs: {
          type: "button",
          "data-media-type": mediaTypeOf({ path: cert.image, type: "image" }),
          "data-media-path": safeString(cert.image),
          "data-media-label": "Certificate: " + safeString(cert.name)
        }
      });
      vk.appendChild(el("span", { html: SVG.image }));
      vk.appendChild(text("View"));
      linkWrap.appendChild(vk);
    }
    if (cert.document) {
      const dk = el("button", {
        class: "cert__link",
        attrs: {
          type: "button",
          "data-media-type": mediaTypeOf({ path: cert.document, type: "pdf" }),
          "data-media-path": safeString(cert.document),
          "data-media-label": "Certificate document: " + safeString(cert.name)
        }
      });
      dk.appendChild(el("span", { html: SVG.doc }));
      dk.appendChild(text("Document"));
      linkWrap.appendChild(dk);
    }
    meta.appendChild(linkWrap);
    node.appendChild(meta);

    return node;
  }

  /* =========================================================
     Achievements
     ========================================================= */
  function createAchievementCard(ach) {
    if (!ach) return null;
    const node = el("article", { class: "ach", dataset: { appear: "", id: safeString(ach.id) } });
    const head = el("div", { class: "ach__head" });
    const titleBlock = el("div");
    if (ach.title) titleBlock.appendChild(el("h3", { class: "ach__title", text: safeString(ach.title) }));
    if (ach.organization) titleBlock.appendChild(el("div", { class: "ach__org", text: safeString(ach.organization) + (ach.date ? " \u00b7 " + fmtDate(ach.date) : "") }));
    head.appendChild(titleBlock);
    if (ach.result) head.appendChild(el("span", { class: "ach__result", text: safeString(ach.result) }));
    node.appendChild(head);

    if (ach.description) {
      node.appendChild(el("p", { class: "ach__desc", text: safeString(ach.description) }));
    }
    if (ach.tags && ach.tags.length) {
      const tg = el("div", { class: "ach__tags" });
      ach.tags.forEach((t) => tg.appendChild(createTag(t)));
      node.appendChild(tg);
    }
    if (ach.media && ach.media.length) {
      const row = el("div", { class: "case__tech" });
      ach.media.forEach((m) => {
        const btn = createMediaButton(m);
        if (btn) row.appendChild(btn);
      });
      node.appendChild(row);
    }
    return node;
  }

  /* =========================================================
     Education
     ========================================================= */
  function createEducationItem(eduItem) {
    if (!eduItem) return null;
    const node = el("article", { class: "edu", dataset: { appear: "", id: safeString(eduItem.id) } });
    node.appendChild(el("div", { class: "edu__period", text: dateRange(eduItem.start, eduItem.end) }));

    const body = el("div", {});
    if (eduItem.degree) body.appendChild(el("h3", { class: "edu__degree", text: safeString(eduItem.degree) }));
    if (eduItem.institution) {
      const ins = el("div", { class: "edu__institution", text: safeString(eduItem.institution) });
      if (eduItem.location) ins.appendChild(el("span", { class: "timeline__location", text: " \u00b7 " + safeString(eduItem.location) }));
      body.appendChild(ins);
    }
    if (eduItem.specialisation) {
      body.appendChild(el("div", { class: "edu__institution", text: "Specialisation: " + safeString(eduItem.specialisation) }));
    }
    if (eduItem.notes) {
      const notes = el("div", { class: "edu__notes" });
      notes.appendChild(createTag(eduItem.notes, "accent"));
      body.appendChild(notes);
    }
    node.appendChild(body);

    if (eduItem.score) {
      const sc = el("div", {});
      sc.appendChild(el("div", { class: "edu__score", text: safeString(eduItem.score) }));
      sc.appendChild(el("div", { class: "edu__score-label", text: "Score" }));
      node.appendChild(sc);
    }
    return node;
  }

  /* =========================================================
     Documents
     ========================================================= */
  function createDocumentCard(docItem) {
    if (!docItem || !docItem.path) return null;
    const node = el("a", {
      class: "doc",
      attrs: { href: safeString(docItem.path), target: "_blank", "aria-label": safeString(docItem.label || docItem.path) },
      dataset: { appear: "", id: safeString(docItem.id) }
    });
    node.setAttribute("rel", "noopener noreferrer");
    const ext = extOf(docItem.path);
    const iconName = ext === "pdf" ? "doc" : "folder";
    const icon = el("div", { class: "doc__icon", html: SVG[iconName] || SVG.folder });
    const body = el("div", {});
    body.appendChild(el("div", { class: "doc__label", text: safeString(docItem.label) }));
    if (docItem.description) {
      body.appendChild(el("div", { class: "doc__desc", text: safeString(docItem.description) }));
    }
    const extLabel = el("div", { class: "doc__ext", text: safeString(ext || docItem.type || "file").toUpperCase() });
    const arrow = el("div", { class: "doc__arrow", html: SVG.external });
    node.appendChild(icon);
    node.appendChild(body);
    node.appendChild(extLabel);
    node.appendChild(arrow);
    return node;
  }

  /* =========================================================
     Labs
     ========================================================= */
  function createLabCard(lab) {
    if (!lab) return null;
    const node = el("article", { class: "lab", dataset: { appear: "", id: safeString(lab.id) } });
    if (lab.status) node.appendChild(el("div", { class: "lab__status", text: safeString(lab.status) }));
    if (lab.name) node.appendChild(el("h3", { class: "lab__name", text: safeString(lab.name) }));
    if (lab.type) node.appendChild(el("div", { class: "lab__type", text: safeString(lab.type) }));
    if (lab.description) node.appendChild(el("p", { class: "lab__desc", text: safeString(lab.description) }));
    if (lab.technologies && lab.technologies.length) {
      const tec = el("div", { class: "lab__tech" });
      lab.technologies.forEach((t) => tec.appendChild(createTag(t)));
      node.appendChild(tec);
    }
    if (lab.link) {
      const action = el("a", {
        class: "btn",
        attrs: { href: safeString(lab.link), "aria-label": "Open linked project" }
      });
      action.appendChild(text("Open linked project"));
      action.appendChild(el("span", { html: SVG.arrow }));
      node.appendChild(action);
    }
    return node;
  }

  /* =========================================================
     Navigation
     ========================================================= */
  function createNavIdentity(profile, socials) {
    const wrap = el("div", { class: "nav__identity-inner" });
    const avatar = el("div", { class: "identity__avatar", attrs: { "aria-hidden": "true" } });
    if (profile.profileImage) {
      const img = el("img", { attrs: { src: safeString(profile.profileImage), alt: safeString(profile.name), loading: "lazy" } });
      img.onerror = () => { img.style.display = "none"; };
      avatar.appendChild(img);
      avatar.appendChild(text(safeString(profile.initials || (profile.name || "?").slice(0, 2).toUpperCase())));
    } else {
      avatar.appendChild(text(safeString(profile.initials || (profile.name || "?").slice(0, 2).toUpperCase())));
    }
    wrap.appendChild(avatar);

    if (profile.name) wrap.appendChild(el("div", { class: "identity__name", text: safeString(profile.name) }));
    if (profile.title) wrap.appendChild(el("div", { class: "identity__title", text: safeString(profile.title) }));
    if (profile.location) wrap.appendChild(el("div", { class: "identity__location", text: safeString(profile.location) }));
    if (socials && socials.length) {
      const links = el("div", { class: "nav__links" });
      socials.forEach((s) => {
        const a = el("a", {
          class: "nav__link-social",
          attrs: { href: safeString(s.url), "aria-label": safeString(s.label || s.handle) },
          html: SVG[s.icon || "external"] || SVG.external
        });
        if (isExternalLink(s.url)) a.setAttribute("rel", "noopener noreferrer");
        links.appendChild(a);
      });
      wrap.appendChild(links);
    }
    return wrap;
  }

  function createNavLink(section, index, count) {
    const li = el("li", { class: "nav__item" });
    const a = el("button", {
      class: "nav__link",
      attrs: {
        type: "button",
        "data-section": safeString(section.id),
        "aria-label": "Navigate to " + safeString(section.label)
      }
    });
    a.appendChild(el("span", { class: "nav__index", text: String(index + 1).padStart(2, "0") }));
    a.appendChild(el("span", { class: "nav__label", text: safeString(section.label) }));
    if (count) a.appendChild(el("span", { class: "nav__badge", text: String(count) }));
    li.appendChild(a);
    return li;
  }

  /* =========================================================
     Contact panel
     ========================================================= */
  function createContactPanel(contact, socials) {
    const wrap = el("div", { class: "contact-panel" });
    const headCard = el("div", { class: "contact-card" });
    headCard.appendChild(el("h3", { class: "contact-card__title", text: "Let's connect" }));
    headCard.appendChild(el("p", {
      class: "contact-card__sub",
      text: "Open to SOC analyst opportunities, security collaboration, and technical conversations. Reach out via any of the channels below."
    }));
    const grid = el("div", { class: "contact-card__grid" });
    if (contact && contact.email) {
      grid.appendChild(createContactLink("mail", "Email", contact.email, "mailto:" + encodeURIComponent(contact.email)));
    }
    if (contact && contact.phone) {
      grid.appendChild(createContactLink("phone", "Phone", contact.phone, "tel:" + String(contact.phone).replace(/[^\d+]/g, "")));
    }
    if (contact && contact.location) {
      grid.appendChild(createContactLink("location", "Location", contact.location, null));
    }
    if (socials && socials.length) {
      socials.forEach((s) => {
        const v = s.handle ? "@" + safeString(s.handle) : safeString(s.url);
        grid.appendChild(createContactLink(s.icon || "external", safeString(s.label), v, safeString(s.url)));
      });
    }
    headCard.appendChild(grid);
    wrap.appendChild(headCard);

    if (contact && contact.resume) {
      const note = el("div", { class: "handshake" });
      note.appendChild(text("R\u00e9sum\u00e9 available. See Documents section for downloadable variants."));
      wrap.appendChild(note);
    }
    return wrap;
  }

  function createContactLink(icon, label, value, href) {
    const node = href
      ? el("a", { class: "contact-link", attrs: { href: href } })
      : el("div", { class: "contact-link" });
    if (href && isExternalLink(href)) node.setAttribute("rel", "noopener noreferrer");
    if (href && !/^(mailto|tel):/i.test(href) && !isExternalLink(href)) node.removeAttribute("target");
    const ic = el("div", { class: "contact-link__icon", html: SVG[icon] || SVG.folder });
    const body = el("div", { class: "contact-link__body" });
    body.appendChild(el("div", { class: "contact-link__label", text: safeString(label) }));
    body.appendChild(el("div", { class: "contact-link__value", text: safeString(value) }));

    const copyBtn = el("button", {
      class: "copy-btn",
      type: "button",
      attrs: { "aria-label": "Copy " + safeString(label) },
      text: "COPY",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        copyTextToClipboard(value, label);
      }
    });

    node.appendChild(ic);
    node.appendChild(body);
    node.appendChild(copyBtn);
    return node;
  }

  /* =========================================================
     Command palette items
     ========================================================= */
  function createPaletteItem(item, isActive) {
    const li = el("li", {
      class: "palette__item" + (isActive ? " is-active" : ""),
      attrs: { role: "option", tabindex: "-1", "data-action": safeString(item.action), "data-target": safeString(item.target || ""), "aria-selected": isActive ? "true" : "false" }
    });
    const ic = el("span", { class: "palette__item-icon", html: SVG[item.icon || "arrow"] || SVG.arrow });
    li.appendChild(ic);
    li.appendChild(el("span", { class: "palette__item-title", text: safeString(item.title) }));
    if (item.subtitle) li.appendChild(el("span", { class: "palette__item-sub", text: safeString(item.subtitle) }));
    return li;
  }

  /* =========================================================
     Exports
     ========================================================= */
  global.PComponents = {
    SVG,
    el, text, fragment, chained, svg,
    fmtDate, dateRange, extOf, mediaTypeOf, safeString, isExternalLink,
    createTag, createTagList, createLink, createSocialLink, createStatusPanel,
    createHero, createDossier, createAboutPanel, createObjectivePanel, createFocusPanel,
    createStatsPanel, createContactQuickPanel, createContactQuickRow,
    createTimelineItem,
    createProjectCase, createProjectModal, createModalSection,
    createMediaButton,
    createSkillGroup,
    createCertificateItem,
    createAchievementCard,
    createEducationItem,
    createDocumentCard,
    createLabCard,
    createNavIdentity, createNavLink,
    createContactPanel, createContactLink,
    createPaletteItem
  };
})(window);
