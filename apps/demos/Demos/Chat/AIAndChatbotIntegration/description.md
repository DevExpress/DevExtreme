This demo leverages the [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) service alongside the DevExtreme Chat component. You can integrate Chat with multiple AI services, including [OpenAI](https://openai.com/), [Google Dialogflow](https://cloud.google.com/dialogflow/docs), and [Microsoft Bot Framework](https://dev.botframework.com/).

## Handling dataSource (reloadOnChange: false)

The Chat component's [dataSource](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) is a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) that implements its own load and insert functions. The DevExtreme Chat component deactivates [reloadOnChange](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#reloadOnChange) to push updates directly into the store and update the conversation manually. See the[onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event handler and the `processMessageSending` function to review the code that manages data transfer between our Chat component and its data store.
<!--split-->

## Custom Message Template

The Chat specifies a [messageTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#messageTemplate) that displays "Copy" and "Regenerate" buttons in bot messages.

## Response Format Conversion: Markdown to HTML

The AI model outputs responses in Markdown, while the Chat requires HTML output. This example uses the [unified](https://github.com/unifiedjs) plugin library to convert response content. Review `convertToHtml` function code for implementation details.

## Default Caption Customization

The Chat component in this demo displays modified captions when the conversation is empty. The demo uses [localization](/Documentation/Guide/Common/Localization/) techniques to alter built-in text.

## Speech Recognition

In this demo, [speechToTextEnabled](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#speechToTextEnabled) is set to `true`, and users can enter messages with their voice. The Chat component uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition. Use [speechToTextOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#speechToTextOptions) to define custom speech recognizer settings, handle related events, and customize the speech-to-text button appearance.