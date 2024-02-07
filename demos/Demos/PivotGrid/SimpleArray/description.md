The PivotGrid component can display data from an array of objects. Use the [dataSource](/Documentation/ApiReference/UI_Components/dxPivotGrid/Configuration/#dataSource) property to bind the PivotGrid to data. This property accepts a [PivotGridDataSource](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/) instance or its configuration object. Assign your array to the [store](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/store/) property of **PivotGridDataSource**.

To display data in the PivotGrid, assign an array to the [fields[]](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/) property. Each object in this array configures a single pivot grid field. Assign a field name to the [dataField](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#dataField) property to populate the pivot grid field with data.

You can distribute fields between four different areas: row, column, filter, and data. To specify the area, set the [area](/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/#area) property. Fields that do not belong to any area are displayed in the [field chooser](https://js.devexpress.com/Demos/WidgetsGallery/Demo/PivotGrid/IntegratedFieldChooser/).


For more information on fields and areas, refer to the following article: [Fields and Areas](/Documentation/Guide/UI_Components/PivotGrid/Fields_and_Areas/).
