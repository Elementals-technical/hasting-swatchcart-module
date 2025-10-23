import type { ICartItem } from '../model/types';

export class MultiProductCartService {
  static getCartTotalCount({ cartItems }: { cartItems: ICartItem[] }) {
    return cartItems.reduce((sum, item) => sum + item.count, 0);
  }
}
