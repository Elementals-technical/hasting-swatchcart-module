import {
  AttributeValue,
  IMaterialMetadata,
} from '../../features/swatches/model/types';

export interface IValueLabel {
  value: string;
  label: string;
}

export interface IValueLabelMeta extends IValueLabel {
  metadata: IMaterialMetadata;
}

export interface ISection {
  section: string;
  sort: string;
  groups: IGroup[];
}

export interface IGroup {
  groupName: string;
  order: string; // "1", ...
  type: 'simple' | string;
  options: IOption[];
}

export interface IOption {
  option: string;
  label: string;
  optionName: string;
  order: string;
  type: 'simple' | string;
  typeComponent: 'material' | string;
  values: Record<string, string>;
  valuesArray: IValueLabel[];
}

export interface IMaterialOption {
  option: string;
  label: string;
  optionName: string;
  order: number;
  typeComponent: 'material' | string;
  valuesArray: IValueLabelMeta[];
}

export interface IFetchProductData {
  structure: ISection[];
  materials: AttributeValue[];
}
