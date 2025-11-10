import { ISwatchesModuleProps } from '../../../../../lib/main';
import { EDataInputType } from '../../../DataAdapter/utils/types';
import { MultiProductWrapper } from '../../../MultiProduct/ui/MultiProductWrapper/MultiProductWrapper';
import { Swatches } from '../../../swatches/ui/Swatches';

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
          {uiDataType === EDataInputType.FETCH_DATA_ALL ? (
            <MultiProductWrapper
              onSendData={onSendData}
              onToggleSidebar={onToggleSidebar}
            />
          ) : null}

          {uiDataType === EDataInputType.UI ? (
            <Swatches
              isOpen={isOpen}
              uiDataType={uiDataType}
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
