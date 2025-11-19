import React, { useRef } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../../types';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { motion, Variants } from 'framer-motion';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  launchOrigin?: DOMRect;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  launchOrigin
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { position, onMouseDown, isDragging } = useWindowDrag(windowRef, headerRef, {
    initialPosition: windowState.position,
    isMaximized: windowState.isMaximized,
    onPositionChange: (pos) => onMove(windowState.id, pos.x, pos.y),
  });

  // Calculate animation origin (default to center screen if no dock position found)
  const initialX = launchOrigin ? launchOrigin.x + launchOrigin.width / 2 - windowState.size.width / 2 : window.innerWidth / 2;
  const initialY = launchOrigin ? launchOrigin.y + launchOrigin.height / 2 - windowState.size.height / 2 : window.innerHeight;

  const variants: Variants = {
    initial: {
        x: initialX,
        y: initialY,
        scale: 0,
        opacity: 0,
    },
    animate: {
        x: windowState.isMaximized ? 0 : position.x,
        y: windowState.isMaximized ? 0 : position.y,
        scale: 1,
        opacity: 1,
        width: windowState.isMaximized ? '100vw' : windowState.size.width,
        height: windowState.isMaximized ? '100vh' : windowState.size.height,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
        }
    },
    minimized: {
        x: initialX,
        y: initialY,
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1] // "Suck" effect curve
        }
    },
    exit: {
        x: initialX,
        y: initialY,
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
  };

  return (
    <motion.div
        ref={windowRef}
        variants={variants}
        initial="initial"
        animate={windowState.isMinimized ? "minimized" : "animate"}
        exit="exit"
        className={`absolute shadow-2xl rounded-xl overflow-hidden border border-white/20 bg-white/80 backdrop-blur-xl flex flex-col ${isDragging ? 'select-none' : ''} ${windowState.isMinimized ? 'pointer-events-none' : 'pointer-events-auto'}`}
        style={{
            zIndex: windowState.zIndex,
            // We remove explicit left/top here because Framer Motion manages x/y in variants
        }}
        onMouseDown={() => onFocus(windowState.id)}
    >
        {/* Title Bar */}
        <div
        ref={headerRef}
        className="h-10 bg-gray-200/50 flex items-center px-4 select-none cursor-default w-full border-b border-white/20 transition-colors hover:bg-gray-200/70"
        onDoubleClick={() => onMaximize(windowState.id)}
        onMouseDown={onMouseDown}
        >
        <div className="flex gap-2 group">
            <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
            >
            <X size={8} strokeWidth={3} />
            </button>
            <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
            >
            <Minus size={8} strokeWidth={3} />
            </button>
            <button
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
            >
            <Square size={6} strokeWidth={3} fill="currentColor" />
            </button>
        </div>
        <div className="flex-1 text-center text-sm font-semibold text-gray-700 pointer-events-none truncate px-4">
            {windowState.title}
        </div>
        <div className="w-14" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative bg-white/50">
        {windowState.component}
        </div>
    </motion.div>
  );
};