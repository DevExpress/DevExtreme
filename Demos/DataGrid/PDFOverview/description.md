The [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid/) allows you to export its contents to a PDF document. 

To enable PDF export operations, import the <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a> library and set the **export**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#enabled) property to **true**.

Call the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method that belongs to the [pdfExporter](/Documentation/ApiReference/Common/Utils/pdfExporter/) module. Specify at least two required properties:

- [jsPDFDocument](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#jsPDFDocument)    
Specifies the <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a> instance.

- [component](/Documentation/ApiReference/Common/Object_Structures/PdfExportDataGridProps/#component)    
Specifies the DataGrid's instance.

To review implementation details, see the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method call in [onExporting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onExporting) handler. You can also set [allowExportSelectedData](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#allowExportSelectedData) to **true** to export only selected rows.

[note]

Need to create printable documents simply? Try our .NET-based DevExpress Reports: they ship with an intuitive Visual Studio Report Designer, Web Report Designer for end-user ad-hoc reporting, and a rich set of report controls, including cross tabs and charts.

You can generate a variety of report types — from simple mail-merge, table, and vertical reports to master-detail (hierarchical) and cross-tab reports, print or export them to PDF, Excel, and other formats.

Develop using VS Code? Leverage the capabilities of a brand new VS Code Report Designer extension to create and edit reports/documents on any platform, be it Windows, macOS, or Linux.

[Get Started with DevExpress Reports](https://docs.devexpress.com/XtraReports/9814/web-reporting) | [Explore Demos](https://www.devexpress.com/Support/Demos/#reporting)

[/note]