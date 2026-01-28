import {
  EDataInputType,
  TOnSelectMaterial,
} from '../../src/features/DataAdapter/utils/types';
import { MultiProductWrapper } from '../../src/features/MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import {
  AttributeValue,
  IAttributeAsset,
} from '../../src/features/swatches/model/types';
import { Swatches } from '../../src/features/swatches/ui/Swatches';
import { LibraryProvider } from '../store/LibraryProvider';
import '../assets/styles/index.css';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useEffect } from 'react';
import { DataAdapterServices } from '../../src/features/DataAdapter/lib/DataAdapterServices';
import {
  setAllMaterialsOptions,
  setSelectedMaterial,
} from '../../src/features/swatches/model/swatchesSlice';
import {
  getSelectedProductInformationThunk,
  getSelectedProductThunk,
} from '../../src/features/swatches/model/thunks';
import { getProductListThunk } from '../../src/features/MultiProduct/model/thunk';
import { APP_VERSION } from '../../src/shared/utils/version';
import { getSelectedMaterials } from '../../src/features/swatches/model/selectors';

export interface ISwatchesModuleProps {
  isOpen: boolean;
  uiDataType: EDataInputType;
  assetId?: string;
  data?: IAttributeAsset[] | any[];
  configurationData?: any[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
  onSelectMaterial?: TOnSelectMaterial<AttributeValue>;
}

export const SwatchModule = ({
  isOpen,
  uiDataType,
  data,
  assetId,
  configurationData,
  onToggleSidebar,
  onSendData,
  onSelectMaterial,
}: ISwatchesModuleProps) => {
  const SINGLE_PRODUCT_DATA: ReadonlyArray<EDataInputType> = [
    EDataInputType.UI,
    EDataInputType.FETCH_DATA_PRODUCT,
  ];
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials);
  const isSingleProduct = SINGLE_PRODUCT_DATA.includes(uiDataType);
  // const cartCount = useMemo(() => {
  //   return selectedMaterials.reduce((sum, item) => sum + (item.count ?? 0), 0);
  // }, [selectedMaterials]);
  useEffect(() => {
    let filteredConfigData: AttributeValue[];
    if (isOpen) {
      // if (!data && uiDataType === EDataInputType.UI) {
      //   throw new Error(`SwatchCart-module: Attributes are important`);
      // } else {
      if (uiDataType === EDataInputType.UI) {
        if (!data)
          throw new Error(`SwatchCart-module: Attributes are important`);

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
            const selectedProduct = await dispatch(
              getSelectedProductInformationThunk({ assetId }),
            ).unwrap();
            if (!selectedProduct || !productData) return;

            const fetchProductData = DataAdapterServices.getTransformedData({
              dataType: EDataInputType.FETCH_DATA_PRODUCT,
              data: productData,
              selectedProduct: selectedProduct.rows[0],
            });

            dispatch(setAllMaterialsOptions(fetchProductData));

            // This block sets selected data from the scene to single swatch module
            if (configurationData?.length) {
              // Find all material keys
              const materialsKeys = productData.materials.map(
                (item) => item.optionName,
              );

              // Transform selected data according to the swatch module cart data.
              filteredConfigData = configurationData
                ?.filter((item) => materialsKeys.includes(item.name))
                .map((option) => ({
                  label: option.valueMetadata.label,
                  value: option.valueMetadata.value,
                  metadata: option.valueMetadata,
                  optionName: option.name,
                  parentName: option.metadata.Name,
                  productInformation: selectedProduct.rows[0],
                  count: 1,
                }));

              // Set data to the store
              filteredConfigData?.forEach((item) => {
                console.log(item);
                const isExist = (i: any) =>
                  i.metadata?.label === item.metadata?.label &&
                  i.parentName === item.parentName;
                // console.log(`item ${item} - index ${index}`);

                const exists = selectedMaterials.some(isExist);
                if (exists) return;
                dispatch(
                  setSelectedMaterial({
                    selectedMaterial: { ...item, count: 1 },
                  }),
                );
              });
            }
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
    }

    return () => {
      // Reset pre-configured store data
      console.log('configurationData filteredConfigData', filteredConfigData);
      filteredConfigData?.forEach((item) => {
        dispatch(
          setSelectedMaterial({
            selectedMaterial: { ...item, count: 1 },
          }),
        );
      });
    };
  }, [uiDataType, data, assetId, isOpen]);

  console.log('✅ CURRENT VERSION OF THE SWATCHES MODULE IS: ', APP_VERSION);

  return (
    <div
      id='root-container'
      // className={`${isOpen ? 'flex' : 'hidden'} relative flex-col h-full min-h-0 w-full`}
      className={`${isOpen ? 'flex' : 'hidden'} relative flex-col h-[100dvh] min-h-0 w-full`}
    >
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
                onSelectMaterial={onSelectMaterial}
              />
            ) : null}
          </>
        ) : null}
      </LibraryProvider>
    </div>
  );
};
