This demo shows the standard _bar_ series type that displays rectangular bars side by side. The side by side bar series help you compare values across different categories. Follow the steps below to create and configure the bar chart.
<!--split-->

## Bind to Data

In this demo, series is bound to data directly. See the [Bind Series to Data](/Documentation/Guide/UI_Components/Chart/Data_Binding/Bind_Series_to_Data) article for information.   The "state" field name is assigned to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object since the bar chart contains series with the same argument field.

## Specify Common Series Settings

To configure settings for all series in the chart, use the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings) object.  

You can configure the following series settings:

- The [series type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#type)
- [Selection mode](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#selectionMode)
- [Hover mode](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#hoverMode)
- Change [point labels](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/label/)' [visibility](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/label/#visible) and [format](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/label/#format).

## Customize Side by Side Chart

Use the [verticalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#verticalAlignment) and [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#horizontalAlignment) properties of the legend object to specify the legend position in the chart. 

You can also handle a series point selection in the [pointClick](/Documentation/ApiReference/UI_Components/dxChart/Events/#pointClick) event. 

To allow a user to export your bar chart into the PNG, JPEG, and SVG file or print the chart, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. In this demo, the exporting is enabled and you can click the "Exporting/Printing" button in the side by side bar chart. This button invokes a drop-down menu with export and print commands.
