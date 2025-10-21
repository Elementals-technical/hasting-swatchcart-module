import { generateRandomProducts } from '../utils/randomList';
import type { IProduct } from './types';

export const getProductListAPI = (): Promise<IProduct[]> => {
  return new Promise((resolve) => {
    // simulate API latency
    setTimeout(() => {
      resolve(generateRandomProducts(100));
    }, 400);
  });
};
