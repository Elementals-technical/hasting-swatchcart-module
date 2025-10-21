// import { useMemo } from 'react';
// import { useAppSelector } from '../../../../app/store/store';
// import {
//   getAllMaterialValues,
//   getMaterialSelectStateFilters,
// } from '../../model/selectors';
// import { MaterialListItem } from '../MaterialListItem/MaterialListItem';

// export const MaterialList = () => {
//   const allMaterialsValues = useAppSelector(getAllMaterialValues);
//   const filters = useAppSelector(getMaterialSelectStateFilters);

//   const { filteredItems } = useMemo(() => {
//     const filteredItems = allMaterialsValues.filter((item) => {
//       const finishOk =
//         filters.Finish.length === 0 ||
//         filters.Finish.some(
//           (finish) =>
//             item.metadata?.Finish === finish ||
//             item.metadata?.Material === finish,
//         );

//       const colorOk =
//         filters.Color.length === 0 ||
//         (item.metadata?.Color &&
//           filters.Color.some((selectedColor) =>
//             item.metadata?.Color?.split(',')
//               .map((s: string) => s.trim())
//               .includes(selectedColor),
//           ));

//       const looks = item.metadata?.Look;
//       const lookOk =
//         !filters.Look ||
//         filters.Look.length === 0 ||
//         filters.Look.some(
//           (selectedLook) => looks && looks.includes(selectedLook),
//         );
//       return finishOk && colorOk && lookOk;
//     });

//     return { filteredItems };
//   }, [filters, allMaterialsValues]);

//   return (
//     <div className='flex-1 min-h-0 overflow-y-auto p-[var(--padding)]  sm:p-[var(--sm-padding)]'>
//       <div className='grid grid-cols-1 gap-[8px]  sm:grid-cols-3'>
//         {filteredItems.map((val, index) => {
//           const key = `${val.metadata.label || index}/${val.parentName}`;
//           return <MaterialListItem key={key} val={val} />;
//         })}
//       </div>
//     </div>
//   );
// };

// import { useMemo, useRef } from 'react';
// import { useVirtualizer } from '@tanstack/react-virtual';

// import { useAppSelector } from '../../../../app/store/store';
// import {
//   getAllMaterialValues,
//   getMaterialSelectStateFilters,
// } from '../../model/selectors';
// import { MaterialListItem } from '../MaterialListItem/MaterialListItem';

// export const MaterialList = () => {
//   const parentRef = useRef<HTMLDivElement | null>(null);

//   const allMaterialsValues = useAppSelector(getAllMaterialValues);
//   const filters = useAppSelector(getMaterialSelectStateFilters);

//   // ===== 1) Filter (unchanged) =====
//   const filteredItems = useMemo(() => {
//     return allMaterialsValues.filter((item) => {
//       const finishOk =
//         filters.Finish.length === 0 ||
//         filters.Finish.some(
//           (finish) =>
//             item.metadata?.Finish === finish ||
//             item.metadata?.Material === finish,
//         );

//       const colorOk =
//         filters.Color.length === 0 ||
//         (item.metadata?.Color &&
//           filters.Color.some((selectedColor) =>
//             item.metadata?.Color?.split(',')
//               .map((s: string) => s.trim())
//               .includes(selectedColor),
//           ));

//       const looks = item.metadata?.Look;
//       const lookOk =
//         !filters.Look ||
//         filters.Look.length === 0 ||
//         filters.Look.some(
//           (selectedLook) => looks && looks.includes(selectedLook),
//         );

//       return finishOk && colorOk && lookOk;
//     });
//   }, [filters, allMaterialsValues]);

//   // ===== 2) Virtualize by ROWS to preserve grid layout =====
//   // Respect your grid: 1 col on base, 3 cols on sm: (min-width: 640px).
//   // We avoid effects; we do a simple runtime check (good enough for initial render).
//   const smUp = typeof window !== 'undefined'
//     ? window.matchMedia('(min-width: 640px)').matches
//     : false;

//   const cols = smUp ? 3 : 1;
//   const rowCount = Math.ceil(filteredItems.length / cols);

//   // Estimate a row height that fits your card (image + labels + margins).
//   // Your item has ~160px–180px visual height; 120 worked for your snippet,
//   // but with labels and spacing, 160 is a safer default. Adjust as needed.
//   const rowVirtualizer = useVirtualizer({
//     count: rowCount,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 160,
//     overscan: 6,
//   });

//   const virtualRows = rowVirtualizer.getVirtualItems();

//   // ===== 3) Render (styles preserved) =====
//   return (
//     <div className="flex-1 min-h-0 overflow-y-auto p-[var(--padding)] sm:p-[var(--sm-padding)]" ref={parentRef}>
//       {/* The inner relative spacer container for absolute-positioned virtual rows */}
//       <div
//         className="relative w-full"
//         style={{ height: rowVirtualizer.getTotalSize() }}
//       >
//         {virtualRows.map((vRow) => {
//           const startIndex = vRow.index * cols;
//           const endIndex = Math.min(startIndex + cols, filteredItems.length);
//           const slice = filteredItems.slice(startIndex, endIndex);

//           return (
//             <div
//               key={vRow.key}
//               ref={rowVirtualizer.measureElement}
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 transform: `translateY(${vRow.start}px)`,
//               }}
//             >
//               {/* Keep your grid classes exactly the same */}
//               <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
//                 {slice.map((val, i) => {
//                   const key = `${val.metadata.label || startIndex + i}/${val.parentName}`;
//                   return <MaterialListItem key={key} val={val} />;
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useAppSelector } from '../../../../app/store/store';
import {
  getAllMaterialValues,
  getMaterialSelectStateFilters,
} from '../../model/selectors';
import { MaterialListItem } from '../MaterialListItem/MaterialListItem';

export const MaterialList = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const allMaterialsValues = useAppSelector(getAllMaterialValues);
  const filters = useAppSelector(getMaterialSelectStateFilters);

  // 1) Filtering (unchanged)
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
  const cols = smUp ? 3 : 1;

  const rowCount = Math.ceil(filteredItems.length / cols);

  // Estimate row height close to your card+labels+gap; refine via measureElement
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
    overscan: 6,
    measureElement: (el) => el?.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Compute slice we actually render
  const startRow = virtualRows[0]?.index ?? 0;
  const endRow = virtualRows[virtualRows.length - 1]?.index ?? -1;

  const startIndex = startRow * cols;
  const endIndex = Math.min((endRow + 1) * cols, filteredItems.length);
  const visibleItems = filteredItems.slice(startIndex, endIndex);

  const padTop = virtualRows[0]?.start ?? 0;
  const padBottom = totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0);

  return (
    <div
      ref={scrollRef}
      className='flex-1 min-h-0 overflow-y-auto p-[var(--padding)] sm:p-[var(--sm-padding)]'
    >
      <div style={{ height: padTop }} aria-hidden />

      {/* keep your grid classes exactly the same */}
      <div className='grid grid-cols-1 gap-[8px] sm:grid-cols-3'>
        {visibleItems.map((val, i) => {
          const realIndex = startIndex + i;
          const key = `${val.metadata.label || realIndex}/${val.parentName}`;
          const isEndOfRow =
            (realIndex + 1) % cols === 0 ||
            realIndex === filteredItems.length - 1;

          if (isEndOfRow) {
            return (
              <div key={key} ref={rowVirtualizer.measureElement as any}>
                <MaterialListItem val={val} />
              </div>
            );
          }
          return <MaterialListItem key={key} val={val} />;
        })}
      </div>

      {/* bottom spacer */}
      <div style={{ height: padBottom }} aria-hidden />
    </div>
  );
};
