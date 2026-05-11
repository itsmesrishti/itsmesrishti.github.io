/* ─────────────────────────────────────────
   Project Data
   Add or edit projects here.
───────────────────────────────────────── */
const projects = [
  {
    tags: ['UI Design', 'Figma', 'AI-Assisted UI'],
    title: 'Olibr — Homepage Redesign',
    desc: 'Designed and implemented a responsive homepage for a job and recruitment platform, combining UI/UX thinking with frontend execution and AI-assisted workflows.',
    link: 'https://olibr.com',
    page: '/project/olibr-homepage.html',
    placeholder: 'Olibr — Job Platform UI',
    img: '/assets/images/olibr-homepage.png',
    video: '/assets/videos/olibr-homepage.mp4'
  },
  {
    tags: ['UI Design', 'AI-Assisted UI'],
    title: 'Olibr — Onboarding Flow',
    desc: 'Designed the registration and onboarding experience for job seekers. Split-screen layout with contextual illustration to reduce drop-off at sign-up.',
    link: 'https://olibr.com',
    page: '/project/olibr-onboarding.html',
    placeholder: 'Olibr — Onboarding Flow',
    img: '/assets/images/olibr-onboarding.png',
    video: '/assets/videos/olibr-onboarding-flow.mp4'
  },
];


/* ─────────────────────────────────────────
   Resolve media for a project card.
   Priority: video → img → placeholder
───────────────────────────────────────── */
function getMediaHTML(project) {
  if (project.video) {
    return `<video
      src="${project.video}"
      autoplay
      loop
      muted
      playsinline
      width="100%"
      poster="${project.img || ''}"
    ></video>`;
  }
  if (project.img) {
    return `<img
      src="${project.img}"
      alt="${project.title}"
      onerror="this.parentElement.innerHTML='<div class=work-placeholder>${project.placeholder}</div>'"
    >`;
  }
  return `<div class="work-placeholder">${project.placeholder}</div>`;
}


/* ─────────────────────────────────────────
   Build a single work card HTML string
───────────────────────────────────────── */
function buildWorkCard(project) {
  const tagsHTML = project.tags
    .map(t => `<button class="tag" data-tag="${t}">${t}</button>`)
    .join('');

  const mediaHTML = getMediaHTML(project);

  // Wrap entire card in anchor if project page exists
  const cardInner = `
    <div class="work-image">${mediaHTML}</div>
    <div class="work-info">
      <div class="work-meta">
        <div class="work-tags">${tagsHTML}</div>
        <div class="work-title">${project.title}</div>
        <p class="work-desc">${project.desc}</p>
      </div>
      ${project.link ? `<a href="${project.link}" target="_blank" class="work-link" onclick="event.stopPropagation()">View Live ↗</a>` : ''}
    </div>`;

  return `
    <div class="work-item" ${project.page ? `data-page="${project.page}"` : ''}>
      ${cardInner}
    </div>`;
}


/* ─────────────────────────────────────────
   Render main work grid
───────────────────────────────────────── */
function renderMainGrid() {
  const grid = document.getElementById('main-work-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(buildWorkCard).join('');

  // Card click → project page
  grid.querySelectorAll('.work-item[data-page]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = card.dataset.page;
    });
  });

  // Tag click listeners
  grid.querySelectorAll('.tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openTagFilter(btn.dataset.tag);
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  grid.querySelectorAll('.work-item').forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   Tag Filter Overlay
───────────────────────────────────────── */
function openTagFilter(tag) {
  const matched = projects.filter(p => p.tags.includes(tag));

  document.getElementById('filter-tag-label').textContent = tag;
  document.getElementById('filter-heading').textContent =
    matched.length > 0 ? `Projects tagged "${tag}"` : `No projects tagged "${tag}"`;
  document.getElementById('filter-count').textContent =
    matched.length === 1 ? '1 project' : `${matched.length} projects`;

  const results = document.getElementById('filter-results');

  if (matched.length > 0) {
    results.innerHTML = matched.map(buildWorkCard).join('');
    results.querySelectorAll('.work-item').forEach(el => el.classList.add('visible'));

    // Card click inside filter
    results.querySelectorAll('.work-item[data-page]').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = card.dataset.page;
      });
    });

    results.querySelectorAll('.tag').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTagFilter(btn.dataset.tag);
      });
    });
  } else {
    results.innerHTML = `<p class="filter-empty">No matching projects yet.</p>`;
  }

  const overlay = document.getElementById('filter-overlay');
  overlay.classList.add('active');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeTagFilter() {
  const overlay = document.getElementById('filter-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}


/* ─────────────────────────────────────────
   Nav scroll effect
   Works for both <nav id="nav"> (index)
   and <div id="nav-wrapper"> (project pages)
───────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav') || document.getElementById('nav-wrapper');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* ─────────────────────────────────────────
   Project page scroll reveal
───────────────────────────────────────── */
function initProjectReveal() {
  const revealEls = document.querySelectorAll('.process-card, .decision-card, .screenshot-item');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   Event Listeners
───────────────────────────────────────── */
const filterCloseBtn = document.getElementById('filter-close-btn');
if (filterCloseBtn) filterCloseBtn.addEventListener('click', closeTagFilter);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTagFilter();
});


/* ─────────────────────────────────────────
   Init
───────────────────────────────────────── */
initNav();
renderMainGrid();
initProjectReveal();
