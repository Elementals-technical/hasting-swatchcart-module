import { useMemo } from 'react';
import { useAppSelector } from '../../../../app/store/store';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
} from '../../model/selectors';
import { MaterialListItem } from '../MaterialListItem/MaterialListItem';

export const MaterialList = () => {
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const filters = useAppSelector(getMaterialSelectStateFilters);
  console.log('allfilters', allMaterialsValues);

  const { filteredItems } = useMemo(() => {
    const filteredItems = allMaterialsValues.filter((item) => {
      const finishOk =
        filters.Finish.length === 0 ||
        filters.Finish.some(
          (finish) =>
            item.metadata?.Finish === finish ||
            item.metadata?.Material === finish,
        );

      const colorOk =
        filters.Color.length === 0 ||
        (item.metadata?.Color &&
          filters.Color.some((selectedColor) =>
            item.metadata?.Color?.split(',')
              .map((s: string) => s.trim())
              .includes(selectedColor),
          ));

      const looks = item.metadata?.Look;
      const lookOk =
        !filters.Look ||
        filters.Look.length === 0 ||
        filters.Look.some(
          (selectedLook) => looks && looks.includes(selectedLook),
        );
      return finishOk && colorOk && lookOk;
    });

    return { filteredItems };
  }, [filters, allMaterialsValues]);

  return (
    <div className='flex-1 min-h-0 overflow-y-auto p-[var(--padding)]  sm:p-[var(--sm-padding)]'>
      <div className='grid grid-cols-1 gap-[8px]  sm:grid-cols-3'>
        {filteredItems.map((val, index) => {
          const key = `${val.metadata.label}/${index}`;
          return <MaterialListItem key={key} val={val} />;
        })}
      </div>
    </div>
  );
};
