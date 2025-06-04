// This file contains JavaScript functions for managing the projects section, including displaying project details and interactions.

document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projects-container');

    const projects = [
        {
            title: 'Project 1',
            description: 'Description for project 1.',
            link: 'projects/project1.html'
        },
        {
            title: 'Project 2',
            description: 'Description for project 2.',
            link: 'projects/project2.html'
        },
        {
            title: 'Project 3',
            description: 'Description for project 3.',
            link: 'projects/project3.html'
        }
    ];

    function displayProjects() {
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('project');

            const projectTitle = document.createElement('h3');
            projectTitle.textContent = project.title;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = project.description;

            const projectLink = document.createElement('a');
            projectLink.href = project.link;
            projectLink.textContent = 'View Project';
            projectLink.classList.add('project-link');

            projectElement.appendChild(projectTitle);
            projectElement.appendChild(projectDescription);
            projectElement.appendChild(projectLink);
            projectsContainer.appendChild(projectElement);
        });
    }

    displayProjects();
});