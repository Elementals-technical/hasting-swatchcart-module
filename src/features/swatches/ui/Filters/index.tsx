import { MaterialsFilter } from './MaterialsFilter';
import { ColorsFilter } from './ColorsFilter';
import { LooksFilter } from './LooksFilter';

export const Filters = () => {
  return (
    <div className='flex items-center gap-[16px] p-[var(--sm-padding)] border-b border-solid border-[var(--border)]'>
      <MaterialsFilter />
      <ColorsFilter />
      <LooksFilter />
    </div>
  );
};
