// import { SwatchModule as BaseSwatchModule } from './components/SwatchesModule';
// import { withStore } from './store/withStore';

// export const SwatchModule = withStore(BaseSwatchModule);

// styles first so CSS is emitted
// lib/main.ts
import './components/styles.css';
import { SwatchModule as BaseSwatchModule } from './components/SwatchesModule';
import { withStore } from './store/withStore';
export type { ISwatchesModuleProps } from './components/SwatchesModule'; // <-- important

export const SwatchModule = withStore(BaseSwatchModule);
