// script.js — improved interactions

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menu = document.getElementById('primary-menu');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  // Year in footer
  yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  mobileToggle.addEventListener('click', () => {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!expanded));
    menu.style.display = expanded ? 'none' : 'flex';
    menu.setAttribute('aria-expanded', String(!expanded));
  });

  // Theme toggle with localStorage
  const applyTheme = (isLight) => {
    if (isLight) document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  const saved = localStorage.getItem('site-theme');
  if (saved) {
    applyTheme(saved === 'light');
  } else {
    const prefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight);
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
    applyTheme(isLight);
  });

  // Smooth in-page navigation
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile menu if open
        if (window.innerWidth <= 900 && menu.style.display === 'flex') {
          menu.style.display = 'none';
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Load blogs.json
  fetch('blogs.json')
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById('blogs-container');
      container.innerHTML = '';
      data.forEach((b) => {
        const a = document.createElement('a');
        a.className = 'card';
        a.href = b.link || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `<h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(
          b.description
        )}</p>`;
        container.appendChild(a);
      });
    })
    .catch((err) => {
      console.warn('Could not load blogs.json', err);
    });

  // Load activity.json
  fetch('activity.json')
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById('activity-list');
      container.innerHTML = '';
      data.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'card';
        const date =
          item.date ||
          new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        div.innerHTML = `<h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p class="muted"><strong>Date:</strong> ${date}</p>`;
        if (item.link) {
          div.innerHTML += `<p><a href="${item.link}" target="_blank" rel="noopener">Read more →</a></p>`;
        }
        container.appendChild(div);
      });
    })
    .catch((err) => console.warn('Could not load activity.json', err));

  // Contact: copy email button
  const copyBtn = document.getElementById('contact-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard
        ?.writeText('your.email@example.com')
        .then(() => {
          copyBtn.textContent = 'Copied ✓';
          setTimeout(() => (copyBtn.textContent = 'Copy email'), 2000);
        })
        .catch(() =>
          alert('Copy failed — please select & copy manually')
        );
    });
  }

  // Utility function
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"]/g, (c) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
});
