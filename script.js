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
    placeholder: 'Olibr — Job Platform UI',
    img: '/assets/images/olibr-homepage.png',
    video: '/assets/videos/olibr-homepage.mp4'
  },
  {
    tags: ['UI Design', 'Figma', 'AI-Assisted UI'],
    title: 'Olibr — Job Platform',
    desc: 'Designed the job search interface and card components for a hiring platform. Focused on information hierarchy and scanability — making it fast for candidates to assess roles at a glance.',
    link: 'https://test.olibr.com',
    placeholder: 'Olibr — Job Platform UI',
    img: 'olibr-jobs.png',
    video: null
  },
  {
    tags: ['UI/UX', 'Figma', 'AI-Assisted UI'],
    title: 'Olibr — Onboarding Flow',
    desc: 'Designed the registration and onboarding experience for both job seekers and recruiters. Split-screen layout with contextual illustration to reduce drop-off at sign-up.',
    link: 'https://test.olibr.com',
    placeholder: 'Olibr — Onboarding Flow',
    img: null,
    video: null
  },
  {
    tags: ['UI Design', 'Figma'],
    title: 'Analytics Dashboard',
    desc: 'Designed a data-heavy analytics dashboard with a focus on clarity — turning complex metrics into scannable, actionable insights for non-technical stakeholders.',
    link: '#',
    placeholder: 'Analytics Dashboard',
    img: null,
    video: null
    // To add a video: video: '/assets/videos/analytics-demo.mp4'
  },
  {
    tags: ['UI/UX', 'Figma', 'AI-Assisted UI'],
    title: 'Mobile App Redesign',
    desc: 'End-to-end redesign of a consumer mobile app. Rebuilt the information architecture, streamlined core user flows, and created a cohesive component library in Figma.',
    link: '#',
    placeholder: 'Mobile App Redesign',
    img: null,
    video: null
    // To add a video: video: '/assets/videos/mobile-app-demo.mp4'
  }
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
      thumbnail="${project.img || ''}"
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

  return `
    <div class="work-item">
      <div class="work-image">${mediaHTML}</div>
      <div class="work-info">
        <div class="work-meta">
          <div class="work-tags">${tagsHTML}</div>
          <div class="work-title">${project.title}</div>
          <p class="work-desc">${project.desc}</p>
        </div>
        <a href="${project.link}" target="_blank" class="work-link">View Live ↗</a>
      </div>
    </div>`;
}


/* ─────────────────────────────────────────
   Render main work grid
───────────────────────────────────────── */
function renderMainGrid() {
  const grid = document.getElementById('main-work-grid');
  grid.innerHTML = projects.map(buildWorkCard).join('');

  // Attach tag click listeners
  grid.querySelectorAll('.tag').forEach(btn => {
    btn.addEventListener('click', () => openTagFilter(btn.dataset.tag));
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
    // Make all cards immediately visible in filter view
    results.querySelectorAll('.work-item').forEach(el => el.classList.add('visible'));
    // Re-attach tag listeners inside filter results
    results.querySelectorAll('.tag').forEach(btn => {
      btn.addEventListener('click', () => openTagFilter(btn.dataset.tag));
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
  document.getElementById('filter-overlay').classList.remove('active');
  document.body.style.overflow = '';
}


/* ─────────────────────────────────────────
   Nav scroll effect
───────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* ─────────────────────────────────────────
   Event Listeners
───────────────────────────────────────── */
document.getElementById('filter-close-btn').addEventListener('click', closeTagFilter);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTagFilter();
});


/* ─────────────────────────────────────────
   Init
───────────────────────────────────────── */
initNav();
renderMainGrid();