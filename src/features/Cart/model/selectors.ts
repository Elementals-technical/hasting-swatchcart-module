import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store/rootReducer';
import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';

export const getCartItems = (state: RootState) => state.cart.items;

export const getCartTotalCount = createSelector(getCartItems, (items) =>
  items.reduce((sum, item) => sum + item.count, 0),
);

export const getCartFreeSlots = createSelector(getCartTotalCount, (total) =>
  Math.max(0, MAX_SLOTS - total),
);

export const getCartCanIncrement = createSelector(
  getCartFreeSlots,
  (free) => free > 0,
);

export const getCartItemById = (assetId: string) =>
  createSelector(getCartItems, (items) =>
    items.find((i) => i.assetId === assetId),
  );

export const getCartItemCountById = (id: string) =>
  createSelector(getCartItemById(id), (item) => item?.count ?? 0);
