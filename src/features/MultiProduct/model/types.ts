import type { IAttributeAsset } from '../../swatches/model/types';

export interface IProduct {
  name: string;
  categories: string[];
  productId: number;
  attributes: IAttributeAsset[] | any[];
}
