import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getIsOpenMultiCart,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { toggleSidebar } from '../../../swatches/model/swatchesSlice';
import { CustomModal } from '../CustomModal/CustomModal';
import { ProductList } from '../ProductList/ProductList';
import { SelectedProductItem } from '../SelectedProductItem/SelectedProductItem';

export const MultiProductWrapper = () => {
  const dispatch = useAppDispatch();
  const isOpenMultiProductCart = useAppSelector(getIsOpenMultiCart);
  const selectedProduct = useAppSelector(getSelectedProduct);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <CustomModal isOpen={true} onClose={handleToggleSidebar}>
      {isOpenMultiProductCart ? (
        <div className=''>cart</div>
      ) : selectedProduct ? (
        <SelectedProductItem onSidebarToggle={handleToggleSidebar} />
      ) : (
        <ProductList onSidebarToggle={handleToggleSidebar} />
      )}
    </CustomModal>
  );
};
