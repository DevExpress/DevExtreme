The Form component can use different layouts depending on the screen width. Click one of the buttons on the right from the demo title to switch between horizontal and vertical orientations. You can determine the number of columns in the Form in one of the following ways:

**Calculate the Number of Columns Automatically**         

To automatically calculate the number of columns based on the screen width, follow these steps:

1. Assign *"auto"* to the [colCount](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#colCount) property to make the number of columns adapt to any screen size. 

1. Use the [minColWidth](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#minColWidth) property to specify the minimum column width.

In this demo, the number of columns is calculated automatically when the check box under the Form is clear.

**Predefine the Number of Columns for Each Screen Size**       

In this case, screen sizes are classified into one of the following categories called "size qualifiers": extra small, small, medium, or large. You specify the number of columns for each size qualifier. Follow the steps below to configure this behavior:

1. Use the [screenByWidth](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#screenByWidth) function to map screen widths to size qualifiers. This demo classifies screens narrower than 720 pixels as small and treats all other screens as medium.

1. Specify the [colCountByScreen](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#colCountByScreen) property to define how many columns the Form should contain depending on the available screen qualifiers. 

In this demo, mark the check box under the Form to enable this configuration.
