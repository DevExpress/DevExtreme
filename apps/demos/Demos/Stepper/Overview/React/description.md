The DevExtreme Stepper allows you to indicate progress within a multi-step process and allows users to navigate between individual steps. Use our Stepper UI component to implement multi-page navigation in lengthy forms such as store/cart checkout.

To get started with DevExtreme Stepper, refer to the following step-by-step tutorial: [Getting Started with Stepper](/Documentation/Guide/UI_Components/Stepper/Getting_Started_with_Stepper/).
<!--split-->

## Component Configuration

The following settings are available to you:

- [orientation](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#orientation) (default: `horizontal`)    
Stepper orientation (horizontal or vertical).

- [linear](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#linear) (default: `true`)    
Specifies whether users must navigate the Stepper sequentially or can skip steps.

- [selectOnFocus](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#selectOnFocus) (default: `true`)    
Specifies whether steps focused with [keyboard navigation](/Documentation/Guide/UI_Components/Stepper/Accessibility/#Keyboard_Navigation) are selected automatically.

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
Allows you to indicate step-related [validation](/Documentation/Guide/UI_Components/Common/UI_Widgets/Data_Validation/) errors.

- [disabled](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#disabled)    
Deactivates the step.

- [hint](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#hint)    
Tooltip text for the step.

- [render](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#render)/[component](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#component)    
Allow you to customize step-related appearance. These properties override all other step settings.
