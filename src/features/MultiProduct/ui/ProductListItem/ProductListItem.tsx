import productThumbnail from '../../../../app/assets/images/product_thumb.png';
import { IProduct } from '../../../swatches/model/types';

interface IProductListItemProps {
  productListItem: IProduct;
}

export const ProductListItem = ({ productListItem }: IProductListItemProps) => {
  // const dispatch = useAppDispatch();
  const { name } = productListItem;

  const handleSetSelectedItem = async () => {
    const { productId, name } = productListItem;

    if (productId && name) {
      // const data = await dispatch(
      //   getSelectedProductThunk({ assetId: "c5f1aeee-d13b-41f6-98d6-75fd35c49236" }),
      // ).unwrap();
      // if (data) {
      //   const attributes = data.attributes;
      //   const selectedProduct = data;
      //   dispatch(setSelectedProduct(selectedProduct));
      //   if (attributes?.length) {
      //     const uiData = DataAdapterServices.getTransformedData({
      //       dataType: EDataInputType.UI,
      //       data: attributes,
      //     });
      //     if (uiData) {
      //       dispatch(resetSelectedMaterials());
      //       dispatch(setAllMaterialsOptions(uiData));
      //     }
      //   }
      // }
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
