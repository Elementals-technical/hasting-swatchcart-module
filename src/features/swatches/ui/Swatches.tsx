import { useEffect } from 'react';
import CustomSidebar from '../../../shared/ui/CustomSidebar/CustomSidebar';
import { Filters } from './Filters';
import { MaterialList } from './MaterialList';
import { ProductElement } from './ProductElement';
import { useAppDispatch } from '../../../app/store/store';
import { setAllMaterialsOptions } from '../model/swatchesSlice';
import type { IAttributeAsset } from '../model/types';
import { SwatchesList } from './SwatchesList/SwatchesList';

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
        <SwatchesList />
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold'>
            ADD SWATCHES TO CART
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
