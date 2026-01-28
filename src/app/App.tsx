import { useState } from 'react';
// import { SwatchModule } from '../features/SwatchModule/SwatchModule/ui/SwatchModule'; // App
// import { SwatchModule } from '../../dist/main'; // build module
import { SwatchModule } from '../../lib/main'; // lib
import { EDataInputType } from '../features/DataAdapter/utils/types';
import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';
// import { AttributeValue } from '../features/swatches/model/types';
// import { MOCK_ROW_PROPS_ATTRIBUTES } from '../shared/constants/props';

/**
 * Demo application wrapper for {@link SwatchModule}.
 *
 * Provides local UI controls to:
 * - toggle module open/close state
 * - switch between different data input modes
 * - handle output payload from the module
 *
 * @component
 */
function App() {
  const [isOpenModule, setIsOpenModule] = useState(true);
  const [mockDataMode, setMockDataMode] = useState<EDataInputType>(
    EDataInputType.FETCH_DATA_ALL,
  );

  /**
   * Toggles the swatch module sidebar visibility.
   */
  const handleOpenSidebar = () => {
    setIsOpenModule((prev) => !prev);
  };

  /**
   * Receives output data from {@link SwatchModule}.
   *
   * @param data - Payload emitted by the module
   */
  const handleSetData = (data: unknown) => {
    console.log('handleSetData', data);
  };

  /**
   * Switches between module data input modes.
   */
  const handleChangeMode = () => {
    const newMode =
      mockDataMode === EDataInputType.FETCH_DATA_ALL
        ? EDataInputType.FETCH_DATA_PRODUCT
        : EDataInputType.FETCH_DATA_ALL;

    setMockDataMode(newMode);
  };

  // const handleSelectMaterial = (item: AttributeValue) => {
  //   console.log("Select material", item);
  // }

  // This array needs only for testing feature that connects data from the scene with our module
  // const MOCK_JS = [
  // {
  //   name: "UI_Base Panel",
  //   value: {
  //     assetId: "d7d451da-ef2a-4b18-8968-dc334e9871e1",
  //     type: "item",
  //   },
  //   label: "Verde Salvia 42 ST",
  //   labelForUI: "Verde Salvia 42 ST",
  //   metadata: {
  //     Name: "Base Panel",
  //     Label: "Base Panel",
  //     thumbnail:
  //       "https://preview.threekit.com/api/images/texture/sha256-8bb06aafce5ba9519736cc65156892d5e00884ddca433c18edfb2980203c5e7f?power2=1024",
  //     hasRenderImagePreview: "true",
  //   },
  //   valueMetadata: {
  //     hex: "#7f8e7c",
  //     soft: "Verde Salvia 42 MT",
  //     Color: "Green",
  //     label: "Verde Salvia 42 ST",
  //     value: "Verde Salvia 42 ST",
  //     Material: "Soft-Touch",
  //     zoomIconColor: "White",
  //   },
  //   assetId: "d7d451da-ef2a-4b18-8968-dc334e9871e1",
  //   timestamp: "2026-01-28T07:11:33.041Z",
  // },
  // {
  //   name: "UI_Lateral Panel",
  //   value: {
  //     assetId: "20328789-8dd1-4ef8-9dae-b4f0620629b2",
  //     type: "item",
  //   },
  //   label: "Verde Polvere 34 ST",
  //   labelForUI: "Verde Polvere 34 ST",
  //   metadata: {
  //     Name: "Lateral Panel",
  //     Label: "Lateral Panel",
  //     thumbnail:
  //       "https://preview.threekit.com/api/images/texture/sha256-68a0d669261b4ec1cd5ce9b6faa44e97118a2f1c18ceac2a04c0d9e3d637547b?power2=1024",
  //     hasRenderImagePreview: "true",
  //   },
  //   valueMetadata: {
  //     hex: "#a3b0ab",
  //     soft: "Verde Polvere 34 MT",
  //     Color: "Green",
  //     label: "Verde Polvere 34 ST",
  //     value: "Verde Polvere 34 ST",
  //     Material: "Soft-Touch",
  //     zoomIconColor: "White",
  //   },
  //   assetId: "20328789-8dd1-4ef8-9dae-b4f0620629b2",
  //   timestamp: "2026-01-28T07:12:02.763Z",
  // },
  // {
  //   name: "UI_Model",
  //   value: {
  //     assetId: "6e089c8b-7d62-40c7-b2cb-a59f6398cfa4",
  //     type: "item",
  //   },
  //   label: "24 1DW Slim_24",
  //   labelForUI: "Urban Duplex · 24'' 1-Drawer Slim",
  //   metadata: {
  //     Name: "Model",
  //     Label: "Model",
  //     hasRenderImagePreview: "true",
  //   },
  //   valueMetadata: {
  //     Label: "24 1DW Slim_24",
  //     value: "24 1DW Slim_24",
  //     thumbnail:
  //       "/api/files/hash/sha256-f5a367cc9e7ffaa5275414f869c3f68c17299e736e15313f783414aafe9f8b1d",
  //     heightImage: "100px",
  //   },
  //   assetId: "6e089c8b-7d62-40c7-b2cb-a59f6398cfa4",
  //   timestamp: "2026-01-28T07:12:08.875Z",
  // },
  // {
  //   name: "UI_Counertops materials",
  //   value: {
  //     assetId: "e6feec85-ae3d-4272-85b5-13de71350888",
  //     type: "item",
  //   },
  //   label: "Cacao Orinoco TFF",
  //   labelForUI: "Cacao Orinoco TFF",
  //   metadata: {
  //     Name: "Counertops materials",
  //     Label: "Counertops materials",
  //     hasRenderImagePreview: "true",
  //   },
  //   valueMetadata: {
  //     hex: "#3f3a3b",
  //     Color: "Brown",
  //     label: "Cacao Orinoco TFF",
  //     value: "Cacao Orinoco TFF",
  //     Material: "Fenix",
  //     zoomIconColor: "White",
  //   },
  //   assetId: "e6feec85-ae3d-4272-85b5-13de71350888",
  //   timestamp: "2026-01-28T07:12:34.337Z",
  // },
  // {
  //   name: "UI_Basin Style",
  //   value: {
  //     assetId: "de4c0a40-86b4-42af-a23d-7ab31b096df3",
  //     type: "item",
  //   },
  //   label: "HPL: Strip",
  //   labelForUI: "Strip",
  //   metadata: {
  //     Name: "Basin Style",
  //     Label: "Basin Style",
  //     "": null,
  //   },
  //   valueMetadata: {
  //     label: "HPL: Strip",
  //     value: "HPL: Strip",
  //     thumbnail:
  //       "/api/files/hash/sha256-da194b2f3910918db4ff057feb7f2f3cadada4d92580eceb7b4d7acee4029dd6",
  //     heightImage: "100px",
  //   },
  //   assetId: "de4c0a40-86b4-42af-a23d-7ab31b096df3",
  //   timestamp: "2026-01-28T07:12:46.047Z",
  // },
  // ];

  return (
    <div className='swatch-module-root'>
      <div className='manipulation_block'>
        <div>
          Active type Module -{' '}
          <span className='p-1 rounded-sm bg-amber-300'>
            {mockDataMode === EDataInputType.FETCH_DATA_ALL
              ? 'List product'
              : 'Single product'}
          </span>
        </div>

        <div>
          Status -{' '}
          <span className='p-1 rounded-sm bg-amber-300'>
            {isOpenModule ? 'Open' : 'Close'}
          </span>
        </div>

        <div className='mb-[4px]'>
          <button
            type='button'
            onClick={handleOpenSidebar}
            className='px-4 py-2 rounded bg-[var(--main-accent-color)] text-white'
          >
            {isOpenModule ? 'Close' : 'Open'} module
          </button>
        </div>

        <div>
          <button
            type='button'
            onClick={handleChangeMode}
            className='px-4 py-2 rounded bg-[var(--main-accent-color)] text-white'
          >
            Change type to{' '}
            {mockDataMode === EDataInputType.FETCH_DATA_ALL
              ? 'Single product'
              : 'List product'}{' '}
            module
          </button>
        </div>
      </div>

      {/* <div
        className={`${
          mockDataMode === EDataInputType.FETCH_DATA_ALL
            ? // ? 'min-h-0 overflow-hidden flex flex-col border border-[var(--border)]'
              'h-[768px] min-h-0 overflow-hidden flex flex-col border border-[var(--border)]'
            : ''
        }`}
      > */}
      <SwatchModule
        isOpen={isOpenModule}
        uiDataType={mockDataMode}
        // configurationData={MOCK_JS}
        data={MOCK_ROW_PROPS_ATTRIBUTES as any[]}
        assetId='c5f1aeee-d13b-41f6-98d6-75fd35c49236'
        onToggleSidebar={handleOpenSidebar}
        onSendData={handleSetData}
        // onSelectMaterial={handleSelectMaterial}
      />
      {/* </div> */}
    </div>
  );
}

export default App;
