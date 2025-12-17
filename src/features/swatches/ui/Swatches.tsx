import { useEffect, useState } from 'react';
import { SwatchWrapper } from './SwatchWrapper/SwatchWrapper';
import { CartWrapper } from '../../Cart/ui/CartWrapper/CartWrapper';
import { EActiveTab } from '../../../shared/types/activeTab';
import { ISwatchesModuleProps } from '../../../../lib/main';
// import { clear } from '../../Cart/model/cartSlice';
import { useAppDispatch } from '../../../app/store/store';
import { clear } from '../../MultiProduct/model/multiProductCartSlice';
import { resetSelectedMaterials } from '../model/swatchesSlice';

export const Swatches = ({
  isOpen,
  onToggleSidebar,
  onSendData,
}: ISwatchesModuleProps) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<EActiveTab>(EActiveTab.SWATCH);

  useEffect(() => {
    return () => {
      dispatch(clear());
      dispatch(resetSelectedMaterials());
    };
  }, []);

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
          onSendData={onSendData}
        />
      )}
    </>
  );
};
