<a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> library allows you to customize worksheets outside the exported cell area. This demo uses this functionality to add a header (a title before exported data) and a footer (a note after exported data).

Review the [onExporting](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onExporting) handler to see the data export code. The functions that create header and footer sections utilize the following customization features:

- <a href="https://github.com/exceljs/exceljs#merged-cells" target="_blank">Merged cells</a>
- <a href="https://github.com/exceljs/exceljs#value-types" target="_blank">Cell values</a> formatting
- <a href="https://github.com/exceljs/exceljs#fonts" target="_blank">Font properties</a>
- Text <a href="https://github.com/exceljs/exceljs#alignment" target="_blank">alignment</a>
