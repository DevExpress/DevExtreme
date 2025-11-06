/* eslint-disable @typescript-eslint/explicit-module-boundary-types,max-depth */
// eslint-disable-next-line max-classes-per-file
import '@js/ui/select_box';
import '@js/ui/color_box';
import '@js/ui/check_box';

import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getWidth, setWidth } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import ContextMenu from '@js/ui/context_menu';
import type { Command } from '@js/ui/diagram';
import Toolbar from '@js/ui/toolbar';
import DiagramBar from '@ts/ui/diagram/diagram.bar';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';
import DiagramMenuHelper from '@ts/ui/diagram/ui.diagram.menu_helper';
import DiagramPanel from '@ts/ui/diagram/ui.diagram.panel';

const ACTIVE_FORMAT_CLASS = 'dx-format-active';
const DIAGRAM_TOOLBAR_CLASS = 'dx-diagram-toolbar';
const DIAGRAM_TOOLBAR_SEPARATOR_CLASS = 'dx-diagram-toolbar-separator';
const DIAGRAM_TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-diagram-toolbar-menu-separator';
const DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS = 'dx-diagram-mobile-toolbar-color-box-opened';

class DiagramToolbarItemHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _widget: any;

  constructor(widget) {
    this._widget = widget;
  }

  canUpdate(showingSubMenu): boolean {
    return showingSubMenu === undefined;
  }

  setEnabled(enabled): void {
    this._widget.option('disabled', !enabled);
  }

  setValue(value, displayValue, contextMenu, rootCommandKey): void {
    if ('value' in this._widget.option()) {
      this._updateEditorValue(value, displayValue);
    } else if (value !== undefined) {
      this._updateButtonValue(value);
    }
    if (contextMenu) {
      this._updateContextMenuItemValue(contextMenu, '', rootCommandKey, value);
    }
  }

  setItems(items, contextMenu, rootCommandKey): void {
    if (contextMenu) {
      this._updateContextMenuItems(contextMenu, '', rootCommandKey, items);
    } else {
      this._updateEditorItems(items);
    }
  }

  _updateContextMenuItems(contextMenu, itemOptionText, rootCommandKey, items): void {
    DiagramMenuHelper.updateContextMenuItems(
      contextMenu,
      itemOptionText,
      rootCommandKey,
      items,
    );
  }

  _updateEditorItems(items): void {
    if ('items' in this._widget.option()) {
      this._widget.option(
        'items',
        items.map((item) => ({
          value: DiagramMenuHelper.getItemValue(item),
          text: item.text,
        })),
      );
    }
  }

  _updateEditorValue(value, displayValue): void {
    this._widget.option('value', value);
    if (!this._widget.option('selectedItem') && displayValue) {
      this._widget.option('value', displayValue);
    }
  }

  _updateButtonValue(value): void {
    if (
      this._widget.option('iconChecked')
      && this._widget.option('iconUnchecked')
    ) {
      this._widget.option(
        'icon',
        value
          ? this._widget.option('iconChecked')
          : this._widget.option('iconUnchecked'),
      );
    } else {
      this._widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _updateContextMenuItemValue(
    contextMenu,
    itemOptionText,
    rootCommandKey,
    value,
  ) {
    DiagramMenuHelper.updateContextMenuItemValue(
      contextMenu,
      itemOptionText,
      rootCommandKey,
      value,
    );
  }
}

class DiagramToolbarSubItemHelper extends DiagramToolbarItemHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _indexPath?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _rootCommandKey?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _rootWidget?: any;

  constructor(widget, indexPath, rootCommandKey, rootWidget) {
    super(widget);
    this._indexPath = indexPath;
    this._rootCommandKey = rootCommandKey;
    this._rootWidget = rootWidget;
  }

  canUpdate(showingSubMenu): boolean {
    return super.canUpdate(showingSubMenu) || showingSubMenu === this._widget;
  }

  setEnabled(enabled): void {
    this._widget.option(`${this._getItemOptionText()}disabled`, !enabled);
    const rootEnabled = this._hasEnabledCommandItems(
      this._widget.option('items'),
    );
    this._rootWidget.option('disabled', !rootEnabled);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _hasEnabledCommandItems(items) {
    if (items) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return items.some(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (item) => (item.command !== undefined && !item.disabled)
          || this._hasEnabledCommandItems(item.items),
      );
    }
    return false;
  }

  setValue(value): void {
    this._updateContextMenuItemValue(
      this._widget,
      this._getItemOptionText(),
      this._rootCommandKey,
      value,
    );
  }

  setItems(items): void {
    this._updateContextMenuItems(
      this._widget,
      this._getItemOptionText(),
      this._rootCommandKey,
      items,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemOptionText() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return DiagramMenuHelper.getItemOptionText(this._widget, this._indexPath);
  }
}

class DiagramToolbarBar extends DiagramBar {
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

  setEnabled(enabled): void {
    this._owner._setEnabled(enabled);
  }

  setItemSubItems(key, items): void {
    this._owner._setItemSubItems(key, items);
  }
}

class DiagramToolbar extends DiagramPanel {
  private _commands?: Command[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _itemHelpers?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _commandContextMenus?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly contextMenuList?: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _valueConverters?: any;

  public bar?: DiagramToolbarBar;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _contextMenuList?: any[];

  private _toolbarInstance?: Toolbar;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _showingSubMenu?: any;

  private _updateLocked?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onInternalCommandAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onCustomCommandAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onSubMenuVisibilityChangingAction?: any;

  _init(): void {
    this._commands = [];
    this._itemHelpers = {};
    this._commandContextMenus = {};
    this._contextMenuList = [];
    this._valueConverters = {};
    this.bar = new DiagramToolbarBar(this);

    this._createOnInternalCommand();
    this._createOnCustomCommand();
    this._createOnSubMenuVisibilityChangingAction();

    super._init();
  }

  _initMarkup(): void {
    super._initMarkup();

    const isServerSide = !hasWindow();
    if (!this.option('skipAdjustSize') && !isServerSide) {
      setWidth(this.$element(), '');
    }

    this._commands = this._getCommands();
    this._itemHelpers = {};
    this._commandContextMenus = {};
    this._contextMenuList = [];

    const $toolbar = this._createMainElement();
    this._renderToolbar($toolbar);

    if (!this.option('skipAdjustSize') && !isServerSide) {
      const $toolbarContent = this.$element().find('.dx-toolbar-before');
      setWidth(this.$element(), getWidth($toolbarContent));
    }
  }

  _createMainElement(): dxElementWrapper {
    return $('<div>').addClass(DIAGRAM_TOOLBAR_CLASS).appendTo(this.$element());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCommands() {
    // @ts-expect-error ts-error
    const { commands } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return commands || [];
  }

  _renderToolbar($toolbar): void {
    const beforeCommands = this._commands?.filter(
      // @ts-expect-error ts-error
      (command) => !['after', 'center'].includes(command.location),
    );
    const centerCommands = this._commands?.filter(
      // @ts-expect-error ts-error
      (command) => command.location === 'center',
    );
    const afterCommands = this._commands?.filter(
      // @ts-expect-error ts-error
      (command) => command.location === 'after',
    );
    const dataSource = []
      .concat(
        this._prepareToolbarItems(
          beforeCommands,
          'before',
          this._executeCommand,
        ),
      )
      .concat(
        this._prepareToolbarItems(
          centerCommands,
          'center',
          this._executeCommand,
        ),
      )
      .concat(
        this._prepareToolbarItems(afterCommands, 'after', this._executeCommand),
      );
    this._toolbarInstance = this._createComponent($toolbar, Toolbar, {
      dataSource,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _prepareToolbarItems(items, location, actionHandler) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items.map((item) => extend(
      true,
      { location, locateInMenu: this.option('locateInMenu') },
      this._createItem(item, location, actionHandler),
      this._createItemOptions(item),
      this._createItemActionOptions(item, actionHandler),
    ));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createItem(item, location, actionHandler) {
    if (
      item.getCommandValue
      || item.getEditorValue
      || item.getEditorDisplayValue
    ) {
      this._valueConverters[item.command] = {
        getCommandValue: item.getCommandValue,
        getEditorValue: item.getEditorValue,
        getEditorDisplayValue: item.getEditorDisplayValue,
      };
    }
    if (item.widget === 'separator') {
      return {
        template: (data, index, element): void => {
          $(element).addClass(DIAGRAM_TOOLBAR_SEPARATOR_CLASS);
        },
        menuItemTemplate: (data, index, element): void => {
          $(element).addClass(DIAGRAM_TOOLBAR_MENU_SEPARATOR_CLASS);
        },
      };
    }
    return {
      widget: item.widget || 'dxButton',
      cssClass: item.cssClass,
      options: {
        stylingMode: this.option('buttonStylingMode'),
        type: this.option('buttonType'),
        text: item.text,
        hint: item.hint,
        icon: item.icon || item.iconUnchecked || item.iconChecked,
        iconChecked: item.iconChecked,
        iconUnchecked: item.iconUnchecked,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onInitialized: (e) => this._onItemInitialized(e.component, item),
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onContentReady: (e) => this._onItemContentReady(e.component, item, actionHandler),
      },
    };
  }

  // @ts-expect-error ts-error
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,consistent-return
  _createItemOptions({
    widget,
    command,
    items,
    valueExpr,
    displayExpr,
    showText,
    hint,
    icon,
  }) {
    if (widget === 'dxSelectBox') {
      return this._createSelectBoxItemOptions(
        command,
        hint,
        items,
        valueExpr,
        displayExpr,
      );
    }
    if (widget === 'dxTextBox') {
      return this._createTextBoxItemOptions(command, hint);
    }
    if (widget === 'dxColorBox') {
      return this._createColorBoxItemOptions(command, hint, icon);
    }
    if (!widget || widget === 'dxButton') {
      return {
        showText: showText || 'inMenu',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createSelectBoxItemOptions(command, hint, items, valueExpr, displayExpr) {
    let options = this._createTextEditorItemOptions(hint);
    options = extend(true, options, {
      options: {
        dataSource: items,
        displayExpr: displayExpr || 'text',
        valueExpr: valueExpr || 'value',
      },
    });

    const isSelectButton = items?.every((i): boolean => i.icon !== undefined);
    const nullIconClass = 'dx-diagram-i-selectbox-null-icon dx-diagram-i';
    if (isSelectButton) {
      options = extend(true, options, {
        options: {
          fieldAddons: {
            beforeTemplate: (data, container): void => {
              $('<i>')
                .addClass(data?.icon || nullIconClass)
                .appendTo(container);
            },
          },
          itemTemplate: (data, _, container): string => {
            $(container).attr('title', data.hint);
            return `<i class="${data.icon}"></i>`;
          },
        },
      });
    }
    return options;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createTextBoxItemOptions(command, hint) {
    let options = this._createTextEditorItemOptions(hint);
    options = extend(true, options, {
      options: {
        readOnly: true,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        buttons: [
          {
            name: 'dropDown',
            location: 'after',
            options: {
              icon: 'spindown',
              disabled: false,
              stylingMode: 'text',
              onClick: (): void => {
                const contextMenu = this._commandContextMenus[command];
                if (contextMenu) {
                  this._toggleContextMenu(contextMenu);
                }
              },
            },
          },
        ],
      },
    });
    return options;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createColorBoxItemOptions(command, hint, icon) {
    let options = this._createTextEditorItemOptions(hint);
    if (icon) {
      options = extend(true, options, {
        options: {
          openOnFieldClick: true,
          fieldAddons: {
            beforeTemplate: (data, container) => {
              $('<i>')
                .addClass(icon)
                .css('borderBottomColor', data)
                .appendTo(container);
            },
          },
        },
      });
    }
    options = extend(true, options, {
      options: {
        onOpened: () => {
          if (this.option('isMobileView')) {
            $('body').addClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
          }
        },
        onClosed: () => {
          $('body').removeClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
        },
      },
    });
    return options;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createTextEditorItemOptions(hint) {
    return {
      options: {
        stylingMode: this.option('editorStylingMode'),
        hint,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createItemActionOptions(item, handler) {
    switch (item.widget) {
      case 'dxSelectBox':
      case 'dxColorBox':
      case 'dxCheckBox':
        return {
          options: {
            onValueChanged: (e): void => {
              const parameter = DiagramMenuHelper.getItemCommandParameter(
                this,
                item,
                e.component.option('value'),
              );
              handler.call(this, item.command, item.name, parameter);
            },
          },
        };
      case 'dxTextBox':
        return {};
      default:
        return {
          options: {
            onClick: (e): void => {
              if (!item.items) {
                // @ts-expect-error ts-error
                const parameter = DiagramMenuHelper.getItemCommandParameter(
                  this,
                  item,
                );
                handler.call(this, item.command, item.name, parameter);
              } else {
                const contextMenu = e.component._contextMenu;
                if (contextMenu) {
                  this._toggleContextMenu(contextMenu);
                }
              }
            },
          },
        };
    }
  }

  _toggleContextMenu(contextMenu): void {
    this._contextMenuList?.forEach((cm): void => {
      if (contextMenu !== cm) {
        cm.hide();
      }
    });
    contextMenu.toggle();
  }

  _onItemInitialized(widget, item): void {
    this._addItemHelper(item.command, new DiagramToolbarItemHelper(widget));
  }

  _onItemContentReady(widget, item, actionHandler): void {
    if (
      (widget.NAME === 'dxButton' || widget.NAME === 'dxTextBox')
      && item.items
    ) {
      const isTouchMode = this._isTouchMode();
      const $menuContainer = $('<div>').appendTo(this.$element());
      widget._contextMenu = this._createComponent($menuContainer, ContextMenu, {
        items: item.items,
        target: widget.$element(),
        cssClass: DiagramMenuHelper.getContextMenuCssClass(),
        showEvent: '',
        hideOnOutsideClick: (e): boolean => !isTouchMode
          && $(e.target).closest(widget._contextMenu._dropDownButtonElement)
            .length === 0,
        focusStateEnabled: false,
        position: { at: 'left bottom' },
        itemTemplate(itemData, itemIndex, itemElement): void {
          DiagramMenuHelper.getContextMenuItemTemplate(
            this,
            itemData,
            itemIndex,
            itemElement,
          );
        },
        onItemClick: ({ component, itemData }): void => {
          DiagramMenuHelper.onContextMenuItemClick(
            this,
            itemData,
            actionHandler.bind(this),
          );
          if (!itemData?.items?.length) {
            component.hide();
          }
        },
        onShowing: (e): void => {
          if (this._showingSubMenu) return;

          this._showingSubMenu = e.component;
          this._onSubMenuVisibilityChangingAction({
            visible: true,
            component: this,
          });
          e.component.option('items', e.component.option('items'));
          delete this._showingSubMenu;
        },
        // eslint-disable-next-line @stylistic/max-len
        onInitialized: ({ component }): void => this._onContextMenuInitialized(component, item, widget),
        onDisposing: ({ component }): void => this._onContextMenuDisposing(component, item),
      });

      // prevent showing context menu by toggle "close" click
      if (!isTouchMode) {
        // i.e. widget.NAME === 'dxButton'
        widget._contextMenu._dropDownButtonElement = widget.$element();
        if (widget.NAME === 'dxTextBox') {
          widget._contextMenu._dropDownButtonElement = widget
            .getButton('dropDown')
            .element();
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _isTouchMode() {
    const { Browser } = getDiagram();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Browser.TouchUI;
  }

  _onContextMenuInitialized(widget, item, rootWidget): void {
    this._contextMenuList?.push(widget);
    if (item.command) {
      this._commandContextMenus[item.command] = widget;
    }
    this._addContextMenuHelper(item, widget, [], rootWidget);
  }

  _addItemHelper(command, helper): void {
    if (command !== undefined) {
      if (this._itemHelpers[command]) {
        throw new Error('Toolbar cannot contain duplicated commands.');
      }
      this._itemHelpers[command] = helper;
    }
  }

  _addContextMenuHelper(item, widget, indexPath, rootWidget): void {
    if (item.items) {
      item.items.forEach((subItem, index) => {
        const itemIndexPath = indexPath.concat(index);
        this._addItemHelper(
          subItem.command,
          new DiagramToolbarSubItemHelper(
            widget,
            itemIndexPath,
            subItem.command,
            rootWidget,
          ),
        );
        this._addContextMenuHelper(subItem, widget, itemIndexPath, rootWidget);
      });
    }
  }

  _onContextMenuDisposing(widget, item): void {
    this._contextMenuList?.splice(this._contextMenuList.indexOf(widget), 1);
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._commandContextMenus[item.command];
  }

  _executeCommand(command, name, value): void {
    if (this._updateLocked) return;

    if (typeof command === 'number') {
      const valueConverter = this._valueConverters[command];
      if (valueConverter?.getCommandValue) {
        // eslint-disable-next-line no-param-reassign
        value = valueConverter.getCommandValue(value);
      }
      this.bar?.raiseBarCommandExecuted(command, value);
    } else if (typeof command === 'string') {
      this._onInternalCommandAction({ command });
    }
    if (name !== undefined) {
      this._onCustomCommandAction({ name });
    }
  }

  _createOnInternalCommand(): void {
    // @ts-expect-error ts-error
    this._onInternalCommandAction = this._createActionByOption('onInternalCommand');
  }

  _createOnCustomCommand(): void {
    // @ts-expect-error ts-error
    this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
  }

  _setItemEnabled(command, enabled): void {
    if (command in this._itemHelpers) {
      const helper = this._itemHelpers[command];
      if (helper.canUpdate(this._showingSubMenu)) {
        helper.setEnabled(enabled);
      }
    }
  }

  _setEnabled(enabled): void {
    this._toolbarInstance?.option('disabled', !enabled);
    this._contextMenuList?.forEach((contextMenu) => {
      contextMenu.option('disabled', !enabled);
    });
  }

  _setItemValue(command, value): void {
    try {
      this._updateLocked = true;
      if (command in this._itemHelpers) {
        const helper = this._itemHelpers[command];
        if (helper.canUpdate(this._showingSubMenu)) {
          const valueConverter = this._valueConverters[command];
          if (valueConverter?.getEditorValue) {
            // eslint-disable-next-line no-param-reassign
            value = valueConverter.getEditorValue(value);
          }
          // eslint-disable-next-line @typescript-eslint/init-declarations
          let displayValue;
          if (valueConverter?.getEditorDisplayValue) {
            displayValue = valueConverter.getEditorDisplayValue(value);
          }
          const contextMenu = this._commandContextMenus[command];
          helper.setValue(
            value,
            displayValue,
            contextMenu,
            contextMenu && command,
          );
        }
      }
    } finally {
      this._updateLocked = false;
    }
  }

  _setItemSubItems(command, items): void {
    this._updateLocked = true;
    if (command in this._itemHelpers) {
      const helper = this._itemHelpers[command];
      if (helper.canUpdate(this._showingSubMenu)) {
        const contextMenu = this._commandContextMenus[command];
        helper.setItems(items, contextMenu, contextMenu && command);
      }
    }
    this._updateLocked = false;
  }

  _createOnSubMenuVisibilityChangingAction(): void {
    this._onSubMenuVisibilityChangingAction = this._createActionByOption(
      // @ts-expect-error ts-error
      'onSubMenuVisibilityChanging',
    );
  }

  _optionChanged(args): void {
    switch (args.name) {
      case 'isMobileView':
        $('body').removeClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
        this._invalidate();
        break;
      case 'onSubMenuVisibilityChanging':
        this._createOnSubMenuVisibilityChangingAction();
        break;
      case 'onInternalCommand':
        this._createOnInternalCommand();
        break;
      case 'onCustomCommand':
        this._createOnCustomCommand();
        break;
      case 'container':
      case 'commands':
        this._invalidate();
        break;
      case 'export':
        break;
      default:
        super._optionChanged(args);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      isMobileView: false,
      export: {
        fileName: 'Diagram',
      },
      locateInMenu: 'auto',
      buttonStylingMode: 'text',
      buttonType: 'normal',
      editorStylingMode: 'filled',
      skipAdjustSize: false,
    });
  }

  setCommandChecked(command, checked): void {
    this._setItemValue(command, checked);
  }

  setCommandEnabled(command, enabled): void {
    this._setItemEnabled(command, enabled);
  }
}

export default DiagramToolbar;
