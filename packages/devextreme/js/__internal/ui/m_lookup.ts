import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import { getFieldName } from '@js/core/options/utils';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import DropDownList from '@js/ui/drop_down_editor/ui.drop_down_list';
import Popover from '@js/ui/popover/ui.popover';
import TextBox from '@js/ui/text_box';
import { current, isMaterial } from '@js/ui/themes';
import supportUtils from '@ts/core/utils/m_support';
import { getElementWidth } from '@ts/ui/drop_down_editor/m_utils';

const window = getWindow();

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
const Lookup = DropDownList.inherit({
  _supportedKeys() {
    return extend(this.callBase(), {
      space(e) {
        e.preventDefault();
        this._validatedOpening();
      },
      enter() {
        this._validatedOpening();
      },
    });
  },

  _getDefaultOptions() {
    const getSize = (side) => {
      let size;
      if (devices.real().deviceType === 'phone' && window.visualViewport) {
        size = window.visualViewport[side];
      } else {
        size = side === 'width' ? getWidth(window) : getHeight(window);
      }
      return size * WINDOW_RATIO;
    };

    return extend(this.callBase(), {
      placeholder: messageLocalization.format('Select'),
      searchPlaceholder: messageLocalization.format('Search'),
      searchEnabled: true,
      searchStartEvent: 'input change keyup',
      cleanSearchOnOpening: true,
      showCancelButton: true,
      showClearButton: false,
      clearButtonText: messageLocalization.format('Clear'),
      applyButtonText: messageLocalization.format('OK'),
      pullRefreshEnabled: false,
      useNativeScrolling: true,
      pullingDownText: messageLocalization.format('dxList-pullingDownText'),
      pulledDownText: messageLocalization.format('dxList-pulledDownText'),
      refreshingText: messageLocalization.format('dxList-refreshingText'),
      pageLoadingText: messageLocalization.format('dxList-pageLoadingText'),
      onScroll: null,
      onPullRefresh: null,
      onPageLoading: null,
      pageLoadMode: 'scrollBottom',
      nextButtonText: messageLocalization.format('dxList-nextButtonText'),
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
        hideOnOutsideClick: true,
        position: undefined,
        animation: {},
        title: '',
        titleTemplate: 'title',
        onTitleRendered: null,
        fullScreen: false,
      },
      dropDownCentered: false,

      _scrollToSelectedItemEnabled: false,
      useHiddenSubmitElement: true,
    });
  },

  _setDeprecatedOptions() {
    this.callBase();
    extend(this._deprecatedOptions, {
      valueChangeEvent: { since: '22.1', alias: 'searchStartEvent' },
    });
  },

  _defaultOptionsRules() {
    const themeName = current();

    return this.callBase().concat([
      {
        device() {
          return !supportUtils.nativeScrolling;
        },
        options: {
          useNativeScrolling: false,
        },
      },
      {
        device(device) {
          return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
          usePopover: true,

          dropDownOptions: {
            height: 'auto',
          },
        },
      },
      {
        device: { platform: 'ios', phone: true },
        options: {
          dropDownOptions: {
            fullScreen: true,
          },
        },
      },
      {
        device: { platform: 'ios', tablet: true },
        options: {
          dropDownOptions: {
            width() { return Math.min(getWidth(window), getHeight(window)) * 0.4; },
            height: 'auto',
          },

          usePopover: true,
        },
      },
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device() {
          return isMaterial(themeName);
        },
        options: {
          usePopover: false,
          searchEnabled: false,
          showCancelButton: false,
          dropDownCentered: true,
          _scrollToSelectedItemEnabled: true,
          dropDownOptions: {
            _ignoreFunctionValueDeprecation: true,

            width: () => getElementWidth(this.$element()),
            height: function () { return this._getPopupHeight(); }.bind(this),
            showTitle: false,

            shading: false,
          },
        },
      },
    ]);
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
      group: new ChildDefaultTemplate('group'),
      title: new ChildDefaultTemplate('title'),
    });
  },

  _initMarkup() {
    this.$element()
      .addClass(LOOKUP_CLASS)
      .toggleClass(LOOKUP_POPOVER_MODE, this.option('usePopover'));
    this.callBase();
  },

  _inputWrapper() {
    return this.$element().find(`.${LOOKUP_FIELD_WRAPPER_CLASS}`);
  },

  _dataSourceOptions() {
    return extend(this.callBase(), {
      paginate: true,
    });
  },

  _fireContentReadyAction: noop,

  _popupWrapperClass() {
    return '';
  },

  _renderInput() {
    this._$field = $('<div>').addClass(LOOKUP_FIELD_CLASS);
    this._applyInputAttributes(this.option('inputAttr'));

    const $arrow = $('<div>').addClass(LOOKUP_ARROW_CLASS);

    this._$fieldWrapper = $('<div>').addClass(LOOKUP_FIELD_WRAPPER_CLASS)
      .append(this._$field)
      .append($arrow)
      .appendTo(this.$element());
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

    this.$element()
      .toggleClass(LOOKUP_EMPTY_CLASS, isFieldEmpty)
      .toggleClass(TEXTEDITOR_EMPTY_CLASS, isFieldEmpty);
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
    text = isDefined(text) && String(text);

    this._$field.empty();

    if (text) {
      this._$field.text(text);
    } else {
      const $placeholder = $('<div>')
        // @ts-expect-error
        .attr({ 'data-dx_placeholder': this.option('placeholder') });

      this._$field.append($placeholder);
      $placeholder.addClass('dx-placeholder');
    }
  },

  _renderButtonContainers: noop,

  _renderFieldTemplate(template) {
    this._$field.empty();
    const data = this._fieldRenderData();
    template.render({
      model: data,
      container: getPublicElement(this._$field),
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
      this._popup.option('position').of = $(window);
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
        this._list.scrollToItem({ group: itemsCount - 1, item: listItems[itemsCount - 1].items.length - 1 });
      } else {
        this._list.scrollToItem(itemsCount - 1);
      }

      this._list.scrollToItem(selectedIndex);
    }
  },

  _getDifferenceOffsets(selectedListItem) {
    // @ts-expect-error
    return selectedListItem.offset().top - $(this.element()).offset().top;
  },

  _isCenteringEnabled(index, count) {
    return index > 1 && index < (count - 2);
  },

  _getPopupOffset() {
    const listItemsCount = this._listItemElements().length;

    if (listItemsCount === 0) return;

    const selectedListItem = $(this._list.element()).find(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = this._listItemElements().index(selectedListItem);
    const differenceOfHeights = (getHeight(selectedListItem) - getHeight(this.element())) / 2;
    // @ts-expect-error
    const lookupOffset = $(this._list.element()).offset().top;
    const dropDownHeightOption = this.option('dropDownOptions.height');
    const popupHeight = typeof dropDownHeightOption === 'function' ? dropDownHeightOption() : dropDownHeightOption;
    const windowHeight = getHeight(window);

    let offsetTop = 0;

    if (selectedIndex !== -1) {
      if (this._isCenteringEnabled(selectedIndex, listItemsCount)) {
        this._scrollToSelectedItem();

        const scrollOffsetTop = (popupHeight - getHeight(selectedListItem)) / 2 - this._getDifferenceOffsets(selectedListItem);

        this._list.scrollTo(this._list.scrollTop() + MATERIAL_LOOKUP_LIST_PADDING / 2 - scrollOffsetTop);

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);

        if (lookupOffset < offsetTop && selectedIndex !== (listItemsCount - 3)) {
          this._list.scrollTo(this._list.scrollTop() + this._getDifferenceOffsets(selectedListItem) / 2);

          offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
        }
      } else if (selectedIndex <= 1) {
        this._list.scrollTo(0);

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      } else if (selectedIndex >= (listItemsCount - 2)) {
        this._scrollToSelectedItem();

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      }

      if (lookupOffset < offsetTop) {
        this._scrollToSelectedItem();
        offsetTop = differenceOfHeights + MATERIAL_LOOKUP_LIST_PADDING;
      }
    }

    const offsetBottom = popupHeight - offsetTop - getHeight(this.element());

    if (windowHeight - lookupOffset < offsetBottom) {
      this._list.scrollTo(this._list.scrollTop() + differenceOfHeights - offsetBottom);
      offsetTop = popupHeight - getHeight(this.element()) - MATERIAL_LOOKUP_LIST_PADDING;
    }

    return offsetTop;
  },

  _setPopupPosition() {
    if (!this.option('dropDownCentered')) return;

    const flipped = this._popup.$wrapper().hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);
    if (flipped) return;

    const popupContentParent = $(this._popup.$content()).parent();
    const popupOffset = this._getPopupOffset();

    const position = locate(popupContentParent);

    move(popupContentParent, {
      top: position.top - popupOffset,
    });
  },

  _listItemGroupedElements() {
    const groups = this._list._getItemsContainer().children();
    const items: Element[] = [];

    groups.each((_, group) => {
      items.push($(group).find(`.${GROUP_LIST_HEADER_CLASS}`)[0]);

      const groupedItems = $(group).find(`.${LIST_ITEM_CLASS}`);
      // @ts-expect-error
      groupedItems.each((_, item) => {
        items.push(item);
      });
    });

    // @ts-expect-error
    return $(items);
  },

  _calculateListHeight(grouped) {
    const listItems = grouped ? this._listItemGroupedElements() : this._listItemElements();
    const selectedListItem = $(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = listItems.index(selectedListItem);
    let listHeight = 0;
    let requireListItems = [];

    if (listItems.length === 0) {
      listHeight += MATERIAL_LOOKUP_LIST_PADDING;
    } else if (listItems.length < MATERIAL_LOOKUP_LIST_ITEMS_COUNT) {
      listItems.each((_, item) => {
        listHeight += getOuterHeight(item);
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
        listHeight += getOuterHeight(item);
      });
    }

    return listHeight + (grouped ? MATERIAL_LOOKUP_LIST_PADDING : MATERIAL_LOOKUP_LIST_PADDING * 2);
  },

  _getPopupHeight() {
    if (this._list?.itemElements().length) {
      return this._calculateListHeight(this.option('grouped'))
                + (this._$searchWrapper ? getOuterHeight(this._$searchWrapper) : 0)
                + (this._popup._$bottom ? getOuterHeight(this._popup._$bottom) : 0)
                + (this._popup._$title ? getOuterHeight(this._popup._$title) : 0);
    }
    return 'auto';
  },

  _allowSelectItemByTab: () => false,

  _popupTabHandler(e) {
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    if (!shouldLoopFocusInsidePopup) {
      this.callBase(e);
    }
  },

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
    const popupConfig = this._popupConfig();

    const options = extend(
      popupConfig,
      this._options.cache('dropDownOptions'),
      {
        showEvent: null,
        hideEvent: null,
        target: this.$element(),
        fullScreen: false,
        shading: false,
        hideOnParentScroll: true,
        _fixWrapperPosition: false,
        width: this._isInitialOptionValue('dropDownOptions.width')
          ? () => getOuterWidth(this.$element())
          : popupConfig.width,
      },
    );

    this._popup = this._createComponent(this._$popup, Popover, options);

    this._popup.$overlayContent().attr('role', 'dialog');

    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this),
    });

    if (this.option('_scrollToSelectedItemEnabled')) {
      this._popup._$arrow.remove();
    }

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
      resetPosition($(this._popup.content()).parent());
    }
  },

  _preventFocusOnPopup: noop,

  _shouldLoopFocusInsidePopup(): boolean {
    const {
      usePopover,
      dropDownCentered,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
    } = this.option();

    const result: boolean = _scrollToSelectedItemEnabled
      ? dropDownCentered
      : !usePopover;

    return result;
  },

  _popupConfig() {
    const { dropDownOptions } = this.option();
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    const result = extend(this.callBase(), {
      toolbarItems: this._getPopupToolbarItems(),
      hideOnParentScroll: false,
      onPositioned: null,
      maxHeight: '100vh',
      showTitle: dropDownOptions.showTitle,
      title: dropDownOptions.title,
      titleTemplate: this._getTemplateByOption('dropDownOptions.titleTemplate'),
      onTitleRendered: dropDownOptions.onTitleRendered,
      fullScreen: dropDownOptions.fullScreen,
      shading: dropDownOptions.shading,
      hideOnOutsideClick: dropDownOptions.hideOnOutsideClick || dropDownOptions.closeOnOutsideClick,
      _loopFocus: shouldLoopFocusInsidePopup,
    });

    delete result.animation;
    delete result.position;

    if (this.option('_scrollToSelectedItemEnabled')) {
      result.position = this.option('dropDownCentered') ? {
        my: 'left top',
        at: 'left top',
        of: this.element(),
      } : {
        my: 'left top',
        at: 'left bottom',
        of: this.element(),
      };

      result.hideOnParentScroll = true;
    }

    each(['position', 'animation', 'width', 'height'], (_, optionName) => {
      const popupOptionValue = dropDownOptions[optionName];

      if (popupOptionValue !== undefined) {
        result[optionName] = popupOptionValue;
      }
    });

    return result;
  },

  _getPopupToolbarItems() {
    const buttonsConfig = this.option('applyValueMode') === 'useButtons'
      ? this._popupToolbarItemsConfig()
      : [];

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
    return [
      {
        shortcut: 'done',
        options: {
          onClick: this._applyButtonHandler.bind(this),
          text: this.option('applyButtonText'),
        },
      },
    ];
  },

  _getCancelButtonConfig() {
    return this.option('showCancelButton') ? {
      shortcut: 'cancel',
      onClick: this._cancelButtonHandler.bind(this),
      options: {
        text: this.option('cancelButtonText'),
      },
    } : null;
  },

  _getClearButtonConfig() {
    return this.option('showClearButton') ? {
      shortcut: 'clear',
      onClick: this._resetValue.bind(this),
      options: { text: this.option('clearButtonText') },
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
      this.option('dropDownOptions.width', getWidth(this.$element()));
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

  _renderValueChangeEvent: noop,

  _renderSearch() {
    const isSearchEnabled = this.option('searchEnabled');

    this._toggleSearchClass(isSearchEnabled);

    if (isSearchEnabled) {
      const $searchWrapper = this._$searchWrapper = $('<div>').addClass(LOOKUP_SEARCH_WRAPPER_CLASS);

      const $searchBox = this._$searchBox = $('<div>').addClass(LOOKUP_SEARCH_CLASS)
        .appendTo($searchWrapper);

      const currentDevice = devices.current();
      const searchMode = currentDevice.android ? 'text' : 'search';

      let isKeyboardListeningEnabled = false;

      const textBoxOptions = {
        mode: searchMode,
        showClearButton: true,
        valueChangeEvent: this.option('searchStartEvent'),
        inputAttr: { 'aria-label': 'Search' },
        // eslint-disable-next-line no-return-assign
        onDisposing: () => isKeyboardListeningEnabled = false,
        // eslint-disable-next-line no-return-assign
        onFocusIn: () => isKeyboardListeningEnabled = true,
        // eslint-disable-next-line no-return-assign
        onFocusOut: () => isKeyboardListeningEnabled = false,
        onKeyboardHandled: (opts) => isKeyboardListeningEnabled && this._list._keyboardHandler(opts),
        onValueChanged: (e) => this._searchHandler(e),
      };

      this._searchBox = this._createComponent($searchBox, TextBox, textBoxOptions);

      this._registerSearchKeyHandlers();

      $searchWrapper.insertBefore(this._$list);

      this._setSearchPlaceholder();
    }
  },

  _filterDataSource(...args) {
    if (this._list && !this._list._dataSource && this._isMinSearchLengthExceeded()) {
      this._list?._scrollView.startLoading();
    }

    this.callBase(...args);
  },

  _dataSourceFiltered(...args) {
    this.callBase(...args);

    this._list?._scrollView.finishLoading();
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
    const $itemElement = $(this._list.option('focusedElement'));

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
    this._searchBox.registerKeyHandler('end', noop);
    this._searchBox.registerKeyHandler('home', noop);
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

    if (minSearchLength && placeholder === messageLocalization.format('Search')) {
      // @ts-expect-error
      placeholder = messageLocalization.getFormatter('dxLookup-searchPlaceholder')(minSearchLength);
    }

    this._searchBox.option('placeholder', placeholder);
  },

  _setAriaTargetForList: noop,

  _listConfig() {
    return extend(this.callBase(), {
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
      onSelectionChanged: this._getSelectionChangedHandler(),
    });
  },

  _getSelectionChangedHandler() {
    return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : noop;
  },

  _listContentReadyHandler() {
    this.callBase(...arguments);
    this._refreshSelected();
  },

  _runWithoutCloseOnScroll(callback) {
    // NOTE: Focus can trigger "scroll" event

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _scrollToSelectedItemEnabled } = this.option();
    const hideOnParentScroll = this._popup.option('hideOnParentScroll');

    if (!_scrollToSelectedItemEnabled) {
      callback();
    } else {
      this._popup.option('hideOnParentScroll', false);
      callback();
      this._hideOnParentScrollTimer = setTimeout(() => { // T1018037
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
    return this.option('grouped')
      ? this._list.option('selectedItems[0]').items[0]
      : this._list.option('selectedItems[0]');
  },

  _resetValue(e) {
    this._saveValueChangeEvent(e.event);
    this.option('value', null);
    this.option('opened', false);
  },

  _searchValue() {
    return this.option('searchEnabled') && this._searchBox ? this._searchBox.option('value') : '';
  },

  _renderInputValue(...args) {
    return this.callBase(...args).always(() => {
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
    const { name, fullName, value } = args;

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
        this._searchBox?.option('valueChangeEvent', value);
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
              value: value === 'auto' ? this.initialOption('dropDownOptions')[getFieldName(fullName)] : value,
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
    this.option('opened') ? this._setFocusPolicy() : eventsEngine.trigger(this._focusTarget(), 'focus');
  },

  field() {
    return this._$field;
  },
});

registerComponent('dxLookup', Lookup);

export default Lookup;
