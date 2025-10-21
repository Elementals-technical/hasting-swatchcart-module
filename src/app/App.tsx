import { getIsOpenSidebar } from '../features/swatches/model/selectors';
import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
import { SwatchModule } from '../features/SwatchModule/SwatchModule/SwatchModule';
import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';
// import {SwatchesModule} from '../../dist/components/SwatchesModule'
import { useAppDispatch, useAppSelector } from './store/store';

function App() {
  const dispatch = useAppDispatch();
  const isOpenModule = useAppSelector(getIsOpenSidebar);

  const handleOpenSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSetData = (data: unknown) => {
    console.log('handleSetData', data);
  };

  return (
    <>
      APP Is open module {isOpenModule ? 'open' : 'close'}
      <br />
      <button type='button' onClick={handleOpenSidebar}>
        Open module
      </button>
      <SwatchModule
        isOpen={isOpenModule}
        uiDataType='DATA_ALL_PRODUCT'
        data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
    </>
  );
}

export default App;
