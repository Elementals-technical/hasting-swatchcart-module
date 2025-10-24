import { useEffect, useMemo, useState } from 'react';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { SearchIconSVG } from '../../../../app/assets/svg/SearchIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MultiSelect } from '../../../../shared/ui/MultiSelect/MultiSelect';
import { getProductListThunk } from '../../../swatches/model/thunks';
import {
  getIsLoadingProductList,
  getProductLIst,
} from '../../../swatches/model/selectors';
import { ProductListItem } from '../ProductListItem/ProductListItem';
import { MultiProductCartService } from '../../lib/MultiProductCartServices';
import { Slider } from '../../../../shared/ui/Slider/Slider';
import type { ISliderItem } from '../../model/types';
import { MOCK_ALL_CATEGORY_SLIDER_ITEM } from '../../utils/constants';

interface IProductList {
  onSidebarToggle: () => void;
}

const MOCK_SORT = [
  { value: 'opt', label: 'opt' },
  { value: 'opt1', label: 'opt1' },
  { value: 'opt2', label: 'opt2' },
];

export const ProductList = ({ onSidebarToggle }: IProductList) => {
  const dispatch = useAppDispatch();
  const isLoadingProductList = useAppSelector(getIsLoadingProductList);
  const [activeCategory, setActiveCategory] = useState<ISliderItem>(
    MOCK_ALL_CATEGORY_SLIDER_ITEM,
  );

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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

    return list;
  }, [productList, activeCategory, debouncedSearch]);

  useEffect(() => {
    dispatch(getProductListThunk());
  }, [dispatch]);

  return (
    <div className='flex h-full flex-col'>
      <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
        <span className='text-base font-medium'>Swatches List</span>
        <button
          onClick={onSidebarToggle}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
                     [&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>

      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='flex justify-between items-center gap-4 h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)] sm:justify-start'>
          <div className='relative w-full max-w-[180px] h-[36px] sm:max-w-[240px]'>
            <input
              type='text'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='
                h-full w-full pr-8 pl-4 rounded-2xl border border-[var(--border)]
                text-sm text-[var(--grey-text-color)] placeholder-[var(--text-muted)]
                focus:outline-none focus:border-[var(--main-accent-color)]
                bg-[var(--background)] transition
              '
            />
            <div
              className='
                absolute right-2 top-1/2 -translate-y-1/2
                pointer-events-none
                [&_svg_path]:stroke-[var(--svg-dark)]
              '
            >
              <SearchIconSVG width={16} height={16} />
            </div>
          </div>

          <MultiSelect
            options={MOCK_SORT}
            values={['opt']}
            onValueChange={(values) => console.log('value', values)}
            className='max-w-[100px] sm:max-w-[auto] sm:min-w-[160px]'
            dropdownWidth='w-80'
          />

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
          <div className='flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]'>
            <div className='mb-4'>Select Product</div>
            <ul
              className='
                grid grid-cols-2 gap-4
                sm:grid-cols-6
              '
            >
              {filteredProductList.length
                ? filteredProductList.map((productListItem) => {
                    const { name } = productListItem;
                    return (
                      <ProductListItem
                        key={name}
                        productListItem={productListItem}
                      />
                    );
                  })
                : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
