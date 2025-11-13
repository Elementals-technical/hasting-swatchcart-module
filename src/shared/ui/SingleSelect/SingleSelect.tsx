import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react';
import { PopoverTooltip } from '../PopoverTooltip/PopoverTooltip';
import { cn } from '../../utils/cn';
import { ISingleSelectOption } from '../../../features/MultiProduct/model/types';

interface SingleSelectProps {
  values: ISingleSelectOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  title?: string;
  className?: string;
  dropdownWidth?: string;
  align?: 'start' | 'center' | 'end';
  showClear?: boolean;
  getTooltipByMaterialAndSection?: (material: string, section: string) => any;
  sectionName?: string;
}

const SingleSelect = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  SingleSelectProps
>(
  (
    {
      values: options,
      value,
      onValueChange,
      placeholder = 'Sort by',
      title,
      className,
      dropdownWidth,
      align = 'start',
      showClear = false,
      getTooltipByMaterialAndSection,
      sectionName,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const popoverContentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isOpen) return;

      const handleScroll = (event: Event) => {
        const target = event.target as Element;
        const el = popoverContentRef.current;
        if (el && (el.contains(target) || target === el)) return;
        setIsOpen(false);
      };
      const handleEscape = (e: KeyboardEvent) =>
        e.key === 'Escape' && setIsOpen(false);

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      document.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    const selected = value ? options.find((o) => o.value === value) : undefined;

    const handleSelect = (v: string) => {
      onValueChange(v);
      setIsOpen(false);
    };

    const handleClear = () => onValueChange(null);

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger
          ref={ref}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          className={cn(
            'inline-flex items-center justify-between gap-2 rounded-full bg-[var(--label-bg, #f5f5f5)] ' +
              'px-2 py-2 text-xs font-medium h-9 text-black' +
              'border border-transparent hover:bg-gray-100 ' +
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-accent-color)]' +
              'sm:w-[102px]',
            className,
          )}
        >
          <span
            className={cn(!selected && 'text-xs  text-gray-700 ms:text-sm')}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Content
          ref={popoverContentRef}
          align={align}
          sideOffset={6}
          className={cn(
            // rounded “card” with header
            'bg-white border border-gray-200 rounded-xl shadow-lg z-50 ' +
              'max-h-80 overflow-y-auto p-0',
            dropdownWidth
              ? dropdownWidth
              : 'w-[var(--radix-popover-trigger-width)]',
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {(title ?? placeholder) && (
            <div className='px-4 pt-3 pb-2 text-[1rem] font-regular'>
              {title ?? placeholder}
            </div>
          )}

          {showClear && value !== null && (
            <div className='px-4 py-2 border-b'>
              <button
                onClick={handleClear}
                className='inline-flex items-center gap-1 text-[0.95rem] text-black hover:text-[var(--main-accent-color)] transition-colors'
              >
                <XIcon className='h-3.5 w-3.5' />
                Clear
              </button>
            </div>
          )}

          <div
            role='listbox'
            aria-activedescendant={
              selected ? `option-${selected.value}` : undefined
            }
            className='py-1'
          >
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <div
                  id={`option-${opt.value}`}
                  key={opt.value}
                  role='option'
                  aria-selected={isSelected}
                  tabIndex={0}
                  className={cn(
                    'flex items-start justify-between gap-2 px-4 py-2 cursor-pointer',
                    'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                  )}
                  onClick={() => handleSelect(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(opt.value);
                    }
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <span className='text-[1.05rem]'>{opt.label}</span>
                    {(() => {
                      if (!getTooltipByMaterialAndSection || !sectionName)
                        return null;
                      const tooltipData = getTooltipByMaterialAndSection(
                        opt.value,
                        sectionName,
                      );
                      return tooltipData?.Description ? (
                        <PopoverTooltip tooltipData={tooltipData.Description} />
                      ) : null;
                    })()}
                  </div>

                  {isSelected ? <CheckIcon className='h-4 w-4' /> : null}
                </div>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    );
  },
);

SingleSelect.displayName = 'SingleSelect';

export { SingleSelect };
export type { SingleSelectProps };
