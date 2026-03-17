The DevExtreme DataGrid supports data paging. The component can load rows in chunks to improve performance when working with large data sets. This demo allows you to navigate between pages using the DataGrid pager.

You can use controls below the DataGrid to change the pager display mode and toggle the visibility of individual pager elements. Note: in compact mode, navigation buttons are always visible.
<!--split-->

The built-in [pager](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/) contains the following elements:

- **Page navigator**        
Enables page navigation.

- **Page size selector**        
Changes the page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showPageSizeSelector) property. You can also define [allowed page sizes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [page size](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/#pageSize).

- **Page information**           
Displays the current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showInfo) property. You can customize this [information text](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#infoText) as needed.

The built-in pager supports full, compact, and adaptive (default) [display modes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#displayMode). In compact mode, the pager uses less screen space. In adaptive mode, the DataGrid automatically chooses between full and compact modes based on the component width.

The DevExtreme DataGrid also supports external pagers. You can hide the built-in pager and configure a standalone [Pagination](/Documentation/Guide/UI_Components/Pagination/Overview/) component to navigate the DataGrid. For additional information, refer to the following example: [DevExtreme DataGrid - Display a Pager Above the Grid](https://github.com/DevExpress-Examples/devextreme-datagrid-pager-on-top).