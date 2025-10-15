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

  static getAllMaterialOptions(
    attributes: IAttributeAsset[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] | undefined {
    const groupingValues = JSON.parse(this.getGroupingValue(attributes).value);

    if (groupingValues) {
      console.log('Swatches attributes', attributes);
      console.log('Swatches groupingValue', groupingValues);
      const materialKeys = this.getAllMaterialValuesKeys(groupingValues);
      if (materialKeys?.length) {
        const materialOptions = attributes.filter((item) =>
          materialKeys.includes(item.name),
        );

        console.log('materialOptions - materialOptions', materialOptions);
        console.log('materialOptions - attributes', attributes);

        if (materialOptions?.length) {
          const allValues = materialOptions
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
            });

          if (allValues?.length) {
            console.log('ALL OPTIONS');
            return allValues;
          } else {
            return [];
          }
        }
      }
    }
  }
}
