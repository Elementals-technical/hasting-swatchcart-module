import { useState } from 'react';
import { useAppSelector } from '../../src/app/store/store';
import { getIsOpenSidebar } from '../../src/features/swatches/model/selectors';
import { SwatchModule } from '../../src/features/SwatchModule/SwatchModule/ui/SwatchModule';

interface ISwatchesProps {
  isOpen: boolean;
  data: any[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const SwatchesModule = ({
  data,
  onToggleSidebar,
  onSendData,
}: ISwatchesProps) => {
  const isOpenModule = useAppSelector(getIsOpenSidebar);
  const [mockDataMode, setMockDataMode] = useState<'DATA_ALL_PRODUCT' | 'UI'>(
    'DATA_ALL_PRODUCT',
  );

  // const handleOpenSidebar = () => {
  //   dispatch(onToggleSidebar());
  // };

  const handleSetData = (data: unknown) => {
    onSendData(data);
  };

  const handleChangeMode = () => {
    const newMode =
      mockDataMode === 'DATA_ALL_PRODUCT' ? 'UI' : 'DATA_ALL_PRODUCT';

    setMockDataMode(newMode);
  };

  return (
    <>
      APP Is open module {isOpenModule ? 'open' : 'close'}
      <br />
      <button type='button' onClick={onToggleSidebar}>
        Open module
      </button>
      <br />
      <button
        className='p-1 m-2 rounded-sm bg-amber-300'
        onClick={handleChangeMode}
      >
        change app Mode to{' '}
        {mockDataMode === 'DATA_ALL_PRODUCT' ? 'UI' : 'DATA_ALL_PRODUCT'}
      </button>
      <SwatchModule
        isOpen={isOpenModule}
        uiDataType={mockDataMode}
        data={data as any[]}
        onToggleSidebar={onToggleSidebar}
        onSendData={handleSetData}
      />
    </>
  );
};
