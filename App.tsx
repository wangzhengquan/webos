import React, { useState } from 'react';
import { AppConfig, WindowState } from './types';
import { WALLPAPERS, INITIAL_WINDOW_POS, AppID } from './constants';
import { MenuBar } from './components/os/MenuBar';
import { Dock } from './components/os/Dock';
import { WindowFrame } from './components/ui/WindowFrame';
import { FinderApp } from './apps/FinderApp';
import { TerminalApp } from './apps/TerminalApp';
import { GeminiApp } from './apps/GeminiApp';
import { SettingsApp } from './apps/SettingsApp';
import { Folder, Terminal, Sparkles, Settings, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [wallpaper, setWallpaper] = useState(WALLPAPERS.monterey);
  const [activeAppTitle, setActiveAppTitle] = useState<string>('Finder');
  
  // List of available apps
  const APPS: AppConfig[] = [
    { 
        id: AppID.FINDER, 
        title: 'Finder', 
        icon: Folder, 
        color: 'bg-blue-500',
        defaultWidth: 800,
        defaultHeight: 500,
        component: FinderApp 
    },
    { 
        id: AppID.TERMINAL, 
        title: 'Terminal', 
        icon: Terminal, 
        color: 'bg-gray-800',
        defaultWidth: 600,
        defaultHeight: 400,
        component: TerminalApp 
    },
    { 
        id: AppID.GEMINI, 
        title: 'Gemini Intelligence', 
        icon: Sparkles, 
        color: 'bg-gradient-to-br from-blue-400 to-purple-500',
        defaultWidth: 400,
        defaultHeight: 600,
        component: GeminiApp 
    },
    { 
        id: AppID.SETTINGS, 
        title: 'Settings', 
        icon: Settings, 
        color: 'bg-gray-400',
        defaultWidth: 700,
        defaultHeight: 500,
        component: (props) => <SettingsApp {...props} setWallpaper={setWallpaper} />
    },
    {
        id: AppID.SAFARI,
        title: 'Safari',
        icon: Globe,
        color: 'bg-blue-400',
        defaultWidth: 800,
        defaultHeight: 600,
        component: () => <div className="flex items-center justify-center h-full text-gray-400 bg-white">Safari Mockup - Use Gemini for web queries</div>
    }
  ];

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Window Management Actions
  const openApp = (app: AppConfig) => {
    // Check if already open
    const existingWindow = windows.find(w => w.appId === app.id);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        // Restore if minimized
        setWindows(prev => prev.map(w => 
            w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
        ));
        setNextZIndex(n => n + 1);
        setActiveAppTitle(existingWindow.title);
      } else {
        // Just bring to front
        focusWindow(existingWindow.id);
      }
      return;
    }

    // Open new window
    const newWindow: WindowState = {
      id: `${app.id}-${Date.now()}`,
      appId: app.id,
      title: app.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { 
          x: INITIAL_WINDOW_POS.x + (windows.length * 30), 
          y: INITIAL_WINDOW_POS.y + (windows.length * 30) 
      },
      size: { width: app.defaultWidth, height: app.defaultHeight },
      zIndex: nextZIndex,
      component: <app.component />,
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(n => n + 1);
    setActiveAppTitle(app.title);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveAppTitle('Finder');
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveAppTitle('Finder'); // Switch focus to Finder when minimizing (simplification)
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (win) {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
        setNextZIndex(n => n + 1);
        setActiveAppTitle(win.title);
    }
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  return (
    <div 
        className="h-screen w-screen overflow-hidden bg-cover bg-center relative"
        style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Desktop Layer (Clicking background resets focus to Finder roughly) */}
      <div className="absolute inset-0" onClick={() => setActiveAppTitle('Finder')} />

      <MenuBar activeAppTitle={activeAppTitle} />

      {/* Windows Layer */}
      <div className="relative w-full h-full pointer-events-none">
        {windows.map(window => (
            <div key={window.id} className="pointer-events-auto">
                <WindowFrame
                    windowState={window}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    onMaximize={maximizeWindow}
                    onFocus={focusWindow}
                    onMove={moveWindow}
                />
            </div>
        ))}
      </div>

      <Dock 
        apps={APPS} 
        openAppIds={windows.map(w => w.appId)}
        onAppClick={openApp}
      />
    </div>
  );
};

export default App;