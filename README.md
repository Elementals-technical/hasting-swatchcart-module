# hasting-swatchcart-module

This module was created for implementation into clients applications
There are two ways of using this module: `NPM` or `CDN`

## Installation

### NPM

```bash
npm i hasting-swatchcart-module
```

### NPM usage

```js
import { SwatchModule } from 'hasting-swatchcart-module';

<SwatchModule
  isOpen={isOpenModule}
  uiDataType={'UI' or 'DATA_INPUT' or 'DATA_ALL_PRODUCT'}
  data={data}
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
    import { mountSwatchModule } from 'https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.js';

    const rootElement = document.getElementById('root');

    const handleToggleSidebar = () => {
      // handleToggleSidebar
    };

    const handleSendData = (selectedData) => {
      // handleSendData
    };

    // UI (attributes from outside) - single product
    // mountSwatchModule(rootElement, {
    //   isOpen: true,
    //   uiDataType: 'UI',
    //   data: mockData, // or your data
    //   onToggleSidebar: handleToggleSidebar,
    //   onSendData: handleSendData,
    // });

    // Fetch product data - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: 'FETCH_DATA_PRODUCT',
      assetId: '67119b1c-36ba-42c1-bcd1-2d21cf44df55',
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

| Prop            | Type                                                                                   | Required | Description                                                                            |
| --------------- | -------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                                                                | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'UI' or 'DATA_INPUT' or 'DATA_ALL_PRODUCT' or 'FETCH_DATA_PRODUCT' or 'FETCH_DATA_ALL' | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| data            | IAttributeAsset[]                                                                      | Yes      | Array of attributes data. Passed to the module to render swatch cards.                 |
| onToggleSidebar | void                                                                                   | Yes      | This method uses for open/close this module.                                           |
| onSendData      | () => selected materials array from a cart                                             | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

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
  import { mountSwatchModule } from '../dist/cdn/main.js';

  const rootElement = document.getElementById('root');
  const jsonUrl = new URL('./mockAttribute.json', import.meta.url);
  const mockData = await fetch(jsonUrl).then((r) => r.json());

  const handleToggleSidebar = () => {
    console.log("handleToggleSidebar is working");
  }

  const handleSendData = (selectedData) => {
    console.log("handleSendData  is working", selectedData);
  }

  mountSwatchModule(rootElement, {
    isOpen: true,
    uiDataType: 'UI' or 'DATA_INPUT' or 'DATA_ALL_PRODUCT',
    data: mockData,
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
    import { mountSwatchModule } from '../dist/cdn/main.js';

    // Test real CDN
    // import { mountSwatchModule } from 'https://unpkg.com/hasting-swatchcart-module/dist/cdn/main.js';

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

    // UI (attributes from outside) - single product
    // mountSwatchModule(rootElement, {
    //   isOpen: true,
    //   uiDataType: 'UI',
    //   data: mockData, // or your data
    //   onToggleSidebar: handleToggleSidebar,
    //   onSendData: handleSendData,
    // });

    // Fetch product data - single product
    mountSwatchModule(rootElement, {
      isOpen: true,
      uiDataType: 'FETCH_DATA_PRODUCT',
      assetId: '67119b1c-36ba-42c1-bcd1-2d21cf44df55',
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

```js
  <SwatchModule
    isOpen={isOpenModule}
    uiDataType={'UI' or 'DATA_INPUT' or 'DATA_ALL_PRODUCT'}
    data={data}
    onToggleSidebar={handleOpenSidebar}
    onSendData={handleSetData}
  />
```

## Publishing module

Before Publishing you need to start

```bach
npm run build:all
```

Then

```bach
npm publish
```
