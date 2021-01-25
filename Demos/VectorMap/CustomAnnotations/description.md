Annotations are containers for images, text blocks, and custom content. By using annotations, you can display additional information to your end users and improve the readability of data visualized within your app.

To create annotations, populate the UI component's [annotations](/Documentation/ApiReference/UI_Components/dxVectorMap/Configuration/annotations/) array. Each object in the array configures an individual annotation. To specify settings for all annotations, use the [commonAnnotationSettings](/Documentation/ApiReference/UI_Components/dxVectorMap/Configuration/commonAnnotationSettings/) object. Individual settings take precedence over common settings.

You can set each annotation [type](/Documentation/ApiReference/UI_Components/dxVectorMap/Configuration/annotations/#type) property to *"text"*, *"image"*, or *"custom"*. In this demo, annotation type has been set to *"custom"*.

Custom annotations require that you specify your own display [template](/Documentation/ApiReference/UI_Components/dxVectorMap/Configuration/annotations/#template) in SVG format. As you can see in the demo code, you can access annotation data within template markup.

For more information on annotation settings, refer to the [annotations[]](/Documentation/ApiReference/UI_Components/dxVectorMap/Configuration/annotations/) help topic.
