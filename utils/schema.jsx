import { integer, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core'; 

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(), 
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull()
});

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(), 
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    budgetId:integer('budgetId').references(()=>Budgets.id),
    createdAt: varchar('createdAt').notNull()
});

export const Groups = pgTable('Groups', {
    id: serial('id').primaryKey(), 
    name: varchar('name').notNull(),
    createdBy: varchar('createdBy').notNull()
});

export const MemberGroups = pgTable('MemberGroups', {
    email: varchar('email').notNull(),
    name: varchar('name').notNull(),
    groupId:integer('groupId').references(()=>Groups.id),
});

export const GroupExpenses = pgTable('GroupExpenses', {
    expenseId: serial('expenseId').primaryKey(), 
    groupId:integer('groupId').references(()=>Groups.id),
    createdAt: varchar('createdAt').notNull(),
    createdBy: varchar('createdBy').notNull(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    splitBetween: varchar('splitBetween', { array: true })
});

export const Graph = pgTable('Graph', {
    groupId:integer('groupId').references(()=>Groups.id),
    expenseId:integer('expenseId').references(()=>GroupExpenses.expenseId),
    from: varchar('from').notNull(),
    to: varchar('to').notNull(),
    amount: numeric('amount').notNull(),
});