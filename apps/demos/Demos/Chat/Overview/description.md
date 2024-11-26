Chat is an interactive interface that allows users to send and receive messages in real time.

To get started with the DevExtreme Chat component, refer to the following step-by-step tutorial: [Getting Started with Chat](/Documentation/Guide/UI_Components/Chat/Getting_Started_with_Chat/).

The demo implements basic Chat functionality: specifies initial messages, updates the conversation with new incoming and outgoing messages, manages users, and links two chats in real-time.
<!--split-->

## Messages

To specify initial messages, you can either populate the [items](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#items) array (shown in this demo) or use a [dataSource](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource).

Use the following API to render new messages:

- If you use **items**, update the array with the new message.
- If you use a **dataSource**, implement [load](/Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#load) and [insert](/Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#insert) operations.

## Users

To specify the chat owner, set the [user](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#user) property. Owner messages align to the right (or left in RTL mode) and do not display the name or avatar.

Each message includes information about the sender ([author](/Documentation/ApiReference/UI_Components/dxChat/Types/Message/#author)): name, avatar, and alternative avatar text. If no avatar is set, the user's initials are displayed instead.

## Events

If a user enters a message, the Chat raises the [messageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event. Use the event handler to process the message. For example, you can display the message in the message feed and send the message to the server for storage.

When users start or finish typing, the Chat raises [typingStart](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onTypingStart) and [typingEnd](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onTypingEnd) events. Use these events to manage the [typingUsers](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#typingUsers) array. The Chat uses this array to display a list of active users.