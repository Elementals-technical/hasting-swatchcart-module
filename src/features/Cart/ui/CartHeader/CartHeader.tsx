import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { useAppSelector } from '../../../../app/store/store';
import { EActiveTab } from '../../../../shared/types/activeTab';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { useMemo } from 'react';
import { getSelectedMaterials } from '../../../swatches/model/selectors';

interface ICartHeaderProps {
  onSetActiveTab?: (arg: EActiveTab) => void;
  onToggleSidebar: () => void;
}

export const CartHeader = ({
  onSetActiveTab,
  onToggleSidebar,
}: ICartHeaderProps) => {
  const selectedMaterials = useAppSelector(getSelectedMaterials);

  /**
   * Count exact number of swatch in the cart
   */
  const totalCount = useMemo(() => {
    return selectedMaterials.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [selectedMaterials]);

  return (
    <header className='flex flex-row MaterialMultiProductList justify-between items-center border-b border-solid border-[var(--border)] p-[var(--sm-padding)]'>
      <div className='flex flex-row items-center gap-[4px]'>
        <div className='flex flex-row items-center gap-[8px]'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={() =>
              onSetActiveTab && onSetActiveTab(EActiveTab.SWATCH as EActiveTab)
            }
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0! text-base leading-[1.6] font-medium '>
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
      <button
        className='flex flex-row justify-center items-center w-[30px] h-[30px] bg-[var(--background-grey)]
            border-none cursor-pointer rounded-full
            [&_svg_path]:stroke-[var(--svg-dark)]'
        onClick={onToggleSidebar}
      >
        <CloseIconSVG width={10} height={10} />
      </button>
    </header>
  );
};
