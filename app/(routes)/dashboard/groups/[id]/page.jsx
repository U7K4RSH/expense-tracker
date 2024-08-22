"use client"
import React, { useEffect, useState } from 'react';
import ManageGroup from './_components/ManageGroup';
import AddExpense from './_components/AddExpense';
import PriorityQueue from './_components/PriorityQueue';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { Graph, GroupExpenses, Groups, MemberGroups } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import ExpenseTable from './_components/ExpenseTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'

function GroupName({ params }) {
  const { user } = useUser();
  const [debt, setdebt] = useState([]);
  const [expenseList, setexpenseList] = useState([]);
  const [gname, setgname] = useState();
  const route = useRouter();

  const checkUser = async () => {
    try {
        const result = await db.select({ email: MemberGroups.email })
            .from(MemberGroups)
            .where(eq(MemberGroups.groupId, params.id));

        let x = 0;
        if (result.some(row => row.email === user?.primaryEmailAddress?.emailAddress)) {
            x = 1;
        }

        if (x === 0) {
            route.replace('/dashboard/groups');
        }
    } catch (error) {
        route.replace('/dashboard/groups');
    }
};

  
  const resolveDebt = async () => {
    const result = await db.select().from(Graph)
      .where(eq(Graph.groupId, params.id));

    let give = {}, take = {};
    for (const element of result) {
      if (!give[element.from]) {
        give[element.from] = 0;
      }
      if (!take[element.to]) {
        take[element.to] = 0;
      }

      give[element.from] += Number(element.amount);
      take[element.to] -= Number(element.amount);
    }
    for (const [name, amount] of Object.entries(take)) {
      if (!give[name]) {
        give[name] = 0;
      }
      give[name] += take[name];
    }

    let pq1 = new PriorityQueue();
    let pq2 = new PriorityQueue();

    for (const [name, amount] of Object.entries(give)) {
      if (amount < 0) {
        pq2.enqueue([Math.abs(amount), name]);
      } else {
        pq1.enqueue([Math.abs(amount), name]);
      }
    }
    const result2 = [];
    while (!pq1.isEmpty()) {
      let x = pq1.peek();
      let y = pq2.peek();
      if (x == null || y == null) {
        break;
      }
      if (x[0] < y[0]) {
        result2.push({ from: x[1], to: y[1], amount: x[0] });
        y[0] -= x[0];
        pq1.dequeue();
        pq2.dequeue();
        pq2.enqueue(y);
      } else if (x[0] > y[0]) {
        result2.push({ from: x[1], to: y[1], amount: y[0] });
        x[0] -= y[0];
        pq1.dequeue();
        pq2.dequeue();
        pq1.enqueue(x);
      } else {
        result2.push({ from: x[1], to: y[1], amount: x[0] });
        pq1.dequeue();
        pq2.dequeue();
      }
    }
    if (result2) {
      setdebt(result2);
    }
  }

  
  const getExpenseTable = async () => {
    const result = await db.select().from(GroupExpenses)
      .where(eq(GroupExpenses.groupId, params.id))
      .orderBy(desc(GroupExpenses.expenseId));
    if (result) {
      setexpenseList(result);
    }
  }

  const getName = async () => {
    const result = await db
      .select({ name: Groups.name })
      .from(Groups)
      .where(eq(Groups.id, params.id));
    
    if (result.length > 0) {
      setgname(result[0].name);
    }
  }

  const deleteGroup = async () => {
    await db.delete(Graph).where(eq(Graph.groupId, params.id));
    await db.delete(GroupExpenses).where(eq(GroupExpenses.groupId, params.id));
    await db.delete(MemberGroups).where(eq(MemberGroups.groupId, params.id));
    await db.delete(Groups).where(eq(Groups.id, params.id));
    toast('Group Deleted!');
    route.replace('/dashboard/groups');
  }

  useEffect(() => {
    if (user) {
      checkUser();
      resolveDebt();
      getExpenseTable();
      getName();
    }
  }, [user]);

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mt-2 p-3'>
        <h2 className='text-3xl font-bold text-blue-700'>
          {gname}
        </h2>
        <div className='flex gap-2 items-center'>
          <AddExpense params={params} refreshData={() => resolveDebt()} refreshData2={() => getExpenseTable()} />
          <ManageGroup params={params} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with expenses
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteGroup()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className='my-4 p-3'>
        <h2 className='text-xl font-semibold mb-2'>Debts</h2>
        {debt.length > 0 ? (
          <ul className='space-y-2'>
            {debt.map((entry, index) => (
              <li key={index} className='bg-gray-100 p-3 rounded-md shadow'>
                <span className='font-medium'>{entry.from}</span> owes{' '}
                <span className='font-medium'>{entry.to}</span> an amount of{' '}
                <span className='text-green-600 font-bold'>{(entry.amount).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500'>No debts to display</p>
        )}
      </div>
      <div className='p-3'>
        <ExpenseTable expenseList={expenseList} refreshData={() => resolveDebt()} refreshData2={() => getExpenseTable()} />
      </div>
    </div>
  )
}

export default GroupName
