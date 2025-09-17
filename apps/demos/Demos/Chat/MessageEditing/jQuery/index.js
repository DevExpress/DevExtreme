$(() => {
  const customStore = new DevExpress.data.CustomStore({
    key: 'id',
    load: async () => messages,
    insert: async (message) => {
      messages.push(message);
      return message;
    },
  });

  const dataSource = new DevExpress.data.DataSource({
    store: customStore,
    paginate: false,
  });

  const chat = $('#chat').dxChat({
    height: 600,
    dataSource,
    editing: {
      allowUpdating: true,
      allowDeleting: true,
    },
    reloadOnChange: false,
    user: currentUser,
    onMessageEntered(e) {
      const { message } = e;

      dataSource.store().push([{
        type: 'insert',
        data: {
          id: new DevExpress.data.Guid(),
          ...message,
        },
      }]);
    },
    onMessageDeleted(e) {
      const { message } = e;

      dataSource.store().push([{
        type: 'update',
        key: message.id,
        data: { isDeleted: true },
      }]);
    },
    onMessageUpdated(e) {
      const { message, text } = e;

      dataSource.store().push([{
        type: 'update',
        key: message.id,
        data: { text, isEdited: true },
      }]);
    },
  }).dxChat('instance');

  $('#allow-editing').dxSelectBox({
    items: editingOptions,
    value: editingOptions[0].key,
    valueExpr: 'key',
    displayExpr: 'text',
    inputAttr: { 'aria-label': 'Allow Editing' },
    onValueChanged(data) {
      chat.option('editing.allowUpdating', editingStrategy[data.value]);
    },
  });

  $('#allow-deleting').dxSelectBox({
    items: editingOptions,
    value: editingOptions[0].key,
    valueExpr: 'key',
    displayExpr: 'text',
    inputAttr: { 'aria-label': 'Allow Deleting' },
    onValueChanged(data) {
      chat.option('editing.allowDeleting', editingStrategy[data.value]);
    },
  });

  const editingStrategy = {
    enabled: true,
    disabled: false,
    custom: ({ component, message }) => {
      const { items, user } = component.option();
      const userId = user.id;

      const lastNotDeletedMessage = items.findLast(
        (item) => item.author?.id === userId && !item.isDeleted,
      );

      return message.id === lastNotDeletedMessage?.id;
    },
  };
});
