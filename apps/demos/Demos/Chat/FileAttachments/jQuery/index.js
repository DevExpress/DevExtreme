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

  $('#chat').dxChat({
    height: 600,
    dataSource,
    reloadOnChange: false,
    user: currentUser,
    fileUploaderOptions: {
      uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
    },
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
    onAttachmentDownloadClick(e) {
      console.log(e);
    },
  }).dxChat('instance');
});
