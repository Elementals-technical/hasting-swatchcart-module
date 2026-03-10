import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AttributeValue,
  IAttributeAsset,
  IMaterialSelectState,
  // IProduct,
  ISetFiltersPayload,
  ISwatchesSlice,
} from './types';
import { SwatchesServices } from '../lib/SwatchesServices';
import { uniqueList } from '../../../shared/utils/uniqueList';
import { type IMapUIData } from '../../DataAdapter/utils/types';
import { getSelectedProductThunk } from './thunks';
import { IProductListItem } from '../../MultiProduct/model/types';
import { MAX_SLOTS } from '../../../shared/constants/selectedMaterials';
import { StorageService } from '../../../shared/utils/storageService';

const persistedSelectedMaterials = StorageService.getSelectedMaterials();

const initialState: ISwatchesSlice = {
  // isOpenSidebar: true,
  listAttributes: [],
  productElementOptions: [],
  materialSelectState: { Finish: [], Color: [], Look: [] },
  allMaterialsValues: [],
  selectedMaterials: persistedSelectedMaterials,
  selectedProduct: null,
  isLoadingSelectedProduct: false,
  isOpenMultiProductCart: false,
};

const sum = (arr: AttributeValue[]) => arr.reduce((s, i) => s + i.count, 0);

export const swatchesSlice = createSlice({
  name: 'swatches',
  initialState,
  reducers: {
    setMaterialSelect(state, action: PayloadAction<ISetFiltersPayload>) {
      const { filterName, values } = action.payload;

      if (values.length === 0) {
        state.materialSelectState[filterName] = [];
        return;
      }

      state.materialSelectState[filterName] = uniqueList(values);
    },
    setPanelFilter(
      state,
      action: PayloadAction<{ attributes: IAttributeAsset[] }>,
    ) {
      const attributeList = action.payload.attributes;

      if (attributeList.length) {
        const filteredAttributeList =
          SwatchesServices.getMaterialsValuesFromOptions(attributeList);
        if (filteredAttributeList?.length) {
          state.allMaterialsValues = filteredAttributeList;
        }
      }
    },

    clearMaterialFilter: (
      state,
      action: PayloadAction<keyof IMaterialSelectState>,
    ) => {
      state.materialSelectState[action.payload] = [];
    },

    clearAllMaterialFilters: (state) => {
      state.materialSelectState = { Finish: [], Color: [], Look: [] };
    },
    setAllMaterialsOptions: (state, action: PayloadAction<IMapUIData>) => {
      const { allMaterialValues, productElementOptions } = action.payload;
      if (allMaterialValues?.length) {
        state.allMaterialsValues = allMaterialValues;
      }
      if (productElementOptions?.length) {
        state.productElementOptions = productElementOptions;
      }
    },
    // setSelectedMaterial(
    //   state,
    //   action: PayloadAction<{
    //     materialCount: number;
    //     selectedMaterial: AttributeValue;
    //     selectedMaterials: AttributeValue[];
    //   }>,
    // ) {
    //   const { materialCount, selectedMaterial, selectedMaterials } =
    //     action.payload;
    //   if (!selectedMaterial) return;
    //   console.log('setSelectedMaterial', {
    //     materialCount,
    //     selectedMaterial,
    //     selectedMaterials,
    //   });

    //   const isSame = (i: AttributeValue) =>
    //     i.metadata?.label === selectedMaterial.metadata?.label &&
    //     i.parentName === selectedMaterial.parentName;

    //   const exists = selectedMaterials?.some(isSame);
    //   // debugger;
    //   if (exists) {
    //     state.selectedMaterials = selectedMaterials.filter((i) => !isSame(i));
    //   } else if (materialCount < 5) {
    //     state.selectedMaterials = [...selectedMaterials, selectedMaterial];
    //   }
    // },
    setSelectedMaterial(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { selectedMaterial } = action.payload;
      if (!selectedMaterial) return;

      const isSame = (i: AttributeValue) =>
        i.metadata?.label === selectedMaterial.metadata?.label &&
        i.parentName === selectedMaterial.parentName;

      const exists = state.selectedMaterials.some(isSame);

      if (exists) {
        state.selectedMaterials = state.selectedMaterials.filter(
          (i) => !isSame(i),
        );
        return;
      }

      if (state.selectedMaterials.length < 5) {
        state.selectedMaterials.push(selectedMaterial);
      }
    },
    resetSelectedMaterials(state) {
      state.selectedMaterials = [];
    },
    setSelectedProduct(state, action: PayloadAction<IProductListItem>) {
      state.selectedProduct = action.payload;
      state.selectedMaterials = [];
    },
    deleteSelectedProduct(state) {
      state.selectedProduct = null;
    },
    setIsOpenMultiProductCart(state, action: PayloadAction<boolean>) {
      state.isOpenMultiProductCart = action.payload;
    },
    removeItem(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;

      state.selectedMaterials = state.selectedMaterials.filter(
        (i) =>
          !(
            i.metadata?.label === metadata?.label && i.parentName === parentName
          ),
      );
    },
    increment(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;

      const item = state.selectedMaterials.find(
        (i) =>
          i.metadata?.label === metadata?.label && i.parentName === parentName,
      );
      if (!item) return;
      if (sum(state.selectedMaterials) < MAX_SLOTS) {
        item.count += 1;
      }
    },
    decrement(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { metadata, parentName } = action.payload.selectedMaterial;
      const item = state.selectedMaterials.find(
        (i) =>
          i.metadata?.label === metadata?.label && i.parentName === parentName,
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
      const item = state.selectedMaterials.find(
        (i) =>
          i.metadata?.label === metadata?.label && i.parentName === parentName,
      );
      if (!item) return;

      const clamped = Math.max(1, Math.floor(next));
      const otherTotal = state.selectedMaterials
        .filter(
          (i) =>
            !(
              i.metadata?.label === metadata?.label &&
              i.parentName === parentName
            ),
        )
        .reduce((s, i) => s + i.count, 0);

      const maxForThis = Math.max(1, MAX_SLOTS - otherTotal);
      item.count = Math.min(clamped, maxForThis);
    },
    setCartMaterials(state, action: PayloadAction<AttributeValue[]>) {
      state.selectedMaterials = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSelectedProductThunk.pending, (state) => {
        state.isLoadingSelectedProduct = true;
      })
      .addCase(getSelectedProductThunk.fulfilled, (state) => {
        state.isLoadingSelectedProduct = false;
      })
      .addCase(getSelectedProductThunk.rejected, (state) => {
        state.isLoadingSelectedProduct = false;
      });
  },
});

export const swatchesReducer = swatchesSlice.reducer;
export const {
  // setListAttributes,
  setMaterialSelect,
  setAllMaterialsOptions,
  setPanelFilter,
  setSelectedMaterial,
  // toggleSidebar,
  clearMaterialFilter,
  clearAllMaterialFilters,
  setSelectedProduct,
  deleteSelectedProduct,
  setIsOpenMultiProductCart,
  resetSelectedMaterials,
  removeItem,
  increment,
  decrement,
  setCount,
  setCartMaterials,
} = swatchesSlice.actions;
