import { useAppSelector } from '../../../../app/store/store';
import {
  getIsOpenMultiCart,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { MultiProductItemCart } from '../MultiProductItemCart/MultiProductItemCart';
import { ProductList } from '../ProductList/ProductList';
import { SelectedProductItem } from '../SelectedProductItem/SelectedProductItem';

interface IMultiProductWrapperProps {
  onSendData: (data: unknown) => void;
  onToggleSidebar: () => void;
}

export const MultiProductWrapper = ({
  onSendData,
  onToggleSidebar,
}: IMultiProductWrapperProps) => {
  const isOpenMultiProductCart = useAppSelector(getIsOpenMultiCart);
  const selectedProduct = useAppSelector(getSelectedProduct);

  const handleToggleSidebar = () => {
    onToggleSidebar();
  };

  return (
    <div>
      {isOpenMultiProductCart ? (
        <MultiProductItemCart
          onSendData={onSendData}
          // onToggleSidebar={onToggleSidebar}
        />
      ) : selectedProduct ? (
        <SelectedProductItem onSidebarToggle={handleToggleSidebar} />
      ) : (
        <ProductList />
      )}
    </div>
  );
};
