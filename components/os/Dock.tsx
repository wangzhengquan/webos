import React from 'react';
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AppConfig } from '../../types';

interface DockProps {
  apps: AppConfig[];
  openAppIds: string[];
  onAppClick: (app: AppConfig) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, openAppIds, onAppClick }) => {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div 
        className="pointer-events-auto flex items-end justify-center h-20 gap-4 px-4 pb-3 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
        onMouseLeave={() => mouseX.set(null)}
        onMouseMove={(e) => mouseX.set(e.pageX)}
      >
        {apps.map((app) => (
          <DockIcon 
            key={app.id} 
            app={app} 
            mouseX={mouseX} 
            isOpen={openAppIds.includes(app.id)}
            onClick={() => onAppClick(app)}
          />
        ))}
      </div>
    </div>
  );
};

interface DockIconProps {
  app: AppConfig;
  mouseX: MotionValue<number | null>;
  isOpen: boolean;
  onClick: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({ app, mouseX, isOpen, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val ? val - bounds.x - bounds.width / 2 : Infinity;
  });

  // Adjusted scaling for a more natural feel
  const widthSync = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = app.icon;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className="relative rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:brightness-110 transition-all origin-bottom"
      >
          {/* App Icon Background */}
          <div className={`absolute inset-0 rounded-2xl ${app.color} opacity-90 shadow-inner`} />
          
          {/* Icon SVG - Centered */}
          <div className="relative z-10 text-white w-full h-full flex items-center justify-center drop-shadow-md">
              <Icon size="50%" strokeWidth={2} />
          </div>
      </motion.div>
      
      {/* Open Indicator */}
      <div className={`w-1.5 h-1.5 rounded-full bg-gray-800/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />
    </div>
  );
};