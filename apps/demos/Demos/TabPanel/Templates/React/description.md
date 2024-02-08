This demo illustrates the use of templates in TabPanel. If your data objects contain custom fields, you need to specify the [itemTitleRender](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTitleRender)/[itemTitleComponent](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTitleComponent) and [itemRender](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemRender)/[itemComponent](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemComponent) that define how to display the fields in tabs and views.

If you want each tab and view to have differently structured content, define individual renders. To do this, assign an array of objects to the **items[]** or **dataSource** property and specify the [tabRender](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#tabRender)/[tabComponent](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#tabComponent) and [render](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#render)/[component](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#component) properties in each object. This use case is illustrated in the following tutorial: [Getting Started with TabPanel](/Documentation/Guide/UI_Components/TabPanel/Getting_Started_with_TabPanel/).

Use the following properties to configure user navigation between tabs:

- [swipeEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#swipeEnabled)      
Defines whether to switch between views with a swipe gesture.

- [loop](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#loop)      
Specifies whether to loop views.

- [animationEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#animationEnabled)      
Specifies whether to animate transition between views.

You can switch the checkboxes below the TabPanel to change the **loop**, **animationEnabled**, and **swipeEnabled** property values.