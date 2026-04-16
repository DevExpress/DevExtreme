import type { PositionConfig } from '@js/common/core/animation';
import type { Callback } from '@js/core/utils/callbacks';
import { getHeight } from '@js/core/utils/size';
import type { Properties as ChatProperties } from '@js/ui/chat';
import type { Properties as PopupProperties } from '@js/ui/popup';
import { fromPromise } from '@ts/core/utils/m_deferred';
import { AI_ASSISTANT_POPUP_OFFSET } from '@ts/grids/grid_core/ai_assistant/const';
import {
  isChatOptions,
  isEnabledOption,
  isPopupOptions,
  isTitleOption,
} from '@ts/grids/grid_core/ai_assistant/utils';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import { AIChat } from '../ai_chat/ai_chat';
import type { AIChatOptions } from '../ai_chat/types';
import { View } from '../m_modules';
import type { AIAssistantController } from './ai_assistant_controller';

export class AIAssistantView extends View {
  private aiChatInstance!: AIChat;

  private aiAssistantController!: AIAssistantController;

  private columnHeadersView!: ColumnHeadersView;

  private rowsView!: RowsView;

  public visibilityChanged?: Callback;

  public init(): void {
    this.columnHeadersView = this.getView('columnHeadersView');
    this.rowsView = this.getView('rowsView');
    this.aiAssistantController = this.getController('aiAssistant');
  }

  private getAIChatConfig(): AIChatOptions {
    const popupOptions = this.getAIChatPopupOptions();
    const chatOptions = this.getAIChatOptions();

    return {
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onChatCleared: (): void => {},
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
      onShowing: (): void => {
        this.visibilityChanged?.fire(true);
      },
      onHidden: (): void => {
        this.visibilityChanged?.fire(false);
      },
      ...this.option('aiAssistant.popup'),
    };
  }

  private getAIChatOptions(): ChatProperties {
    return {
      dataSource: this.aiAssistantController.getMessageStore(),
      reloadOnChange: true,
      onMessageEntered: (e): void => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const aiMessageId = this.aiAssistantController.createPendingAIMessage(e.message);

        fromPromise(this.aiAssistantController.sendRequestToAI())
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .done((response) => {

          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .fail((error) => {

          });
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
