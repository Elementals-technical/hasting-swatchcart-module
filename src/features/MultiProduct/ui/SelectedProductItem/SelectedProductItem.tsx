import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MaterialList } from '../../../swatches/ui/MaterialList';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';

interface ISelectedProductItemProps {
  onSidebarToggle: () => void;
}

export const SelectedProductItem = ({
  onSidebarToggle,
}: ISelectedProductItemProps) => {
  return (
    <div className='flex h-full flex-col'>
      <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
        <span className='text-base font-medium'>Selected Product</span>
        <button
          onClick={onSidebarToggle}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
                      [&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>
      <div className='flex min-h-0 flex-1 flex-col'>
        <FiltersSelectedProductItem />
        <MaterialList
          containerStyles='flex-1 min-h-0 overflow-y-auto p-[var(--padding)] sm:p-[var(--sm-padding)]'
          gridStyles='grid grid-cols-2 gap-[8px] sm:grid-cols-6'
          desktopColumnsCount={6}
        />
        <div
          className='flex justify-between items-center gap-4 h-[64px] p-[var(--sm-padding)]
        border-t border-[var(--border)]
        '
        >
          bottom content
        </div>
      </div>
    </div>
  );
};
