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
        const result2 = await db.delete(Graph)
        .where(eq(Graph.expenseId, expense.expenseId))
        const result = await db.delete(GroupExpenses)
        .where(eq(GroupExpenses.expenseId, expense.expenseId))
        if (result) {
            toast('Expense deleted')
            refreshData();
            refreshData2();
        }
    }

    return (
        <div>
            <h2 className='font-bold text-lg'>Expenses History</h2>
            <div className='grid grid-cols-6 bg-slate-200 p-2 mt-3'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Paid By</h2>
                <h2 className='font-bold'>Split Between</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expenseList.map((expense) => (
                <div key={expense.expenseId} className='grid grid-cols-6 bg-slate-50 p-2'>
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>
                    <h2>{expense.createdBy}</h2>
                    <h2>
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
                    </h2>
                    <h2>
                        <Trash
                            className='text-red-600 cursor-pointer'
                            onClick={() => deleteExpense(expense)}
                        />
                    </h2>
                </div>
            ))}
        </div>
    );
}

export default ExpenseTable;
