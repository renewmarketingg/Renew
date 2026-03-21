export type { AiModel, AiQuickAction, Chat, ChatMessage, ConnectedProject, Project } from './ai';
export type { LayoutProps } from './layout';
export type { SeoFonts, SeoMeta, SeoProps } from './seo';

export type OwnerCredentials = {
  email: string;
  password: string;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  affiliateLink: string;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  createdAt?: Date;
}

export type AffiliateProduct = Product;

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
