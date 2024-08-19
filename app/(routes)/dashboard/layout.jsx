"use client"
import React, { useState } from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';

function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Sidebar */}
      <div className={`fixed md:w-64 h-screen z-30 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <SideNav toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className='fixed inset-0 z-20 bg-black opacity-50 md:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className={`md:ml-64 transition-all duration-300`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className='p-4'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
