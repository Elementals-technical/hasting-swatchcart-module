export interface ISwatchesSlice {
  isOpenSidebar: boolean;
  listAttributes: IAttributeAsset[];
  materialSelectState: IMaterialSelectState;
  allMaterialsValues: AttributeValue[];
}

export interface IMaterialSelectState {
  Finish: string[];
  Color: string[];
  Look: string[];
}
export type FilterName = keyof IMaterialSelectState;

export interface ISetFiltersPayload {
  filterName: keyof IMaterialSelectState;
  values: string[];
}

export interface IAttributeAsset {
  assetType: string;
  blacklist: unknown[];
  defaultValue: { assetId: string; type: string }[];
  disabledValues: unknown[];
  enabled: boolean;
  global: {
    defaultValue: { assetId: string; type: string };
    id: string;
    metadata: unknown[];
    name: string;
    type: string;
  };
  hiddenValues: unknown[];
  id: string;
  label: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
  type: string;
  value: {
    assetId: string;
    configuration: unknown;
    metadata: { [key: string]: string };
    name: string;
    tags: string[];
    type: string;
  };
  values: IAttributeAssetValues[];
  visible: boolean;
}

export interface IAttributeAssetValues {
  assetId: string;
  enabled: boolean;
  fileSize: number;
  handleSelect: () => unknown;
  label: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
  selected: boolean;
  tagids: string[];
  tags: string[];
  type: string;
  visible: boolean;
}

export interface IValueItem {
  value: string;
  label: string;
  additionalFilter?: string;
}

export interface IOption {
  option: string;
  label: string;
  optionName: string;
  order: string;
  type: string;
  typeComponent: string;
  values?: Record<string, string>;
  valuesArray?: IValueItem[];
}

export interface IGroup {
  groupName: string;
  order: string;
  type: string;
  options: IOption[];
}

export interface ISection {
  section: string;
  sort: string;
  groups: IGroup[];
  enabledCTA: boolean;
}

export const ETypeComponent = {
  MATERIAL: 'material',
  FILTRATION: 'filtration',
  LIST: 'list',
  IMAGE: 'image',
  COMBINED: 'combined',
} as const;

export type ETypeComponent =
  (typeof ETypeComponent)[keyof typeof ETypeComponent];

export interface AttributeValue {
  name?: string;
  assetId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
