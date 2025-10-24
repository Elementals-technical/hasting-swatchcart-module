import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import MDWithAccordion from '../Markdown/MDWithAccordion';
import InfoIcon from './InfoIcon';
import s from './PopoverTooltip.module.scss';

/**
 * PopoverTooltip — popover with Markdown + accordions.
 * @param {string} tooltipData — raw markdown with ~H~~ ~M~~ markers
 * @param {boolean} openFirst — whether to open the first accordion
 * @param {React.ReactNode} trigger — custom trigger (optional)
 */
export const PopoverTooltip = ({
  tooltipData,
  openFirst = false,
  trigger,
}: {
  tooltipData: string;
  openFirst?: boolean;
  trigger?: React.ReactNode;
}) => {
  if (!tooltipData?.trim()) return null;

  const handleClick = (event: any) => {
    event.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            className={s.iconBtn}
            aria-label='Open tooltip'
            onClick={handleClick}
          >
            <InfoIcon className={s.iconSvg} />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        className='bg-[#000] text-white text-[1.1rem] leading-[1.45] w-auto max-w-[300px]'
        side='top'
      >
        <MDWithAccordion openFirst={openFirst}>{tooltipData}</MDWithAccordion>
      </PopoverContent>
    </Popover>
  );
};
