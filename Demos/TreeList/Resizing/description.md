The TreeList sets the same width for all columns, but you can change column widths as described below:

### Specify Custom Column Widths
You can set custom widths for all or individual columns. Individual settings override common settings. Use the following properties to specify the widths:

* [columnWidth](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#columnWidth) / **columns[]**.[width](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#width)               
Specify a width for all or individual columns.

* [columnMinWidth](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#columnMinWidth) / **columns[]**.[minWidth](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#minWidth)                        
Specify a minimum width for all or individual columns.

### Auto-Adjust Column Widths to Content
In this demo, columns adjust their widths to the content. To enable this feature, set the [columnAutoWidth](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#columnAutoWidth) property to **true**.

### Allow Users to Resize Columns
Users can resize columns if the [allowColumnResizing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#allowColumnResizing) property is enabled. When a user resizes a column, the TreeList's behavior depends on the [columnResizingMode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#columnResizingMode) property value:

* *"nextColumn"*           
The TreeList resizes the adjacent column; the total component width does not change.

* *"widget"*            
The total component width increases or decreases; all other columns maintain their widths.

Use the drop-down list below the TreeList to try both values.

If you do not want users to resize a specific column, disable its [allowResizing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#allowResizing) property.
