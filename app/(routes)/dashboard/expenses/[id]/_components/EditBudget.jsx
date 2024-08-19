"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({ budgetInfo, refreshData }) {

    const [emojiIcon, setEmojiIcon] = useState();
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const { user } = useUser();

    const onUpdateBudget = async () => {
        const result = await db.update(Budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon,
        }).where(eq(Budgets.id,budgetInfo.id))
        .returning();

        if (result) {
            toast('Budget Updated')
            refreshData();
        }
    }

    useEffect(()=>{
        if (budgetInfo) {
            setEmojiIcon(budgetInfo?.icon)
            setAmount(budgetInfo?.amount)
            setName(budgetInfo?.name)
        }
    },[budgetInfo])

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"> <PenBox /> Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            {budgetInfo ? (
                                <div className='mt-5'>
                                    <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                        {emojiIcon}
                                    </Button>
                                    {openEmojiPicker && (
                                        <div className='absolute z-20'>
                                            <EmojiPicker
                                                onEmojiClick={(e) => {
                                                    setEmojiIcon(e.emoji)
                                                    setOpenEmojiPicker(false)
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className='mt-2'>
                                        <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                        <Input
                                            placeholder="e.g. Food"
                                            defaultValue={name}
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className='mt-2'>
                                        <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                        <Input
                                            type="number"
                                            defaultValue={amount}
                                            placeholder="e.g. $10"
                                            onChange={(e) => setAmount(e.target.value)} />
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={() => onUpdateBudget()}
                                className="mt-5 w-full">
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget
