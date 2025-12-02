import React, { useCallback, useRef } from 'react';
import Chat, { FileUploaderOptions, type ChatTypes } from 'devextreme-react/chat';
import { type FileUploaderTypes } from 'devextreme-react/file-uploader';
import { Guid } from 'devextreme-react/common';
import { CustomStore, DataSource } from 'devextreme-react/common/data';

import { currentUser, messages as initialMessages } from './data.ts';

const store: ChatTypes.Message[] = [...initialMessages];

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
  const uploadedFilesMapRef = useRef(new Map<string, string>());

  function getFileUrl(filename: string): string | undefined {
    return uploadedFilesMapRef.current.get(filename);
  }

  const onUploaded = useCallback((e: FileUploaderTypes.UploadedEvent): void => {
    const { file } = e;
    const url = URL.createObjectURL(file);
    uploadedFilesMapRef.current.set(file.name, url);
  }, []);

  const onMessageEntered = useCallback((
    { message }: ChatTypes.MessageEnteredEvent,
  ): void => {
    const attachmentsWithUrls = message.attachments?.map((attachment: ChatTypes.Attachment) => ({
      ...attachment,
      url: getFileUrl(attachment.name),
    }));

    const newMessage = {
      id: new Guid().toString(),
      ...message,
      attachments: attachmentsWithUrls,
    };

    dataSource.store().push([{
      type: 'insert',
      key: newMessage.id,
      data: newMessage,
    }]);
  }, []);

  const onAttachmentDownloadClick = useCallback((
    { attachment }: ChatTypes.AttachmentDownloadClickEvent,
  ): void => {
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

  const uploadFile = useCallback((): void => {}, []);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
