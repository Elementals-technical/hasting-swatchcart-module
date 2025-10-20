import { getIsOpenSidebar } from '../features/swatches/model/selectors';
import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
import { Swatches } from '../features/swatches/ui/Swatches';
import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';
// import {SwatchesModule} from '../../dist/components/SwatchesModule'
import { useAppDispatch, useAppSelector } from './store/store';

function App() {
  const dispatch = useAppDispatch();
  const isOpenSidebar = useAppSelector(getIsOpenSidebar);

  const handleOpenSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSetData = (data: unknown) => {
    console.log('handleSetData', data);
  };

  return (
    <>
      APP Is open sidebar {isOpenSidebar ? 'open' : 'close'}
      <button type='button' onClick={handleOpenSidebar}>
        Open sidebar
      </button>
      <Swatches
        isOpen={isOpenSidebar}
        uiDataType='UI'
        data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
      {/* <SwatchesModule isOpen={isOpenSidebar} onToggleSidebar={handleOpenSidebar} onSendData={handleSetData}/>  */}
    </>
  );
}

export default App;
