This demo illustrates how to create a new appointment from a multi-cell selection. Click and drag across two or more time cells to select a range. The Scheduler opens the appointment popup pre-filled with the corresponding start date, end date, and resource group.

<!--split-->

The Scheduler fires the [onSelectionEnd](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onSelectionEnd) event when a user finishes a cell selection. The event's `selectedCellData` array contains one object per selected cell, each with `startDate`, `endDate`, `allDay`, and group field values.

The event handler in this demo ignores single-cell selections and calls [showAppointmentPopup](/Documentation/ApiReference/UI_Components/dxScheduler/Methods/#showAppointmentPopupappointmentData-createNewAppointment-appointmentElement) with a new appointment object built from the first and last cell in the selection.
