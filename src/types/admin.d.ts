interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating?: number;
  reviews?: number;
  image: string;
  affiliateLink: string;
  featured: boolean;
  isTest?: boolean;
}

declare global {
  interface Window {
    __PRODUCTS_DATA__?: (Product & { isTest?: boolean })[];
  }
}

export type { Product };
