If the DataGrid UI component is bound to a large dataset, you can enable infinite scroll mode to optimize data load times and improve user navigation. The UI component initially displays one page of rows. When users scroll to the end of the view, the DataGrid loads an additional page. Users can only load pages sequentially and cannot skip to arbitrary positions within the dataset.

To enable infinite scroll mode, set the **scrolling**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/scrolling/#mode) to *"infinite"*.

In this demo, the DataGrid is bound to a dataset of 100,000 records. Scroll to the last record to load the next page of records.
