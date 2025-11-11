import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useAppSelector } from '../../../../app/store/store';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
} from '../../model/selectors';
import { MaterialListItem } from '../../../../shared/ui/MaterialListItem/MaterialListItem';
import { AttributeValue } from '../../model/types';
import { setSelectedMaterial } from '../../model/swatchesSlice';
import { useDispatch } from 'react-redux';

interface IMaterialListProps {
  containerStyles?: string;
  gridStyles?: string;
  desktopColumnsCount?: number;
}

export const MaterialSingleProductList = ({
  containerStyles = 'flex-1 min-h-0 overflow-y-auto p-[var(--padding)] sm:p-[var(--sm-padding)]',
  gridStyles = 'grid grid-cols-2 gap-[8px] sm:grid-cols-3 sm:gap-[var(--sm-padding)]',
  desktopColumnsCount = 3,
}: IMaterialListProps) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const filters = useAppSelector(getMaterialSelectStateFilters);

  const filteredItems = useMemo(() => {
    return allMaterialsValues.filter((item) => {
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
  }, [filters, allMaterialsValues]);

  const smUp =
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 640px)').matches
      : false;
  const cols = smUp ? desktopColumnsCount : 1;

  const rowCount = Math.ceil(filteredItems.length / cols);
  const estimateSize = smUp ? 300 : 200;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan: 24,
    measureElement: (el) => el?.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const startRow = virtualRows[0]?.index ?? 0;
  const endRow = virtualRows[virtualRows.length - 1]?.index ?? -1;

  const startIndex = startRow * cols;
  const endIndex = Math.min((endRow + 1) * cols, filteredItems.length);
  const visibleItems = filteredItems.slice(startIndex, endIndex);

  const padTop = virtualRows[0]?.start ?? 0;
  const padBottom = totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0);

  const handleSelect = (item: AttributeValue) => {
    dispatch(setSelectedMaterial({ selectedMaterial: item }));
  };

  return (
    <div ref={scrollRef} className={containerStyles}>
      <div style={{ height: padTop }} aria-hidden />

      <div className={gridStyles}>
        {visibleItems.map((val, i) => {
          const realIndex = startIndex + i;
          const key = `${val.metadata?.label || realIndex}/${val.parentName}`;
          const isEndOfRow =
            (realIndex + 1) % cols === 0 ||
            realIndex === filteredItems.length - 1;

          if (isEndOfRow) {
            return (
              <div key={key} ref={rowVirtualizer.measureElement as any}>
                <MaterialListItem val={val} onClick={handleSelect} />
              </div>
            );
          }
          return (
            <MaterialListItem key={key} val={val} onClick={handleSelect} />
          );
        })}
      </div>

      {/* bottom spacer */}
      <div style={{ height: padBottom }} aria-hidden />
    </div>
  );
};
