/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { ContextMenuProperties } from '@ts/ui/context_menu/context_menu';
import ContextMenu from '@ts/ui/context_menu/context_menu';
import DiagramBar from '@ts/ui/diagram/diagram.bar';
import DiagramCommandsManager from '@ts/ui/diagram/diagram.commands_manager';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';
import DiagramMenuHelper from '@ts/ui/diagram/ui.diagram.menu_helper';

const DIAGRAM_TOUCHBAR_CLASS = 'dx-diagram-touchbar';
const DIAGRAM_TOUCHBAR_OVERLAY_CLASS = 'dx-diagram-touchbar-overlay';
const DIAGRAM_TOUCHBAR_TARGET_CLASS = 'dx-diagram-touchbar-target';
const DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
const DIAGRAM_TOUCHBAR_Y_OFFSET = 32;

interface Properties extends ContextMenuProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVisibilityChanging?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInternalCommand?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCustomCommand?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export?: any;
}

class DiagramContextMenu extends ContextMenu {
  _renderContextMenuOverlay(): void {
    super._renderContextMenuOverlay();

    if (this._overlay && this.option('isTouchBarMode')) {
      this._overlay.option('onShown', () => {
        const $content = $(this._overlay?.$content());
        $content.parent().addClass(DIAGRAM_TOUCHBAR_OVERLAY_CLASS);
      });
    }
  }
}

class DiagramContextMenuBar extends DiagramBar {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getCommandKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getKeys(this._owner._commands);
  }

  setItemValue(key, value): void {
    this._owner._setItemValue(key, value);
  }

  setItemEnabled(key, enabled): void {
    this._owner._setItemEnabled(key, enabled);
  }

  setItemVisible(key, visible): void {
    this._owner._setItemVisible(key, visible);
  }

  setItemSubItems(key, items): void {
    this._owner._setItemSubItems(key, items);
  }

  setEnabled(enabled): void {
    this._owner._setEnabled(enabled);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  isVisible() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._owner.isVisible();
  }
}

