import { cartStore, type CartState } from './store';

interface CartElements {
  btn: HTMLElement | null;
  closeBtn: HTMLElement | null;
  overlay: HTMLElement | null;
  clearBtn: HTMLElement | null;
  checkoutBtn: HTMLElement | null;
}

interface CartItemData {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

let elements: CartElements = {
  btn: null,
  closeBtn: null,
  overlay: null,
  clearBtn: null,
  checkoutBtn: null,
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const msgEl = toast.querySelector('.toast-message');
  if (msgEl) msgEl.textContent = message;

  const icons: Record<string, string> = { success: '✓', error: '✕', info: 'ℹ' };
  const iconEl = toast.querySelector('.toast-icon');
  if (iconEl) iconEl.textContent = icons[type] ?? '';

  toast.dataset.type = type;
  toast.classList.add('show');

  const existingTimer = (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })
    ._toastTimer;
  if (existingTimer) clearTimeout(existingTimer);

  (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer = setTimeout(
    () => toast.classList.remove('show'),
    3000
  );
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export const openCart = (): void => {
  document.getElementById('cartSidebar')?.classList.add('cartSidebarOpen');
  document.getElementById('cartOverlay')?.classList.add('cartOverlayOpen');
  document.body.style.overflow = 'hidden';
};

export const closeCart = (): void => {
  document.getElementById('cartSidebar')?.classList.remove('cartSidebarOpen');
  document.getElementById('cartOverlay')?.classList.remove('cartOverlayOpen');
  document.body.style.overflow = '';
};

export const openCheckoutModal = (): void => {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('visible');
};

export const closeCheckoutModal = (): void => {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('visible');
};

const updateCounter = (count: number): void => {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;

  countEl.textContent = String(count);
  countEl.style.transform = 'scale(1.3)';
  setTimeout(() => {
    countEl.style.transform = 'scale(1)';
  }, 150);
};

const updateTotal = (total: number): void => {
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = formatPrice(total);
};

const renderEmptyState = (container: HTMLElement): void => {
  container.innerHTML = `
    <div class="cart-empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <p>Seu carrinho está vazio</p>
      <span>Adicione produtos para começar!</span>
    </div>
  `;
};

const createCartItemElement = (item: CartItemData): HTMLElement => {
  const div = document.createElement('div');
  div.className = 'cart-item';
  div.innerHTML = `
    <div class="cart-item-image" style="background-image: url(${item.image})"></div>
    <div class="cart-item-info">
      <h4 class="cart-item-name">${item.name}</h4>
      <span class="cart-item-price">${formatPrice(item.price)}</span>
      <div class="cart-item-qty">
        <button class="qty-btn qty-decrease" data-id="${item.productId}">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn qty-increase" data-id="${item.productId}">+</button>
      </div>
    </div>
    <button class="cart-item-remove" data-id="${item.productId}" aria-label="Remover">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  return div;
};

const renderCartItems = (items: CartState['items']): void => {
  const container = document.getElementById('cartItems');
  if (!container) return;

  container.innerHTML = '';

  if (items.length === 0) {
    renderEmptyState(container);
    return;
  }

  items.forEach((item) => {
    const el = createCartItemElement(item);
    container.appendChild(el);
  });

  container.querySelectorAll('.qty-decrease').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id;
      if (!id) return;
      const currentItem = cartStore.getItems().find((i) => i.productId === id);
      if (currentItem) {
        cartStore.updateQuantity(id, currentItem.quantity - 1);
      }
    });
  });

  container.querySelectorAll('.qty-increase').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id;
      if (!id) return;
      const currentItem = cartStore.getItems().find((i) => i.productId === id);
      if (currentItem) {
        cartStore.updateQuantity(id, currentItem.quantity + 1);
      }
    });
  });

  container.querySelectorAll('.cart-item-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id;
      if (!id) return;
      const el = btn.closest('.cart-item') as HTMLElement;
      el.style.opacity = '0.5';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => cartStore.removeItem(id), 200);
    });
  });
};

const render = (state: CartState): void => {
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateCounter(count);
  updateTotal(total);
  renderCartItems(state.items);
};

const handleAddToCart = (e: Event): void => {
  const btn = (e.target as HTMLElement).closest('.add-to-cart-btn') as HTMLButtonElement | null;
  if (!btn) return;

  const id = btn.dataset.id ?? '';
  const name = btn.dataset.name ?? '';
  const price = btn.dataset.price ?? '0';
  const image = btn.dataset.image ?? '';

  if (!id || !name) return;

  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.disabled = false;
    btn.style.opacity = '1';
  }, 500);

  cartStore.addItem({
    productId: id,
    name,
    price: parseFloat(price),
    quantity: 1,
    image,
  });

  showToast(`${name} adicionado ao carrinho!`, 'success');
};

const handleClearCart = (): void => {
  if (!confirm('Tem certeza que deseja limpar o carrinho?')) return;
  cartStore.clear();
  showToast('Carrinho limpo!', 'success');
};

const handleCheckout = (): void => {
  const items = cartStore.getItems();
  if (items.length === 0) {
    showToast('Carrinho vazio!', 'error');
    return;
  }
  closeCart();
  openCheckoutModal();
};

export const initCart = (): void => {
  elements = {
    btn: document.getElementById('cartBtn'),
    closeBtn: document.getElementById('cartClose'),
    overlay: document.getElementById('cartOverlay'),
    clearBtn: document.getElementById('clearCartBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
  };

  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');

  cartStore.subscribe(render);
  render(cartStore.getState());

  elements.btn?.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });

  elements.closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeCart();
  });

  elements.overlay?.addEventListener('click', closeCart);

  elements.clearBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    handleClearCart();
  });

  elements.checkoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    handleCheckout();
  });

  closeCheckoutBtn?.addEventListener('click', closeCheckoutModal);

  checkoutModal?.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  document.getElementById('productsContainer')?.addEventListener('click', handleAddToCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (checkoutModal?.classList.contains('visible')) {
        closeCheckoutModal();
      } else {
        closeCart();
      }
    }
  });
};
