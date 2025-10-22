import { MaterialsFilter } from './MaterialsFilter';
import { ColorsFilter } from './ColorsFilter';
import { LooksFilter } from './LooksFilter';

interface IFiltersProps {
  containerStyles: string;
}

export const Filters = ({ containerStyles }: IFiltersProps) => {
  return (
    <div className={containerStyles}>
      <MaterialsFilter />
      <ColorsFilter />
      <LooksFilter />
    </div>
  );
};
