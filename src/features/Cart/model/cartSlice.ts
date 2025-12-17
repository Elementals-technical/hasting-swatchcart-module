import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';
import type { CartState, ICartItem } from './types';
// import type { AttributeValue } from '../../swatches/model/types';

const initialState: CartState = { items: [] };

// const sum = (arr: ICartItem[]) => arr.reduce((s, i) => s + i.count, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { setCartItems, clear } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
