The **DropDownBox** widget is an editor that consists of a text field and drop-down content. In this demo, the content is the **TreeView** and the **DataGrid** widgets in the single selection mode. 

The following instructions show how to synchronize the **DropDownBox** widget with any other embedded DevExtreme widget:

1. **Specify data sources**    
The **DropDownBox**'s and embedded widget's data sources can be the same or different. If they are different, the widget's key field should be present in the **DropDownBox**'s data source.        

2. **Specify which data field provides the DropDownBox's values and the embedded widget's keys**       
Assign the field's name to the **DropDownBox**'s [valueExpr](/Documentation/ApiReference/UI_Widgets/dxDropDownBox/Configuration/#valueExpr) option and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) option of the embedded widget's store.

3. **Synchronize the DropDownBox's value and the embedded widget's selection**

    1.  Select data items according to the **DropDownBox**'s initial value. To do this, assign the value to the embedded widget's **selectedRowKeys**/**selectedItemKeys** option (see the example with the **DataGrid** below). If the widget does not have such options, implement the **onContentReady** handler (the example with the **TreeView**).
    2.  Implement the **DropDownBox**'s [onValueChanged](/Documentation/ApiReference/UI_Widgets/dxDropDownBox/Configuration/#onValueChanged) handler to update the selection when the value changes.
    3.  Implement the embedded widget's **onSelectionChanged** handler to update the **DropDownBox**'s value when the selection changes.
