This demo shows how you can customize individual points and labels in the Chart component.

## Customize Points

Use the [customizePoint](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#customizePoint) function to change the appearance of individual series points. This function should return an object with properties that you want to change in a [point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/point/) configuration. This demo uses this function to color all points with values above the "High Average" in red, and points with values below the "Low Average" in blue.

## Customize Labels

To customize the appearance of individual point labels, implement the [customizeLabel](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#customizeLabel) function. This function should also return an object with properties that need to be changed for a certain [label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/label/). This demo specifies custom labels for the red points.

## Create Constant Lines

To create constant lines, follow the steps below:

1. Choose a direction for the line. You can specify horizontal lines in the [valueAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/) object, and vertical - in the [argumentAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/) object.

2. Specify the [constantLines](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/constantLines/) object. In this object, declare an object for each line with the properties you want to change.

Note that it's necessary to specify the [value](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/constantLines/#value) property for the line to display correctly.

