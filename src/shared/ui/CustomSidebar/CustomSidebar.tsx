import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import s from './CustomSidebar.module.scss';
import { CloseIconSVG } from '../../../app/assets/svg/CloseIconSVG';
import { cn } from '../../utils/cn';

type SidebarProps = {
  isOpen?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const CustomSidebar: React.FC<SidebarProps> = ({
  children,
  isOpen,
  setIsOpen,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const closeSidebar = () => setIsOpen(false);

  useLayoutEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    } else {
      lastActiveRef.current?.focus?.();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={clsx(s.overlay)}
      onMouseDown={closeSidebar}
      onTouchStart={closeSidebar}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          s.panel,
          s.right,
          isOpen ? s.enter : s.exit,
          'bg-[var(--sidebar-bg)]',
        )}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <header className='flex p-[var(--sm-padding)] justify-between items-center border-b border-solid border-[var(--border)] sm:p-[var(--padding)]'>
          <h2 className={s.title}>Order free swatches</h2>
          <button
            className={cn(s.closeBtn, 'flex', 'justify-center', 'items-center')}
            onClick={closeSidebar}
          >
            <CloseIconSVG width={10} height={10} />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default CustomSidebar;
