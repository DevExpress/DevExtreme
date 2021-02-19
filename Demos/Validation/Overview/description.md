DevExtreme Data Editors provide a&nbsp;powerful and seamless way to&nbsp;perform data validation. In&nbsp;this demo, editors are collected in&nbsp;an&nbsp;HTML&nbsp;form. Each editor is&nbsp;accompanied by&nbsp;the Validator component validating the editor against a&nbsp;set of&nbsp;specified rules. Editors are validated each time their value is&nbsp;changed. All validation errors are displayed in&nbsp;the ValidationSummary component.



In&nbsp;the ASP.NET MVC&nbsp;demo, editors extract validation rules from data annotations attributed to&nbsp;the fields of&nbsp;the model (see the _EditorsViewModel.cs_ file).



Note that the _&laquo;Register&raquo;_ button here does not implement a&nbsp;usual **onClick** event handler. Instead, it&nbsp;has the **useSubmitBehavior** property set to _true_. This setting tells the button to&nbsp;validate and submit the HTML form in&nbsp;which it&nbsp;is&nbsp;nested, with no&nbsp;further configuration required.