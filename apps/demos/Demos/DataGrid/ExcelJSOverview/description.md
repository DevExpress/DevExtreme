To enable export in the DataGrid, reference or import the <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> and <a href="https://github.com/eligrey/FileSaver.js/" target="_blank">FileSaver</a> libraries. Set **export**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#enabled) to **true**. 

Once the conditions above are met, use the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportDataGridoptions) method to export the DataGrid to an Excel <a href="https://github.com/exceljs/exceljs#create-a-workbook" target="_blank">workbook</a>. 

Review the [onExporting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onExporting) handler to see the data export code. DataGrid is exported as is to a single <a href="https://github.com/exceljs/exceljs#add-a-worksheet" target="_blank">worksheet</a>. You can also set [allowExportSelectedData](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#allowExportSelectedData) to **true** to export only selected rows.

You can export DataGrid to CSV. Call the **exportDataGrid(options)** method as shown in the following ticket: <a href="https://supportcenter.devexpress.com/ticket/details/t920593/pivotgrid-exceljs-export-to-export-pivotgrid-into-csv-file" target="_blank">Export PivotGrid into CSV file</a>.

[note]

Need to create printable documents simply? Try our .NET-based DevExpress Reports: they ship with an intuitive Visual Studio Report Designer, Web Report Designer for end-user ad-hoc reporting, and a rich set of report controls, including cross tabs and charts.

You can generate a variety of report types — from simple mail-merge, table, and vertical reports to master-detail (hierarchical) and cross-tab reports, print or export them to PDF, Excel, and other formats.

Develop using VS Code? Leverage the capabilities of a brand new VS Code Report Designer extension to create and edit reports/documents on any platform, be it Windows, macOS, or Linux.

[Get Started with DevExpress Reports](https://docs.devexpress.com/XtraReports/9814/web-reporting) | [Explore Demos](https://www.devexpress.com/Support/Demos/#reporting)

[/note]