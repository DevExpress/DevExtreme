import type { PositionConfig } from '@js/common/core/animation';
import type { ArrayStore } from '@js/common/data';
import type { Callback } from '@js/core/utils/callbacks';
import { getHeight } from '@js/core/utils/size';
import type { Message, Properties as ChatProperties } from '@js/ui/chat';
import type { HidingEvent, Properties as PopupProperties } from '@js/ui/popup';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';
import type { DataChange } from '@ts/ui/collection/collection_widget.base';

import { AIChat } from '../ai_chat/ai_chat';
import type { AIChatOptions } from '../ai_chat/types';
import { View } from '../m_modules';
import type { AIAssistantController } from './ai_assistant_controller';
import { AI_ASSISTANT_POPUP_OFFSET, CLASSES } from './const';
import type { AIMessage } from './types';
import {
  createConfirmDialog,
  isChatOptions,
  isEnabledOption,
  isPopupOptions,
  isTitleOption,
  isUserMessage,
} from './utils';

export class AIAssistantView extends View {
  private aiChatInstance!: AIChat;

  private aiAssistantController!: AIAssistantController;

  private messageStore?: ArrayStore<Message, string>;

  private columnHeadersView!: ColumnHeadersView;

  private rowsView!: RowsView;

  private handleMessageStorePushContext!: (changes: DataChange<Message, string>[]) => void;

  private isHidingAfterConfirm = false;

  public visibilityChanged?: Callback;

  public init(): void {
    this.columnHeadersView = this.getView('columnHeadersView');
    this.rowsView = this.getView('rowsView');
    this.aiAssistantController = this.getController('aiAssistant');
    this.messageStore = this.aiAssistantController.getMessageStore();
    this.handleMessageStorePushContext = this.handleMessageStorePush.bind(this);

    this.unsubscribeMessageStorePush();
    this.subscribeMessageStorePush();
  }

  private getAIChatConfig(): AIChatOptions {
    const popupOptions = this.getAIChatPopupOptions();
    const chatOptions = this.getAIChatOptions();

    return {
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onRegenerate: (aiMessage: AIMessage): void => {
        this.executeRequest(aiMessage);
      },
      popupOptions,
      chatOptions,
    };
  }

  private getPopupHeight(): number {
    const headersHeight = this.columnHeadersView.getHeight();
    const rowsViewHeight = getHeight(this.rowsView.element());

    return headersHeight + rowsViewHeight - AI_ASSISTANT_POPUP_OFFSET * 2;
  }

  private getAIChatPopupOptions(): PopupProperties {
    const position: PositionConfig = {
      my: 'right top',
      at: 'right top',
      of: this.columnHeadersView.element(),
      collision: 'fit',
      offset: `${-AI_ASSISTANT_POPUP_OFFSET} ${AI_ASSISTANT_POPUP_OFFSET}`,
      boundaryOffset: `${AI_ASSISTANT_POPUP_OFFSET} ${AI_ASSISTANT_POPUP_OFFSET}`,
    };

    // @ts-ignore
    return {
      title: this.option('aiAssistant.title') ?? '',
      position,
      // NOTE: DevExtreme Popup supports function-valued height at runtime
      // (re-evaluated automatically on show and window resize).
      // @ts-expect-error type declaration
      height: () => this.getPopupHeight(),
      _ignoreFunctionValueDeprecation: true,
      onShowing: (): void => {
        this.visibilityChanged?.fire(true);
      },
      onHidden: (): void => {
        this.visibilityChanged?.fire(false);
      },
      onHiding: (e: HidingEvent): void => {
        if (this.isHidingAfterConfirm) {
          this.isHidingAfterConfirm = false;
          return;
        }

        if (this.aiAssistantController.isProcessing()) {
          e.cancel = true;

          const confirmDialog = createConfirmDialog({
            popupOptions: {
              elementAttr: { class: this.addWidgetPrefix(CLASSES.aiAssistantConfirmDialog) },
            },
          });

          // @ts-expect-error
          confirmDialog.show().done((confirmResult) => {
            if (confirmResult) {
              this.aiAssistantController.abortRequest();
              this.isHidingAfterConfirm = true;
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              e.component.hide();
            }
          });
        }
      },
      ...this.option('aiAssistant.popup'),
    };
  }

  private executeRequest(message: Message | AIMessage): void {
    this.aiChatInstance?.setDisabled(true);
    fromPromise(this.aiAssistantController.sendRequestToAI(message)).always(() => {
      this.aiChatInstance?.setDisabled(false);
    });
  }

  private handleMessageStorePush(changes: DataChange<Message, string>[]): void {
    const userId = this.aiChatInstance.getUserId();

    changes.forEach(({ type, data }) => {
      if (type === 'insert' && data && isUserMessage(data, userId)) {
        this.executeRequest(data);
      }
    });
  }

  private unsubscribeMessageStorePush(): void {
    this.messageStore?.off('push', this.handleMessageStorePushContext);
  }

  private subscribeMessageStorePush(): void {
    this.messageStore?.on('push', this.handleMessageStorePushContext);
  }

  private getAIChatOptions(): ChatProperties {
    return {
      dataSource: {
        store: this.messageStore,
        pushAggregationTimeout: 0,
      },
      reloadOnChange: true,
      onMessageEntered: (e): void => {
        this.executeRequest(e.message);
      },
      ...this.option('aiAssistant.chat'),
    };
  }

  protected _renderCore(): void {
    if (!this.aiChatInstance) {
      const config = this.getAIChatConfig();

      this.aiChatInstance = new AIChat(config);
    }
  }

  public dispose(): void {
    this.unsubscribeMessageStorePush();
    this.messageStore = undefined;
    super.dispose();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'aiAssistant') {
      const enabledChanged = isEnabledOption(args.fullName, args.value);

      if (enabledChanged) {
        if (this.isVisible()) {
          this._invalidate();
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.hide();
        }
      }

      const popupOptionsChanged = isTitleOption(args.fullName, args.value)
        || isPopupOptions(args.fullName, args.value);
      const chatOptionsChanged = isChatOptions(args.fullName, args.value);

      if (popupOptionsChanged || chatOptionsChanged) {
        this.aiChatInstance?.updateOptions(
          this.getAIChatConfig(),
          popupOptionsChanged,
          chatOptionsChanged,
        );
      }

      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected callbackNames(): string[] {
    return ['visibilityChanged'];
  }

  public isVisible(): boolean {
    return !!this.option('aiAssistant.enabled');
  }

  public isShown(): boolean {
    return this.aiChatInstance?.isShown() ?? false;
  }

  public hide(): Promise<boolean> {
    return this.aiChatInstance?.hide() ?? Promise.resolve(false);
  }

  public toggle(): Promise<boolean> {
    return this.aiChatInstance?.toggle() ?? Promise.resolve(false);
  }
}
