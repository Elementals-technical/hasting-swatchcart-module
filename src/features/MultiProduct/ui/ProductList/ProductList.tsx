import { useEffect, useMemo, useRef, useState } from 'react';
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
import clsx from 'clsx';

/**
 * Sorting options for the product list.
 */
const SORT_OPTIONS: ISingleSelectOption[] = [
  { label: 'Clear All', value: '' },
  { label: 'A-Z', value: 'asc' },
  { label: 'Z-A', value: 'dsc' },
];

/**
 * Renders the product list with category filtering, search, and sorting.
 *
 * Features:
 * - fetches the product list on mount
 * - builds unique categories for the slider
 * - supports debounced text search
 * - supports A–Z and Z–A sorting
 * - hides the header image while the user scrolls down
 * - shows swatch cart content when products are selected
 *
 * @component
 */
export const ProductList = () => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const top = el.scrollTop;

      if (!isScrolling && top > 0) {
        setIsScrolling(true);
      }

      if (top === 0 && isScrolling) {
        setIsScrolling(false);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    dispatch(getProductListThunk());
  }, [dispatch]);

  /**
   * Calculates the total number of selected materials
   * across all products in the cart.
   *
   * @returns {number} Total count of all items.
   */
  const totalItemsLength = useMemo(() => {
    return selectedProducts.reduce(
      (sum, product) => sum + (product.items?.length ?? 0),
      0,
    );
  }, [selectedProducts]);

  /**
   * Unique category list used by the category slider.
   */
  const uniqueCategories: ISliderItem[] = useMemo(() => {
    return MultiProductCartService.getUniqueCategories(productList);
  }, [productList]);

  /**
   * Normalizes string values for case-insensitive filtering.
   *
   * @param s - Input string
   * @returns Normalized string
   */
  const norm = (s: string): string => s.toLowerCase();

  /**
   * Collator for locale-aware, case-insensitive name sorting.
   */
  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: false }),
    [],
  );

  /**
   * Product list after applying active category filter, debounced search, and sorting.
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
    } else {
      list = [...list];
    }

    return list;
  }, [productList, activeCategory, debouncedSearch, sortValue, collator]);

  return (
    <div className='relative flex flex-col h-full min-h-0 w-full'>
      <div className='flex-shrink-0'>
        <div
          className={clsx(
            'overflow-hidden transform-gpu transition-[max-height,opacity,transform] duration-500 ease-in-out',
            isScrolling
              ? 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
              : 'max-h-[200px] opacity-100 translate-y-0',
          )}
        >
          <div className='h-[200px]'>
            <img
              src={
                'https://hastings-questionnaie-storage.fra1.digitaloceanspaces.com/static/pic%20big%201%20(1).jpg'
              }
              className='object-cover w-full h-full'
            />
          </div>
        </div>

        <header className='flex flex-col border-b border-[var(--border)] lg:flex-row lg:justify-between'>
          <h1 className='m-0! p-[var(--sm-padding)] text-[16px] font-medium'>
            Swatches store
          </h1>

          <div className='flex flex-row justify-center items-center border-t border-[var(--border)] p-[var(--sm-padding)] text-[12px] font-medium leading-[24px] lg:border-none'>
            <span>
              Choose 5 free swatches to curate your perfect design. Plus get{' '}
              <a
                href='https://www.hastingsbathcollection.com/contact/design-strategist'
                className='text-[var(--main-accent-color)] underline'
              >
                free design advice
              </a>{' '}
              from our experts
            </span>
          </div>
        </header>
      </div>

      <div className='flex flex-col flex-1 min-h-0'>
        {(isLoadingProductList || isLoadingProduct) && <Loader />}

        <div className='flex flex-row w-full items-center justify-between gap-[16px] border-b border-[var(--border)] p-[var(--sm-padding)]'>
          <div className='flex flex-row h-[36px] w-full items-center justify-between gap-[16px] shrink-0 lg:max-w-[382px]'>
            <div className='relative h-[36px] flex-1 min-w-0 lg:max-w-[240px]'>
              <input
                type='text'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='
                  h-full w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]
                  px-4 pr-8 text-[14px] text-black placeholder-[var(--text-muted)]
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
              className='shrink-0 w-[90px] xxs:w-[100px] bg-[var(--label-bg)] sm:py-8px sm:px-16px sm:w-[102px]'
              dropdownWidth='w-64'
            />
          </div>

          <Slider
            items={uniqueCategories}
            activeId={activeCategory.productId}
            onSelect={(item) => setActiveCategory(item)}
            className='hidden! lg:flex! lg:visible! flex-row! shrink-0! overflow-x-auto!'
          />
        </div>

        <Slider
          items={uniqueCategories}
          activeId={activeCategory.productId}
          onSelect={(item) => setActiveCategory(item)}
          className='h-[64px]! p-[var(--sm-padding)]! border-b! border-[var(--border)]! lg:hidden!'
        />

        <div
          ref={scrollRef}
          className='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)]'
        >
          <div className='mb-4'>Select Product</div>

          {filteredProductList.length ? (
            <ul
              // className={`grid grid-cols-2 gap-[16px] sm:grid-cols-4 ${totalItemsLength && 'sm:pb-[130px]'} lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9`}
              className={`grid grid-cols-2 gap-[16px] sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9`}
            >
              {filteredProductList.map((productListItem: any) => (
                <ProductListItem
                  key={productListItem.name}
                  productListItem={productListItem}
                />
              ))}
            </ul>
          ) : (
            <div className='flex flex-row h-full items-center justify-center'>
              No products were found
            </div>
          )}
        </div>

        {totalItemsLength ? <SwatchContentContainer /> : null}
      </div>
    </div>
  );
};
