To optimize data load times and improve user navigation when binding DataGrid to a large dataset, you can enable virtual scrolling. In this demo, we bind the component to a dataset of 100,000 records. 

To enable virtual scrolling, set **scrolling**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/scrolling/#mode) to *"virtual"*.
<!--split-->

Unlike [infinite scrolling](/Demos/WidgetsGallery/Demo/DataGrid/InfiniteScrolling/MaterialBlueLight/), virtual scrolling allows users to navigate to any section of rows immediately. DataGrid only loads displayed rows into memory and unloads rows as they are hidden by user scrolling. When virtual scrolling is enabled, **Ctrl+Home** and **Ctrl+End** focus the first cell in the first row/last cell in the last row of the component data set.