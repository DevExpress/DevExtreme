This demo shows the _side-by-side stacked bar_ series that allows you to visualize data as bars stacked in different groups. This series type is useful when you compare values of an individual series with the total values of groups.

## Bind Chart to Data

The side-by-side stacked bar chart contains series with the same argument field. In this demo, the data source array consists of the objects with the same field structure. Assign the `state` field to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the common argument for the series. Then, define the series array of objects. In each object, specify the [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) property and use the [stack](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#stack) property to group the series in stacks depending on the [stack](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#stack) property values. 

## Customize Side-By-Side Stacked Bar Chart

### Customize Chart Legend 

Use the [verticalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#verticalAlignment) and [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#horizontalAlignment) properties of the legend object to specify the legend layout. 

The [customizeLegend](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#customizeItems) function allows you to change the order, text, and visibility of legend items. This demo uses the [array.splice](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) method in the [customizeItems](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#customizeItems) function to sort the legend items. If you want to customize the legend border, use properties collected in the [border](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/border) object. 

To distribute all legend items between multiple columns (in a vertically-oriented legend) or rows (in a horizontally-oriented legend), specify the [columnCount](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#columnCount) or [rowCount](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#rowCount) property, respectively.

### Configure Tooltips

To configure tooltips in the chart, use the [tooltip](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/) object. To enable the tooltips, assign **true** to the [enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/#enabled) property of this object. 

### Export Chart

To allow users to export your side-by-side stacked bar chart into a PNG, JPEG, PDF, and SVG file or print the chart, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/export/#enabled) property to **true**. Since the export functionality is enabled in this demo, you can click the hamburger button in the chart to invoke a drop-down menu with export and print commands.
