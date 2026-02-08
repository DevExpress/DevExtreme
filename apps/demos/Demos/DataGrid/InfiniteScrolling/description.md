To optimize data load times and improve user navigation when binding DataGrid to a large dataset, you can enable infinite scrolling. In this demo, we bind the component to a dataset of 100,000 records.

To enable infinite scrolling, set **scrolling**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/scrolling/#mode) to *"infinite"*.
<!--split-->

The component initially displays one page of rows. When users scroll to the end of the view, DataGrid loads the next page. Users cannot skip to arbitrary positions within the component's dataset and can only load pages sequentially.

As a result, the **Ctrl + End** shortcut jumps to the last loaded row and focuses on its last cell. **Ctrl + Home** jumps to the first row and focuses on its first cell.