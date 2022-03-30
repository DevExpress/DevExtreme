The [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid/) allows you to export its contents to a PDF document. 

To enable PDF export operations, import the <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a> library.

Call the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method that belongs to the [pdfExporter](/Documentation/ApiReference/Common/Utils/pdfExporter/) module. Specify at least two required properties:

- [jsPDFDocument](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#jsPDFDocument)    
Specifies the **jsPDF** instance.

- [component](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#component)    
Specifies the DataGrid's instance.


In this demo, click the **Export to PDF** button to initiate export. To review implementation details, see the **exportDataGrid(options)** method call in the button's **onClick** handler.