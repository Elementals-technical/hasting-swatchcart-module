import { useState } from 'react';
import { SwatchWrapper } from './SwatchWrapper/SwatchWrapper';
import { CartWrapper } from '../../Cart/ui/CartWrapper/CartWrapper';
import { EActiveTab } from '../../../shared/types/activeTab';
import { ISwatchesModuleProps } from '../../../../lib/main';

export const Swatches = ({
  isOpen,
  onToggleSidebar,
  onSendData,
}: ISwatchesModuleProps) => {
  const [activeTab, setActiveTab] = useState<EActiveTab>(EActiveTab.SWATCH);

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
