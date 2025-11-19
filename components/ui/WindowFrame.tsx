import React, { useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../../types';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { motion, AnimatePresence } from 'framer-motion';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { position } = useWindowDrag(windowRef, headerRef, {
    initialPosition: windowState.position,
    isMaximized: windowState.isMaximized,
    onPositionChange: (pos) => onMove(windowState.id, pos.x, pos.y),
  });

  if (windowState.isMinimized) return null;

  return (
    <AnimatePresence>
      {windowState.isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={windowRef}
          className={`absolute shadow-2xl rounded-xl overflow-hidden border border-white/20 bg-white/80 backdrop-blur-xl flex flex-col`}
          style={{
            width: windowState.isMaximized ? '100vw' : windowState.size.width,
            height: windowState.isMaximized ? '100vh' : windowState.size.height,
            left: windowState.isMaximized ? 0 : position.x,
            top: windowState.isMaximized ? 0 : position.y,
            zIndex: windowState.zIndex,
          }}
          onMouseDown={() => onFocus(windowState.id)}
        >
          {/* Title Bar */}
          <div
            ref={headerRef}
            className="h-10 bg-gray-200/50 flex items-center px-4 select-none cursor-default w-full"
            onDoubleClick={() => onMaximize(windowState.id)}
          >
            <div className="flex gap-2 group">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
                className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
              >
                <X size={8} strokeWidth={3} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
                className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
              >
                <Minus size={8} strokeWidth={3} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
                className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
              >
                <Square size={6} strokeWidth={3} fill="currentColor" />
              </button>
            </div>
            <div className="flex-1 text-center text-sm font-semibold text-gray-700 pointer-events-none">
              {windowState.title}
            </div>
            <div className="w-14" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto relative bg-white/50">
            {windowState.component}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};