The DropDownBox component is an editor that consists of a text field and drop-down content. In this demo, the content is the TreeView and the DataGrid in the single selection mode. 

The following instructions show how to synchronize the DropDownBox with any other embedded DevExtreme component:

1. **Specify data sources**    
The DropDownBox's and embedded component's data sources can be the same or different. If they are different, the embedded's key field should be present in the DropDownBox's data source.        

2. **Specify which data field provides the DropDownBox's values and the embedded component's keys**       
Assign the field's name to the DropDownBox's [valueExpr](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#valueExpr) property and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) property of the embedded component's store.

3. **Synchronize the DropDownBox's value and the embedded component's selection**                        
Bind the DropDownBox's [value](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#value) and the embedded's **selectedRowKeys**/**selectedItemKeys** property to the same variable. 