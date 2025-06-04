// This file contains the main JavaScript functionality for the website, handling navigation and any interactive elements.

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    // const navLinks = document.querySelectorAll('nav a');
    // navLinks.forEach(link => {
    //     link.addEventListener('click', function(event) {
    //         event.preventDefault();
    //         const targetSection = this.getAttribute('href');
    //         document.querySelector(targetSection).scrollIntoView({ behavior: 'smooth' });
    //     });
    // });

    // Example of a simple interactive element
    const toggleButton = document.getElementById('toggle-menu');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const menu = document.getElementById('nav-menu');
            menu.classList.toggle('active');
        });
    }
});