import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';
import type { CartState, ICartItem } from './types';

const initialState: CartState = { items: [] };

const sum = (arr: ICartItem[]) => arr.reduce((s, i) => s + i.count, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
    },
    removeItem(state, { payload }: PayloadAction<{ assetId: string }>) {
      state.items = state.items.filter((i) => i.assetId !== payload.assetId);
    },
    increment(state, { payload }: PayloadAction<{ assetId: string }>) {
      const item = state.items.find((i) => i.assetId === payload.assetId);
      if (!item) return;
      if (sum(state.items) < MAX_SLOTS) {
        item.count += 1;
      }
    },
    decrement(state, { payload }: PayloadAction<{ assetId: string }>) {
      const item = state.items.find((i) => i.assetId === payload.assetId);
      if (!item) return;
      if (item.count > 1) item.count -= 1;
    },
    setCount(
      state,
      { payload }: PayloadAction<{ assetId: string; next: number }>,
    ) {
      const item = state.items.find((i) => i.assetId === payload.assetId);
      if (!item) return;

      const clamped = Math.max(1, Math.floor(payload.next));
      const otherTotal = state.items
        .filter((i) => i.assetId !== payload.assetId)
        .reduce((s, i) => s + i.count, 0);

      const maxForThis = Math.max(1, MAX_SLOTS - otherTotal);
      item.count = Math.min(clamped, maxForThis);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const {
  setCartItems,
  removeItem,
  increment,
  decrement,
  setCount,
  clear,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
