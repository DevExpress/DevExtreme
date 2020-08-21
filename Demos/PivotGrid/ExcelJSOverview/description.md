To enable export in the **PivotGrid**, reference or import the <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> and <a href="https://github.com/eligrey/FileSaver.js/" target="_blank">FileSaver</a> libraries. Set **export**.[enabled](/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Configuration/export/#enabled) to **true**. 

Once the conditions above are met, use the [exportPivotGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportPivotGridoptions) method to export the **PivotGrid** to an Excel <a href="https://github.com/exceljs/exceljs#create-a-workbook" target="_blank">workbook</a>.

Review the [onExporting](/Documentation/ApiReference/UI_Widgets/dxPivotGrid/Configuration/#onExporting) handler to see the data export code. **PivotGrid** is exported as is to a single <a href="https://github.com/exceljs/exceljs#add-a-worksheet" target="_blank">worksheet</a>.
