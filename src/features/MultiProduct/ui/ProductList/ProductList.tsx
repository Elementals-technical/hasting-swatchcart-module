import { useEffect } from 'react';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { SearchIconSVG } from '../../../../app/assets/svg/SearchIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MultiSelect } from '../../../../shared/ui/MultiSelect/MultiSelect';
import { getProductListThunk } from '../../../swatches/model/thunks';
import {
  getIsLoadingProductList,
  getProductLIst,
} from '../../../swatches/model/selectors';

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

  const productList = useAppSelector(getProductLIst);

  useEffect(() => {
    dispatch(getProductListThunk());
  }, []);

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
        <div className='flex justify-between items-center gap-4 h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)]'>
          <div className='relative w-full max-w-[180px] h-[32px]'>
            <input
              type='text'
              placeholder='Search'
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
            className='h-[32px]'
          />
        </div>

        <div className='h-[64px] p-[var(--sm-padding)] border-b border-[var(--border)] bg-red-500 sm:hidden'>
          sort
        </div>

        {isLoadingProductList ? (
          <div className='w-full flex justify-center items-center flex-1 min-h-0'>
            loading...
          </div>
        ) : (
          <div className='flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]'>
            <div className='mb-4'>Select Product</div>
            <ul
              className='
              grid grid-cols-2 sm:grid-cols-6
                gap-4
                '
            >
              {productList.length
                ? productList?.map((productListItem) => {
                    const { name } = productListItem;
                    return <li key={name}>{name}</li>;
                  })
                : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
