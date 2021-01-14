Annotations are containers for images, text blocks, and custom content. Annotations can help deliver a more refined user-experience and can improve analysis and readability (by displaying additional information for visualized data).

To create annotations, populate the UI component's [annotations](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/) array. Each object in the array configures an individual annotation. To specify settings for all annotations, use the [commonAnnotationSettings](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

You can set each annotation [type](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/#type) property to *"text"*, *"image"*, or *"custom"*. In this demo, the type used for all annotations is *"image"*.

Annotations can deliver more information if you add tooltips. A [tooltip](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/tooltip/) appears when users hover the mouse pointer over an annotation. This demo illustrates how you can implement a tooltip with custom content via the [tooltipTemplate](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/#tooltipTemplate) property.

For more information on annotation settings, refer to the [annotations[]](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/) help topic.
