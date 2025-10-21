import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductListAPI } from '../../MultiProduct/model/api';

export const getProductListThunk = createAsyncThunk<any>(
  'multiProduct/getProductListThunk',
  async () => {
    try {
      const response = await getProductListAPI();

      return response;
    } catch (e: any) {
      console.error(e.message);
    }
  },
);
