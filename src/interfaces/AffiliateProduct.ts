export interface AffiliateProduct {
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
  featured?: boolean;
};