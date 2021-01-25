The **DataGrid** allows users to group data against a single column or multiple columns.

To group data, users can drag and drop column headers onto and from the area above the grid. This area is called the [groupPanel](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/groupPanel/). Set its **visible** property to **true** to show it. 

Users can reorder headers within the **groupPanel** to change group hierarchy. To enable this functionality, set the [allowColumnReordering](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#allowColumnReordering) property to *"true"*. 

To group data against a single **column**, apply the [groupIndex](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#groupIndex) property to it. This property accepts a zero-based index number that controls the column order. In this example, the data is grouped against the *State* column.

You can also use the [grouping](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/grouping/) object to specify user interaction settings related to grouping. This demo illustrates the [autoExpandAll](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/grouping/#autoExpandAll) property that specifies whether the groups appear expanded.
