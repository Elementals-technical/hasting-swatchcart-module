import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import rootReducer from './rootReducer';
import { storageMiddleware } from '../../src/app/store/storageMiddleware';

let _store: ReturnType<typeof createLibStore> | null = null;

function createLibStore() {
  console.log('[LibStore] Creating store with storage middleware');
  return configureStore({
    reducer: rootReducer,
    devTools: import.meta.env.DEV,
    middleware: (gdm) => gdm({ thunk: true }).concat(storageMiddleware),
  });
}

export const getStore = () => {
  if (!_store) _store = createLibStore();
  return _store;
};

// Force store recreation on hot reload
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    _store = null;
  });
}

type AppStore = ReturnType<typeof getStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
