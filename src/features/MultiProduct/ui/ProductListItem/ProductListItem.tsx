import type { IProduct } from '../../model/types';
import productThumbnail from '../../../../app/assets/images/product_thumb.png';
import { useAppDispatch } from '../../../../app/store/store';
import { getSelectedProductThunk } from '../../../swatches/model/thunks';
import {
  setAllMaterialsOptions,
  setSelectedProduct,
} from '../../../swatches/model/swatchesSlice';
import { DataAdapterServices } from '../../../DataAdapter/lib/DataAdapterServices';
import { EDataInputType } from '../../../DataAdapter/utils/types';

interface IProductListItemProps {
  productListItem: IProduct;
}

export const ProductListItem = ({ productListItem }: IProductListItemProps) => {
  const dispatch = useAppDispatch();
  const { name } = productListItem;

  const handleSetSelectedItem = async () => {
    const productId = productListItem.productId;

    if (productId) {
      const data = await dispatch(
        getSelectedProductThunk({ productId }),
      ).unwrap();
      if (data) {
        const attributes = data.attributes;
        const selectedProduct = data;
        dispatch(setSelectedProduct(selectedProduct));
        if (attributes?.length) {
          const uiData = DataAdapterServices.getTransformedData({
            dataType: EDataInputType.UI,
            data: attributes,
          });

          if (uiData) {
            console.log('uiData', uiData);
            dispatch(setAllMaterialsOptions(uiData));
          }
        }
      }
    }
  };

  return (
    <li
      className='min-w-0 cursor-pointer'
      tabIndex={0}
      onClick={handleSetSelectedItem}
    >
      <div className='mb-3 aspect-[16/9] w-ful sm:w-full'>
        <img
          src={productThumbnail}
          alt='product-list-item'
          className='w-30 h-30 object-cover rounded-sm
          sm:w-40 sm:h-40
          '
        />
      </div>
      {name}
    </li>
  );
};
