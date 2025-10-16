import { useEffect } from 'react';
import CustomSidebar from '../../../shared/ui/CustomSidebar/CustomSidebar';
import { Filters } from './Filters';
import { MaterialList } from './MaterialList';
import { ProductElement } from './ProductElement';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import {
  setAllMaterialsOptions,
  // setListAttributes,
} from '../model/swatchesSlice';
import type { IAttributeAsset } from '../model/types';
import { getSelectedMaterials } from '../model/selectors';

interface ISwatchesProps {
  isOpen: boolean;
  attributes: IAttributeAsset[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const Swatches = ({
  isOpen,
  attributes,
  onToggleSidebar,
  // onSendData,
}: ISwatchesProps) => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials);
  useEffect(() => {
    if (!attributes) {
      throw new Error(`SwatchCart-module: Attributes are important`);
    } else {
      dispatch(setAllMaterialsOptions(attributes));
    }
  }, [attributes]);

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <div className='flex flex-col h-full min-h-0'>
        <ProductElement />
        <Filters />
        <MaterialList />
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <div className='flex justify-between items-center mb-3'>
            <div className=''>Swatches list</div>
            <div className=''>{selectedMaterials.length}/5 Selected</div>
          </div>
          <div className='flex row gap-[8px]'>
            <div className='w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm'></div>
            <div className='w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm'></div>
            <div className='w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm'></div>
            <div className='w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm'></div>
            <div className='w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm'></div>
          </div>
        </div>
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold'>
            ADD SWATCHES TO CART
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
