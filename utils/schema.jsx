import { integer, numeric, pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core'; 

export const Budgets = pgTable('budgets', {
    id: uuid("id").defaultRandom().primaryKey(), 
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull()
});

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(), 
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    budgetId:uuid('budgetId').references(()=>Budgets.id),
    createdAt: varchar('createdAt').notNull()
});

export const Groups = pgTable('Groups', {
    id: uuid("id").defaultRandom().primaryKey(), 
    name: varchar('name').notNull(),
    createdBy: varchar('createdBy').notNull()
});

export const MemberGroups = pgTable('MemberGroups', {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar('email').notNull(),
    name: varchar('name').notNull(),
    groupId:uuid('groupId').references(()=>Groups.id),
});

export const GroupExpenses = pgTable('GroupExpenses', {
    expenseId: serial('expenseId').primaryKey(), 
    groupId:uuid('groupId').references(()=>Groups.id),
    createdAt: varchar('createdAt').notNull(),
    createdBy: varchar('createdBy').notNull(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    splitBetween: varchar('splitBetween', { array: true })
});

export const Graph = pgTable('Graph', {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId:uuid('groupId').references(()=>Groups.id),
    expenseId:integer('expenseId').references(()=>GroupExpenses.expenseId),
    from: varchar('from').notNull(),
    to: varchar('to').notNull(),
    amount: numeric('amount').notNull(),
});

export const PaymentHistory = pgTable('PaymentHistory', {
    id: serial('id').primaryKey(),
    groupId:uuid('groupId').references(()=>Groups.id),
    paymentId:uuid('paymentId').references(()=>Graph.id),
    date: varchar('date').notNull(),
    from: varchar('from').notNull(),
    to: varchar('to').notNull(),
    amount: numeric('amount').notNull(),
});