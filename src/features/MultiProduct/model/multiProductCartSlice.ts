import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartState, IMultiCartProductItem, IProductCart } from './types';

const initialState: CartState = {
  items: [],
  activeMultiCartProduct: null,
  totalCount: 0,
};

function ensureProduct(state: CartState, productId: number, name?: string) {
  let bucket = state.items.find((p) => p.productId === productId);
  if (!bucket) {
    bucket = { productId, name: name ?? '', items: [] };
    state.items.push(bucket);
  } else if (name && !bucket.name) {
    bucket.name = name;
  }
  return bucket;
}

type Key = {
  productId: number;
  label: string;
  parentName: string;
};

const findProductIdx = (state: CartState, productId: number) =>
  state.items.findIndex((p) => p.productId === productId);

const findItemIdx = (
  state: CartState,
  productIdx: number,
  label: string,
  parentName: string,
) =>
  productIdx === -1
    ? -1
    : state.items[productIdx].items.findIndex(
        (i) => i.metadata.label === label && i.parentName === parentName,
      );

const multiProductCartSlice = createSlice({
  name: 'multiProduct',
  initialState,
  reducers: {
    setCartForProduct(state, action: PayloadAction<IProductCart>) {
      const { productId } = action.payload;
      const idx = state.items.findIndex((p) => p.productId === productId);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.push(action.payload);
    },
    setActiveMultiCartProduct(state, action: PayloadAction<IProductCart>) {
      state.activeMultiCartProduct = action.payload;
    },
    setMultiCartItems(state, action: PayloadAction<IMultiCartProductItem>) {
      const { productId, items, name } = action.payload;

      if (!items || items.length === 0) {
        const idx = state.items.findIndex((b) => b.productId === productId);
        if (idx !== -1) state.items.splice(idx, 1);
        return;
      }

      const bucket = ensureProduct(state, productId, name);
      bucket.items = items;
    },

    incrementMultiProductItem(state, action: PayloadAction<Key>) {
      const { productId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, productId);
      const iIdx = findItemIdx(state, pIdx, label, parentName);
      if (iIdx !== -1) {
        state.items[pIdx].items[iIdx].count += 1;
      }
    },

    decrementMultiProductItem(state, action: PayloadAction<Key>) {
      const { productId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, productId);
      const iIdx = findItemIdx(state, pIdx, label, parentName);
      if (iIdx !== -1) {
        const item = state.items[pIdx].items[iIdx];
        if (item.count > 1) item.count -= 1; // clamp at 1
      }
    },

    removeMultiProductItem(state, action: PayloadAction<Key>) {
      const { productId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, productId);
      if (pIdx === -1) return;

      const nextItems = state.items[pIdx].items.filter(
        (i) => !(i.metadata.label === label && i.parentName === parentName),
      );

      state.items[pIdx].items = nextItems;
    },

    clear(state) {
      state.items = [];
    },
  },
});

export const {
  setCartForProduct,
  setMultiCartItems,
  incrementMultiProductItem,
  decrementMultiProductItem,
  removeMultiProductItem,
  clear,
  setActiveMultiCartProduct,
} = multiProductCartSlice.actions;

export const multiProductCartReducer = multiProductCartSlice.reducer;
