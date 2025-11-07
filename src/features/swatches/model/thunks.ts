import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductListAPI,
  getSelectedProductAPI,
} from '../../MultiProduct/model/API/api';
import type { IGetProductParameters } from '../../MultiProduct/model/types';
import { IFetchProductData } from '../../../shared/types/fetchData';

export const getProductListThunk = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>('multiProducts/getProductListThunk', async (_, { rejectWithValue }) => {
  try {
    const response = await getProductListAPI();
    return response;
  } catch (e: any) {
    console.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const getSelectedProductThunk = createAsyncThunk<
  IFetchProductData,
  IGetProductParameters,
  { rejectValue: string }
>(
  'swatches/getSelectedProductThunk',
  async ({ assetId }, { rejectWithValue }) => {
    try {
      console.log('THUNK start');

      const response = await getSelectedProductAPI({ assetId });

      console.log('THUNK end');

      return response;
    } catch (e: any) {
      console.error(e.message);
      return rejectWithValue(e.message);
    }
  },
);
