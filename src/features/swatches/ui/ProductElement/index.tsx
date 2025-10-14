import { MOCK_SELECT_DATA } from '../../../../shared/constants/select';
import { MultiSelect } from '../../../../shared/ui/MultiSelect/MultiSelect';

export const ProductElement = () => {
  const handleFilterChange = (filterName: string, value: string[]) => {
    console.log('handleFilterChange', { filterName, value });
  };

  return (
    <div className='flex justify-between items-center shrink-0 p-[var(--padding)] border-b border-solid border-[var(--border)]'>
      <span>Product element</span>
      <MultiSelect
        options={MOCK_SELECT_DATA}
        // values={filters.Finish}
        values={[]}
        onValueChange={(values) => handleFilterChange('Finish', values)}
        placeholder='All'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
        dropdownWidth='w-80'
      />
    </div>
  );
};
