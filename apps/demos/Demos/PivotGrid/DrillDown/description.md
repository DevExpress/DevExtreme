PivotGrid supports the drill-down operation that allows you to retrieve individual facts (records) used to calculate a specific summary value.
<!--split-->

Call the [createDrillDownDataSource(options)](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Methods/#createDrillDownDataSourceoptions) method to get a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) instance that contains a list of facts for a summary value.

This demo displays a list of facts within a [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid) in a [Popup](/Documentation/ApiReference/UI_Components/dxPopup/) window. To open the window, click a pivot grid cell. We use the [onCellClick](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onCellClick) event handler to retrieve the cell's data and pass it as an argument to the **createDrillDownDataSource(options)** method.