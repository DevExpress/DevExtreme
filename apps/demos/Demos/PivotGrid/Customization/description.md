PivotGrid allows you to customize its layout.
<!--split-->

This demo illustrates the following properties:

- [rowHeaderLayout](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#rowHeaderLayout)            
Allows you to specify the layout type for row header items. The *"standard"* layout displays child items to the right of the parent items. Assign "*tree*" to this property to display items more densely as a hierarchical structure. 

- [showTotalsPrior](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#showTotalsPrior)        
Specifies whether totals precede or follow data rows and columns. This property does not affect [row totals](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#showRowTotals) when **rowHeaderLayout** is *"tree"*.

- [dataFieldArea](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#dataFieldArea)     
Specifies the [area](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#area) to which data headers belong: *"column"* or *"row"*. Data headers appear only when the pivot grid has more than one data field (`Sales` and `Percent` in this demo). 

Toggle the check boxes below the PivotGrid to change values of the **showTotalsPrior**, **dataFieldArea**, and **rowHeaderLayout** properties.