class DiagramContextMenuWrapper extends Widget<Properties> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _commands?: any;

  private _inOnShowing?: boolean;

  private _contextMenuInstance?: DiagramContextMenu;

  private _$contextMenuTargetElement?: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _commandToIndexMap?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onItemClickAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onVisibilityChangingAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onInternalCommandAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onCustomCommandAction?: any;

  bar?: DiagramContextMenuBar;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _tempState?: any;

  _init(): void {
    super._init();

    this._createOnVisibilityChangingAction();
    this._createOnInternalCommand();
    this._createOnCustomCommand();
    this._createOnItemClickAction();
    this._tempState = undefined;

    this._commands = [];
    this._commandToIndexMap = {};
    this.bar = new DiagramContextMenuBar(this);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._commands = this._getCommands();
    this._commandToIndexMap = {};
    this._fillCommandToIndexMap(this._commands, []);

    this._$contextMenuTargetElement = $('<div>')
      .addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS)
      .appendTo(this.$element());

    const $contextMenu = $('<div>').appendTo(this.$element());

    this._contextMenuInstance = this._createComponent(
      $contextMenu,
      DiagramContextMenu,
      {
        isTouchBarMode: this._isTouchBarMode(),
        cssClass: this._isTouchBarMode()
          ? DIAGRAM_TOUCHBAR_CLASS
          : DiagramMenuHelper.getContextMenuCssClass(),
        hideOnOutsideClick: false,
        showEvent: '',
        focusStateEnabled: false,
        items: this._commands,
        // @ts-expect-error ts-error
        position: this._isTouchBarMode()
          ? {
            my: { x: 'center', y: 'bottom' },
            at: { x: 'center', y: 'top' },
            of: this._$contextMenuTargetElement,
          }
          : {},
        itemTemplate(itemData, itemIndex, itemElement) {
          DiagramMenuHelper.getContextMenuItemTemplate(
            this,
            itemData,
            itemIndex,
            itemElement,
          );
        },
        onItemClick: ({ itemData }) => this._onItemClick(itemData),
        onShowing: (e) => {
          if (this._inOnShowing === true) return;

          this._inOnShowing = true;
          this._onVisibilityChangingAction({ visible: true, component: this });
          e.component.option('items', e.component.option('items'));
          delete this._inOnShowing;
        },
      },
    );
  }

  _show(x, y, selection): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._contextMenuInstance?.hide();
    if (this._isTouchBarMode()) {
      this._$contextMenuTargetElement?.show();
      if (!selection) {
        // eslint-disable-next-line no-param-reassign
        selection = {
          x, y, width: 0, height: 0,
        };
      }
      const widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH
        ? 0
        : (DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH - selection.width) / 2;
      this._$contextMenuTargetElement?.css({
        left: selection.x - widthCorrection,
        top: selection.y - DIAGRAM_TOUCHBAR_Y_OFFSET,
        width: selection.width + 2 * widthCorrection,
        height: selection.height + 2 * DIAGRAM_TOUCHBAR_Y_OFFSET,
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._contextMenuInstance?.show();
    } else {
      this._contextMenuInstance?.option('position', { offset: `${x} ${y}` });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._contextMenuInstance?.show();
    }
  }

  _hide(): void {
    this._$contextMenuTargetElement?.hide();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._contextMenuInstance?.hide();
  }

  _isTouchBarMode(): unknown {
    const { Browser } = getDiagram();
    return Browser.TouchUI;
  }

  _onItemClick(itemData): void {
    let processed = false;
    if (this._onItemClickAction) {
      processed = this._onItemClickAction(itemData);
    }

    if (!processed) {
      DiagramMenuHelper.onContextMenuItemClick(
        this,
        itemData,
        this._executeCommand.bind(this),
      );
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._contextMenuInstance?.hide();
    }
  }

  _executeCommand(command, name, value): void {
    if (typeof command === 'number') {
      this.bar?.raiseBarCommandExecuted(command, value);
    } else if (typeof command === 'string') {
      this._onInternalCommandAction({ command });
    }
    if (name !== undefined) {
      this._onCustomCommandAction({ name });
    }
  }

  _createOnInternalCommand(): void {
    this._onInternalCommandAction = this._createActionByOption('onInternalCommand');
  }

  _createOnCustomCommand(): void {
    this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getCommands(): any {
    return DiagramCommandsManager.getContextMenuCommands(
      this.option('commands'),
    );
  }

  _fillCommandToIndexMap(commands, indexPath): void {
    commands.forEach((command, index) => {
      const commandIndexPath = indexPath.concat([index]);
      if (command.command !== undefined) {
        this._commandToIndexMap[command.command] = commandIndexPath;
      }
      if (Array.isArray(command.items)) {
        this._fillCommandToIndexMap(command.items, commandIndexPath);
      }
    });
  }

  _setItemEnabled(key, enabled): void {
    this._setItemVisible(key, enabled);
  }

  _setItemVisible(key, visible): void {
    const itemOptionText = DiagramMenuHelper.getItemOptionText(
      this._contextMenuInstance,
      this._commandToIndexMap[key],
    );
    DiagramMenuHelper.updateContextMenuItemVisible(
      this._contextMenuInstance,
      itemOptionText,
      visible,
    );
  }

  _setItemValue(key, value): void {
    const itemOptionText = DiagramMenuHelper.getItemOptionText(
      this._contextMenuInstance,
      this._commandToIndexMap[key],
    );
    DiagramMenuHelper.updateContextMenuItemValue(
      this._contextMenuInstance,
      itemOptionText,
      key,
      value,
    );
  }

  _setItemSubItems(key, items): void {
    const itemOptionText = DiagramMenuHelper.getItemOptionText(
      this._contextMenuInstance,
      this._commandToIndexMap[key],
    );
    DiagramMenuHelper.updateContextMenuItems(
      this._contextMenuInstance,
      itemOptionText,
      key,
      items,
    );
  }

  _setEnabled(enabled: boolean): void {
    this._contextMenuInstance?.option('disabled', !enabled);
  }

  isVisible(): boolean | undefined {
    return this._inOnShowing;
  }

  _createOnVisibilityChangingAction(): void {
    this._onVisibilityChangingAction = this._createActionByOption(
      'onVisibilityChanging',
    );
  }

  _createOnItemClickAction(): void {
    this._onItemClickAction = this._createActionByOption('onItemClick');
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    switch (args.name) {
      case 'onVisibilityChanging':
        this._createOnVisibilityChangingAction();
        break;
      case 'onInternalCommand':
        this._createOnInternalCommand();
        break;
      case 'onCustomCommand':
        this._createOnCustomCommand();
        break;
      case 'onItemClick':
        this._createOnItemClickAction();
        break;
      case 'commands':
        this._invalidate();
        break;
      case 'export':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default { DiagramContextMenuWrapper, DiagramContextMenu };
