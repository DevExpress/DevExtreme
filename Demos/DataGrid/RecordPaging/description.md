The DataGrid splits records into multiple pages. This technique helps optimize control performance: the client only needs to load and render one page at a time. Users can use a scroll bar or a pager to navigate between pages. This demo shows how to enable and customize the pager.

The pager is configured in the [pager](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/) object and contains the following elements:

- **Page navigator**        
Enables page navigation.

- **Page size selector**        
Changes the page size. To display this element, enable the [showPageSizeSelector](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showPageSizeSelector) property. You can also define the [allowedPageSizes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#allowedPageSizes) and specify the initial [pageSize](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/#pageSize) in the [paging](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/paging/) object.

- **Page information**           
Displays the current page number and total record count. To display page information, enable the [showInfo](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#showInfo) property. You can also use the [infoText](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#infoText) property to customize the information text string.

The pager supports three display modes: full, compact, and adaptive (default). In compact mode, the pager hides page information and changes the appearance of other elements to use screen space more efficiently. In adaptive mode, the pager automatically chooses between the full and compact modes based on the DataGrid's width. Use the [displayMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/pager/#displayMode) property to specify the mode.

In this demo, you can use the Display Mode drop-down menu to switch between the full and compact display modes. You can also use the checkboxes to control the visibility of different pager elements. Note that when the pager is in compact mode, you cannot show page information and hide navigation buttons because this mode doesn't support these changes.
