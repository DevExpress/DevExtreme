Infinite scrolling enables users to scroll the dataset page by page, but pages cannot be skipped. Each next page is loaded once the scrollbar reaches the end of its scale.

To enable infinite scrolling, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/scrolling/#mode) to *"infinite"*.

In this demo, the **DataGrid** is bound to a dataset of 100,000 records. Scroll to the last loaded record, and you should see that the **DataGrid** loads the next page.