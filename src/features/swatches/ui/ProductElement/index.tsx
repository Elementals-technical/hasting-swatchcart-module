import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  MultiSelect,
  type IMultiSelectOption,
} from '../../../../shared/ui/MultiSelect/MultiSelect';
import { getProductElementOptions } from '../../model/selectors';
import { uniqueList } from '../../../../shared/utils/uniqueList';
import { setPanelFilter } from '../../model/swatchesSlice';

export const ProductElement = () => {
  const dispatch = useAppDispatch();
  const allProductElementOptions = useAppSelector(getProductElementOptions);
  const [productOptions, setProductOptions] = useState<IMultiSelectOption[]>(
    [],
  );
  const [productValues, setProductValues] = useState<string[]>([]);

  useEffect(() => {
    if (!allProductElementOptions?.length) return;
    const formatProductData = allProductElementOptions.map((item) => {
      const { Name, Label } = item.metadata || {};
      return { value: Name, label: Label, id: Name };
    });

    setProductOptions(formatProductData);
  }, [allProductElementOptions]);

  const handleFilterChange = (_: string, values: string[]) => {
    if (values.length) {
      const uniqueListValue = uniqueList(values);

      if (uniqueListValue.length) {
        const filteredMaterialByProduct = allProductElementOptions.filter(
          (item) => uniqueListValue.includes(item.metadata?.Label),
        );
        setProductValues(uniqueListValue);
        dispatch(setPanelFilter({ attributes: filteredMaterialByProduct }));
      } else {
        dispatch(setPanelFilter({ attributes: allProductElementOptions }));
      }
    } else {
      setProductValues([]);
    }
  };

  return (
    <div className='flex justify-between items-center shrink-0 p-[var(--padding)] border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
      <span>Product element</span>
      <MultiSelect
        options={productOptions}
        values={productValues}
        onValueChange={(values) => handleFilterChange('PanelElement', values)}
        placeholder='All product elements'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className='min-w-[auto] max-w-[154px] sm:max-w-[auto] sm:min-w-[250px]'
        dropdownWidth='w-80'
      />
    </div>
  );
};
