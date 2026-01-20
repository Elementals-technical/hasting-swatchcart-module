import { useAppDispatch } from '../../../../app/store/store';
import { showErrorToast } from '../../../../shared/utils/toast';
import { DataAdapterServices } from '../../../DataAdapter/lib/DataAdapterServices';
import { EDataInputType } from '../../../DataAdapter/utils/types';
import {
  setAllMaterialsOptions,
  setSelectedProduct,
} from '../../../swatches/model/swatchesSlice';
import { getSelectedProductThunk } from '../../../swatches/model/thunks';
import { IProductListItem } from '../../model/types';
// import productThumbnail from '../../../../app/assets/images/product_thumb.png';

interface IProductListItemProps {
  productListItem: IProductListItem;
}

export const ProductListItem = ({ productListItem }: IProductListItemProps) => {
  const dispatch = useAppDispatch();

  const { name, img } = productListItem;

  const imageURL = img
    ? `https://admin-fts.threekit.com${img}`
    : 'https://clownfish-app-cvxrz.ondigitalocean.app/assets/product_thumb-Bn1S8z9K.png';

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
      } else {
        showErrorToast('Failed to load product');
      }
    }
  };

  return (
    <li
      className='min-w-0 cursor-pointer text-[12px]'
      tabIndex={0}
      onClick={handleSetSelectedItem}
    >
      <div className='mb-[12px] w-full aspect-square relative overflow-hidden rounded-sm'>
        <img
          src={
            imageURL ||
            'https://hastings-questionnaie-storage.fra1.digitaloceanspaces.com/static/Image%20(8)%20(1).png'
          }
          alt='product-list-item'
          className='absolute inset-0 w-full h-full! object-cover'
        />
      </div>
      {name}
    </li>
  );
};
