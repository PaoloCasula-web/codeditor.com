import { useState, useCallback, ReactNode } from 'react';

interface ResizablePanelProps {
  children: ReactNode;
  width?: number;
  height?: number;
  onResize: (size: number) => void;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  side?: 'left' | 'right';
}

export const ResizablePanel = ({
  children,
  width,
  height,
  onResize,
  minWidth = 100,
  maxWidth = 1000,
  minHeight = 100,
  maxHeight = 800,
  className = '',
  direction = 'horizontal',
  side = 'right'
}: ResizablePanelProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;
    const startSize = direction === 'horizontal' ? (width || 0) : (height || 0);

    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPosition - startPosition;
      
      let newSize;
      if (direction === 'horizontal') {
        newSize = side === 'left' ? startSize - delta : startSize + delta;
        newSize = Math.min(Math.max(newSize, minWidth), maxWidth);
      } else {
        newSize = startSize + delta;
        newSize = Math.min(Math.max(newSize, minHeight), maxHeight);
      }
      
      onResize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [direction, side, width, height, onResize, minWidth, maxWidth, minHeight, maxHeight]);

  const resizeHandleStyle = direction === 'horizontal' 
    ? 'absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-selection-bg transition-colors' +
      (side === 'left' ? ' left-0' : ' right-0')
    : 'absolute left-0 right-0 h-1 cursor-row-resize hover:bg-selection-bg transition-colors top-0';

  const panelStyle = {
    ...(direction === 'horizontal' && width ? { width: `${width}px` } : {}),
    ...(direction === 'vertical' && height ? { height: `${height}px` } : {})
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={panelStyle}
    >
      {children}
      <div
        className={resizeHandleStyle}
        onMouseDown={handleMouseDown}
        style={{ 
          backgroundColor: isResizing ? 'hsl(var(--selection-bg))' : 'transparent',
          zIndex: 10
        }}
      />
    </div>
  );
};