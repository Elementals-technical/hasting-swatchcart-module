import { useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useAppSelector } from '../../../../app/store/store';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
  getSelectedMaterials,
} from '../../model/selectors';
import { MaterialListItem } from '../../../../shared/ui/MaterialListItem/MaterialListItem';
import { AttributeValue } from '../../model/types';
import { setSelectedMaterial } from '../../model/swatchesSlice';
import { useDispatch } from 'react-redux';
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';
import { TOnSelectMaterial } from '../../../DataAdapter/utils/types';

interface IMaterialListProps {
  containerStyles?: string;
  gridStyles?: string;
  desktopColumnsCount?: number;
  onSelectMaterial?: TOnSelectMaterial<AttributeValue>;
}

export const MaterialSingleProductList = ({
  containerStyles = 'flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]',
  gridStyles = 'grid grid-cols-2 gap-[var(--sm-padding)] sm:grid-cols-3 ',
  desktopColumnsCount = 3,
  onSelectMaterial,
}: IMaterialListProps) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);

  const selectedMaterials = useAppSelector(getSelectedMaterials);
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const [isShowLimitMessage, setIsShowLimitMessage] = useState(false);

  /**
   * Count exact number of swatch in the cart
   */
  const cartCount = useMemo(() => {
    return selectedMaterials.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [selectedMaterials]);

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
    const isSelected = selectedMaterials.find(
      (material) => material.label === item.label,
    );

    if (cartCount + 1 > 5 && !isSelected) {
      setIsShowLimitMessage(true);
    }

    if (onSelectMaterial) {
      onSelectMaterial(item);
    }

    dispatch(
      setSelectedMaterial({
        materialCount: cartCount,
        selectedMaterials,
        selectedMaterial: { ...item, count: 1 },
      }),
    );
  };

  return (
    <div ref={scrollRef} className={containerStyles}>
      <SwatchLimitModal
        header="You've reached your maximum number of swatches!"
        body="If you'd like to add another swatch please remove an existing swatch
            from your cart"
        isOpen={isShowLimitMessage}
        onClose={() => setIsShowLimitMessage(false)}
      />
      <div style={{ height: padTop }} aria-hidden />

      <div className={gridStyles}>
        {visibleItems.map((val, i) => {
          const realIndex = startIndex + i;
          const key = `${val.metadata?.label || realIndex}/${val.parentName}`;
          const isEndOfRow =
            (realIndex + 1) % cols === 0 ||
            realIndex === filteredItems.length - 1;
          const value = val && val.metadata?.value;
          const isSelected = !!selectedMaterials.find(
            (elem) =>
              elem.metadata?.value === value &&
              elem.parentName === val.parentName,
          );
          if (isEndOfRow) {
            return (
              <div key={key} ref={rowVirtualizer.measureElement as any}>
                <MaterialListItem
                  val={val}
                  isSelected={isSelected}
                  onClick={handleSelect}
                />
              </div>
            );
          }
          return (
            <MaterialListItem
              key={key}
              val={val}
              isSelected={isSelected}
              onClick={handleSelect}
            />
          );
        })}
      </div>

      {/* bottom spacer */}
      <div style={{ height: padBottom }} aria-hidden />
    </div>
  );
};
