import { useMemo } from 'react';

type WithCount = {
  /**
   * Numeric count value.
   * Can be `null` when the item is not counted.
   */
  count: number | null;
};

/**
 * Calculates the total count of items.
 *
 * Sums the `count` property of all provided items and
 * memoizes the result to prevent unnecessary recalculations.
 *
 * @param items - Array of items containing a `count` field
 * @returns Total count of all items
 */
export function useCartCount<T extends WithCount>(items: T[]): number {
  return useMemo(() => {
    return items.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [items]);
}
