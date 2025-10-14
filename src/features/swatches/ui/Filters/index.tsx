import { MOCK_SELECT_DATA } from '../../../../shared/constants/select';
import { MultiSelect } from '../../../../shared/ui/MultiSelect/MultiSelect';

export const Filters = () => {
  const handleFilterChange = (filterName: string, value: string[]) => {
    console.log('handleFilterChange', { filterName, value });
  };
  return (
    <div className='shrink-0 flex justify-between items-center gap-2 p-[var(--padding)] border-b border-solid border-[var(--border)]'>
      <MultiSelect
        options={MOCK_SELECT_DATA}
        // values={filters.Finish}
        values={[]}
        onValueChange={(values) => handleFilterChange('Material', values)}
        placeholder='Material'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
        dropdownWidth='w-80'
      />
      <MultiSelect
        options={MOCK_SELECT_DATA}
        // values={filters.Finish}
        values={[]}
        onValueChange={(values) => handleFilterChange('Color', values)}
        placeholder='Color'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
        dropdownWidth='w-80'
      />
      <MultiSelect
        options={MOCK_SELECT_DATA}
        // values={filters.Finish}
        values={[]}
        onValueChange={(values) => handleFilterChange('Look', values)}
        placeholder='Look'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
        dropdownWidth='w-80'
      />
    </div>
  );
};
