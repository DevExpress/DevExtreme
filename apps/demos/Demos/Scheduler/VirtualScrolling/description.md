With virtual scrolling, you can improve the overall performance of your application and reduce load times when our Scheduler component is bound to a large data set. When virtual scrolling is enabled, our Scheduler only renders visible appointments. When an appointment leaves the viewport, the Scheduler removes it from the DOM.

To enable virtual scrolling mode, set the [scrolling](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/scrolling).[mode](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/scrolling/#mode) property to *"virtual"*.

Virtual scrolling is available for all [views](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/) except *"agenda"*.
