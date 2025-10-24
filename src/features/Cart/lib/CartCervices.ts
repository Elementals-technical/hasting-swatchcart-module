import type { AttributeValue } from '../../swatches/model/types';
import type { ICartItem } from '../model/types';

export class CartCervices {
  static getCartPreparedOption(
    selectedMaterials: AttributeValue[],
    cartData: {
      productId: number;
      name: string;
      items: ICartItem[];
    }[],
  ): ICartItem[] {
    if (!selectedMaterials?.length) return [];

    const allCartItems = cartData.flatMap((cart) => cart.items || []);

    return selectedMaterials.map((item) => {
      const existing = allCartItems.find(
        (cartItem) =>
          cartItem.parentName === item.parentName &&
          cartItem.metadata.label === item.metadata.label,
      );

      return {
        ...item,
        count: existing ? existing.count : 1,
      };
    });
  }
}
