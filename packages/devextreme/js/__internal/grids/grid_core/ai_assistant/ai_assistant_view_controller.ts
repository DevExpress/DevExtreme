import $ from '@js/core/renderer';
import type { InitializedEvent as ButtonInitializedEvent } from '@js/ui/button';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import { ViewController } from '../m_modules';
import type { AIAssistantView } from './ai_assistant_view';

const AI_ASSISTANT_BUTTON_NAME = 'aiAssistantButton';
const AI_ASSISTANT_BUTTON_CLASS = 'ai-assistant-button';
const AI_ASSISTANT_ICON_NAME = 'chatsparkleoutline';

export class AIAssistantViewController extends ViewController {
  private aiAssistantView!: AIAssistantView;

  private headerPanel?: HeaderPanel;

  public init(): void {
    this.aiAssistantView = this.getView('aiAssistantView');
    this.headerPanel = this.getView('headerPanel');

    const isAiAssistantEnabled = this.option('aiAssistant.enabled'); // TODO clarify option name

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.getAiAssistantToolbarItem();

      this.headerPanel?.registerToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
    }
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'aiAssistant') {
      if (args.fullName === 'aiAssistant.enabled') { // TODO clarify option name
        this.syncAiAssistantItem();
      }

      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  public show(): Promise<boolean> {
    return this.aiAssistantView.show();
  }

  public hide(): Promise<boolean> {
    return this.aiAssistantView.hide();
  }

  public toggle(): Promise<boolean> {
    return this.aiAssistantView.toggle();
  }

  private syncAiAssistantItem(): void {
    const isAiAssistantEnabled = this.option('aiAssistant.enabled'); // TODO clarify option name

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.getAiAssistantToolbarItem();

      this.headerPanel?.applyToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
    } else {
      this.headerPanel?.removeToolbarItem(AI_ASSISTANT_BUTTON_NAME);
    }
  }

  private getAiAssistantToolbarItem(): ToolbarItem {
    const onClickHandler = (): Promise<boolean> => this.toggle();

    const onInitialized = (e: ButtonInitializedEvent): void => {
      if (this.headerPanel) {
        const asAssistantClass = this.addWidgetPrefix(AI_ASSISTANT_BUTTON_CLASS);
        $(e.element).addClass(this.headerPanel._getToolbarButtonClass(asAssistantClass));
      }
    };
    const hintText = this.option('aiAssistant.title'); // TODO clarify option name
    return {
      widget: 'dxButton',
      options: {
        icon: AI_ASSISTANT_ICON_NAME,
        onClick: onClickHandler,
        hint: hintText,
        text: hintText,
        onInitialized,
        elementAttr: { 'aria-haspopup': 'dialog' },
      },
      showText: 'inMenu',
      location: 'after',
      name: AI_ASSISTANT_BUTTON_NAME,
      locateInMenu: 'auto',
      sortIndex: 5,
    };
  }
}
