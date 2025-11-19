import React, { useState } from 'react';
import { Folder, FileText, Image, ChevronRight, HardDrive, Cloud, Clock, Download } from 'lucide-react';
import { FileNode } from '../types';

const MOCK_FILES: FileNode[] = [
  {
    id: 'desktop', name: 'Desktop', type: 'folder', children: [
      { id: 'f1', name: 'Project Specs.txt', type: 'file' },
      { id: 'f2', name: 'Screenshot.png', type: 'file' },
    ]
  },
  {
    id: 'docs', name: 'Documents', type: 'folder', children: [
      { id: 'd1', name: 'Resume.pdf', type: 'file' },
      { id: 'd2', name: 'Budget.xlsx', type: 'file' },
    ]
  },
  {
    id: 'pics', name: 'Pictures', type: 'folder', children: [
      { id: 'p1', name: 'Vacation.jpg', type: 'file' },
    ]
  },
];

export const FinderApp: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('desktop');
  const [history, setHistory] = useState<string[]>(['desktop']);

  const activeFolder = MOCK_FILES.find(f => f.id === activeId) || MOCK_FILES[0];

  const SidebarItem = ({ icon: Icon, label, id, active }: any) => (
    <div 
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ${active ? 'bg-gray-200/60 text-gray-900' : 'text-gray-600 hover:bg-gray-100/50'}`}
      onClick={() => setActiveId(id)}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex h-full bg-white/90">
      {/* Sidebar */}
      <div className="w-48 bg-gray-50/50 backdrop-blur-sm border-r border-gray-200 p-3 flex flex-col gap-4">
        <div>
          <div className="text-[10px] font-semibold text-gray-400 mb-1 px-2">Favorites</div>
          <SidebarItem icon={Cloud} label="AirDrop" />
          <SidebarItem icon={Clock} label="Recents" />
          <SidebarItem icon={FileText} label="Applications" />
          <SidebarItem icon={DesktopIcon} label="Desktop" id="desktop" active={activeId === 'desktop'} />
          <SidebarItem icon={Download} label="Downloads" />
        </div>
        <div>
          <div className="text-[10px] font-semibold text-gray-400 mb-1 px-2">Locations</div>
          <SidebarItem icon={HardDrive} label="Macintosh HD" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-4 text-gray-500">
            <div className="flex gap-2">
               <ChevronRight className="rotate-180 cursor-pointer hover:text-gray-800" size={20} />
               <ChevronRight className="cursor-pointer hover:text-gray-800" size={20} />
            </div>
            <span className="font-medium text-gray-800">{activeFolder.name}</span>
        </div>

        {/* File Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start">
            {activeFolder.children?.map(file => (
                <div key={file.id} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 group cursor-default">
                    {file.type === 'folder' 
                        ? <Folder size={48} className="text-blue-400 fill-blue-400/20" /> 
                        : <FileText size={40} className="text-gray-400" />
                    }
                    <span className="text-sm text-center text-gray-700 group-hover:text-blue-600 line-clamp-2 w-full break-words">
                        {file.name}
                    </span>
                </div>
            ))}
            {(!activeFolder.children || activeFolder.children.length === 0) && (
                <div className="col-span-4 text-center text-gray-400 mt-10">Folder is empty</div>
            )}
        </div>
        
        {/* Footer Status */}
        <div className="h-6 border-t border-gray-200 bg-gray-50 flex items-center px-4 text-xs text-gray-500">
            {activeFolder.children?.length || 0} items
        </div>
      </div>
    </div>
  );
};

const DesktopIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);