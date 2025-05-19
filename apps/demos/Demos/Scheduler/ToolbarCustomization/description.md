DevExtreme Scheduler can display a toolbar. You can populate the toolbar with predefined and custom items, in any order. This demo implements an example of toolbar customization.
<!--split-->

To customize the toolbar, add items to the [toolbar](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/).[items[]](/Documentation/25_1/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/) array. Scheduler supports the following types of toolbar items:

- Predefined Controls    
    * dateNavigator    
    Displays next/previous buttons and a date interval button that invokes a dropdown calendar. You can customize button availability and order. 
    * viewSwitcher    
    Switches between view types (day, week, month, and others).
    * today    
    A "Today" button that navigates to the current date.

- DevExtreme Components    
You can configure a DevExtreme component within a toolbar item element. In this demo, we extended the toolbar with a Button and SelectBox.

- Custom Controls
Specify **items[]**.[template](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#template) to implement custom controls.
