import { useState } from 'react';
// import { getIsOpenSidebar } from '../features/swatches/model/selectors';
// import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule';
// import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';
// import { useAppDispatch, useAppSelector } from './store/store';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule'; // App
// import { SwatchModule } from '../../dist/main'; // build module
import { SwatchModule } from '../../lib/main'; // lib
import { EDataInputType } from '../features/DataAdapter/utils/types';

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
        uiDataType={EDataInputType.FETCH_DATA_PRODUCT}
        // uiDataType={mockDataMode}
        // data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        assetId='9aa4a6cc-05a2-4de0-b376-ef3ef2271bfe'
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
    </>
  );
}

export default App;
