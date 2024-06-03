## Populate Menu with Data and Configure the Access to It

You can display Menu items from the [items](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/items/) array or a [dataSource](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#dataSource). This demo contains an example of a data structure. If you use a **dataSource**, specify the [displayExpr](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#displayExpr) property.
<!--split-->

To access the clicked item, use the [onItemClick](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onItemClick) event handler function.

## Configure the Menu

Use the [orientation](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#orientation) property to specify whether the Menu has horizontal or vertical orientation. Use the [animation](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/animation/) property to specify the type, delay, duration, and other options of [show](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/animation/#show) and [hide](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/animation/#hide) menu actions.

## Configure the Submenus

Clicking or a hovering a Menu item opens a drop-down menu that can contain several submenus. To specify the drop-down menu mode (*"onClick"* or *"onHover"*), use the [showSubmenuMode](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/showSubmenuMode/) property. If you need only to specify the first level of drop-down menus, use the [showFirstSubmenuMode](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/showFirstSubmenuMode/) property.

If you want to hide the submenu when the mouse pointer leaves it, set the [hideSubmenuOnMouseLeave](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#hideSubmenuOnMouseLeave) property to **true**.

## Customize Item Appearance

You can define specific fields in the item data objects to change the appearance of an item. For example, use the [icon](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/items/#icon) property to supply items with icons. Define an [itemTemplate](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#itemTemplate) to customize item appearance.

