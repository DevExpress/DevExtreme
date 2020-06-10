Annotations are images and text blocks that provide additional information about the visualized data.

To configure annotations, assign an array of objects to the [annotations](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/) option. To specify settings for all annotations, use the [commonAnnotationSettings](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

Each annotation's [type](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#type) attribute should be set to *"text"* or *"image"*. In this demo, all annotations have the *"text"* type.

Annotations can be added at specific coordinates or anchored to a **PolarChart** element. This demo illustrates annotation placement:  

- [Angle](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#angle) and [radius](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#radius) options specify the position of annotations with seasons names.
- Annotations with temperatures are anchored to series, and the [offsetX](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#offsetX), [paddingTopBottom](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#paddingTopBottom), and [paddingLeftRight](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/#paddingLeftRight) options specify their position.

For more information on annotation settings, refer to the [annotations[]](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxPolarChart/Configuration/annotations/) documentation section.