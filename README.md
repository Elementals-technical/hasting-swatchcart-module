# hasting-swatchcart-module

For running this module you need to provide the next props

## isOpen

Type - boolean
Required - true

Controls visibility of the module (module state). true → module is visible.

## uiDataType

Type - 'UI' | 'DATA_INPUT' | 'DATA_ALL_PRODUCT',
Required - true

Defines type data mode. Rendered data depends on this parameter

## data

Type - any[] (recommended: AttributeValue[])
Required - true

Array of material/swatches data. Passed to the module to render swatch cards.

## onToggleSidebar

Type - () => void
Required - true

This method uses for open/close this module.

## onSendData

Type - (selected: any[]) => void
Required - true

Callback that returns selected materials from the cart back to the parent application.
