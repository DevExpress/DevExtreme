The DevExtreme Stepper is a UI component that enables a user to navigate multi-step processes like purchases and forms. Stepper supports multiple customization options.

To get started with DevExtreme Stepper, refer to the following tutorial for step-by-step instructions: [Getting Started with Stepper](/Documentation/Guide/UI_Components/Stepper/Getting_Started_with_Stepper/).
<!--split-->

## Base Configuration

The Stepper includes the following base properties:

- [orientation](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#orientation) (default: *'horizontal'*)
The Stepper's orientation.
- [linear](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#linear) (default: `true`)
Specifies whether users navigate the Stepper sequentally or skip steps.
- [selectOnFocus](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#selectOnFocus) (default: `true`)
Specifies whether steps focused with keyboard arrows are automatically selected or not.
- [rtlEnabled](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#rtlEnabled) (default: `false`)
Switches the Stepper to a right-to-left mode.

## Steps

To specify Stepper steps, define [items](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/) or [dataSource](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#dataSource). Define **dataSource** if you need to utilize remote or processed data. 

You can assign the following properties to each step:

- [text](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#text)
Indicator text. If you do not define this option, Stepper will number steps sequentially.
- [icon](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#icon)
Indicator icon. Stepper prioritizes icons over the **text** property.
- [label](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#label)
Step caption.
- [optional](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#optional)
Adds an *(Optional)* sub-caption.
- [isValid](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#isValid)
A visual validation indicator.
- [disabled](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#disabled)
Deactivates the step.
- [hint](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#hint)
Adds a hint on hover.
- [template](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#template)
Allows you to customize the step. This property overrides all other step properties.