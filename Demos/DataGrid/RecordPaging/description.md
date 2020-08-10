The **DataGrid** automatically splits records across multiple pages. This optimizes performance as the **DataGrid** loads and renders only the records on the current page. Users can scroll the pages or navigate between them with the pager. This demo illustrates the second case.

The pager is configured in the [pager](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/) object and consists of the following elements:

- **Page navigator**        
Used to switch between pages.

- **Page size selector**        
Used to change the page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#showPageSizeSelector) option. You can also define the [allowedPageSizes](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [pageSize](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/paging/#pageSize) in the [paging](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/paging/) object.

- **Page information**      
Displays the current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#showInfo) option. You can also customize the [infoText](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/pager/#infoText).