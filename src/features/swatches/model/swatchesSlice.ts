import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IAttributeAsset,
  IMaterialSelectState,
  ISetFiltersPayload,
  ISwatchesSlice,
} from './types';
import { SwatchesServices } from '../lib/SwatchesServices';
import { uniqueList } from '../../../shared/utils/uniqueList';

const initialState: ISwatchesSlice = {
  isOpenSidebar: true,
  listAttributes: [],
  productElementOptions: [],
  materialSelectState: { Finish: [], Color: [], Look: [] },
  allMaterialsValues: [],
};

export const swatchesSlice = createSlice({
  name: 'swatches',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    setListAttributes: (
      state: ISwatchesSlice,
      action: PayloadAction<IAttributeAsset[]>,
    ) => {
      state.listAttributes = action.payload;
    },
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
    setAllMaterialsOptions: (
      state,
      action: PayloadAction<IAttributeAsset[]>,
    ) => {
      const results = SwatchesServices.getAllMaterialOptions(action.payload);
      const allValues = results?.allValues;
      const materialOptions = results?.materialOptions;

      if (allValues?.length) {
        state.allMaterialsValues = allValues;
      }

      if (materialOptions?.length) {
        state.productElementOptions = materialOptions;
      }
    },
  },
  extraReducers: () => {},
});

export const swatchesReducer = swatchesSlice.reducer;
export const {
  toggleSidebar,
  setListAttributes,
  setMaterialSelect,
  clearMaterialFilter,
  clearAllMaterialFilters,
  setAllMaterialsOptions,
  setPanelFilter,
} = swatchesSlice.actions;
