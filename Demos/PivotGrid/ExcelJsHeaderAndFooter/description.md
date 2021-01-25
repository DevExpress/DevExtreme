Our **PivotGrid** leverages the capabilities of the <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> JavaScript library. ExcelJS allows you to customize worksheets outside of exported cell regions. This demo uses this ExcelJS feature to add a header (a title before exported data) and a footer (a note after exported data).

Please review the [onExporting](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onExporting) handler and its data export code to learn more. The functions used to generate header and footer sections utilize the following **PivotGrid** customization features:

- <a href="https://github.com/exceljs/exceljs#merged-cells" target="_blank">Merged cells</a>
- <a href="https://github.com/exceljs/exceljs#value-types" target="_blank">Cell values</a> formatting
- <a href="https://github.com/exceljs/exceljs#fonts" target="_blank">Font properties</a>
- Text <a href="https://github.com/exceljs/exceljs#alignment" target="_blank">alignment</a>
