import { combineReducers } from '@reduxjs/toolkit';
import { swatchesReducer } from '../../features/swatches/model/swatchesSlice';
import { cartReducer } from '../../features/Cart/model/cartSlice';

const rootReducer = combineReducers({
  swatches: swatchesReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
