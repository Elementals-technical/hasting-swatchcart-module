import { getIsOpenSidebar } from '../features/swatches/model/selectors';
import { toggleSidebar } from '../features/swatches/model/swatchesSlice';
import { useAppDispatch, useAppSelector } from './store/store';
import './styles/App.css';

function App() {
  const dispatch = useAppDispatch();
  const isOpenSidebar = useAppSelector(getIsOpenSidebar);

  const handleOpenSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      APP
      <button type='button' onClick={handleOpenSidebar}>
        Is open sidebar {isOpenSidebar ? 'open' : 'close'}
      </button>
    </>
  );
}

export default App;
