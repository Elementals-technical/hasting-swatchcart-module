import { MOCK_ROW_PROPS_ATTRIBUTES } from '../../../shared/constants/props';
import { IProduct } from '../../swatches/model/types';

const TAGS = [
  'Kitchen',
  'Bathroom',
  'Outdoor',
  'Office',
  'Furniture',
  'Lighting',
  'Decor',
  'Electronics',
  'Appliances',
  'Storage',
  'Garden',
  'Bedroom',
  'Living Room',
  'Tools',
  'Accessories',
  'Hardware',
  'Flooring',
  'Paint',
  'Home Decor',
  'Smart Home',
];

export const generateRandomProducts = (count: number = 100): IProduct[] => {
  const products: IProduct[] = [];

  for (let i = 1; i <= count; i++) {
    const tagCount = Math.floor(Math.random() * 4) + 1;
    const randomTags = Array.from(
      { length: tagCount },
      () => TAGS[Math.floor(Math.random() * TAGS.length)],
    );

    // Ensure tags are unique per product
    const uniqueCategories = Array.from(new Set(randomTags));

    products.push({
      name: `product-${i}`,
      categories: uniqueCategories,
      productId: i,
      attributes: MOCK_ROW_PROPS_ATTRIBUTES,
    });
  }

  return products;
};
