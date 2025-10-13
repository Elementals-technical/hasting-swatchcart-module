import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';

interface IStoreProviderProps {
  children: React.ReactNode;
}

const StoreProvider = ({ children }: IStoreProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
