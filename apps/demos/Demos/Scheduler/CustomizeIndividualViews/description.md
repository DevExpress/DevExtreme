To customize a view, configure its settings in an object inside the [views[]](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views) array. You should specify the view's [type](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#type) and other properties to override global view settings.

This demo customizes two views - Week and Work Week - in the following manner: 

* Both views [group appointments](/Demos/WidgetsGallery/Demo/Scheduler/GroupOrientation/) by [resources](/Demos/WidgetsGallery/Demo/Scheduler/Resources/).
* Both views use the [dateCellTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#dateCellTemplate) to change the appearance of date cells.
* The Work Week view uses the [startDayHour](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#startDayHour) and [endDayHour](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#endDayHour) properties to set custom first and last hours on the time scale.

Day and Month views use default settings.
