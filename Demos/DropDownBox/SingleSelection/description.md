The **DropDownBox** UI component is an editor that consists of a text field and drop-down content. In this demo, the content is the **TreeView** and the **DataGrid** in the single selection mode. 

The following instructions show how to synchronize the **DropDownBox** with any other embedded DevExtreme UI component:

1. **Specify data sources**    
The **DropDownBox**'s and embedded UI component's data sources can be the same or different. If they are different, the UI component's key field should be present in the **DropDownBox**'s data source.        

2. **Specify which data field provides the DropDownBox's values and the embedded UI component's keys**       
Assign the field's name to the **DropDownBox**'s [valueExpr](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#valueExpr) property and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) property of the embedded UI component's store.

3. **Synchronize the DropDownBox's value and the embedded UI component's selection**

    1.  Select data items according to the **DropDownBox**'s initial value. To do this, assign the value to the embedded UI component's **selectedRowKeys**/**selectedItemKeys** property (see the example with the **DataGrid** below). If the UI component does not have such properties, implement the **onContentReady** handler (the example with the **TreeView**).
    2.  Implement the **DropDownBox**'s [onValueChanged](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onValueChanged) handler to update the selection when the value changes.
    3.  Implement the embedded UI component's **onSelectionChanged** handler to update the **DropDownBox**'s value when the selection changes.
