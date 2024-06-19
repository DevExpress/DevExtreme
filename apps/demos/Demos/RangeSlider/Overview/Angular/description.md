The RangeSlider component allows users to choose a range of numeric values. This demo shows how you can create and configure a RangeSlider.
<!--split-->

## Create a RangeSlider

To create a RangeSlider, declare it in markup and specify the following four properties:

- [start](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#start) and [end](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#end)    
Specify the selected interval.

- [min](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#max)    
Limit the range of accepted values.

You can see the resulting RangeSlider in the **Default mode** section of this demo.

## Customize RangeSlider Appearance

The RangeSlider can display labels for the [min](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#max) values. To configure the labels, use the [label](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/label/) object. In this object, set the [visible](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/label/#visible) property to `true` to display the labels. You can also specify the [position](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/label/#position) and [format](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/label/#format) properties.

The RangeSlider can also display a tooltip for slider handles. To display tooltips, you need to configure the [tooltip](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/tooltip/) object:

- Set the [enabled](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/tooltip/#enabled) property to `true` to display tooltips. 

- Specify the tooltip [position](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/tooltip/#position).

- Specify the [format](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/tooltip/#format) property.

- Assign *'onHover'* or *'always'* to the [showMode](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/tooltip/#showMode) property to change how the component shows tooltips.

Use the [showRange](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#showRange) property to specify if the selected range should be highlighted. You can also use the [step](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#step) property to specify the value change step for the RangeSlider.

If you want to disable the RangeSlider, set the [disabled](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#disabled) property to `true`.

## Handle the Value Change Event

To handle value changes, use two-way binding to bind the [value](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#value) properties of [NumberBox](/Documentation/ApiReference/UI_Components/dxNumberBox/) components to the [start](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#start) and [end](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#end) properties of the RangeSlider.

The [valueChangeMode](/Documentation/ApiReference/UI_Components/dxRangeSlider/Configuration/#valueChangeMode) property allows you to choose when to change the RangeSlider value and supports the `onHandleMove` and `onHandleRelease` modes. You can see the property's effect in the **Process Value Changes** section. The first RangeSlider changes its value every time a user slides the handle. The second RangeSlider changes its value only when the handle is released. These RangeSlider values are synchronized.