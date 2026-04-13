The DevExtreme DataGrid ships with comprehensive data paging support and can load rows in chunks to improve performance when displaying large data sets. This demo allows you to navigate between pages using the DataGrid’s integrated pager.

You can use the controls below the DataGrid to change pager display mode and toggle visibility of individual pager elements. Note: navigation buttons are always visible in compact mode.
<!--split-->

The built-in Grid [pager](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/) contains the following UI elements:

- **Page navigator**        
Enables page navigation.

- **Page size selector**        
Changes page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showPageSizeSelector) property. You can also define [allowed page sizes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [page size](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/#pageSize).

- **Page information**           
Displays current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showInfo) property. You can customize this [information text](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#infoText) as needed.

The DevExtreme DataGrid’s built-in pager supports full, compact, and adaptive (default) [display modes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#displayMode). In compact mode, the pager uses less screen space. In adaptive mode, the DataGrid automatically selectes between full and compact modes based on the component width.

You can navigate between pages using the on-screen pager controls. Jump to the first/last row of each page by focusing on the data area and using **Ctrl+Home** or **Ctrl+End**. These shortcuts focus the first cell of the first row/last cell of the last row.