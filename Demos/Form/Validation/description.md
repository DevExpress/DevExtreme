This demo shows how to&nbsp;validate the [Form][0] editors. [Validation rules][1] are specified for each form item using the **validationRules** property. All editors on&nbsp;the form are combined into a&nbsp;validation group defined by&nbsp;the form&rsquo;s [validationGroup][2] property. 


Note that the _&laquo;Register&raquo;_ button here does not implement a&nbsp;usual [onClick][3] event handler. Instead, it&nbsp;has the [useSubmitBehavior][4] property set to _true_. This setting tells the button to&nbsp;validate and submit the HTML form in&nbsp;which it&nbsp;is&nbsp;nested, with no&nbsp;further configuration required.

[0]: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/
[1]: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidator/Validation_Rules/
[2]: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/Configuration/#validationGroup
[3]: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#onClick
[4]: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#useSubmitBehavior