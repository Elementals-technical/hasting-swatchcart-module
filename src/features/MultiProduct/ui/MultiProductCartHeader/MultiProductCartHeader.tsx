import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { useAppDispatch } from '../../../../app/store/store';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';

interface IMultiProductCartHeaderProps {
  totalCount: number;
}

export const MultiProductCartHeader = ({
  totalCount,
}: IMultiProductCartHeaderProps) => {
  const dispatch = useAppDispatch();

  const handleGoBack = () => {
    dispatch(setIsOpenMultiProductCart(false));
  };
  return (
    <header className='flex p-[var(--padding)] justify-between items-center border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
      <div className='flex items-center flex-row  gap-[4px]'>
        <div className='flex items-center gap-2'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={handleGoBack}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0 text-base leading-[1.6] font-medium '>
            Your cart
          </h2>
        </div>
        {totalCount >= MAX_SLOTS ? (
          <>
            <span className='text-[var(--main-accent-color)] hidden text-xs sm:block'>
              ({MAX_SLOTS}) You reached maximum amount of swatches
            </span>
            <span className='text-[var(--main-accent-color)] block sm:hidden'>
              ({MAX_SLOTS}) Max
            </span>
          </>
        ) : null}
      </div>
    </header>
  );
};
