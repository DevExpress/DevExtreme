Appointment drag and drop is enabled out-of-the-box, but only if appointments are moved within the **Scheduler**. In this demo, appointments can be moved between the **Scheduler**  and a list. Follow the steps below to implement this functionality:

1. **Configure the Scheduler**       
In the [appointmentDragging][0] object, implement the [onAdd][2] function (in which you should [add an appointment][1]) and the [onRemove][4] function (in which you should [delete an appointment][3] and create a corresponding list item).

2. **Configure list items**      
Attach an instance of the [Draggable][5] UI component to every list item. The UI component has the [data][6] option that can contain custom data. In this demo, it is an appointment's subject. Implement the [onDragStart][7] function in which you should pass the subject to the **Scheduler** where it is used to add new appointments.

3. **Configure the list**        
Attach another **Draggable** instance to the list which only serves as the drop target. Implement the **onDragStart** function to ensure the list cannot be dragged.

4. **Add the controls to the same group**            
To enable drag and drop operations between the controls, assign the same value to the [group][8] option of the **Scheduler**'s **appointmentDragging** object and both **Draggable** UI components. 

[0]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/appointmentDragging/
[1]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Methods/#addAppointmentappointment
[2]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/appointmentDragging/#onAdd
[3]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Methods/#deleteAppointmentappointment
[4]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/appointmentDragging/#onRemove
[5]: /Documentation/ApiReference/UI_Widgets/dxDraggable/
[6]: /Documentation/ApiReference/UI_Widgets/dxDraggable/Configuration/#data
[7]: /Documentation/ApiReference/UI_Widgets/dxDraggable/Configuration/#onDragStart
[8]: /Documentation/ApiReference/UI_Widgets/dxDraggable/Configuration/#group