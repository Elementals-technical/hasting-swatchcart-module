import type { TFilterName } from '../model/types';
import type { TValueKey } from './types';

export const FILTER_TO_VALUE_KEY: Record<TFilterName, TValueKey> = {
  Finish: 'Material',
  Color: 'Color',
  Look: 'Look',
};
