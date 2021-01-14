The **DataGrid** UI component can sort values by a single or multiple columns. Use the **sorting**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/sorting/#mode) property to specify the sorting mode:
- Single sorting mode. A user can click the column header to sort by this column and click it again to change the sort order (ascending or descending). An arrow icon in the column's header indicates the sort order.

- Multiple sorting mode. A user can hold the **Shift** key and click column headers in the order the user wants to apply sorting. To cancel a column's sorting settings, a user should hold the **Ctrl** key and click the column header.

A user can also apply or cancel sorting settings in the column header's context menu. To disallow a user to sort by a particular column, set the column's [allowSorting](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#allowSorting) property to **false**.

To specify the initial sorting settings, use the column's [sortOrder](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#sortOrder) and [sortIndex](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#sortIndex) properties. You can also use these properties to change sorting settings at runtime, as shown in this demo.