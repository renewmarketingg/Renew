import type { AffiliateProduct } from '@/types';
import { formatPrice } from '@/lib/ui';

let realItems: (AffiliateProduct & { isTest: false })[] = [];
let testItems: (AffiliateProduct & { isTest: true })[] = [];
let deleteId: string | null = null;

const testProducts: (AffiliateProduct & { isTest: true })[] = [
  {
    id: 'prod-001',
    name: 'iPhone 15 Pro Max',
    description: 'O mais avançado iPhone já criado com chip A17 Pro e câmera de 48MP',
    price: 7999,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    affiliateLink: '#',
    category: 'Eletrônicos',
    rating: 4.8,
    reviews: 2543,
    featured: true,
    isTest: true,
  },
  {
    id: 'prod-002',
    name: 'MacBook Air M3',
    description: 'Laptop ultrafino com chip M3, até 18 horas de bateria',
    price: 8499,
    originalPrice: 9499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    affiliateLink: '#',
    category: 'Eletrônicos',
    rating: 4.9,
    reviews: 1820,
    featured: true,
    isTest: true,
  },
  {
    id: 'prod-003',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone premium com S Pen e câmera de 200MP',
    price: 6999,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    affiliateLink: '#',
    category: 'Eletrônicos',
    rating: 4.7,
    reviews: 1567,
    isTest: true,
  },
  {
    id: 'prod-004',
    name: 'AirPods Pro 2ª Geração',
    description: 'Cancelamento de ruído ativo e áudio espacial',
    price: 1899,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    affiliateLink: '#',
    category: 'Áudio',
    rating: 4.8,
    reviews: 3245,
    isTest: true,
  },
  {
    id: 'prod-005',
    name: 'Apple Watch Series 9',
    description: 'Smartwatch com chip S9 e tela Always-On',
    price: 3299,
    originalPrice: 3799,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    affiliateLink: '#',
    category: 'Acessórios',
    rating: 4.7,
    reviews: 987,
    featured: true,
    isTest: true,
  },
  {
    id: 'prod-006',
    name: 'Sony WH-1000XM5',
    description: 'Fone de ouvido premium com cancelamento de ruído líder',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    affiliateLink: '#',
    category: 'Áudio',
    rating: 4.9,
    reviews: 2156,
    isTest: true,
  },
  {
    id: 'prod-007',
    name: 'iPad Pro 12.9" M2',
    description: 'Tablet profissional com tela Liquid Retina XDR',
    price: 9499,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    affiliateLink: '#',
    category: 'Eletrônicos',
    rating: 4.8,
    reviews: 743,
    isTest: true,
  },
  {
    id: 'prod-008',
    name: 'Nintendo Switch OLED',
    description: 'Console portátil com tela OLED de 7 polegadas',
    price: 2699,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
    affiliateLink: '#',
    category: 'Games',
    rating: 4.6,
    reviews: 4532,
    isTest: true,
  },
  {
    id: 'prod-009',
    name: 'PlayStation 5',
    description: 'Console de última geração com SSD ultrarrápido',
    price: 4299,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    affiliateLink: '#',
    category: 'Games',
    rating: 4.9,
    reviews: 8921,
    featured: true,
    isTest: true,
  },
  {
    id: 'prod-010',
    name: 'Kindle Paperwhite',
    description: 'Leitor de ebook com tela de 6.8" e luz quente ajustável',
    price: 599,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    affiliateLink: '#',
    category: 'Livros',
    rating: 4.7,
    reviews: 1876,
    isTest: true,
  },
  {
    id: 'prod-011',
    name: 'Xiaomi Mi Band 8',
    description: 'Pulseira inteligente com monitoramento de saúde completo',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    affiliateLink: '#',
    category: 'Acessórios',
    rating: 4.5,
    reviews: 2341,
    isTest: true,
  },
  {
    id: 'prod-012',
    name: 'Logitech MX Master 3S',
    description: 'Mouse sem fio premium com scrolling eletromagnético',
    price: 749,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    affiliateLink: '#',
    category: 'Acessórios',
    rating: 4.8,
    reviews: 1234,
    isTest: true,
  },
];

async function fetchItems() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (res.ok) {
      realItems = data.map((p: AffiliateProduct) => ({ ...p, isTest: false as const }));
      render();
    }
  } catch (e) {
    console.error(e);
  }
}

function getFilteredItems() {
  const search =
    (document.getElementById('searchInput') as HTMLInputElement)?.value?.toLowerCase() || '';
  const cat = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
  const feat = (document.getElementById('featuredFilter') as HTMLSelectElement)?.value || '';
  const showTest = (document.getElementById('isTestFilter') as HTMLInputElement)?.checked || false;

  const items = showTest ? testItems : realItems;

  return items.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search);
    const matchCat = !cat || cat === 'Todos' || p.category === cat;
    const matchFeat = !feat || (feat === 'true' ? p.featured : !p.featured);
    return matchSearch && matchCat && matchFeat;
  });
}

