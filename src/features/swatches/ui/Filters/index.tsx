import { MaterialsFilter } from './MaterialsFilter';
import { ColorsFilter } from './ColorsFilter';
import { LooksFilter } from './LooksFilter';

export const Filters = () => {
  return (
    <div className='flex flex-row items-center gap-[16px] p-[var(--sm-padding)] '>
      <MaterialsFilter />
      <ColorsFilter />
      <LooksFilter />
    </div>
  );
};
