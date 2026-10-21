import '@js/ui/select_box';
import '@ts/ui/color_box/color_view';
import '@js/ui/number_box';
import '@js/ui/menu';

import type { ToolbarItemComponent } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { camelize, titleize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isEmptyObject, isObject, isString,
} from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type {
  AICommandName,
  AICustomCommand,
  AIToolbarItem,
  dxHtmlEditorToolbar,
  dxHtmlEditorToolbarItem,
  OptionChangedEvent,
} from '@js/ui/html_editor';
import type { ContentReadyEvent, ItemClickEvent } from '@js/ui/menu';
import type { ValueChangedEvent as SelectBoxValueChangedEvent } from '@js/ui/select_box';
import type { Item } from '@js/ui/toolbar';
import errors from '@js/ui/widget/ui.errors';
import { getPublicElement } from '@ts/core/element';
import { capitalize } from '@ts/core/utils/capitalize';
import { DX_MENU_ITEM_CLASS } from '@ts/ui/menu/menu';
import { DROP_DOWN_MENU_BUTTON_CLASS } from '@ts/ui/toolbar/constants';
import { applyItemTabIndex } from '@ts/ui/toolbar/internal/roving.utils';
import type DropDownMenu from '@ts/ui/toolbar/internal/toolbar.menu';
import type { Properties as ToolbarProperties } from '@ts/ui/toolbar/toolbar';
import Toolbar from '@ts/ui/toolbar/toolbar';
import { TOOLBAR_ITEM_CLASS } from '@ts/ui/toolbar/toolbar.base';
import { getItemFocusTarget } from '@ts/ui/toolbar/toolbar.utils';
import Quill from 'devextreme-quill';

import type { AITextTransformOptions, FormatHandler, FormatHandlers } from '../types';
import type {
  KeyboardBinding,
  QuillInstance,
  RangeStatic,
} from '../types/quill';
import type { CommandsMap } from '../utils/ai';
import {
  buildCommandsMap,
  commandMessageKeys,
  getDefaultCommandName,
  getDefaultOptionsByCommand,
  hasInvalidCustomCommand,
} from '../utils/ai';
import { getTableFormats, TABLE_OPERATIONS } from '../utils/table_helper';
import {
  applyFormat, getDefaultClickHandler, getFormatHandlers, ICON_MAP,
} from '../utils/toolbar_helper';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';
import WidgetCollector from './widget_collector';

interface ToolbarModuleOptions extends BaseModuleOptions, dxHtmlEditorToolbar {}

interface ToolbarItemWidget {
  NAME?: string;
  $element: () => dxElementWrapper;
  option: {
    (): object;
    (name: string, value: unknown): void;
  };
}

interface ToolbarItemInitializedEvent {
  component: ToolbarItemWidget;
}

interface AIMenuItem {
  id: string;
  icon?: string;
  name?: string;
  text?: string;
  items?: AIMenuItem[];
  parentCommand?: string;
  options?: string[];
  prompt?: AICustomCommand['prompt'];
  disabled?: boolean;
}

type ToolbarItemTemplate = (data: unknown, index: number, element: DxElement) => void;

interface DefaultItemConfig {
  options?: { disabled: boolean };
  template?: ToolbarItemTemplate;
  menuItemTemplate?: ToolbarItemTemplate;
}

// eslint-disable-next-line import/no-mutable-exports
let ToolbarModule = BaseModule;

