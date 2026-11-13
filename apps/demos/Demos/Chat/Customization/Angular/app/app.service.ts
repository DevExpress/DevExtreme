import { Injectable, signal } from '@angular/core';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly currentUser: DxChatTypes.User = {
    id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
    name: 'John Doe',
  };

  private readonly supportAgent: DxChatTypes.User = {
    id: 'd16d1a4c-5c67-4e20-b70e-2991c22747c3',
    name: 'Support Agent',
    avatarUrl: '../../../../images/petersmith.png',
  };

  readonly dayHeaderFormats = ['dd/MM/yyyy', 'dd.MM.yyyy', 'MMMM dd, yyyy', 'EEEE, MMMM dd'];

  readonly messageTimestampFormats = ['hh:mm a', 'hh:mm:ss a', 'HH:mm', 'HH:mm:ss'];

  readonly messageTimestampLabel = { 'aria-label': 'Message Timestamp Format' };

  readonly dayHeaderLabel = { 'aria-label': 'Day Header Format' };

  private readonly date = new Date(new Date().setHours(0, 0, 0, 0));

  private readonly messagesState = signal<DxChatTypes.Message[]>([
    {
      timestamp: this.getTimestamp(this.date, -9),
      author: this.supportAgent,
      text: 'Hello, John!\nHow can I assist you today?',
    },
    {
      timestamp: this.getTimestamp(this.date, -7),
      author: this.currentUser,
      text: 'Hi, I\'m having trouble accessing my account.',
    },
    {
      timestamp: this.getTimestamp(this.date, -7),
      author: this.currentUser,
      text: 'It says my password is incorrect.',
    },
    {
      timestamp: this.getTimestamp(this.date, -7),
      author: this.supportAgent,
      text: 'I can help you with that. Can you please confirm your UserID for security purposes?',
    },
    {
      timestamp: this.getTimestamp(this.date, 1),
      author: this.currentUser,
      text: 'john.doe1357',
    },
    {
      timestamp: this.getTimestamp(this.date, 1),
      author: this.supportAgent,
      text: '✅ Instructions to restore access have been sent to the email address associated with your account.',
    },
  ]);

  readonly messages = this.messagesState.asReadonly();

  private getTimestamp(date: Date, offsetMinutes = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }

  onMessageEntered(event: DxChatTypes.MessageEnteredEvent) {
    this.messagesState.update((messages) => [...messages, event.message]);
  }
}
