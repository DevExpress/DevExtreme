import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChatModule, DxSelectBoxModule } from 'devextreme-angular';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { AppService } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChatModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly currentUser = this.appService.currentUser;

  readonly dataSource = this.appService.dataSource;

  readonly allowEditingLabel = this.appService.allowEditingLabel;

  readonly allowDeletingLabel = this.appService.allowDeletingLabel;

  readonly editingStrategies = [
    { key: 'enabled', text: 'Enabled' },
    { key: 'disabled', text: 'Disabled' },
    { key: 'custom', text: 'Only the last message (custom)' },
  ];

  private readonly editingStrategy: Record<string, any> = {
    enabled: true,
    disabled: false,
    custom: ({ component, message }: any) => {
      const { items, user } = component.option();
      const userId = user.id;

      const lastNotDeletedMessage = items.findLast(
        (item: any) => item.author?.id === userId && !item.isDeleted
      );

      return message.id === lastNotDeletedMessage?.id;
    },
  };

  readonly allowUpdating = signal(this.editingStrategy.enabled);

  readonly allowDeleting = signal(this.editingStrategy.enabled);

  readonly selectedEditingStrategy = signal('enabled');

  readonly selectedDeletingStrategy = signal('enabled');

  onMessageEntered(e: DxChatTypes.MessageEnteredEvent): void {
    this.appService.onMessageEntered(e);
  }

  onMessageDeleted(e: DxChatTypes.MessageDeletedEvent): void {
    this.appService.onMessageDeleted(e);
  }

  onMessageUpdated(e: DxChatTypes.MessageUpdatedEvent): void {
    this.appService.onMessageUpdated(e);
  }

  onAllowUpdatingChange(event: any): void {
    this.allowUpdating.set(this.editingStrategy[event.value]);
    this.selectedEditingStrategy.set(event.value);
  }

  onAllowDeletingChange(event: any): void {
    this.allowDeleting.set(this.editingStrategy[event.value]);
    this.selectedDeletingStrategy.set(event.value);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
