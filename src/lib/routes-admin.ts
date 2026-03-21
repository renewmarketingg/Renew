import { generateId } from '@/lib/ui';

interface RouteItem {
  id: string;
  path: string;
  label: string;
  category: string;
  dynamic: boolean;
  params?: string[];
  description?: string;
  active: boolean;
  isSystem?: boolean;
}

const STORAGE_KEY = 'admin_routes';
let items: RouteItem[] = [];
let deleteId: string | null = null;

async function fetchRoutes() {
  try {
    const res = await fetch('/api/pages');
    if (!res.ok) throw new Error('Failed to fetch');
    const pages = await res.json();

    const stored = localStorage.getItem(STORAGE_KEY);
    const customRoutes: RouteItem[] = stored ? JSON.parse(stored) : [];

    const customPaths = new Set(customRoutes.map((r) => r.path));
    const baseRoutes = pages
      .map(
        (p: {
          path: string;
          label: string;
          category: string;
          dynamic: boolean;
          params?: string[];
        }) => ({
          id: `page-${p.path.replace(/\//g, '-')}`,
          path: p.path,
          label: p.label,
          category: p.category,
          dynamic: p.dynamic,
          params: p.params,
          description: p.dynamic ? `Parâmetros: ${p.params?.join(', ') || 'N/A'}` : undefined,
          active: true,
          isSystem: true,
        })
      )
      .filter((p: RouteItem) => !customPaths.has(p.path));

    items = [...baseRoutes, ...customRoutes];
    render();
  } catch (e) {
    console.error('Failed to load routes:', e);
    const stored = localStorage.getItem(STORAGE_KEY);
    items = stored ? JSON.parse(stored) : [];
    render();
  }
}

function save() {
  const customRoutes = items.filter((r) => !r.isSystem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRoutes));
}

function getFilteredItems() {
  const search =
    (document.getElementById('searchInput') as HTMLInputElement)?.value?.toLowerCase() || '';
  const cat = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
  const dyn = (document.getElementById('dynamicFilter') as HTMLSelectElement)?.value || '';
  const status = (document.getElementById('statusFilter') as HTMLSelectElement)?.value || '';

  return items.filter((r) => {
    const matchSearch =
      !search || r.label.toLowerCase().includes(search) || r.path.toLowerCase().includes(search);
    const matchCat = !cat || r.category === cat;
    const matchDyn = !dyn || (dyn === 'true' ? r.dynamic : !r.dynamic);
    const matchStatus = !status || (status === 'active' ? r.active : !r.active);
    return matchSearch && matchCat && matchDyn && matchStatus;
  });
}

const renderRouteCard = (r: RouteItem): string => `
  <div class="route-card ${!r.active ? 'inactive' : ''}">
    <div class="route-card-header">
      <span class="badge badge-${r.category.toLowerCase().replace(/\s/g, '-')}">${r.category}</span>
      ${r.dynamic ? '<span class="badge badge-dynamic">Dinâmica</span>' : ''}
      <div class="route-actions">
        <button class="action-btn edit-btn" data-id="${r.id}" title="Editar">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button class="action-btn toggle-btn" data-id="${r.id}" title="${r.active ? 'Desativar' : 'Ativar'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${r.active ? '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 12h6"/>' : '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/>'}</svg>
        </button>
        <button class="action-btn delete-btn" data-id="${r.id}" data-name="${r.label}" title="Excluir">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
    <div class="route-card-body">
      <h4 class="font-bold mb-2 route-label">${r.label}</h4>
      <code class="route-path">${r.path}</code>
      ${r.description ? `<p class="text-sm text-gray-400 mt-2 route-description">${r.description}</p>` : ''}
    </div>
  </div>
`;

