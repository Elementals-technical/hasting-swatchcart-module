import productThumbnail from '../../../../app/assets/images/product_thumb.png';
import { useAppDispatch } from '../../../../app/store/store';
import { DataAdapterServices } from '../../../DataAdapter/lib/DataAdapterServices';
import { EDataInputType } from '../../../DataAdapter/utils/types';
import {
  setAllMaterialsOptions,
  setSelectedProduct,
} from '../../../swatches/model/swatchesSlice';
import { getSelectedProductThunk } from '../../../swatches/model/thunks';
import { IProductListItem } from '../../model/types';

interface IProductListItemProps {
  productListItem: IProductListItem;
}

export const ProductListItem = ({ productListItem }: IProductListItemProps) => {
  const dispatch = useAppDispatch();
  const { name, img } = productListItem;

  const imageURL = img
    ? `https://admin-fts.threekit.com${img}`
    : productThumbnail;

  const handleSetSelectedItem = async () => {
    const { assetId, name } = productListItem;

    if (assetId && name) {
      const productData = await dispatch(
        getSelectedProductThunk({ assetId }),
      ).unwrap();
      if (productData) {
        dispatch(setSelectedProduct(productListItem));
        const fetchProductData = DataAdapterServices.getTransformedData({
          dataType: EDataInputType.FETCH_DATA_PRODUCT,
          data: productData,
        });
        dispatch(setAllMaterialsOptions(fetchProductData));
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
          src={imageURL}
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
