import { IFetchProductData } from '../../../../shared/types/fetchData';
import type { IGetProductParameters, IProductListResponse } from '../types';
import { SWATCHES_ROUTES } from './routes';

const { VITE_SWATH_CART_PRODUCTION_URL } = import.meta.env;

export const getProductListAPI = async (): Promise<IProductListResponse> => {
  try {
    const url = `${VITE_SWATH_CART_PRODUCTION_URL}/${SWATCHES_ROUTES.GET_PRODUCT_LIST()}?pageSize=500`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = (await res.json()) as unknown;

    if (Array.isArray(data)) {
      throw new Error(
        'API returned an array, expected IProductListResponse object',
      );
    }

    return data as IProductListResponse;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
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
