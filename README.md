# hasting-swatchcart-module

This module was created for implementation into clients applications
There are two ways of using this module: `NPM` or `CDN`

## Installation

### NPM

```bash
npm i hasting-swatchcart-module
```

### NPM usage

### UI (attributes from outside )

```js
import { SwatchModule, EDataInputType } from 'hasting-swatchcart-module';

<SwatchModule
  isOpen={isOpenModule}
  uiDataType={EDataInputType.UI}
  data={data}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>;
```

### Fetch product

```js
import { SwatchModule, EDataInputType } from 'hasting-swatchcart-module';

<SwatchModule
  isOpen={isOpenModule}
  uiDataType={EDataInputType.FETCH_DATA_PRODUCT}
  assetId={'asset_id'}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>;
```

### Fetch product all

```js
import { SwatchModule, EDataInputType } from 'hasting-swatchcart-module';

<SwatchModule
  isOpen={isOpenModule}
  uiDataType={EDataInputType.FETCH_DATA_ALL}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>;
```

### CDN (no installation required) usage and installation

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.css"
/>
<body>
  <div id="root"></div>

  <script type="module">
    import {
      mountSwatchModule,
      EDataInputType,
    } from 'https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.js';

    // local MOCK JSON data or your real data
    const jsonUrl = new URL('./mockAttribute.json', import.meta.url);
    const mockData = await fetch(jsonUrl).then((r) => r.json());

    const rootElement = document.getElementById('root');

    const handleToggleSidebar = () => {
      console.log('handleToggleSidebar');
    };

    const handleSendData = (selectedData) => {
      console.log('handleSendData', selectedData);
    };

    // UI (attributes from outside) - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.UI,
      data: mockData, // or your data
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });

    // Fetch product data - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.FETCH_DATA_PRODUCT,
      assetId: 'assetId',
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });

    // Fetch product all data - multi product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.FETCH_DATA_ALL,
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });
  </script>
</body>
```

## Props

```ts
export interface IAttributeAsset {
  assetType: string;
  blacklist: unknown[];
  defaultValue: { assetId: string; type: string }[];
  disabledValues: unknown[];
  enabled: boolean;
  global: {
    defaultValue: { assetId: string; type: string };
    id: string;
    metadata: unknown[];
    name: string;
    type: string;
  };
  hiddenValues: unknown[];
  id: string;
  label: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
  type: string;
  value: {
    assetId: string;
    configuration: unknown;
    metadata: { [key: string]: string };
    name: string;
    tags: string[];
    type: string;
  };
  values: IAttributeAssetValues[];
  visible: boolean;
}
```

### UI (attributes from outside )

| Prop            | Type                                       | Required | Description                                                                            |
| --------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                    | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'UI'                                       | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| data            | IAttributeAsset[]                          | Yes      | Array of attributes data. Passed to the module to render swatch cards.                 |
| onToggleSidebar | void                                       | Yes      | This method uses for open/close this module.                                           |
| onSendData      | () => selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

### Fetch product

| Prop            | Type                                       | Required | Description                                                                            |
| --------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                    | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'FETCH_DATA_PRODUCT'                       | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| assetId         | string                                     | Yes      | Defined an object for getting it`s attributes                                          |
| onToggleSidebar | void                                       | Yes      | This method uses for open/close this module.                                           |
| onSendData      | () => selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

### Fetch all product

| Prop            | Type                                       | Required | Description                                                                            |
| --------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                    | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'FETCH_DATA_ALL'                           | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| onToggleSidebar | void                                       | Yes      | This method uses for open/close this module.                                           |
| onSendData      | () => selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

## Development

```bash
git clone https://github.com/Elementals-technical/hasting-swatchcart-module.git
cd hasting-swatchcart-module
npm install
npm run dev
```

### General Information

This project gives a module which can be implemented in two ways `NPM`, `CDN`.

**_IMPORTANT_** before pushing code to the git repo, husky runs this scripts for checking `error/warnings`. If your scripts din't finish, check the console for more information

```bash
  npm run build:all
  npx lint-staged
```

### Stack

- react
- RTK
- css/tailwind
- vite
- husky
- lint
- FSD as architecture base

### Testing CDN Usage Locally

1. **Build**
   If a `dist` folder `doesn't exist`, use this command for making it.

