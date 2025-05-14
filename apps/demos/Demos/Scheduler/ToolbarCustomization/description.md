DevExtreme Scheduler includes a toolbar that can display predefined and custom items. You can specify the order and the position of toolbar controls. This demo illustrates how to implement a custom toolbar.
<!--split-->

To display a custom toolbar, add desired items to the [toolbar](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/).[items[]](/Documentation/25_1/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/) array. Scheduler supports the following types of toolbar items:

- Predefined Controls    
    * dateNavigator    
    Features arrows and a date interval button for switching dates. You can customize the elements to display and their order within the date navigator. 
    * viewSwitcher    
    Switches between views like day, month, and week.
    * today    
    A "Today" button focusing the current date.

- DevExtreme Components    
Configure the desired DevExtreme component within a toolbar item element. In this demo, we extended the toolbar's item collection with a Button and a TagBox.

- Custom Controls
Specify **items[]**.[template](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/toolbar/items/#template) to implement custom controls.