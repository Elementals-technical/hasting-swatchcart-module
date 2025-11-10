import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSelectedProductAPI } from '../../MultiProduct/model/API/api';
import type { IGetProductParameters } from '../../MultiProduct/model/types';
import { IFetchProductData } from '../../../shared/types/fetchData';
import { toast } from 'react-toastify';

export const getSelectedProductThunk = createAsyncThunk<
  IFetchProductData,
  IGetProductParameters,
  { rejectValue: string }
>(
  'swatches/getSelectedProductThunk',
  async ({ assetId }, { rejectWithValue }) => {
    try {
      const response = await getSelectedProductAPI({ assetId });

      return response;
    } catch (e: any) {
      console.error(e.message);
      toast('Failed to load product');
      return rejectWithValue(e.message);
    }
  },
);
