"use client";
import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import { db } from '@/utils/dbConfig';
import { Graph, GroupExpenses, MemberGroups } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { toast } from 'sonner';

function AddExpense({ params, refreshData, refreshData2 }) {
    const [position, setPosition] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [expenseName, setexpenseName] = useState('');
    const [expenseAmount, setexpenseAmount] = useState('');

    const { user } = useUser();

    const handleCheckboxChange = (email) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(email)
                ? prevSelected.filter((item) => item !== email)
                : [...prevSelected, email]
        );
    };

    const getMembers = async () => {
        const result = await db
            .select({ email: MemberGroups.email, name:MemberGroups.name })
            .from(MemberGroups)
            .where(eq(MemberGroups.groupId, params.id));
        if (result) {
            setGroupMembers(result);
            setSelectedItems(result.map(member => member.name));
        }
    };
    
    const addExpense = async () => {
        const splitBetween = [...selectedItems];
        const result = await db.insert(GroupExpenses).values(
            {
                groupId:params.id,
                createdAt:moment().format("DD/MM/YYYY"),
                createdBy:position,
                name:expenseName,
                amount:expenseAmount,
                splitBetween:splitBetween
            }
        ).returning({insertedId:GroupExpenses.expenseId})
        const insertedId = result[0].insertedId;
        const splitAmount = (expenseAmount / selectedItems.length).toFixed(3);
        const to = position;
    
        const pairs = selectedItems
            .filter(from => from !== to)
            .map(from => ({
                expenseId:insertedId,
                groupId: params.id,
                from: from,
                to: to,
                amount: splitAmount,
            }));
    
        await Promise.all(pairs.map(pair => db.insert(Graph).values(pair)));
        
        if (result) {
            toast('Expense added successfully')
            refreshData();
            refreshData2();
        }
    };
    

    useEffect(() => {
        if (user) {
            getMembers();
        }
    }, [user]);

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"> <PlusCircle /> Add Expense</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Expense Name</h2>
                                    <Input
                                        placeholder="Bus"
                                        onChange={(e) => setexpenseName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Amount</h2>
                                    <Input
                                        type="Number"
                                        placeholder="e.g. $40"
                                        onChange={(e) => setexpenseAmount(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Split Between</h2>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="px-4 py-2 bg-gray-200 rounded-md">
                                            Select Options
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {groupMembers.map((member) => (
                                                <DropdownMenuItem
                                                    key={member.name} 
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        handleCheckboxChange(member.name);
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={selectedItems.includes(member.name)}
                                                        onCheckedChange={() => handleCheckboxChange(member.name)}
                                                    />
                                                    <span className="ml-2">{member.name}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Paid by</h2>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">{position.length>0 ? position : "Select"}</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                                {groupMembers.map((member) => (
                                                    <DropdownMenuRadioItem
                                                        key={member.name} 
                                                        value={member.name}
                                                    >
                                                        {member.name}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                disabled={!(expenseAmount&&expenseName&&selectedItems?.length>0&&(position.length!==0))}
                                onClick={addExpense}
                                className="mt-5 w-full">
                                Add Expense
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddExpense;
