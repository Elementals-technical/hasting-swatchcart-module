export const SWATCHES_ROUTES = {
  GET_PRODUCT_LIST: () => `products`,
  GET_SELECTED_PRODUCT_INFORMATION: ({ assetId }: { assetId: string }) =>
    `products?assetId[]=${assetId}`,
  GET_PRODUCT_DETAILS: (assetId: string) => `products/${assetId}`,
};
