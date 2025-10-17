import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/store/store';
import { setAllMaterialsOptions } from '../model/swatchesSlice';
import type { IAttributeAsset } from '../model/types';
import { SwatchWrapper } from './SwatchWrapper/SwatchWrapper';
import { CartWrapper } from '../../Cart/ui/CartWrapper/CartWrapper';
import { EActiveTab } from '../../../shared/types/activeTab';

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
  const [activeTab, setActiveTab] = useState<EActiveTab>(EActiveTab.SWATCH);

  useEffect(() => {
    if (!attributes) {
      throw new Error(`SwatchCart-module: Attributes are important`);
    } else {
      dispatch(setAllMaterialsOptions(attributes));
    }
  }, [attributes]);

  const handleSetActiveTab = (activeTab: EActiveTab) => {
    setActiveTab(activeTab);
  };

  return (
    <>
      {activeTab === EActiveTab.SWATCH ? (
        <SwatchWrapper
          isOpen={isOpen}
          onToggleSidebar={onToggleSidebar}
          onSetActiveTab={handleSetActiveTab}
        />
      ) : (
        <CartWrapper
          isOpen={isOpen}
          onToggleSidebar={onToggleSidebar}
          onSetActiveTab={handleSetActiveTab}
        />
      )}
    </>
  );
};
