The TreeList component can highlight the focused row. To enable this feature, set the [focusedRowEnabled](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#focusedRowEnabled) property to **true**.
<!--split-->

To focus a row programmatically, specify the [focusedRowKey](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#focusedRowKey) property. The TreeList automatically scrolls to the focused row. You can set the [autoNavigateToFocusedRow](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#autoNavigateToFocusedRow) property to **false** to deactivate this behavior. In the UI, users can click a row to focus it. The focused row is saved in the TreeList's [state](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/stateStoring/).

You can use the [onFocusedRowChanging](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onFocusedRowChanging) and [onFocusedRowChanged](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onFocusedRowChanged) properties to specify a custom function that is executed before or after a row is focused.

In this demo, the row with the `45` key is focused initially. You can specify the `focusedRowKey` property via the input field below the TreeList. The **onFocusedRowChanged** function is used to display additional information below the component when the focused row changes.
