The Toolbar contains items that manage the page content. In this demo, the Toolbar manages the [List](/Documentation/ApiReference/UI_Components/dxList/).
<!--split-->

## Configure Toolbar Items

You can display Toolbar items from an [items](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/) array or a [dataSource](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/#dataSource). A Toolbar item may be plain text or a UI component. You should specify the [text](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#text) or the [widget](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#widget) property depending on the item. If the item is a UI component, declare its [options](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#options).

## Specify Item Location

You can set the **dataSource** with **location** fields or specify the [location](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#location) property for each item. The **location** value can be one of the following:

- *"center"*  
 Places the item in the center of the toolbar.

- *"before"*  
 Places the item before the central element(s).

- *"after"*  
 Places the item after the central element(s).

Additionally, the Toolbar can render its items in the overflow menu. Specify the [locateInMenu](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#locateInMenu) property for each item with one of the following values:

- *"always"*  
 Always places the item in the overflow menu.

- *"never"*  
 Places the item outside of the overflow menu.

- *"auto"*  
 Places the item outside of the overflow menu. If all items cannot fit within the width of the Toolbar, it renders this item in the overflow menu.

Note that you cannot specify the order of the items with `locateinMenu="auto"` placed in the overflow menu.

## Customize Item Appearance

You can define the [itemTemplate](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/#itemTemplate) to customize item appearance. To customize the items in the overflow menu, use the [menuItemTemplate](/Documentation/ApiReference/UI_Components/dxToolbar/Configuration/items/#menuItemTemplate).