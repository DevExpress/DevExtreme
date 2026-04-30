This demo creates a new appointment from a multi-cell selection. Click and drag across two or more time cells to select a range. The Scheduler opens the appointment popup pre-filled with the corresponding start date, end date, and resource group.

<!--split-->

The Scheduler raises the [onSelectionEnd](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onSelectionEnd) event when a user finishes selecting cells. The event's `selectedCellData` array contains one object per selected cell, each with `startDate`, `endDate`, `allDay`, and group field values.

In this demo, the event handler ignores single-cell selection and passes a new appointment object built from the first and last cell in the selection to the [showAppointmentPopup](/Documentation/ApiReference/UI_Components/dxScheduler/Methods/#showAppointmentPopupappointmentData-createNewAppointment-appointmentElement) method.
