A field panel is an element that displays pivot grid fields involved in summary calculation. This panel consists of four field areas: column, row, data, and filter. Users can drag and drop fields between these areas, similar to the [field chooser](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/IntegratedFieldChooser). You can use the field panel and the field chooser simultaneously, as shown in this demo.

Enable the [fieldPanel](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/).[visible](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#visible) property to display the field panel. If you want to hide fields from specific areas, disable the corresponding properties in the **fieldPanel** object:

- [showColumnFields](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#showColumnFields)
- [showRowFields](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#showRowFields)
- [showDataFields](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#showDataFields)
- [showFilterFields](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#showFilterFields)

In this demo, you can click the checkboxes below the PivotGrid to enable or disable these properties.

If you do not want users to drag and drop fields, disable the **fieldPanel**.[allowFieldDragging](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldPanel/#allowFieldDragging) property. In this case, the users can only use the field chooser to reorganize the fields.

The field panel also allows users to sort and filter pivot grid fields. Click a field to change the sort order. Click a funnel icon to open the filter popup. To enable these features, set the [allowSorting](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#allowSorting) and [allowFiltering](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#allowFiltering) properties to **true**.

This demo also shows how to add custom commands to a field's context menu. For instance, right-click the Sales (Sum) field, and you will see three commands. Two of them (Hide field and Summary Type) are custom. Review the **onContextMenuPreparing** handler implemenation to see how these commands are added to the context menu. For more information, refer to the following help topic: [onContextMenuPreparing](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#onContextMenuPreparing).