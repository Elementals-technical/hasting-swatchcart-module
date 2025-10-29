import { useState } from 'react';
// import { getIsOpenSidebar } from '../features/swatches/model/selectors';
// import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule';
import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';
// import { useAppDispatch, useAppSelector } from './store/store';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule';
import { SwatchModule } from '../../lib/main';

function App() {
  const [isOpenModule, setIsOpenModule] = useState(true);
  const [mockDataMode, setMockDataMode] = useState<'DATA_ALL_PRODUCT' | 'UI'>(
    'DATA_ALL_PRODUCT',
  );

  const handleOpenSidebar = () => {
    setIsOpenModule((prev) => !prev);
  };

  const handleSetData = (data: unknown) => {
    console.log('handleSetData', data);
  };
  // const dispatch = useAppDispatch();
  // const isOpenModule = useAppSelector(getIsOpenSidebar);

  // const [mockDataMode, setMockDataMode] = useState<'DATA_ALL_PRODUCT' | 'UI'>(
  //   'DATA_ALL_PRODUCT',
  // );

  // const handleOpenSidebar = () => {
  //   // dispatch(toggleSidebar());
  // };

  // const handleSetData = (data: unknown) => {
  //   console.log('handleSetData', data);
  // };

  const handleChangeMode = () => {
    const newMode =
      mockDataMode === 'DATA_ALL_PRODUCT' ? 'UI' : 'DATA_ALL_PRODUCT';

    setMockDataMode(newMode);
  };

  return (
    <>
      APP Is open module {isOpenModule ? 'open' : 'close'}
      <br />
      <button type='button' onClick={handleOpenSidebar}>
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
        data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
    </>
  );
}

export default App;
