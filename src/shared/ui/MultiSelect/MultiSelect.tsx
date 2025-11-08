import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { PopoverTooltip } from '../PopoverTooltip/PopoverTooltip';
import { cn } from '../../utils/cn';
import { Checkbox } from '../Checkbox/Checkbox';

export interface IMultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectProps {
  options: IMultiSelectOption[];
  values: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  dropdownWidth?: string;
  align?: 'start' | 'center' | 'end';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTooltipByMaterialAndSection?: (material: string, section: string) => any;
  sectionName?: string;
}

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  MultiSelectProps
>(
  (
    {
      options,
      values,
      onValueChange,
      placeholder = 'Select options...',
      className = 'max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]',
      dropdownWidth,
      align = 'start',
      getTooltipByMaterialAndSection,
      sectionName,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const popoverContentRef = React.useRef<HTMLDivElement>(null);

    // Close popover on scroll (but not when scrolling inside the popover)
    React.useEffect(() => {
      if (!isOpen) return;

      const handleScroll = (event: Event) => {
        // Check if the scroll event is happening inside the popover content
        const target = event.target as Element;
        const popoverContent = popoverContentRef.current;

        // If the scroll is happening inside the popover content, don't close
        if (
          popoverContent &&
          (popoverContent.contains(target) || target === popoverContent)
        ) {
          return;
        }

        setIsOpen(false);
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      // Add scroll listeners to window and all scrollable parents
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      document.addEventListener('keydown', handleEscape);

      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    const handleSelectOption = (optionValue: string, checked: boolean) => {
      if (checked) {
        onValueChange([...values, optionValue]);
      } else {
        onValueChange(values.filter((value) => value !== optionValue));
      }
    };

    const handleClearAll = () => {
      onValueChange([]);
    };

    const selectedCount = values.length;
    const displayContent =
      selectedCount === 0 ? (
        placeholder
      ) : selectedCount === 1 ? (
        options.find((opt) => opt.value === values[0])?.label ||
        `${placeholder} selected`
      ) : (
        <div className='flex flex-row items-center w-full'>
          <span className='truncate mr-1'>{placeholder}</span>
          <span className='flex justify-center items-center text-white bg-[var(--main-accent-color)] w-[20px] h-[20px] rounded-full whitespace-nowrap'>
            {selectedCount}
          </span>
        </div>
      );

    if (!options.length) return;

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex flex-row items-center justify-between rounded-full border border-[var(--main-accent-color)] px-3 sm:px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 data-[state=open]:border-primary hover:border-primary focus:border-primary  min-h-9',
            className,
          )}
        >
          <div className='w-full text-xs truncate text-left leading-[20px] sm:text-sm'>
            {displayContent}
          </div>
          <ChevronDownIcon
            className={cn(
              'ml-2 h-4 w-4 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Content
          ref={popoverContentRef}
          className={cn(
            'bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto overscroll-behavior-y-contain touch-pan-y p-2',
            dropdownWidth
              ? dropdownWidth
              : 'w-[var(--radix-popover-trigger-width)]',
          )}
          align={align}
          sideOffset={4}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          {selectedCount > 0 && (
            <div className='flex flex-row gap-2 items-center justify-between px-2 py-1 mb-2 border-b'>
              <button
                onClick={handleClearAll}
                className='text-[1.2rem] text-black hover:text-primary transition-color cursor-pointer duration-200 flex flex-row items-center gap-1'
              >
                <XIcon className='h-3 w-3' />
                Clear all
              </button>
            </div>
          )}

          <div className='flex flex-col gap-1'>
            {options.map((option) => {
              const isChecked = values.includes(option.value);
              return (
                <div
                  key={option.value}
                  className='flex flex-row items-start gap-2 px-2 py-1 hover:bg-gray-50 rounded transition-background duration-300 cursor-pointer'
                  onClick={() => handleSelectOption(option.value, !isChecked)}
                >
                  <Checkbox
                    checked={isChecked}
                    className='size-6'
                    onCheckedChange={(checked: boolean) =>
                      handleSelectOption(option.value, checked as boolean)
                    }
                  />
                  <div className='flex-1 flex flex-row items-start justify-between'>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='text-[1.2rem]'>{option.label}</span>
                      {(() => {
                        if (!getTooltipByMaterialAndSection || !sectionName)
                          return null;

                        const tooltipData = getTooltipByMaterialAndSection(
                          option.value,
                          sectionName,
                        );
                        return tooltipData && tooltipData.Description ? (
                          <PopoverTooltip
                            tooltipData={tooltipData?.Description}
                          />
                        ) : null;
                      })()}
                    </div>
                    {option.count !== undefined && (
                      <span className='text-[1rem] text-gray-800 bg-gray-100 px-2 py-0.5 ml-2 rounded-full whitespace-nowrap'>
                        {option.count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
export type { MultiSelectProps };
