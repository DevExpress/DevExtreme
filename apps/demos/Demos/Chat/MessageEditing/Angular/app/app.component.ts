import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChatModule, DxSelectBoxModule } from 'devextreme-angular';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { DataSource } from 'devextreme-angular/common/data';
import { AppService } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  currentUser: DxChatTypes.User;

  allowUpdating = true;

  allowDeleting = true;

  editingStrategies = [
    { key: 'enabled', text: 'Enabled' },
    { key: 'disabled', text: 'Disabled' },
    { key: 'custom', text: 'Only the last message (custom)' },
  ];

  dataSource: DataSource;

  selectedEditingStrategy = 'enabled';

  selectedDeletingStrategy = 'enabled';

  allowEditingLabel = this.appService.allowEditingLabel;

  allowDeletingLabel = this.appService.allowDeletingLabel;

  editingStrategy: Record<string, any> = {
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

  constructor(private readonly appService: AppService) {
    [this.currentUser] = this.appService.getUsers();
    this.dataSource = this.appService.dataSource;
  }

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
    this.allowUpdating = this.editingStrategy[event.value];
    this.selectedEditingStrategy = event.value;
  }

  onAllowDeletingChange(event: any): void {
    this.allowDeleting = this.editingStrategy[event.value];
    this.selectedDeletingStrategy = event.value;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChatModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
