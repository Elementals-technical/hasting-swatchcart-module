import { useState } from 'react';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule'; // App
// import { SwatchModule } from '../../dist/main'; // build module
import { SwatchModule } from '../../lib/main'; // lib
import { EDataInputType } from '../features/DataAdapter/utils/types';
// import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';

/**
 * Demo application wrapper for {@link SwatchModule}.
 *
 * Provides local UI controls to:
 * - toggle module open/close state
 * - switch between different data input modes
 * - handle output payload from the module
 *
 * @component
 */
function App() {
  const [isOpenModule, setIsOpenModule] = useState(true);
  const [mockDataMode, setMockDataMode] = useState<EDataInputType>(
    EDataInputType.FETCH_DATA_ALL,
  );

  /**
   * Toggles the swatch module sidebar visibility.
   */
  const handleOpenSidebar = () => {
    setIsOpenModule((prev) => !prev);
  };

  /**
   * Receives output data from {@link SwatchModule}.
   *
   * @param data - Payload emitted by the module
   */
  const handleSetData = (data: unknown) => {
    console.log('handleSetData', data);
  };

  /**
   * Switches between module data input modes.
   */
  const handleChangeMode = () => {
    const newMode =
      mockDataMode === EDataInputType.FETCH_DATA_ALL
        ? EDataInputType.FETCH_DATA_PRODUCT
        : EDataInputType.FETCH_DATA_ALL;

    setMockDataMode(newMode);
  };

  return (
    <div className='swatch-module-root'>
      <div className='manipulation_block'>
        <div>
          Active type Module -{' '}
          <span className='p-1 rounded-sm bg-amber-300'>
            {mockDataMode === EDataInputType.FETCH_DATA_ALL
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

        <div className='mb-[4px]'>
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
            {mockDataMode === EDataInputType.FETCH_DATA_ALL
              ? 'Single product'
              : 'List product'}{' '}
            module
          </button>
        </div>
      </div>

      <div
        className={`${
          mockDataMode === EDataInputType.FETCH_DATA_ALL
            ? 'h-[780px] min-h-0 overflow-hidden flex flex-col border border-[var(--border)]'
            : ''
        }`}
      >
        <SwatchModule
          isOpen={isOpenModule}
          uiDataType={mockDataMode}
          // data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
          assetId='9aa4a6cc-05a2-4de0-b376-ef3ef2271bfe'
          onToggleSidebar={handleOpenSidebar}
          onSendData={handleSetData}
        />
      </div>
    </div>
  );
}

export default App;
