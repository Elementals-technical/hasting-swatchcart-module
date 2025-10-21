import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductListAPI,
  getSelectedProductAPI,
} from '../../MultiProduct/model/api';

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

interface GetSelectedProductParams {
  productId: number;
}

export const getSelectedProductThunk = createAsyncThunk(
  'multiProducts/getSelectedProductThunk',
  async ({ productId }: GetSelectedProductParams, { rejectWithValue }) => {
    try {
      const response = await getSelectedProductAPI(productId);

      return response;
    } catch (e: any) {
      console.error(e.message);
      return rejectWithValue(e.message);
    }
  },
);
