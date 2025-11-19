import { ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: ReactNode;
  appId: string;
}

export interface AppConfig {
  id: string;
  title: string;
  icon: any; // Lucide icon or image url
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  component: React.FC<any>;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  content?: string;
}

export interface Point {
  x: number;
  y: number;
}