```bash
npm run build:all
```

If a `dist` folder `exist`, use this command for making it.

```bash
npm run build:cdn
```

2. **Test with local files** - Create an HTML file and use local paths:

```html
<link rel="stylesheet" href="../dist/cdn/main.css" />
<script type="module">
  // Test locally
  import { mountSwatchModule, EDataInputType } from '../dist/cdn/main.js';

  const rootElement = document.getElementById('root');
  const jsonUrl = new URL('./mockAttribute.json', import.meta.url);
  const mockData = await fetch(jsonUrl).then((r) => r.json());

  const handleToggleSidebar = () => {
    console.log('handleToggleSidebar is working');
  };

  const handleSendData = (selectedData) => {
    console.log('handleSendData  is working', selectedData);
  };

  // Chose one of these possible options

  // UI (attributes from outside) - single product
  mountSwatchModule(rootElement, {
    isOpen: true,
    uiDataType: EDataInputType.UI,
    data: mockData, // or your data
    onToggleSidebar: handleToggleSidebar,
    onSendData: handleSendData,
  });

  // Fetch product data - single product
  mountSwatchModule(rootElement, {
    isOpen: true,
    uiDataType: EDataInputType.FETCH_DATA_PRODUCT,
    assetId: 'assetId',
    onToggleSidebar: handleToggleSidebar,
    onSendData: handleSendData,
  });

  // Fetch product all data - multi product
  mountSwatchModule(rootElement, {
    isOpen: true,
    uiDataType: EDataInputType.FETCH_DATA_ALL,
    onToggleSidebar: handleToggleSidebar,
    onSendData: handleSendData,
  });
</script>
```

3. **Test with CDN** - Use the published CDN version:

```html
<!-- Test real CDN -->
<link
  rel="stylesheet"
  href="https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.css"
/>

<div id="root"></div>
<script type="module">
  // Test real CDN
  import { mountSwatchModule } from 'https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.js';

  // local JSON data
  const jsonUrl = new URL('./mockAttribute.json', import.meta.url);
  const mockData = await fetch(jsonUrl).then((r) => r.json());

  const rootElement = document.getElementById('root');  <script type="module">
    // Test locally
    // import { mountSwatchModule } from '../dist/cdn/main.js';

    // Test real CDN
    import { mountSwatchModule } from 'https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.js';

    // local JSON data
    const jsonUrl = new URL('./mockAttribute.json', import.meta.url);
    const mockData = await fetch(jsonUrl).then((r) => r.json());

    const rootElement = document.getElementById('root');

    const handleToggleSidebar = () => {
      console.log('handleToggleSidebar');
    };

    const handleSendData = (selectedData) => {
      console.log('handleSendData', selectedData);
    };

    // Chose one of these possible options

    // UI (attributes from outside) - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.UI,
      data: mockData, // or your data
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });

    // Fetch product data - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.FETCH_DATA_PRODUCT,
      assetId: 'assetId',
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });

    // Fetch product all data - multi product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: EDataInputType.FETCH_DATA_ALL,
      onToggleSidebar: handleToggleSidebar,
      onSendData: handleSendData,
    });
</script>
```

### Testing Module Usage Locally

1. **Build**

```bash
npm run build:lib
```

2. **Run Locally**

After finishing `build` in the `src/App.ts`, import builded file from the builded folder

```js
import { SwatchModule } from '../../dist/main'; // build module
```

3. **Use module**

### UI (attributes from outside )

```js
<SwatchModule
  isOpen={isOpenModule}
  uiDataType={'UI'}
  data={data}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>
```

### Fetch product

```js
<SwatchModule
  isOpen={isOpenModule}
  uiDataType={'FETCH_DATA_PRODUCT'}
  assetId={'asset_id'}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>
```

### Fetch product all

```js
<SwatchModule
  isOpen={isOpenModule}
  uiDataType={'FETCH_DATA_PRODUCT_All'}
  onToggleSidebar={handleOpenSidebar}
  onSendData={handleSetData}
/>
```

## Publishing

In our app we have two envs that we need to published

- web
- module

### Publishing web

```bach
npm run build
```

### Publishing module

Before Publishing you need to start

```bach
npm run build:all
```

Then

Update module version

`"version": "*.*.*"`

Then

```bach
npm publish
```
