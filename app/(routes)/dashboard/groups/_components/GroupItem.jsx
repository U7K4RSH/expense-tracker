import { db } from '@/utils/dbConfig'
import { MemberGroups } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import React, { useEffect } from 'react'

function GroupItem({group}) {

    return (
        <Link href={'/dashboard/groups/' + group?.id} >
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <div>
                            <h2 className='font-bold'>{group?.name}</h2>
                            <h2 className='font-bold'> Created by - {group?.createdBy}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default GroupItem
