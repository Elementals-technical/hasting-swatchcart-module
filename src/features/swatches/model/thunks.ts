import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductListAPI,
  getSelectedProductAPI,
} from '../../MultiProduct/model/API/api';
import type { IGetProductParameters } from '../../MultiProduct/model/types';

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

export const getSelectedProductThunk = createAsyncThunk(
  'multiProducts/getSelectedProductThunk',
  async (
    { productId, productName }: IGetProductParameters,
    { rejectWithValue },
  ) => {
    try {
      const response = await getSelectedProductAPI({ productId, productName });

      return response;
    } catch (e: any) {
      console.error(e.message);
      return rejectWithValue(e.message);
    }
  },
);
