The Popover component shows pop-up notifications within a box with an arrow that points to a specified UI element. In this demo, you can hover the mouse pointer over one of the *details* labels or click the *more* link to display Popover.

## Attach Popover to a Page Element

Popover displays an arrow that points to a page element. To specify the element, set the [target](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#target) property to a CSS selector. In this demo, target elements are selected by `id`.

You can use the [position](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#position) property to position Popover relative to the target element. If you do not specify this property, Popover is displayed under the element.

## Show and Hide Popover

The [showEvent](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/showEvent/) and [hideEvent](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/hideEvent/) properties allow you to show and hide Popover in response to certain events. These properties can accept one or multiple names of DOM events or DevExtreme UI events separated by a space character.

You can also specify a delay before the events occur. Set the **showEvent** and **hideEvent** properties to an object with the [name](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/showEvent/#name) (one or multiple event names) and [delay](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/showEvent/#delay) properties.

In this demo, the last Popover appears when you click its target element because its **showEvent** property is set to the DevExtreme *dxclick* event. Other Popover components appear and disappear on the *mouseenter* and *mouseleave* DOM events.

## Specify Content

Popover consists of content area and a title. You can specify static content in the HTML markup as shown in this demo. If Popover should display dynamic content, use the [contentTemplate](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#contentTemplate) property to specify a template. To display the title, enable the [showTitle](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#showTitle) property and set the [title](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#title) property to the title text.

##  Animate Popover

If you want to show and hide Popover with animation effects, assign an object with the **show** and **hide** fields to the [animation](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/animation/) property. Each of these fields accepts an object that configures the animation [type](/Documentation/ApiReference/Common/Object_Structures/animationConfig/#type) and [other properties](/Documentation/ApiReference/Common/Object_Structures/animationConfig/). In this demo, Popover appears with a pop-up animation and fades away when it disappears.

## Shade the Background

You can show Popover with a shaded background. To do this, enable the [shading](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#shading) property and specify a [shadingColor](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/#shadingColor).


