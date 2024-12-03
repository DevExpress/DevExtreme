This demo shows how to add an AI service to the Chat component to create a chatbot.

## Handling dataSource (reloadOnChange: false)

In this demo, a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) is implemented (with custom load and insert functions). This store serves as a [dataSource](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) for the Chat component. [reloadOnChange](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#reloadOnChange) is set to `false`, which affects how messages are processed: updates are pushed directly into the store. See the [onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event handler and `processMessageSending` function for more details.

## Customizing Messages with messageTemplate

The bot's messages feature "Copy" and "Regenerate" buttons. To add these buttons, implement a [messageTemplate](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#messageTemplate).

## Converting Markdown Responses to HTML

The AI model outputs responses in Markdown. This examples converts them to HTML with the [unified](https://github.com/unifiedjs) plugin library. See `convertToHtml` for more information.

## Changing Default Texts with Localization

Some UI texts are modified in the empty view with [localization](/Documentation/Guide/Common/Localization/) messages. You can apply a similar method to alter text.