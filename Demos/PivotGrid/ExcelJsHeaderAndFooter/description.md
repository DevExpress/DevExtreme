The PivotGrid allows you to customize a header and a footer in the exported Excel file. The <a href="https://github.com/exceljs/exceljs" target="_blank">ExcelJS</a> library allows you to customize worksheets outside of exported cell regions. This, in turns, allows you to add a header (a title before exported data) and a footer (a note after exported data). Follow the steps below to configure a header/footer:

1. Set the [export](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/export/).[enabled](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/export/#enabled) property to `true`.

2. In the [onExporting](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onExporting) event handler, call the [exportPivotGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportPivotGridoptions) method.

3. Enable one or multiple options to export headers of the fields in the [field panel](/Documentation/Guide/UI_Components/PivotGrid/Visual_Elements/#Field_Panel):

    - [exportColumnFieldHeaders](/Documentation/ApiReference/Common/Object_Structures/ExcelExportPivotGridProps/#exportColumnFieldHeaders)

    - [exportDataFieldHeaders](/Documentation/ApiReference/Common/Object_Structures/ExcelExportPivotGridProps/#exportColumnFieldHeaders)

    - [exportFilterFieldHeaders](/Documentation/ApiReference/Common/Object_Structures/ExcelExportPivotGridProps/#exportColumnFieldHeaders)

    - [exportRowFieldHeaders](/Documentation/ApiReference/Common/Object_Structures/ExcelExportPivotGridProps/#exportColumnFieldHeaders)

4. Execute a promise after the [exportPivotGrid(options)](/Documentation/ApiReference/Common/Utils/excelExporter/#exportPivotGridoptions) method. In this promise, specify the position, appearance, and content of the header/footer. The functions used to generate header and footer sections utilize the following PivotGrid customization features:

    - <a href="https://github.com/exceljs/exceljs#merged-cells" target="_blank">Merged cells</a>

    - <a href="https://github.com/exceljs/exceljs#value-types" target="_blank">Cell values</a> formatting

    - <a href="https://github.com/exceljs/exceljs#fonts" target="_blank">Font properties</a>

    - Text <a href="https://github.com/exceljs/exceljs#alignment" target="_blank">alignment</a>