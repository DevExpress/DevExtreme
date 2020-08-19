You can use the [customizeCell](/Documentation/ApiReference/Common/Object_Structures/ExportPivotGridProps/#customizeCell) callback to modify cell data and formatting when you export PivotGrid to an Excel file. You can access and change the following attributes:    

The **PivotGrid** allows you to&nbsp;customize data when exporting it&nbsp;to&nbsp;an&nbsp;Excel file: adjust the font options, specify a&nbsp;cell&rsquo;s background, modify exported values or&nbsp;specify their alignment and formatting options.

- <a href="https://github.com/exceljs/exceljs#fonts" target="_blank">Font</a> options    
- <a href="https://github.com/exceljs/exceljs#fills" target="_blank">Cell background</a>     
- <a href="https://github.com/exceljs/exceljs#hyperlink-value" target="_blank">Cell values</a>       
- Text <a href="https://github.com/exceljs/exceljs#alignment" target="_blank">alignment</a>        
- <a href="https://github.com/exceljs/exceljs#number-formats" target="_blank">Formatting</a> options    

The **customizeCell** function also allows you to identify cell types. also allows you to identify cell area types. For example, this demo shows how to change the background color and font weight for cells that belong to the certain [areas](/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Configuration/#dataFieldArea).
