The Tooltip component can display a tooltip for an element on the page. To bind the Tooltip to an element, use the [target](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/#target) property. 

## Show and Hide the Tooltip

To show and hide the Tooltip in response to certain events, specify the [showEvent](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/showEvent/) and [hideEvent](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/hideEvent/) properties. These properties can accept multiple events at once as well as an object.

To hide the Tooltip when a user clicks outside its borders, use the [hideOnOutsideClick](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/#hideOnOutsideClick) property.

## Customize and Animate the Tooltip

Assign the Tooltip's content in the HTML markup. Alternatively, you can use the [content template](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/#contentTemplate) to customize the Tooltip's content.

If you need to position the Tooltip at a certain side of the target element, specify the [position](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/#position) property.

To animate the Tooltip, declare the [animation](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/animation/) object. In this object, specify the [show](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/animation/#show) and [hide](/Documentation/ApiReference/UI_Components/dxTooltip/Configuration/animation/#hide) fields.

