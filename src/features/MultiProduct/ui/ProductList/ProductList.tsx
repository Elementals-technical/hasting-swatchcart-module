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
  { label: 'Clear All', value: '' },
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

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  // Fetch products
  useEffect(() => {
    dispatch(getProductListThunk());
  }, [dispatch]);

  // Unique categories
  const uniqueCategories: ISliderItem[] = useMemo(() => {
    return MultiProductCartService.getUniqueCategories(productList);
  }, [productList]);

  const norm = (s: string): string => s.toLowerCase();

  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: false }),
    [],
  );

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
        <div className='h-40 overflow-hidden'>
          <img
            src={
              'https://clownfish-app-cvxrz.ondigitalocean.app/assets/header_image-BZoSlAHj.png'
            }
            className='object-cover w-full h-full'
          />
        </div>

        <header className='flex flex-col border-b border-[var(--border)] lg:flex-row lg:justify-between'>
          <h1 className='m-0! p-[var(--sm-padding)] text-[1.6rem] font-medium'>
            Swatches store
          </h1>

          <div className='flex flex-row justify-center items-center border-t border-[var(--border)] p-[var(--sm-padding)] text-[12px] font-medium leading-[24px] lg:border-none'>
            <span>
              Choose 5 free swatches to curate your perfect design. Plus get{' '}
              <span className='text-[var(--main-accent-color)] underline'>
                free design advice
              </span>{' '}
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
            className='hidden lg:flex flex-row shrink-0 overflow-x-auto'
          />
        </div>

        {/* Mobile slider */}
        <Slider
          items={uniqueCategories}
          activeId={activeCategory.productId}
          onSelect={(item) => setActiveCategory(item)}
          className='h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)] lg:hidden'
        />

        <div className='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)]'>
          <div className='mb-4'>Select Product</div>

          {filteredProductList.length ? (
            <ul className='grid grid-cols-2 gap-[16px] sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9'>
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

        {selectedProducts.length ? <SwatchContentContainer /> : null}
      </div>
    </div>
  );
};
