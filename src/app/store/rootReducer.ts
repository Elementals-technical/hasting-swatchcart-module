import { combineReducers } from '@reduxjs/toolkit';
import { swatchesReducer } from '../../features/swatches/model/swatchesSlice';

const rootReducer = combineReducers({
  swatches: swatchesReducer,
  // ui: uiReducer,
  // app: appReducer,
  // user: userReducer,
  // projects: projectsReducer,
  // locationOptimization: locationOptimizationReducer,
  // predictive: predictiveAnalyticsReducer,
  // projection: projectionReducer,
  // projectionResult: projectionResultReducer,
  // earthObservation: earthObservationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
