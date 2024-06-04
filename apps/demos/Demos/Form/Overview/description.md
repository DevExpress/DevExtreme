The Form component builds a data entry UI for an object assigned to the [formData](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#formData) property. The component displays and aligns label-editor pairs for each field in the bound object.
<!--split-->

You can use the editors on the right to modify the following properties:

- [labelMode](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#labelMode): *"outside"* | *"static"* | *"floating"* | *"hidden"*        
Specifies label display mode.

- [labelLocation](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#labelLocation): *"top"* | *"left"* | *"right"*         
Specifies whether to place outer labels above, to the left, or to the right of corresponding editors. The latter location is not demonstrated in this example.

- [colCount](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#colCount)  
Specifies the number of columns in the layout. To build an adaptive layout where the column count depends on the container width, set this property's value to *"auto"*.

- [minColWidth](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#minColWidth)    
Specifies the minimum column width. Use this property when the **colCount** property's value is *"auto"*.

- [width](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#width)    
Specifies the Form component's width.

- [readOnly](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#readOnly)  
Makes the Form editors read-only.

- [showColonAfterLabel](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#showColonAfterLabel)    
Specifies whether the Form displays a colon after a label. 

To get started with the DevExtreme Form component, refer to the following tutorial for step-by-step instructions: [Getting Started with Form](/Documentation/Guide/UI_Components/Form/Getting_Started_with_Form/).