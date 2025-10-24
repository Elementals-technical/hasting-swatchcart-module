import type { ICartItem, IProduct, IProductCart } from '../model/types';
import { MOCK_ALL_CATEGORY_SLIDER_ITEM } from '../utils/constants';

export class MultiProductCartService {
  static getCartTotalCount({ cartItems }: { cartItems: ICartItem[] }) {
    return cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  static getUniqueCategories(productList: IProduct[]): IProductCart[] {
    const uniqueCategories = [
      ...new Set(productList.flatMap((p) => p.categories)),
    ];

    const preparedData = uniqueCategories.map((category, index) => ({
      name: category,
      value: category,
      productId: index + 1,
    }));

    return [...preparedData, MOCK_ALL_CATEGORY_SLIDER_ITEM].sort(
      (a, b) => a.productId - b.productId,
    );
  }
}
