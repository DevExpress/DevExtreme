Our PivotGrid allows you to easily and accurately export its contents to Microsoft Excel. To enable export operations, you must reference or import <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> and <a href="https://github.com/eligrey/FileSaver.js/" target="_blank">FileSaver</a> libraries. You must also set **export**.[enabled](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/export/#enabled) to **true**.

Once you’ve referenced/imported both files and set **export**.**enabled** to true, use the [exportPivotGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportPivotGridoptions) method to export **PivotGrid** content to an Excel <a href="https://github.com/exceljs/exceljs#create-a-workbook" target="_blank">workbook</a>.


Please review the [onExporting](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onExporting) handler and its data export code to learn more. In this example, **PivotGrid** content is exported as is to a single <a href="https://github.com/exceljs/exceljs#add-a-worksheet" target="_blank">worksheet</a>.
