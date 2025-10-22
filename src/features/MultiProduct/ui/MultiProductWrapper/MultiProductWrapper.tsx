import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getIsOpenMultiCart,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { toggleSidebar } from '../../../swatches/model/swatchesSlice';
import { CustomModal } from '../CustomModal/CustomModal';
import { MultiProductItemCart } from '../MultiProductItemCart/MultiProductItemCart';
import { ProductList } from '../ProductList/ProductList';
import { SelectedProductItem } from '../SelectedProductItem/SelectedProductItem';

interface IMultiProductWrapperProps {
  onSendData: (data: unknown) => void;
}

export const MultiProductWrapper = ({
  onSendData,
}: IMultiProductWrapperProps) => {
  const dispatch = useAppDispatch();
  const isOpenMultiProductCart = useAppSelector(getIsOpenMultiCart);
  const selectedProduct = useAppSelector(getSelectedProduct);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <CustomModal isOpen={true} onClose={handleToggleSidebar}>
      {isOpenMultiProductCart ? (
        <MultiProductItemCart onSendData={onSendData} />
      ) : selectedProduct ? (
        <SelectedProductItem onSidebarToggle={handleToggleSidebar} />
      ) : (
        <ProductList onSidebarToggle={handleToggleSidebar} />
      )}
    </CustomModal>
  );
};
