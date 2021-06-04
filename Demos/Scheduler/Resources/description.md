Users can categorize appointments by resources. The following example illustrates what resources are: in an educational center lectures are held in several rooms. In Scheduler terms, room is a resource kind, individual rooms are resource instances, and lectures are appointments that use these resource instances.


### Define Resource Kinds

Use the [resources](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/) array to define resource kinds. Each object in this array should contain at least the following fields:

- [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#dataSource)         
    Resource instances of this resource kind. Each instance should contain the `id`, `text`, and `color` fields. If your field names differ, specify them in the [valueExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#valueExpr), [displayExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#displayExpr), and [colorExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#colorExpr) properties, respectively.

- [fieldExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#fieldExpr)             
    A data field used to assign instances of this resource kind to appointments. Add this field to appointment objects and set the field values to `id` values of resource instances.

In this demo, the **resources** array contains three resource kinds: rooms, priorities, and assignees. Their **fieldExpr** values are `roomId`, `priorityId`, and `assigneeId`, respectively. Each appointment contains the same fields. Field values assign the appointments to different instances of these resource kinds.

### Color Appointments Based on a Resource Kind

To use the color scheme of a specific resource kind, enable the kind's [useColorAsDefault](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#useColorAsDefault) property. Otherwise, appointments use the color scheme of the last resource kind declared in the **resources** array.

This demo enables you to change the **useColorAsDefault** property at runtime. Click the radio buttons under the Scheduler to switch between different color schemes.

### Assign Multiple Instances of a Resource Kind

Each resource kind object can contain the [allowMultiple](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#allowMultiple) property. When this property is set to **true**, users can assign multiple instances of this kind to a single appointment. In this demo, the Assignee resource kind allows multiple instances.

You can also group appointments by resources as shown in the following demo: [Group Orientation](/Demos/WidgetsGallery/Demo/Scheduler/GroupOrientation/). 
