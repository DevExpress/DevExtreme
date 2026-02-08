DevExtreme CardView allows you to validate user input as necessary. You can apply pre-defined [validation rules](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#validationRules) or custom rules to individual columns. 
<!--split-->

In this demo, the following rules are used:

- [required](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/RequiredRule/)    
Specifies that field values should not be empty. The `birthDate`, `hireDate`, `title`, `firstName`, and `lastName` fields use required rule.    
- [pattern](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/PatternRule/)    
Specifies a pattern that field values should match. The `mobilePhone` field uses pattern rule.    
- [email](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/EmailRule/)    
Specifies that field values match the Email pattern. The `email` field uses email rule.    
- [async](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/AsyncRule/)   
Specifies custom validation parameters that are used to validate a value on the server. The `email` field uses async rule.    
- [custom](/Documentation/ApiReference/UI_Components/dxValidator/Validation_Rules/CustomRule/)    
Specifies custom validation rules. This demo implements a custom rule to prevent users from setting `hireDate` earlier than `birthDate`.