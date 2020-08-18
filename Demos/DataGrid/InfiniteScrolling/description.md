If the **DataGrid** component works with a large dataset, you can enable infinite scrolling to optimize data loading and navigation. The component initially displays one page of rows. When users scroll the view to the end, the **DataGrid** loads one more page and so on. Users can only load pages sequentially and cannot skip to arbitrary positions in the dataset.

To enable infinite scrolling, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/scrolling/#mode) to *"infinite"*.

In this demo, the **DataGrid** is bound to a dataset of 100,000 records. Scroll to the last loaded record, and the next page of records will be loaded.
