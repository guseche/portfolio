// Dynamic Projects Loader with Modal System
class ProjectsManager {
    constructor() {
        this.projects = null;
        this.currentLanguage = 'es';
        this.currentModal = null;
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
    }

    async loadProjects() {
        try {
            const response = await fetch('./src/data/projects.json');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    setupEventListeners() {
        // Language switcher (if exists)
        const languageSwitcher = document.querySelector('[data-language-switcher]');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.renderProjects();
            });
        }

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    renderProjects() {
        if (!this.projects) return;

        this.renderLatestProjects();
        this.renderAutomationProjects();
        this.renderDevelopmentProjects();
    }

    renderLatestProjects() {
        const container = document.querySelector('#latest-projects .grid');
        if (!container) return;

        // Get latest 3 projects (mix of automation and development)
        const allProjects = [...this.projects.automation, ...this.projects.development];
        const latestProjects = allProjects
            .sort((a, b) => parseInt(b.year) - parseInt(a.year))
            .slice(0, 3);

        container.innerHTML = latestProjects.map(project => this.createProjectCard(project, 'large')).join('');
    }

    renderAutomationProjects() {
        const container = document.querySelector('#automation-projects .grid');
        if (!container) return;

        container.innerHTML = this.projects.automation
            .map(project => this.createProjectCard(project, 'small'))
            .join('');
    }

    renderDevelopmentProjects() {
        const container = document.querySelector('#development-projects .grid');
        if (!container) return;

        container.innerHTML = this.projects.development
            .map(project => this.createProjectCard(project, 'small'))
            .join('');
    }

    createProjectCard(project, size = 'small') {
        const title = project.title[this.currentLanguage];
        const description = project.description[this.currentLanguage];
        const isLarge = size === 'large';
        
        const statusColors = {
            pass: 'bg-green-600',
            fail: 'bg-red-600',
            deploy: 'bg-orange-600',
            development: 'bg-blue-600'
        };

        const typeColors = {
            automation: 'bg-green-600',
            development: 'bg-purple-600'
        };

        const hoverColors = {
            automation: 'hover:border-green-500',
            development: 'hover:border-purple-500'
        };

        return `
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 ${hoverColors[project.type]} transition-all duration-300 cursor-pointer project-card" 
                 data-project-id="${project.id}" onclick="projectsManager.openModal('${project.id}')">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl">${project.emoji}</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-gray-400">${project.year}</span>
                        ${project.status ? `<span class="text-xs font-semibold text-green-400">${project.status}</span>` : ''}
                    </div>
                </div>
                <h3 class="${isLarge ? 'text-xl' : 'text-lg'} font-semibold mb-3 text-white">${title}</h3>
                <p class="text-gray-400 ${isLarge ? 'mb-4' : 'text-sm mb-4'}">${description}</p>
                <div class="flex justify-between items-center">
                    <span class="${typeColors[project.type]} text-white px-3 py-1 rounded-full text-xs">
                        ${project.type === 'automation' ? 'Automatización' : 'Desarrollo'}
                    </span>
                    ${project.status ? `<span class="${statusColors[project.status]} text-white px-3 py-1 rounded-full text-xs">${project.status}</span>` : ''}
                </div>
                ${project.technologies ? `
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${project.technologies.slice(0, 3).map(tech => 
                            `<span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">${tech}</span>`
                        ).join('')}
                        ${project.technologies.length > 3 ? `<span class="text-gray-500 text-xs">+${project.technologies.length - 3}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    openModal(projectId) {
        const allProjects = [...this.projects.automation, ...this.projects.development];
        const project = allProjects.find(p => p.id === projectId);
        
        if (!project) return;

        const modalHTML = this.createModalHTML(project);
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modalOverlay.innerHTML = modalHTML;
        
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
        
        this.currentModal = modalOverlay;
        
        // Animate modal in
        setTimeout(() => {
            modalOverlay.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    createModalHTML(project) {
        const title = project.title[this.currentLanguage];
        const description = project.detailedDescription[this.currentLanguage];
        const features = project.features[this.currentLanguage];
        
        return `
            <div class="modal-content bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 transition-all duration-300">
                <div class="modal-header bg-gray-800 p-6 rounded-t-lg border-b border-gray-700">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-4">
                            <span class="text-4xl">${project.emoji}</span>
                            <div>
                                <h2 class="text-2xl font-bold text-white">${title}</h2>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="bg-${project.type === 'automation' ? 'green' : 'purple'}-600 text-white px-3 py-1 rounded-full text-sm">
                                        ${project.type === 'automation' ? 'Automatización' : 'Desarrollo'}
                                    </span>
                                    <span class="text-gray-400 text-sm">${project.year}</span>
                                    ${project.status ? `<span class="bg-green-600 text-white px-2 py-1 rounded text-xs">${project.status}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <button onclick="projectsManager.closeModal()" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="modal-body p-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-3">Descripción</h3>
                            <p class="text-gray-300 leading-relaxed mb-6">${description}</p>
                            
                            ${features && features.length > 0 ? `
                                <h3 class="text-lg font-semibold text-white mb-3">Características</h3>
                                <ul class="space-y-2 mb-6">
                                    ${features.map(feature => `
                                        <li class="flex items-start gap-2 text-gray-300">
                                            <span class="text-green-400 mt-1">✓</span>
                                            <span>${feature}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                            
                            <h3 class="text-lg font-semibold text-white mb-3">Tecnologías</h3>
                            <div class="flex flex-wrap gap-2 mb-6">
                                ${project.technologies.map(tech => `
                                    <span class="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div>
                            ${project.screenshot ? `
                                <h3 class="text-lg font-semibold text-white mb-3">Vista previa</h3>
                                <img src="${project.screenshot}" alt="${title}" class="w-full rounded-lg border border-gray-700 mb-6">
                            ` : ''}
                            
                            <h3 class="text-lg font-semibold text-white mb-3">Enlaces</h3>
                            <div class="space-y-3">
                                ${project.github ? `
                                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" 
                                       class="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        <span class="text-white">Ver código en GitHub</span>
                                    </a>
                                ` : ''}
                                
                                ${project.demo ? `
                                    <a href="${project.demo}" target="_blank" rel="noopener noreferrer" 
                                       class="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                        <span class="text-white">Ver demo en vivo</span>
                                    </a>
                                ` : ''}
                                
                                ${project.download ? `
                                    <a href="${project.download}" target="_blank" rel="noopener noreferrer" 
                                       class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <span class="text-white">Descargar</span>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    closeModal() {
        if (!this.currentModal) return;

        const modalContent = this.currentModal.querySelector('.modal-content');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            document.body.removeChild(this.currentModal);
            document.body.style.overflow = '';
            this.currentModal = null;
        }, 300);
    }

    // Language switching method
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.renderProjects();
    }

    // Filter projects by technology
    filterByTechnology(tech) {
        // This could be used for future filtering functionality
        console.log(`Filtering by technology: ${tech}`);
    }

    // Search projects
    searchProjects(query) {
        // This could be used for future search functionality
        console.log(`Searching for: ${query}`);
    }
}

// Initialize the projects manager when DOM is loaded
let projectsManager;
document.addEventListener('DOMContentLoaded', () => {
    projectsManager = new ProjectsManager();
    projectsManager.init();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsManager;
}
