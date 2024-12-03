$(() => {
  const chat = $('#chat').dxChat({
    height: 710,
    items: messages,
    user: currentUser,
    dayHeaderFormat: dayHeaderFormat[0],
    onMessageEntered({ component, message }) {
      component.renderMessage(message);
    },
    messageTimestampFormat: messageTimestampFormat[0],
  }).dxChat('instance');

  $('#show-avatar').dxCheckBox({
    value: true,
    text: 'Show Avatar',
    onValueChanged(data) {
      chat.option('showAvatar', data.value);
    },
  });

  $('#show-user-name').dxCheckBox({
    value: true,
    text: 'Show User Name',
    onValueChanged(data) {
      chat.option('showUserName', data.value);
    },
  });

  $('#show-day-headers').dxCheckBox({
    value: true,
    text: 'Show Day Headers',
    onValueChanged(data) {
      chat.option('showDayHeaders', data.value);
    },
  });

  $('#day-headers-format').dxSelectBox({
    items: dayHeaderFormat,
    value: dayHeaderFormat[0],
    inputAttr: { 'aria-label': 'Day Headers Format' },
    onValueChanged(data) {
      chat.option('dayHeaderFormat', data.value);
    },
  });

  $('#show-message-timestamp').dxCheckBox({
    value: true,
    text: 'Show Message Timestamp',
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
