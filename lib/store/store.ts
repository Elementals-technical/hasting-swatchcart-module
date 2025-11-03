import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import rootReducer from './rootReducer';

let _store: ReturnType<typeof createLibStore> | null = null;

function createLibStore() {
  return configureStore({
    reducer: rootReducer,
    devTools: false,
    middleware: (gdm) => gdm({ thunk: true }),
  });
}

export const getStore = () => {
  if (!_store) _store = createLibStore();
  return _store;
};

type AppStore = ReturnType<typeof getStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
