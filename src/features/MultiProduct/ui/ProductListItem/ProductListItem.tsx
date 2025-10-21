import type { IProduct } from '../../model/types';
import productThumbnail from '../../../../app/assets/images/product_thumb.png';

interface IProductListItemProps {
  productListItem: IProduct;
}

export const ProductListItem = ({ productListItem }: IProductListItemProps) => {
  const { name } = productListItem;
  return (
    <li className='min-w-0 cursor-pointer' tabIndex={0}>
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
