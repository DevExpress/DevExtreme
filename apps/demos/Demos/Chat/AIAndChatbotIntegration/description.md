This demo uses an AI service and the DevExtreme Chat component to create a chatbot UI.

## Handling dataSource (reloadOnChange: false)

The Chat component's [dataSource](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) is a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) that implements its own load and insert functions. The Chat deactivates [reloadOnChange](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#reloadOnChange) to push updates directly into the store and update the conversation manually. See the [onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event handler and the `processMessageSending` function to review the code that manages data transfer between the Chat and its data store.
<!--split-->

## Custom Message Template

The Chat specifies a [messageTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#messageTemplate) that displays "Copy" and "Regenerate" buttons in bot messages.

## Response Format Conversion: Markdown to HTML

The AI model outputs responses in Markdown, while the Chat requires HTML output. This examples uses the [unified](https://github.com/unifiedjs) plugin library to convert response content. Review `convertToHtml` function code for implementation details.

## Default Caption Customization

The Chat component in this demo displays modified captions when the conversation is empty. The demo uses [localization](/Documentation/Guide/Common/Localization/) techniques to alter built-in text.