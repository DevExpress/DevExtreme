In our upcoming major release (v25.1) we will simplify Chat component configuration when displaying images within messages. 
<!--split-->
In v24.2, the DevExtreme Chat component shipped with custom message content support, including charts and images. To use this feature, you were required to override the entire message bubble layout using the [messageTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#messageTemplate) property. 

Starting with v25.1 you will be able to easily render an image received in responses. For example, if you use [DALL-E](https://openai.com/index/dall-e-3/) or a similar AI service to generate pictures, you can set up image rendering using our Chat component. 