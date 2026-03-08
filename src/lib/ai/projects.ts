import {
  generateId,
  getProjects,
  saveProjects,
  setConnectedProject,
  clearConnectedProject,
  type Project,
  type ConnectedProject,
} from './storage';
import { showToast, renderProjectsList, renderConnectedProject } from './ui';

export const createProject = (name: string, description: string): Project => {
  const projects = getProjects();
  const project: Project = {
    id: generateId(),
    name,
    description,
    createdAt: new Date().toISOString(),
  };

  projects.push(project);
  saveProjects(projects);

  return project;
};

export const deleteProject = (_id: string): void => {
  // Implementation if needed
};

export const connectProject = (name: string, path: string): void => {
  const project: ConnectedProject = {
    name,
    path,
    connectedAt: new Date().toISOString(),
  };
  setConnectedProject(project);
  showToast(`Pasta "${name}" conectada!`, 'success');
  renderConnectedProject();
};

export const disconnectProject = (): void => {
  clearConnectedProject();
  showToast('Projeto desconectado', 'success');
  renderConnectedProject();
};

export const initProjectModal = (): void => {
  const connectBtn = document.getElementById('connectProjectBtn');
  const createBtn = document.getElementById('createProjectBtn');
  const closeModal = document.getElementById('closeProjectModal');
  const projectModal = document.getElementById('projectModal');
  const closeCreate = document.getElementById('closeCreateModal');
  const createModal = document.getElementById('createProjectModal');
  const saveBtn = document.getElementById('saveProjectBtn');

  connectBtn?.addEventListener('click', () => {
    projectModal?.classList.add('visible');
    renderConnectedProject();
  });

  createBtn?.addEventListener('click', () => {
    createModal?.classList.add('visible');
  });

  closeModal?.addEventListener('click', () => {
    projectModal?.classList.remove('visible');
  });

  closeCreate?.addEventListener('click', () => {
    createModal?.classList.remove('visible');
  });

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('visible');
  });

  createModal?.addEventListener('click', (e) => {
    if (e.target === createModal) createModal.classList.remove('visible');
  });

  saveBtn?.addEventListener('click', () => {
    const nameInput = document.getElementById('newProjectName') as HTMLInputElement | null;
    const descInput = document.getElementById('newProjectDesc') as HTMLTextAreaElement | null;

    const name = nameInput?.value.trim() || '';
    const description = descInput?.value.trim() || '';

    if (!name) {
      showToast('Digite um nome para o projeto', 'error');
      return;
    }

    createProject(name, description);

    if (nameInput) nameInput.value = '';
    if (descInput) descInput.value = '';

    createModal?.classList.remove('visible');
    showToast(`Projeto "${name}" criado!`, 'success');
    renderProjectsList();
  });

  const folderInput = document.getElementById('folderInput') as HTMLInputElement | null;
  if (folderInput) {
    folderInput.setAttribute('webkitdirectory', 'true');
    folderInput.setAttribute('directory', 'true');
    folderInput.setAttribute('multiple', 'true');

    folderInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fullPath = file.webkitRelativePath || file.name;
        const pathParts = fullPath.split('/');
        const folderName = pathParts[0] || 'Projeto';

        connectProject(folderName, fullPath);
        target.value = '';
      }
    });
  }

  document.getElementById('connectFolderBtn')?.addEventListener('click', () => {
    folderInput?.click();
  });
};
