import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MultiSelect } from '../../../../shared/ui/MultiSelect/MultiSelect';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
} from '../../model/selectors';
import { setMaterialSelect } from '../../model/swatchesSlice';
import type { IMaterialSelectState } from '../../model/types';

export const MaterialsFilter = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const [materialOptions, setMaterialOptions] = useState<any[]>([]);

  useEffect(() => {
    if (allMaterialsValues?.length) {
      const finishOptions = [
        ...new Set(
          allMaterialsValues.map(
            (i) => i.metadata?.Finish || i.metadata?.Material,
          ),
        ),
      ]
        .filter(Boolean)
        .map((finish) => {
          const count = allMaterialsValues.filter(
            (item) =>
              item.metadata?.Finish === finish ||
              item.metadata?.Material === finish,
          ).length;
          return {
            value: finish,
            label: finish,
            count: count,
          };
        });

      if (finishOptions?.length) {
        setMaterialOptions(finishOptions);
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
      options={materialOptions}
      values={filters.Finish}
      onValueChange={(values) => handleFilterChange('Finish', values)}
      placeholder='Material'
      dropdownWidth='w-80'
    />
  );
};
