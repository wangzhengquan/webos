import React, { useLayoutEffect, useRef } from 'react';
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AppConfig } from '../../types';

interface DockProps {
  apps: AppConfig[];
  openAppIds: string[];
  onAppClick: (app: AppConfig) => void;
  onLayout?: (appId: string, rect: DOMRect) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, openAppIds, onAppClick, onLayout }) => {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div 
        className="flex items-end h-20 gap-3 px-3 pb-3 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl"
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
            onLayout={onLayout}
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
  onLayout?: (appId: string, rect: DOMRect) => void;
}

const DockIcon: React.FC<DockIconProps> = ({ app, mouseX, isOpen, onClick, onLayout }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val ? val - bounds.x - bounds.width / 2 : Infinity;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = app.icon;

  // Measure position for genie effect
  useLayoutEffect(() => {
    const updatePosition = () => {
      if (ref.current && onLayout) {
        const rect = ref.current.getBoundingClientRect();
        onLayout(app.id, rect);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [app.id, onLayout]);

  return (
    <div className="flex flex-col items-center gap-1 h-full justify-end">
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className={`relative rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transition-all will-change-transform`}
        initial={{ y: 0 }}
        whileHover={{ y: -8 }}
        whileTap={{ y: 0 }}
      >
          {/* App Icon Background */}
          <div className={`absolute inset-0 rounded-2xl ${app.color} opacity-90 shadow-inner transition-all duration-200 group-hover:brightness-110`} />
          
          {/* Icon SVG */}
          <div className="relative z-10 text-white w-full h-full flex items-center justify-center drop-shadow-sm p-2">
              <Icon className="w-full h-full" strokeWidth={1.5} />
          </div>
      </motion.div>
      <div className={`w-1 h-1 rounded-full bg-black/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />
    </div>
  );
};