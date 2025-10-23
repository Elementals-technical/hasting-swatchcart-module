import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartState, ICartItem, IProductCart } from './types';
import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';
import type { AttributeValue } from '../../swatches/model/types';

const initialState: CartState = { items: [] };

// ===== helpers =====
const sum = (arr: ICartItem[]) => arr.reduce((s, i) => s + i.count, 0);

function ensureProduct(state: CartState, productId: number, name?: string) {
  let bucket = state.items.find((p) => p.productId === productId);
  if (!bucket) {
    bucket = { productId, name: name ?? '', cartItems: [] };
    state.items.push(bucket);
  } else if (name && !bucket.name) {
    bucket.name = name;
  }
  return bucket;
}

function findItem(items: ICartItem[], av: AttributeValue) {
  const { metadata, parentName } = av;
  return items.find(
    (i) => i.metadata.label === metadata.label && i.parentName === parentName,
  );
}

const multiProductCartSlice = createSlice({
  name: 'multiProduct',
  initialState,
  reducers: {
    /** Upsert the whole cart for a single product (matches your payload shape) */
    setCartForProduct(state, action: PayloadAction<IProductCart>) {
      const { productId } = action.payload;
      const idx = state.items.findIndex((p) => p.productId === productId);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.push(action.payload);
    },

    /** Replace items for a product (kept legacy name, adds productId) */
    setCartItems(
      state,
      action: PayloadAction<{
        productId: number;
        items: ICartItem[];
        name?: string;
      }>,
    ) {
      const { productId, items, name } = action.payload;
      const bucket = ensureProduct(state, productId, name);
      bucket.cartItems = items;
    },

    removeItem(
      state,
      action: PayloadAction<{
        productId: number;
        selectedMaterial: AttributeValue;
      }>,
    ) {
      const { productId, selectedMaterial } = action.payload;
      const bucket = ensureProduct(state, productId);
      const { metadata, parentName } = selectedMaterial;

      bucket.cartItems = bucket.cartItems.filter(
        (i) =>
          !(i.metadata.label === metadata.label && i.parentName === parentName),
      );
    },

    increment(
      state,
      action: PayloadAction<{
        productId: number;
        selectedMaterial: AttributeValue;
      }>,
    ) {
      const { productId, selectedMaterial } = action.payload;
      const bucket = ensureProduct(state, productId);
      const item = findItem(bucket.cartItems, selectedMaterial);
      if (!item) return;

      if (sum(bucket.cartItems) < MAX_SLOTS) {
        item.count += 1;
      }
    },

    decrement(
      state,
      action: PayloadAction<{
        productId: number;
        selectedMaterial: AttributeValue;
      }>,
    ) {
      const { productId, selectedMaterial } = action.payload;
      const bucket = ensureProduct(state, productId);
      const item = findItem(bucket.cartItems, selectedMaterial);
      if (!item) return;

      if (item.count > 1) item.count -= 1;
    },

    setCount(
      state,
      action: PayloadAction<{
        productId: number;
        selectedMaterial: AttributeValue;
        next: number;
      }>,
    ) {
      const { productId, selectedMaterial, next } = action.payload;
      const bucket = ensureProduct(state, productId);
      const item = findItem(bucket.cartItems, selectedMaterial);
      if (!item) return;

      const clamped = Math.max(1, Math.floor(next));
      const othersTotal = bucket.cartItems
        .filter((i) => i !== item)
        .reduce((s, i) => s + i.count, 0);

      const maxForThis = Math.max(1, MAX_SLOTS - othersTotal);
      item.count = Math.min(clamped, maxForThis);
    },

    /** Clear a single product cart */
    clearProduct(state, action: PayloadAction<{ productId: number }>) {
      const idx = state.items.findIndex(
        (p) => p.productId === action.payload.productId,
      );
      if (idx >= 0) state.items[idx].cartItems = [];
    },

    /** Clear all products (keeps your original 'clear' name/behavior) */
    clear(state) {
      state.items = [];
    },
  },
});

export const {
  setCartForProduct,
  setCartItems,
  removeItem,
  increment,
  decrement,
  setCount,
  clearProduct,
  clear,
} = multiProductCartSlice.actions;

export const multiProductCartReducer = multiProductCartSlice.reducer;
