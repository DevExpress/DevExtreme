The Menu component supports submenu item scrolling. If the combined item length exceeds the screen size, a scrollbar appears, and the submenu height is restricted.

You can use one of the following event handlers to configure submenus:

- [onSubmenuShowing](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShowing)

- [onSubmenuShown](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShown) 

- [onSubmenuHiding](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHiding)

- [onSubmenuHidden](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHidden)

These handlers access `submenuContainer`, the root submenu element, and `itemData`, which contains root item and submenu item data.

In this demo, the **onSubmenuShowing** function limits the submenu height to 200px.