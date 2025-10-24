import { AttributeValue } from '../../swatches/model/types';
import type { ICartItem, IProduct, ISliderItem } from '../model/types';
import { MOCK_ALL_CATEGORY_SLIDER_ITEM } from '../utils/constants';

export class MultiProductCartService {
  static getCartTotalCount({ cartItems }: { cartItems: ICartItem[] }) {
    return cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  static getUniqueCategories(productList: IProduct[]): ISliderItem[] {
    const uniqueCategories = [
      ...new Set(productList.flatMap((p) => p.categories)),
    ];

    const preparedData = uniqueCategories.map((category, index) => ({
      name: category,
      value: category,
      productId: index + 1,
      items: [],
    }));

    return [...preparedData, MOCK_ALL_CATEGORY_SLIDER_ITEM].sort(
      (a, b) => a.productId - b.productId,
    );
  }

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
