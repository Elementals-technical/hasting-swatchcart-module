import { CustomModal } from '../CustomModal/CustomModal';

interface ISwatchLimitModalProps {
  isOpen: boolean;
  header?: string;
  body: string;
  onClose: () => void;
}

export const SwatchLimitModal = ({
  isOpen,
  header,
  body,
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
        <div className='text-[14px] font-medium p-[var(--sm-padding)] border-b border-[var(--border)] leading-[20px]'>
          {header ? <p className='mb-4'>{header}</p> : null}

          <p>{body}</p>
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
