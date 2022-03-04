The [exportDataGrid()](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method allows users to export multiple grids to one PDF document. Grids are exported consequently in a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then" target="_blank">chain of Promises</a>. 

In this demo, this functionality is used to export two DataGrids into separate pages in the same PDF document. In this demo we export different grids on separated pages. For this we use **jspdf**.<a href="https://raw.githack.com/parallax/jsPDF/master/docs/jsPDF.html#addPage" target="_blank">addPage()</a> method.

Use the [customizeCell](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#customizeCell) method to customize the exported appearance of grids.
