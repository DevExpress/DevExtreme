Annotations are containers for images, text blocks, and custom content that display additional information about the visualized data.

To create annotations, populate the PolarChart's [annotations](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/) array. Each object in the array configures an individual annotation. To specify settings for all annotations, use the [commonAnnotationSettings](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

You can set each annotation's [type](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#type) property to *"text"*, *"image"*, or *"custom"*. This demo shows only *"text"* annotations.

You can place annotations at specific coordinates or anchor them to PolarChart elements. This demo illustrates the following annotation placement methods:  

- [Angle](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#angle) and [radius](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#radius) properties specify the position of annotations with season names.
- Annotations with temperatures are anchored to series, and the [offsetX](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#offsetX), [paddingTopBottom](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#paddingTopBottom), and [paddingLeftRight](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/#paddingLeftRight) properties specify their position.

For more information on annotation settings, refer to the [annotations[]](/Documentation/ApiReference/UI_Components/dxPolarChart/Configuration/annotations/) help topic.
