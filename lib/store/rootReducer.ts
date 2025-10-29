import { combineReducers } from '@reduxjs/toolkit';
import { swatchesReducer } from '../../src/features/swatches/model/swatchesSlice';
import { cartReducer } from '../../src/features/Cart/model/cartSlice';
import { multiProductCartReducer } from '../../src/features/MultiProduct/model/multiProductCartSlice';

const rootReducer = combineReducers({
  swatches: swatchesReducer,
  cart: cartReducer,
  multiProductCart: multiProductCartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
