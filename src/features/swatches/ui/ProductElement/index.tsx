import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  MultiSelect,
  type IMultiSelectOption,
} from '../../../../shared/ui/MultiSelect/MultiSelect';
import {
  getMaterialSelectStateFilters,
  getProductElementOptions,
} from '../../model/selectors';
import { uniqueList } from '../../../../shared/utils/uniqueList';
import { setMaterialSelect, setPanelFilter } from '../../model/swatchesSlice';
import { SwatchesServices } from '../../lib/SwatchesServices';

/**
 * Props for {@link ProductElement}.
 */
interface IProductElementProps {
  /**
   * ClassName string applied to the outer container.
   */
  containerStyles: string;

  /**
   * ClassName string applied to the {@link MultiSelect} component.
   */
  selectStyles: string;
}

/**
 * Renders a product element filter based on a multi-select control.
 *
 * Builds selectable options from `allProductElementOptions` and
 * applies filtering logic that:
 * - updates selected product element values
 * - remaps and prunes related filters based on available counts
 * - updates the panel attributes list according to selection
 *
 * @component
 *
 * @param props - {@link IProductElementProps}
 */
export const ProductElement = ({
  containerStyles,
  selectStyles,
}: IProductElementProps) => {
  const dispatch = useAppDispatch();
  const allProductElementOptions = useAppSelector(getProductElementOptions);
  const filters = useAppSelector(getMaterialSelectStateFilters);

  const [productOptions, setProductOptions] = useState<IMultiSelectOption[]>(
    [],
  );
  const [productValues, setProductValues] = useState<string[]>([]);

  useEffect(() => {
    if (!allProductElementOptions?.length) return;

    const formatProductData = allProductElementOptions.map((item) => {
      if (item.metadata) {
        const { Name, Label } = item.metadata || {};
        return { value: Name, label: Label, id: Name };
      }

      const { label, value } = item || {};
      return { value, label, id: value };
    });

    setProductOptions(formatProductData);
  }, [allProductElementOptions]);

  /**
   * Handles changes to the product element filter selection.
   *
   * Updates the selected values, filters available attributes for the panel,
   * and recalculates related filter options to keep only valid selections.
   *
   * @param _ - Filter name (currently unused)
   * @param values - Selected values from the multi-select
   */
  const handleFilterChange = (_: string, values: string[]) => {
    if (values.length) {
      const uniqueListValue = uniqueList(values);

      if (uniqueListValue.length) {
        const filteredMaterialByProduct = allProductElementOptions.filter(
          (item) => {
            if (item.metadata) {
              return uniqueListValue.includes(item.metadata?.Label);
            }
            return uniqueListValue.includes(item.value);
          },
        );

        setProductValues(uniqueListValue);

        const mappedData = SwatchesServices.mapFiltersFromValues(
          filteredMaterialByProduct,
          filters,
        );

        const nonZeroCountList =
          SwatchesServices.getPositiveSelectedFilers(mappedData);

        if (nonZeroCountList.length) {
          nonZeroCountList.forEach((listItem) => {
            const { filterName, filterKeys } = listItem;
            const itemsWithoutZeroCount = { filterName, values: filterKeys };

            dispatch(setMaterialSelect(itemsWithoutZeroCount));
          });
        }

        dispatch(setPanelFilter({ attributes: filteredMaterialByProduct }));
      } else {
        dispatch(setPanelFilter({ attributes: allProductElementOptions }));
      }
    } else {
      setProductValues([]);
      dispatch(setPanelFilter({ attributes: allProductElementOptions }));
    }
  };

  return (
    <div className={containerStyles}>
      <span className='text-sm'>Product element</span>

      <MultiSelect
        options={productOptions}
        values={productValues}
        onValueChange={(values) => handleFilterChange('PanelElement', values)}
        placeholder='All product elements'
        className={selectStyles}
        dropdownWidth='w-80'
      />
    </div>
  );
};
