To enable export in the DataGrid, reference or import the <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> and <a href="https://github.com/eligrey/FileSaver.js/" target="_blank">FileSaver</a> libraries. Set **export**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#enabled) to **true**. 

Once the conditions above are met, use the [exportDataGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportDataGridoptions) method to export the DataGrid to an Excel <a href="https://github.com/exceljs/exceljs#create-a-workbook" target="_blank">workbook</a>. 

Review the [onExporting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onExporting) handler to see the data export code. DataGrid is exported as is to a single <a href="https://github.com/exceljs/exceljs#add-a-worksheet" target="_blank">worksheet</a>. You can also set [allowExportSelectedData](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/export/#allowExportSelectedData) to **true** to export only selected rows.

You can export DataGrid to CSV. Implement the **exportDataGrid(options)** method as shown in the following ticket: <a href="https://supportcenter.devexpress.com/ticket/details/t920593/pivotgrid-exceljs-export-to-export-pivotgrid-into-csv-file" target="_blank">Export PivotGrid into CSV file</a>.
