$(async () => {    
    const chat = $("#chat").dxChat({
        height: 712,
        items: messages,
        user: currentUser,
        dayHeaderFormat,
        onMessageEntered({ component, message }) {
          component.renderMessage(message);
        },
        messageTimestampFormat,
    }).dxChat('instance');

    $('#chat-disabled').dxCheckBox({
        value: false,
        text: 'Disable Chat',
        onValueChanged(data) {
          chat.option('disabled', data.value);
        },
    });

    $('#show-day-headers').dxCheckBox({
        value: true,
        text: 'Show Day Headers',
        onValueChanged(data) {
          chat.option('showDayHeaders', data.value);
        },
    });

    $('#show-message-timestamp').dxCheckBox({
        value: true,
        text: 'Show Message Timestamp',
        onValueChanged(data) {
          chat.option('showMessageTimestamp', data.value);
        },
    });

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

    $('#day-headers-format').dxSelectBox({
        items: [dayHeaderFormat, 'dd.MM.yyyy', 'MMMM dd, yyyy', 'EEEE, MMMM dd'],
        value: dayHeaderFormat,
        inputAttr: { 'aria-label': 'Day Headers Format' },
        onValueChanged(data) {
            chat.option('dayHeaderFormat', data.value);
        }
    });

    $('#message-timestamp-format').dxSelectBox({
        items: [messageTimestampFormat, 'hh:mm:ss a', 'HH:mm', 'HH:mm:ss'],
        value: messageTimestampFormat,
        inputAttr: { 'aria-label': 'Message Timestamp Format' },
        onValueChanged(data) {
            chat.option('messageTimestampFormat', data.value);
        }
    });
});
