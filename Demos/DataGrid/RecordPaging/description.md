The **DataGrid** splits records into multiple pages. This technique helps optimize control performance: the client only needs to load and render one page at a time. Users can use a scroll bar or a pager to navigate between pages. This demo shows how to enable and customize the pager.

The pager is configured in the [pager](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/) object and contains the following elements:

- **Page navigator**        
Enables page navigation.

- **Page size selector**        
Changes the page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#showPageSizeSelector) property. You can also define the [allowedPageSizes](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [pageSize](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/paging/#pageSize) in the [paging](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/paging/) object.

- **Page information**      
Displays the current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#showInfo) property. You can also use the [infoText](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#infoText) property to customize the information text string.
