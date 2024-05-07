The Menu component supports submenu item scrolling. If the combined item height exceeds the screen size or a pre-defined height limit, a scrollbar appears.

You can use one of the following event handlers to configure submenus:

- [onSubmenuShowing](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShowing)

- [onSubmenuShown](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShown) 

- [onSubmenuHiding](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHiding)

- [onSubmenuHidden](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHidden)

These handlers can access the root submenu element (`submenuContainer`), as well as data from root and submenu items (`itemData`).

In this demo, the **onSubmenuShowing** function limits the submenu height to 200px.