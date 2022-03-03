Our [DataGrid](/Documentation/ApiReference/UI_Components/dxDataGrid/) allows you to easily and accurately export its contents to a PDF document. To enable PDF export operations, you must reference or import the following:

- <a href="https://github.com/parallax/jsPDF" target="_blank">jsPDF</a>        
A library that creates and manages PDF documents.

Once you have referenced/imported all required resources, call the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/pdfExporter/#exportDataGridoptions) method that belongs to the [pdfExporter](/Documentation/ApiReference/Common/Utils/pdfExporter/) module to export DataGrid content to a PDF document.

In this demo, the **exportDataGrid(options)** method is called when you click the Export to PDF button. Review the export code in the button's [onClick](/Documentation/ApiReference/UI_Components/dxButton/Configuration/#onClick) handler to learn more.
