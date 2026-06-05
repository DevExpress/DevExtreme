import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { Guid } from 'devextreme-angular/common';
import { CustomStore, DataSource } from 'devextreme-angular/common/data';

export class AppService {
  date: Date;

  store: DxChatTypes.Message[] = [];

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

  allowEditingLabel = { 'aria-label': 'Allow Editing' };

  allowDeletingLabel = { 'aria-label': 'Allow Deleting' };

  constructor() {
    this.date = new Date();
    this.date.setHours(0, 0, 0, 0);

    this.messages = [
      {
        id: new Guid().toString(),
        timestamp: this.getTimestamp(this.date, -9),
        author: this.supportAgent,
        text: 'Hello, John!\nHow can I assist you today?',
      },
      {
        id: new Guid().toString(),
        timestamp: this.getTimestamp(this.date, -7),
        author: this.currentUser,
        text: 'Hi, I\'m having trouble accessing my account.',
      },
      {
        id: new Guid().toString(),
        timestamp: this.getTimestamp(this.date, -7),
        author: this.currentUser,
        text: 'It says my password is incorrect.',
      },
      {
        id: new Guid().toString(),
        timestamp: this.getTimestamp(this.date, -7),
        author: this.currentUser,
        isDeleted: true,
      },
      {
        id: new Guid().toString(),
        timestamp: this.getTimestamp(this.date, -7),
        author: this.supportAgent,
        text: 'I can help you with that. Can you please confirm your UserID for security purposes?',
        isEdited: true,
      },
    ];

    this.initDataSource();
  }

  initDataSource() {
    this.customStore = new CustomStore({
      key: 'id',
      load: () => this.messages,
      insert: (message) => {
        this.messages.push(message);
        return message;
      },
    });

    this.dataSource = new DataSource({
      store: this.customStore,
      paginate: false,
    });
  }

  getUsers(): DxChatTypes.User[] {
    return [this.currentUser, this.supportAgent];
  }

  getTimestamp(date: Date, offsetMinutes = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }

  onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): void {
    this.dataSource.store().push([{
      type: 'insert',
      data: {
        id: new Guid().toString(),
        ...message,
      },
    }]);
  }

  onMessageDeleted({ message }: DxChatTypes.MessageDeletedEvent): void {
    this.dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    }]);
  }

  onMessageUpdated({ message, text }: DxChatTypes.MessageUpdatedEvent): void {
    this.dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { text, isEdited: true },
    }]);
  }
}
