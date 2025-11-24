import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const FILE_MANAGER_FILE_ACTIONS_BUTTON = 'dx-filemanager-file-actions-button';
const FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = 'dx-filemanager-file-actions-button-activated';
const ACTIVE_STATE_CLASS = 'dx-state-active';

interface FileManagerFileActionsButtonOptions extends WidgetProperties {
  cssClass?: string;
  onClick?: (e: ClickEvent) => void;
}

class FileManagerFileActionsButton extends Widget<FileManagerFileActionsButtonOptions> {
  _button?: Button;

  _clickAction?: (e: Partial<ClickEvent>) => void;

  _initMarkup(): void {
    this._createClickAction();

    const $button = $('<div>');

    this.$element().append($button).addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);

    this._button = this._createComponent($button, Button, {
      icon: 'overflow',
      stylingMode: 'text',
      onClick: (e): void => this._raiseClick(e),
    });

    super._initMarkup();
  }

  _createClickAction(): void {
    this._clickAction = this._createActionByOption('onClick');
  }

  _raiseClick(e: ClickEvent): void {
    this._clickAction?.(e);
  }

  _getDefaultOptions(): FileManagerFileActionsButtonOptions {
    return {
      ...super._getDefaultOptions(),
      cssClass: '',
      onClick: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerFileActionsButtonOptions>): void {
    const { name } = args;

    switch (name) {
      case 'cssClass':
        this.repaint();
        break;
      case 'onClick':
        this._createClickAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  setActive(active: boolean): void {
    this.$element().toggleClass(
      FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED,
      active,
    );
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => this._button?.$element().toggleClass(ACTIVE_STATE_CLASS, active));
  }
}

export default FileManagerFileActionsButton;
