import affiliateProducts from '@/constants/affiliateProducts';
import { db, Products, Users } from 'astro:db';

export default async function seed() {
  await db.insert(Users).values([
    {
      id: '',
      password: '',
      email: 'admin@email.com',
      name: 'Admin',
      avatar: '',
      googleId: '',
    },
  ]);

  const insertProducts = affiliateProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    affiliateLink: p.affiliateLink,
    category: p.category,
    rating: p.rating,
    reviews: p.reviews,
    featured: p.featured ?? false,
    createdAt: new Date(),
  }));

  await db.insert(Products).values(insertProducts);
}
