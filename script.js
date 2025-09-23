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

    // Default open About section instead of Home
    showSection('#about');
});
