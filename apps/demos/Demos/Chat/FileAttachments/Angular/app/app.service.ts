import { Injectable } from '@angular/core';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { Guid } from 'devextreme-angular/common';
import { CustomStore, DataSource } from 'devextreme-angular/common/data';

@Injectable()
export class AppService {
  date: Date;

  customStore: CustomStore;

  dataSource: DataSource;

  currentUser: DxChatTypes.User = {
    id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
    name: 'John Doe',
  };

  supportAgent: DxChatTypes.User = {
    id: 'd16d1a4c-5c67-4e20-b70e-2991c22747c3',
    name: 'Support Agent',
    avatarUrl: '../../../../images/petersmith.png',
  };

  messages: DxChatTypes.Message[] = [];

  uploadedFilesMap: Map<string, string>;

  constructor() {
    this.date = new Date();
    this.date.setHours(0, 0, 0, 0);

    this.messages = [
      {
        id: new Guid().toString(),
        timestamp: new Date(this.getTimestamp(this.date, -7)),
        author: this.currentUser,
        text: 'Hi! I\'m having trouble accessing my account.\nThe website says my password is incorrect. I\'m sending a few screenshots so you can see where I get the error.',
        attachments: [
          {
            name: 'Pic1.png',
            url: '../../../../images/Chat/FileAttachments/Pic1.png',
            size: 1024 * 10,
          },
          {
            name: 'Pic2.png',
            url: '../../../../images/Chat/FileAttachments/Pic2.png',
            size: 1024 * 10,
          },
          {
            name: 'Pic3.png',
            url: '../../../../images/Chat/FileAttachments/Pic3.png',
            size: 1024 * 10,
          },
        ],
      },
      {
        id: new Guid().toString(),
        timestamp: new Date(this.getTimestamp(this.date, -7)),
        author: this.supportAgent,
        text: 'Hello! Thanks for including screenshots. To restore access, please follow instructions in the attached file.\nLet me know if you need anything else.',
        attachments: [
          {
            name: 'Instructions.pdf',
            url: '../../../../images/Chat/FileAttachments/Instructions.pdf',
            size: 1024 * 10,
          },
        ],
      },
    ];

    this.uploadedFilesMap = new Map();
    this.initDataSource();
  }

  getTimestamp(date: Date, offsetMinutes = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }

  initDataSource() {
    this.customStore = new CustomStore({
      key: 'id',
      load: async () => this.messages,
      insert: async (message) => {
        this.messages.push(message);
        return message;
      },
    });

    this.dataSource = new DataSource({
      store: this.customStore,
      paginate: false,
    });
  }

  getFileUrl(filename: string): string | undefined {
    return this.uploadedFilesMap.get(filename);
  }

  onUploaded(file: File) {
    const url = URL.createObjectURL(file);
    this.uploadedFilesMap.set(file.name, url);
  }

  onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): void {
    const attachmentsWithUrls = message.attachments?.map((attachment: DxChatTypes.Attachment) => ({
      ...attachment,
      url: this.getFileUrl(attachment.name),
    }));

    this.dataSource.store().push([{
      type: 'insert',
      data: {
        ...message,
        id: new Guid().toString(),
        attachments: attachmentsWithUrls,
      },
    }]);
  }

  onAttachmentDownloadClick(attachment: DxChatTypes.Attachment) {
    if (!attachment?.url) {
      return;
    }

    const link = document.createElement('a');
    link.setAttribute('href', attachment.url);
    link.setAttribute('download', attachment.name);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
