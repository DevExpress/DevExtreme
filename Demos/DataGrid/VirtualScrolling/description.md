If the **DataGrid** component works with a large dataset, you can enable virtual scrolling to optimize data loading and navigation. The component calculates the overall number of visible rows and displays a scrollbar so users can jump to any location. When users release the scroll thumb, the control loads the records to be displayed in the viewport and removes other rows from memory. 

To enable virtual scrolling, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/scrolling/#mode) to *"virtual"*.

In this demo, the **DataGrid** is bound to a local dataset of 100,000 records. Thanks to virtual scrolling, you can scroll to any record without lag.
