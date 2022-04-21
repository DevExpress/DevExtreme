Drawer is a dismissible or permanently visible panel that usually contains navigation elements. 

To open or close the Drawer component in this demo, click the 'Hamburger' button. Each Drawer visibility change can adjust the layout in the following ways (see [openedStateMode](/Documentation/ApiReference/UI_Components/dxDrawer/Configuration/#openedStateMode)): 

- "*push*"    
The Drawer partially displaces the view.

- "*shrink*"    
The view shrinks to accommodate the Drawer.

- "*overlap*"    
The Drawer overlaps the view.

Use the radio buttons at the bottom of this demo module to try different layout modes. You can also change the Drawer's [position](/Documentation/ApiReference/UI_Components/dxDrawer/Configuration/#position) and [revealMode](/Documentation/ApiReference/UI_Components/dxDrawer/Configuration/#revealMode) properties.

Note this demo's markup. The Drawer definition encloses the view content (the formatted text). The Drawer's own content (navigation links) is set by the [template](/Documentation/ApiReference/UI_Components/dxDrawer/Configuration/#template) property. Finally, the toolbar markup is separate from other elements.

To get started with the DevExtreme Drawer component, refer to the following step-by-step tutorial: [Getting Started with Navigation Drawer](/Documentation/Guide/UI_Components/Drawer/Getting_Started_with_Navigation_Drawer/).