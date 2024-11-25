Chat is an interactive interface that allows users to send and receive messages in real time.

To get started with the DevExtreme Chat component, refer to the following step-by-step tutorial: [Getting Started with Chat](/Documentation/Guide/UI_Components/Chat/Getting_Started_with_Chat/).

The demo covers Chat basics: setting initial messages, displaying new messages, managing users, and linking two chats in real-time.
<!--split-->

## Messages

To set initial messages, you can either populate the [items](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#items) array (shown in this demo) or use [dataSource](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource).

To render a new message, you must:

- If you use **items**, update the array with the new message.
- If using **dataSource**, implement [load](/Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#load) and [insert](/Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#insert) operations.

## Users

To specify the owner, assign a user to the Chat [user](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#user) property. Owner messages align to the right (or left in RTL mode), without displaying the owner's name and avatar.

Each message includes information about the sender ([author](/Documentation/ApiReference/UI_Components/dxChat/Types/Message/#author)), and includes name, avatar, and alt avatar text. If no avatar is set, the user's initials are displayed instead.

## Events

Entering a message triggers the [messageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event. Use the event handler to perform message post processing (like displaying the message in a message feed and sending the message to the server for storage).

Start typing to raise [typingStart](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onTypingStart), and stop typing or enter a message into the Chat for [typingEnd](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onTypingEnd). By using these event handlers, you can manage the [typingUsers](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#typingUsers) array (it shows which users are typing in the chat UI).