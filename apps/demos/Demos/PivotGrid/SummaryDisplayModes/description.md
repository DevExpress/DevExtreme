Summary display modes are post-processing functions that allow you to perform additional calculations on each summary value and take into account neighboring summary values. You can use summary display modes to present pivot data from different angles.
<!--split-->

## Apply a Summary Display Mode
DevExtreme PivotGrid supports predefined summary display modes decribed below. To apply one of them, set the [summaryDisplayMode](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#summaryDisplayMode) property. 

- *"absoluteVariation"*            
    Calculates the absolute difference between the current and previous value in a row. Starts from the second value in the row because the first does not have a previous value.

- *"percentVariation"*            
    Same as the absolute variation, but the difference is calculated as a percentage.

- *"percentOfColumnTotal"*            
    Calculates the current value as a percentage in one of the column's intermediate totals or the column's grand total when there are no expanded rows.

- *"percentOfRowTotal"*        
    Calculates the current value as a percentage in one of the row's intermediate totals or the row's grand total when there are no expanded columns.

- *"percentOfColumnGrandTotal"*        
    Calculates the current value as a percentage in the column's grand total.

- *"percentOfRowGrandTotal"*        
    Calculates the current value as a percentage in the row's grand total.

- *"percentOfGrandTotal"*        
    Calculates the current value as a percentage in the grand total of the entire pivot grid.

If the predefined modes do not suit your needs, you can implement a custom post-processing function&mdash;[calculateSummaryValue](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#calculateSummaryValue). Note that the PivotGrid ignores the **summaryDisplayMode** property if the **calculateSummaryValue** function is defined.

## Change the Summary Display Mode at Runtime
In this demo, you can switch between predefined summary display modes at runtime. Right-click or long-tap the Relative Sales field in the [field panel](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/FieldPanel) and select a mode from the invoked context menu.

To implement this functionality in your application, use the [onContextMenuPreparing](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onContextMenuPreparing) event handler. Within this handler, you should detect the right-clicked field. If it is a target field, change its **summaryDisplayMode** and optionally other properties, such as [caption](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#caption) or [format](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#format).