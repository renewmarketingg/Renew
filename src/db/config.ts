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

export default defineDb({
  tables: {
    Users,
  },
});

