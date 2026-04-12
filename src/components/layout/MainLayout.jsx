import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-bold text-lg text-primary ml-2 mb-0.5">SmartSociety</span>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
