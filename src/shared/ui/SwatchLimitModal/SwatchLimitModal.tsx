import { CustomModal } from '../CustomModal/CustomModal';

interface ISwatchLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwatchLimitModal = ({
  isOpen,
  onClose,
}: ISwatchLimitModalProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width={320}
      title='Swatch Limit'
    >
      <div>
        <div className='text-sm font-medium p-[var(--sm-padding)] border-b border-[var(--border)] leading-[20px]'>
          <p className='mb-4'>
            You've reached your maximum number of swatches!
          </p>

          <p>
            If you'd like to add another swatch please remove an existing swatch
            from your cart
          </p>
        </div>
        <div className='p-[var(--sm-padding)] w-full'>
          <button
            className='
        w-full block py-3 rounded-full
        bg-[var(--main-accent-color)] text-white font-bold capitalize
          '
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </CustomModal>
  );
};
