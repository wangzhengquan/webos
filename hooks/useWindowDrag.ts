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

  // Sync internal state if external prop changes (e.g. restore from maximize)
  // But DO NOT sync while dragging to avoid state loops
  useEffect(() => {
    if (!isDragging && !options.isMaximized) {
       setPosition(options.initialPosition);
    }
  }, [options.initialPosition, options.isMaximized, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (options.isMaximized || !ref.current) return;
    
    // Check if click is within handle if handleRef is provided
    // Note: We use contains to allow children of the handle (like text) to trigger drag
    if (handleRef.current && !handleRef.current.contains(e.target as Node)) {
      return;
    }

    // Use logical position from state instead of visual position from DOM
    // This prevents jumps caused by CSS transforms (like scaling animations)
    // or mismatches between visual and logical coordinates.
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsDragging(true);
  }, [options.isMaximized, ref, handleRef, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const nextPos = { x: newX, y: newY };
    setPosition(nextPos);
    
    // Sync with parent state (can be debounced in production for perf)
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

  // Return onMouseDown so it can be attached to the element
  return { position, isDragging, onMouseDown: handleMouseDown };
};