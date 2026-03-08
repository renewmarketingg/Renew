import * as Api from './api';

let cartBtn: HTMLElement | null = null;
let cartCloseBtn: HTMLElement | null = null;
let cartOverlay: HTMLElement | null = null;
let clearCartBtn: HTMLElement | null = null;
let checkoutBtn: HTMLElement | null = null;
let productsContainer: HTMLElement | null = null;

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

  clearTimeout(
    (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer
  );
  (toast as HTMLElement & { _toastTimer?: ReturnType<typeof setTimeout> })._toastTimer = setTimeout(
    () => toast.classList.remove('show'),
    3000
  );
};

const formatPriceBR = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

const openCart = (): void => {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  if (sidebar) sidebar.classList.add('cartSidebarOpen');
  if (overlay) overlay.classList.add('cartOverlayOpen');
  document.body.style.overflow = 'hidden';
};

const closeCart = (): void => {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  if (sidebar) sidebar.classList.remove('cartSidebarOpen');
  if (overlay) overlay.classList.remove('cartOverlayOpen');
  document.body.style.overflow = '';
};

const updateCartUI = async (): Promise<void> => {
  try {
    const cart = await Api.getCartFromServer();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = String(count);

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatPriceBR(total);

    const cartItemsEl = document.getElementById('cartItems');
    const cartEmptyEl = document.getElementById('cartEmpty');
    const template = document.getElementById('tpl-cart-item') as HTMLTemplateElement | null;

    if (!cartItemsEl || !cartEmptyEl || !template) return;

    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      cartItemsEl.innerHTML = '';
      cartItemsEl.appendChild(cartEmptyEl.cloneNode(true));
    } else {
      cartEmptyEl.style.display = 'none';
      cartItemsEl.innerHTML = '';

      cart.forEach((item) => {
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const img = clone.querySelector('img');
        if (img) {
          img.src = item.image;
          img.alt = item.name;
        }

        const name = clone.querySelector('.cart-item-name');
        if (name) name.textContent = item.name;

        const price = clone.querySelector('div > span');
        if (price) price.textContent = formatPriceBR(item.price);

        const qtyVal = clone.querySelector('.cart-item-qty-val');
        if (qtyVal) qtyVal.textContent = String(item.quantity);

        const btns = clone.querySelectorAll('button[data-delta]');
        btns.forEach((btn) => {
          const delta = parseInt((btn as HTMLButtonElement).dataset.delta || '0');
          btn.addEventListener('click', async () => {
            const success = await Api.updateQuantityServer(item.productId, item.quantity + delta);
            if (success) await updateCartUI();
          });
        });

        const removeBtn = clone.querySelector('button[aria-label="Remover"]');
        if (removeBtn) {
          removeBtn.addEventListener('click', async () => {
            const success = await Api.removeFromCartServer(item.productId);
            if (success) await updateCartUI();
          });
        }

        cartItemsEl.appendChild(clone);
      });
    }
  } catch (e) {
    console.error('updateCartUI failed:', e);
  }
};

const handleClearCart = async (): Promise<void> => {
  const success = await Api.clearCartServer();
  if (success) {
    await updateCartUI();
    showToast('Carrinho limpo!', 'info');
  }
};

export const initCart = async (): Promise<void> => {
  cartBtn = document.getElementById('cartBtn');
  cartCloseBtn = document.getElementById('cartClose');
  cartOverlay = document.getElementById('cartOverlay');
  clearCartBtn = document.getElementById('clearCartBtn');
  checkoutBtn = document.getElementById('checkoutBtn');
  productsContainer = document.getElementById('productsContainer');

  await updateCartUI();

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCart();
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleClearCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const cart = await Api.getCartFromServer();
      if (cart.length > 0) {
        showToast('Redirecionando para checkout...', 'info');
      } else {
        showToast('Carrinho vazio!', 'error');
      }
    });
  }

  if (productsContainer) {
    productsContainer.addEventListener('click', async (e) => {
      const btn = (e.target as HTMLElement).closest('.add-to-cart-btn') as HTMLButtonElement | null;
      if (btn) {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (id && name) {
          e.preventDefault();
          const success = await Api.addToCartServer(id, name);
          if (success) {
            await updateCartUI();
            showToast('Adicionado ao carrinho!', 'success');
          }
        }
      }
    });
  }
};
