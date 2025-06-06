This demo showcases the DevExtreme Stepper component which guides users through a multi-page hotel registration form. The Stepper lacks a built-in form but can connect to it or other controls through its public API. Input controls on each step are organized with the help of [MultiView](/Documentation/Guide/UI_Components/MultiView/Overview/) and [Form](/Documentation/Guide/UI_Components/Form/Overview/) components.

This demo includes three key parts:

- Stepper
- Step content, where the MultiView component shows each step's content. Each view with input fields contains a Form.
- Navigation panel, which displays the current step ("Step 1 of 5") and buttons for moving between steps (Next/Back).
<!--split-->

## Validation

Form validation impacts step progression and view switching. Attempting to proceed by clicking a step ([onSelectionChanging](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#onSelectionChanging)) or pressing "Next" (`onClick`) triggers the validation process (`validateStep`) for the current step's input. 

Valid data changes the current step to show a checkmark, selects the next step, and updates the view to the following form. Invalid data prompts error messages, marks the step as invalid, and prevents advancing. Only validated steps allow progression.

To see validation in action, try moving to step two without "Check-in" and "Check-out" dates. Required fields will fail validation, marking step one as [invalid](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#isValid) (`isValid = false`). The icon turns red and displays an exclamation mark. The [DateRangeBox](/Documentation/Guide/UI_Components/DateRangeBox/Getting_Started_with_DateRangeBox/) component also displays an error icon. DateRangeBox and Stepper both display validation errors since they belong to the same [validation group](/Documentation/ApiReference/UI_Components/dxValidationGroup/). 

The final step is unique. Once "Request" is completed, the request is submitted, and returning to previous steps is restricted. Click "Reset" to restart booking.