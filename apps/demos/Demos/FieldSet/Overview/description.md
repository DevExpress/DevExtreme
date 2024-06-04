DevExtreme ships with CSS classes that allow you to define the appearance of list-like structures that contain multiple field items -- field sets.

## A Simple Field Set

To create a basic field set, use the [dx-fieldset](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-fieldset) CSS class for the main container element. Then, use the [dx-fieldset-header](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-fieldset-header) class to specify the field set header. The header element can contain plain text, UI components, or custom markup. 

Create field set items as separate elements with the [dx-field](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-field) class. The field element can include label and value elements. To define the label element, use the [dx-field-label](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-field-label) class. The value element uses the [dx-field-value-static](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-field-value-static) class and can display plain text or custom markup. 

## A Field Set with DevExtreme Widgets

You can also use DevExtreme UI components as value elements. Specify the [dx-field-value](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-field-value) class in the component's HTML markup.

## A Field Set with Custom Value Width

To align all field set elements by width, attach a custom id to the element with the [dx-fieldset](/Documentation/ApiReference/UI_Components/CSS_Classes/#dx-fieldset) class and apply CSS rules according to the rules in the demo.