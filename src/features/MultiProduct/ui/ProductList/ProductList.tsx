import { useEffect, useMemo, useState } from 'react';
import { SearchIconSVG } from '../../../../app/assets/svg/SearchIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getProductListThunk } from '../../../swatches/model/thunks';
import {
  getIsLoadingProductList,
  getProductLIst,
} from '../../../swatches/model/selectors';
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

const SORT_OPTIONS: ISingleSelectOption[] = [
  { label: 'A-Z', value: 'asc' },
  { label: 'Z-A', value: 'dsc' },
];

export const ProductList = () => {
  const dispatch = useAppDispatch();
  const isLoadingProductList = useAppSelector(getIsLoadingProductList);

  const [activeCategory, setActiveCategory] = useState<
    ISliderItem | IProductCart
  >(MOCK_ALL_CATEGORY_SLIDER_ITEM);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortValue, setSortValue] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  const productList = useAppSelector(getProductLIst);

  const uniqueCategories = useMemo(() => {
    return MultiProductCartService.getUniqueCategories(productList);
  }, [productList]);

  const norm = (s: string) => s.toLowerCase();

  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: false }),
    [],
  );

  const filteredProductList = useMemo(() => {
    let list = productList;

    if (activeCategory?.value) {
      const target = norm(activeCategory.value);
      list = list.filter((product) =>
        product.categories.some((cat: string) => norm(cat) === target),
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

  useEffect(() => {
    dispatch(getProductListThunk());
  }, [dispatch]);

  return (
    <div className='flex h-full flex-col'>
      <header className='flex flex-col border-b border-[var(--border)] lg:flex-row lg:justify-between'>
        <span className='text-base font-medium p-[var(--sm-padding)]'>
          Swatches List
        </span>

        <div className='p-[var(--sm-padding)] border-t border-[var(--border)] font-medium text-xs leading-[24px] lg:border-none'>
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
        <div className='flex w-full items-center gap-4 justify-between p-[var(--sm-padding)] border-b border-[var(--border)] sm:justify-between'>
          <div className='flex items-center justify-between h-[36px] w-full gap-4 sm:max-w-90'>
            <div className='relative w-full max-w-[260px] h-[36px] sm:max-w-[240px]'>
              <input
                type='text'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='
                h-full w-full pr-8 pl-4 rounded-2xl border border-[var(--border)]
                text-sm     text-black
                focus:outline-none focus:border-[var(--main-accent-color)]
                bg-[var(--background)] transition
              '
              />
              <div
                className='
                absolute right-3 top-1/2 -translate-y-1/2
                pointer-events-none
                [&_svg_path]:stroke-[var(--svg-dark)]
                sm:right-4
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
              className='w-full max-w-[94px] bg-[var(--label-bg)]'
              dropdownWidth='w-64'
            />
          </div>
          <Slider
            items={uniqueCategories}
            activeId={activeCategory?.productId}
            className='hidden sm:max-w-[680px] sm:overflow-hidden sm:flex'
            onSelect={(item) => setActiveCategory(item)}
          />
        </div>

        <Slider
          items={uniqueCategories}
          activeId={activeCategory?.productId}
          className='h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)] sm:hidden sm:max-w-[680px] sm:overflow-hidden'
          onSelect={(item) => setActiveCategory(item)}
        />

        {isLoadingProductList ? (
          <div className='w-full flex justify-center items-center flex-1 min-h-0'>
            loading...
          </div>
        ) : (
          <div className='h-100% overflow-y-auto p-[var(--sm-padding)]'>
            <div className='mb-4'>Select Product</div>
            {filteredProductList.length ? (
              <ul className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9'>
                {filteredProductList.map((productListItem) => {
                  const { name } = productListItem;
                  return (
                    <ProductListItem
                      key={name}
                      productListItem={productListItem}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className='flex justify-center items-center h-100%'>
                No products were found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
