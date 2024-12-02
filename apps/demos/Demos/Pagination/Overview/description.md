Pagination is a UI component that allows users browse pages and adjust page size at runtime. This demo displays Pagination for navigating employee cards.

To set up Pagination, specify [itemCount](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#itemCount) to indicate the total item count. This step ensures proper functionality.
<!--split-->

Next, define page settings. Use the [pageSize](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#pageSize) property to specify the number of items per page. Configure available page sizes with the [allowedPageSizes](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#allowedPageSizes) property. Specify [pageIndex](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#pageIndex) to define the initial page display.

Pagination includes navigation buttons and a page information. Toggle the button display with [showNavigationButtons](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#showNavigationButtons) and page information with [showInfo](/Documentation/ApiReference/UI_Components/dxPagination/Configuration/#showInfo). 