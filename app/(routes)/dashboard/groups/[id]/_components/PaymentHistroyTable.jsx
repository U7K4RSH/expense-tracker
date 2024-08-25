import { Trash } from 'lucide-react';
import React from 'react';
import { db } from '@/utils/dbConfig';
import { Graph, PaymentHistory } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function PaymentHistroyTable({ PaymentHistoryList, refreshData, refreshData2 }) {

    const deletePayment = async (payment) => {
        await db.delete(PaymentHistory).where(eq(PaymentHistory.paymentId, payment.paymentId));
        const result = await db.delete(Graph).where(eq(Graph.id, payment.paymentId));
        if (result) {
            toast('Payment deleted');
            refreshData();
            refreshData2();
        }
    }

    return (
        <div>
            <h2 className='font-bold text-lg mb-3'>Payment History</h2>
            <div className='space-y-4'>
                {PaymentHistoryList.map((payment) => (
                    <div key={payment.paymentId} className='flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:bg-slate-100 transition-colors duration-200'>
                        <span>
                            <span className='font-semibold text-blue-600'>{payment.from}</span> paid 
                            <span className='font-semibold text-green-600'> ${payment.amount}</span> to 
                            <span className='font-semibold text-blue-600'> {payment.to}</span> on {payment.date}
                        </span>
                        <Trash
                            className='text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200'
                            onClick={() => deletePayment(payment)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentHistroyTable;
