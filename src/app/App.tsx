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
      <div className='flex flex-col gap-3 m-2'>
        <div>
          Active type Module -{' '}
          <span className='p-1 rounded-sm bg-amber-300'>
            {mockDataMode === 'DATA_ALL_PRODUCT'
              ? 'List product'
              : 'Single product'}
          </span>
        </div>
        <div>
          Status -{' '}
          <span className='p-1 rounded-sm bg-amber-300'>
            {isOpenModule ? 'Open' : 'Close'}
          </span>
        </div>
        <div className='mb-1'>
          <button
            type='button'
            onClick={handleOpenSidebar}
            className='px-4 py-2 rounded bg-[var(--main-accent-color)] text-white'
          >
            {isOpenModule ? 'Close' : 'Open'} module
          </button>
        </div>
        <div>
          <button
            type='button'
            onClick={handleChangeMode}
            className='px-4 py-2 rounded bg-[var(--main-accent-color)] text-white'
          >
            Change type to{' '}
            {mockDataMode === 'DATA_ALL_PRODUCT'
              ? 'Single product'
              : 'List product'}{' '}
            module
          </button>
        </div>
      </div>
      <SwatchModule
        isOpen={isOpenModule}
        uiDataType={EDataInputType.FETCH_DATA_ALL}
        // uiDataType={"DATA_ALL_PRODUCT"}
        // data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        assetId='9aa4a6cc-05a2-4de0-b376-ef3ef2271bfe'
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
    </>
  );
}

export default App;
