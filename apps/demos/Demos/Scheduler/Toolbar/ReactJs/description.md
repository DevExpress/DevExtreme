The DevExtreme Scheduler ships with a customizable toolbar UI element. You can populate the toolbar with predefined and custom items—in any display order. This demo adds the "today" predefined control and two DevExtreme components to the toolbar.
<!--split-->

To customize the Scheduler toolbar in your DevExtreme-powered app, add items to the [toolbar](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/).[items[]](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/) array. DevExtreme Scheduler supports the following toolbar item types:

- **Predefined Controls**    
    * "dateNavigator"    
    Displays a [ButtonGroup](/Documentation/Guide/UI_Components/ButtonGroup/Getting_Started_with_ButtonGroup/) component with next/previous buttons and a date interval button that invokes a dropdown calendar. Define [options](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#options).**items** to customize the control. You can add new buttons, and specify button availability/order.
    * "viewSwitcher"    
    Switches between view types (day, week, month, and others).
    * "today"    
    A "Today" button (navigates to the current date).

- **DevExtreme Components**    
You can configure a DevExtreme component within a toolbar item element. In this demo, we extended the toolbar with a [Button](/Documentation/Guide/UI_Components/Button/Overview/) and [SelectBox](/Documentation/Guide/UI_Components/SelectBox/Overview/).

- **Custom Controls**    
Specify **items[]**.[render](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#render) or [component](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#component) to implement custom controls.

The default Scheduler toolbar displays "dateNavigator" and "viewSwitcher" predefined controls.
