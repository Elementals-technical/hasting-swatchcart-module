import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Label } from '../Label/Label';
import type {
  IProductCart,
  ISliderItem,
} from '../../../features/MultiProduct/model/types';
import { ChevronSVGIcon } from '../../../app/assets/svg/ChevronSVGIcon';

interface ISliderProps {
  items: ISliderItem[] | IProductCart[];
  activeId?: ISliderItem['productId'] | IProductCart['productId'];
  onSelect: (item: ISliderItem | IProductCart) => void;
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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
    const EPS = 0.5;

    setCanLeft(el.scrollLeft > EPS);
    setCanRight(remaining > EPS);
  }, []);

  useLayoutEffect(() => {
    rafRef.current = requestAnimationFrame(updateEdges);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length, updateEdges]);

  useEffect(() => {
    const el = scrollerRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    updateEdges();

    const roScroller = new ResizeObserver(() => updateEdges());
    const roContent = new ResizeObserver(() => updateEdges());
    roScroller.observe(el);
    roContent.observe(content);

    const onScroll = () => updateEdges();
    el.addEventListener('scroll', onScroll, { passive: true });

    if ('fonts' in document) {
      document.fonts?.ready?.then(() => updateEdges());
    }

    return () => {
      roScroller.disconnect();
      roContent.disconnect();
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
          ${canLeft ? 'bg-black text-white hover:brightness-110' : 'bg-gray-200 text-gray-500 opacity-60 cursor-not-allowed'}`}
      >
        <ChevronSVGIcon className='w-4 h-4 rotate-360' />{' '}
      </button>

      <div
        ref={scrollerRef}
        className='no-scrollbar flex-1 overflow-hidden scroll-smooth'
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        }}
      >
        <div ref={contentRef} className='flex gap-3 sm:gap-4 py-2 min-w-min'>
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
          ${canRight ? 'bg-black text-white hover:brightness-110' : 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'}`}
      >
        <ChevronSVGIcon className='w-4 h-4 rotate-180' />{' '}
        {/* RIGHT → no rotation */}
      </button>
    </div>
  );
};
