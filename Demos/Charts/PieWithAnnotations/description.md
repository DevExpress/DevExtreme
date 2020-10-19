Annotations are containers for images, text blocks, and custom content that display additional information about the visualized data.

To create annotations, populate the widget's [annotations](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/) array. Each object in the array configures an individual annotation. To specify settings for all annotations, use the [commonAnnotationSettings](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

You can set each annotation's [type](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/#type) option to *"text"*, *"image"*, or *"custom"*. In this demo, the type of all annotations is *"image"*.

Annotations can deliver more information if you add tooltips to them. A [tooltip](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/tooltip/) appears when users hover the mouse pointer over an annotation. This demo shows how to implement a tooltip with custom content via the [tooltipTemplate](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/#tooltipTemplate) option. 

For more information on annotation settings, refer to the [annotations[]](/Documentation/ApiReference/Data_Visualization_Widgets/dxPieChart/Configuration/annotations/) help topic.
