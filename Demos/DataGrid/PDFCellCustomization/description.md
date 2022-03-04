The [customizeCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customizeCell) function allows you to modify your PDF cell appearence. You can access and change the following attributes:

- gridCell. A DataGrid cell
- pdfCell. An exporting PDF cell

The [customDrawCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customizeCell) function allows you to draw any custom content in the cell. This function accepts the object with following fields:

- doc. Instance of the [jsPDFDocument](/api-reference/50%20Common/Object%20Structures/PdfExportDataGridProps/jsPDFDocument.md '/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#jsPDFDocument') used for exporting.
- rect. Object containing information about location of the cell and it's dimensions.
- gridCell. A DataGrid cell
- pdfCell. An exporting PDF cell
- cancel. Allows you to prevent default drawing logic.

For example, this demo changes the background color and font weight for cells with the "group" [rowType](/Documentation/ApiReference/UI_Components/dxDataGrid/Row/#rowType).
