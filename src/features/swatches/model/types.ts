export interface ISwatchesSlice {
  isOpenSidebar: boolean;
  listAttributes: IAttributeAsset[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productElementOptions: any[];
  materialSelectState: IMaterialSelectState;
  allMaterialsValues: AttributeValue[];
  selectedMaterials: AttributeValue[];
}

export interface IMaterialSelectState {
  Finish: string[];
  Color: string[];
  Look: string[];
}
export type TFilterName = keyof IMaterialSelectState;

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
  assetId: string;
  name: string;
  tags: string[];
  metadata: IMaterialMetadata;
  fileSize: number;
  tagids: string[];
  type: 'item' | string;
  label: string;
  visible: boolean;
  enabled: boolean;
}

export interface IMaterialMetadata {
  Look?: string;
  Color?: string;
  image?: string;
  label?: string;
  value?: string;
  Material?: string;
  zoomIconColor?: string;
  [key: string]: string | undefined;
}
