import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductListAPI } from './API/api';
import { IProductListResponse } from './types';

export const getProductListThunk = createAsyncThunk<
  IProductListResponse,
  void,
  { rejectValue: string }
>('multiProducts/getProductListThunk', async (_, { rejectWithValue }) => {
  try {
    const response = await getProductListAPI();
    return response;
  } catch (e: any) {
    console.error(e?.message ?? e);
    return rejectWithValue(e?.message ?? 'Unknown error');
  }
});
