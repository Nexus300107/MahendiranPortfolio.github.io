document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const menu = document.getElementById('primary-menu');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const themeToggle = document.getElementById('theme-toggle'); // might be null
  const yearEl = document.getElementById('year');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > .section');

  // --- Initialize ---
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile Navigation ---
  if (mobileToggle && menu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      menu.setAttribute('aria-expanded', String(!isExpanded));
    });
  }

  // --- Theme Toggle ---
  const applyTheme = (isLight) => {
    if (isLight) document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme !== null) {
    applyTheme(savedTheme === 'light');
  } else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    });
  }

  // --- Section Switching ---
  const showSection = (sectionId) => {
    sections.forEach(sec => sec.classList.remove('visible'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('visible');

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) link.classList.add('active');
    });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      if (sectionId) {
        showSection(sectionId);
        // Close mobile menu after navigation
        if (mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
          mobileToggle.setAttribute('aria-expanded', 'false');
          if (menu) menu.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Show default section on initial load
  showSection('about');

  // --- Dynamic Content Loading ---
  function loadJsonToContainer(url, containerId, renderItem) {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((data) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        data.forEach(renderItem.bind(null, container));
      })
      .catch((err) => {
        console.warn(`Could not load ${url}`, err);
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = `<p class="muted">Could not load content.</p>`;
      });
  }

  loadJsonToContainer('blogs.json', 'blogs-container', (container, b) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `<h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p>`;
    if (b.link) {
      article.innerHTML += `<p class="read-more"><a href="${b.link}" target="_blank" rel="noopener">Read more →</a></p>`;
    }
    container.appendChild(article);
  });

  loadJsonToContainer('activity.json', 'activity-list', (container, item) => {
    const div = document.createElement('div');
    div.className = 'card';
    const date = item.date || new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    div.innerHTML = `<h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <p class="muted"><strong>Date:</strong> ${date}</p>`;
    if (item.link) {
      div.innerHTML += `<p class="read-more"><a href="${item.link}" target="_blank" rel="noopener">More →</a></p>`;
    }
    container.appendChild(div);
  });

  // --- Contact Form ---
  const copyBtn = document.getElementById('contact-copy');
  const myEmail = 'mahendiran.a@email.com'; // ** IMPORTANT: Change this email **

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(myEmail)
        .then(() => {
          copyBtn.textContent = 'Copied ✓';
          setTimeout(() => (copyBtn.textContent = 'Copy email'), 2000);
        })
        .catch(() => alert('Copy failed — please select & copy manually'));
    });
  }

  // --- Utility ---
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
    );
  }
});
