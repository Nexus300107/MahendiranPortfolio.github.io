
document.addEventListener('DOMContentLoaded', function () {
    // Select all links in the nav bar that point to an internal section
    const navLinks = document.querySelectorAll('header a[href^="#"]');
    
    // Select all the page sections within the <main> tag
    const sections = document.querySelectorAll('main > section');

    // This function now handles BOTH showing the section AND highlighting the active link
    function showSection(targetId) {
        // Get the actual ID string by removing the '#'
        const id = targetId.substring(1);

        // --- Step 1: Deactivate everything first ---
        // Loop through all sections and remove the 'active' class to hide them
        sections.forEach(section => {
            section.classList.remove('active');
        });
        // Loop through all links and remove the 'active' class to reset their color
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // --- Step 2: Activate the correct section and link ---
        // Find the section we want to show and add the 'active' class
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        // Find the link that corresponds to that section and add the 'active' class
        const targetLink = document.querySelector(`header a[href="${targetId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    // Add a 'click' event listener to each of our navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
        });
    });

    // When the page first loads, activate the #home section and its corresponding link
    showSection('#home');
});