function render() {
  const filtered = getFilteredItems();
  const tbody = document.getElementById('tableBody') as HTMLTableSectionElement;
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8">Nenhum produto</td></tr>`;
    updateStats([]);
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (p) => `
      <tr data-id="${p.id}">
        <td>
          <div class="product-cell">
            <img src="${p.image}" alt="" class="product-thumb" loading="lazy" />
            <div class="product-info">
              <h4>${p.name}</h4>
              <span>${p.reviews?.toLocaleString() || 0} avaliações</span>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}${p.originalPrice ? `<span class="text-sm text-gray-400 line-through ml-2">${formatPrice(p.originalPrice)}</span>` : ''}</td>
        <td><span class="badge ${p.featured ? 'badge-featured' : 'badge-active'}">${p.featured ? 'Destaque' : 'Ativo'}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="action-btn edit-btn" data-id="${p.id}" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
            <button class="action-btn delete-btn" data-id="${p.id}" data-name="${p.name}" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');

  tbody
    .querySelectorAll('.edit-btn')
    .forEach((btn) => btn.addEventListener('click', () => edit((btn as HTMLElement).dataset.id!)));
  tbody
    .querySelectorAll('.delete-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () =>
        showDelete((btn as HTMLElement).dataset.id!, (btn as HTMLElement).dataset.name!)
      )
    );
  updateStats(filtered);
}

function updateStats(filtered: (AffiliateProduct & { isTest: boolean })[]) {
  const total = filtered.length;
  const featured = filtered.filter((p) => p.featured).length;
  const avg = total ? filtered.reduce((s, p) => s + p.price, 0) / total : 0;
  const cats = new Set(filtered.map((p) => p.category)).size;

  const el = (key: string) => document.querySelector(`[data-stat="${key}"]`) as HTMLElement;
  if (el('total')) el('total').textContent = String(total);
  if (el('featured')) el('featured').textContent = String(featured);
  if (el('avg')) el('avg').textContent = formatPrice(avg);
  if (el('categories')) el('categories').textContent = String(cats);
}

function edit(id: string) {
  const allItems = [...realItems, ...testItems];
  const p = allItems.find((x) => x.id === id);
  if (!p) return;

  (document.getElementById('modalTitle') as HTMLElement).textContent = 'Editar';
  (document.getElementById('itemId') as HTMLInputElement).value = p.id;
  (document.getElementById('name') as HTMLInputElement).value = p.name;
  (document.getElementById('description') as HTMLTextAreaElement).value = p.description || '';
  (document.getElementById('price') as HTMLInputElement).value = String(p.price);
  (document.getElementById('originalPrice') as HTMLInputElement).value = p.originalPrice
    ? String(p.originalPrice)
    : '';
  (document.getElementById('category') as HTMLSelectElement).value = p.category;
  (document.getElementById('rating') as HTMLInputElement).value = String(p.rating || 4.5);
  (document.getElementById('image') as HTMLInputElement).value = p.image;
  (document.getElementById('affiliateLink') as HTMLInputElement).value = p.affiliateLink;
  (document.getElementById('featured') as HTMLInputElement).checked = p.featured ?? false;
  document.getElementById('itemModal')?.classList.add('visible');
}

async function saveItem() {
  const id = (document.getElementById('itemId') as HTMLInputElement).value;
  const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
  saveBtn.disabled = true;

  const data = {
    name: (document.getElementById('name') as HTMLInputElement).value,
    description: (document.getElementById('description') as HTMLTextAreaElement).value,
    price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
    originalPrice:
      parseFloat((document.getElementById('originalPrice') as HTMLInputElement).value) || undefined,
    category: (document.getElementById('category') as HTMLSelectElement).value,
    rating: parseFloat((document.getElementById('rating') as HTMLInputElement).value) || 4.5,
    image: (document.getElementById('image') as HTMLInputElement).value,
    affiliateLink: (document.getElementById('affiliateLink') as HTMLInputElement).value,
    featured: (document.getElementById('featured') as HTMLInputElement).checked,
  };

  try {
    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await fetchItems();
      document.getElementById('itemModal')?.classList.remove('visible');
    } else {
      const errorData = await res.json();
      alert('Erro ao salvar: ' + JSON.stringify(errorData));
    }
  } catch (err: any) {
    alert('Erro inesperado: ' + err.message);
  } finally {
    saveBtn.disabled = false;
  }
}

function showDelete(id: string, name: string) {
  deleteId = id;
  (document.getElementById('deleteName') as HTMLElement).textContent = name;
  document.getElementById('deleteModal')?.classList.add('visible');
}

async function deleteItem() {
  if (!deleteId) return;
  const confirmBtn = document.getElementById('confirmDeleteBtn') as HTMLButtonElement;
  confirmBtn.disabled = true;

  try {
    const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchItems();
      document.getElementById('deleteModal')?.classList.remove('visible');
    } else {
      alert('Erro ao excluir.');
    }
  } catch (err: any) {
    alert('Erro inesperado: ' + err.message);
  } finally {
    confirmBtn.disabled = false;
    deleteId = null;
  }
}

export function initStore() {
  testItems = testProducts;

  document.getElementById('addBtn')?.addEventListener('click', () => {
    (document.getElementById('modalTitle') as HTMLElement).textContent = 'Novo';
    (document.getElementById('itemForm') as HTMLFormElement).reset();
    (document.getElementById('itemId') as HTMLInputElement).value = '';
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
  document.getElementById('featuredFilter')?.addEventListener('change', render);
  document.getElementById('isTestFilter')?.addEventListener('change', render);

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

  render();
}

export function setStoreItems(data: AffiliateProduct[]) {
  realItems = data.map((p) => ({ ...p, isTest: false as const }));
}
