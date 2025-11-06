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

  static getTransformedFetchProductData(data: IFetchProductData): any {
    const { materials, structure } = data;
    const optionNamesRaw = structure.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.options
          .filter((opt) => opt.typeComponent === ETypeComponent.MATERIAL)
          .map((opt) => opt.optionName),
      ),
    );

    const materialsValues = materials.filter((material) => {
      if (!material.optionName) return;
      return optionNamesRaw.includes(material.optionName);
    });

    console.log('materialsValues', materialsValues);

    const allMaterialValues = materialsValues.flatMap((item) =>
      item.valuesArray?.map((value) => ({
        ...value,
        parentName: item.option || item.label || 'without_name',
      })),
    );

    const productElementOptions = materialsValues.map((material) => {
      const { label } = material;
      return {
        id: label,
        value: label,
        label: label,
      };
    });

    console.log('TTTT', {
      allMaterialValues,
      productElementOptions,
    });

    return {
      allMaterialValues,
      productElementOptions: materialsValues,
    };
  }
}
