To configure group summaries, populate the [summary](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/).[groupItems](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/) array with summary configuration objects. Each object should specify a [column](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#column) that supplies data for summary calculation and a [summaryType](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/totalItems/#summaryType)&mdash;an aggregate function that should be applied to this data.

### Position a Group Summary

Group summaries are displayed in parentheses after the group caption. You can reposition them as follows:

* Display a summary in a column          
You can align a summary to its corresponding column (see the Sale Amount and Total Amount columns). To do this, enable the [alignByColumn](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#alignByColumn) property. If you want to align a summary to a different column, specify the [showInColumn](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#showInColumn) property.

* Display Summary Values within Group Footers       
You can make a summary item display its values within group footers. To do this, enable the [showInGroupFooter](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#showInGroupFooter) property. Summary items will appear within their corresponding columns (see the Total Amount column). If you want to display summaries in another column, specify the [showInColumn](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#showInColumn) property.

### Format Summary Values
To format summary values, use the [valueFormat](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#valueFormat) property. This demo applies the *"currency"* format to summary values calculated against the Total Amount and Sale Amount columns. If you also want to add custom text to summary values, use the [displayFormat](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/summary/groupItems/#displayFormat) property. This demo sets this property for summaries of *"sum"* and *"count"* types.

### Sort Groups by Summary Values
This demo sorts groups by summary values (the number of orders). To do this, the code adds an object to the [sortByGroupSummaryInfo](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/sortByGroupSummaryInfo/) array. The object specifies the [summaryItem](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/sortByGroupSummaryInfo/#summaryItem) whose values are used to sort the group rows. 
