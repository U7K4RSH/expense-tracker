import { db } from '@/utils/dbConfig'
import { MemberGroups } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import React from 'react'

function GroupItem({ group }) {

    return (
        <Link href={'/dashboard/groups/' + group?.id}>
            <div className='p-5 border rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-[170px] bg-white'>
                <div className='flex gap-4 items-center justify-between'>
                    <div className='flex gap-4 items-center'>
                        <div>
                            <h2 className='text-xl font-semibold text-gray-800'>{group?.name}</h2>
                            <p className='text-sm text-gray-600'>Created by - {group?.createdBy}</p>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <svg className='w-6 h-6 text-blue-500' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l7-7-7-7m7 7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default GroupItem
