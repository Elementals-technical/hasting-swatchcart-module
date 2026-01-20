import { useEffect, useRef, type FC } from 'react';
import ReactDOM from 'react-dom';
import { CloseIconSVG } from '../../../app/assets/svg/CloseIconSVG';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
}

export const CustomModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title = 'Message',
  width,
  height,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-99999999999999 flex flex-row items-center justify-center bg-black/40 p-4'>
      <div
        ref={modalRef}
        className='
          bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden
          max-w-[90vw] max-h-[90vh]
        '
        style={{
          width: width || 'auto',
          height: height || 'auto',
        }}
      >
        <div className='flex flex-row items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
          <span className='text-[16px] font-semibold text-[var(--text)]'>
            {title}
          </span>

          <button
            onClick={onClose}
            className='flex flex-row justify-center items-center p-1 rounded-full bg-[var(--border)] hover:bg-gray-100 transition [&_svg_path]:stroke-[var(--svg-dark)] w-[30px] h-[30px]'
          >
            <CloseIconSVG
              className='text-[var(--text)] '
              width={10}
              hanging={10}
            />
          </button>
        </div>

        <div className='flex flex-col gap-[12px] text-[var(--text-muted)]'>
          {children}
        </div>
      </div>
    </div>,
    document.querySelector('#root-container')!,
  );
};
