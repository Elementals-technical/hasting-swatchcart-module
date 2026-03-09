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

### For example

```js
const handleOpenSidebar = () => {
  // open/close a module
};
```

```js
const handleSetData = (data) => {
  // Callback that returns selected materials from the cart back to the parent Application.
};
```

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

| Prop            | Type                                                   | Required | Description                                                                            |
| --------------- | ------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                                | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'UI'                                                   | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| data            | IAttributeAsset[]                                      | Yes      | Array of attributes data. Passed to the module to render swatch cards.                 |
| onToggleSidebar | void                                                   | Yes      | This method uses for open/close this module.                                           |
| onSendData      | (data) => data is selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

### Fetch product

| Prop              | Type                                                   | Required | Description                                                                                    |
| ----------------- | ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------- |
| isOpen            | boolean                                                | Yes      | Controls visibility of the module (module state). true → module is visible.                    |
| uiDataType        | 'FETCH_DATA_PRODUCT'                                   | Yes      | Defines type data mode. Rendered data depends on this parameter                                |
| assetId           | string                                                 | Yes      | Defined an object for getting it`s attributes                                                  |
| configurationData | any[]                                                  | Yes      | Takes data from the scene and sets it to the our module                                        |
| onToggleSidebar   | void                                                   | Yes      | This method uses for open/close this module.                                                   |
| onSendData        | (data) => data is selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application.         |
| onSelectMaterial  | (item) => returns selected the selected material       | No       | Callback that returns selected material from the material list back to the parent Application. |

### Fetch all product

| Prop            | Type                                                   | Required | Description                                                                            |
| --------------- | ------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| isOpen          | boolean                                                | Yes      | Controls visibility of the module (module state). true → module is visible.            |
| uiDataType      | 'FETCH_DATA_ALL'                                       | Yes      | Defines type data mode. Rendered data depends on this parameter                        |
| onToggleSidebar | void                                                   | Yes      | This method uses for open/close this module.                                           |
| onSendData      | (data) => data is selected materials array from a cart | Yes      | Callback that returns selected materials from the cart back to the parent Application. |

## Implementation Details

### How `FETCH_DATA_PRODUCT` works (Single Product mode)

This mode fetches material data for a **single product** by its `assetId` and renders a swatch picker with a cart.

#### Data flow

```
SwatchesModule (lib/components/SwatchesModule.tsx)
  │
  ├─ useEffect (on isOpen + uiDataType === FETCH_DATA_PRODUCT)
  │     │
  │     ├─ 1. dispatch(getSelectedProductThunk({ assetId }))
  │     │      → calls GET /products/{assetId}
  │     │      → returns IFetchProductData (materials[], structure[])
  │     │
  │     ├─ 2. dispatch(getSelectedProductInformationThunk({ assetId }))
  │     │      → calls GET /products?assetId[]={assetId}
  │     │      → returns IProductInformationResponse (product metadata rows)
  │     │
  │     ├─ 3. DataAdapterServices.getTransformedData({
  │     │        dataType: FETCH_DATA_PRODUCT,
  │     │        data: productData,
  │     │        selectedProduct: selectedProduct.rows[0]
  │     │      })
  │     │      → getTransformedFetchProductData():
  │     │         - iterates structure → groups → options
  │     │         - filters only options with typeComponent === MATERIAL
  │     │         - maps optionName → groupName
  │     │         - flattens material valuesArray into individual swatch items
  │     │         - attaches parentName, optionName, productInformation to each item
  │     │
  │     ├─ 4. dispatch(setAllMaterialsOptions(fetchProductData))
  │     │      → writes transformed materials into the Redux store
  │     │
  │     └─ 5. (optional) if configurationData[] is provided:
  │            - filters configurationData by known material keys
  │            - maps each entry into the cart item shape
  │            - dispatches setSelectedMaterial() for each item
  │              (pre-populates the cart from the scene configuration)
  │
  └─ Renders:
       SwatchModule (ui/SwatchModule.tsx)
         └─ <Swatches /> (single product swatch view)
               ├─ SwatchWrapper  → material grid with filters
               └─ CartWrapper    → selected materials cart
