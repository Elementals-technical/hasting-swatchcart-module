import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  MultiSelect,
  type IMultiSelectOption,
} from '../../../../shared/ui/MultiSelect/MultiSelect';
import {
  getMaterialSelectStateFilters,
  getProductElementOptions,
} from '../../model/selectors';
import { uniqueList } from '../../../../shared/utils/uniqueList';
import { setMaterialSelect, setPanelFilter } from '../../model/swatchesSlice';
import { SwatchesServices } from '../../lib/SwatchesServices';

interface IProductElementProps {
  containerStyles: string;
  selectStyles: string;
}

export const ProductElement = ({
  containerStyles,
  selectStyles,
}: IProductElementProps) => {
  const dispatch = useAppDispatch();
  const allProductElementOptions = useAppSelector(getProductElementOptions);
  const filters = useAppSelector(getMaterialSelectStateFilters);
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

        // Find all counts for every selected type of filters Material, Color, Look according to selected PanelElement
        const mappedData = SwatchesServices.mapFiltersFromValues(
          filteredMaterialByProduct,
          filters,
        );

        // Find all filters that where value count !== 0
        const nonZeroCountList =
          SwatchesServices.getPositiveSelectedFilers(mappedData);

        // Reset all filters that don't have any
        if (nonZeroCountList.length) {
          nonZeroCountList.forEach((listItem) => {
            const { filterName, filterKeys } = listItem;
            const itemsWithoutZeroCount = { filterName, values: filterKeys };

            dispatch(setMaterialSelect(itemsWithoutZeroCount));
          });
        }

        dispatch(setPanelFilter({ attributes: filteredMaterialByProduct }));
      } else {
        dispatch(setPanelFilter({ attributes: allProductElementOptions }));
      }
    } else {
      setProductValues([]);
    }
  };

  return (
    // <div className='flex justify-between items-center shrink-0 p-[var(--padding)] border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
    <div className={containerStyles}>
      <span>Product element</span>
      <MultiSelect
        options={productOptions}
        values={productValues}
        onValueChange={(values) => handleFilterChange('PanelElement', values)}
        placeholder='All product elements'
        // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
        // sectionName={sectionName}
        className={selectStyles}
        dropdownWidth='w-80'
      />
    </div>
  );
};
