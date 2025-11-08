import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  MultiProductState,
  IMultiCartProductItem,
  IProductCart,
  IProductListResponse,
} from './types';
import { getProductListThunk } from './thunk';

const initialState: MultiProductState = {
  items: [],
  productList: [],
  isLoadingProductList: false,
  selectedProduct: null,
  activeMultiCartProduct: null,
  totalCount: 0,
};

function ensureProduct(
  state: MultiProductState,
  assetId: string,
  name?: string,
) {
  let bucket = state.items.find((p) => p.assetId === assetId);
  if (!bucket) {
    bucket = { assetId, name: name ?? '', items: [] };
    state.items.push(bucket);
  } else if (name && !bucket.name) {
    bucket.name = name;
  }
  return bucket;
}

type Key = {
  assetId: string;
  label: string;
  parentName: string;
};

const findProductIdx = (state: MultiProductState, assetId: string) =>
  state.items.findIndex((p) => p.assetId === assetId);

const findItemIdx = (
  state: MultiProductState,
  productIdx: number,
  label: string,
  parentName: string,
) =>
  productIdx === -1
    ? -1
    : state.items[productIdx].items.findIndex(
        (i) => i.metadata?.label === label && i.parentName === parentName,
      );

const multiProductCartSlice = createSlice({
  name: 'multiProduct',
  initialState,
  reducers: {
    setCartForProduct(state, action: PayloadAction<IProductCart>) {
      const { assetId } = action.payload;
      const idx = state.items.findIndex((p) => p.assetId === assetId);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.push(action.payload);
    },
    setActiveMultiCartProduct(state, action: PayloadAction<IProductCart>) {
      state.activeMultiCartProduct = action.payload;
    },
    setMultiCartItems(state, action: PayloadAction<IMultiCartProductItem>) {
      const { assetId, items, name } = action.payload;

      if (!items || items.length === 0) {
        const idx = state.items.findIndex((b) => b.assetId === assetId);
        if (idx !== -1) state.items.splice(idx, 1);
        return;
      }

      const bucket = ensureProduct(state, assetId, name);
      bucket.items = items;
    },

    incrementMultiProductItem(state, action: PayloadAction<Key>) {
      const { assetId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, assetId);
      const iIdx = findItemIdx(state, pIdx, label, parentName);
      if (iIdx !== -1) {
        state.items[pIdx].items[iIdx].count += 1;
      }
    },

    decrementMultiProductItem(state, action: PayloadAction<Key>) {
      const { assetId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, assetId);
      const iIdx = findItemIdx(state, pIdx, label, parentName);
      if (iIdx !== -1) {
        const item = state.items[pIdx].items[iIdx];
        if (item.count > 1) item.count -= 1; // clamp at 1
      }
    },

    removeMultiProductItem(state, action: PayloadAction<Key>) {
      const { assetId, label, parentName } = action.payload;
      const pIdx = findProductIdx(state, assetId);
      if (pIdx === -1) return;

      const nextItems = state.items[pIdx].items.filter(
        (i) => !(i.metadata?.label === label && i.parentName === parentName),
      );

      state.items[pIdx].items = nextItems;
    },

    clear(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductListThunk.pending, (state) => {
        state.isLoadingProductList = true;
      })
      .addCase(
        getProductListThunk.fulfilled,
        (state, action: PayloadAction<IProductListResponse>) => {
          state.productList = action.payload.rows;
          state.isLoadingProductList = false;
        },
      )
      .addCase(getProductListThunk.rejected, (state) => {
        state.isLoadingProductList = false;
      });
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
