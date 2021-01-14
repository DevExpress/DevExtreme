You can assign a lookup editor to a column. This editor displays a drop-down list populated with values from the specified data source. Users can filter the drop-down list to quickly locate required values. 

This demo shows how to implement cascading lookups:

1. **Configure the primary lookup**         
A column's lookup is configured in the [lookup](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/lookup/) object. Assign an array of items to the lookup's **dataSource**. Then specify the [valueExpr](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/lookup/#valueExpr) and [displayExpr](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/lookup/#displayExpr) properties if the data source contains objects. (See the `StateID` column.)

2. **Configure the secondary lookup**         
The secondary lookup has a similar configuration, but its [dataSource](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/lookup/#dataSource) should be a function so that you can dynamically filter the lookup. (See step 3.)

3. **Connect the lookups**         
To filter the secondary lookup's items based on the primary lookup's value, specify the [filter](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#filter) property in the secondary lookup's **dataSource**. (See the `CityID` column).

4. **Reset the secondary lookup when the primary lookup's value is changed**	    
Use the [setCellValue](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#setCellValue) function as shown in the `StateID` column's configuration.

5. **Disable the secondary lookup until the primary lookup's value is set**         
Use the [onEditorPreparing](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onEditorPreparing) handler for this.

After you configure lookups, enable edit operations. Specify the required **editing**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#mode) and set the [editing](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/) object's [allowUpdating](), [allowAdding](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#allowDeleting) properties to **true**.