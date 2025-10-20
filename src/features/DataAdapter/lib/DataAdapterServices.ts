import {
  ETypeComponent,
  type AttributeValue,
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
    data: any[];
  }) {
    switch (dataType) {
      case EDataInputType.UI:
        return this.getMapUIData(data);
      case EDataInputType.DATA_INPUT:
        return console.log(EDataInputType.DATA_INPUT);
      case EDataInputType.DATA_ALL_PRODUCT:
        return console.log(EDataInputType.DATA_ALL_PRODUCT);
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

  static getMaterialsValuesFromOptions(
    options: IAttributeAsset[],
  ): AttributeValue[] | undefined {
    if (!options.length) return;
    return options
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
      });
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
          const allMaterialValues = this.getMaterialsValuesFromOptions(
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

  // EDataInputType.UI DATA
}
