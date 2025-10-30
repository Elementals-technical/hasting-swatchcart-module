import { EDataInputType } from '../../src/features/DataAdapter/utils/types';
import { MultiProductWrapper } from '../../src/features/MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import { IAttributeAsset } from '../../src/features/swatches/model/types';
import { Swatches } from '../../src/features/swatches/ui/Swatches';
import { LibraryProvider } from '../store/LibraryProvider';
import '../assets/styles/index.css';

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
  return (
    <LibraryProvider>
      {isOpen ? (
        <>
          {uiDataType === EDataInputType.DATA_ALL_PRODUCT ? (
            <MultiProductWrapper
              onSendData={onSendData}
              onToggleSidebar={onToggleSidebar}
            />
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
