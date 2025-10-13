import type { RootState } from '../../../app/store/store';

export const getIsOpenSidebar = (state: RootState) =>
  state.swatches.isOpenSidebar;
