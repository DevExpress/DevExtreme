The DevExtreme Scheduler displays a toolbar that can be customized. You can populate the toolbar with predefined and custom items in any order. This demo implements an example of toolbar customization.
<!--split-->

To customize the toolbar, add items to the [toolbar](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/).[items[]](/Documentation/25_1/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/) array. The Scheduler supports the following types of toolbar items:

- **Predefined Controls**    
    * "dateNavigator"    
    Displays a [ButtonGroup](/Documentation/Guide/UI_Components/ButtonGroup/Getting_Started_with_ButtonGroup/) component with next/previous buttons and a date interval button that invokes a dropdown calendar. Define [options](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#options).**items** to customize the control. You can add new buttons, and specify button availability and order.
    * "viewSwitcher"    
    Switches between view types (day, week, month, and others).
    * "today"    
    A "Today" button that navigates to the current date.

- **DevExtreme Components**    
You can configure a DevExtreme component within a toolbar item element. In this demo, we extended the toolbar with a [Button](/Documentation/Guide/UI_Components/Button/Overview/) and [SelectBox](/Documentation/Guide/UI_Components/SelectBox/Overview/).

- **Custom Controls**    
Specify **items[]**.[render](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#render) or [component](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#component) to implement custom controls.

The default Scheduler toolbar displays "dateNavigator" and "viewSwitcher" predefined controls. This demo adds the "today" predefined control and two DevExtreme components to the toolbar.
