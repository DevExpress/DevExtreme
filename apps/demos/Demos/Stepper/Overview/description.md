The DevExtreme Stepper is a UI component that indicates progress in a multi-step process and enables users to navigate between individual steps. You can add Stepper components to lengthy data entry forms such as guest checkouts or credit card applications. 

To get started with DevExtreme Stepper, refer to the following step-by-step tutorial: [Getting Started with Stepper](/Documentation/Guide/UI_Components/Stepper/Getting_Started_with_Stepper/).
<!--split-->

## Component Configuration

The following settings are available:

- [orientation](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#orientation) (default: *'horizontal'*)
The Stepper's orientation.
- [linear](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#linear) (default: `true`)
Specifies whether users must navigate the Stepper sequentially or can skip steps.
- [selectOnFocus](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#selectOnFocus) (default: `true`)
Specifies whether steps focused with keyboard arrows are selected automatically.
- [rtlEnabled](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#rtlEnabled) (default: `false`)
Switches the Stepper to Right-to-Left mode.

## Step Settings

To add steps, populate the [items](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/) collection or specify a [dataSource](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#dataSource).

Use the following properties to customize steps:

- [text](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#text)
Indicator text. If you do not define this option, Stepper numbers steps sequentially.
- [icon](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#icon)
Indicator icon. Stepper prioritizes icons over the **text** property.
- [label](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#label)
Step caption displayed next to the indicator. 
- [optional](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#optional)
Adds an *(Optional)* label to the step.
- [isValid](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#isValid)
Allows you to indicate that user input on the step results in validation errors.
- [disabled](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#disabled)
Deactivates the step.
- [hint](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#hint)
Tooltip text for the step.
- [template](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#template)
Allows you to customize the step. This property overrides all other step properties.