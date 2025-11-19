import React from 'react';
import { Image, Monitor, Battery, Wifi, Volume2 } from 'lucide-react';
import { WALLPAPERS } from '../constants';

interface SettingsProps {
    setWallpaper: (url: string) => void;
}

export const SettingsApp: React.FC<SettingsProps> = ({ setWallpaper }) => {
  return (
    <div className="h-full flex bg-gray-100">
        <div className="w-1/3 bg-white/50 border-r border-gray-200 p-4 space-y-1">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500 text-white">
                <Image size={18} />
                <span className="text-sm font-medium">Wallpaper</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 text-gray-700">
                <Monitor size={18} />
                <span className="text-sm font-medium">Displays</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 text-gray-700">
                <Battery size={18} />
                <span className="text-sm font-medium">Battery</span>
            </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Wallpaper</h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(WALLPAPERS).map(([name, url]) => (
                    <div 
                        key={name}
                        className="cursor-pointer group space-y-2"
                        onClick={() => setWallpaper(url)}
                    >
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all shadow-sm">
                            <img src={url} alt={name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="text-center text-xs font-medium capitalize text-gray-600">{name}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};