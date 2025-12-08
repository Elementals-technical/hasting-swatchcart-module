import { AttributeValue } from '../../swatches/model/types';
import type { ICartItem, IProductListItem, ISliderItem } from '../model/types';
import { MOCK_ALL_CATEGORY_SLIDER_ITEM } from '../utils/constants';

export class MultiProductCartService {
  static getCartTotalCount({ cartItems }: { cartItems: ICartItem[] }) {
    return cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  // static getUniqueCategories(productList: IProductListItem[]): ISliderItem[] {
  //   const uniqueCollections = [
  //     ...new Set(productList.map((p) => p.collection)),
  //   ];

  //   const preparedData = uniqueCollections.map((collection, index) => ({
  //     name: collection,
  //     value: collection,
  //     productId: index + 1,
  //     items: [],
  //   }));

  //   return [...preparedData, MOCK_ALL_CATEGORY_SLIDER_ITEM].sort(
  //     (a, b) => a.productId - b.productId,
  //   );
  // }
  static getUniqueCategories(productList: IProductListItem[]): ISliderItem[] {
    // desired visual order
    const ORDER: string[] = [
      'All',
      'Vanities',
      'Storage & Shelving',
      'Countertops',
      'Basins',
      'Vessels',
      'Pedestals & Consoles',
      'Tubs',
      'Mirrors',
      'Toilets',
      'Bathroom Accessories',
    ];

    const uniqueCollections = Array.from(
      new Set(productList.map((p) => p.collection).filter(Boolean)),
    );

    const preparedData: ISliderItem[] = uniqueCollections.map((collection) => ({
      name: collection,
      value: collection,
      productId: 0,
      items: [],
    }));

    const withAll: ISliderItem[] = [
      MOCK_ALL_CATEGORY_SLIDER_ITEM,
      ...preparedData,
    ];

    const sorted = withAll.sort((a, b) => {
      const idxA = ORDER.indexOf(a.name);
      const idxB = ORDER.indexOf(b.name);

      const safeA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
      const safeB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;

      if (safeA !== safeB) return safeA - safeB;

      return a.name.localeCompare(b.name);
    });

    return sorted.map((item, index) => ({
      ...item,
      productId: index,
    }));
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
          cartItem.metadata?.label === item.metadata?.label,
      );

      return {
        ...item,
        count: existing ? existing.count : 1,
      };
    });
  }
}
