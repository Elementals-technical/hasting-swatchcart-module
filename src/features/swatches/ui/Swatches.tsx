import { MOCK_SELECT_DATA } from '../../../shared/constants/select';
import CustomSidebar from '../../../shared/ui/CustomSidebar/CustomSidebar';
import { MultiSelect } from '../../../shared/ui/MultiSelect/MultiSelect';
import { ProductElement } from './ProductElement/ProductElement';

interface ISwatchesProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const Swatches = ({
  isOpen,
  onToggleSidebar,
  // onSendData,
}: ISwatchesProps) => {
  // const handleSetData = () => {
  //   onSendData([1, 2, 3]);
  // };

  const handleFilterChange = (filterName: string, value: string[]) => {
    console.log('handleFilterChange', { filterName, value });
  };

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <div>
        <ProductElement />

        <br />
        <MultiSelect
          options={MOCK_SELECT_DATA}
          // values={filters.Finish}
          values={[]}
          onValueChange={(values) => handleFilterChange('Finish', values)}
          placeholder='Material'
          // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
          // sectionName={sectionName}
          className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
          dropdownWidth='w-80'
        />
      </div>
    </CustomSidebar>
  );
};
