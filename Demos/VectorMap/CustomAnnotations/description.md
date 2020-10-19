Annotations are containers for images, text blocks, and custom content that display additional information about the visualized data.

To create annotations, populate the widget's [annotations](/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/annotations/) array. Each object in the array configures an individual annotation. To specify settings for all annotations, use the [commonAnnotationSettings](/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

You can set each annotation's [type](/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/annotations/#type) option to *"text"*, *"image"*, or *"custom"*. In this demo, the type of all annotations is *"custom"*.

Custom annotations require that you specify your own display [template](/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/annotations/#template) in SVG format. As you can see in demo code, you can access annotation data within the template markup.

For more information on annotation settings, refer to the [annotations[]](/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/annotations/) help topic.
