import { useAppSelector } from '../../../../app/store/store';
import {
  getIsOpenMultiCart,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { MultiProductItemCart } from '../MultiProductItemCart/MultiProductItemCart';
import { ProductList } from '../ProductList/ProductList';
import { SelectedProductItem } from '../SelectedProductItem/SelectedProductItem';
import { ToastContainer, Bounce } from 'react-toastify';

interface IMultiProductWrapperProps {
  onSendData: (data: unknown) => void;
  onToggleSidebar?: () => void;
}

export const MultiProductWrapper = ({
  onSendData,
}: IMultiProductWrapperProps) => {
  const isOpenMultiProductCart = useAppSelector(getIsOpenMultiCart);
  const selectedProduct = useAppSelector(getSelectedProduct);

  return (
    <div className='relative h-full min-h-0 w-full'>
      <ToastContainer
        containerId='swatch-multi-module'
        position='top-center'
        autoClose={4000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable={false}
        theme='dark'
        transition={Bounce}
        style={{
          zIndex: 999999999999999,
          position: 'absolute',
        }}
      />
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
    </div>
  );
};
