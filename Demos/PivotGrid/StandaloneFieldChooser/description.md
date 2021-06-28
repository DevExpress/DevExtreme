DevExtreme also includes a standalone [PivotGridFieldChooser](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/) component with the [integrated](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/IntegratedFieldChooser/) field chooser. Unlike its integrated counterpart, the standalone field chooser can remain visible on the page at all times.

Follow the steps below to connect the PivotGridFieldChooser with the PivotGrid:

1. **Bind both components to the same data source**         
Assign the same [PivotGridDataSource](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/) instance to the [dataSource](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Configuration/#dataSource) property of both components.

1. *(Optional)* **Disable the integrated field chooser**            
Both field choosers can work simultaneously, but if you want to disable the integrated version, set the PivotGrid's [fieldChooser](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/).[enabled](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#enabled) property to **false**.

1. *(Optional)* **Apply field changes on demand**           
When users move fields within the field chooser, the changes are applied to the connected PivotGrid instantly. To change this behavior, set the [applyChangesMode](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Configuration/#applyChangesMode) to *"onDemand"*. In this mode, the changes are applied/canceled only when you call the [applyChanges()](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Methods/#applyChanges)/[cancelChanges()](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Methods/#cancelChanges) method or set a new [state](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Configuration/#state). You can add a UI for these methods. For example, in this demo, they are bound to the Apply and Cancel buttons. Select "onDemand" from the Apply Changes Mode drop-down menu to display these buttons.

The standalone and integrated field choosers share features. For example, both field choosers include three [layouts](/Documentation/ApiReference/UI_Components/dxPivotGridFieldChooser/Configuration/#layout). You can use the radio buttons to switch between field choosers and review the differences. For information about other available features, refer to the [Integrated Field Chooser](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/IntegratedFieldChooser/) demo.
