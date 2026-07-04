/**
 * ESWARAN S — SOC ANALYST PORTFOLIO
 * script.js — All rendering driven by data.json
 *
 * Modules:
 *  1. Data Loader
 *  2. Navbar (clock, scroll, mobile)
 *  3. Hero Canvas (network nodes)
 *  4. Hero Section
 *  5. Typing Animation
 *  6. About Section
 *  7. Skills Section
 *  8. Projects Section
 *  9. Experience Section
 * 10. Education Section
 * 11. Certifications Section
 * 12. Achievements Section
 * 13. Tools Section
 * 14. Contact Section
 * 15. Footer
 * 16. Cert Modal
 * 17. Scroll Reveal
 * 18. Animated Counters
 * 19. Back to Top
 * 20. Active Nav Highlight
 */

// ================================================================
// 1. DATA LOADER — fetch data.json and boot the app
// ================================================================
async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json not found');
    const data = await res.json();
    bootApp(data);
  } catch (err) {
    console.error('[Portfolio] Failed to load data.json:', err);
    document.body.innerHTML =
      `<div style="color:#FF4D6A;font-family:monospace;padding:40px;">
        ERROR: Could not load data.json<br>${err.message}
      </div>`;
  }
}

// ================================================================
// 2. NAVBAR MODULE
// ================================================================
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  // Live clock
  function updateClock() {
    const el = document.getElementById('nav-clock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Scroll state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });

  // Close mobile on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ================================================================
// 3. HERO CANVAS — animated network/node background
// ================================================================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let nodes = [];
  const NODE_COUNT = 55;
  const MAX_DIST   = 130;
  let W, H, raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    };
  }

  function build() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, mkNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 229, 204, ${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 204, 0.55)';
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  build();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    build();
    draw();
  });
}

// ================================================================
// 4. HERO SECTION RENDERER
// ================================================================
function renderHero(data) {
  const { hero } = data;

  // Status badge
  const badge = document.getElementById('hero-status-badge');
  if (badge) {
    badge.textContent = hero.statusBadge;
    if (hero.statusType === 'available') badge.style.borderColor = 'var(--status-active)';
  }

  // Name
  const nameEl = document.getElementById('hero-name');
  if (nameEl) {
    const [first, ...rest] = hero.name.split(' ');
    nameEl.innerHTML = `${first} <span class="name-accent">${rest.join(' ')}</span>`;
  }

  // Tagline
  const tagEl = document.getElementById('hero-tagline');
  if (tagEl) tagEl.textContent = hero.tagline;

  // CTA buttons
  const ctaEl = document.getElementById('hero-cta');
  if (ctaEl && hero.cta) {
    ctaEl.innerHTML = `
      <a href="${hero.cta.primary.href}" class="btn btn-primary">${hero.cta.primary.label}</a>
      <a href="${hero.cta.secondary.href}" class="btn btn-secondary" download="${hero.resume?.filename || ''}">${hero.cta.secondary.label}</a>
    `;
  }

  // Metrics
  const metricsEl = document.getElementById('hero-metrics');
  if (metricsEl && hero.metrics) {
    metricsEl.innerHTML = hero.metrics.map(m => `
      <div class="metric-block">
        <div class="metric-value" data-target="${parseFloat(m.value)}" data-decimal="${m.value.includes('.') ? 2 : 0}">
          ${m.value}${m.suffix}
        </div>
        <div class="metric-label">${m.label}</div>
      </div>
    `).join('');
  }
}

