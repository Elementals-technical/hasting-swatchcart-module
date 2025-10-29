import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from './store';

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={getStore()}>{children}</Provider>;
}
