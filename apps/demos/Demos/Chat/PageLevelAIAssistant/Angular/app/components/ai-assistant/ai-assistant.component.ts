import { Component, output, signal } from '@angular/core';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxChatModule } from 'devextreme-angular/ui/chat';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import { DxSpeedDialActionModule } from 'devextreme-angular/ui/speed-dial-action';
import { ArrayStore, DataSource } from 'devextreme-angular/common/data';
import {
  CLASSES, chatSuggestions, EMPTY_VIEW_MESSAGE, EMPTY_VIEW_PROMPT,
} from '../../data';

@Component({
  selector: 'app-ai-assistant',
  imports: [
    DxPopupModule,
    DxChatModule,
    DxSpeedDialActionModule,
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css'],
})
export class AiAssistantComponent {
  readonly messageSubmitted = output<DxChatTypes.TextMessage>();

  readonly disabled = signal(false);

  readonly CLASSES = CLASSES;

  readonly emptyViewMessage = EMPTY_VIEW_MESSAGE;

  readonly emptyViewPromptHtml = EMPTY_VIEW_PROMPT;

  readonly suggestions = chatSuggestions;

  readonly popupVisible = signal(false);

  readonly fabVisible = signal(true);

  private readonly store = new ArrayStore({ key: 'id' });

  readonly dataSource = new DataSource({
    store: this.store,
    paginate: false,
  });

  private clearButtonInstance?: DxButtonTypes.InitializedEvent['component'];

  readonly clearButtonOptions: DxButtonTypes.Properties = {
    icon: 'clearhistory',
    disabled: true,
    hint: 'Clear chat',
    onClick: () => this.clearChat(),
    onInitialized: (e: DxButtonTypes.InitializedEvent) => {
      this.clearButtonInstance = e.component;
    },
  };

  toggle(): void {
    this.popupVisible.update((visible) => !visible);
  }

  setDisabled(value: boolean): void {
    this.disabled.set(value);
    if (value) {
      this.clearButtonInstance?.option('disabled', true);
    } else {
      this.updateClearButtonState();
    }
  }

  onPopupShowing(): void {
    this.fabVisible.set(false);
  }

  onPopupHiding(): void {
    this.fabVisible.set(true);
  }

  pushMessage(message: Partial<DxChatTypes.TextMessage>): void {
    this.dataSource.store().push([
      {
        type: 'insert',
        data: {
          id: Date.now() + Math.random(),
          timestamp: new Date(),
          ...message,
        },
      },
    ]);
  }

  private clearChat(): void {
    this.store.clear();
    this.dataSource.reload();
    this.updateClearButtonState();
  }

  readonly onSuggestionClick = ({ itemData }: DxButtonGroupTypes.ItemClickEvent): void => {
    if (!itemData?.prompt) {
      return;
    }

    const message = {
      author: { id: 'user' },
      text: itemData.prompt,
    };

    this.pushMessage(message);
    this.messageSubmitted.emit(message);
  };

  onMessageEntered(e: DxChatTypes.MessageEnteredEvent): void {
    this.messageSubmitted.emit(e.message);
  }

  private updateClearButtonState(): void {
    this.clearButtonInstance?.option('disabled', this.dataSource.items().length === 0);
  }
}
