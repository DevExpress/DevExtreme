The DataGrid can calculate custom summaries on the client or server side. In this demo, we have implemented client-side logic. The instructions below explain how to do this in your code:

1. Make sure that the **remoteOperations**.[summary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/#summary), **remoteOperations**.[groupPaging](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/#groupPaging), or [remoteOperations](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/) property is not set or set to **false**.

1. Add a summary configuration object to the [summary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/).[groupItems](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/) or [summary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/).[totalItems](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/) array.

1. Set the object's [summaryType](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#summaryType) to *"custom"*.

1. Specify the summary's [name](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#name). It will be used to identify the summary item within the **calculateCustomSummary** function in the next step.

1. Calculate the resulting value in the [calculateCustomSummary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/#calculateCustomSummary) function. Implement the necessary calculation stages. See the function's description for details.

The custom summary in this example calculates the sum of sale amounts for selected rows. To recalculate the resulting value when selection is changed, the code calls the [refresh()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#refresh) method in the [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSelectionChanged) handler.

Client-side custom summaries are suitable for small datasets. If your tests show that client-side calculations result in noticeable lags, we recommend that you use [Server-Side Data Aggregation](/Documentation/Guide/UI_Components/DataGrid/Summaries/Custom_Aggregate_Function/#Server-Side_Data_Aggregation).
