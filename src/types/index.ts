export type ToastType = 'success' | 'error' | 'info';

export type { LayoutProps } from './layout';
export type { SeoProps, SeoMeta, SeoFonts } from './seo';
export type { Chat, ChatMessage, Project, ConnectedProject, AiModel, AiQuickAction } from './ai';

export type ClerkEmailAddress = { id: string; emailAddress: string };

export type ClerkUserLike = {
  primaryEmailAddressId?: string | null;
  emailAddresses?: ClerkEmailAddress[];
};

export type OwnerCredentials = {
  email: string;
  password: string;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  affiliateLink: string;
  category: string;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt?: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartQtyInput {
  quantity: number;
}

export interface FilterParams {
  q: string;
  category: string;
  id: string | null;
}
