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

export const LooksFilter = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const [lookOptions, setLookOptions] = useState<IMultiSelectOption[]>([]);

  useEffect(() => {
    if (allMaterialsValues?.length) {
      const lookOptions = [
        ...new Set(
          allMaterialsValues
            .map((value) => value?.metadata?.Look)
            .filter(Boolean)
            .map((c: any) => c.split(',').map((s: string) => s.trim()))
            .flat(),
        ),
      ].map((look) => {
        const count = allMaterialsValues.filter(
          (item) =>
            item.metadata?.Look &&
            item.metadata?.Look.split(',')
              .map((s: string) => s.trim())
              .includes(look),
        ).length;

        return {
          value: look,
          label: look,
          count: count,
        };
      });

      if (lookOptions?.length) {
        setLookOptions(lookOptions);
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
      options={lookOptions}
      values={filters.Look}
      onValueChange={(values) => handleFilterChange('Look', values)}
      placeholder='Look'
      // getTooltipByMaterialAndSection={getTooltipByMaterialAndSection}
      // sectionName={sectionName}
      className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
      dropdownWidth='w-80'
    />
  );
};
