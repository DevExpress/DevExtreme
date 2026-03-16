The DataGrid splits records into multiple pages. This technique helps optimize control performance: the client only needs to load and render one page at a time. Users can use a scroll bar or a pager to navigate between pages. This demo shows how to enable and customize the built-in pager.
<!--split-->

The built-in pager is configured in the [pager](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/) object and contains the following elements:

- **Page navigator**        
Enables page navigation.

- **Page size selector**        
Changes the page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showPageSizeSelector) property. You can also define the [allowedPageSizes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [pageSize](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/#pageSize) in the [paging](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/) object.

- **Page information**           
Displays the current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showInfo) property. You can also use the [infoText](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#infoText) property to customize the information text string.

The built-in pager supports full, compact, and adaptive (default) display modes. In compact mode, the pager changes the appearance of the page navigator and page selector to use screen space more efficiently. In adaptive mode, the pager automatically chooses between the full and compact modes based on the DataGrid's width. Use the [displayMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#displayMode) property to switch between modes.

In this demo, you can use the drop-down Display Mode menu to switch between full and compact display modes. You can also use the checkboxes to hide or display different pager elements. Note that when the pager is in compact mode, navigation buttons are always visible.

You can navigate between pages using the on-screen pager controls. Jump to the first/last row of each page by focusing on the data area and using **Ctrl+Home** or **Ctrl+End**. These shortcuts focus the first cell of the first row/last cell of the last row.

The DevExtreme DataGrid also supports external pagers. You can hide the built-in pager and configure a standalone [Pagination](/Documentation/Guide/UI_Components/Pagination/Overview/) component to control the DataGrid. For more information, refer to the following example: [DevExtreme DataGrid - Display a Pager Above the Grid](https://github.com/DevExpress-Examples/devextreme-datagrid-pager-on-top)