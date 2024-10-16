The DataGrid component can highlight the focused row. To enable this feature, set the [focusedRowEnabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#focusedRowEnabled) property to **true**.

To focus a row programmatically, specify the [focusedRowKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#focusedRowKey) property. The DataGrid automatically scrolls to the focused row if the [autoNavigateToFocusedRow](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#autoNavigateToFocusedRow) property is enabled. In the UI, users can click a row to focus it. The focused row is saved in the DataGrid's [state](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/stateStoring/).

You can use the [onFocusedRowChanging](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onFocusedRowChanging) or [onFocusedRowChanged](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onFocusedRowChanged) property to specify a custom function that is executed before or after a row is focused.
<!--split-->

In this demo, the row with the `117` key is focused initially. You can specify the `focusedRowKey` and `autoNavigateToFocusedRow` properties via the input field and the checkbox below the DataGrid.