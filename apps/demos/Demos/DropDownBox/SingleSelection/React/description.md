DropDownBox is an advanced editor whose drop-down window can include other components.

DevExtreme ships with multiple other drop-down editors. To find out which editor best suits your task, review the following article: [How to Choose a Drop-Down Editor](/Documentation/Guide/UI_Components/Lookup/Choose_a_Drop-Down_Editor/).

To get started with the DevExtreme DropDownBox component, refer to the following step-by-step tutorial: [Getting Started with DropDownBox](/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/).
<!--split-->

The following instructions show how to synchronize the DropDownBox with any other embedded DevExtreme component:

1. **Specify data sources**    
The DropDownBox's and embedded component's data sources can be the same or different. If they are different, the embedded component's key field should be present in the DropDownBox's data source.        

2. **Specify which data field provides the DropDownBox's values and the embedded component's keys**       
Assign the field's name to the DropDownBox's [valueExpr](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#valueExpr) property and to the [key](/Documentation/ApiReference/Data_Layer/ArrayStore/Configuration/#key) property of the embedded component's store.

3. **Synchronize the DropDownBox's value and the embedded component's selection**                        
Bind the DropDownBox's [value](/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#value) and the embedded component's **selectedRowKeys**/**selectedItemKeys** property to the same variable. 