This demo shows how to configure the ProgressBar component.

To create a ProgressBar, declare it in markup. You can specify the following properties to change the ProgressBar's numeric scale:

- [min](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#max)    
The min and max properties limit the range of accepted values. 

- [value](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#value)    
This property specifies the current value. If you want to switch the ProgressBar to an indeterminate state, set the [value](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#value) property to `false`.

This demo uses the custom timer function to increase the ProgressBar's value.

When the ProgressBar reaches the maximum value, the [complete](/Documentation/ApiReference/UI_Components/dxProgressBar/Events/#complete) event occurs. Use the [onComplete](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#onComplete) function to handle it.

The progress status displays a ratio between the current and maximum values and indicates the progress. Use the [showStatus](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#showStatus) property to display or hide the status string. To format the status string, use the [statusFormat](/Documentation/ApiReference/UI_Components/dxProgressBar/Configuration/#statusFormat) function.

