This demo illustrates how to use the [barPadding](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#barPadding) property to customize bar width.

## Bind to Data

In this demo, the data source array consists of objects with the same field structure. Assign the `state` field to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the common argument for the series. Then, define the series array of objects. In each object, specify the [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) property.

## Specify Common Series Settings

To configure settings for all series in the chart, use the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object. Specify the [barPadding](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#barPadding) property to control the padding and the width of all bars in a series.

## Customize Chart Legend 

Use the [verticalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#verticalAlignment) and [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#horizontalAlignment) properties of the legend object to specify the legend layout. 

## Export Chart

To allow users to export your bar chart into a PNG, JPEG, PDF, or SVG file, or print the chart, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. Since the export functionality is enabled in this demo, you can click the hamburger button in the chart to invoke a drop-down menu with export and print commands.