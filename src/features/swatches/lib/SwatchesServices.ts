import {
  ETypeComponent,
  type IAttributeAsset,
  type ISection,
} from '../model/types';

const GROUPING_KEY = 'UIGrouping';

export class SwatchesServices {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getGroupingValue(attributes: any[]) {
    if (!attributes) return;
    console.log(
      'SwatchesServices',
      attributes.find((item) => item.name === GROUPING_KEY),
    );

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
}
