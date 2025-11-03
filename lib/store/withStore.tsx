// withStore.tsx
import React from 'react';
import { LibraryProvider } from './LibraryProvider';

export function withStore<T extends React.ComponentType<any>>(Comp: T) {
  type P = React.ComponentProps<T>;

  const Wrapped: React.FC<P> = (props) => (
    <LibraryProvider>
      <Comp {...(props as P)} />
    </LibraryProvider>
  );

  Wrapped.displayName = `withStore(${Comp.displayName || Comp.name || 'Component'})`;
  return Wrapped;
}
