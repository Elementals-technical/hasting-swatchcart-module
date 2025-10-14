import { getIsOpenSidebar } from '../features/swatches/model/selectors';
import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
import { Swatches } from '../features/swatches/ui/Swatches';
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
      APP
      <button type='button' onClick={handleOpenSidebar}>
        Is open sidebar {isOpenSidebar ? 'open' : 'close'}
      </button>
      <Swatches
        isOpen={isOpenSidebar}
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
      />
      {/* <SwatchesModule isOpen={isOpenSidebar} onToggleSidebar={handleOpenSidebar} onSendData={handleSetData}/>  */}
    </>
  );
}

export default App;
