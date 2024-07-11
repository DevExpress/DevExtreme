"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _element = require("../../core/element");
var _utils = require("../../core/options/utils");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _child_default_template = require("../../core/templates/child_default_template");
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _size = require("../../core/utils/size");
var _support = require("../../core/utils/support");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../../ui/drop_down_editor/ui.drop_down_list"));
var _ui2 = _interopRequireDefault(require("../../ui/popover/ui.popover"));
var _text_box = _interopRequireDefault(require("../../ui/text_box"));
var _themes = require("../../ui/themes");
var _m_utils = require("../ui/drop_down_editor/m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const LOOKUP_CLASS = 'dx-lookup';
const LOOKUP_SEARCH_CLASS = 'dx-lookup-search';
const LOOKUP_SEARCH_WRAPPER_CLASS = 'dx-lookup-search-wrapper';
const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const LOOKUP_ARROW_CLASS = 'dx-lookup-arrow';
const LOOKUP_FIELD_WRAPPER_CLASS = 'dx-lookup-field-wrapper';
const LOOKUP_POPUP_CLASS = 'dx-lookup-popup';
const LOOKUP_POPUP_WRAPPER_CLASS = 'dx-lookup-popup-wrapper';
const LOOKUP_POPUP_SEARCH_CLASS = 'dx-lookup-popup-search';
const LOOKUP_POPOVER_MODE = 'dx-lookup-popover-mode';
const LOOKUP_EMPTY_CLASS = 'dx-lookup-empty';
const LOOKUP_POPOVER_FLIP_VERTICAL_CLASS = 'dx-popover-flipped-vertical';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_EMPTY_CLASS = 'dx-texteditor-empty';
const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const GROUP_LIST_HEADER_CLASS = 'dx-list-group-header';
const MATERIAL_LOOKUP_LIST_ITEMS_COUNT = 5;
const MATERIAL_LOOKUP_LIST_PADDING = 8;
const WINDOW_RATIO = 0.8;
// @ts-expect-error
const Lookup = _ui.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      space(e) {
        e.preventDefault();
        this._validatedOpening();
      },
      enter() {
        this._validatedOpening();
      }
    });
  },
  _getDefaultOptions() {
    const getSize = side => {
      let size;
      if (_devices.default.real().deviceType === 'phone' && window.visualViewport) {
        size = window.visualViewport[side];
      } else {
        size = side === 'width' ? (0, _size.getWidth)(window) : (0, _size.getHeight)(window);
      }
      return size * WINDOW_RATIO;
    };
    return (0, _extend.extend)(this.callBase(), {
      placeholder: _message.default.format('Select'),
      searchPlaceholder: _message.default.format('Search'),
      searchEnabled: true,
      searchStartEvent: 'input change keyup',
      cleanSearchOnOpening: true,
      showCancelButton: true,
      showClearButton: false,
      clearButtonText: _message.default.format('Clear'),
      applyButtonText: _message.default.format('OK'),
      pullRefreshEnabled: false,
      useNativeScrolling: true,
      pullingDownText: _message.default.format('dxList-pullingDownText'),
      pulledDownText: _message.default.format('dxList-pulledDownText'),
      refreshingText: _message.default.format('dxList-refreshingText'),
      pageLoadingText: _message.default.format('dxList-pageLoadingText'),
      onScroll: null,
      onPullRefresh: null,
      onPageLoading: null,
      pageLoadMode: 'scrollBottom',
      nextButtonText: _message.default.format('dxList-nextButtonText'),
      grouped: false,
      groupTemplate: 'group',
      usePopover: false,
      openOnFieldClick: true,
      showDropDownButton: false,
      focusStateEnabled: false,
      dropDownOptions: {
        showTitle: true,
        width() {
          return getSize('width');
        },
        height() {
          return getSize('height');
        },
        shading: true,
        hideOnOutsideClick: false,
        position: undefined,
        animation: {},
        title: '',
        titleTemplate: 'title',
        onTitleRendered: null,
        fullScreen: false
      },
      dropDownCentered: false,
      _scrollToSelectedItemEnabled: false,
      useHiddenSubmitElement: true
    });
  },
  _setDeprecatedOptions() {
    this.callBase();
    (0, _extend.extend)(this._deprecatedOptions, {
      valueChangeEvent: {
        since: '22.1',
        alias: 'searchStartEvent'
      }
    });
  },
  _defaultOptionsRules() {
    const themeName = (0, _themes.current)();
    return this.callBase().concat([{
      device() {
        return !_support.nativeScrolling;
      },
      options: {
        useNativeScrolling: false
      }
    }, {
      device(device) {
        return !_devices.default.isSimulator() && _devices.default.real().deviceType === 'desktop' && device.platform === 'generic';
      },
      options: {
        usePopover: true,
        dropDownOptions: {
          height: 'auto'
        }
      }
    }, {
      device: {
        platform: 'ios',
        phone: true
      },
      options: {
        dropDownOptions: {
          fullScreen: true
        }
      }
    }, {
      device: {
        platform: 'ios',
        tablet: true
      },
      options: {
        dropDownOptions: {
          width() {
            return Math.min((0, _size.getWidth)(window), (0, _size.getHeight)(window)) * 0.4;
          },
          height: 'auto'
        },
        usePopover: true
      }
    }, {
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        usePopover: false,
        searchEnabled: false,
        showCancelButton: false,
        dropDownCentered: true,
        _scrollToSelectedItemEnabled: true,
        dropDownOptions: {
          hideOnOutsideClick: true,
          _ignoreFunctionValueDeprecation: true,
          width: () => (0, _m_utils.getElementWidth)(this.$element()),
          height: function () {
            return this._getPopupHeight();
          }.bind(this),
          showTitle: false,
          shading: false
        }
      }
    }]);
  },
  _init() {
    this.callBase();
    this._initActions();
  },
  _initActions() {
    this.callBase();
    this._initScrollAction();
    this._initPageLoadingAction();
    this._initPullRefreshAction();
  },
  _initPageLoadingAction() {
    this._pageLoadingAction = this._createActionByOption('onPageLoading');
  },
  _initPullRefreshAction() {
    this._pullRefreshAction = this._createActionByOption('onPullRefresh');
  },
  _initScrollAction() {
    this._scrollAction = this._createActionByOption('onScroll');
  },
  _scrollHandler(e) {
    this._scrollAction(e);
  },
  _pullRefreshHandler(e) {
    this._pullRefreshAction(e);
  },
  _pageLoadingHandler(e) {
    this._pageLoadingAction(e);
  },
  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      group: new _child_default_template.ChildDefaultTemplate('group'),
      title: new _child_default_template.ChildDefaultTemplate('title')
    });
  },
  _initMarkup() {
    this.$element().addClass(LOOKUP_CLASS).toggleClass(LOOKUP_POPOVER_MODE, this.option('usePopover'));
    this.callBase();
  },
  _inputWrapper() {
    return this.$element().find(`.${LOOKUP_FIELD_WRAPPER_CLASS}`);
  },
  _dataSourceOptions() {
    return (0, _extend.extend)(this.callBase(), {
      paginate: true
    });
  },
  _fireContentReadyAction: _common.noop,
  _popupWrapperClass() {
    return '';
  },
  _renderInput() {
    this._$field = (0, _renderer.default)('<div>').addClass(LOOKUP_FIELD_CLASS);
    this._applyInputAttributes(this.option('inputAttr'));
    const $arrow = (0, _renderer.default)('<div>').addClass(LOOKUP_ARROW_CLASS);
    this._$fieldWrapper = (0, _renderer.default)('<div>').addClass(LOOKUP_FIELD_WRAPPER_CLASS).append(this._$field).append($arrow).appendTo(this.$element());
  },
  _applyInputAttributes(attributes) {
    this._$field.attr(attributes);
  },
  _getInputContainer() {
    return this._$fieldWrapper;
  },
  _renderField() {
    const fieldTemplate = this._getTemplateByOption('fieldTemplate');
    if (fieldTemplate && this.option('fieldTemplate')) {
      this._renderFieldTemplate(fieldTemplate);
      return;
    }
    const displayValue = this.option('displayValue');
    this._updateField(displayValue);
    const isFieldEmpty = !this.option('selectedItem');
    this.$element().toggleClass(LOOKUP_EMPTY_CLASS, isFieldEmpty).toggleClass(TEXTEDITOR_EMPTY_CLASS, isFieldEmpty);
  },
  _getLabelContainer() {
    return this._$field;
  },
  _renderDisplayText(text) {
    if (this._input().length) {
      this.callBase(text);
    } else {
      this._updateField(text);
    }
  },
  _updateField(text) {
    text = (0, _type.isDefined)(text) && String(text);
    this._$field.empty();
    if (text) {
      this._$field.text(text);
    } else {
      const $placeholder = (0, _renderer.default)('<div>')
      // @ts-expect-error
      .attr({
        'data-dx_placeholder': this.option('placeholder')
      });
      this._$field.append($placeholder);
      $placeholder.addClass('dx-placeholder');
    }
  },
  _renderButtonContainers: _common.noop,
  _renderFieldTemplate(template) {
    this._$field.empty();
    const data = this._fieldRenderData();
    template.render({
      model: data,
      container: (0, _element.getPublicElement)(this._$field)
    });
  },
  _fieldRenderData() {
    return this.option('selectedItem');
  },
  _popupShowingHandler() {
    this.callBase.apply(this, arguments);
    if (this.option('cleanSearchOnOpening')) {
      if (this.option('searchEnabled') && this._searchBox.option('value')) {
        this._searchBox.option('value', '');
        this._searchCanceled();
      }
      this._list && this._list.option('focusedElement', null);
    }
    if (this.option('dropDownOptions.fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
      // @ts-expect-error
      this._popup.option('position').of = (0, _renderer.default)(window);
    }
  },
  _popupShownHandler() {
    const scrollToSelectedItemEnabled = this.option('_scrollToSelectedItemEnabled');
    const fullScreen = this.option('dropDownOptions.fullScreen');
    if (!fullScreen && scrollToSelectedItemEnabled) {
      this._setPopupPosition();
    }
    this.callBase();
  },
  _scrollToSelectedItem() {
    const selectedIndex = this._list.option('selectedIndex');
    const listItems = this._list.option('items');
    const itemsCount = listItems.length;
    if (itemsCount !== 0) {
      if (this._list.option('grouped')) {
        this._list.scrollToItem({
          group: itemsCount - 1,
          item: listItems[itemsCount - 1].items.length - 1
        });
      } else {
        this._list.scrollToItem(itemsCount - 1);
      }
      this._list.scrollToItem(selectedIndex);
    }
  },
  _getDifferenceOffsets(selectedListItem) {
    // @ts-expect-error
    return selectedListItem.offset().top - (0, _renderer.default)(this.element()).offset().top;
  },
  _isCenteringEnabled(index, count) {
    return index > 1 && index < count - 2;
  },
  _getPopupOffset() {
    const listItemsCount = this._listItemElements().length;
    if (listItemsCount === 0) return;
    const selectedListItem = (0, _renderer.default)(this._list.element()).find(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = this._listItemElements().index(selectedListItem);
    const differenceOfHeights = ((0, _size.getHeight)(selectedListItem) - (0, _size.getHeight)(this.element())) / 2;
    // @ts-expect-error
    const lookupOffset = (0, _renderer.default)(this._list.element()).offset().top;
    const dropDownHeightOption = this.option('dropDownOptions.height');
    const popupHeight = typeof dropDownHeightOption === 'function' ? dropDownHeightOption() : dropDownHeightOption;
    const windowHeight = (0, _size.getHeight)(window);
    let offsetTop = 0;
    if (selectedIndex !== -1) {
      if (this._isCenteringEnabled(selectedIndex, listItemsCount)) {
        this._scrollToSelectedItem();
        const scrollOffsetTop = (popupHeight - (0, _size.getHeight)(selectedListItem)) / 2 - this._getDifferenceOffsets(selectedListItem);
        this._list.scrollTo(this._list.scrollTop() + MATERIAL_LOOKUP_LIST_PADDING / 2 - scrollOffsetTop);
        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
        if (lookupOffset < offsetTop && selectedIndex !== listItemsCount - 3) {
          this._list.scrollTo(this._list.scrollTop() + this._getDifferenceOffsets(selectedListItem) / 2);
          offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
        }
      } else if (selectedIndex <= 1) {
        this._list.scrollTo(0);
        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      } else if (selectedIndex >= listItemsCount - 2) {
        this._scrollToSelectedItem();
        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      }
      if (lookupOffset < offsetTop) {
        this._scrollToSelectedItem();
        offsetTop = differenceOfHeights + MATERIAL_LOOKUP_LIST_PADDING;
      }
    }
    const offsetBottom = popupHeight - offsetTop - (0, _size.getHeight)(this.element());
    if (windowHeight - lookupOffset < offsetBottom) {
      this._list.scrollTo(this._list.scrollTop() + differenceOfHeights - offsetBottom);
      offsetTop = popupHeight - (0, _size.getHeight)(this.element()) - MATERIAL_LOOKUP_LIST_PADDING;
    }
    return offsetTop;
  },
  _setPopupPosition() {
    if (!this.option('dropDownCentered')) return;
    const flipped = this._popup.$wrapper().hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);
    if (flipped) return;
    const popupContentParent = (0, _renderer.default)(this._popup.$content()).parent();
    const popupOffset = this._getPopupOffset();
    const position = (0, _translator.locate)(popupContentParent);
    (0, _translator.move)(popupContentParent, {
      top: position.top - popupOffset
    });
  },
  _listItemGroupedElements() {
    const groups = this._list._getItemsContainer().children();
    const items = [];
    groups.each((_, group) => {
      items.push((0, _renderer.default)(group).find(`.${GROUP_LIST_HEADER_CLASS}`)[0]);
      const groupedItems = (0, _renderer.default)(group).find(`.${LIST_ITEM_CLASS}`);
      // @ts-expect-error
      groupedItems.each((_, item) => {
        items.push(item);
      });
    });
    // @ts-expect-error
    return (0, _renderer.default)(items);
  },
  _calculateListHeight(grouped) {
    const listItems = grouped ? this._listItemGroupedElements() : this._listItemElements();
    const selectedListItem = (0, _renderer.default)(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = listItems.index(selectedListItem);
    let listHeight = 0;
    let requireListItems = [];
    if (listItems.length === 0) {
      listHeight += MATERIAL_LOOKUP_LIST_PADDING;
    } else if (listItems.length < MATERIAL_LOOKUP_LIST_ITEMS_COUNT) {
      listItems.each((_, item) => {
        listHeight += (0, _size.getOuterHeight)(item);
      });
    } else {
      if (selectedIndex <= 1) {
        requireListItems = listItems.slice(0, MATERIAL_LOOKUP_LIST_ITEMS_COUNT);
      } else if (this._isCenteringEnabled(selectedIndex, listItems.length)) {
        requireListItems = listItems.slice(selectedIndex - 2, selectedIndex + 3);
      } else {
        requireListItems = listItems.slice(listItems.length - MATERIAL_LOOKUP_LIST_ITEMS_COUNT, listItems.length);
      }
      // @ts-expect-error
      requireListItems.each((_, item) => {
        listHeight += (0, _size.getOuterHeight)(item);
      });
    }
    return listHeight + (grouped ? MATERIAL_LOOKUP_LIST_PADDING : MATERIAL_LOOKUP_LIST_PADDING * 2);
  },
  _getPopupHeight() {
    var _this$_list;
    if ((_this$_list = this._list) !== null && _this$_list !== void 0 && _this$_list.itemElements().length) {
      return this._calculateListHeight(this.option('grouped')) + (this._$searchWrapper ? (0, _size.getOuterHeight)(this._$searchWrapper) : 0) + (this._popup._$bottom ? (0, _size.getOuterHeight)(this._popup._$bottom) : 0) + (this._popup._$title ? (0, _size.getOuterHeight)(this._popup._$title) : 0);
    }
    return 'auto';
  },
  _popupTabHandler: _common.noop,
  _renderPopup() {
    if (this.option('usePopover') && !this.option('dropDownOptions.fullScreen')) {
      if (this.option('_scrollToSelectedItemEnabled')) {
        this.callBase();
      } else {
        this._renderPopover();
        this._attachPopupKeyHandler();
      }
    } else {
      this.callBase();
    }
    this._$popup.addClass(LOOKUP_POPUP_CLASS);
    this._popup.$wrapper().addClass(LOOKUP_POPUP_WRAPPER_CLASS);
  },
  _renderPopover() {
    this._popup = this._createComponent(this._$popup, _ui2.default, (0, _extend.extend)(this._popupConfig(), this._options.cache('dropDownOptions'), {
      showEvent: null,
      hideEvent: null,
      target: this.$element(),
      fullScreen: false,
      shading: false,
      hideOnParentScroll: true,
      _fixWrapperPosition: false,
      width: this._isInitialOptionValue('dropDownOptions.width') ? function () {
        return (0, _size.getOuterWidth)(this.$element());
      }.bind(this) : this._popupConfig().width
    }));
    this._popup.$overlayContent().attr('role', 'dialog');
    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this)
    });
    if (this.option('_scrollToSelectedItemEnabled')) this._popup._$arrow.remove();
    this._setPopupContentId(this._popup.$content());
    this._contentReadyHandler();
  },
  _popupHidingHandler() {
    this.callBase();
    this.option('focusStateEnabled') && this.focus();
  },
  _popupHiddenHandler() {
    this.callBase();
    if (this.option('_scrollToSelectedItemEnabled')) {
      (0, _translator.resetPosition)((0, _renderer.default)(this._popup.content()).parent());
    }
  },
  _preventFocusOnPopup: _common.noop,
  _popupConfig() {
    const result = (0, _extend.extend)(this.callBase(), {
      toolbarItems: this._getPopupToolbarItems(),
      hideOnParentScroll: false,
      onPositioned: null,
      maxHeight: '100vh',
      showTitle: this.option('dropDownOptions.showTitle'),
      title: this.option('dropDownOptions.title'),
      titleTemplate: this._getTemplateByOption('dropDownOptions.titleTemplate'),
      onTitleRendered: this.option('dropDownOptions.onTitleRendered'),
      fullScreen: this.option('dropDownOptions.fullScreen'),
      shading: this.option('dropDownOptions.shading'),
      hideOnOutsideClick: this.option('dropDownOptions.hideOnOutsideClick') || this.option('dropDownOptions.closeOnOutsideClick')
    });
    delete result.animation;
    delete result.position;
    if (this.option('_scrollToSelectedItemEnabled')) {
      result.position = this.option('dropDownCentered') ? {
        my: 'left top',
        at: 'left top',
        of: this.element()
      } : {
        my: 'left top',
        at: 'left bottom',
        of: this.element()
      };
      result.hideOnParentScroll = true;
    }
    (0, _iterator.each)(['position', 'animation', 'width', 'height'], (_, optionName) => {
      const popupOptionValue = this.option(`dropDownOptions.${optionName}`);
      if (popupOptionValue !== undefined) {
        result[optionName] = popupOptionValue;
      }
    });
    return result;
  },
  _getPopupToolbarItems() {
    const buttonsConfig = this.option('applyValueMode') === 'useButtons' ? this._popupToolbarItemsConfig() : [];
    const cancelButton = this._getCancelButtonConfig();
    if (cancelButton) {
      buttonsConfig.push(cancelButton);
    }
    const clearButton = this._getClearButtonConfig();
    if (clearButton) {
      buttonsConfig.push(clearButton);
    }
    return this._applyButtonsLocation(buttonsConfig);
  },
  _popupToolbarItemsConfig() {
    return [{
      shortcut: 'done',
      options: {
        onClick: this._applyButtonHandler.bind(this),
        text: this.option('applyButtonText')
      }
    }];
  },
  _getCancelButtonConfig() {
    return this.option('showCancelButton') ? {
      shortcut: 'cancel',
      onClick: this._cancelButtonHandler.bind(this),
      options: {
        text: this.option('cancelButtonText')
      }
    } : null;
  },
  _getClearButtonConfig() {
    return this.option('showClearButton') ? {
      shortcut: 'clear',
      onClick: this._resetValue.bind(this),
      options: {
        text: this.option('clearButtonText')
      }
    } : null;
  },
  _applyButtonHandler(args) {
    if (args) {
      this._saveValueChangeEvent(args.event);
    }
    this.option('value', this._valueGetter(this._currentSelectedItem()));
    this.callBase();
  },
  _cancelButtonHandler() {
    this._refreshSelected();
    this.callBase();
  },
  _refreshPopupVisibility() {
    if (this.option('opened')) {
      this._updateListDimensions();
    }
  },
  _dimensionChanged() {
    if (this.option('usePopover') && !this.option('dropDownOptions.width')) {
      this.option('dropDownOptions.width', (0, _size.getWidth)(this.$element()));
    }
    this._updateListDimensions();
  },
  _input() {
    return this._$searchBox || this.callBase();
  },
  _renderPopupContent() {
    this.callBase();
    this._renderSearch();
  },
  _renderValueChangeEvent: _common.noop,
  _renderSearch() {
    const isSearchEnabled = this.option('searchEnabled');
    this._toggleSearchClass(isSearchEnabled);
    if (isSearchEnabled) {
      const $searchWrapper = this._$searchWrapper = (0, _renderer.default)('<div>').addClass(LOOKUP_SEARCH_WRAPPER_CLASS);
      const $searchBox = this._$searchBox = (0, _renderer.default)('<div>').addClass(LOOKUP_SEARCH_CLASS).appendTo($searchWrapper);
      const currentDevice = _devices.default.current();
      const searchMode = currentDevice.android ? 'text' : 'search';
      let isKeyboardListeningEnabled = false;
      const textBoxOptions = {
        mode: searchMode,
        showClearButton: true,
        valueChangeEvent: this.option('searchStartEvent'),
        inputAttr: {
          'aria-label': 'Search'
        },
        // eslint-disable-next-line no-return-assign
        onDisposing: () => isKeyboardListeningEnabled = false,
        // eslint-disable-next-line no-return-assign
        onFocusIn: () => isKeyboardListeningEnabled = true,
        // eslint-disable-next-line no-return-assign
        onFocusOut: () => isKeyboardListeningEnabled = false,
        onKeyboardHandled: opts => isKeyboardListeningEnabled && this._list._keyboardHandler(opts),
        onValueChanged: e => this._searchHandler(e)
      };
      this._searchBox = this._createComponent($searchBox, _text_box.default, textBoxOptions);
      this._registerSearchKeyHandlers();
      $searchWrapper.insertBefore(this._$list);
      this._setSearchPlaceholder();
    }
  },
  _updateActiveDescendant() {
    this.callBase();
    if (!this._$searchBox) {
      return;
    }
    const $input = this._$searchBox.find('input');
    this.callBase($input);
  },
  _removeSearch() {
    this._$searchWrapper && this._$searchWrapper.remove();
    delete this._$searchWrapper;
    this._$searchBox && this._$searchBox.remove();
    delete this._$searchBox;
    delete this._searchBox;
  },
  _selectListItemHandler(e) {
    const $itemElement = (0, _renderer.default)(this._list.option('focusedElement'));
    if (!$itemElement.length) {
      return;
    }
    e.preventDefault();
    e.target = $itemElement.get(0);
    this._saveValueChangeEvent(e);
    this._selectListItem(e.itemData, $itemElement);
  },
  _registerSearchKeyHandlers() {
    this._searchBox.registerKeyHandler('enter', this._selectListItemHandler.bind(this));
    this._searchBox.registerKeyHandler('space', this._selectListItemHandler.bind(this));
    this._searchBox.registerKeyHandler('end', _common.noop);
    this._searchBox.registerKeyHandler('home', _common.noop);
  },
  _toggleSearchClass(isSearchEnabled) {
    if (this._popup) {
      this._popup.$wrapper().toggleClass(LOOKUP_POPUP_SEARCH_CLASS, isSearchEnabled);
    }
  },
  _setSearchPlaceholder() {
    if (!this._$searchBox) {
      return;
    }
    const minSearchLength = this.option('minSearchLength');
    let placeholder = this.option('searchPlaceholder');
    if (minSearchLength && placeholder === _message.default.format('Search')) {
      // @ts-expect-error
      placeholder = _message.default.getFormatter('dxLookup-searchPlaceholder')(minSearchLength);
    }
    this._searchBox.option('placeholder', placeholder);
  },
  _setAriaTargetForList: _common.noop,
  _listConfig() {
    return (0, _extend.extend)(this.callBase(), {
      tabIndex: 0,
      grouped: this.option('grouped'),
      groupTemplate: this._getTemplateByOption('groupTemplate'),
      pullRefreshEnabled: this.option('pullRefreshEnabled'),
      useNativeScrolling: this.option('useNativeScrolling'),
      pullingDownText: this.option('pullingDownText'),
      pulledDownText: this.option('pulledDownText'),
      refreshingText: this.option('refreshingText'),
      pageLoadingText: this.option('pageLoadingText'),
      onScroll: this._scrollHandler.bind(this),
      onPullRefresh: this._pullRefreshHandler.bind(this),
      onPageLoading: this._pageLoadingHandler.bind(this),
      pageLoadMode: this.option('pageLoadMode'),
      nextButtonText: this.option('nextButtonText'),
      indicateLoading: this.option('searchEnabled'),
      onSelectionChanged: this._getSelectionChangedHandler()
    });
  },
  _getSelectionChangedHandler() {
    return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : _common.noop;
  },
  _listContentReadyHandler() {
    this.callBase(...arguments);
    this._refreshSelected();
  },
  _runWithoutCloseOnScroll(callback) {
    // NOTE: Focus can trigger "scroll" event
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      _scrollToSelectedItemEnabled
    } = this.option();
    const hideOnParentScroll = this._popup.option('hideOnParentScroll');
    if (!_scrollToSelectedItemEnabled) {
      callback();
    } else {
      this._popup.option('hideOnParentScroll', false);
      callback();
      this._hideOnParentScrollTimer = setTimeout(() => {
        this._popup.option('hideOnParentScroll', hideOnParentScroll);
      });
    }
  },
  _setFocusPolicy() {
    if (!this.option('focusStateEnabled')) {
      return;
    }
    this._runWithoutCloseOnScroll(() => {
      if (this.option('searchEnabled')) {
        this._searchBox.focus();
      } else {
        this._list.focus();
      }
    });
  },
  _focusTarget() {
    return this._$field;
  },
  _keyboardEventBindingTarget() {
    return this._$field;
  },
  _listItemClickHandler(e) {
    this._saveValueChangeEvent(e.event);
    this._selectListItem(e.itemData, e.event.currentTarget);
  },
  _selectListItem(itemData, target) {
    this._list.selectItem(target);
    if (this.option('applyValueMode') === 'instantly') {
      this._applyButtonHandler();
    }
  },
  _currentSelectedItem() {
    return this.option('grouped') ? this._list.option('selectedItems[0]').items[0] : this._list.option('selectedItems[0]');
  },
  _resetValue(e) {
    this._saveValueChangeEvent(e.event);
    this.option('value', null);
    this.option('opened', false);
  },
  _searchValue() {
    return this.option('searchEnabled') && this._searchBox ? this._searchBox.option('value') : '';
  },
  _renderInputValue() {
    return this.callBase().always(() => {
      this._refreshSelected();
    });
  },
  _renderPlaceholder() {
    if (this.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`).length === 0) {
      return;
    }
    this.callBase();
  },
  _clean() {
    this._$fieldWrapper.remove();
    clearTimeout(this._hideOnParentScrollTimer);
    this._hideOnParentScrollTimer = null;
    this._$searchBox = null;
    this.callBase();
  },
  _optionChanged(args) {
    var _this$_searchBox;
    const {
      name,
      fullName,
      value
    } = args;
    switch (name) {
      case 'dataSource':
        this.callBase(...arguments);
        this._renderField();
        break;
      case 'searchEnabled':
        if (this._popup) {
          this._removeSearch();
          this._renderSearch();
        }
        break;
      case 'searchPlaceholder':
        this._setSearchPlaceholder();
        break;
      case 'minSearchLength':
        this._setSearchPlaceholder();
        this.callBase(...arguments);
        break;
      case 'inputAttr':
        this._applyInputAttributes(value);
        break;
      case 'usePopover':
      case 'placeholder':
        this._invalidate();
        break;
      case 'clearButtonText':
      case 'showClearButton':
      case 'showCancelButton':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'applyValueMode':
        this.callBase(...arguments);
        break;
      case 'onPageLoading':
        this._initPageLoadingAction();
        break;
      case 'onPullRefresh':
        this._initPullRefreshAction();
        break;
      case 'pullRefreshEnabled':
      case 'useNativeScrolling':
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'pageLoadingText':
      case 'nextButtonText':
      case 'grouped':
      case 'groupTemplate':
        this._setListOption(name);
        break;
      case 'searchStartEvent':
        (_this$_searchBox = this._searchBox) === null || _this$_searchBox === void 0 || _this$_searchBox.option('valueChangeEvent', value);
        break;
      case 'onScroll':
        this._initScrollAction();
        break;
      case 'pageLoadMode':
        this._setListOption('pageLoadMode', this.option('pageLoadMode'));
        break;
      case 'cleanSearchOnOpening':
      case '_scrollToSelectedItemEnabled':
        break;
      case 'dropDownOptions':
        switch (fullName) {
          case 'dropDownOptions.width':
          case 'dropDownOptions.height':
            this._popupOptionChanged({
              name,
              fullName,
              value: value === 'auto' ? this.initialOption('dropDownOptions')[(0, _utils.getFieldName)(fullName)] : value
            });
            this._options.cache('dropDownOptions', this.option('dropDownOptions'));
            break;
          default:
            this.callBase(...arguments);
        }
        break;
      case 'dropDownCentered':
        if (this.option('_scrollToSelectedItemEnabled')) {
          this.option('dropDownOptions.position', undefined);
          this._renderPopup();
        }
        break;
      default:
        this.callBase(...arguments);
    }
  },
  focus() {
    // @ts-expect-error
    this.option('opened') ? this._setFocusPolicy() : _events_engine.default.trigger(this._focusTarget(), 'focus');
  },
  field() {
    return this._$field;
  }
});
(0, _component_registrator.default)('dxLookup', Lookup);
var _default = exports.default = Lookup;