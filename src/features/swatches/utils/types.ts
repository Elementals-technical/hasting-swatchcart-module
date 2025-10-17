import type { TFilterName } from '../model/types';

export type TValueKey = 'Material' | 'Color' | 'Look';
export type TValueEntry = {
  metadata?: Partial<Record<TValueKey, string | string[] | null | undefined>>;
};

export type TFilterItem = { filterKey: string; filterCount: number };
export type TFilterGroup = { filterType: TFilterName; filters: TFilterItem[] };
export interface INonZeroSelectedFilters {
  filterName: TFilterName;
  filterKeys: string[];
}

export type TAllValue = {
  assetId: string;
  name: string;
  values?: TValueEntry[] | null;
};
