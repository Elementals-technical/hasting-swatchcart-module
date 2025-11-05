import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type HintProps = {
  open: boolean;
  target: HTMLElement | null;
  children: ReactNode;
  side?: 'top' | 'bottom';
  offset?: number;
  maxWidthPx?: number;
  forceOverflowVisible?: boolean;
};

export const Hint: React.FC<HintProps> = ({
  open,
  target,
  children,
  side = 'bottom',
  offset = 8,
  forceOverflowVisible = true,
}) => {
  useEffect(() => {
    if (!open || !target || !forceOverflowVisible) return;

    const originalPosition = target.style.position;
    const computedPos = getComputedStyle(target).position;

    if (computedPos === 'static') {
      target.style.position = 'relative';
    }

    const originalOverflow = target.style.overflow;
    target.style.overflow = 'visible';

    return () => {
      target.style.position = originalPosition;
      target.style.overflow = originalOverflow;
    };
  }, [open, target, forceOverflowVisible]);

  if (!open || !target) return null;

  const positionStyle =
    side === 'bottom'
      ? { left: '50%', bottom: `${offset}px` }
      : { left: '50%', top: `${offset}px` };

  return createPortal(
    <div
      role='tooltip'
      className='
        absolute z-[60000] pointer-events-none select-none
        px-3 py-2 rounded-2xl shadow-lg
        text-white text-xs leading-5 font-medium
      '
      style={{
        ...positionStyle,
        whiteSpace: 'nowrap',
        width: 'max-content',
        minWidth: 'max-content',
        maxWidth: 'calc(100vw - 16px)',
        overflow: 'visible',
        backgroundColor: 'rgba(40,40,40,0.5)',
        backdropFilter: 'saturate(120%) blur(2px)',
      }}
    >
      {children}
    </div>,
    target,
  );
};
