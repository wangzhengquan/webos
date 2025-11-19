import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Battery, Search, Command } from 'lucide-react';

interface MenuBarProps {
  activeAppTitle: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ activeAppTitle }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 w-full bg-white/30 backdrop-blur-md flex items-center justify-between px-4 text-sm font-medium text-gray-900 shadow-sm z-50 relative select-none">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg hover:opacity-70 cursor-pointer"></span>
        <span className="font-bold hidden sm:block">{activeAppTitle}</span>
        <div className="hidden md:flex gap-4 font-normal text-gray-800">
          <span className="hover:bg-white/20 px-2 rounded cursor-default">File</span>
          <span className="hover:bg-white/20 px-2 rounded cursor-default">Edit</span>
          <span className="hover:bg-white/20 px-2 rounded cursor-default">View</span>
          <span className="hover:bg-white/20 px-2 rounded cursor-default">Window</span>
          <span className="hover:bg-white/20 px-2 rounded cursor-default">Help</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex gap-3 items-center text-gray-700">
           <Battery size={18} className="rotate-90" />
           <Wifi size={16} />
           <Search size={16} />
           <Command size={16} />
        </div>
        
        <div className="flex gap-2">
            <span>{format(time, 'EEE MMM d')}</span>
            <span>{format(time, 'h:mm aa')}</span>
        </div>
      </div>
    </div>
  );
};