export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];
  lastUpdated: number;
}

const STORAGE_KEY = 'renew_cart';

const getDefaultState = (): CartState => ({
  items: [],
  lastUpdated: Date.now(),
});

const loadFromStorage = (): CartState => {
  try {
    if (typeof localStorage === 'undefined') return getDefaultState();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultState();
    return JSON.parse(stored) as CartState;
  } catch {
    return getDefaultState();
  }
};

const saveToStorage = (state: CartState): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[CartStore] Failed to save:', e);
  }
};

type Listener = (state: CartState) => void;

class CartStore {
  private state: CartState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = loadFromStorage();
  }

  getState = (): CartState => ({ ...this.state });

  getItems = (): CartItem[] => [...this.state.items];

  getTotalItems = (): number => {
    return this.state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  getTotalPrice = (): number => {
    return this.state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  addItem = (item: Omit<CartItem, 'addedAt'>): CartItem => {
    const existingIndex = this.state.items.findIndex((i) => i.productId === item.productId);

    if (existingIndex >= 0) {
      this.state.items[existingIndex].quantity += item.quantity;
      const updatedItem = this.state.items[existingIndex];
      this.persist();
      this.notify();
      return updatedItem;
    }

    const newItem: CartItem = {
      ...item,
      addedAt: Date.now(),
    };
    this.state.items.push(newItem);
    this.persist();
    this.notify();
    return newItem;
  };

  updateQuantity = (productId: string, quantity: number): boolean => {
    const index = this.state.items.findIndex((i) => i.productId === productId);
    if (index < 0) return false;

    if (quantity <= 0) {
      this.state.items.splice(index, 1);
    } else {
      this.state.items[index].quantity = Math.min(quantity, 99);
    }

    this.persist();
    this.notify();
    return true;
  };

  removeItem = (productId: string): boolean => {
    const index = this.state.items.findIndex((i) => i.productId === productId);
    if (index < 0) return false;

    this.state.items.splice(index, 1);
    this.persist();
    this.notify();
    return true;
  };

  clear = (): void => {
    this.state = getDefaultState();
    this.persist();
    this.notify();
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private persist = (): void => {
    this.state.lastUpdated = Date.now();
    saveToStorage(this.state);
  };

  private notify = (): void => {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  };
}

export const cartStore = new CartStore();
