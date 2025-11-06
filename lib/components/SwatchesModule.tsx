import { EDataInputType } from '../../src/features/DataAdapter/utils/types';
import { MultiProductWrapper } from '../../src/features/MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import { IAttributeAsset } from '../../src/features/swatches/model/types';
import { Swatches } from '../../src/features/swatches/ui/Swatches';
import { LibraryProvider } from '../store/LibraryProvider';
import '../assets/styles/index.css';
import { useAppDispatch } from '../store/store';
import { useEffect } from 'react';
import { DataAdapterServices } from '../../src/features/DataAdapter/lib/DataAdapterServices';
import { setAllMaterialsOptions } from '../../src/features/swatches/model/swatchesSlice';

export interface ISwatchesModuleProps {
  isOpen: boolean;
  uiDataType: EDataInputType;
  assetId?: string;
  data: IAttributeAsset[] | any[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const SwatchModule = ({
  isOpen,
  uiDataType,
  data,
  assetId,
  onToggleSidebar,
  onSendData,
}: ISwatchesModuleProps) => {
  const SINGLE_PRODUCT_DATA: ReadonlyArray<EDataInputType> = [
    EDataInputType.UI,
    EDataInputType.FETCH_DATA_PRODUCT,
  ];

  const isSingleProduct = SINGLE_PRODUCT_DATA.includes(uiDataType);

  const dispatch = useAppDispatch();
  console.log('Swatches assetIв', assetId);
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
      } else if (uiDataType === EDataInputType.FETCH_DATA_PRODUCT) {
        console.log('Swatches assetId effect', assetId);
      }
    }
  }, [uiDataType, data, assetId]);

  return (
    <LibraryProvider>
      {isOpen ? (
        <>
          {!isSingleProduct ? (
            <MultiProductWrapper
              onSendData={onSendData}
              onToggleSidebar={onToggleSidebar}
            />
          ) : null}

          {isSingleProduct ? (
            <Swatches
              isOpen={isOpen}
              uiDataType={uiDataType}
              data={data as any[]}
              assetId={assetId}
              onToggleSidebar={onToggleSidebar}
              onSendData={onSendData}
            />
          ) : null}
        </>
      ) : null}
    </LibraryProvider>
  );
};
