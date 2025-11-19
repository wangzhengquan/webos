import { useState, useEffect, useCallback, RefObject } from 'react';
import { Point } from '../types';

interface DragOptions {
  initialPosition: Point;
  isMaximized?: boolean;
  onPositionChange?: (pos: Point) => void;
}

export const useWindowDrag = (
  ref: RefObject<HTMLElement>,
  handleRef: RefObject<HTMLElement>,
  options: DragOptions
) => {
  const [position, setPosition] = useState<Point>(options.initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    // Sync internal state if external prop changes (e.g. restore from maximize)
    if (!options.isMaximized) {
       setPosition(options.initialPosition);
    }
  }, [options.initialPosition, options.isMaximized]);

  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (options.isMaximized || !ref.current) return;
    
    // Only start drag if clicking the handle
    if (handleRef.current && !handleRef.current.contains(e.target as Node)) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  }, [options.isMaximized, ref, handleRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const nextPos = { x: newX, y: newY };
    setPosition(nextPos);
    if (options.onPositionChange) {
      options.onPositionChange(nextPos);
    }
  }, [isDragging, offset, options]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { position, isDragging };
};