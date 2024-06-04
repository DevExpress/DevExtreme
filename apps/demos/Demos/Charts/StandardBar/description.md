This demo shows the standard bar series type that visualizes data as a collection of bars. Follow the steps below to create and configure the Bar chart.
<!--split-->

## Bind to Data

You can bind the Bar chart to one of the following data sources: 

* [Simple Array](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Local_Array/)
* [JSON Data](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Read-Only_Data_in_JSON_Format/)
* [OData Service](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/OData/)
* [Custom Sources](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/)

In this demo, the Bar chart is populated with data taken from a simple JavaScript array.

## Configure Series

Assign one or several series to the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) property and specify the following settings:

- The series [type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#type)

- Data source fields. Assign an appropriate field name to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#argumentField) and [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) properties if you want to bind a series to data directly.  Alternatively, you can [use a series template](/Documentation/Guide/UI_Components/Chart/Data_Binding/Bind_Series_to_Data/#Using_a_Series_Template) to bind series to data if a data source field contains names for series. 

- Optional. The [barWidth](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#barWidth) property to specify individual series' bar width. See the [Specify the Bar Width](/Documentation/Guide/UI_Components/Chart/Series_Types/Bar_Series/#Specify_the_Bar_Width) article for more information.

You can also use the [commonSeriesSettings](Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to configure all series in the Bar chart.

## Customize Bar Chart

You can show [point labels](/Documentation/Guide/UI_Components/Chart/Point_Labels/Overview/) to make the Bar chart more informative. 

To help a user identify a series among others on the chart legend, specify its [name](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#name).

If you want to change the default series color, use the [color](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#color) property. 
