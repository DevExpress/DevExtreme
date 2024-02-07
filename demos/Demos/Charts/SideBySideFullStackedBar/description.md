This demo shows the _side-by-side full-stacked bar_ series that visualizes data as bars stacked by groups. This series type is useful when you compare point values as a part of the total group value.

The value axis is continuous and displays a range between 0 and 100%. The component converts point values to a percentage, and the height of the resulting column is equal to 100%.

## Bind Chart to Data

The side-by-side full-stacked bar chart contains series with the same argument field. In this demo, the data source array consists of objects with the same field structure. Assign the `state` field to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the common argument for the series. Then, define the series array of objects. In each object, specify the [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) property and use the [stack](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#stack) property to group the series in stacks depending on the [stack](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#stack) property values. 

## Customize Side-By-Side Stacked Bar Chart

### Customize Chart Legend 

Use the [verticalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#verticalAlignment) and [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#horizontalAlignment) properties of the legend object to specify the legend layout. 

### Configure Tooltips

To configure tooltips in the chart, use the [tooltip](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/) object. To enable tooltips, assign **true** to the [enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/#enabled) property of this object. To customize a tooltip, assign a function to the [customizeTooltip](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/#customizeTooltip) property. In this demo, the function returns the tooltip's text that shows the point's percent value and absolute value.

### Export Chart

To allow users to export your side-by-side full-stacked bar chart into a PNG, JPEG, PDF, or SVG file, or print the chart, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. Since the export functionality is enabled in this demo, you can click the hamburger button in the chart to invoke a drop-down menu with export and print commands.