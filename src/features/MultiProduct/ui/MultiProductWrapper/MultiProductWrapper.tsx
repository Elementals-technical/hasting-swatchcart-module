import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getIsOpenMultiCart,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { MultiProductItemCart } from '../MultiProductItemCart/MultiProductItemCart';
import { ProductList } from '../ProductList/ProductList';
import { SelectedProductItem } from '../SelectedProductItem/SelectedProductItem';
import { clear } from '../../model/multiProductCartSlice';
import { deleteSelectedProduct } from '../../../swatches/model/swatchesSlice';

interface IMultiProductWrapperProps {
  onSendData: (data: unknown) => void;
  onToggleSidebar?: () => void;
}

export const MultiProductWrapper = ({
  onSendData,
}: IMultiProductWrapperProps) => {
  const dispatch = useAppDispatch();
  const isOpenMultiProductCart = useAppSelector(getIsOpenMultiCart);
  const selectedProduct = useAppSelector(getSelectedProduct);

  useEffect(() => {
    return () => {
      console.log('MultiProductWrapper unmount');
      dispatch(clear());
      dispatch(deleteSelectedProduct());
    };
  }, []);

  // const handleToggleSidebar = () => {
  //   onToggleSidebar();
  // };

  return (
    // Simulate a parent height block delete before pushing to the module
    // <div className='h-[600px] min-h-0 overflow-hidden flex flex-col border'>
    <>
      {isOpenMultiProductCart ? (
        <MultiProductItemCart
          onSendData={onSendData}
          // onToggleSidebar={onToggleSidebar}
        />
      ) : selectedProduct ? (
        <SelectedProductItem />
      ) : (
        <ProductList />
      )}
    </>
    // </div>
  );
};
