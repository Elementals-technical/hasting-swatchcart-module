import { useAppSelector } from '../../src/app/store/store';
import { EDataInputType } from '../../src/features/DataAdapter/utils/types';
import { MultiProductWrapper } from '../../src/features/MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import { getIsOpenSidebar } from '../../src/features/swatches/model/selectors';
import { IAttributeAsset } from '../../src/features/swatches/model/types';
import { Swatches } from '../../src/features/swatches/ui/Swatches';
import { LibraryProvider } from '../store/LibraryProvider';
import './styles.css';

export interface ISwatchesModuleProps {
  isOpen: boolean;
  uiDataType: EDataInputType;
  data: IAttributeAsset[] | any[];
  onToggleSidebar: () => void;
  onSendData: (data: unknown) => void;
}

export const SwatchModule = ({
  isOpen,
  uiDataType,
  data,
  onToggleSidebar,
  onSendData,
}: ISwatchesModuleProps) => {
  const isOpenModule = useAppSelector(getIsOpenSidebar);

  return (
    <LibraryProvider>
      <button className='tw-flex tw-items-center tw-gap-2 bg-amber-700'>
        Click me 2
      </button>
      {isOpenModule ? (
        <>
          {uiDataType === EDataInputType.DATA_ALL_PRODUCT ? (
            <MultiProductWrapper onSendData={onSendData} />
          ) : null}

          {uiDataType === EDataInputType.UI ? (
            <Swatches
              isOpen={isOpen}
              uiDataType='UI'
              data={data as any[]}
              onToggleSidebar={onToggleSidebar}
              onSendData={onSendData}
            />
          ) : null}
        </>
      ) : null}
    </LibraryProvider>
  );
};
