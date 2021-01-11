If the **DataGrid** UI component is bound to a large dataset, you can enable the virtual scroll feature to optimize data load times and improve user navigation. The UI component calculates the overall number of visible rows and displays a scrollbar that allows users to navigate to any section of rows. When users release the scroll thumb, the control loads records to be displayed in the viewport and removes other rows from memory. 

To allow users to scroll the **DataGrid** virtually, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/scrolling/#mode) to *"virtual"*.

In this demo, the **DataGrid** is bound to a local dataset of 100,000 records. You can drag the scrollbar on the right to see that records within the viewport are updated immediately.
