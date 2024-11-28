$(() => {
  function onMessageEntered({ message }) {
    userChat.renderMessage(message);
    supportChat.renderMessage(message);
  }

  function userChatTypingStart() {
    supportChat.option('typingUsers', [currentUser]);
  }

  function userChatTypingEnd() {
    supportChat.option('typingUsers', []);
  }

  function supportChatTypingStart() {
    userChat.option('typingUsers', [supportAgent]);
  }

  function supportChatTypingEnd() {
    userChat.option('typingUsers', []);
  }

  const userChat = $("#user-chat").dxChat({
    items: initialMessages,
    user: currentUser,
    onMessageEntered,
    onTypingStart: userChatTypingStart,
    onTypingEnd: userChatTypingEnd,
  }).dxChat('instance');

  const supportChat = $("#support-chat").dxChat({
    items: initialMessages,
    user: supportAgent,
    onMessageEntered,
    onTypingStart: supportChatTypingStart,
    onTypingEnd: supportChatTypingEnd,
  }).dxChat('instance');
});
