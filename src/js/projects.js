
this.projects = null;
this.currentLanguage = 'es';
this.currentModal = null;

async function loadProjects() {
    try {
        const response = await fetch('./src/data/projects.json');
        this.projects = await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects() {
    if (!this.projects) return;

    renderLatestProjects();
    renderAutomationProjects();
    renderDevelopmentProjects();

}

function renderLatestProjects() {
    const container = document.querySelector('#latest-projects');
    if (!container) return;

    // Get latest 3 projects (mix of automation and development)
    const allProjects = [...this.projects.automation, ...this.projects.development];
    const latestProjects = allProjects
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    container.innerHTML = latestProjects.map(project => createProjectCard(project, 'large')).join('');
}

function renderAutomationProjects() {
    const container = document.querySelector('#automation-projects');
    if (!container) return;

    container.innerHTML = this.projects.automation
        .map(project => this.createProjectCard(project, 'small'))
        .join('');

}

function renderDevelopmentProjects() {
    const container = document.querySelector('#develop-projects');
    if (!container) return;

    container.innerHTML = this.projects.development
        .map(project => this.createProjectCard(project, 'small'))
        .slice(0, 4)
        .join('');

}

function createProjectCard(project, size = 'small') {
    const title = project.title[this.currentLanguage];
    const description = project.description[this.currentLanguage];
    const type = project.type[this.currentLanguage]
    const isLarge = size === 'large';

    return `
            <div class="card-project bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green transition-colors data-project-id="${project.id}" onclick="openModal('${project.id}')">
                <h3 class="text-xl font-semibold mb-3 text-white">${title}</h3>
                <p class="text-gray-400 mb-4">${description}</p>
                <div class="flex justify-between items-center">
                    <span class=".bag-type bg-green-600 text-white px-3 py-1 rounded-full text-sm">${type}</span>
                </div>
            </div>
        `;
}

function openModal(projectId) {

    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCloseButton = document.querySelector('.modal-close-button');

    document.getElementById('titleImage').style.display = 'none';
    document.getElementById('modalImage').style.display = 'none';
    document.getElementById('btn-demo-modal').style.display = 'none';

    modalCloseButton.addEventListener('click', closeModal);

    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

    const allProjects = [...this.projects.automation, ...this.projects.development];
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const title = project.title[this.currentLanguage];
    const description = project.detailedDescription[this.currentLanguage];
    const features = project.technologies

    console.log('features', features);

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    projectModal.showModal();

    const techList = document.getElementById('techList');

    // Clear existing tech items first
    techList.innerHTML = '';

    features.forEach(element => {
        let techListItem = document.createElement('span');
        techListItem.className = 'bg-green-600 px-3 py-1 rounded-full text-sm';
        techListItem.textContent = element;
        techList.appendChild(techListItem);
    });

    console.log('project.type', project.type[this.currentLanguage]);
    console.log('project.type', project.type[this.currentLanguage] === 'Automatización');
    if (project.type[this.currentLanguage] === 'Desarrollo' || project.type[this.currentLanguage] === 'Development') {
        document.getElementById('titleImage').style.display = 'block';
        document.getElementById('modalImage').style.display = 'block';
        document.getElementById('btn-demo-modal').style.display = 'block';
    }

}

// Function to close the modal
function closeModal() {
    projectModal.close();
    modalTitle.textContent = '';
    modalDescription.textContent = '';

}

async function init() {
    console.log('ProjectsManager initialized');
    await loadProjects();
    renderProjects();
}

init();


