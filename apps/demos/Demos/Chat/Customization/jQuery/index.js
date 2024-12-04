$(() => {
  const chat = $('#chat').dxChat({
    height: 710,
    items: messages,
    user: currentUser,
    dayHeaderFormat: dayHeaderFormat[0],
    messageTimestampFormat: messageTimestampFormat[0],
    onMessageEntered({ component, message }) {
      component.renderMessage(message);
    },
  }).dxChat('instance');

  $('#show-avatar').dxCheckBox({
    value: true,
    text: 'Avatar',
    onValueChanged(data) {
      chat.option('showAvatar', data.value);
    },
  });

  $('#show-user-name').dxCheckBox({
    value: true,
    text: 'User Name',
    onValueChanged(data) {
      chat.option('showUserName', data.value);
    },
  });

  $('#show-day-headers').dxCheckBox({
    value: true,
    text: 'Day Headers',
    onValueChanged(data) {
      chat.option('showDayHeaders', data.value);
    },
  });

  $('#day-header-format').dxSelectBox({
    items: dayHeaderFormat,
    value: dayHeaderFormat[0],
    inputAttr: { 'aria-label': 'Day Header Format' },
    onValueChanged(data) {
      chat.option('dayHeaderFormat', data.value);
    },
  });

  $('#show-message-timestamp').dxCheckBox({
    value: true,
    text: 'Message Timestamp',
    onValueChanged(data) {
      chat.option('showMessageTimestamp', data.value);
    },
  });

  $('#message-timestamp-format').dxSelectBox({
    items: messageTimestampFormat,
    value: messageTimestampFormat[0],
    inputAttr: { 'aria-label': 'Message Timestamp Format' },
    onValueChanged(data) {
      chat.option('messageTimestampFormat', data.value);
    },
  });

  $('#chat-disabled').dxCheckBox({
    value: false,
    text: 'Disable Chat',
    onValueChanged(data) {
      chat.option('disabled', data.value);
    },
  });
});
