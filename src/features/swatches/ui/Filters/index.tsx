import { MaterialsFilter } from './MaterialsFilter';
import { ColorsFilter } from './ColorsFilter';
import { LooksFilter } from './LooksFilter';

export const Filters = () => {
  return (
    <div className='shrink-0 flex justify-between items-center gap-2 p-[var(--padding)] border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
      <MaterialsFilter />
      <ColorsFilter />
      <LooksFilter />
    </div>
  );
};
