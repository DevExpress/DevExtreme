The [Step Area](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/StepArea/) series uses perpendicular vertical and horizontal lines to connect data points and shades the area under these lines. If a point's value is `null`, the series draws a gap.
<!--split-->

Only `null` point values result in gaps. `undefined` values are ignored. Multiple 0 values may look like a gap, but if [series points](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/StepAreaSeries/point/) are visible, you can see them in this gap. If you want to remove gaps caused by `null` values, enable the [ignoreEmptyPoints](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#ignoreEmptyPoints) property.
