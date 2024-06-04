If the PivotGrid is bound to a large dataset, you can enable the virtual scrolling mode to optimize data load time and reduce resource consumption. In this mode, the PivotGrid loads only the cells that are in the viewport. When cells leave the viewport, the PivotGrid removes them from the DOM.
<!--split-->

To enable this mode, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/scrolling/#mode) to _"virtual"_.

In this demo, the PivotGrid stores approximately 4000 values locally. To see virtual scrolling in action, scroll the PivotGrid horizontally.