```

#### Key files

| File                                                  | Responsibility                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `lib/components/SwatchesModule.tsx`                   | Entry point; orchestrates fetch & data transformation                                      |
| `src/features/swatches/model/thunks.ts`               | `getSelectedProductThunk`, `getSelectedProductInformationThunk`                            |
| `src/features/MultiProduct/model/API/api.ts`          | `getSelectedProductAPI`, `getSelectedProductListInformationAPI`                            |
| `src/features/MultiProduct/model/API/routes.ts`       | API route definitions (`/products/{assetId}`, `/products?assetId[]={assetId}`)             |
| `src/features/DataAdapter/lib/DataAdapterServices.ts` | `getTransformedFetchProductData()` — transforms raw API response into swatch-module format |
| `src/features/swatches/ui/Swatches.tsx`               | Renders `SwatchWrapper` (material grid) or `CartWrapper` (cart) based on active tab        |

#### API endpoints used

| Method | URL                             | Description                           |
| ------ | ------------------------------- | ------------------------------------- |
| GET    | `/products/{assetId}`           | Fetches product materials & structure |
| GET    | `/products?assetId[]={assetId}` | Fetches product metadata/information  |

#### Asset ID tracking

When `assetId` changes, the module automatically:

1. Resets `selectedMaterials` in Redux store
2. Clears persisted selected materials via `StorageService.clearSelectedMaterials()`
3. Stores the new asset ID via `StorageService.setCurrentAssetId(assetId)`

---

### How `FETCH_DATA_PRODUCT_All` (`FETCH_DATA_ALL`) works (Multi Product mode)

This mode fetches the **entire product catalog** and renders a multi-product browsing experience with a shared cart.

> **Note:** In the codebase the enum value is `EDataInputType.FETCH_DATA_ALL`. The prop string `'FETCH_DATA_PRODUCT_All'` used in some examples maps to this same value.

#### Data flow

```
SwatchesModule (lib/components/SwatchesModule.tsx)
  │
  ├─ useEffect (on isOpen + uiDataType === FETCH_DATA_ALL)
  │     │
  │     └─ dispatch(getProductListThunk())
  │            → calls GET /products?pageSize=500
  │            → returns IProductListResponse (array of products)
  │            → stored in multiProductCart Redux slice
  │
  └─ Renders:
       SwatchModule (ui/SwatchModule.tsx)
         └─ <MultiProductWrapper />
               │
               ├─ State A: No product selected → <ProductList />
               │     - Displays full product catalog in a grid
               │     - Category slider filter (unique categories)
               │     - Debounced search input
               │     - A–Z / Z–A sorting via SingleSelect
               │     - Animated header image (hides on scroll)
               │     - <SwatchContentContainer /> (floating cart summary)
               │
               ├─ State B: Product selected → <SelectedProductItem />
               │     │
               │     ├─ On ProductListItem click:
               │     │     1. dispatch(getSelectedProductThunk({ assetId }))
               │     │        → GET /products/{assetId}
               │     │     2. DataAdapterServices.getTransformedData({
               │     │          dataType: FETCH_DATA_PRODUCT, data: productData
               │     │        })
               │     │     3. dispatch(setAllMaterialsOptions(fetchProductData))
               │     │     4. dispatch(setSelectedProduct(productListItem))
               │     │
               │     ├─ <FiltersSelectedProductItem /> → material filters
               │     ├─ <MaterialMultiProductList />   → material swatch grid
               │     └─ <SwatchContentContainer />     → floating cart summary
               │
               └─ State C: Cart opened → <MultiProductItemCart />
                     - Groups selected items by product
                     - Increment / Decrement / Delete actions
                     - Syncs deletion with swatches selectedMaterials
                     - CartPrice + "Go to shipping" button
                     - SwatchLimitModal (max swatch count guard)
```

#### Key files

| File                                                                         | Responsibility                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `lib/components/SwatchesModule.tsx`                                          | Entry point; dispatches `getProductListThunk`                            |
| `src/features/MultiProduct/model/thunk.ts`                                   | `getProductListThunk` — fetches full product list                        |
| `src/features/MultiProduct/model/API/api.ts`                                 | `getProductListAPI` — HTTP call to `/products?pageSize=500`              |
| `src/features/MultiProduct/model/API/routes.ts`                              | Route definitions                                                        |
| `src/features/MultiProduct/ui/MultiProductWrapper/MultiProductWrapper.tsx`   | Routing between ProductList / SelectedProductItem / MultiProductItemCart |
| `src/features/MultiProduct/ui/ProductList/ProductList.tsx`                   | Product catalog grid with search, sort, category filter                  |
| `src/features/MultiProduct/ui/ProductListItem/ProductListItem.tsx`           | Single product card; on click fetches product details & transforms data  |
| `src/features/MultiProduct/ui/SelectedProductItem/SelectedProductItem.tsx`   | Selected product material view with filters                              |
| `src/features/MultiProduct/ui/MultiProductItemCart/MultiProductItemCart.tsx` | Multi-product cart: grouped items, quantity controls, totals             |
| `src/features/DataAdapter/lib/DataAdapterServices.ts`                        | `getTransformedFetchProductData()` — shared data transformer             |
| `src/features/MultiProduct/lib/MultiProductCartServices.ts`                  | `getUniqueCategories()` — extracts category list for slider              |

#### API endpoints used

| Method | URL                      | Description                                                      |
| ------ | ------------------------ | ---------------------------------------------------------------- |
| GET    | `/products?pageSize=500` | Fetches entire product catalog                                   |
| GET    | `/products/{assetId}`    | Fetches product details when a product is selected from the list |

#### UI states

| State          | Condition                                | Component                  |
| -------------- | ---------------------------------------- | -------------------------- |
| Product list   | No product selected, cart closed         | `<ProductList />`          |
| Product detail | Product selected, cart closed            | `<SelectedProductItem />`  |
| Cart           | Cart opened (`isOpenMultiCart === true`) | `<MultiProductItemCart />` |

---

### `EDataInputType` enum

Defined in `src/features/DataAdapter/utils/types.ts`:

```ts
export const EDataInputType = {
  UI: 'UI',
  FETCH_DATA_PRODUCT: 'FETCH_DATA_PRODUCT',
  FETCH_DATA_ALL: 'FETCH_DATA_ALL',
} as const;
```

| Value                | Mode                         | Description                                   |
| -------------------- | ---------------------------- | --------------------------------------------- |
| `UI`                 | Single product (local data)  | Data is passed via `data` prop — no API calls |
| `FETCH_DATA_PRODUCT` | Single product (remote data) | Fetches one product by `assetId` from the API |
| `FETCH_DATA_ALL`     | Multi product (remote data)  | Fetches entire product catalog from the API   |

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

## Branching

We have one main branch `main`. This branch connected to DO and our web version of our module.

## Publishing

In our app we have two envs that we need to published

- web
- module

### Publishing web

```bach
npm run build
```

Then push your changes to the `develop` branch then push to the `main`

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

You can publish module changes from any branch you want

\*\* Don't forget to add your changes to the `main` branch
