import { EDataInputType } from '../../../DataAdapter/utils/types';
import type { IAttributeAsset } from '../../../swatches/model/types';
import { useAppSelector } from '../../../../app/store/store';
import { getIsOpenSidebar } from '../../../swatches/model/selectors';
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
  const isOpenModule = useAppSelector(getIsOpenSidebar);

  return (
    <>
      {isOpenModule ? (
        <>
          {uiDataType === EDataInputType.DATA_ALL_PRODUCT ? (
            <MultiProductWrapper />
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
