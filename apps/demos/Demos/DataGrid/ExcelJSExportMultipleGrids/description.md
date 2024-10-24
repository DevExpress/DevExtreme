The [exportDataGrid()](/Documentation/ApiReference/Common/Utils/excelExporter/#exportDataGridoptions) method allows users to export multiple grids to one Excel document. Grids are exported consequently in a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then" target="_blank">chain of Promises</a>. 

In this demo, this functionality is used to export two DataGrids into separate <a href="https://github.com/exceljs/exceljs#add-a-worksheet" target="_blank">worksheets</a> in the same <a href="https://github.com/exceljs/exceljs#create-a-workbook" target="_blank">workbook</a>. Starting position of each exported grid is set using the [topLeftCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/topLeftCell/) property.

Use the [customizeCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customizeCell) method to customize the exported worksheets.
<!--split-->