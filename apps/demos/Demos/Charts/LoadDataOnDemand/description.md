In this demo, the [range area](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/RangeArea/) Chart loads data as you pan it. Once the component loads a data block, this data stays in memory to reduce requests to the server. To implement this functionality, do the following:

1. Configure a data source.

    - Assign a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) with an empty [store](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/store/) to the Chart [dataSource](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#dataSource) property.

    - Set the [sort](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#sort) property to `date`.

    - Disable the [paginate](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#paginate) property to prevent data from partitioning.

2. Configure the Chart to support on-demand data loading.

    - Set the [visualRangeUpdateMode](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/#visualRangeUpdateMode) property to `keep`.

    - Specify a [loadingIndicator](/Documentation/ApiReference/UI_Components/dxChart/Configuration/loadingIndicator/).

    - Specify the initial [visualRange](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/visualRange/).
    
    - Implement a function that respond to user pan operations and tracks [visualRange](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/visualRange/) changes. If a user changed the visual range, initiate a request for additional data.

3. Implement functions that load the data.

    - In this demo, Chart displays daily information. If a user pan the Chart left or right more than half a day, additional data starts to load. The `onVisualRangeChanged` initiates this procedure.

    - The `uploadDataByVisualRange` function analyzes the starting and ending points of the visual range and the bounds of already loaded data. If necessary, it calls the `getDataFrame` function to obtain new data points. Finally, it reloads the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) and saves the current visual range.

    - The `getDataFrame` Ajax request gets the new data frame from the server.
