You can use the [customizeCell](/Documentation/ApiReference/Common/Object_Structures/ExportPivotGridProps/#customizeCell) callback to modify cell data and formatting when you export the PivotGrid to an Excel file. You can access and change the following attributes:

- <a href="https://github.com/exceljs/exceljs#fonts" target="_blank">Font</a> options    
- <a href="https://github.com/exceljs/exceljs#fills" target="_blank">Cell background</a>     
- <a href="https://github.com/exceljs/exceljs#hyperlink-value" target="_blank">Cell values</a>       
- <a href="https://github.com/exceljs/exceljs#borders" target="_blank">Border</a> options        
- <a href="https://github.com/exceljs/exceljs#number-formats" target="_blank">Formatting</a> options    

The **customizeCell** function also allows you to identify cell area types. For example, this demo shows how to change the pattern and foreground color for cells in the *"T"* and *"GT"* [row](/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Pivot_Grid_Cell/#rowType) and [column](/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Pivot_Grid_Cell/#columnType) types. The font options are changed for the cells in the *"data"* [area](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#area).
