import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSelectedProductAPI,
  getSelectedProductListInformationAPI,
} from '../../MultiProduct/model/API/api';
import type {
  IGetProductParameters,
  IProductInformationResponse,
} from '../../MultiProduct/model/types';
import { IFetchProductData } from '../../../shared/types/fetchData';

export const getSelectedProductThunk = createAsyncThunk<
  IFetchProductData | null,
  IGetProductParameters,
  { rejectValue: string }
>('swatches/getSelectedProductThunk', async ({ assetId }) => {
  try {
    const response = await getSelectedProductAPI({ assetId });

    return response;
  } catch (e: any) {
    console.error(e.message);
    return null;
  }
});

export const getSelectedProductInformationThunk = createAsyncThunk<
  IProductInformationResponse,
  IGetProductParameters,
  { rejectValue: string }
>(
  'swatches/getSelectedProductInformationThunk',
  async ({ assetId }, { rejectWithValue }) => {
    try {
      const response = await getSelectedProductListInformationAPI({ assetId });

      return response;
    } catch (e: any) {
      console.error(e?.message ?? e);
      return rejectWithValue(e?.message ?? 'Unknown error');
    }
  },
);
