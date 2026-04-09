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

export class AIAssistantViewController extends ViewController {
  private aiAssistantView?: AIAssistantView;

  private headerPanel?: HeaderPanel;

  private getAiAssistantButton(): dxElementWrapper | undefined {
    const className = this.addWidgetPrefix(CLASSES.aiAssistantButton);

    return this.headerPanel?.element()?.find(`.${className}`) as dxElementWrapper | undefined;
  }

  public init(): void {
    this.aiAssistantView = this.getView('aiAssistantView');
    this.headerPanel = this.getView('headerPanel');

    this.aiAssistantView.visibilityChanged?.add((visible: boolean): void => {
      this.getAiAssistantButton()?.toggleClass(ACTIVE_STATE_CLASS, visible);
    });

    const isAiAssistantEnabled = this.option('aiAssistant.enabled'); // TODO clarify option name

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.createAiAssistantToolbarItem();

      this.headerPanel?.registerToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
    }
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'aiAssistant') {
      this.syncAiAssistantItem();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  public toggle(): Promise<boolean> {
    return this.aiAssistantView?.toggle() ?? Promise.resolve(false);
  }

  private syncAiAssistantItem(): void {
    const isAiAssistantEnabled = this.option('aiAssistant.enabled'); // TODO clarify option name

    if (isAiAssistantEnabled) {
      const aiAssistantToolbarItem = this.createAiAssistantToolbarItem();

      this.headerPanel?.applyToolbarItem(AI_ASSISTANT_BUTTON_NAME, aiAssistantToolbarItem);
      this.aiAssistantView?._invalidate();
    } else {
      this.headerPanel?.removeToolbarItem(AI_ASSISTANT_BUTTON_NAME);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.aiAssistantView?.hide();
    }
  }

  private createAiAssistantToolbarItem(): ToolbarItem {
    const onClickHandler = (): Promise<boolean> => this.toggle();

    const hintText = this.option('aiAssistant.title'); // TODO clarify option name

    const aiAssistantToolbarItemClass = this.headerPanel?.getToolbarButtonClass(
      this.addWidgetPrefix(CLASSES.aiAssistantButton),
    );

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
          class: aiAssistantToolbarItemClass,
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
