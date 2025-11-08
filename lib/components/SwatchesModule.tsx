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
import { getSelectedProductThunk } from '../../src/features/swatches/model/thunks';
import { getProductListThunk } from '../../src/features/MultiProduct/model/thunk';

export interface ISwatchesModuleProps {
  isOpen: boolean;
  uiDataType: EDataInputType;
  assetId?: string;
  data?: IAttributeAsset[] | any[];
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

  useEffect(() => {
    // if (!data && uiDataType === EDataInputType.UI) {
    //   throw new Error(`SwatchCart-module: Attributes are important`);
    // } else {
    if (uiDataType === EDataInputType.UI) {
      if (!data) throw new Error(`SwatchCart-module: Attributes are important`);

      const uiData = DataAdapterServices.getTransformedData({
        dataType: EDataInputType.UI,
        data,
      });

      if (uiData) {
        dispatch(setAllMaterialsOptions(uiData));
      }
    } else if (uiDataType === EDataInputType.FETCH_DATA_PRODUCT && assetId) {
      const fetchProductDetails = async () => {
        try {
          const productData = await dispatch(
            getSelectedProductThunk({ assetId }),
          ).unwrap();

          const fetchProductData = DataAdapterServices.getTransformedData({
            dataType: EDataInputType.FETCH_DATA_PRODUCT,
            data: productData,
          });

          dispatch(setAllMaterialsOptions(fetchProductData));
        } catch (error) {
          console.error('Failed to load product', error);
        }
      };
      fetchProductDetails();
    } else if (uiDataType === EDataInputType.FETCH_DATA_ALL) {
      const fetchProductDetails = async () => {
        try {
          dispatch(getProductListThunk()).unwrap();
        } catch (error) {
          console.error('Failed to load product', error);
        }
      };
      fetchProductDetails();
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
