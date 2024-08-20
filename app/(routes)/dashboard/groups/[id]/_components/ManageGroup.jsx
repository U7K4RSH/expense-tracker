"use client"
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
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
import React, { useState } from 'react'
import { db } from '@/utils/dbConfig';
import { MemberGroups } from '@/utils/schema';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input'

function ManageGroup({params, refreshData}) {

    const [email, setEmail] = useState();
    const [name, setName] = useState();

    const onUpdateMembers = async () => {
        const result = await db.insert(MemberGroups).values({
            email:email,
            name:name,
            groupId:params.id,
        });

        if (result) {
            toast('Member added successfully')
            refreshData();
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"> <PlusCircle /> Add Member</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Member</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Name</h2>
                                    <Input
                                        placeholder="e.g. joe@example.com"
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Email id</h2>
                                    <Input
                                        placeholder="e.g. joe@example.com"
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                disabled={!(email)}
                                onClick={() => onUpdateMembers()}
                                className="mt-5 w-full">
                                Add Member
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManageGroup
