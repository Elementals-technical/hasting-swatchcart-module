import type { AttributeValue } from '../../swatches/model/types';
import type { ICartItem } from '../model/types';

export class CartCervices {
  static getCartPreparedOption(
    selectedMaterials: AttributeValue[],
  ): ICartItem[] {
    if (!selectedMaterials?.length) return [];
    return selectedMaterials.map((item) => ({ ...item, count: 1 }));
  }
}
