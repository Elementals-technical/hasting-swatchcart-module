import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';
import type { CartState, ICartItem } from './types';
import type { AttributeValue } from '../../swatches/model/types';

const initialState: CartState = { items: [] };

const sum = (arr: ICartItem[]) => arr.reduce((s, i) => s + i.count, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
    },
    removeItem(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;

      state.items = state.items.filter(
        (i) =>
          !(i.metadata.label === metadata.label && i.parentName === parentName),
      );
    },
    increment(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;

      const item = state.items.find(
        (i) =>
          i.metadata.label === metadata.label && i.parentName === parentName,
      );
      if (!item) return;
      if (sum(state.items) < MAX_SLOTS) {
        item.count += 1;
      }
    },
    decrement(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;
      const item = state.items.find(
        (i) =>
          i.metadata.label === metadata.label && i.parentName === parentName,
      );
      if (!item) return;
      if (item.count > 1) item.count -= 1;
    },
    setCount(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue; next: number }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;
      const { next } = action.payload;
      const item = state.items.find(
        (i) =>
          i.metadata.label === metadata.label && i.parentName === parentName,
      );
      if (!item) return;

      const clamped = Math.max(1, Math.floor(next));
      const otherTotal = state.items
        .filter(
          (i) =>
            !(
              i.metadata.label === metadata.label && i.parentName === parentName
            ),
        )
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
