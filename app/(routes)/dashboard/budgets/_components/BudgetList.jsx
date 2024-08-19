"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'
import CreateBudget from './createBudget'

function BudgetList() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result)
  }
  useEffect(() => {
    user && getBudgetList();
  }, [user])
  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
          refreshData={() => getBudgetList()} />
        {(
          budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))
        )}

      </div>
    </div>
  )
}

export default BudgetList
