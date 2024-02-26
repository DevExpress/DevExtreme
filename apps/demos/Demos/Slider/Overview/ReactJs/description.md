This demo shows how you can create and configure a Slider.

## Create a Slider

To create a Slider, declare it in markup and use the [min](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#max) properties to limit the range of accepted values.

You can also specify the [value](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#value) property to change the initial value.

The **Default mode** section shows a Slider with such a basic setup.

## Customize Slider Appearance

### Max and min labels

The Slider can display labels for the [min](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#max) values. To configure the labels, use the [label](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/label/) object. In this object, specify the [visible](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/label/#visible), [position](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/label/#position), and [format](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/label/#format) properties.

### Tooltip

To display a handle tooltip, you need to configure the [tooltip](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/tooltip/) object:

- Set the [enabled](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/tooltip/#enabled) property to `true` to display a tooltip.

- Specify the tooltip [position](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/tooltip/#position): over or under the Slider.

- Specify the [format](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/tooltip/#format) property.

- Assign _'onHover'_ or _'always'_ to the [showMode](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/tooltip/#showMode) property to change how the component shows a tooltip.

### Range highlight

Use the [showRange](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#showRange) property to specify if the component should highlight the range between [min](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#min) and [value](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#value).

### Discrete step

Use the [step](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#step) property to specify the value change step for the Slider.

### Disabled state

If you want to disable the Slider, set the [disabled](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#disabled) property to `true`.

## Handle the Value Change Event

Specify the [onValueChanged](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#onValueChanged) function to handle the [value](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#value) change. In this demo, the [NumberBox](/Documentation/ApiReference/UI_Components/dxNumberBox/) component and the Sliders exchange values through the variable bound to all the components. The state of this variable changes in the [onValueChanged](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#onValueChanged) function.

The [valueChangeMode](/Documentation/ApiReference/UI_Components/dxSlider/Configuration/#valueChangeMode) property allows you to choose when the Slider changes its value. Available modes include `onHandleMove` and `onHandleRelease`. You can see the property's effect in the **Process Value Changes** section. The first Slider changes its value while a user slides the handle. The second Slider changes its value only after the user releases the handle. These Slider values are synchronized.
