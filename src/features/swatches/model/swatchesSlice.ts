import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';
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

const initialState: ISwatchesSlice = {
  // isOpenSidebar: true,
  listAttributes: [],
  productElementOptions: [],
  materialSelectState: { Finish: [], Color: [], Look: [] },
  allMaterialsValues: [],
  selectedMaterials: [],
  selectedProduct: null,
  isLoadingSelectedProduct: false,
  isOpenMultiProductCart: false,
};

export const swatchesSlice = createSlice({
  name: 'swatches',
  initialState,
  reducers: {
    // toggleSidebar: (state) => {
    //   state.isOpenSidebar = !state.isOpenSidebar;
    // },
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
    setSelectedMaterial(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { selectedMaterial } = action.payload;
      if (!selectedMaterial) return;
      const selected = current(state.selectedMaterials);

      const isSame = (i: AttributeValue) =>
        i.metadata?.label === selectedMaterial.metadata?.label &&
        i.parentName === selectedMaterial.parentName;

      const exists = selected.some(isSame);

      if (exists) {
        state.selectedMaterials = selected.filter((i) => !isSame(i));
      } else if (selected.length < 5) {
        state.selectedMaterials = [...selected, selectedMaterial];
      }
    },
    resetSelectedMaterials(state) {
      state.selectedMaterials = [];
    },
    setSelectedProduct(state, action: PayloadAction<IProductListItem>) {
      console.log('setSelectedProduct', action.payload);

      state.selectedProduct = action.payload;
    },
    deleteSelectedProduct(state) {
      state.selectedProduct = null;
    },
    setIsOpenMultiProductCart(state, action: PayloadAction<boolean>) {
      state.isOpenMultiProductCart = action.payload;
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
} = swatchesSlice.actions;
