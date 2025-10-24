import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Label } from '../Label/Label';
import type { ISliderItem } from '../../../features/MultiProduct/model/types';

interface ISliderProps {
  items: ISliderItem[];
  activeId?: ISliderItem['productId'];
  onSelect: (item: ISliderItem) => void;
  className?: string;
  stepRatio?: number;
}

export const Slider: React.FC<ISliderProps> = ({
  items,
  activeId,
  onSelect,
  className = '',
  stepRatio = 0.8,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxLeft = scrollWidth - clientWidth;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < maxLeft - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();

    const ro = new ResizeObserver(() => updateEdges());
    ro.observe(el);

    const onScroll = () => updateEdges();
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [updateEdges]);

  const scrollByStep = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = el.clientWidth * stepRatio * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div
      className={`flex items-center gap-2 w-full ${className}`}
      role='region'
      aria-label='Category slider'
    >
      <button
        type='button'
        aria-label='Scroll left'
        disabled={!canLeft}
        onClick={() => scrollByStep('left')}
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow
          ${canLeft ? 'bg-white hover:bg-gray-100' : 'bg-gray-200 opacity-60 cursor-not-allowed'}`}
      >
        <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
          <path
            d='M15 18l-6-6 6-6'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        className='
        no-scrollbar flex-1 overflow-hidden scroll-smooth
      '
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        }}
      >
        <div className='flex gap-3 sm:gap-4 py-2 min-w-min'>
          {items.map((it) => {
            const id = it.productId;
            const isActive = activeId === id;
            return (
              <div key={id} className='shrink-0'>
                <Label
                  text={it.name}
                  isActive={isActive}
                  onClick={() => onSelect(it)}
                />
              </div>
            );
          })}

          <div aria-hidden className='shrink-0 w-1 sm:w-4' />
        </div>
      </div>

      <button
        type='button'
        aria-label='Scroll right'
        disabled={!canRight}
        onClick={() => scrollByStep('right')}
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow
          ${canRight ? 'bg-black text-white hover:brightness-110' : 'bg-gray-200 text-gray-500 opacity-60 cursor-not-allowed'}`}
      >
        <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
          <path
            d='M9 6l6 6-6 6'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </button>
    </div>
  );
};
