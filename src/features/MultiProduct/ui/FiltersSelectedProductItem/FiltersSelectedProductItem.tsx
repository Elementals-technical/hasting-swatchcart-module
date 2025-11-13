import { ProductElement } from '../../../swatches/ui/ProductElement';
import { Filters } from '../../../swatches/ui/Filters';

export const FiltersSelectedProductItem = () => {
  return (
    <div
      className='flex flex-col justify-between border-b border-[var(--border)]
      sm:flex-row
    '
    >
      <ProductElement
        containerStyles='flex justify-between items-center gap-2 p-[var(--sm-padding)] w-full text-xs
        border-b border-[var(--border)]
        sm:max-w-[360px] sm:text-sm sm:border-none
        '
        selectStyles='min-w-[auto] max-w-[154px] sm:max-w-[auto] sm:min-w-[160px] font-normal'
      />
      <Filters containerStyles='flex justify-between items-center gap-4 p-[var(--sm-padding)]' />
    </div>
  );
};
