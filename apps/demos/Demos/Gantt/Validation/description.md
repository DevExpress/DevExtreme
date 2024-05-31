The DevExtreme JavaScript Gantt component allows you to validate relationships between tasks and handle errors. Set the [enableDependencyValidation](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/validation/#enableDependencyValidation) property to **true** to enable task validation.
<!--split-->

The Gantt supports the following dependency validation rules:

* Finish to Start (FS) - A successor task's start point should be equal or later than the preceding task's end point.
* Start to Start (SS) - A successor task's start point should be equal or later than the preceding task's start point.
* Finish to Finish (FF) - A successor task's end point should be equal or later than the preceding task's end point.
* Start to Finish (SF) - A successor task's end point should be equal or later than a preceding task's start point.

The Gantt also has the [autoUpdateParentTasks](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/validation/#autoUpdateParentTasks) property that enables validation for parent-child relationship:

* A parent task's duration equals a summary duration of its child tasks.
* A parent task and its first child starts at the same time.
* A parent task and its last child ends at the same time.
* A parent task's progress is a summary progress of its child tasks.

The Gantt processes changes in task values before they are saved to a database. The component displays a popup window with a list of available actions if an error can be handled in several ways.
