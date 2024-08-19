"use client"
import React, { useEffect, useState } from 'react'
import CreateGroupExpense from './CreateGroupExpense'
import { db } from '@/utils/dbConfig'
import { Groups, MemberGroups } from '@/utils/schema'
import { eq, getTableColumns } from 'drizzle-orm';
import GroupItem from './GroupItem';
import { useUser } from '@clerk/nextjs';

function GroupList() {
    
    const { user } = useUser();
    const [groupList, setGroupList] = useState([]);
    
    const getGroupList = async () => {
        const result = await db.select({
            ...getTableColumns(Groups),
        }).from(Groups)
        .innerJoin(MemberGroups, eq(Groups.id, MemberGroups.groupId))
        .where(eq(MemberGroups.email, user?.primaryEmailAddress?.emailAddress))

        if (result) {
            console.log(result)
            setGroupList(result)
        }
    }
    
    useEffect(() => {
        user && getGroupList();
      }, [user])
  return (
    <div>
      <div className='mt-7'>
      <div className='grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateGroupExpense
          refreshData={() => getGroupList()} />
        {(
          groupList.map((group, index) => (
            <GroupItem key={index} group={group} />
          ))
        )}

      </div>
    </div>
    </div>
  )
}

export default GroupList
