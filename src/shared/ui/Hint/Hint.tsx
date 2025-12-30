import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type HintProps = {
  open: boolean;
  target: HTMLElement | null;
  children: ReactNode;
  offset?: number;
  maxWidthPx?: number;
  forceOverflowVisible?: boolean;
};

/**
 * Hint (Tooltip-like) component displayed in a portal above all UI layers.
 *
 * The component positions itself near the target element, supports dynamic
 * repositioning on scroll/resize, and ensures the target element can
 * overflow visibly when required. Includes an arrow that automatically aligns
 * with the target.
 *
 * The tooltip uses `useLayoutEffect` to measure its size before final placement
 * to avoid flickering or incorrect positioning.
 *
 * @component
 *
 * @param {boolean} open
 *  Controls visibility of the hint. When `false`, nothing is rendered.
 *
 * @param {HTMLElement | null} target
 *  The DOM element to which the hint is anchored. Required when open.
 *
 * @param {ReactNode} children
 *  The content of the hint bubble.
 *
 * @param {number} [offset=12]
 *  Vertical distance between the bubble and the target element.
 *
 * @param {number} [maxWidthPx=420]
 *  Maximum width of the bubble in pixels before wrapping text.
 *  The component also ensures the bubble fits inside the viewport.
 *
 * @param {boolean} [forceOverflowVisible=true]
 *  When `true`, temporarily forces the target element's overflow to be `visible`
 *  so that the hint can appear outside its bounds, improving usability inside
 *  clipped containers.
 *
 * @description
 * - On mount, optionally modifies the target element's `position` and `overflow`
 *   styles to allow the bubble to display outside its bounding box.
 * - Uses a combination of `useEffect`, `useLayoutEffect`, `ResizeObserver`, and
 *   scroll/resize listeners to recalculate position whenever layout changes.
 * - The bubble is rendered via `createPortal` into `document.body`
 *   to escape stacking contexts.
 *
 * @example
 * ```tsx
 * <Hint open={isHovered} target={ref.current}>
 *   Some details about this item
 * </Hint>
 * ```
 */

export const Hint: React.FC<HintProps> = ({
  open,
  target,
  children,
  offset = 12,
  maxWidthPx = 420,
  forceOverflowVisible = true,
}) => {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    arrowLeft: number;
  }>({
    top: 0,
    left: 0,
    arrowLeft: 16,
  });

  useEffect(() => {
    if (!open || !target || !forceOverflowVisible) return;
    const originalPosition = target.style.position;
    const computedPos = getComputedStyle(target).position;
    if (computedPos === 'static') target.style.position = 'relative';
    const originalOverflow = target.style.overflow;
    target.style.overflow = 'visible';
    return () => {
      target.style.position = originalPosition;
      target.style.overflow = originalOverflow;
    };
  }, [open, target, forceOverflowVisible]);

  useLayoutEffect(() => {
    if (!open || !target) return;

    const arrow = 10;
    const vpPad = 8;

    const measureAndPlace = () => {
      const el = bubbleRef.current;
      if (!el) return;

      const prev = {
        vis: el.style.visibility,
        top: el.style.top,
        left: el.style.left,
        maxW: el.style.maxWidth,
        transform: el.style.transform,
      };
      el.style.visibility = 'hidden';
      el.style.top = '0px';
      el.style.left = '0px';
      el.style.transform = 'none';
      el.style.maxWidth = `min(${maxWidthPx}px, calc(100vw - ${vpPad * 2}px))`;

      const bRect = el.getBoundingClientRect();
      const bw = bRect.width;
      const bh = bRect.height;
      const tRect = target.getBoundingClientRect();

      const desiredLeft = tRect.left;
      const left = Math.max(
        vpPad,
        Math.min(desiredLeft, window.innerWidth - vpPad - bw),
      );

      const top = Math.max(vpPad, tRect.top - (bh + offset + arrow));

      const desiredArrowLeft = desiredLeft - left + 16;
      const arrowLeft = Math.max(8, Math.min(desiredArrowLeft, bw - 8));

      el.style.visibility = prev.vis;
      el.style.top = prev.top;
      el.style.left = prev.left;
      el.style.maxWidth = prev.maxW;
      el.style.transform = prev.transform;

      setPos({ top, left, arrowLeft });
    };

    // initial + reactive
    measureAndPlace();
    const onScroll = () => measureAndPlace();
    const onResize = () => measureAndPlace();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => measureAndPlace());
    ro.observe(target);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [open, target, offset, maxWidthPx]);

  if (!open || !target) return null;

  return createPortal(
    <div className='fixed inset-0 z-[9999999999] pointer-events-none'>
      <div
        ref={bubbleRef}
        role='tooltip'
        className='
          absolute
          rounded-2xl
          text-white text-sm leading-6 font-medium
          pointer-events-auto
        '
        style={{
          top: pos.top,
          left: pos.left,
          maxWidth: `min(${maxWidthPx}px, calc(100vw - 16px))`,
          backgroundColor: 'rgba(40,40,40,0.8)',
        }}
      >
        <div className='px-4 py-3'>{children}</div>

        <span
          className='
            absolute -bottom-[10px] h-0 w-0
            border-l-[10px] border-l-transparent
            border-r-[10px] border-r-transparent
            border-t-[10px]
          '
          style={{
            left: pos.arrowLeft,
            borderTopColor: 'rgba(40,40,40,0.8)',
          }}
        />
      </div>
    </div>,
    document.querySelector('#root-container')!,
  );
};
