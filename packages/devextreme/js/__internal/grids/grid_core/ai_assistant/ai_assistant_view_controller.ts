import type { dxElementWrapper } from '@js/core/renderer';
import { ACTIVE_STATE_CLASS } from '@ts/core/widget/widget';
import {
  AI_ASSISTANT_BUTTON_NAME,
  AI_ASSISTANT_ICON_NAME,
  CLASSES,
} from '@ts/grids/grid_core/ai_assistant/const';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import { ViewController } from '../m_modules';
import type { AIAssistantView } from './ai_assistant_view';
import { isEnabledOption, isTitleOption } from './utils';

export class AIAssistantViewController extends ViewController {
  private aiAssistantView?: AIAssistantView;

  private headerPanel?: HeaderPanel;

  private readonly visibilityChangedHandler = (visible: boolean): void => {
    const className = this.addWidgetPrefix(CLASSES.aiAssistantButton);
    const aiAssistantButton: dxElementWrapper | undefined = this.headerPanel?.element()?.find(`.${className}`);

    aiAssistantButton?.toggleClass(ACTIVE_STATE_CLASS, visible);
  };

  public init(): void {
    this.aiAssistantView = this.getView('aiAssistantView');
    this.headerPanel = this.getView('headerPanel');

    const isAiAssistantEnabled = this.option('aiAssistant.enabled');

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.createAiAssistantToolbarItem();

      this.headerPanel?.registerToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
    }

    this.aiAssistantView?.visibilityChanged?.remove(this.visibilityChangedHandler);
    this.aiAssistantView?.visibilityChanged?.add(this.visibilityChangedHandler);
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'aiAssistant') {
      const enabledChanged = isEnabledOption(args.fullName, args.value);
      const titleChanged = isTitleOption(args.fullName, args.value);

      if (enabledChanged || titleChanged) {
        this.syncAiAssistantItem();
        args.handled = true;
      }
    } else {
      super.optionChanged(args);
    }
  }

  public toggle(): Promise<boolean> {
    return this.aiAssistantView?.toggle() ?? Promise.resolve(false);
  }

  private syncAiAssistantItem(): void {
    const isAiAssistantEnabled = this.option('aiAssistant.enabled');

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.createAiAssistantToolbarItem();

      this.headerPanel?.applyToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
    } else {
      this.headerPanel?.removeToolbarItem(AI_ASSISTANT_BUTTON_NAME);
    }
  }

  private createAiAssistantToolbarItem(): ToolbarItem {
    const onClickHandler = (): Promise<boolean> => this.toggle();

    const hintText = this.option('aiAssistant.title');

    const isActive = this.aiAssistantView?.isShown();

    const aiAssistantToolbarItemClass = this.headerPanel?.getToolbarButtonClass(
      this.addWidgetPrefix(CLASSES.aiAssistantButton),
    ) ?? '';
    const aiAssistantToolbarItemStateClass = isActive ? ACTIVE_STATE_CLASS : '';

    return {
      widget: 'dxButton',
      options: {
        icon: AI_ASSISTANT_ICON_NAME,
        activeStateEnabled: false,
        onClick: onClickHandler,
        hint: hintText,
        text: hintText,
        elementAttr: {
          'aria-haspopup': 'dialog',
          class: `${aiAssistantToolbarItemClass} ${aiAssistantToolbarItemStateClass}`,
        },
      },
      showText: 'inMenu',
      location: 'after',
      name: AI_ASSISTANT_BUTTON_NAME,
      locateInMenu: 'auto',
      sortIndex: 5,
    };
  }
}
