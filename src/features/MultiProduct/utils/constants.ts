import { MOCK_ROW_PROPS_ATTRIBUTES } from '../../../shared/constants/props';
import type { IProduct } from '../model/types';

export const MOCK_SELECTED_PRODUCT: IProduct = {
  name: 'mock_product',
  categories: [],
  productId: 999,
  attributes: MOCK_ROW_PROPS_ATTRIBUTES,
};

export const MOCK_ALL_CATEGORY_SLIDER_ITEM = {
  name: 'All',
  value: '',
  productId: 0,
  items: [],
};
