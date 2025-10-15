import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';
import type {
  AttributeValue,
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
  selectedMaterials: [],
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
          state.allMaterialsValues = SwatchesServices.getUniqueByAssetId(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filteredAttributeList as any[],
          );
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
        state.allMaterialsValues =
          SwatchesServices.getUniqueByAssetId(allValues);
      }

      if (materialOptions?.length) {
        state.productElementOptions = materialOptions;
      }
    },

    setSelectedMaterials(
      state,
      action: PayloadAction<{ selectedMaterial: AttributeValue }>,
    ) {
      const { selectedMaterial } = action.payload;
      const selected = current(state.selectedMaterials);

      if (selectedMaterial) {
        const isClicked = selected.find(
          (elem) => elem.assetId === selectedMaterial.assetId,
        );
        // console.log('isClicked', isClicked);
        // console.log('isClicked selected', selected);
        // console.log('isClicked selectedMaterial', selectedMaterial);

        if (isClicked) {
          state.selectedMaterials = selected.filter(
            (item) => item.assetId !== selectedMaterial.assetId,
          );
        } else if (selected.length < 5) {
          state.selectedMaterials = [...selected, selectedMaterial];
        }
      }
    },
  },
  extraReducers: () => {},
});

export const swatchesReducer = swatchesSlice.reducer;
export const {
  setListAttributes,
  setMaterialSelect,
  setAllMaterialsOptions,
  setPanelFilter,
  setSelectedMaterials,
  toggleSidebar,
  clearMaterialFilter,
  clearAllMaterialFilters,
} = swatchesSlice.actions;
