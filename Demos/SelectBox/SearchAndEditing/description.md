Set the [searchEnabled](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#searchEnabled) property to **true** to allow users to search. The following properties help you configure the feature:

- [searchExpr](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#searchExpr)   
Specifies one or several data fields to search.
- [searchMode](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#searchMode)    
Specifies whether found items should contain the typed-in string or start with it.
- [searchTimeout](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#searchTimeout)      
Specifies the delay between the moment a user stops typing and the moment the search is executed.    
- [minSearchLength](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#minSearchLength)      
Specifies the minimum number of characters that a user should type in to trigger the search.
- [showDataBeforeSearch](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#showDataBeforeSearch)        
Specifies whether the UI component should display the unfiltered item list until a user have typed in the minimum number of characters (**minSearchLength**).

Set the [acceptCustomValue](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#acceptCustomValue) property to **true** to allow users to add values to the **SelectBox**. You should also implement the [onCustomItemCreating](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#onCustomItemCreating) handler to create new data source entries.