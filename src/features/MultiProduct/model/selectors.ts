import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store/rootReducer';
import type { ICartItem, IProductCart } from './types';
const selectMultiProductCart = (state: RootState) =>
  state.multiProductCart as { items: IProductCart[] };

export const getMultiCartItems = (state: RootState) =>
  state.multiProductCart.items;

export const getMultiSelectedMaterials = (assetId: string) =>
  createSelector(selectMultiProductCart, (cart): ICartItem[] => {
    const bucket = cart.items.find((p) => p.assetId === assetId);
    return bucket?.items ?? [];
  });

export const getActiveMultiCartProduct = (state: RootState) =>
  state.multiProductCart.activeMultiCartProduct;

export const getProductLIst = (state: RootState) =>
  state.multiProductCart.productList;
export const getIsLoadingProductList = (state: RootState) =>
  state.multiProductCart.isLoadingProductList;
export const getSelectedProduct = (state: RootState) =>
  state.multiProductCart.selectedProduct;
