Axis labels display values for [major axis ticks](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonAxisSettings/tick/).

To configure labels for individual axes, specify label settings in the **valueAxis**.[label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/label/) and **argumentAxis**.[label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/label/) objects. To configure labels for all axes, use the **commonAxisSettings**.[label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonAxisSettings/label/) object. Individual settings take precedence over common settings.

This demo illustrates how you can display custom content for axis labels. To replicate this demo, declare SVG markup within the [template](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonAxisSettings/label/#template) property. You can access a label's original and formatted values from template code. 
