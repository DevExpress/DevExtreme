The field chooser allows users to manage pivot grid fields. You can configure the field chooser integrated into the PivotGrid or [use it as a standalone component](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/StandaloneFieldChooser/). This example demonstrates the integrated field chooser. To open the field chooser window, click the icon in the top-left corner or right-click a row or column header and select Show Field Chooser from the context menu.

### Enable the Integrated Field Chooser

The integrated field chooser is configured in the [fieldChooser](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/) object. To enable the field chooser, set the object's [enabled](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#enabled) property to **true**. This setting adds the Field Chooser icon to the PivotGrid and the Show Field Chooser command to the context menu.

### Organize Fields

The field chooser window displays five field sections:

- Row Fields
- Column Fields
- Data Fields
- Filter Fields
- All Fields

You can use the **fieldChooser**.[layout](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#layout) property to arrange the sections in different ways.

The All Fields section includes fields declared in the [fields[]](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/) array and auto-generated fields as shown in this demo. If you want to hide the auto-generated fields, disable the [dataSource](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#dataSource).[retrieveFields](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/#retrieveFields) property. You can also hide any particular field if you disable its [visible](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#visible) property.

You can enable hierarchical display in the All Fields section. Specify the same [displayFolder](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#displayFolder) for the fields that should be grouped together. In this demo, the hierarchy is built on the server. 

Users can drag and drop fields between the sections. When users move a field to the Row, Column, Data, or Filter Fields section, the PivotGrid adds this field to the corresponding area. To do the same programmatically, specify the field's [area](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#area) property. If a field is intended to be moved to the Data Fields section only, enable the field's [isMeasure](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#isMeasure) property, and vice versa: disable the **isMeasure** property for fields that should never be in the Data Fields section. In this demo, these restrictions are specified on the server.

After a user finishes moving fields between sections, the changes can either be applied immediately or after the user clicks OK. Use the **fieldChooser**.[applyChangesMode](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#applyChangesMode) property to set the desired mode. In this demo, you can change this property at runtime.

### Enable Search

Users can search in the All Fields section if you enable the **fieldChooser**.[allowSearch](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#allowSearch) property as shown in this demo. In addition, you can specify the [searchTimeout](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/fieldChooser/#searchTimeout) property to delay the search.
