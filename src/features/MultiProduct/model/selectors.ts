import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store/rootReducer';
import type { ICartItem, IProductCart } from './types';
const selectMultiProductCart = (state: RootState) =>
  state.multiProductCart as { items: IProductCart[] };

export const getCartItems = (state: RootState) => state.multiProductCart.items;

export const getSelectedMaterials = (productId: number) =>
  createSelector(selectMultiProductCart, (cart): ICartItem[] => {
    const bucket = cart.items.find((p) => p.productId === productId);
    return bucket?.cartItems ?? [];
  });
