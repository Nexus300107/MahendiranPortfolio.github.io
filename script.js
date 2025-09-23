document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('header a[href^="#"]');
    const sections = document.querySelectorAll('main > section');

    function showSection(targetId) {
        const id = targetId.substring(1);
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const targetSection = document.getElementById(id);
        if (targetSection) targetSection.classList.add('active');

        const targetLink = document.querySelector(`header a[href="${targetId}"]`);
        if (targetLink) targetLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
        });
    });

    // Default open About section
    showSection('#about');

    // ---- Load Blogs Dynamically from blogs.json ----
    const blogContainer = document.getElementById('blogs-container');

    fetch('blogs.json')
        .then(response => response.json())
        .then(blogs => {
            blogs.forEach(blog => {
                const card = document.createElement('a');
                card.classList.add('card', 'blog-card');
                card.href = blog.link;
                card.target = "_blank";
                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.description}</p>
                    <span class="card-footer">Read More &rarr;</span>
                `;
                blogContainer.appendChild(card);
            });
        })
        .catch(err => console.error("Failed to load blogs:", err));
});
