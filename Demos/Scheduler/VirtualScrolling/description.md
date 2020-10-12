If a **Scheduler** is bound to a large data set, enable virtual scrolling to optimize the widget performance. In this mode, the widget renders only visible appointments. When an appointment leaves the viewport, the **Scheduler** removes it from the DOM. The data set in this demo contains 100 groups with 9 appointments each.

To enable virtual scrolling mode, set the [scrolling](/Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/scrolling).[mode](/Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/scrolling/#mode) option to *"virtual"* as it is shown in this demo.

Virtual scrolling is supported by the following [views](/Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/views/): *"day"*, *"week"*, and *"workWeek"*.
