import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChatModule, DxSelectBoxModule } from 'devextreme-angular';
import {
  User,
  MessageEnteredEvent,
  MessageDeletedEvent,
  MessageUpdatedEvent,
  Editing
} from 'devextreme/ui/chat';
import { AppService } from './app.service';
import DataSource from 'devextreme/data/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  currentUser: User;

  editingOptions: Editing = {
    allowUpdating: true,
    allowDeleting: true,
  };

  editingStrategies = [
    { key: 'enabled', text: 'Enabled' },
    { key: 'disabled', text: 'Disabled' },
    { key: 'Only the last message (custom)', text: 'Custom' },
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

      const lastNotDeletedMessage = items.findLast((item: any) => {
        return item.author?.id === userId && !item.isDeleted;
      });

      return message.id === lastNotDeletedMessage?.id;
    },
  };

  constructor(private readonly appService: AppService) {
    [this.currentUser] = this.appService.getUsers();
    this.dataSource = this.appService.dataSource;
  }

  onMessageEntered(e: MessageEnteredEvent) {
    this.appService.onMessageEntered(e);
  }

  onMessageDeleted(e: MessageDeletedEvent) {
    this.appService.onMessageDeleted(e);
  }

  onMessageUpdated(e: MessageUpdatedEvent) {
    this.appService.onMessageUpdated(e);
  }

  onEditingStrategyChange(event: any, type: string): void {
    this.editingOptions = {
      [type]: this.editingStrategy[event.value]
    };
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
