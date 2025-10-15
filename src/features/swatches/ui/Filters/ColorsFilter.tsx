import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  MultiSelect,
  type IMultiSelectOption,
} from '../../../../shared/ui/MultiSelect/MultiSelect';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
} from '../../model/selectors';
import { setMaterialSelect } from '../../model/swatchesSlice';
import type { IMaterialSelectState } from '../../model/types';

export const ColorsFilter = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const [colorOptions, setColorOptions] = useState<IMultiSelectOption[]>([]);

  useEffect(() => {
    if (allMaterialsValues?.length) {
      const colorOptions = [
        ...new Set(
          allMaterialsValues
            .map((value) => value?.metadata?.Color)
            .filter(Boolean)
            .map((c) => c.split(',').map((s: string) => s.trim()))
            .flat(),
        ),
      ].map((color) => {
        const count = allMaterialsValues.filter(
          (item) =>
            item.metadata?.Color &&
            item.metadata?.Color.split(',')
              .map((s: string) => s.trim())
              .includes(color),
        ).length;

        return {
          value: color,
          label: color,
          count: count,
        };
      });

      if (colorOptions?.length) {
        setColorOptions(colorOptions);
      }
    }
  }, [allMaterialsValues]);

  const handleFilterChange = (
    filterType: keyof IMaterialSelectState,
    values: string[],
  ) => {
    dispatch(setMaterialSelect({ filterName: filterType, values }));
  };

  return (
    <MultiSelect
      options={colorOptions}
      values={filters.Color}
      onValueChange={(values) => handleFilterChange('Color', values)}
      placeholder='Color'
      // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
      // sectionName={sectionName}
      className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
      dropdownWidth='w-80'
    />
  );
};
