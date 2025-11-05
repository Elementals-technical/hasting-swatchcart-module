// import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
// import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
// import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
// import { getSelectedProduct } from '../../../swatches/model/selectors';
// import { deleteSelectedProduct } from '../../../swatches/model/swatchesSlice';
// import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';
// import { MaterialMultiProductList } from '../MaterialMultiProductList/MaterialMultiProductList';
// import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

// interface ISelectedProductItemProps {
//   onSidebarToggle: () => void;
// }

// export const SelectedProductItem = ({
//   onSidebarToggle,
// }: ISelectedProductItemProps) => {
//   const dispatch = useAppDispatch();
//   const selectedProduct = useAppSelector(getSelectedProduct);

//   const handleGoBack = () => {
//     dispatch(deleteSelectedProduct());
//   };

//   return (
//     <div className='flex h-full flex-col'>
//       <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
//         <div className='flex items-center gap-2'>
//           <button
//             className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
//             onClick={handleGoBack}
//           >
//             <ArrowIconSVG />
//           </button>
//           <h2 className='m-0 text-base leading-[1.6] font-medium '>
//             {selectedProduct?.name}
//           </h2>
//         </div>
//         <button
//           onClick={onSidebarToggle}
//           className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
//                       [&_svg_path]:stroke-[var(--svg-dark)]'
//         >
//           <CloseIconSVG width={10} height={10} />
//         </button>
//       </header>
//       <div className='flex min-h-0 flex-1 flex-col'>
//         <FiltersSelectedProductItem />
//         <MaterialMultiProductList
//           containerStyles='flex-1 max-h-50 overflow-y-auto p-[var(--sm-padding)] md:max-h-94'
//           gridStyles='grid grid-cols-2 gap-4 sm:grid-cols-8'
//           desktopColumnsCount={6}
//         />
//         <div className=''>
//           <SwatchContentContainer />
//         </div>
//       </div>
//     </div>
//   );
// };

import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import { deleteSelectedProduct } from '../../../swatches/model/swatchesSlice';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';
import { MaterialMultiProductList } from '../MaterialMultiProductList/MaterialMultiProductList';
import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

interface ISelectedProductItemProps {
  onSidebarToggle: () => void;
}

export const SelectedProductItem = ({
  onSidebarToggle,
}: ISelectedProductItemProps) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);

  const handleGoBack = () => {
    dispatch(deleteSelectedProduct());
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Header (pinned) */}
      <header className='flex shrink-0 items-center justify-between border-b border-[var(--border)] p-[var(--sm-padding)]'>
        <div className='flex items-center gap-2'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={handleGoBack}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0 text-base font-medium leading-[1.6]'>
            {selectedProduct?.name}
          </h2>
        </div>

        <button
          onClick={onSidebarToggle}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
                     [&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>

      {/* Body */}
      <div className='flex min-h-0 flex-1 flex-col'>
        {/* Top controls (pinned row) */}
        <div className='shrink-0 border-b border-[var(--border)]'>
          <FiltersSelectedProductItem />
        </div>

        {/* Scrollable list only */}
        <MaterialMultiProductList
          containerStyles='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)]'
          gridStyles='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'
          desktopColumnsCount={6}
        />

        {/* Bottom container (pinned) */}
        <div className='shrink-0 border-t border-[var(--border)]'>
          <SwatchContentContainer />
        </div>
      </div>
    </div>
  );
};
