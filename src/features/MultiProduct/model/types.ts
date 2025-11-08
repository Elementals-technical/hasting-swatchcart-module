import type { AttributeValue } from '../../swatches/model/types';

export interface MultiProductState {
  items: IProductCart[];
  activeMultiCartProduct: IProductCart | null;
  productList: IProductListItem[];
  selectedProduct: IProductListItem | null;
  isLoadingProductList: boolean;
  totalCount: number;
}

export interface ICartItem extends AttributeValue {
  count: number;
}

export interface IProductCart {
  items: ICartItem[];
  value?: string;
  name: string;
  assetId?: string;
  productId?: number;
}

export interface ISliderItem {
  items: ICartItem[];
  value: string;
  name: string;
  productId: number;
  assetId?: string;
}

export interface IGetProductParameters {
  assetId: string;
}

export interface ISingleSelectOption {
  value: string;
  label: string;
}

export interface IMultiCartProductItem {
  assetId: string;
  items: ICartItem[];
  name: string;
}

export interface IMultiProductCartHandleProps {
  item: ICartItem;
  assetId: string;
}

export interface IProductListResponse {
  count: number;
  rows: IProductListItem[];
}

export interface IProductListItem {
  id: number;
  collection: string;
  name: string;
  assetId: string;
  img: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
}
