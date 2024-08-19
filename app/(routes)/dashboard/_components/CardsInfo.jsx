import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardsInfo({budgetList}) {

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    const CalculateCardInfo = () =>{
        console.log(budgetList)
        let total_budget = 0
        let total_spent = 0
        budgetList.forEach(element => {
            total_budget = total_budget + Number(element.amount)
            total_spent = total_spent + element.totalSpent
        });
        setTotalBudget(total_budget)
        setTotalSpent(total_spent)
    }

    useEffect(()=>{
        budgetList&&CalculateCardInfo();
    },[budgetList])
  return (
    <div>
        {budgetList?.length>0 ?
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>Total Budget</h2>
            <h2 className='font-bold text-2xl'>${totalBudget}</h2>
        </div>
        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>Total Spent</h2>
            <h2 className='font-bold text-2xl'>${totalSpent}</h2>
        </div>
        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
      <div className='p-7 border rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>Number of Budgets</h2>
            <h2 className='font-bold text-2xl'>{budgetList?.length}</h2>
        </div>
        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
      </div>
    </div>:
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
    <div className='p-7 border rounded-lg flex items-center justify-between'>
      <div>
          <h2 className='text-sm'>Total Budget</h2>
          <h2 className='font-bold text-2xl'>$0</h2>
      </div>
      <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
    </div>
    <div className='p-7 border rounded-lg flex items-center justify-between'>
      <div>
          <h2 className='text-sm'>Total Spent</h2>
          <h2 className='font-bold text-2xl'>$0</h2>
      </div>
      <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
    </div>
    <div className='p-7 border rounded-lg flex items-center justify-between'>
      <div>
          <h2 className='text-sm'>Number of Budgets</h2>
          <h2 className='font-bold text-2xl'>0</h2>
      </div>
      <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
    </div>
  </div>
}
    </div>
  )
}

export default CardsInfo
