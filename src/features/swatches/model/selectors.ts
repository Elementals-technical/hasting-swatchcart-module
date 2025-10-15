import type { RootState } from '../../../app/store/store';

export const getIsOpenSidebar = (state: RootState) =>
  state.swatches.isOpenSidebar;
export const getListAttributes = (state: RootState) =>
  state.swatches.listAttributes;
export const getAttributeByName =
  (optionName: string) => (state: RootState) => {
    const listAttributes = getListAttributes(state);

    return listAttributes.find((attr) => attr.name === optionName);
  };
export const getAllMaterialValues = (state: RootState) =>
  state.swatches.allMaterialsValues;
export const getMaterialSelectStateFilters = (state: RootState) =>
  state.swatches.materialSelectState;
