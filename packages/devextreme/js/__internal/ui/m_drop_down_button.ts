import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import { ensureDefined, noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { isDefined, isObject, isPlainObject } from '@js/core/utils/type';
import DataController from '@js/data_controller';
import ButtonGroup from '@js/ui/button_group';
import List from '@js/ui/list_light';
import Popup from '@js/ui/popup/ui.popup';
import Widget from '@js/ui/widget/ui.widget';
import { getElementWidth, getSizeValue } from '@ts/ui/drop_down_editor/m_utils';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DROP_DOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const DX_BUTTON_CLASS = 'dx-button';
const DX_BUTTON_TEXT_CLASS = 'dx-button-text';
const DX_ICON_RIGHT_CLASS = 'dx-icon-right';

const OVERLAY_CONTENT_LABEL = 'Dropdown';

const DropDownButton = (Widget as any).inherit({

  _getDefaultOptions() {
    return extend(this.callBase(), {
      itemTemplate: 'item',
      keyExpr: 'this',
      displayExpr: undefined,
      selectedItem: null,
      selectedItemKey: null,
      stylingMode: 'outlined',
      deferRendering: true,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      useSelectMode: false,
      splitButton: false,
      showArrowIcon: true,
      template: null,
      text: '',
      type: 'normal',
      icon: undefined,
      onButtonClick: null,
      onSelectionChanged: null,
      onItemClick: null,
      opened: false,
      items: null,
      dataSource: null,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      dropDownOptions: {},
      dropDownContentTemplate: 'content',
      wrapItemText: false,
      useItemTextAsTitle: true,
      grouped: false,
      groupTemplate: 'group',
      buttonGroupOptions: {},
    });
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      selectedItem: true,
    });
  },

  _init() {
    this.callBase();
    this._createItemClickAction();
    this._createActionClickAction();
    this._createSelectionChangedAction();
    this._initDataController();
    this._compileKeyGetter();
    this._compileDisplayGetter();
    this._options.cache('buttonGroupOptions', this.option('buttonGroupOptions'));
    this._options.cache('dropDownOptions', this.option('dropDownOptions'));
  },

  _initDataController() {
    const dataSource = this.option('dataSource');
    this._dataController = new DataController(dataSource ?? this.option('items'), { key: this.option('keyExpr') });
  },

  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error
      content: new FunctionTemplate((options) => {
        const $popupContent = $(options.container);
        const $listContainer = $('<div>').appendTo($popupContent);
        this._list = this._createComponent($listContainer, List, this._listOptions());

        this._list.registerKeyHandler('escape', this._escHandler.bind(this));
        this._list.registerKeyHandler('tab', this._escHandler.bind(this));
        this._list.registerKeyHandler('leftArrow', this._escHandler.bind(this));
        this._list.registerKeyHandler('rightArrow', this._escHandler.bind(this));
      }),
    });
    this.callBase();
  },

  _compileKeyGetter() {
    this._keyGetter = compileGetter(this._dataController.key());
  },

  _compileDisplayGetter() {
    this._displayGetter = compileGetter(this.option('displayExpr'));
  },

  _initMarkup() {
    this.callBase();
    this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
    this._renderButtonGroup();
    this._updateArrowClass();

    if (isDefined(this.option('selectedItemKey'))) {
      this._loadSelectedItem().done(this._updateActionButton.bind(this));
    }
  },

  // T977758
  _renderFocusTarget: noop,

  _render() {
    if (!this.option('deferRendering') || this.option('opened')) {
      this._renderPopup();
    }

    this.callBase();
  },

  _renderContentImpl() {
    if (this._popup) {
      this._renderPopupContent();
    }

    return this.callBase();
  },

  _loadSelectedItem() {
    this._loadSingleDeferred?.reject();
    const d = Deferred();

    if (this._list && this._lastSelectedItemData !== undefined) {
      const cachedResult = this.option('useSelectMode') ? this._list.option('selectedItem') : this._lastSelectedItemData;
      return d.resolve(cachedResult);
    }
    this._lastSelectedItemData = undefined;

    const selectedItemKey = this.option('selectedItemKey');
    this._dataController.loadSingle(selectedItemKey)
      .done(d.resolve)
      .fail(() => {
        d.reject(null);
      });

    this._loadSingleDeferred = d;
    return d.promise();
  },

  _createActionClickAction() {
    this._actionClickAction = this._createActionByOption('onButtonClick');
  },

  _createSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
  },

  _createItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },

  _fireSelectionChangedAction({ previousValue, value }) {
    this._selectionChangedAction({
      item: value,
      previousItem: previousValue,
    });
  },

  _fireItemClickAction({ event, itemElement, itemData }) {
    return this._itemClickAction({
      event,
      itemElement,
      itemData: this._actionItem || itemData,
    });
  },

  _getButtonTemplate() {
    const { template, splitButton, showArrowIcon } = this.option();

    if (template) {
      return template;
    }

    return splitButton || !showArrowIcon
      ? 'content' : ({ text, icon }, buttonContent) => {
        const $firstIcon = getImageContainer(icon);
        const $textContainer = text ? $('<span>').text(text).addClass(DX_BUTTON_TEXT_CLASS) : undefined;
        // @ts-expect-error
        const $secondIcon = getImageContainer('spindown').addClass(DX_ICON_RIGHT_CLASS);

        // @ts-expect-error
        $(buttonContent).append($firstIcon, $textContainer, $secondIcon);
      };
  },

  _getActionButtonConfig() {
    const {
      icon, text, type, splitButton,
    } = this.option();

    const actionButtonConfig = {
      text,
      icon,
      type,
      template: this._getButtonTemplate(),
      elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS },
    };

    if (splitButton) {
      // @ts-expect-error
      actionButtonConfig.elementAttr.role = 'menuitem';
    }

    return actionButtonConfig;
  },

  _getSpinButtonConfig() {
    const { type } = this.option();

    const config = {
      type,
      icon: 'spindown',
      elementAttr: {
        class: DROP_DOWN_BUTTON_TOGGLE_CLASS,
        role: 'menuitem',
      },
    };

    return config;
  },

  _getButtonGroupItems() {
    const { splitButton } = this.option();

    const items = [this._getActionButtonConfig()];

    if (splitButton) {
      items.push(this._getSpinButtonConfig());
    }

    return items;
  },

  _buttonGroupItemClick({ event, itemData }) {
    const isActionButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_ACTION_CLASS;
    const isToggleButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_TOGGLE_CLASS;

    if (isToggleButton) {
      this.toggle();
    } else if (isActionButton) {
      this._actionClickAction({
        event,
        selectedItem: this.option('selectedItem'),
      });

      if (!this.option('splitButton')) {
        this.toggle();
      }
    }
  },

  _getButtonGroupOptions() {
    const {
      accessKey,
      focusStateEnabled,
      hoverStateEnabled,
      splitButton,
      stylingMode,
      tabIndex,
    } = this.option();

    const buttonGroupOptions = extend({
      items: this._getButtonGroupItems(),
      width: '100%',
      height: '100%',
      selectionMode: 'none',
      focusStateEnabled,
      hoverStateEnabled,
      stylingMode,
      accessKey,
      tabIndex,
      elementAttr: {
        role: splitButton ? 'menu' : 'group',
      },
      onItemClick: this._buttonGroupItemClick.bind(this),
      onKeyboardHandled: (e) => this._keyboardHandler(e),
    }, this._options.cache('buttonGroupOptions'));

    return buttonGroupOptions;
  },

  _renderPopupContent() {
    const $content = this._popup.$content();
    const template = this._getTemplateByOption('dropDownContentTemplate');

    $content.empty();

    this._popupContentId = `dx-${new Guid()}`;
    this.setAria('id', this._popupContentId, $content);

    return template.render({
      container: getPublicElement($content),
      model: this.option('items') || this._dataController.getDataSource(),
    });
  },

  _popupOptions() {
    const horizontalAlignment = this.option('rtlEnabled') ? 'right' : 'left';
    return extend({
      dragEnabled: false,
      focusStateEnabled: false,
      deferRendering: this.option('deferRendering'),
      hideOnOutsideClick: (e) => {
        const $element = this.$element();
        const $buttonClicked = $(e.target).closest(`.${DROP_DOWN_BUTTON_CLASS}`);
        return !$buttonClicked.is($element);
      },
      showTitle: false,
      animation: {
        show: {
          type: 'fade', duration: 0, from: 0, to: 1,
        },
        hide: {
          type: 'fade', duration: 400, from: 1, to: 0,
        },
      },
      _ignoreFunctionValueDeprecation: true,
      width: () => getElementWidth(this.$element()),
      height: 'auto',
      shading: false,
      position: {
        of: this.$element(),
        collision: 'flipfit',
        my: `${horizontalAlignment} top`,
        at: `${horizontalAlignment} bottom`,
      },
      _wrapperClassExternal: DROP_DOWN_EDITOR_OVERLAY_CLASS,
    }, this._options.cache('dropDownOptions'), { visible: this.option('opened') });
  },

  _listOptions() {
    const selectedItemKey = this.option('selectedItemKey');
    const useSelectMode = this.option('useSelectMode');
    return {
      selectionMode: useSelectMode ? 'single' : 'none',
      wrapItemText: this.option('wrapItemText'),
      focusStateEnabled: this.option('focusStateEnabled'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      useItemTextAsTitle: this.option('useItemTextAsTitle'),
      onContentReady: () => this._fireContentReadyAction(),
      selectedItemKeys: isDefined(selectedItemKey) && useSelectMode ? [selectedItemKey] : [],
      grouped: this.option('grouped'),
      groupTemplate: this.option('groupTemplate'),
      keyExpr: this._dataController.key(),
      noDataText: this.option('noDataText'),
      displayExpr: this.option('displayExpr'),
      itemTemplate: this.option('itemTemplate'),
      items: this.option('items'),
      dataSource: this._dataController.getDataSource(),
      onItemClick: (e) => {
        if (!this.option('useSelectMode')) {
          this._lastSelectedItemData = e.itemData;
        }
        this.option('selectedItemKey', this._keyGetter(e.itemData));
        const actionResult = this._fireItemClickAction(e);
        if (actionResult !== false) {
          this.toggle(false);
          this._buttonGroup.focus();
        }
      },
    };
  },

  _upDownKeyHandler() {
    if (this._popup && this._popup.option('visible') && this._list) {
      this._list.focus();
    } else {
      this.open();
    }

    return true;
  },

  _escHandler() {
    this.close();
    this._buttonGroup.focus();

    return true;
  },

  _tabHandler() {
    this.close();

    return true;
  },

  _renderPopup() {
    const $popup = $('<div>');
    this.$element().append($popup);
    this._popup = this._createComponent($popup, Popup, this._popupOptions());
    this._popup.$content().addClass(DROP_DOWN_BUTTON_CONTENT);
    this._popup.$wrapper().addClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS);
    this._popup.$overlayContent().attr('aria-label', OVERLAY_CONTENT_LABEL);
    this._popup.on('hiding', this._popupHidingHandler.bind(this));
    this._popup.on('showing', this._popupShowingHandler.bind(this));
    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  },

  _popupHidingHandler() {
    this.option('opened', false);

    this._updateAriaAttributes(false);
  },

  _popupOptionChanged(args) {
    // @ts-expect-error
    const options = Widget.getOptionsFromContainer(args);

    this._setPopupOption(options);

    const optionsKeys = Object.keys(options);
    if (optionsKeys.includes('width') || optionsKeys.includes('height')) {
      this._dimensionChanged();
    }
  },

  _dimensionChanged() {
    const popupWidth = getSizeValue(this.option('dropDownOptions.width'));

    if (popupWidth === undefined) {
      this._setPopupOption('width', () => getElementWidth(this.$element()));
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setPopupOption(optionName, value) {
    this._setWidgetOption('_popup', arguments);
  },

  _popupShowingHandler() {
    this.option('opened', true);
    this._updateAriaAttributes(true);
  },

  _setElementAria(value) {
    const elementAria = {
      owns: value ? this._popupContentId : undefined,
    };

    this.setAria(elementAria, this.$element());
  },

  _setButtonsAria(value) {
    const commonButtonAria = {
      expanded: value,
      haspopup: 'listbox',
    };
    const firstButtonAria = {};

    if (!this.option('text')) {
      // @ts-expect-error
      firstButtonAria.label = 'dropdownbutton';
    }

    this._getButtons().each((index, $button) => {
      if (index === 0) {
        this.setAria({ ...firstButtonAria, ...commonButtonAria }, $($button));
      } else {
        this.setAria(commonButtonAria, $($button));
      }
    });
  },

  _updateAriaAttributes(value) {
    this._setElementAria(value);
    this._setButtonsAria(value);
  },

  _getButtons() {
    return this._buttonGroup.$element().find(`.${DX_BUTTON_CLASS}`);
  },

  _renderButtonGroup() {
    const $buttonGroup = (this._buttonGroup && this._buttonGroup.$element()) || $('<div>');
    if (!this._buttonGroup) {
      this.$element().append($buttonGroup);
    }

    this._buttonGroup = this._createComponent($buttonGroup, ButtonGroup, this._getButtonGroupOptions());

    this._buttonGroup.registerKeyHandler('downArrow', this._upDownKeyHandler.bind(this));
    this._buttonGroup.registerKeyHandler('tab', this._tabHandler.bind(this));
    this._buttonGroup.registerKeyHandler('upArrow', this._upDownKeyHandler.bind(this));
    this._buttonGroup.registerKeyHandler('escape', this._escHandler.bind(this));

    this._bindInnerWidgetOptions(this._buttonGroup, 'buttonGroupOptions');

    this._updateAriaAttributes(this.option('opened'));
  },

  _updateArrowClass() {
    const hasArrow = this.option('splitButton') || this.option('showArrowIcon');
    this.$element().toggleClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS, hasArrow);
  },

  toggle(visible) {
    if (!this._popup) {
      this._renderPopup();
      this._renderContent();
    }
    return this._popup.toggle(visible);
  },

  open() {
    return this.toggle(true);
  },

  close() {
    return this.toggle(false);
  },

  _setListOption(name, value) {
    this._list && this._list.option(name, value);
  },

  _getDisplayValue(item) {
    const isPrimitiveItem = !isObject(item);
    const displayValue = isPrimitiveItem ? item : this._displayGetter(item);
    return !isObject(displayValue) ? String(ensureDefined(displayValue, '')) : '';
  },

  _updateActionButton(selectedItem) {
    if (this.option('useSelectMode')) {
      this.option({
        text: this._getDisplayValue(selectedItem),
        icon: isPlainObject(selectedItem) ? selectedItem.icon : undefined,
      });
    }

    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
    this._setOptionWithoutOptionChange('selectedItemKey', this._keyGetter(selectedItem));
  },

  _clean() {
    this._list && this._list.$element().remove();
    this._popup && this._popup.$element().remove();
  },

  _selectedItemKeyChanged(value) {
    this._setListOption('selectedItemKeys', this.option('useSelectMode') && isDefined(value) ? [value] : []);
    const previousItem = this.option('selectedItem');
    this._loadSelectedItem().always((selectedItem) => {
      this._updateActionButton(selectedItem);

      if (this._displayGetter(previousItem) !== this._displayGetter(selectedItem)) {
        this._fireSelectionChangedAction({
          previousValue: previousItem,
          value: selectedItem,
        });
      }
    });
  },

  _updateButtonGroup(name, value) {
    this._buttonGroup.option(name, value);
    this._updateAriaAttributes(this.option('opened'));
  },

  _actionButtonOptionChanged({ name, value }) {
    const newConfig = {};
    newConfig[name] = value;
    this._updateButtonGroup('items[0]', extend({}, this._getActionButtonConfig(), newConfig));
    this._popup && this._popup.repaint();
  },

  _selectModeChanged(value) {
    if (value) {
      this._setListOption('selectionMode', 'single');
      const selectedItemKey = this.option('selectedItemKey');
      this._setListOption('selectedItemKeys', isDefined(selectedItemKey) ? [selectedItemKey] : []);
      this._selectedItemKeyChanged(this.option('selectedItemKey'));
    } else {
      this._setListOption('selectionMode', 'none');
      this.option({
        selectedItemKey: undefined,
        selectedItem: undefined,
      });
      this._actionButtonOptionChanged({ text: this.option('text') });
    }
  },

  _updateItemCollection(optionName) {
    const selectedItemKey = this.option('selectedItemKey');
    this._setListOption('selectedItem', null);
    this._setWidgetOption('_list', [optionName]);

    if (isDefined(selectedItemKey)) {
      this._loadSelectedItem()
        .done((selectedItem) => {
          this._setListOption('selectedItemKeys', [selectedItemKey]);
          this._setListOption('selectedItem', selectedItem);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).fail((error) => {
          this._setListOption('selectedItemKeys', []);
        })
        .always(this._updateActionButton.bind(this));
    }
  },

  _updateDataController(items) {
    this._dataController.updateDataSource(items, this.option('keyExpr'));
    this._updateKeyExpr();
  },

  _updateKeyExpr() {
    this._compileKeyGetter();
    this._setListOption('keyExpr', this._dataController.key());
  },

  focus() {
    this._buttonGroup.focus();
  },

  _optionChanged(args) {
    const { name, value } = args;
    switch (name) {
      case 'useSelectMode':
        this._selectModeChanged(value);
        break;
      case 'splitButton':
        this._updateArrowClass();
        this._renderButtonGroup();
        break;
      case 'displayExpr':
        this._compileDisplayGetter();
        this._setListOption(name, value);
        this._updateActionButton(this.option('selectedItem'));
        break;
      case 'keyExpr':
        this._updateDataController();
        break;
      case 'buttonGroupOptions':
        this._innerWidgetOptionChanged(this._buttonGroup, args);
        break;
      case 'dropDownOptions':
        if (args.fullName === 'dropDownOptions.visible') {
          break;
        }
        if (args.value.visible !== undefined) {
          delete args.value.visible;
        }
        this._popupOptionChanged(args);
        this._innerWidgetOptionChanged(this._popup, args);
        break;
      case 'opened':
        this.toggle(value);
        break;
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._setListOption(name, value);
        this._updateButtonGroup(name, value);
        this.callBase(args);
        break;
      case 'items':
        this._updateDataController(this.option('items'));
        this._updateItemCollection(name);
        break;
      case 'dataSource':
        this._dataController.updateDataSource(value);
        this._updateKeyExpr();
        this._updateItemCollection(name);
        break;
      case 'icon':
      case 'text':
        this._actionButtonOptionChanged(args);
        break;
      case 'showArrowIcon':
        this._updateArrowClass();
        this._renderButtonGroup();
        this._popup && this._popup.repaint();
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        this._popup?.repaint();
        break;
      case 'stylingMode':
        this._updateButtonGroup(name, value);
        break;
      case 'type':
        this._updateButtonGroup('items', this._getButtonGroupItems());
        break;
      case 'itemTemplate':
      case 'grouped':
      case 'noDataText':
      case 'groupTemplate':
      case 'wrapItemText':
      case 'useItemTextAsTitle':
        this._setListOption(name, value);
        break;
      case 'dropDownContentTemplate':
        this._renderContent();
        break;
      case 'selectedItemKey':
        this._selectedItemKeyChanged(value);
        break;
      case 'selectedItem':
        break;
      case 'onItemClick':
        this._createItemClickAction();
        break;
      case 'onButtonClick':
        this._createActionClickAction();
        break;
      case 'onSelectionChanged':
        this._createSelectionChangedAction();
        break;
      case 'deferRendering':
        this.toggle(this.option('opened'));
        break;
      case 'tabIndex':
        this._updateButtonGroup(name, value);
        break;
      case 'template':
        this._renderButtonGroup();
        break;
      default:
        this.callBase(args);
    }
  },

  getDataSource() {
    return this._dataController.getDataSource();
  },
});

registerComponent('dxDropDownButton', DropDownButton);

export default DropDownButton;
