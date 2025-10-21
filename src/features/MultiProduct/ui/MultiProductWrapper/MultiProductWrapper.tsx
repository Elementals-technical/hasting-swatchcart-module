import { useAppDispatch } from '../../../../app/store/store';
import { toggleSidebar } from '../../../swatches/model/swatchesSlice';
import { CustomModal } from '../CustomModal/CustomModal';
import { ProductList } from '../ProductList/ProductList';

export const MultiProductWrapper = () => {
  const dispatch = useAppDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <CustomModal isOpen={true} onClose={handleToggleSidebar}>
      <ProductList onSidebarToggle={handleToggleSidebar} />
    </CustomModal>
  );
};
