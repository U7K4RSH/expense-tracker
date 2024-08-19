"use client"
import React from 'react';
import Image from 'next/image';
import { LayoutGrid, PiggyBank, ReceiptText, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function SideNav({ toggleSidebar }) {
  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { id: 2, name: 'Budgets', icon: PiggyBank, path: '/dashboard/budgets' },
    { id: 3, name: 'Group Expenses', icon: ReceiptText, path: '/dashboard/groups' },
  ];

  const path = usePathname();

  return (
    <div className='h-full p-5 bg-white border-r shadow-sm relative'>
      {/* Close button for mobile */}
      <button 
        className='absolute top-4 right-4 md:hidden' 
        onClick={toggleSidebar}
      >
        <X className='text-gray-500' />
      </button>

      <Image src='/logo.svg' alt='logo' width={150} height={100} />

      <div className='mt-5'>
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2 className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer mb-2
              ${path === menu.path && 'text-primary bg-blue-100'}
              rounded-md hover:text-primary hover:bg-blue-100`}>
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      <div className='absolute bottom-5 left-5 flex gap-2 items-center'>
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;
