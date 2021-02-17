With virtual scrolling, you can improve the overall performance of your application and reduce load times when our Scheduler UI component is bound to a large data set. When virtual scrolling is enabled, our Scheduler only renders visible appointments. When an appointment leaves the viewport, the Scheduler removes it from the DOM. The data set in this demo contains 100 groups with 9 appointments each.

To enable virtual scrolling mode, set the [scrolling](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/scrolling).[mode](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/scrolling/#mode) property to *"virtual"*.

Virtual scrolling support is available in the following Scheduler [views](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/): *"day"*, *"week"*, and *"workWeek"*.
