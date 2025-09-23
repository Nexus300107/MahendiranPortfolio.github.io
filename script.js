// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Get all the links that should control page visibility
    const navLinks = document.querySelectorAll('.nav-right a[href^="#"], .home-link');
    
    // Get all the sections that will be treated as pages
    const pageSections = document.querySelectorAll('.page-section');

    // Function to handle showing the correct section
    function showSection(targetId) {
        // Remove # from the start of the ID
        const cleanTargetId = targetId.replace('#', '');

        // Loop through all sections to hide them
        pageSections.forEach(section => {
            section.classList.remove('active');
        });

        // Loop through all links to remove the active state
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Find and show the target section
        const targetSection = document.getElementById(cleanTargetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Find and highlight the active link
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink && !activeLink.classList.contains('resume-btn')) {
             activeLink.classList.add('active');
        }
    }

    // Add a click event listener to each navigation link
    navLinks.forEach(link => {
        // Check if the link is an internal anchor link
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(event) {
                // Prevent the browser's default jump-to-anchor behavior
                event.preventDefault(); 

                const targetId = this.getAttribute('href');
                showSection(targetId);
            });
        }
    });

    // Initially show the 'home' section when the page loads
    showSection('#home');
});
