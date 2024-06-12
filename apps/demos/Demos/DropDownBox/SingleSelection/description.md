DropDownBox is an advanced editor with a drop-down window that can embed other components. In this demo, TreeView and the DataGrid components in single selection mode are embedded into the drop-down window.

DevExtreme ships with multiple drop-down editors. To find out what editor is suitable for your task, review the following article: [How to Choose a Drop-Down Editor](/Documentation/Guide/UI_Components/Lookup/Choose_a_Drop-Down_Editor/).

To get started with the DevExtreme DropDownBox component, refer to the following step-by-step tutorial: [Getting Started with DropDownBox](/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/).
<!--split-->

The following instructions show how to synchronize the DropDownBox with an embedded DevExtreme component:

1. **Specify data sources**    
The DropDownBox and its embedded component can use the same or different data sources. If the data sources are different, you need to specify the embedded component's key field in the DropDownBox's data source. If the DropDownBox contains a DataGrid, bind the DataGrid to a store instead of a simple array (for example, an [ArrayStore](/Documentation/ApiReference/Data_Layer/ArrayStore/)).     

2. **Specify which data field contains the DropDownBox's values and the embedded component's keys**       
Assign the field's name to the DropDownBox's [valueExpr](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#valueExpr) property and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) property of the embedded component's store.

3. **Synchronize the DropDownBox's value and the embedded component's selection**

    1.  Assign DropDownBox's initial value to the embedded component's **selectedRowKeys**/**selectedItemKeys** property (see the example with the DataGrid below). If the embedded component does not have such properties, implement the **onContentReady** handler (the example with the TreeView).
    2.  Implement the DropDownBox's [onValueChanged](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onValueChanged) handler to update the selection when the value changes.
    3.  Implement the embedded component's **onSelectionChanged** handler to update the DropDownBox's value when the selection changes.
