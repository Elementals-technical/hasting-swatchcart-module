import { SwatchModule as BaseSwatchModule } from './components/SwatchesModule';
import { withStore } from './store/withStore';

export const SwatchModule = withStore(BaseSwatchModule);

// import './styles/index.css';
