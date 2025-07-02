This demo uses the DevExtreme Stepper component to guide users through a multi-page hotel registration form. The Stepper lacks a built-in form but can connect to it or other controls through APIs. Input controls at each step are organized using DevExtreme [MultiView](/Documentation/Guide/UI_Components/MultiView/Overview/) and [Form](/Documentation/Guide/UI_Components/Form/Overview/) components.

There are three key parts to this demo:

- Stepper
- Step content where the MultiView component displays content for each step. Each view with input fields contains a Form.
- A navigation panel that displays the current step ("Step 1 of 5") and buttons for moving between steps (Next/Back).
<!--split-->

## Validation

Form validation impacts step progression and view switch operations. Attempting to proceed by clicking a step ([onSelectionChanging](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/#onSelectionChanging)) or pressing "Next" (`onClick`) triggers the validation process (`validateStep`) for current step input.

Valid data changes the current step to display a checkmark, selects the next step, and updates the view to the following form. Invalid data prompts error messages, marks the step as invalid, and prevents step progress. Only validated steps allow progression.

To view validation in action, move to step two without "Check-in" and "Check-out" dates. Required fields will fail validation, marking step one as [invalid](/Documentation/ApiReference/UI_Components/dxStepper/Configuration/items/#isValid) (`isValid = false`). The icon turns red and displays an exclamation mark. The [DateRangeBox](/Documentation/Guide/UI_Components/DateRangeBox/Getting_Started_with_DateRangeBox/) component also displays an error icon. DateRangeBox and Stepper both display validation errors since they belong to the same [validation group](/Documentation/ApiReference/UI_Components/dxValidationGroup/). 

The final step is unique. Once the "Additional Requests" step is completed, the request is submitted, and a return to previous steps is not permitted. Click "Reset" to restart booking.