import { column, defineDb, defineTable } from 'astro:db';

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true, notNull: true }),
    name: column.text(),
    password: column.text(),
    googleId: column.text(),
    avatar: column.text(),
    role: column.text({ default: 'admin' }),
    createdAt: column.date({ default: new Date() }),
  },
});

const Products = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    price: column.number(),
    originalPrice: column.number({ optional: true }),
    image: column.text(),
    affiliateLink: column.text(),
    category: column.text(),
    rating: column.number({ default: 5 }),
    reviews: column.number({ default: 0 }),
    featured: column.boolean({ default: false }),
    createdAt: column.date({ default: new Date() }),
  },
});

const CartItems = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    sessionId: column.text(),
    productId: column.text({ references: () => Products.columns.id }),
    quantity: column.number({ default: 1 }),
    createdAt: column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: { Users, Products, CartItems },
});
