Our [DataGrid](/Documentation/ApiReference/UI_Widgets/dxDataGrid/) allows you to easily and accurately export its contents to PDF. To enable the export operation, you must reference or import the following:

- <a href="https://github.com/MrRio/jsPDF" target="_blank">jsPDF</a>        
A library that exports grid data.
- <a href="https://github.com/simonbengtsson/jsPDF-AutoTable" target="_blank">jsPDF-AutoTable</a>        
A plugin that creates tables in exported files.

Once you have referenced/imported all the required resources, call the **DevExpress**.**pdfExporter**.**exportDataGrid(options)** method to export **DataGrid** content to PDF.

In this demo, the **exportDataGrid(options)** method is called when you click the Export to PDF button. Review the export code in the button's [onClick](/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#onClick) handler to learn more.
