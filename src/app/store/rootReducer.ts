import { combineReducers } from '@reduxjs/toolkit';
import { swatchesReducer } from '../../features/swatches/model/swatchesSlice';

const rootReducer = combineReducers({
  swatches: swatchesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
