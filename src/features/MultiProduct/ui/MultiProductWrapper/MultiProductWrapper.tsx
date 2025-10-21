import { CustomModal } from '../CustomModal/CustomModal';

export const MultiProductWrapper = () => {
  return (
    <CustomModal isOpen={true} onClose={() => console.log('close')}>
      <div>MultiProductWrapper</div>
    </CustomModal>
  );
};
