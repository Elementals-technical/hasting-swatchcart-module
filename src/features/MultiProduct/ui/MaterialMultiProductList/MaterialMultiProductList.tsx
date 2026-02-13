import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
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
import { MaterialListItem as MaterialListItemBase } from '../../../../shared/ui/MaterialListItem/MaterialListItem';
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';

interface IMaterialListProps {
  containerStyles?: string;
  gridStyles?: string;
  minCardWidth?: number;
  gapPx?: number;
  maxColumns?: number;
  fallbackColumns?: number;
  bottomPadPx?: number;
}

const MaterialListItem = React.memo(MaterialListItemBase);

const toMaterialKey = (v: AttributeValue) =>
  `${v.metadata?.label ?? ''}||${v.parentName ?? ''}`;

const toReactKey = (v: AttributeValue, index: number) =>
  (v as any).id ??
  `${v.metadata?.label ?? 'no-label'}|${v.parentName ?? 'no-parent'}|${v.metadata?.value ?? ''}|${index}`;

export const MaterialMultiProductList = ({
  containerStyles = 'flex-1 min-h-0 p-[var(--sm-padding)]',
  gridStyles = '',

  minCardWidth = 180,
  gapPx = 16,
  maxColumns = 12,
  fallbackColumns = 2,

  bottomPadPx = 140,
}: IMaterialListProps) => {
  const dispatch = useAppDispatch();
  const hostRef = useRef<HTMLDivElement | null>(null);

  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const filters = useAppSelector(getMaterialSelectStateFilters);
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const [isShowSwatchLimit, setIsShowSwatchLImit] = useState(false);
  const [cols, setCols] = useState<number>(fallbackColumns);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;

      setContainerWidth(width);

      const raw = Math.max(
        1,
        Math.floor((width + gapPx) / (minCardWidth + gapPx)),
      );
      setCols(Math.min(maxColumns, raw));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [gapPx, minCardWidth, maxColumns]);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      const width = el.getBoundingClientRect().width;
      const raw = Math.max(
        1,
        Math.floor((width + gapPx) / (minCardWidth + gapPx)),
      );
      setCols(Math.min(maxColumns, raw));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [gapPx, minCardWidth, maxColumns]);

  const estimateRowHeight = useMemo(() => {
    if (containerWidth < 340) return 340 + gapPx;
    if (containerWidth < 375) return 370 + gapPx;
    if (containerWidth < 400) return 220 + gapPx;
    if (containerWidth < 500) return 260 + gapPx;
    if (containerWidth < 640) return 300 + gapPx;
    if (containerWidth < 700) return 256 + gapPx;
    if (containerWidth < 1024) return 224 + gapPx;
    return 260 + gapPx;
  }, [containerWidth, gapPx]);

  const allItems = useMemo(
    () => selectedProducts.flatMap((p) => p.items),
    [selectedProducts],
  );

  const selectedKeySet = useMemo(() => {
    const set = new Set<string>();
    for (const it of allItems) set.add(toMaterialKey(it));
    return set;
  }, [allItems]);

  const cartCount = useMemo(() => {
    let sum = 0;
    for (const p of selectedProducts)
      for (const it of p.items) sum += it.count ?? 0;
    return sum;
  }, [selectedProducts]);

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

  const rowCount = useMemo(
    () => Math.ceil(filteredItems.length / cols),
    [filteredItems.length, cols],
  );

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const isSameMaterial = (a: AttributeValue, b: AttributeValue) =>
    a.metadata?.label === b.metadata?.label && a.parentName === b.parentName;

  const handleSelect = useCallback(
    (item: AttributeValue) => {
      if (!selectedProduct) return;

      const key = toMaterialKey(item);
      const existsInCart = selectedKeySet.has(key);

      if (existsInCart) {
        const nextSelectedProducts: IMultiCartProductItem[] = [];
        for (const p of selectedProducts) {
          const nextItems = p.items.filter((i) => !isSameMaterial(i, item));
          if (nextItems.length > 0)
            nextSelectedProducts.push({ ...p, items: nextItems });
        }

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

      const nextSelectedProducts: IMultiCartProductItem[] = [];
      let inserted = false;

      for (const p of selectedProducts) {
        if (p.assetId !== selectedProduct.assetId) {
          nextSelectedProducts.push(p);
          continue;
        }
        nextSelectedProducts.push({ ...p, items: [...p.items, newMaterial] });
        inserted = true;
      }

      if (!inserted) {
        nextSelectedProducts.push({
          assetId: selectedProduct.assetId,
          name: selectedProduct.name,
          productInformation: selectedProduct,
          items: [newMaterial],
        });
      }

      dispatch(setMultiCartItems(nextSelectedProducts));

      const nextActive =
        nextSelectedProducts.find(
          (p) => p.assetId === selectedProduct.assetId,
        ) ?? nextSelectedProducts[0];

      dispatch(setActiveMultiCartProduct(nextActive));
    },
    [dispatch, selectedProduct, selectedProducts, cartCount, selectedKeySet],
  );

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: `${gapPx}px`,
    }),
    [cols, gapPx],
  );
  console.log('virtualRows', virtualRows);

  return (
    <div ref={hostRef} className={containerStyles}>
      <SwatchLimitModal
        header="You've reached your maximum number of swatches!"
        body="If you'd like to add another swatch please remove an existing swatch from your cart"
        isOpen={isShowSwatchLimit}
        onClose={() => setIsShowSwatchLImit(false)}
      />

      <div style={{ height: totalSize + bottomPadPx, position: 'relative' }}>
        {virtualRows.map((vr) => {
          const rowIndex = vr.index;
          const start = rowIndex * cols;
          const end = Math.min(start + cols, filteredItems.length);
          const rowItems = filteredItems.slice(start, end);
          return (
            <div
              key={vr.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vr.start}px)`,
              }}
            >
              <div className={gridStyles} style={gridStyle}>
                {rowItems.map((val, idx) => (
                  <MaterialListItem
                    key={toReactKey(val, start + idx)}
                    val={val}
                    isSelected={selectedKeySet.has(toMaterialKey(val))}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