function render() {
  const filtered = getFilteredItems();
  const grid = document.getElementById('grid') as HTMLElement;
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><h3>Nenhuma rota</h3></div>`;
    updateStats([]);
    return;
  }

  grid.innerHTML = filtered.map(renderRouteCard).join('');

  grid
    .querySelectorAll('.edit-btn')
    .forEach((btn) => btn.addEventListener('click', () => edit((btn as HTMLElement).dataset.id!)));
  grid
    .querySelectorAll('.toggle-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () => toggle((btn as HTMLElement).dataset.id!))
    );
  grid
    .querySelectorAll('.delete-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () =>
        showDelete((btn as HTMLElement).dataset.id!, (btn as HTMLElement).dataset.name!)
      )
    );

  updateStats(filtered);
}

function updateStats(filtered: RouteItem[]) {
  const total = filtered.length;
  const dynamic = filtered.filter((r) => r.dynamic).length;
  const cats = new Set(filtered.map((r) => r.category)).size;
  const active = filtered.filter((r) => r.active).length;

  const el = (key: string) => document.querySelector(`[data-stat="${key}"]`) as HTMLElement;
  if (el('total')) el('total').textContent = String(total);
  if (el('dynamic')) el('dynamic').textContent = String(dynamic);
  if (el('categories')) el('categories').textContent = String(cats);
  if (el('active')) el('active').textContent = String(active);
}

function edit(id: string) {
  const r = items.find((x) => x.id === id);
  if (!r) return;

  (document.getElementById('modalTitle') as HTMLElement).textContent = 'Editar';
  (document.getElementById('itemId') as HTMLInputElement).value = r.id;
  (document.getElementById('label') as HTMLInputElement).value = r.label;
  (document.getElementById('path') as HTMLInputElement).value = r.path;
  (document.getElementById('description') as HTMLInputElement).value = r.description || '';
  (document.getElementById('category') as HTMLSelectElement).value = r.category;
  (document.getElementById('dynamic') as HTMLInputElement).checked = r.dynamic || false;
  (document.getElementById('dynamicParams') as HTMLInputElement).value = r.params?.join(', ') || '';
  const paramsGroup = document.getElementById('paramsGroup');
  if (paramsGroup) paramsGroup.style.display = r.dynamic ? 'block' : 'none';
  document.getElementById('itemModal')?.classList.add('visible');
}

function saveItem() {
  const id = (document.getElementById('itemId') as HTMLInputElement).value;
  const paramsStr = (document.getElementById('dynamicParams') as HTMLInputElement).value || '';
  const params = paramsStr
    ? paramsStr
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    : undefined;

  const data: RouteItem = {
    id: id || generateId('route'),
    label: (document.getElementById('label') as HTMLInputElement).value,
    path: (document.getElementById('path') as HTMLInputElement).value,
    description: (document.getElementById('description') as HTMLInputElement).value,
    category: (document.getElementById('category') as HTMLSelectElement).value,
    dynamic: (document.getElementById('dynamic') as HTMLInputElement).checked,
    params,
    active: true,
  };

  if (id) {
    const idx = items.findIndex((x) => x.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], ...data };
  } else {
    items.unshift(data);
  }
  save();
  render();
  document.getElementById('itemModal')?.classList.remove('visible');
}

function toggle(id: string) {
  const r = items.find((x) => x.id === id);
  if (r) {
    r.active = !r.active;
    save();
    render();
  }
}

function showDelete(id: string, name: string) {
  deleteId = id;
  (document.getElementById('deleteName') as HTMLElement).textContent = name;
  document.getElementById('deleteModal')?.classList.add('visible');
}

function deleteItem() {
  if (!deleteId) return;
  items = items.filter((r) => r.id !== deleteId);
  save();
  render();
  document.getElementById('deleteModal')?.classList.remove('visible');
  deleteId = null;
}

export function initRoutesAdmin() {
  document.getElementById('addBtn')?.addEventListener('click', () => {
    (document.getElementById('modalTitle') as HTMLElement).textContent = 'Nova';
    (document.getElementById('itemForm') as HTMLFormElement).reset();
    (document.getElementById('itemId') as HTMLInputElement).value = '';
    const paramsGroup = document.getElementById('paramsGroup');
    if (paramsGroup) paramsGroup.style.display = 'none';
    document.getElementById('itemModal')?.classList.add('visible');
  });

  document
    .getElementById('cancelBtn')
    ?.addEventListener('click', () =>
      document.getElementById('itemModal')?.classList.remove('visible')
    );
  document.getElementById('saveBtn')?.addEventListener('click', saveItem);
  document
    .getElementById('cancelDeleteBtn')
    ?.addEventListener('click', () =>
      document.getElementById('deleteModal')?.classList.remove('visible')
    );
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', deleteItem);
  document.getElementById('searchInput')?.addEventListener('input', render);
  document.getElementById('categoryFilter')?.addEventListener('change', render);
  document.getElementById('dynamicFilter')?.addEventListener('change', render);
  document.getElementById('statusFilter')?.addEventListener('change', render);
  document.getElementById('dynamic')?.addEventListener('change', (e) => {
    const paramsGroup = document.getElementById('paramsGroup');
    if (paramsGroup)
      paramsGroup.style.display = (e.target as HTMLInputElement).checked ? 'block' : 'none';
  });

  document
    .querySelectorAll('[data-close]')
    .forEach((btn) =>
      btn.addEventListener('click', () =>
        document.getElementById((btn as HTMLElement).dataset.close!)?.classList.remove('visible')
      )
    );
  document.querySelectorAll('.modal-overlay').forEach((modal) =>
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('visible');
    })
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
      document
        .querySelectorAll('.modal-overlay.visible')
        .forEach((m) => m.classList.remove('visible'));
  });

  fetchRoutes();
}
