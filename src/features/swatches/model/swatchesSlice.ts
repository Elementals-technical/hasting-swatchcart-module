import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IAttributeAsset,
  IMaterialSelectState,
  ISetFiltersPayload,
  ISwatchesSlice,
} from './types';
import { SwatchesServices } from '../lib/SwatchesServices';

const initialState: ISwatchesSlice = {
  isOpenSidebar: true,
  listAttributes: [],
  materialSelectState: { Finish: [], Color: [], Look: [] },
  allMaterialsValues: [],
};
const uniq = (arr: string[]) => Array.from(new Set(arr));
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

      state.materialSelectState[filterName] = uniq(values);
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
      const allMaterialsValues = SwatchesServices.getAllMaterialOptions(
        action.payload,
      );

      if (allMaterialsValues?.length) {
        state.allMaterialsValues = allMaterialsValues;
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
} = swatchesSlice.actions;
