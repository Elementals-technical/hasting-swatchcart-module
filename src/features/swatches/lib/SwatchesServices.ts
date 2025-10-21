import {
  type AttributeValue,
  type IAttributeAsset,
  type IMaterialSelectState,
  type TFilterName,
} from '../model/types';
import { FILTER_TO_VALUE_KEY } from '../utils/constants';
import type {
  INonZeroSelectedFilters,
  TAllValue,
  TFilterGroup,
  TFilterItem,
} from '../utils/types';

const isEqual = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export class SwatchesServices {
  static getMaterialsValuesFromOptions(
    options: IAttributeAsset[],
  ): AttributeValue[] | undefined {
    if (!options.length) return;

    return options
      .reduce<AttributeValue[]>((acc, item) => {
        if (Array.isArray(item.values) && item.values.length) {
          const nameFromMeta =
            item.metadata?.Name ?? item.metadata?.Label ?? 'without_name';

          const valuesWithMeta = item.values.map((v) => ({
            ...v,
            parentName: nameFromMeta,
          }));

          acc.push(...valuesWithMeta);
        }
        return acc;
      }, [])
      .sort((a, b) => {
        const nameA = a.name?.toLowerCase() ?? '';
        const nameB = b.name?.toLowerCase() ?? '';
        return nameA.localeCompare(nameB);
      });
  }

  static getUniqueByAssetId<T extends { assetId: string }>(array: T[]): T[] {
    const seen = new Set<string>();
    return array.filter((item) => {
      if (seen.has(item.assetId)) return false;
      seen.add(item.assetId);
      return true;
    });
  }

  static normalizeToArray(
    input: string | string[] | null | undefined,
    splitByComma = true,
  ): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map((s) => s.trim()).filter(Boolean);
    return (splitByComma ? input.split(',') : [input])
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Get all selected filters and their count
  static mapFiltersFromValues(
    allValues: TAllValue[],
    selected: IMaterialSelectState,
  ): TFilterGroup[] {
    return (Object.keys(selected) as TFilterName[]).map((filterType) => {
      const valueKey = FILTER_TO_VALUE_KEY[filterType];
      const requested = selected[filterType];

      const filters: TFilterItem[] = requested.map((filterKey) => {
        let occurrences = 0;

        for (const item of allValues) {
          const entries = Array.isArray(item.values) ? item.values : [];
          for (const entry of entries) {
            const list = this.normalizeToArray(entry.metadata?.[valueKey]);
            occurrences += list.filter((v) => isEqual(v, filterKey)).length;
          }
        }

        return { filterKey, filterCount: occurrences };
      });

      return { filterType, filters };
    });
  }

  // Get filters with a positive count
  static getPositiveSelectedFilers(
    mappedData: TFilterGroup[],
  ): INonZeroSelectedFilters[] {
    return mappedData
      .map((group) => ({
        filterName: group.filterType,
        filterKeys: group.filters
          .filter((f: TFilterItem) => f.filterCount !== 0)
          .map((f: TFilterItem) => f.filterKey),
      }))
      .filter((group) => group.filterKeys.length > 0);
  }
}
