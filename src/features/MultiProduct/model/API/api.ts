import { IFetchProductData } from '../../../../shared/types/fetchData';
import { generateRandomProducts } from '../../utils/randomList';
import type { IGetProductParameters, IProduct } from '../types';
import { SWATCHES_ROUTES } from './routes';

const { VITE_SWATH_CART_PRODUCTION_URL } = import.meta.env;

export const getProductListAPI = (): Promise<IProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateRandomProducts(100));
    }, 400);
  });
};

export const getSelectedProductAPI = async ({
  assetId,
}: IGetProductParameters): Promise<IFetchProductData> => {
  try {
    const url = `${VITE_SWATH_CART_PRODUCTION_URL}/${SWATCHES_ROUTES.GET_PRODUCT_DETAILS(assetId)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
};
