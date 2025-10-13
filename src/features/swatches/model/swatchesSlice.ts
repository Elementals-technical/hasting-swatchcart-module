import { createSlice } from '@reduxjs/toolkit';
import type { ISwatchesSlice } from './types';

const initialState: ISwatchesSlice = {
  isOpenSidebar: true,
};

export const swatchesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
  },
  extraReducers: () => {},
});

export const swatchesReducer = swatchesSlice.reducer;
export const { toggleSidebar } = swatchesSlice.actions;
