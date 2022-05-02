The [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid/) allows you to export its contents to a PDF document. 

To enable PDF export operations, import the <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a> library and set the **export**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#enabled) property to **true**.

Call the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method that belongs to the [pdfExporter](/Documentation/ApiReference/Common/Utils/pdfExporter/) module. Specify at least two required properties:

- [jsPDFDocument](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#jsPDFDocument)    
Specifies the <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a> instance.

- [component](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#component)    
Specifies the DataGrid's instance.

To review implementation details, see the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method call in [onExporting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onExporting) handler. You can also set [allowExportSelectedData](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#allowExportSelectedData) to **true** to export only selected rows.