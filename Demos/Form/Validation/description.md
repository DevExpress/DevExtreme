This demo shows how to validate Form editors. To apply validation rules to an editor, declare them in the [validationRules[]](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/) array. Specify [type](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RequiredRule/#type) and other properties for each rule. 


The following validation rules are shown in this demo:  
- [RequiredRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RequiredRule/)  
Requires that a validated editor has a value.

- [CompareRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/CompareRule/)    
Compares the editor's value to the specified expression.

- [PatternRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/PatternRule/)    
Checks whether an editor value matches a specified pattern.

- [RangeRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RangeRule/)    
Checks whether an editor value is in a specified range.

- [StringLengthRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/StringLengthRule/)  
Requires that an editor value length is in a specified range.

- [EmailRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/EmailRule/)    
Requires that an editor value matches the Email pattern.

- [AsyncRule](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/AsyncRule/)    
Allows you to add custom server-side validation logic. Rules of this type run last, only if all other rules passed. In this demo, an AsyncRule checks whether user input matches `test@dx-email.com`.

To submit form data, do the following:

1. Wrap the Form component in the HTML `<form>` element.

1. Use the [Button Form Item](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/ButtonItem/) to add a button to the form. This button submits the form data.

1. Enable the button's [useSubmitBehavior](/Documentation/ApiReference/UI_Components/dxButton/Configuration/#useSubmitBehavior) property.

When users click the button, the Form validates all editors that belong to the same [validationGroup](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#validationGroup) as this button. In this demo, all these editors belong to the `customerData` group. Form data can be submitted to a server only if input validation is successful. Enable the [showValidationSummary](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#showValidationSummary) property to display all validation errors at the bottom of the Form.