if (Quill) {
  const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
  const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
  const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
  const TOOLBAR_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-separator';
  const TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-menu-separator';
  const ACTIVE_FORMAT_CLASS = 'dx-format-active';
  const SELECTED_STATE_CLASS = 'dx-state-selected';

  const ICON_CLASS = 'dx-icon';

  const SELECTION_CHANGE_EVENT = 'selection-change';

  const USER_ACTION = 'user';
  const SILENT_ACTION = 'silent';

  const FORMAT_HOTKEYS = {
    66: 'bold',
    73: 'italic',
    85: 'underline',
  };

  const KEY_CODES = {
    b: 66,
    i: 73,
    u: 85,
  };

  const TOOLBAR_AI_ITEM_NAME = 'ai';

  const localize = (name: string): string => (
    localizationMessage.format(`dxHtmlEditor-${camelize(name)}`)
  );

  const localizeValue = (
    value: string | number | boolean,
    name: string,
  ): string | number | boolean => {
    if (name === 'header') {
      const isHeaderValue = isDefined(value) && value !== false;
      return isHeaderValue ? `${localize('heading')} ${value}` : localize('normalText');
    }

    // @ts-expect-error localize() takes a string; acceptedValues may hold numbers and booleans
    return localize(value) || value;
  };
  ToolbarModule = class extends BaseModule {
    declare options: ToolbarModuleOptions;

    _toolbarWidgets: WidgetCollector<ToolbarItemWidget>;

    toolbarInstance?: Toolbar;

    _$toolbar?: dxElementWrapper;

    _$toolbarContainer?: dxElementWrapper;

    _formatHandlers: FormatHandlers;

    _tableFormats: string[];

    _isReset?: boolean;

    editorOptionChangedHandler?: (e: OptionChangedEvent) => void;

    constructor(quill: QuillInstance, options: ToolbarModuleOptions) {
      super(quill, options);

      this._toolbarWidgets = new WidgetCollector<ToolbarItemWidget>();
      this._formatHandlers = getFormatHandlers(this);
      this._tableFormats = getTableFormats(quill);

      if (isDefined(options.items)) {
        this._addCallbacks();
        this._renderToolbar();

        // NOTE: Fixes the synchronization of the states of items placed in a menu
        // that is rendered postponed.
        // See bug t1117604: menu items' state could be updated after selection change
        // before the menu is rendered.
        // We cannot just modify items' state using a toolbar api because of:
        // - runtime adding in-line styles for color formats' icon;
        // - "dx-format-active" class toggling
        //   (using elementAttr will trigger toolbar item rerendering);
        // - changing the value of non-button items.
        // Possible better solutions:
        // - rework or extend a toolbar menu api or life cycle;
        // - support a separate cache for toolbar items' state
        //   and apply it on each item's initialization.
        // @ts-expect-error _menu exists on the single-line strategy only; the toolbar is rendered
        const toolbarMenu: DropDownMenu | undefined = this.toolbarInstance._layoutStrategy._menu;
        if (toolbarMenu) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { _renderPopup } = toolbarMenu;
          toolbarMenu._renderPopup = (): void => {
            const previousPopup = toolbarMenu._popup;
            _renderPopup.call(toolbarMenu);
            const popup = toolbarMenu._popup;
            if (popup && popup !== previousPopup) {
              popup.on('showing', () => { this._updateToolbar(true); });
            }
          };
        }

        this.quill.on('editor-change', (eventName, newValue, oldValue, eventSource) => {
          const isSilentMode = eventSource === SILENT_ACTION
            && isEmptyObject(this.quill.getFormat());

          if (!isSilentMode) {
            const isSelectionChanged = eventName === SELECTION_CHANGE_EVENT;

            this._updateToolbar(isSelectionChanged);
          }

          this._updateHeaderFormatWidget();
        });
      }
    }

    _addCallbacks(): void {
      this.addCleanCallback(this.clean.bind(this));
      this.editorInstance.addContentInitializedCallback(this.updateHistoryWidgets.bind(this));
    }

    _updateToolbar(isSelectionChanged: boolean): void {
      this.updateFormatWidgets(isSelectionChanged);
      this.updateHistoryWidgets();
      this.updateTableWidgets();
    }

    _updateFormatWidget(name: string, isApplied: boolean, formats: Record<string, unknown>): void {
      const widget = this._toolbarWidgets.getByName(name);

      if (!widget) {
        return;
      }

      if (isApplied) {
        this._markActiveFormatWidget(name, widget, formats);
      } else {
        this._resetFormatWidget(name, widget);
        if (Object.prototype.hasOwnProperty.call(formats, name)) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete formats[name];
        }
      }

      this._toggleClearFormatting(isApplied || !isEmptyObject(formats));
    }

    _renderToolbar(): void {
      const container = this.options.container || this._getContainer();

      this._$toolbar = $('<div>')
        .addClass(TOOLBAR_CLASS)
        // @ts-expect-error appendTo() is typed without selector strings; container may be one
        .appendTo(container);
      this._$toolbarContainer = $(container).addClass(TOOLBAR_WRAPPER_CLASS);

      eventsEngine.on(
        this._$toolbarContainer,
        // @ts-expect-error NAME is typed optional (component.ts); the constructor always sets it
        addNamespace('mousedown', this.editorInstance.NAME),
        (e: DxEvent<MouseEvent>): void => {
          // @ts-expect-error target is typed Element; focus() is declared on HTMLElement
          e.target.focus();
          e.preventDefault();

          const $item = $(e.target)
            .closest(`.${TOOLBAR_ITEM_CLASS}, .${DROP_DOWN_MENU_BUTTON_CLASS}`);
          if ($item.length && getItemFocusTarget($item)?.length) {
            // @ts-expect-error toolbarInstance is set by _renderToolbar, which precedes this call
            this.toolbarInstance.option('focusedElement', getPublicElement($item));
          }
        },
      );

      this._subscribeFormatHotKeys();

      this.toolbarInstance = this.editorInstance._createComponent(
        this._$toolbar,
        Toolbar,
        this.toolbarConfig,
      );

      this.editorOptionChangedHandler = ({ name }: OptionChangedEvent): void => {
        if (name === 'readOnly' || name === 'disabled') {
          // @ts-expect-error toolbarInstance is set by _renderToolbar, which precedes this call
          this.toolbarInstance.option('disabled', this.isInteractionDisabled);
        }
      };
      this.editorInstance.on('optionChanged', this.editorOptionChangedHandler);
    }

    get toolbarConfig(): Partial<ToolbarProperties> {
      return {
        dataSource: this._prepareToolbarItems(),
        disabled: this.isInteractionDisabled,
        // @ts-expect-error menuContainer is typed string | Element (toolbar.ts); a wrapper works
        menuContainer: this._$toolbarContainer,
        multiline: this.isMultilineMode(),
      };
    }

    get isInteractionDisabled(): boolean | undefined {
      return this.editorInstance.option('readOnly') || this.editorInstance.option('disabled');
    }

    isMultilineMode(): boolean {
      return this.options.multiline ?? true;
    }

    clean(): void {
      this._toolbarWidgets.clear();

      if (this._$toolbarContainer) {
        this._$toolbarContainer
          .empty()
          .removeClass(TOOLBAR_WRAPPER_CLASS);
      }

      if (this.editorOptionChangedHandler) {
        this.editorInstance.off('optionChanged', this.editorOptionChangedHandler);
      }
    }

    repaint(): void {
      if (this.toolbarInstance) {
        this.toolbarInstance.repaint();
      }
    }

    focusFirstItem(): boolean {
      return this.toolbarInstance?.focusFirstItem() ?? false;
    }

    _getContainer(): dxElementWrapper {
      const $container = $('<div>');

      this.editorInstance.$element().prepend($container);

      return $container;
    }

    _subscribeFormatHotKeys(): void {
      this.quill.keyboard.addBinding({
        which: KEY_CODES.b,
        shortKey: true,
      }, this._handleFormatHotKey.bind(this));

      this.quill.keyboard.addBinding({
        which: KEY_CODES.i,
        shortKey: true,
      }, this._handleFormatHotKey.bind(this));

      this.quill.keyboard.addBinding({
        which: KEY_CODES.u,
        shortKey: true,
      }, this._handleFormatHotKey.bind(this));
    }

    _handleFormatHotKey(
      range: RangeStatic,
      context: unknown,
      { which }: KeyboardBinding,
    ): void {
      // @ts-expect-error which is optional in KeyboardBinding; the bindings above set it
      const formatName = FORMAT_HOTKEYS[which];

      this._updateButtonState(formatName);
    }

    _updateButtonState(formatName: string): void {
      const formatWidget = this._toolbarWidgets.getByName(formatName);

      if (!formatWidget) {
        return;
      }

      const currentFormat = this.quill.getFormat();
      const formatValue = currentFormat[formatName];

      if (formatValue) {
        this._markActiveFormatWidget(formatName, formatWidget, currentFormat);
      } else {
        this._resetFormatWidget(formatName, formatWidget);
      }
    }

    _prepareToolbarItems(): Item[] {
      const resultItems: Item[] = [];

      each(this.options.items, (index, item) => {
        // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
        let newItem: Item | undefined;
        if (isObject(item)) {
          newItem = this._handleObjectItem(item);
        } else if (item === TOOLBAR_AI_ITEM_NAME) {
          resultItems.push(this._getToolbarItem(this._prepareAIMenuItemConfig(item)));
        } else if (isString(item)) {
          const buttonItemConfig = this._prepareButtonItemConfig(item);
          newItem = this._getToolbarItem(buttonItemConfig);
        }
        if (newItem) {
          resultItems.push(newItem);
        }
      });

      return resultItems;
    }

    _handleObjectItem(item: dxHtmlEditorToolbarItem): Item {
      if (item.name === TOOLBAR_AI_ITEM_NAME) {
        // @ts-expect-error an item named 'ai' is the AI item; the name check does not narrow it
        return this._getToolbarItem(this._prepareAIMenuItemConfig(item));
      }

      if (item.name && item.acceptedValues && this._isAcceptableItem(item.widget, 'dxSelectBox')) {
        // @ts-expect-error the name check above does not narrow item to one with a name
        const selectItemConfig = this._prepareSelectItemConfig(item);

        return this._getToolbarItem(selectItemConfig);
      }

      if (item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
        const defaultButtonItemConfig = this._prepareButtonItemConfig(item.name);
        const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

        return this._getToolbarItem(buttonItemConfig);
      }

      return this._getToolbarItem(item);
    }

    _isAcceptableItem(
      widget: ToolbarItemComponent | undefined,
      acceptableWidgetName: ToolbarItemComponent,
    ): boolean {
      return !widget || widget === acceptableWidgetName;
    }

    _prepareButtonItemConfig(name: string): dxHtmlEditorToolbarItem {
      const iconName: string = ICON_MAP[name] ?? name;
      const buttonText = titleize(name);

      return {
        widget: 'dxButton',
        name,
        options: {
          hint: localize(buttonText),
          text: localize(buttonText),
          icon: iconName.toLowerCase(),
          onClick: this._formatHandlers[name] || getDefaultClickHandler(this, name),
          stylingMode: 'text',
        },
        showText: 'inMenu',
      };
    }

    _prepareSelectItemConfig(item: dxHtmlEditorToolbarItem & { name: string }): Item {
      const { name, acceptedValues } = item;

      return extend(true, {
        widget: 'dxSelectBox',
        name,
        options: {
          stylingMode: 'filled',
          dataSource: acceptedValues,
          displayExpr: (value: string | number | boolean): string | number | boolean => (
            localizeValue(value, name)
          ),
          placeholder: localize(name),
          onValueChanged: (e: SelectBoxValueChangedEvent): void => {
            if (!this._isReset) {
              this._hideAdaptiveMenu();
              applyFormat(this, [name, e.value, USER_ACTION], e.event);
              this._setValueSilent(e.component, e.value);
            }
          },
        },
      }, item);
    }

    private _createCommandMenuItem(
      command: AICommandName,
      text?: string,
      commandOptions?: string[],
    ): AIMenuItem {
      const options = commandOptions?.map(capitalize)
        ?? getDefaultOptionsByCommand(command);

      const item: AIMenuItem = {
        id: command,
        name: command,
        text: text ?? getDefaultCommandName(command),
        items: options?.map((option) => ({
          id: option,
          text: option,
          parentCommand: command,
          options,
        })),
      };

      return item;
    }

    private _buildMenuItems(commands: AIToolbarItem['commands']): AIMenuItem[] | undefined {
      let customCommandIndex = 0;

      const items = commands?.map((command): AIMenuItem => {
        if (typeof command === 'object') {
          if (command.name === 'custom') {
            const id = `custom${customCommandIndex}`;
            const { prompt, options } = command as AICustomCommand;
            const capitalized = options?.map(capitalize);

            const item: AIMenuItem = {
              id,
              name: 'custom',
              text: command.text,
              items: command.options?.map((rawOptionName: string): AIMenuItem => {
                const option = capitalize(rawOptionName);

                const result: AIMenuItem = {
                  parentCommand: id,
                  id: option,
                  text: option,
                  options: capitalized,
                  prompt,
                };

                return result;
              }),
              disabled: !prompt,
              prompt,
            };

            customCommandIndex += 1;

            return item;
          }

          return this._createCommandMenuItem(command.name, command.text, command.options);
        }

        return this._createCommandMenuItem(command);
      });

      return items;
    }

    _validateAIToolbarItemConfig(commandsMap: CommandsMap): void {
      const { aiIntegration } = this.editorInstance.option();

      if (!aiIntegration) {
        errors.log('W1026');
      }

      if (hasInvalidCustomCommand(commandsMap)) {
        errors.log('W1027');
      }
    }

    _prepareAIMenuItemConfig(item: AIToolbarItem | typeof TOOLBAR_AI_ITEM_NAME): Item {
      const itemConfig: Partial<AIToolbarItem> = isString(item) ? {} : item;
      const {
        name = TOOLBAR_AI_ITEM_NAME,
        commands = Object.keys(commandMessageKeys) as AICommandName[],
      } = itemConfig;

      const commandsMap = buildCommandsMap(commands);
      const menuItems = this._buildMenuItems(commands);

      this._validateAIToolbarItemConfig(commandsMap);

      const dataSource: AIMenuItem[] = [{
        id: 'root',
        icon: 'sparkle',
        items: menuItems,
      }];

      const { aiIntegration } = this.editorInstance.option();
      const isMenuDisabled = !dataSource[0].items?.length || !aiIntegration;

      const options = {
        dataSource,
        disabled: isMenuDisabled,
        onContentReady: (e: ContentReadyEvent<AIMenuItem>): void => {
          const $item = $(e.element).find(`.${DX_MENU_ITEM_CLASS}`).first();
          $item.attr('aria-label', localizationMessage.format('dxHtmlEditor-aiToolbarItemAriaLabel'));
        },
        onItemClick: (e: ItemClickEvent<AIMenuItem>): void => {
          const { itemData } = e;

          if (!itemData || itemData.items?.length) {
            return;
          }

          const aiDialogOptions: AITextTransformOptions = {
            command: itemData.id,
            parentCommand: itemData.parentCommand,
            commandsMap,
            prompt: itemData.prompt,
          };

          this._formatHandlers[name](aiDialogOptions);
        },
      };

      return extend(true, {
        widget: 'dxMenu',
        name,
        options,
      }, typeof item === 'string' ? {} : item);
    }

    _hideAdaptiveMenu(): void {
      // @ts-expect-error toolbarInstance is set by _renderToolbar, which precedes this call
      if (this.toolbarInstance.option('overflowMenuVisible')) {
        // @ts-expect-error toolbarInstance is set by _renderToolbar, which precedes this call
        this.toolbarInstance.option('overflowMenuVisible', false);
      }
    }

    _getToolbarItem(item: dxHtmlEditorToolbarItem): Item {
      const baseItem = {
        options: {
          onInitialized: (e: ToolbarItemInitializedEvent): void => {
            if (item.name) {
              e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
              e.component.$element()
                .toggleClass(`dx-${item.name.toLowerCase()}-format`, !!item.name);
              this._toolbarWidgets.add(item.name, e.component);
            }
          },
          onDisposing: (): void => {
            this._toolbarWidgets.remove(item.name);
          },
        },
      };

      return extend(
        true,
        { location: 'before', locateInMenu: 'auto' },
        // @ts-expect-error an item without a name reads the key 'undefined': nothing is there
        this._getDefaultConfig(item.name),
        item,
        baseItem,
      );
    }

    _getDefaultItemsConfig(): Partial<Record<string, DefaultItemConfig>> {
      return {
        clear: {
          options: {
            disabled: true,
          },
        },
        undo: {
          options: {
            disabled: true,
          },
        },
        redo: {
          options: {
            disabled: true,
          },
        },
        // ToDo: move it to the table module
        insertRowAbove: {
          options: {
            disabled: true,
          },
        },
        insertRowBelow: {
          options: {
            disabled: true,
          },
        },
        insertHeaderRow: {
          options: {
            disabled: true,
          },
        },
        insertColumnLeft: {
          options: {
            disabled: true,
          },
        },
        insertColumnRight: {
          options: {
            disabled: true,
          },
        },
        deleteRow: {
          options: {
            disabled: true,
          },
        },
        deleteColumn: {
          options: {
            disabled: true,
          },
        },
        deleteTable: {
          options: {
            disabled: true,
          },
        },
        cellProperties: {
          options: {
            disabled: true,
          },
        },
        tableProperties: {
          options: {
            disabled: true,
          },
        },
        separator: {
          template: (data, index, element): void => {
            $(element).addClass(TOOLBAR_SEPARATOR_CLASS);
          },
          menuItemTemplate: (data, index, element): void => {
            $(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS);
          },
        },
      };
    }

    _getDefaultConfig(name: string): DefaultItemConfig | undefined {
      return this._getDefaultItemsConfig()[name];
    }

    updateHistoryWidgets(): void {
      const historyModule = this.quill.history;

      if (!historyModule) {
        return;
      }

      const {
        undo: undoOps,
        redo: redoOps,
      } = historyModule.stack;

      this._updateManipulationWidget(
        this._toolbarWidgets.getByName('undo'),
        Boolean(undoOps.length),
      );
      this._updateManipulationWidget(
        this._toolbarWidgets.getByName('redo'),
        Boolean(redoOps.length),
      );
    }

    updateTableWidgets(): void {
      const table = this.quill.getModule('table');
      if (!table) {
        return;
      }

      const selection = this.quill.getSelection();
      const formats = (selection && this.quill.getFormat(selection)) || {};
      const isTableOperationsEnabled = this._tableFormats
        .some((format) => Boolean(formats[format]));
      TABLE_OPERATIONS.forEach((operationName) => {
        const isInsertTable = operationName === 'insertTable';
        const widget = this._toolbarWidgets.getByName(operationName);

        this._updateManipulationWidget(
          widget,
          isInsertTable ? !isTableOperationsEnabled : isTableOperationsEnabled,
        );
      });
    }

    _updateManipulationWidget(widget: ToolbarItemWidget | null, isOperationEnabled: boolean): void {
      if (!widget) {
        return;
      }

      widget.option('disabled', !isOperationEnabled);
      if (isOperationEnabled) {
        this._syncItemTabIndex(widget);
      }
    }

    _syncItemTabIndex(widget: ToolbarItemWidget): void {
      const $item = widget?.$element().closest(`.${TOOLBAR_ITEM_CLASS}`);
      if (!$item?.length) {
        return;
      }

      // @ts-expect-error toolbarInstance is set by _renderToolbar, which precedes this call
      const { focusedElement } = this.toolbarInstance.option();
      const isFocused = $item.get(0) === $(focusedElement).get(0);

      applyItemTabIndex($item, isFocused ? 0 : -1);
    }

    updateFormatWidgets(isResetRequired?: boolean): void {
      const selection = this.quill.getSelection();
      if (!selection) {
        return;
      }

      const formats = this.quill.getFormat(selection);
      const hasFormats = !isEmptyObject(formats);

      if (!hasFormats || isResetRequired) {
        this._resetFormatWidgets();
      }

      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const formatName in formats) {
        const widgetName = this._getFormatWidgetName(formatName, formats);
        const formatWidget = this._toolbarWidgets.getByName(widgetName)
          ?? this._toolbarWidgets.getByName(formatName);

        if (!formatWidget) {
          // eslint-disable-next-line no-continue -- a format without a widget is skipped
          continue;
        }

        this._markActiveFormatWidget(formatName, formatWidget, formats);
      }

      this._toggleClearFormatting(hasFormats || selection.length > 1);
    }

    _updateHeaderFormatWidget(): void {
      const selection = this.quill.getSelection();
      const formatName = 'header';
      const formatWidget = this._toolbarWidgets.getByName(formatName);
      // @ts-expect-error getFormat() is typed without null; devextreme-quill returns {} for it
      const formats = this.quill.getFormat(selection);
      if (!selection || !formatWidget) {
        return;
      }

      this._markActiveFormatWidget(formatName, formatWidget, formats);
    }

    _markActiveFormatWidget(
      name: string,
      widget: ToolbarItemWidget,
      formats: Record<string, unknown>,
    ): void {
      if (this._isColorFormat(name)) {
        this._updateColorWidget(name, formats[name]);
      }

      if ('value' in widget.option()) {
        this._setValueSilent(widget, formats[name]);
      } else {
        widget.$element().addClass(ACTIVE_FORMAT_CLASS);
        widget.$element().addClass(SELECTED_STATE_CLASS);
        widget.$element().attr('aria-pressed', true);
      }
    }

    _toggleClearFormatting(hasFormats: boolean): void {
      const clearWidget = this._toolbarWidgets.getByName('clear');
      if (clearWidget) {
        clearWidget.option('disabled', !hasFormats);
        if (hasFormats) {
          this._syncItemTabIndex(clearWidget);
        }
      }
    }

    _isColorFormat(name: string): boolean {
      return name === 'color' || name === 'background';
    }

    _updateColorWidget(name: string, color?: unknown): void {
      const formatWidget = this._toolbarWidgets.getByName(name);
      if (!formatWidget) {
        return;
      }

      formatWidget
        .$element()
        .find(`.${ICON_CLASS}`)
        // @ts-expect-error getFormat() values are unknown; css() is typed for strings
        .css('borderBottomColor', color || 'transparent');
    }

    _getFormatWidgetName(name: string, formats: Record<string, unknown>): string {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the switch
      let widgetName: string;
      switch (name) {
        case 'align':
          // @ts-expect-error getFormat() values are unknown; the align value is a string
          widgetName = name + titleize(formats[name]);
          break;
        case 'list':
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- a string value
          widgetName = formats[name] + titleize(name);
          break;
        case 'code-block':
          widgetName = 'codeBlock';
          break;
        case 'script':
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- a string value
          widgetName = formats[name] + name;
          break;
        case 'imageSrc':
          widgetName = 'image';
          break;
        default:
          widgetName = name;
      }

      return widgetName;
    }

    _setValueSilent(widget: Pick<ToolbarItemWidget, 'option'>, value: unknown): void {
      this._isReset = true;
      widget.option('value', value);
      this._isReset = false;
    }

    _resetFormatWidgets(): void {
      this._toolbarWidgets.each((name, widget) => {
        this._resetFormatWidget(name, widget);
      });
    }

    _resetFormatWidget(name: string, widget: ToolbarItemWidget): void {
      widget.$element().removeClass(ACTIVE_FORMAT_CLASS);
      widget.$element().removeClass(SELECTED_STATE_CLASS);
      widget.$element().removeAttr('aria-pressed');

      if (this._isColorFormat(name)) {
        this._updateColorWidget(name);
      }
      if (name === 'clear') {
        widget.option('disabled', true);
      }
      if (widget.NAME === 'dxSelectBox') {
        this._setValueSilent(widget, null);
      }
    }

    addClickHandler(name: string, handler: FormatHandler): void {
      this._formatHandlers[name] = handler;
      const formatWidget = this._toolbarWidgets.getByName(name);
      if (formatWidget && formatWidget.NAME === 'dxButton') {
        formatWidget.option('onClick', handler);
      }
    }
  };
}

export default ToolbarModule;
