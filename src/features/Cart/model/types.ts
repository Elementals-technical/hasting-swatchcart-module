import type { AttributeValue } from '../../swatches/model/types';

export interface ICartItem extends AttributeValue {
  count: number;
}

export type CartState = {
  items: ICartItem[];
};
