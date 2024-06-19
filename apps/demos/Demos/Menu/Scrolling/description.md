The DevExtreme Menu component supports submenu item scrolling. If combined item height exceeds screen size or a pre-defined height limit, a scrollbar appears on-screen.
<!--split-->

You can use one of the following event handlers to configure submenus as requirements dictate:

- [onSubmenuShowing](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShowing)

- [onSubmenuShown](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuShown) 

- [onSubmenuHiding](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHiding)

- [onSubmenuHidden](/Documentation/ApiReference/UI_Components/dxMenu/Configuration/#onSubmenuHidden)

These handlers can access the root submenu element (`submenuContainer`) and data from root and submenu items (`itemData`).

In this demo, the **onSubmenuShowing** function limits submenu height to 200px.