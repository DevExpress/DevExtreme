The **DropDownBox** widget is an editor that consists of a text field and drop-down content. In this demo, the content is the **TreeView** and the **DataGrid** widgets in the single selection mode. 

The following instructions show how to synchronize the **DropDownBox** widget with any other embedded DevExtreme widget:

1. **Specify data sources**    
The **DropDownBox**'s and embedded widget's data sources can be the same or different. If they are different, the widget's key field should be present in the **DropDownBox**'s data source.        

2. **Specify which data field provides the DropDownBox's values and the embedded widget's keys**       
Assign the field's name to the **DropDownBox**'s [valueExpr](/Documentation/ApiReference/UI_Widgets/dxDropDownBox/Configuration/#valueExpr) option and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) option of the embedded widget's store.

3. **Synchronize the DropDownBox's value and the embedded widget's selection**                        
Bind the **DropDownBox**'s [value](/Documentation/ApiReference/UI_Widgets/dxDropDownBox/Configuration/#value) and the widget's **selectedRowKeys**/**selectedItemKeys** option to the same variable. 