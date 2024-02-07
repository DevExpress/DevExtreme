This demo illustrates the use of templates in TabPanel. If your data objects contain custom fields, you need to specify the [itemTitleTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTitleTemplate) and [itemTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#itemTemplate) that define how to display the fields in tabs and views.

If you want each tab and view to have differently structured content, define individual templates. To do this, assign an array of objects to the **items[]** or **dataSource** property and specify the [tabTemplate](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#tabTemplate) and [template](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/items/#template) properties in each object. This use case is illustrated in the following tutorial: [Getting Started with TabPanel](/Documentation/Guide/UI_Components/TabPanel/Getting_Started_with_TabPanel/).

Use the following properties to configure user navigation between tabs:

- [swipeEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#swipeEnabled)      
Defines whether to switch between views with a swipe gesture.

- [loop](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#loop)      
Specifies whether to loop views.

- [animationEnabled](/Documentation/ApiReference/UI_Components/dxTabPanel/Configuration/#animationEnabled)      
Specifies whether to animate transition between views.

You can switch the checkboxes below the TabPanel to change the **loop**, **animationEnabled**, and **swipeEnabled** property values.