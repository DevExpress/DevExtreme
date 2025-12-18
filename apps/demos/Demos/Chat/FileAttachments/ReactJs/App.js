import React, { useCallback, useRef } from 'react';
import Chat, { FileUploaderOptions } from 'devextreme-react/chat';
import { Guid } from 'devextreme-react/common';
import { CustomStore, DataSource } from 'devextreme-react/common/data';
import { currentUser, messages as initialMessages } from './data.js';

const store = [...initialMessages];
const customStore = new CustomStore({
  key: 'id',
  load: async () => store,
  insert: async (message) => {
    store.push(message);
    return message;
  },
});
const dataSource = new DataSource({
  store: customStore,
  paginate: false,
});
export default function App() {
  const uploadedFilesMapRef = useRef(new Map());
  function getFileUrl(filename) {
    return uploadedFilesMapRef.current.get(filename);
  }
  const onUploaded = useCallback((e) => {
    const { file } = e;
    const url = URL.createObjectURL(file);
    uploadedFilesMapRef.current.set(file.name, url);
  }, []);
  const onMessageEntered = useCallback(({ message }) => {
    const attachmentsWithUrls = message.attachments?.map((attachment) => ({
      ...attachment,
      url: getFileUrl(attachment.name),
    }));
    const newMessage = {
      id: new Guid().toString(),
      ...message,
      attachments: attachmentsWithUrls,
    };
    dataSource.store().push([
      {
        type: 'insert',
        key: newMessage.id,
        data: newMessage,
      },
    ]);
  }, []);
  const onAttachmentDownloadClick = useCallback(({ attachment }) => {
    if (!attachment?.url) {
      return;
    }
    const link = document.createElement('a');
    link.setAttribute('href', attachment.url);
    link.setAttribute('download', attachment.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  const uploadFile = useCallback(() => {}, []);
  return (
    <>
      <div className="chat-container">
        <Chat
          height={710}
          dataSource={dataSource}
          reloadOnChange={false}
          user={currentUser}
          onMessageEntered={onMessageEntered}
          onAttachmentDownloadClick={onAttachmentDownloadClick}
        >
          <FileUploaderOptions
            uploadFile={uploadFile}
            onUploaded={onUploaded}
          />
        </Chat>
      </div>
    </>
  );
}
