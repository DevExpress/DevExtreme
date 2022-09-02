This demo shows how to implement a [default validation group](/Documentation/Guide/UI_Components/Common/UI_Widgets/Data_Validation/#Validate_Several_Editor_Values/Group_the_Editors) - a group of editors on a page with enabled data validation. In this particular demo, the editors are grouped in an HTML form.

To enable data validation for an editor, you need to declare the [Validator](/Documentation/ApiReference/UI_Components/dxValidator/) component and implement [validation rules](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/). You can attach multiple validation rules to one component. The following list contains all available validation rule types:

- [required](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RequiredRule/)    
A validation rule that requires the validated field to have a value.

- [email](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/EmailRule/)    
A validation rule that requires the validated field to match the Email pattern.

- [async](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/AsyncRule/)    
A custom validation rule used for server-side validation. Implement the [validationCallback](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/AsyncRule/#validationCallback) function to validate the target value.

- [compare](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/CompareRule/)    
A validation rule that requires the validated editor's value to equal the value of the specified expression. To apply this rule, implement the [comparisonTarget](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/CompareRule/#comparisonTarget) function to specify the value against which this component compares the validated value.

- [pattern](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/PatternRule/)    
A validation rule that requires the validated field to match a specified [pattern](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/PatternRule/#pattern). 

- [stringLength](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/StringLengthRule/)   
A validation rule that requires the target value length to fall within the range of the specified [minimum](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/StringLengthRule/#min) and [maximum](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/StringLengthRule/#max) values. This property only accepts string values.

- [range](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RangeRule/)  
A validation rule that requires the target value length to fall within the range of the specified [minimum](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RangeRule/#min) and [maximum](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RangeRule/#max) values. This property only accepts date-time and numeric values.  

- [numeric](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/NumericRule/)    
A validation rule that requires the validated field to have a numeric value.

- [custom](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/CustomRule/)    
A rule with custom validation logic. Implement the [validationCallback](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/AsyncRule/#validationCallback) function to validate the target value.

All validation rule types allow you to specify an error [message](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RequiredRule/#message) for a component. If your application implements a validation group, you can use a [validation summary](/Documentation/ApiReference/UI_Components/dxValidationSummary/) to display all validation errors in one place. In this demo, click the **Register** button to see a validation summary.

The **Register** button's [useSubmitBehavior](/Documentation/ApiReference/UI_Components/dxButton/Configuration/#useSubmitBehavior) property is enabled. As a result, a click on the button validates and submits the HTML form. In your application, you can also implement the button's [onClick](/Documentation/ApiReference/UI_Components/dxButton/Configuration/#onClick) event handler and use the [validate()](/Documentation/ApiReference/UI_Components/dxValidationGroup/Methods/#validate) or [validateGroup()](/Documentation/ApiReference/Common/Utils/validationEngine/#validateGroup) method to validate a group of editors.