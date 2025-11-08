import { useMemo } from 'react';
import { CheckMarkIconSVG } from '../../../../app/assets/svg/CheckMarkIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { AttributeHelper } from '../../../swatches/lib/AttributeHelper';
import { AttributeValue } from '../../../swatches/model/types';
import { HexGridZoom } from '../../../swatches/ui/HexGridZoom/HexGridZoom';
import { ImageGridZoom } from '../../../swatches/ui/ImageGridZoom/ImageGridZoom';
import {
  setActiveMultiCartProduct,
  setMultiCartItems,
} from '../../model/multiProductCartSlice';
import { getMultiCartItems } from '../../model/selectors';
import { IMultiCartProductItem } from '../../model/types';
import { getSelectedProduct } from '../../../swatches/model/selectors';

export const MaterialMultiProductListItem = ({
  val,
}: {
  val: AttributeValue;
}) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  const handleSelect = (item: AttributeValue) => {
    if (!selectedProduct) return;

    const activeProduct = selectedProducts.find(
      (product) => selectedProduct.assetId === product.assetId,
    );

    const isSame = (i: AttributeValue) =>
      i.metadata?.label === item.metadata?.label &&
      i.parentName === item.parentName;

    const exists = allItems.some(isSame);

    if (exists) {
      const filteredArray = allItems.filter((item) => !isSame(item));
      const existProductId = selectedProducts.find((p) =>
        p.items.some(
          (i) =>
            i.metadata?.label === item.metadata?.label &&
            i.parentName === item.parentName,
        ),
      );
      const cartProductItem: IMultiCartProductItem = {
        assetId: existProductId?.assetId || selectedProduct.assetId,
        name: selectedProduct.name,
        items: filteredArray,
      };

      dispatch(setMultiCartItems(cartProductItem));
      dispatch(setActiveMultiCartProduct(cartProductItem));
    } else {
      const newMaterial = { ...item, count: 1 };

      const items = activeProduct
        ? [...activeProduct.items, newMaterial]
        : [newMaterial];

      const cartProductItem: IMultiCartProductItem = {
        assetId: selectedProduct.assetId,
        name: selectedProduct.name,
        items,
      };

      dispatch(setMultiCartItems(cartProductItem));
      dispatch(setActiveMultiCartProduct(cartProductItem));
    }
  };

  const isSelected = allItems.find(
    (elem) => elem.value === val.value && elem.parentName === val.parentName,
  );

  return (
    <div className='w-31 rounded mb-[20px] sm:w-40'>
      <button
        key={val.assetId}
        onClick={() => handleSelect(val)}
        className={`w-31 h-31 rounded sm:w-40 sm:h-40 relative aspect-square overflow-hidden transition ${
          isSelected ? 'border-amber-700' : 'border-transparent'
        }`}
      >
        {AttributeHelper.getImage(val) ? (
          <ImageGridZoom item={val} />
        ) : (
          <HexGridZoom item={val} />
        )}
        <div
          className={`absolute top-0 right-0 m-2 w-[30px] h-[30px] flex justify-center items-center
            bg-[var(--background-grey)] rounded-2xl
            border-none pointer-events-none
            ${isSelected ? 'bg-[var(--main-accent-color)]' : ''}`}
        >
          <CheckMarkIconSVG />
        </div>
      </button>
      <div className='flex flex-col mt-3'>
        <span className='font-normal mb-1'>{val.metadata?.label}</span>
        <span className='font-medium'>{val.parentName} </span>
      </div>
    </div>
  );
};
