import {
  ChangeDetectorRef, Component, EventEmitter, Input, Output,
} from '@angular/core';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxChatModule } from 'devextreme-angular/ui/chat';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import { DxSpeedDialActionModule } from 'devextreme-angular/ui/speed-dial-action';
import { ArrayStore, DataSource } from 'devextreme-angular/common/data';
import {
  CLASSES, chatSuggestions, EMPTY_VIEW_MESSAGE, EMPTY_VIEW_PROMPT,
} from '../../data';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'app-ai-assistant',
  imports: [
    DxPopupModule,
    DxChatModule,
    DxSpeedDialActionModule,
  ],
  templateUrl: `.${modulePrefix}/components/ai-assistant/ai-assistant.component.html`,
  styleUrls: [`.${modulePrefix}/components/ai-assistant/ai-assistant.component.css`],
})
export class AiAssistantComponent {
  @Input() disabled = false;

  @Output() messageSubmitted = new EventEmitter<DxChatTypes.TextMessage>();

  readonly CLASSES = CLASSES;

  readonly emptyViewMessage = EMPTY_VIEW_MESSAGE;

  readonly emptyViewPromptHtml = EMPTY_VIEW_PROMPT;

  readonly suggestions = chatSuggestions;

  popupVisible = false;

  fabVisible = true;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

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
    this.popupVisible = !this.popupVisible;
  }

  setDisabled(value: boolean): void {
    this.disabled = value;
    this.changeDetectorRef.detectChanges();
    if (!value) {
      this.updateClearButtonState();
    }
  }

  onPopupShowing(): void {
    this.fabVisible = false;
  }

  onPopupHiding(): void {
    this.fabVisible = true;
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

  clearChat(): void {
    this.store.clear();
    this.dataSource.reload();
    this.updateClearButtonState();
  }

  onSuggestionClick = ({ itemData }: { itemData?: { prompt: string } }): void => {
    const { prompt } = itemData ?? {};

    const message: DxChatTypes.TextMessage = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      author: { id: 'user' },
      text: prompt,
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
