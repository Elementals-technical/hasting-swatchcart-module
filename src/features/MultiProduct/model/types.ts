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
  items: ICartItem[];
  value?: string;
  name: string;
  productId: number;
}

export interface ISliderItem {
  items: ICartItem[];
  value: string;
  name: string;
  productId: number;
}

export interface CartState {
  items: IProductCart[];
  activeMultiCartProduct: IProductCart | null;
}

export interface IGetProductParameters {
  productId: number;
  productName: string;
}

export interface ISingleSelectOption {
  value: string;
  label: string;
}
