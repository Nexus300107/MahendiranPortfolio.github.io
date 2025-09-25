document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const menu = document.getElementById('primary-menu');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > .section');

  // --- Initialize ---
  // Year in footer
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile Navigation ---
  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.setAttribute('aria-expanded', String(!isExpanded));
  });

  // --- Theme Toggle ---
  const applyTheme = (isLight) => {
    if (isLight) document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) {
    applyTheme(savedTheme === 'light');
  } else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight);
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
    applyTheme(isLight);
  });
  
  // --- Section Switching ---
  const showSection = (sectionId) => {
    // Hide all sections
    sections.forEach(sec => sec.classList.remove('visible'));

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('visible');
    }

    // Update active state in nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      }
    });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      if (sectionId) {
        showSection(sectionId);
        
        // Close mobile menu after navigation
        if (mobileToggle.getAttribute('aria-expanded') === 'true') {
          mobileToggle.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Show default section on initial load
  showSection('about');

  // --- Dynamic Content Loading ---
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
        a.innerHTML = `<h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p>`;
        container.appendChild(a);
      });
    })
    .catch((err) => console.warn('Could not load blogs.json', err));

  // Load activity.json
  fetch('activity.json')
    .then((r) => r.json())
    .then((data) => {
      const container = document.getElementById('activity-list');
      container.innerHTML = '';
      data.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'card';
        const date = item.date || new Date().toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
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
