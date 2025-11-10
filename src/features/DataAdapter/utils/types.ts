import type { AttributeValue } from '../../swatches/model/types';

export const EDataInputType = {
  UI: 'UI',
  FETCH_DATA_PRODUCT: 'FETCH_DATA_PRODUCT',
  FETCH_DATA_ALL: 'FETCH_DATA_ALL',
} as const;

export type EDataInputType =
  (typeof EDataInputType)[keyof typeof EDataInputType];

export interface IMapUIData {
  allMaterialValues: AttributeValue[];
  productElementOptions: any[];
}
