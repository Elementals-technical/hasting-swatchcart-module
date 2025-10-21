import { MOCK_SELECTED_PRODUCT } from '../utils/constants';
import { generateRandomProducts } from '../utils/randomList';
import type { IProduct } from './types';

export const getProductListAPI = (): Promise<IProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateRandomProducts(100));
    }, 400);
  });
};

export const getSelectedProductAPI = (productId: number): Promise<IProduct> => {
  console.log('getSelectedProductAPI', productId);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SELECTED_PRODUCT);
    }, 400);
  });
};
