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

  const uploadedFilesMap = new Map();

  $('#chat').dxChat({
    height: 600,
    dataSource,
    reloadOnChange: false,
    user: currentUser,
    fileUploaderOptions: {
      uploadFile: () => {},
      onValueChanged(e) {
        e.value.forEach((file) => {
          const url = URL.createObjectURL(file);
          uploadedFilesMap.set(file.name, url);
        });
      },
    },
    onMessageEntered(e) {
      const { message } = e;

      const attachmentsWithUrls = message.attachments?.map((attachment) => {
        const url = uploadedFilesMap.get(attachment.name);
        return { ...attachment, url };
      });

      dataSource.store().push([{
        type: 'insert',
        data: {
          id: new DevExpress.data.Guid(),
          ...message,
          attachments: attachmentsWithUrls,
        },
      }]);
    },
    onAttachmentDownloadClick(e) {
      const { attachment } = e;

      if (!attachment?.url) {
        return;
      }

      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    },
  }).dxChat('instance');
});
