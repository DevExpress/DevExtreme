The **DataGrid** includes the following API you can use to filter data:     

- [filter()](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#filter) / [filter(filterExpr)](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#filterfilterExpr)       
Gets or sets a filter expression for the grid's [dataSource](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#dataSource).

- [filterValue](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#filterValue)       
A filter expression that is applied with the following UI elements: [filter row](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/filterRow/), [header filter](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/headerFilter/), [filter builder](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#filterBuilder).

- [getCombinedFilter()](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#getCombinedFilter) / [getCombinedFilter(returnDataField)](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#getCombinedFilterreturnDataField)       
Gets the total filter that includes filters from the UI elements and the filter applied to the **dataSource**. If you specify the `returnDataField` parameter, the returned value contains data field names instead of [getters](/Documentation/Guide/Data_Binding/Data_Layer/#Getters_And_Setters).

- [clearFilter()](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#clearFilter) / [clearFilter(filterName)](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#clearFilterfilterName)       
Discards all filters applied to the UI component. If you specify the `filterName` parameter, this method discards all filters of a specific type.

In this demo, you can use the [SelectBox](/Documentation/ApiReference/UI_Widgets/dxSelectBox/) UI component to filter the grid's **dataSource**. The *"All"* item calls the **clearFilter()** method and the other items call the **filter(filterExpr)** method.
