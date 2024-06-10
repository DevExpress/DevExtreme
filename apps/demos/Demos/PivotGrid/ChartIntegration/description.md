PivotGrid allows you to integrate the [Chart](/Documentation/ApiReference/UI_Components/dxChart/) component to visualize data. The Chart is synchronized with the PivotGrid and visualizes the currently displayed total summary values. Expand a row or column header in the PivotGrid below to see how it works.
<!--split-->

## Bind the Chart to the PivotGrid

To bind these two components, create a Chart and pass its instance as the first argument to the PivotGrid's [bindChart(chart, integrationOptions)](/Documentation/ApiReference/UI_Components/dxPivotGrid/Methods/#bindChartchart_integrationOptions) method. You can call this method at any point in your application. In this demo, we call it after view is initialized / component is mounted.

If you specify only the first argument and omit **integrationOptions**, default settings are in effect: row and column field values constitute chart [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) and [arguments](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/), respectively. The Chart displays values of each data field on a separate [value axis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/). If you need to customize the resulting chart, specify the **integrationOptions** argument.  

## Convert PivotGrid Fields to Chart Series

You can use the following **integrationOptions** to specify how PivotGrid fields should be converted to chart series:

- **putDataFieldsInto**: *"series"* | *"args"*     

    - *"series"* - Data fields constitute chart series.
    - *"args"* - Data fields constitute chart arguments.  

- **alternateDataFields**: Boolean       
Specifies whether to alternate data fields in the resulting chart. This demo sets this field to **false**.

- **dataFieldsDisplayMode**: *"singleAxis"* | *"splitAxes"* | *"splitPanes"*     

    - *"singleAxis"* - All data field values are displayed on a single [value axis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/).  
    - *"splitAxes"* - Each data field has an individual value axis. Applies only if **putDataFieldsInto** is *"series"*.
    - *"splitPanes"* - Each data field has an individual [pane](/Documentation/ApiReference/UI_Components/dxChart/Configuration/panes/). Applies only if **putDataFieldsInto** is *"series"*.

    **dataFieldsDisplayMode** applies only if the PivotGrid contains several [data fields](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/). In this demo, the **dataFieldsDisplayMode** field is set to *"splitPanes"*.

- **inverted**: Boolean      
If **false**, [row field](/Documentation/Guide/UI_Components/PivotGrid/Visual_Elements/#Headers) values constitute [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) and [column field](/Documentation/Guide/UI_Components/PivotGrid/Visual_Elements/#Headers) values form the [chart arguments](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/). If **true** - vice versa.

## Advanced Customization

The **integrationOptions** object can also contain the following functions that allow you to process PivotGrid data before visualization and customize the Chart and its series:

- **processCell**       
Processes a PivotGrid cell's data before the Chart displays it.

- **customizeChart**        
Allows you to customize the Chart's appearance.

- **customizeSeries**       
Allows you to customize the Chart's series.

Refer to the [bindChart(chart, integrationOptions)](/Documentation/ApiReference/UI_Components/dxPivotGrid/Methods/#bindChartchart_integrationOptions) method description for more information on these functions.
