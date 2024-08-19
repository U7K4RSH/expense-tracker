import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';

function DashboardHeader({ toggleSidebar }) {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center'>
      <button 
        className='md:hidden text-gray-500' 
        onClick={toggleSidebar}
      >
        <Menu className='w-6 h-6' />
      </button>
      <div>
        <h2 className='font-bold text-3xl'>Expense Tracker</h2>
      </div>
      <div>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: '40px',
                height: '40px',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default DashboardHeader;
