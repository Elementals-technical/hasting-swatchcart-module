import CustomSidebar from '../../src/shared/ui/CustomSidebar/CustomSidebar';

interface ISwatchesProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const SwatchesModule = ({
  isOpen,
  onToggleSidebar,
  onSendData,
}: ISwatchesProps) => {
  const handleSetData = () => {
    onSendData([1, 2, 3]);
  };
  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <div>
        <p>This is sidebar content area.</p>
        <button type='button' onClick={handleSetData}>
          sendData
        </button>
      </div>
    </CustomSidebar>
  );
};
