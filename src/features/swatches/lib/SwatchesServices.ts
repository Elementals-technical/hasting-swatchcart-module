import {
  ETypeComponent,
  type IAttributeAsset,
  type IMaterialSelectState,
  type ISection,
  type TFilterName,
} from '../model/types';
import { FILTER_TO_VALUE_KEY } from '../utils/constants';
import type {
  INonZeroSelectedFilters,
  TAllValue,
  TFilterGroup,
  TFilterItem,
} from '../utils/types';

const GROUPING_KEY = 'UIGrouping';

const isEqual = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export class SwatchesServices {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getGroupingValue(attributes: any[]) {
    if (!attributes) return;

    return attributes.find((item) => item.name === GROUPING_KEY);
  }

  static getAllMaterialValuesKeys(
    attributes: ISection[],
  ): string[] | undefined {
    if (!attributes) return;

    return attributes.flatMap((section) =>
      section.groups
        .flatMap((group) =>
          group.options.filter(
            (opt) => opt.typeComponent === ETypeComponent.MATERIAL,
          ),
        )
        .map((item) => item.optionName),
    );
  }

  static getMaterialsValuesFromOptions(
    options: IAttributeAsset[],
  ): IAttributeAsset[] | undefined {
    if (!options.length) return;
    return (
      options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce<any[]>((acc, item) => {
          if (Array.isArray(item.values)) {
            return acc.concat(item.values);
          }
          return acc;
        }, [])
        .sort((a, b) => {
          const nameA = a.name?.toLowerCase() ?? '';
          const nameB = b.name?.toLowerCase() ?? '';
          return nameA.localeCompare(nameB);
        })
    );
  }

  static getAllMaterialOptions(
    attributes: IAttributeAsset[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): { allValues: any[]; materialOptions: any[] } | undefined {
    const groupingValues = JSON.parse(this.getGroupingValue(attributes).value);

    if (groupingValues) {
      const materialKeys = this.getAllMaterialValuesKeys(groupingValues);
      if (materialKeys?.length) {
        const materialOptions = attributes.filter((item) =>
          materialKeys.includes(item.name),
        );
        if (materialOptions?.length) {
          const allValues = this.getMaterialsValuesFromOptions(materialOptions);

          if (allValues?.length) {
            return { allValues, materialOptions };
          }
        }
      }
    }
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
