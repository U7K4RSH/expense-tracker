import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({expensesList, refreshData}) {

  const deleteExpense = async (expenses) => {
      const result = await db.delete(Expenses)
      .where(eq(Expenses.id, expenses.id))
      .returning();
      if (result) {
          toast('Expense Deleted!');
          refreshData();
      }
  }

  return (
      <div className='mt-3'>
          <h2 className='font-bold text-lg mb-3'>Latest Expenses</h2>
          <div className='overflow-x-auto'>
              <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
                  <thead>
                      <tr className='bg-slate-200 text-left'>
                          <th className='p-4 font-bold'>Name</th>
                          <th className='p-4 font-bold'>Amount</th>
                          <th className='p-4 font-bold'>Date</th>
                          <th className='p-4 font-bold'>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {expensesList.map((expenses) => (
                          <tr key={expenses.id} className='border-b border-slate-200 hover:bg-slate-100'>
                              <td className='p-4'>{expenses.name}</td>
                              <td className='p-4'>{expenses.amount}</td>
                              <td className='p-4'>{expenses.createdAt}</td>
                              <td className='p-4'>
                                  <Trash
                                      className='text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200'
                                      onClick={() => deleteExpense(expenses)}
                                  />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default ExpenseListTable;
