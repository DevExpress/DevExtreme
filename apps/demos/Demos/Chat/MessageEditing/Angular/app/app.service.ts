import { Injectable } from '@angular/core';
import {
  User,
  Message,
  MessageEnteredEvent,
  MessageUpdatedEvent,
  MessageDeletedEvent
} from 'devextreme/ui/chat';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import Guid from 'devextreme/core/guid';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  date: Date;

  store: Message[] = [];

  customStore: CustomStore;

  dataSource: DataSource;

  currentUser: User = {
    id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
    name: 'John Doe',
  };

  supportAgent: User = {
    id: 'd16d1a4c-5c67-4e20-b70e-2991c22747c3',
    name: 'Support Agent',
    avatarUrl: '../../../../images/petersmith.png',
  };

  messages: Message[] = [];

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
        text: "Hi, I'm having trouble accessing my account.",
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
      load: () => new Promise((resolve) => {
        setTimeout(() => {
          resolve([...this.messages]);
        }, 0);
      }),
      insert: (message) => new Promise((resolve) => {
        setTimeout(() => {
          this.messages.push(message);
          resolve(message);
        });
      }),
    });

    this.dataSource = new DataSource({
      store: this.customStore,
      paginate: false,
    });
  }

  getUsers(): User[] {
    return [this.currentUser, this.supportAgent];
  }

  getTimestamp(date: Date, offsetMinutes = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }

  onMessageEntered({ message }: MessageEnteredEvent) {
    this.dataSource.store().push([{
      type: 'insert',
      data: {
        id: new Guid().toString(),
        ...message,
      },
    }]);
  }

  onMessageDeleted({ message }: MessageDeletedEvent) {
    this.dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    }]);
  }

  onMessageUpdated({ message, text }: MessageUpdatedEvent) {
    this.dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { text, isEdited: true },
    }]);
  }
}
