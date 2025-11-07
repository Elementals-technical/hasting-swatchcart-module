import { IFetchProductData } from '../../../shared/types/fetchData';
import { SwatchesServices } from '../../swatches/lib/SwatchesServices';
import {
  ETypeComponent,
  type IAttributeAsset,
  type ISection,
} from '../../swatches/model/types';
import { EDataInputType, type IMapUIData } from '../utils/types';

const GROUPING_KEY = 'UIGrouping';

export class DataAdapterServices {
  static getTransformedData({
    dataType,
    data,
  }: {
    dataType: EDataInputType;
    data: IFetchProductData | any;
  }) {
    switch (dataType) {
      case EDataInputType.UI:
        return this.getMapUIData(data);
      case EDataInputType.DATA_INPUT:
        return console.log(EDataInputType.DATA_INPUT);
      case EDataInputType.DATA_ALL_PRODUCT:
        return console.log(EDataInputType.DATA_ALL_PRODUCT);
      case EDataInputType.FETCH_DATA_PRODUCT:
        return this.getTransformedFetchProductData(data);
      default:
        throw new Error('Unsupported format');
    }
  }

  // EDataInputType.UI DATA
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

  static getAllMaterialOptions(
    attributes: IAttributeAsset[],
  ): IMapUIData | undefined {
    const groupingValues = JSON.parse(this.getGroupingValue(attributes).value);

    if (groupingValues) {
      const materialKeys = this.getAllMaterialValuesKeys(groupingValues);
      if (materialKeys?.length) {
        const productElementOptions = attributes.filter((item) =>
          materialKeys.includes(item.name),
        );
        if (productElementOptions?.length) {
          const allMaterialValues =
            SwatchesServices.getMaterialsValuesFromOptions(
              productElementOptions,
            );

          if (allMaterialValues?.length) {
            return { allMaterialValues, productElementOptions };
          }
        }
      }
    }
  }

  static getMapUIData(data: IAttributeAsset[]): IMapUIData | undefined {
    return this.getAllMaterialOptions(data);
  }

  // groupName solution
  static getTransformedFetchProductData(data: IFetchProductData): any {
    const { materials = [], structure = [] } = data;

    // optionName -> groupName (only MATERIAL)
    const optionToGroup = new Map<string, string>();
    for (const section of structure) {
      for (const group of section.groups ?? []) {
        for (const opt of group.options ?? []) {
          if (
            opt?.typeComponent === ETypeComponent.MATERIAL &&
            opt?.optionName
          ) {
            optionToGroup.set(opt.optionName, group.groupName);
          }
        }
      }
    }

    const materialsValues = materials.filter(
      (m) => m.optionName && optionToGroup.has(m.optionName!),
    );

    const materialsWithGroup = materialsValues.map((m) => ({
      ...m,
      groupName: m.optionName ? optionToGroup.get(m.optionName) : undefined,
    }));

    // flatten children; inject parentName + groupName
    const allMaterialValues = materialsWithGroup.flatMap((item) => {
      const { label, groupName } = item;
      const parentName =
        (label.toLocaleLowerCase() === 'color' ? groupName : label) ||
        'without_name';
      return (item.valuesArray ?? []).map((v) => ({
        ...v,
        parentName,
      }));
    });

    // build select options (unique, sorted by label)
    const seen = new Set<string>();

    const productElementOptions = materialsWithGroup
      .map(({ label, groupName, valuesArray }) => {
        const normalizedLabel =
          label?.toLowerCase() === 'color' ? (groupName ?? label) : label;

        return {
          id: normalizedLabel!,
          value: normalizedLabel!,
          label: normalizedLabel!,
          valuesArray,
        };
      })
      .filter(
        (option) =>
          option.label &&
          (seen.has(option.label) ? false : (seen.add(option.label), true)),
      )
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      allMaterialValues,
      productElementOptions,
    };
  }
}
