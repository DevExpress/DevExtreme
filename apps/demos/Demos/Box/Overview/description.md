The Box component allows you to create layouts of any complexity. You can arrange multiple blocks (items) horizontally or vertically, specify relative or absolute block sizes, and nest layouts within each other. 

Set the Box's [width](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#width) and [height](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#height) properties to specify the layout's overall dimensions. To add blocks, use the [items](/Documentation/ApiReference/UI_Components/dxBox/Configuration/items/) array, the [dataSource](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#dataSource) property, or specify dxItems in the markup.

This demo shows how to use the Box component to create three different layouts.

The first Box sets [direction](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#direction) to `row` and thus arranges items horizontally. Items use the [ratio](/Documentation/ApiReference/UI_Components/dxBox/Configuration/items/#ratio) property to set their width in relative units. 

The second Box shows two additional features:

- Items now use the [baseSize](/Documentation/ApiReference/UI_Components/dxBox/Configuration/items/#baseSize) property to set their width in pixels or percent. 
- The middle item contains a nested Box. The [align](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#align) and [crossAlign](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#crossAlign) properties make sure that the nested layout is centered within its container.

The third Box demonstrates a layout similar to a basic web page structure. The root layout sets [direction](/Documentation/ApiReference/UI_Components/dxBox/Configuration/#direction) to `col` and arranges its items vertically. The nested layout is arranged horizontally. 