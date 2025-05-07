import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, Message, MessageEnteredEvent } from 'devextreme/ui/chat';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  date: Date;

  currentUser: User = {
    id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
    name: 'John Doe',
  };

  supportAgent: User = {
    id: 'd16d1a4c-5c67-4e20-b70e-2991c22747c3',
    name: 'Support Agent',
    avatarUrl: '../../../../images/petersmith.png',
  };

  dayHeaderFormats = ['dd/MM/yyyy', 'dd.MM.yyyy', 'MMMM dd, yyyy', 'EEEE, MMMM dd'];

  messageTimestampFormats = ['hh:mm a', 'hh:mm:ss a', 'HH:mm', 'HH:mm:ss'];

  messageTimestampLabel = { 'aria-label': 'Message Timestamp Format' };

  dayHeaderLabel = { 'aria-label': 'Day Header Format' };

  messages: Message[] = [];

  messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject([]);

  constructor() {
    this.date = new Date();
    this.date.setHours(0, 0, 0, 0);

    this.messages = [
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
    ];

    this.messagesSubject.next(this.messages);
  }

  get messages$(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  getUsers(): User[] {
    return [this.currentUser, this.supportAgent];
  }

  getTimestamp(date: Date, offsetMinutes = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }

  onMessageEntered(event: MessageEnteredEvent) {
    this.messages = [...this.messages, event.message];
    this.messagesSubject.next(this.messages);
  }
}