// ================================================================
// 5. TYPING ANIMATION
// ================================================================
function initTyping(lines) {
  const el = document.getElementById('hero-typing');
  if (!el || !lines || !lines.length) return;

  let lineIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const PAUSE  = 1800;
  const TYPE_SPEED = 75;
  const DEL_SPEED  = 40;

  function type() {
    const current = lines[lineIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; requestAnimationFrame(loop); }, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        lineIdx  = (lineIdx + 1) % lines.length;
      }
    }
  }

  let lastTime = 0;
  function loop(ts) {
    const speed = deleting ? DEL_SPEED : TYPE_SPEED;
    if (ts - lastTime >= speed) {
      lastTime = ts;
      type();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ================================================================
// 6. ABOUT SECTION
// ================================================================
function renderAbout(data) {
  const { about } = data;

  // Terminal window
  const terminal = document.getElementById('about-terminal');
  if (terminal && about.paragraphs) {
    terminal.innerHTML = `
      <div class="t-line">
        <span class="t-prompt">$</span>
        <span class="t-cmd">cat about.txt</span>
      </div>
      ${about.paragraphs.map(p => `<div class="t-out">${p}</div>`).join('')}
      <div class="t-line" style="margin-top:10px;">
        <span class="t-prompt">$</span>
        <span class="cursor-blink" style="color:var(--accent-cyan);">▮</span>
      </div>
    `;
  }

  // Quick stats
  const statsEl = document.getElementById('about-stats');
  if (statsEl && about.quickStats) {
    statsEl.innerHTML = about.quickStats.map(s => `
      <div class="stat-card reveal">
        <span class="stat-icon">${s.icon}</span>
        <div class="stat-body">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value">${s.value}</div>
        </div>
      </div>
    `).join('');
  }
}

// ================================================================
// 7. SKILLS SECTION
// ================================================================
function renderSkills(data) {
  const grid = document.getElementById('skills-grid');
  if (!grid || !data.skills?.categories) return;

  grid.innerHTML = data.skills.categories.map(cat => `
    <div class="skill-card reveal">
      <div class="skill-header">
        <span class="skill-icon">${cat.icon}</span>
        <span class="skill-cat-name">${cat.label}</span>
      </div>
      <div class="tags-wrap">
        ${cat.items.map(item => `<span class="tag">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ================================================================
// 8. PROJECTS SECTION
// ================================================================
function renderProjects(data) {
  const grid = document.getElementById('projects-grid');
  if (!grid || !data.projects) return;

  grid.innerHTML = data.projects.map(p => {
    const statusClass = p.status === 'ongoing' ? 'status-ongoing' : 'status-completed';
    const statusLabel = p.status === 'ongoing' ? '● Ongoing' : '✓ Completed';
    const featuredBadge = p.featured ? `<span class="featured-badge">★ Featured</span>` : '';

    const githubLink = p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>` : '';
    const liveLink   = p.liveLink ? `<a href="${p.liveLink}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>` : '';

    return `
      <article class="project-card reveal" aria-label="${p.title}">
        <div class="project-top">
          <h3 class="project-title">${p.title}${featuredBadge}</h3>
          <span class="status-pill ${statusClass}">${statusLabel}</span>
        </div>
        <div class="project-category">${p.category}</div>
        <p class="project-desc">${p.shortDescription}</p>
        <ul class="project-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="project-stack">
          ${p.techStack.map(t => `<span class="stack-chip">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${githubLink}${liveLink}
        </div>
      </article>
    `;
  }).join('');
}

// ================================================================
// 9. EXPERIENCE SECTION
// ================================================================
function renderExperience(data) {
  const list = document.getElementById('experience-list');
  if (!list || !data.experience) return;

  list.innerHTML = data.experience.map(exp => `
    <div class="exp-item reveal ${exp.current ? 'current' : ''}">
      <div class="exp-header">
        <span class="exp-role">${exp.role}</span>
        <span class="exp-company">@ ${exp.company}</span>
        <span class="exp-type-badge">${exp.type}</span>
        ${exp.current ? '<span class="exp-current-badge">Current</span>' : ''}
      </div>
      <div class="exp-meta">
        <span class="exp-dur">${exp.duration}</span>
        <span>${exp.location}</span>
      </div>
      <ul class="exp-highlights">
        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ================================================================
// 10. EDUCATION SECTION
// ================================================================
function renderEducation(data) {
  const list = document.getElementById('education-list');
  if (!list || !data.education) return;

  list.innerHTML = data.education.map(edu => `
    <div class="edu-card reveal ${edu.status === 'current' ? 'current' : ''}">
      <div class="edu-left">
        <div class="edu-institution">${edu.institution}</div>
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-spec">${edu.specialisation}</div>
        ${edu.extras ? `
          <div class="edu-extras">
            ${edu.extras.map(e => `<span class="edu-extra-badge">${e}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <div class="edu-right">
        <div class="edu-score">${edu.score}</div>
        <div class="edu-duration">${edu.duration}</div>
        ${edu.status === 'current' ? '<div class="edu-status">Current</div>' : ''}
      </div>
    </div>
  `).join('');
}

// ================================================================
// 11. CERTIFICATIONS SECTION
// ================================================================
function renderCertifications(data) {
  const grid = document.getElementById('certs-grid');
  if (!grid || !data.certifications) return;

  const colorMap = {
    green: 'rgba(0,229,204,0.08)',
    blue:  'rgba(77,158,255,0.08)',
    yellow:'rgba(240,192,64,0.08)',
    cyan:  'rgba(0,229,204,0.06)',
    purple:'rgba(167,139,250,0.08)',
  };

  grid.innerHTML = data.certifications.map(cert => {
    const bg = colorMap[cert.color] || colorMap.green;
    const viewBtn = `<button class="cert-btn view-btn" onclick="openCertModal('${cert.id}')" aria-label="View ${cert.name}">👁 View</button>`;
    const dlBtn   = cert.pdf ? `<a href="${cert.pdf}" download class="cert-btn" aria-label="Download ${cert.name}">⬇ Download</a>` : '';
    const verBtn  = cert.verifyUrl ? `<a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer" class="cert-btn" aria-label="Verify ${cert.name}">✓ Verify</a>` : '';

    return `
      <article class="cert-card reveal" data-cert-id="${cert.id}" aria-label="${cert.name}">
        <div class="cert-card-top" style="background:${bg};">
          <span class="cert-card-top-overlay">🏆</span>
        </div>
        <div class="cert-card-body">
          <div class="cert-name">${cert.name}</div>
          <div class="cert-issuer-date">
            <span>${cert.issuer}</span>
            <span>${cert.date}</span>
          </div>
          <span class="cert-type-badge ${cert.type}">${cert.type}</span>
          <div class="cert-actions">
            ${viewBtn}
            ${dlBtn}
            ${verBtn}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ================================================================
// 12. ACHIEVEMENTS SECTION
// ================================================================
function renderAchievements(data) {
  const grid = document.getElementById('achievements-grid');
  if (!grid || !data.achievements) return;

  grid.innerHTML = data.achievements.map(a => `
    <article class="achieve-card reveal" aria-label="${a.title}">
      <div class="achieve-top">
        <span class="achieve-icon">${a.icon}</span>
        <span class="achieve-tag">${a.tag}</span>
        ${a.rank ? `<span class="achieve-rank">${a.rank}</span>` : ''}
      </div>
      <h3 class="achieve-title">${a.title}</h3>
      <p class="achieve-detail">${a.detail}</p>
    </article>
  `).join('');
}

// ================================================================
// 13. TOOLS SECTION
// ================================================================
function renderTools(data) {
  const container = document.getElementById('tools-container');
  if (!container || !data.tools) return;

  const categories = [...new Set(data.tools.map(t => t.category))];

  // Filter buttons
  const catBtns = document.createElement('div');
  catBtns.className = 'tools-categories';
  catBtns.innerHTML = `
    <button class="tool-category-btn active" data-cat="All">All</button>
    ${categories.map(c => `<button class="tool-category-btn" data-cat="${c}">${c}</button>`).join('')}
  `;

  // Pills cloud
  const cloud = document.createElement('div');
  cloud.className = 'tools-cloud';
  cloud.id = 'tools-cloud';
  cloud.innerHTML = data.tools.map(t => `
    <div class="tool-pill reveal" data-cat="${t.category}">
      <span>${t.name}</span>
      <span class="tool-cat-label">${t.category}</span>
    </div>
  `).join('');

  container.appendChild(catBtns);
  container.appendChild(cloud);

  // Filter logic
  catBtns.addEventListener('click', (e) => {
    const btn = e.target.closest('.tool-category-btn');
    if (!btn) return;

    catBtns.querySelectorAll('.tool-category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const sel = btn.dataset.cat;
    document.querySelectorAll('.tool-pill').forEach(pill => {
      pill.classList.toggle('hidden', sel !== 'All' && pill.dataset.cat !== sel);
    });
  });
}

// ================================================================
// 14. CONTACT SECTION
// ================================================================
function renderContact(data) {
  const layout = document.getElementById('contact-layout');
  if (!layout || !data.contact) return;

  const { contact, resume } = data;

  const iconMap = {
    linkedin:  '💼',
    github:    '🐙',
    tryhackme: '🔰',
  };

  layout.innerHTML = `
    <div class="contact-info reveal">
      <h3 class="contact-headline">Let's Connect</h3>
      <p class="contact-intro">
        I'm actively seeking L1 SOC Analyst opportunities. Whether you have a role, a question, or want to
        discuss threat detection and blue team operations — reach out.
      </p>
      <div class="contact-items">
        <a href="mailto:${contact.email}" class="contact-item" aria-label="Send email">
          <div class="contact-item-icon">✉️</div>
          <div>
            <div class="contact-item-label">Email</div>
            <div class="contact-item-value">${contact.email}</div>
          </div>
        </a>
        <a href="tel:${contact.phone.replace(/[^+\d]/g, '')}" class="contact-item" aria-label="Call phone">
          <div class="contact-item-icon">📱</div>
          <div>
            <div class="contact-item-label">Phone</div>
            <div class="contact-item-value">${contact.phone}</div>
          </div>
        </a>
        <div class="contact-item" style="cursor:default;">
          <div class="contact-item-icon">📍</div>
          <div>
            <div class="contact-item-label">Location</div>
            <div class="contact-item-value">${contact.location}</div>
          </div>
        </div>
        <div class="contact-item" style="cursor:default;border-color:rgba(0,229,204,0.25);">
          <div class="contact-item-icon">🟢</div>
          <div>
            <div class="contact-item-label">Status</div>
            <div class="contact-item-value" style="color:var(--status-active);">${contact.availability}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-resume-panel reveal">
      <div class="resume-card">
        <div class="resume-icon">📄</div>
        <div class="resume-title">Resume</div>
        <p class="resume-desc">
          Download my latest resume tailored for SOC L1 Analyst roles, covering SIEM experience, threat detection skills, and CTF achievements.
        </p>
        <a href="${resume?.path || '#'}" class="resume-download-btn" download="${resume?.filename || 'Eswaran_S_Resume.pdf'}">
          ⬇ Download Resume
        </a>

        <div class="social-links" style="margin-top:20px;">
          ${contact.links.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${link.label}">
              <div class="social-link-left">
                <span>${iconMap[link.icon] || '🔗'}</span>
                <div>
                  <div class="social-label">${link.label}</div>
                  <div class="social-handle">${link.handle}</div>
                </div>
              </div>
              <span class="social-arrow">→</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ================================================================
// 15. FOOTER
// ================================================================
function renderFooter(data) {
  const { footer } = data;
  const creditEl  = document.getElementById('footer-credit');
  const taglineEl = document.getElementById('footer-tagline');
  const yearEl    = document.getElementById('footer-year');

  if (creditEl)  creditEl.textContent  = `© ${footer.year} ${footer.credit}`;
  if (taglineEl) taglineEl.textContent = footer.tagline;
  if (yearEl)    yearEl.textContent    = `Built with ♥ in Chennai`;
}

// ================================================================
// 16. CERT MODAL
// ================================================================
let currentCertData = null;

function openCertModal(certId) {
  if (!currentCertData) return;
  const cert = currentCertData.find(c => c.id === certId);
  if (!cert) return;

  const modal = document.getElementById('cert-modal');
  const titleEl = document.getElementById('modal-cert-title');
  const nameEl  = document.getElementById('cert-placeholder-name');
  const issuerEl= document.getElementById('cert-placeholder-issuer');
  const dateEl  = document.getElementById('cert-placeholder-date');
  const imgEl   = document.getElementById('modal-cert-img');
  const footer  = document.getElementById('modal-footer');

  if (titleEl)  titleEl.textContent  = cert.name;
  if (nameEl)   nameEl.textContent   = cert.name;
  if (issuerEl) issuerEl.textContent = cert.issuer;
  if (dateEl)   dateEl.textContent   = cert.date;

  // Try loading image
  const hasImage = cert.thumbnail && cert.thumbnail !== '';
  if (imgEl && hasImage) {
    imgEl.src = cert.thumbnail;
    imgEl.alt = cert.name;
    imgEl.style.display = 'block';
    imgEl.style.width   = '100%';
    imgEl.style.borderRadius = 'var(--radius)';
    const placeholder = document.getElementById('cert-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    };
  }

  // Footer buttons
  if (footer) {
    const dlBtn  = cert.pdf       ? `<a href="${cert.pdf}" download class="btn btn-primary">⬇ Download</a>` : '';
    const verBtn = cert.verifyUrl ? `<a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">✓ Verify</a>` : '';
    footer.innerHTML = dlBtn + verBtn;
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('cert-modal');
  if (modal) modal.hidden = true;
  document.body.style.overflow = '';

  // Reset image on close
  const imgEl = document.getElementById('modal-cert-img');
  const placeholder = document.getElementById('cert-placeholder');
  if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
  if (placeholder) placeholder.style.display = 'flex';
}

function initModal() {
  const closeBtn  = document.getElementById('modal-close');
  const backdrop  = document.getElementById('modal-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeCertModal);
  if (backdrop) backdrop.addEventListener('click', closeCertModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertModal();
  });
}

// ================================================================
// 17. SCROLL REVEAL
// ================================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function observeAll() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Initial pass
  observeAll();

  // Re-observe after dynamic renders
  const config = { childList: true, subtree: true };
  const mutObs = new MutationObserver(observeAll);
  mutObs.observe(document.body, config);
}

// ================================================================
// 18. ANIMATED COUNTERS
// ================================================================
function animateCounters() {
  const counters = document.querySelectorAll('.metric-value[data-target]');
  counters.forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || '0');
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const val = target * ease;
      el.textContent = decimal > 0 ? val.toFixed(decimal) : Math.floor(val).toString();
      if (progress < 1) requestAnimationFrame(update);
    }

    // Trigger when section enters viewport
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          requestAnimationFrame(update);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

// ================================================================
// 19. BACK TO TOP
// ================================================================
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================================
// 20. ACTIVE NAV HIGHLIGHT
// ================================================================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 80;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ================================================================
// BOOT — wires everything together after data loads
// ================================================================
function bootApp(data) {
  // Store cert data for modal access
  currentCertData = data.certifications;

  // Page metadata
  if (data.meta) {
    document.title = data.meta.siteTitle;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && data.meta.seoDescription) descMeta.content = data.meta.seoDescription;
  }

  // Render sections
  renderHero(data);
  renderAbout(data);
  renderSkills(data);
  renderProjects(data);
  renderExperience(data);
  renderEducation(data);
  renderCertifications(data);
  renderAchievements(data);
  renderTools(data);
  renderContact(data);
  renderFooter(data);

  // Init behaviours (after DOM is populated)
  initNavbar();
  initHeroCanvas();
  initTyping(data.hero.typingLines);
  initModal();
  initScrollReveal();
  animateCounters();
  initBackToTop();

  // Initial scroll check
  updateActiveNav();
  toggleBackToTop();

  console.log('%c[Eswaran S Portfolio] Loaded ✓', 'color:#00E5CC;font-family:monospace;font-weight:700;');
}

// ================================================================
// ENTRY POINT
// ================================================================
document.addEventListener('DOMContentLoaded', loadData);
