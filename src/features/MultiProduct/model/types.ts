import type { AttributeValue } from '../../swatches/model/types';

export interface ICartItem extends AttributeValue {
  count: number;
}

export interface IProduct {
  attributes: AttributeValue[] | any[];
  name: string;
  productId: number;
  categories: string[];
}

export interface IProductCart {
  cartItems: ICartItem[];
  name: string;
  productId: number;
}

export interface CartState {
  items: IProductCart[];
}

export interface IGetProductParameters {
  productId: number;
  productName: string;
}
