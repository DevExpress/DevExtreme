You can use two approaches to print and export the Chart: call methods, or add a built-in button with drop-down options. The supported export formats are PNG, PDF, JPEG, SVG, and GIF.

## Use Methods to Export and Print Chart

Use the [exportTo(fileName, format)](/Documentation/ApiReference/UI_Components/dxChart/Methods/#exportTofileName_format) and [print()](/Documentation/ApiReference/UI_Components/dxChart/Methods/#print) methods to export and print the Chart. In this demo, two buttons below the chart implement the print and export functionality. A click on the "Print" button calls the Print dialog window, and a click on the "Export" button saves a file with the component to your local storage. You can specify the file name and format in the **exportTo(fileName, format)** method.

## Export and Print Chart with a Built-in Menu

To automatically create a button with export and print options, use the [export](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/) object and set its [enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. If you want to disable printing, set the [printingEnabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#printingEnabled) property to **false**. 

Set the [formats](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#formats) property to specify an array of available export formats. The [fileName](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#fileName) property allows you to specify the name of the exported file.

You can see how this approach works in the following demo: [JSON Data](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/AjaxRequest/jQuery/Light/).

## Handle Export Events

Use the following events to handle export:

* [onExporting](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#onExporting)   
Occurs before the Chart export.

* [onExported](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#onExported)   
Occurs after the Chart export.

[note]

Need to create printable documents simply? Try our .NET-based DevExpress Reports: they ship with an intuitive Visual Studio Report Designer, Web Report Designer for end-user ad-hoc reporting, and a rich set of report controls, including cross tabs and charts.

You can generate a variety of report types — from simple mail-merge, table, and vertical reports to master-detail (hierarchical) and cross-tab reports, print or export them to PDF, Excel, and other formats.

Develop using VS Code? Leverage the capabilities of a brand new VS Code Report Designer extension to create and edit reports/documents on any platform, be it Windows, macOS, or Linux.

[Get Started with DevExpress Reports](https://docs.devexpress.com/XtraReports/9814/web-reporting) | [Explore Demos](https://www.devexpress.com/Support/Demos/#reporting)

[/note]