import { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';
import { TOnSelectMaterial } from '../../../DataAdapter/utils/types';

/**
 * Props for {@link MaterialSingleProductList}.
 */
interface IMaterialListProps {
  /** Custom container styles */
  containerStyles?: string;

  /** Grid styles for the materials layout */
  gridStyles?: string;

  /** Number of columns on desktop screens (>= 640px) */
  desktopColumnsCount?: number;

  /**
   * Optional callback fired when a material is selected.
   */
  onSelectMaterial?: TOnSelectMaterial<AttributeValue>;
}

/**
 * Builds a stable unique key for a material item.
 *
 * @param v - Material item
 * @returns Stable key string for React rendering
 */
const getMaterialKey = (v: AttributeValue): string => {
  const valueKey = v.metadata?.value ?? v.value ?? v.label;
  return `${v.parentName}__${v.optionName ?? ''}__${valueKey}`;
};

/**
 * Virtualized grid list of materials for a single product.
 *
 * - Filters by Finish / Color / Look
 * - Uses row-based virtualization for performance
 * - Uses fixed row height for stable virtualization (prevents huge bottom padding)
 * - Adds exact 20px bottom padding
 */
export const MaterialSingleProductList = ({
  containerStyles = 'flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]',
  gridStyles = 'grid gap-[var(--sm-padding)]',
  desktopColumnsCount = 3,
  onSelectMaterial,
}: IMaterialListProps) => {
  const dispatch = useDispatch();

  /** Scroll container reference for virtualization */
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /** All available materials */
  const allMaterialsValues = useAppSelector(getAllMaterialValues);

  /** Selected materials */
  const selectedMaterials = useAppSelector(getSelectedMaterials);

  /** Active filters */
  const filters = useAppSelector(getMaterialSelectStateFilters);

  /** Controls visibility of swatch limit modal */
  const [isShowLimitMessage, setIsShowLimitMessage] = useState(false);

  /**
   * Counts total number of selected swatches in the cart.
   */
  const cartCount = useMemo(() => {
    return selectedMaterials.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [selectedMaterials]);

  /**
   * Filters materials according to Finish / Color / Look filters.
   */
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

  /**
   * Determines if screen is >= 640px.
   *
   * Note: This is evaluated on render. If you need to react to resize,
   * convert this to state with a resize/matchMedia listener.
   */
  const smUp =
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 640px)').matches
      : false;

  /** Number of columns per row */
  const cols = smUp ? desktopColumnsCount : 1;

  /** Number of virtualized rows */
  const rowCount = Math.ceil(filteredItems.length / cols);

  /**
   * Fixed row height (prevents wrong measurements causing huge bottom whitespace).
   * Tune these values to match your card height + row gap.
   */
  const ROW_HEIGHT = smUp ? 240 : 190;

  /**
   * Row-based virtualizer.
   * Each virtual item represents one row.
   */
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  /**
   * Handles material selection.
   *
   * @param item - Selected material
   */
  const handleSelect = (item: AttributeValue) => {
    const itemValue = item.metadata?.value ?? item.value ?? item.label;

    const isSelected = selectedMaterials.some((material) => {
      const matValue =
        material.metadata?.value ?? material.value ?? material.label;

      return matValue === itemValue && material.parentName === item.parentName;
    });

    if (cartCount + 1 > 5 && !isSelected) {
      setIsShowLimitMessage(true);
      return;
    }

    if (onSelectMaterial && !isSelected) {
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

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div ref={scrollRef} className={containerStyles}>
      <SwatchLimitModal
        header="You've reached your maximum number of swatches!"
        body="If you'd like to add another swatch please remove an existing swatch from your cart"
        isOpen={isShowLimitMessage}
        onClose={() => setIsShowLimitMessage(false)}
      />

      {/* Virtual content wrapper: fixed height + exact 20px bottom padding */}
      <div
        style={{
          height: totalSize + 20,
          position: 'relative',
          paddingBottom: 20,
        }}
      >
        {virtualRows.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const startIndex = rowIndex * cols;

          const rowItems = filteredItems.slice(startIndex, startIndex + cols);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Grid inside each row */}
              <div
                className={gridStyles}
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {rowItems.map((val) => {
                  const key = getMaterialKey(val);

                  const value = val.metadata?.value ?? val.value ?? val.label;
                  const isSelected = selectedMaterials.some((elem) => {
                    const elemValue =
                      elem.metadata?.value ?? elem.value ?? elem.label;

                    return (
                      elemValue === value && elem.parentName === val.parentName
                    );
                  });

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
            </div>
          );
        })}
      </div>
    </div>
  );
};
