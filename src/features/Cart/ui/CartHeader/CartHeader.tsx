import React from 'react';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { useAppSelector } from '../../../../app/store/store';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import { EActiveTab } from '../../../../shared/types/activeTab';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';

interface ICartHeaderProps {
  onSetActiveTab: (arg: EActiveTab) => void;
  onToggleSidebar: () => void;
}

export const CartHeader = ({
  onSetActiveTab,
  onToggleSidebar,
}: ICartHeaderProps) => {
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  return (
    <header className='flex p-[var(--padding)] justify-between items-center border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
      <div className='flex items-center flex-row  gap-[4px]'>
        <div className='flex items-center gap-2'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={() => onSetActiveTab(EActiveTab.SWATCH)}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0 text-base leading-[1.6] font-medium '>
            Your cart
          </h2>
        </div>
        {selectedMaterials.length >= MAX_SLOTS ? (
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
        className='flex justify-center items-center w-[30px] h-[30px] bg-[var(--background-grey)]
            border-none cursor-pointer rounded-full
            [&_svg_path]:stroke-[var(--svg-dark)]'
        onClick={onToggleSidebar}
      >
        <CloseIconSVG width={10} height={10} />
      </button>
    </header>
  );
};
