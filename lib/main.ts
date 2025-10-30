import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './assets/styles/index.css';
import { SwatchModule as BaseSwatchModule } from './components/SwatchesModule';
import { withStore } from './store/withStore';
export type { ISwatchesModuleProps } from './components/SwatchesModule'; // <-- important

export const SwatchModule = withStore(BaseSwatchModule);

// Tiny helper so CDN users don't import React
export function mountSwatchModule(
  el: HTMLElement,
  props: React.ComponentProps<typeof SwatchModule>,
) {
  const root = ReactDOMClient.createRoot(el);
  root.render(React.createElement(SwatchModule, props));
  return () => root.unmount();
}
