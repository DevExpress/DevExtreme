A header filter allows a user to filter field values by including or excluding them from the applied filter. Click a header filter icon in the field chooser or on the field panel to open a popup menu that displays all unique field values. To display header filter icons, enable the [allowFiltering](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#allowFiltering) property.

To configure a header filter, use the global [headerFilter](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/headerFilter/) object or a field's [headerFilter](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/headerFilter/) object. This demo specifies the following properties in the global **headerFilter** object:

- [allowSearch](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/headerFilter/#allowSearch)     
Allows users to search through field values.

- [showRelevantValues](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/headerFilter/#showRelevantValues)       
Specifies whether to show all field values or only those that satisfy the other applied filters.

- [width](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/headerFilter/#width) and [height](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/headerFilter/#height)     
Configures the popup menu size.

In this demo, a filter is applied to the Country field. This filter includes only the United Kingdom. The City field displays only cities in this country because the **showRelevantValues** property is **true**. If you clear the corresponding checkbox under the PivotGrid, the City field displays all cities, regardless of the other applied filters.
