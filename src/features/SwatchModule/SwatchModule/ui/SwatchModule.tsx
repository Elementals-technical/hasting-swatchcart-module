import { EDataInputType } from '../../../DataAdapter/utils/types';
import type { IAttributeAsset } from '../../../swatches/model/types';
import { MultiProductWrapper } from '../../../MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import { Swatches } from '../../../swatches/ui/Swatches';

interface ISwatchesModuleProps {
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
    <>
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
    </>
  );
};
