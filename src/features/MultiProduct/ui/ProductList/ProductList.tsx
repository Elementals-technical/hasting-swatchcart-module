import { useEffect, useMemo, useState } from 'react';
import { SearchIconSVG } from '../../../../app/assets/svg/SearchIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { ProductListItem } from '../ProductListItem/ProductListItem';
import { MultiProductCartService } from '../../lib/MultiProductCartServices';
import { Slider } from '../../../../shared/ui/Slider/Slider';
import type {
  IProductCart,
  ISingleSelectOption,
  ISliderItem,
} from '../../model/types';
import { MOCK_ALL_CATEGORY_SLIDER_ITEM } from '../../utils/constants';
import { SingleSelect } from '../../../../shared/ui/SingleSelect/SingleSelect';
import { getProductListThunk } from '../../model/thunk';
import {
  getIsLoadingProductList,
  getMultiCartItems,
  getProductLIst,
} from '../../model/selectors';
import { Loader } from '../../../../shared/ui/Loader/Loader';
import { getIsLoadingSelectedProduct } from '../../../swatches/model/selectors';
import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

const SORT_OPTIONS: ISingleSelectOption[] = [
  { label: 'A-Z', value: 'asc' },
  { label: 'Z-A', value: 'dsc' },
];

export const ProductList = () => {
  const dispatch = useAppDispatch();
  const isLoadingProductList = useAppSelector(getIsLoadingProductList);
  const isLoadingProduct = useAppSelector(getIsLoadingSelectedProduct);
  const productList = useAppSelector(getProductLIst);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const [activeCategory, setActiveCategory] = useState<
    ISliderItem | IProductCart
  >(MOCK_ALL_CATEGORY_SLIDER_ITEM);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortValue, setSortValue] = useState<string | null>(null);

  /**
   * Debounces the search input.
   *
   * Whenever `search` changes, waits 300ms before updating `debouncedSearch`
   * with the normalized (trimmed + lowercased) search string.
   * Cleans up pending timeouts on re-runs to prevent memory leaks.
   */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  /**
   * Fetches the product list on component mount.
   *
   * Runs only once because `dispatch` is stable.
   */
  useEffect(() => {
    dispatch(getProductListThunk());
  }, [dispatch]);

  /**
   * Computes a memoized list of unique categories from the product list.
   *
   * Uses the MultiProductCartService helper to extract unique category values.
   * Recomputes only when `productList` changes.
   *
   * @constant
   * @type {ISliderItem[]}
   */
  const uniqueCategories: ISliderItem[] = useMemo(() => {
    return MultiProductCartService.getUniqueCategories(productList);
  }, [productList]);

  /**
   * Normalizes a string to lowercase for comparison operations.
   *
   * @param {string} s - Input string.
   * @returns {string} Lowercased string.
   */
  const norm = (s: string): string => s.toLowerCase();

  /**
   * Memoized Intl.Collator instance for locale-aware, case-insensitive
   * alphabetical sorting of product names.
   *
   * Stable reference ensures sorting computations are not recreated unnecessarily.
   */
  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: false }),
    [],
  );

  /**
   * Computes the final filtered and sorted list of products.
   *
   * Steps:
   * 1. Starts from the full `productList`.
   * 2. If a category is selected, filters products by matching `collection`.
   * 3. If a debounced search query exists, filters by product name (case-insensitive).
   * 4. Applies sorting:
   *    - 'asc' → alphabetical A→Z
   *    - 'dsc' → alphabetical Z→A
   *
   * Uses `collator` for locale-aware sorting.
   *
   * Recomputes whenever product list, filters, search query, or sort order changes.
   */
  const filteredProductList = useMemo(() => {
    let list = productList;

    if (activeCategory?.value) {
      const target = norm(activeCategory.value);
      list = list.filter(
        (product) => norm(product.collection ?? '') === target,
      );
    }

    if (debouncedSearch) {
      list = list.filter((product) =>
        norm(product.name).includes(debouncedSearch),
      );
    }

    if (sortValue === 'asc') {
      list = [...list].sort((a, b) => collator.compare(a.name, b.name));
    } else if (sortValue === 'dsc') {
      list = [...list].sort((a, b) => collator.compare(b.name, a.name));
    }

    return list;
  }, [productList, activeCategory, debouncedSearch, sortValue, collator]);

  return (
    <div className='relative flex h-full flex-col '>
      {(isLoadingProductList || isLoadingProduct) && <Loader />}
      <header className='flex flex-col border-b border-[var(--border)] lg:flex-row lg:justify-between'>
        <span className='p-[var(--sm-padding)] text-base font-medium'>
          Swatches List
        </span>

        <div className='border-t border-[var(--border)] p-[var(--sm-padding)] text-xs font-medium leading-[24px] lg:border-none'>
          <span>
            Choose 5 free swatches to curate your perfect design. Plus get{' '}
            <span className='text-[var(--main-accent-color)] underline'>
              free design advice
            </span>{' '}
            from our experts
          </span>
        </div>
      </header>
      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='flex w-full items-center justify-between gap-4 border-b border-[var(--border)] p-[var(--sm-padding)]'>
          <div className='flex h-[36px] w-full items-center justify-between gap-4 shrink-0 lg:max-w-[382px]'>
            <div className='relative h-[36px] flex-1 min-w-0 lg:max-w-[240px]'>
              <input
                type='text'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='
                  h-full w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]
                  px-4 pr-8 text-sm text-black placeholder-[var(--text-muted)]
                  transition focus:border-[var(--main-accent-color)] focus:outline-none
                '
              />

              <div
                className='
                  pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 sm:right-4
                  [&_svg_path]:stroke-[var(--svg-dark)]
                '
              >
                <SearchIconSVG width={20} height={20} />
              </div>
            </div>

            <SingleSelect
              title='Sort by'
              placeholder='Sort by'
              values={SORT_OPTIONS}
              value={sortValue}
              onValueChange={setSortValue}
              className='shrink-0 w-[90px] xxs:w-[100px] bg-[var(--label-bg)] sm:py-2 sm:px-4 sm:w-[102px]'
              dropdownWidth='w-64'
            />
          </div>

          <Slider
            items={uniqueCategories}
            activeId={activeCategory.productId}
            onSelect={(item) => setActiveCategory(item)}
            className='hidden lg:flex shrink-0 overflow-x-auto'
          />
        </div>

        <Slider
          items={uniqueCategories}
          activeId={activeCategory.productId}
          onSelect={(item) => setActiveCategory(item)}
          className='h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)] lg:hidden'
        />

        <div className='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)] '>
          <div className='mb-4'>Select Product</div>

          {filteredProductList.length ? (
            <ul className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9'>
              {filteredProductList.map((productListItem: any) => (
                <ProductListItem
                  key={productListItem.name}
                  productListItem={productListItem}
                />
              ))}
            </ul>
          ) : (
            <div className='flex h-full items-center justify-center'>
              No products were found
            </div>
          )}
        </div>
      </div>

      {selectedProducts.length ? <SwatchContentContainer /> : null}
    </div>
  );
};
