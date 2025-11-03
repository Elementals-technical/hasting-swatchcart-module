import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/store/store';
import { setAllMaterialsOptions } from '../model/swatchesSlice';
import type { IAttributeAsset } from '../model/types';
import { SwatchWrapper } from './SwatchWrapper/SwatchWrapper';
import { CartWrapper } from '../../Cart/ui/CartWrapper/CartWrapper';
import { EActiveTab } from '../../../shared/types/activeTab';
import { EDataInputType } from '../../DataAdapter/utils/types';
import { DataAdapterServices } from '../../DataAdapter/lib/DataAdapterServices';

interface ISwatchesProps {
  isOpen: boolean;
  uiDataType: EDataInputType;
  data: IAttributeAsset[] | any[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const Swatches = ({
  isOpen,
  uiDataType,
  data,
  onToggleSidebar,
  onSendData,
}: ISwatchesProps) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<EActiveTab>(EActiveTab.SWATCH);

  useEffect(() => {
    if (!data) {
      throw new Error(`SwatchCart-module: Attributes are important`);
    } else {
      if (uiDataType === EDataInputType.UI) {
        const uiData = DataAdapterServices.getTransformedData({
          dataType: EDataInputType.UI,
          data,
        });
        if (uiData) {
          dispatch(setAllMaterialsOptions(uiData));
        }
      }
    }
  }, [data]);

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
