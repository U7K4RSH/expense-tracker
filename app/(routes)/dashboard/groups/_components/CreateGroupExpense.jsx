"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Groups, MemberGroups } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function CreateGroupExpense({refreshData}) {
    const [name, setName] = useState('');
    const {user} = useUser();
    
    const onCreateGroupExpense = async () => {
        const result = await db.insert(Groups).values({
            name:name,
            createdBy:user?.fullName,
        }).returning({insertedId:Groups.id})

        const result2 = await db.insert(MemberGroups).values({
            email:user?.primaryEmailAddress?.emailAddress,
            name:user?.fullName,
            groupId:result[0].insertedId
        })

        if (result&&result2) {
            toast('New Budget Created!')
            refreshData();
          }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed
                        cursor-pointer hover:shadow-md'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create New Group</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Group Name</h2>
                                    <Input
                                        placeholder="e.g. Food"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!name}
                                onClick={onCreateGroupExpense}
                                className="mt-5 w-full bg-blue-500 text-white"
                            >
                                Create Group
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateGroupExpense;
