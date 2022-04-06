DataGrid allows you to modify cell style settings and custom paint cells in a PDF document.

Use the [customizeCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customizeCell) function to customize the appearance settings of DataGrid cells in a PDF document. For example, you can change the text alignment and the background color of cells. The following function parameters are available:

- gridCell     
Contains information about the source DataGrid cell.
- pdfCell     
Contains settings applied to a cell in a PDF document.

In this demo, the **customizeCell** function changes the following elements:
- Background color and font weight of group row cells 
- Font style of a footer cell

The [customDrawCell](/Documentation/ApiReference/Common/Object_Structures/ExportDataGridProps/#customDrawCell) function allows you to draw cells in a PDF document. The following parameters are available when you use this function:

- doc    
An instance of the [jsPDFDocument](/api-reference/50%20Common/Object%20Structures/PdfExportDataGridProps/jsPDFDocument.md '/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#jsPDFDocument') object.
- rect    
A cell’s bounds.
- gridCell    
Contains information about the source DataGrid cell.   
- pdfCell    
Contains settings applied to a cell in a PDF document.
- cancel   
Set this parameter to **true** to prevent default painting logic.

This demo uses the **customDrawCell** function to paint cells in the "Website" column.
