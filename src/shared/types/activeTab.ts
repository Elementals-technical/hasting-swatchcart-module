export const EActiveTab = {
  SWATCH: 'swatch',
  CART: 'cart',
} as const;

export type EActiveTab = (typeof EActiveTab)[keyof typeof EActiveTab];
