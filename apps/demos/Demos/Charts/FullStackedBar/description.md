This demo shows the _full-stacked bar_ series that allows you to visualize data as columns stacked over each other. This series type is useful when you compare an individual series' values with total values an argument aggregates. The height of each bar is the full height of the chart diagram. The series values are displayed as percentages of each bar.
<!--split-->

## Bind to Data

In this demo, series is bound to data directly. See the [Bind Series to Data](/Documentation/Guide/UI_Components/Chart/Data_Binding/Bind_Series_to_Data) article for information. The "country" field name is assigned to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object since the full-stacked bar chart contains series with the same argument field.

## Specify Common Series Settings

To configure settings for all series in the chart, use the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings) object. For example specify the [series type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#type).

## Customize Full Stacked Bar Chart

Use the [verticalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#verticalAlignment) and [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#horizontalAlignment) properties of the legend object to specify the legend position in the chart. You can specify the text's position relative to the marker in a legend item in the [itemTextPosition](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#itemTextPosition) property.

To configure tooltips in the chart, use the [tooltip](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/) object. To enable the tooltips, assign **true** to the [enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/#enabled) property of this object. If you want to customize a specific tooltip, assign a function to the [customizeTooltip](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/#customizeTooltip) property. In this demo, the function returns the tooltip's text that shows the point's percent value and absolute value.

To allow a user to export your full-stacked bar chart into the PNG, JPEG, and SVG file or print the chart, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. In this demo, the exporting is enabled and you can click the "Exporting/Printing" button in the chart. This button invokes a drop-down menu with export and print commands.