The [TabPanel](/Documentation/ApiReference/UI_Components/dxTabPanel/) UI component includes both the [Tabs](/Documentation/ApiReference/UI_Components/dxTabs/) and [MultiView](/Documentation/ApiReference/UI_Components/dxMultiView/) components. The TabPanel automatically synchronizes the selected tab with the currently displayed view (and vice versa).

To get started with the DevExtreme TabPanel component, refer to the following step-by-step tutorial: [Getting Started with TabPanel](/Documentation/Guide/UI_Components/TabPanel/Getting_Started_with_TabPanel/).

## Generate Similar Tabs Based on a Data Source       

To generate similar tabs and views, bind the TabPanel to data (using the [items](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/) or [dataSource](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#dataSource) property). Both these properties can work with local arrays, but **dataSource** also accepts a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object. You can use this object if you need to process the local array or fetch the array from a remote data source. In this demo, the **dataSource** property is set to a local array.

Each object in the **items[]** or **dataSource** array can contain predefined fields, such as **title** or **icon** (see the [items[]](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/) section for the full list). The TabPanel automatically recognizes these fields and creates the default tab and view appearance based on them.

## Customize Tab Contents and Appearance

You can initialize tab contents (text, icons and badges) with values from underlying data objects.

Use the drop-down editors on the right to change tab [position](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#tabsPosition), [styling mode](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#stylingMode), and [icon position](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#iconPosition).