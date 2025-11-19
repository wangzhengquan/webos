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
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div 
        className="flex items-end h-16 gap-2 px-4 pb-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
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

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 90, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = app.icon;

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className={`relative rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:brightness-110 transition-all active:brightness-90`}
        // Fallback background if no gradient is defined in app
        initial={{ y: 0 }}
        whileTap={{ y: 5 }}
      >
          {/* App Icon Background */}
          <div className={`absolute inset-0 rounded-xl ${app.color} opacity-90`} />
          
          {/* Icon SVG */}
          <div className="relative z-10 text-white">
              <Icon size="60%" strokeWidth={1.5} />
          </div>
      </motion.div>
      <div className={`w-1 h-1 rounded-full bg-black/60 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};