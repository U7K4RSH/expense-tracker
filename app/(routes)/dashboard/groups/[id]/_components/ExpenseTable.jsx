import { Trash } from 'lucide-react';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from '@/utils/dbConfig';
import { Graph, GroupExpenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function ExpenseTable({ expenseList, refreshData, refreshData2 }) {
    const parseSplitBetween = (splitBetween) => {
        // Remove curly braces and split by comma
        const cleanString = splitBetween.replace(/^\{|\}$/g, ''); // Remove curly braces
        const emailArray = cleanString.split(',').map(email => email.trim().replace(/"/g, '')); // Split by comma and remove quotes
        return emailArray;
    };

    const deleteExpense = async (expense) => {
        await db.delete(Graph).where(eq(Graph.expenseId, expense.expenseId));
        const result = await db.delete(GroupExpenses).where(eq(GroupExpenses.expenseId, expense.expenseId));
        if (result) {
            toast('Expense deleted');
            refreshData();
            refreshData2();
        }
    }

    return (
        <div>
            <h2 className='font-bold text-lg mb-3'>Expenses History</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
                    <thead>
                        <tr className='bg-slate-200 text-left'>
                            <th className='p-4 font-bold'>Name</th>
                            <th className='p-4 font-bold'>Amount</th>
                            <th className='p-4 font-bold'>Date</th>
                            <th className='p-4 font-bold'>Paid By</th>
                            <th className='p-4 font-bold'>Split Between</th>
                            <th className='p-4 font-bold'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseList.map((expense) => (
                            <tr key={expense.expenseId} className='border-b border-slate-200 hover:bg-slate-100'>
                                <td className='p-4'>{expense.name}</td>
                                <td className='p-4'>{expense.amount}</td>
                                <td className='p-4'>{expense.createdAt}</td>
                                <td className='p-4'>{expense.createdBy}</td>
                                <td className='p-4'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="px-4 py-2 bg-gray-200 rounded-md">
                                            View Members
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {parseSplitBetween(expense.splitBetween).map((email, index) => (
                                                <DropdownMenuItem key={index}>
                                                    {email}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                                <td className='p-4'>
                                    <Trash
                                        className='text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200'
                                        onClick={() => deleteExpense(expense)}
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

export default ExpenseTable;
