The doughnut chart is a variation of the pie chart. It displays data as a circle divided into portions (slices) with a space in the center. To create a doughnut chart, use the DevExtreme [PieChart](/Documentation/ApiReference/UI_Components/dxPieChart/) component. In this demo, you can see how to initialize and configure it.

## Bind to Data

You can bind the component to one of the following data sources: 

* [Local Array](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Local_Array/)
* [JSON Data](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Read-Only_Data_in_JSON_Format/)
* [OData Service](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/OData/)
* [Custom Data Source](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/)

In this demo, the PieChart is populated with data taken from a local JavaScript array.

## Configure Series

A series defines the look of your chart. The PieChart component includes the Pie and Doughnut series types. To use the Doughnut type, set the [type](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#type) property to "doughnut". 

You need to bind the series to data. Set the [argumentField](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#argumentField) and [valueField](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#valueField) properties to data fields that contain arguments and values for your series. You can specify these properties in an object in the [series](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/) array or include it in the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/commonSeriesSettings/) object. In the latter case, your setting applies to all chart series.

Series points can have labels that display point values. Use the [label](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/) object to configure them. Enable the [label.visible](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/#visible) property to show the labels. If you want to format values that labels display, specify the [label.format](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/#format) property. You can also connect labels with their series points. To do this, enable the [label.connector.visible](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/label/connector/) property. As with the **argumentField** and **valueField** properties, you can specify label settings for an individual series (in the **series** array) or for all series (in the **commonSeriesSettings** object).

## Enable Tooltips

When you hover the mouse pointer over a series point or its label, you can see a tooltip with information about the series point. 

To configure a tooltip, you need to specify its properties in the [tooltip](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/tooltip/) object. For example, to enable tooltips, assign *true* to the [enabled](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/tooltip/#enabled) property of this object.

A tooltip displays information stored in the point value. If you want to customize a specific tooltip, assign a function to the [tooltip.customizeTooltip](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/tooltip/#customizeTooltip) property.

You can also specify the format of the tooltip values to be displayed. To do this, assign the format you need to the [tooltip.format](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/tooltip/#format) property.

## Export Chart to Image

To allow a user to print the chart or export it to a PNG, JPEG, or SVG file, set the [export.enabled](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/export/#enabled) property to *true*. This setting adds a button that opens a drop-down menu with export and print commands. In this demo, you can find this button in the upper-right corner.

