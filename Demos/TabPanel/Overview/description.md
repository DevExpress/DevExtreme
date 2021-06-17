The [TabPanel](/Documentation/ApiReference/UI_Components/dxTabPanel/) UI component consists of [Tabs](/Documentation/ApiReference/UI_Components/dxTabs/) and [MultiView](/Documentation/ApiReference/UI_Components/dxMultiView/) components. The TabPanel automatically synchronizes the selected tab with the currently displayed view and vice versa.

### Generate Similar Tabs Based on a Data Source       

To generate similar tabs and views, bind the TabPanel to data. Use the [items[]](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/) or [dataSource](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#dataSource) property to do this. Both these properties can work with local arrays, but **dataSource** also accepts a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object. You can use this object if you need to process the local array or fetch the array from a remote data source. In this demo, the **dataSource** property is set to a local array.

Each object in the **items[]** or **dataSource** array can contain predefined fields, such as **title** or **icon** (see the [items[]](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/) section for the full list). The TabPanel automatically recognizes these fields and creates the default tab and view appearance based on them. However, if your data objects contain custom fields, you need to specify the [itemTitleTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTitleTemplate) and [itemTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTemplate) that define how to display the fields in tabs and views. This demo illustrates the latter use case.

### Create Individual Tabs

If you want each tab and view to have differently structured content, define individual templates. To do this, assign an array of objects to the **items[]** or **dataSource** property and specify the [tabTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#tabTemplate) and [template](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#template) properties in each object. This use case is illustrated in the following tutorial: [Getting Started with TabPanel](/Documentation/Guide/UI_Components/TabPanel/Getting_Started_with_TabPanel/).

### Switch Between Tabs

To switch between tabs programmatically, use the [selectedIndex](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#selectedIndex) property. It accepts the index of a tab in the **dataSource** or **items[]** array. The [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#onSelectionChanged) function allows you to perform the desired actions when the selected tab changes.

Use the following properties to configure user navigation between tabs:

- [swipeEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#swipeEnabled)      
Defines whether to switch between views with a swipe gesture.

- [loop](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#loop)      
Specifies whether to loop views.

- [animationEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#animationEnabled)      
Specifies whether to animate transition between views.

You can switch the checkboxes below the TabPanel to change the **loop**, **animationEnabled**, and **swipeEnabled** property values.
