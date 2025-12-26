import type { Middleware } from '@reduxjs/toolkit';
import { StorageService } from '../../shared/utils/storageService';
import type { RootState } from './rootReducer';

const SWATCHES_PERSIST_ACTIONS = new Set([
  'swatches/setSelectedMaterial',
  'swatches/removeItem',
  'swatches/increment',
  'swatches/decrement',
  'swatches/setCount',
  'swatches/resetSelectedMaterials',
]);

const MULTI_PRODUCT_PERSIST_ACTIONS = new Set([
  'multiProduct/setCartForProduct',
  'multiProduct/setMultiCartItems',
  'multiProduct/incrementMultiProductItem',
  'multiProduct/decrementMultiProductItem',
  'multiProduct/removeMultiProductItem',
  'multiProduct/clear',
]);

/**
 * Redux middleware that persists swatch selections to localStorage
 * whenever relevant state changes occur.
 */
export const storageMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    const actionType = (action as { type?: string }).type;
    if (!actionType) return result;

    const state = store.getState();

    // Persist single-product selected materials
    if (SWATCHES_PERSIST_ACTIONS.has(actionType)) {
      //console.log('[StorageMiddleware] Persisting selectedMaterials:', state.swatches.selectedMaterials);
      StorageService.setSelectedMaterials(state.swatches.selectedMaterials);
    }

    // Persist multi-product cart items
    if (MULTI_PRODUCT_PERSIST_ACTIONS.has(actionType)) {
      // console.log(
      //   '[StorageMiddleware] Persisting multiProductItems:',
      //   state.multiProductCart.items,
      // );
      StorageService.setMultiProductItems(state.multiProductCart.items);
    }

    return result;
  };
