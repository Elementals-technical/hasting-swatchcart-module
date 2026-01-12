import { useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { AttributeValue } from '../../../swatches/model/types';
import {
  setActiveMultiCartProduct,
  setMultiCartItems,
} from '../../model/multiProductCartSlice';
import { IMultiCartProductItem, IProductListItem } from '../../model/types';
import { getMultiCartItems } from '../../model/selectors';
import { MaterialListItem } from '../../../../shared/ui/MaterialListItem/MaterialListItem';
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';

interface IMaterialListProps {
  /** Tailwind / className for the scroll container */
  containerStyles?: string;
  /** Tailwind / className for the grid wrapper */
  gridStyles?: string;
  /** Number of columns on ≥ sm screens */
  desktopColumnsCount?: number;
}

/**
 * Renders a virtualized grid of materials for the multi-product cart.
 *
 * Features:
 * - Uses filters from the store (Finish, Color, Look) to derive `filteredItems`.
 * - Uses TanStack Virtual to render only visible rows for performance.
 * - Supports responsive column count (1 on mobile, `desktopColumnsCount` on sm+).
 * - Enforces a global swatch limit (5 items across all products) and shows
 *   `SwatchLimitModal` when the limit is exceeded.
 *
 * Selection logic:
 * - Clicking a material toggles it for the active product:
 *   - If it already exists, it’s removed from the combined `allItems` list.
 *   - If it does not exist and the limit is not reached, it’s added with `count: 1`.
 * - Keeps `setMultiCartItems` and `setActiveMultiCartProduct` in sync.
 *
 * Virtualization:
 * - Computes rows from `filteredItems` based on column count.
 * - Uses padding (`padTop` / `padBottom`) to emulate full scroll height.
 * - Measures the last item in each row for accurate row height.
 *
 * @component
 *
 * @param {string} [containerStyles]
 *  Optional classes for the scroll container.
 *
 * @param {string} [gridStyles]
 *  Optional classes for the grid container.
 *
 * @param {number} [desktopColumnsCount=3]
 *  Number of columns on desktop / sm+ breakpoints.
 */
export const MaterialMultiProductList = ({
  containerStyles = 'flex-1 min-h-0 overflow-y-auto p-[var(--padding)] sm:p-[var(--sm-padding)] ',
  gridStyles = 'grid grid-cols-1 gap-[8px] sm:grid-cols-3',
  desktopColumnsCount = 3,
}: IMaterialListProps) => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);
  const [isShowSwatchLimit, setIsShowSwatchLImit] = useState(false);

  /**
   * Flattened list of all selected materials across all products in the multi-cart.
   *
   * Used to:
   * - Enforce the global limit (max 5 items).
   * - Decide whether a material already exists and should be toggled off.
   */
  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  /**
   * Count exact number of swatch in the cart
   */
  const cartCount = useMemo(() => {
    return selectedProducts
      .flatMap((p) => p.items)
      .reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [selectedProducts]);

  /**
   * Materials filtered by the current Finish, Color and Look filters.
   *
   * - Finish filter matches either `metadata.Finish` or `metadata.Material`.
   * - Color filter splits comma-separated `metadata.Color` values.
   * - Look filter matches any selected look in `metadata.Look`.
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

  /**
   * Compares two AttributeValue items to determine if they represent the same material.
   * Matching logic is based on `metadata.label` + `parentName` (your current rule).
   */
  const isSameMaterial = (a: AttributeValue, b: AttributeValue) =>
    a.metadata?.label === b.metadata?.label && a.parentName === b.parentName;

  /**
   * Toggles a material in the multi-product cart:
   * - If the material already exists in the cart, removes it from the product where it is stored.
   *   If that product ends up with no items, removes the whole product from the cart.
   * - If the material does not exist, adds it to the currently selected product (if under limit).
   *
   * Assumptions:
   * - `selectedProducts` is IMultiCartProductItem[]
   * - `allItems` is a flattened list of all items in cart (across all products)
   * - `cartCount` is total selected materials count (same as allItems.length)
   */
  const handleSelect = (item: AttributeValue) => {
    if (!selectedProduct) return;

    const existsInCart = selectedProducts.some((p) =>
      p.items.some((i) => isSameMaterial(i, item)),
    );

    if (existsInCart) {
      const nextSelectedProducts = selectedProducts
        .map((p) => {
          const nextItems = p.items.filter((i) => !isSameMaterial(i, item));
          return { ...p, items: nextItems };
        })
        .filter((p) => p.items.length > 0) as IMultiCartProductItem[];

      dispatch(setMultiCartItems(nextSelectedProducts));

      const nextActive =
        nextSelectedProducts.find(
          (p) => p.assetId === selectedProduct.assetId,
        ) ??
        nextSelectedProducts[0] ??
        null;

      if (nextActive) dispatch(setActiveMultiCartProduct(nextActive));
      return;
    }

    if (cartCount >= 5) {
      setIsShowSwatchLImit(true);
      return;
    }

    const newMaterial: AttributeValue & {
      count: number;
      productInformation: IProductListItem;
    } = { ...item, productInformation: selectedProduct, count: 1 };

    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.assetId === selectedProduct.assetId,
    );

    let nextSelectedProducts: IMultiCartProductItem[];

    if (existingProductIndex >= 0) {
      nextSelectedProducts = selectedProducts.map((p, idx) => {
        if (idx !== existingProductIndex) return p;
        return { ...p, items: [...p.items, newMaterial] };
      }) as IMultiCartProductItem[];
    } else {
      const newProduct: IMultiCartProductItem = {
        assetId: selectedProduct.assetId,
        name: selectedProduct.name,
        productInformation: selectedProduct,
        items: [newMaterial],
      };
      nextSelectedProducts = [
        ...selectedProducts,
        newProduct,
      ] as IMultiCartProductItem[];
    }

    dispatch(setMultiCartItems(nextSelectedProducts));

    const nextActive =
      nextSelectedProducts.find((p) => p.assetId === selectedProduct.assetId) ??
      nextSelectedProducts[0];

    dispatch(setActiveMultiCartProduct(nextActive));
  };

  return (
    <div ref={scrollRef} className={containerStyles}>
      <SwatchLimitModal
        header="You've reached your maximum number of swatches!"
        body="If you'd like to add another swatch please remove an existing swatch
            from your cart"
        isOpen={isShowSwatchLimit}
        onClose={() => setIsShowSwatchLImit(false)}
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
          const isSelected = !!allItems.find(
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

      <div style={{ height: padBottom }} aria-hidden />
    </div>
  );
};
