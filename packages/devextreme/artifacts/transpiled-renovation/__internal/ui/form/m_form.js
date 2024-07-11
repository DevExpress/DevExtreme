"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./m_form.layout_manager");
require("../../../ui/validation_summary");
require("../../../ui/validation_group");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _config = _interopRequireDefault(require("../../../core/config"));
var _element = require("../../../core/element");
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _visibility_change = require("../../../events/visibility_change");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _editor = _interopRequireDefault(require("../../../ui/editor/editor"));
var _ui = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _tab_panel = _interopRequireDefault(require("../../../ui/tab_panel"));
var _themes = require("../../../ui/themes");
var _validation_engine = _interopRequireDefault(require("../../../ui/validation_engine"));
var _ui2 = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
var _m_constants = require("../../ui/toolbar/m_constants");
var _m_label = require("./components/m_label");
var _constants = require("./constants");
var _m_form2 = _interopRequireDefault(require("./m_form.item_options_actions"));
var _m_form3 = _interopRequireDefault(require("./m_form.items_runtime_info"));
var _m_formLayout_manager = require("./m_form.layout_manager.utils");
var _m_form4 = require("./m_form.utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
// eslint-disable-next-line import/no-named-default
// TODO: remove reference to 'ui.form.layout_manager.utils.js'
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const ITEM_OPTIONS_FOR_VALIDATION_UPDATING = ['items', 'isRequired', 'validationRules', 'visible'];
// @ts-expect-error
const Form = _ui2.default.inherit({
  _init() {
    this.callBase();
    this._dirtyFields = new Set();
    this._cachedColCountOptions = [];
    this._itemsRunTimeInfo = new _m_form3.default();
    this._groupsColCount = [];
    this._attachSyncSubscriptions();
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      formID: `dx-${new _guid.default()}`,
      formData: {},
      colCount: 1,
      screenByWidth: _window.defaultScreenFactorFunc,
      colCountByScreen: undefined,
      labelLocation: 'left',
      readOnly: false,
      onFieldDataChanged: null,
      customizeItem: null,
      onEditorEnterKey: null,
      minColWidth: 200,
      alignItemLabels: true,
      alignItemLabelsInAllGroups: true,
      alignRootItemLabels: true,
      showColonAfterLabel: true,
      showRequiredMark: true,
      showOptionalMark: false,
      requiredMark: '*',
      optionalMark: _message.default.format('dxForm-optionalMark'),
      requiredMessage: _message.default.getFormatter('dxForm-requiredMessage'),
      showValidationSummary: false,
      items: undefined,
      scrollingEnabled: false,
      validationGroup: undefined,
      stylingMode: (0, _config.default)().editorStylingMode,
      labelMode: 'outside',
      isDirty: false
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        labelLocation: 'top'
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterial)();
      },
      options: {
        showColonAfterLabel: false
      }
    }]);
  },
  _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      formData: true,
      validationGroup: true
    });
  },
  _getGroupColCount($element) {
    // eslint-disable-next-line radix
    return parseInt($element.attr(_constants.GROUP_COL_COUNT_ATTR));
  },
  // eslint-disable-next-line @typescript-eslint/default-param-last
  _applyLabelsWidthByCol($container, index) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let labelMarkOptions = arguments.length > 3 ? arguments[3] : undefined;
    // @ts-expect-error
    const fieldItemClass = options.inOneColumn ? _constants.FIELD_ITEM_CLASS : _constants.FORM_FIELD_ITEM_COL_CLASS + index;
    // @ts-expect-error
    const cssExcludeTabbedSelector = options.excludeTabbed ? `:not(.${_constants.FIELD_ITEM_TAB_CLASS})` : '';
    (0, _m_label.setLabelWidthByMaxLabelWidth)($container, `.${fieldItemClass}${cssExcludeTabbedSelector}`, labelMarkOptions);
  },
  _applyLabelsWidth($container, excludeTabbed, inOneColumn, colCount, labelMarkOptions) {
    colCount = inOneColumn ? 1 : colCount || this._getGroupColCount($container);
    const applyLabelsOptions = {
      excludeTabbed,
      inOneColumn
    };
    let i;
    for (i = 0; i < colCount; i++) {
      this._applyLabelsWidthByCol($container, i, applyLabelsOptions, labelMarkOptions);
    }
  },
  _getGroupElementsInColumn($container, columnIndex, colCount) {
    const cssColCountSelector = (0, _type.isDefined)(colCount) ? `.${_constants.GROUP_COL_COUNT_CLASS}${colCount}` : '';
    const groupSelector = `.${_constants.FORM_FIELD_ITEM_COL_CLASS}${columnIndex} > .${_constants.FIELD_ITEM_CONTENT_CLASS} > .${_constants.FORM_GROUP_CLASS}${cssColCountSelector}`;
    return $container.find(groupSelector);
  },
  _applyLabelsWidthWithGroups($container, colCount, excludeTabbed, labelMarkOptions) {
    if (this.option('alignRootItemLabels') === true) {
      // TODO: private option
      const $rootSimpleItems = $container.find(`.${_constants.ROOT_SIMPLE_ITEM_CLASS}`);
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        // TODO: root items are aligned with root items only
        // this code doesn't align root items with grouped items in the same column
        // (see T942517)
        this._applyLabelsWidthByCol($rootSimpleItems, colIndex, excludeTabbed, labelMarkOptions);
      }
    }
    const alignItemLabelsInAllGroups = this.option('alignItemLabelsInAllGroups');
    if (alignItemLabelsInAllGroups) {
      this._applyLabelsWidthWithNestedGroups($container, colCount, excludeTabbed, labelMarkOptions);
    } else {
      const $groups = this.$element().find(`.${_constants.FORM_GROUP_CLASS}`);
      let i;
      for (i = 0; i < $groups.length; i++) {
        this._applyLabelsWidth($groups.eq(i), excludeTabbed, undefined, undefined, labelMarkOptions);
      }
    }
  },
  _applyLabelsWidthWithNestedGroups($container, colCount, excludeTabbed, labelMarkOptions) {
    const applyLabelsOptions = {
      excludeTabbed
    };
    let colIndex;
    let groupsColIndex;
    let groupColIndex;
    let $groupsByCol;
    for (colIndex = 0; colIndex < colCount; colIndex++) {
      $groupsByCol = this._getGroupElementsInColumn($container, colIndex);
      this._applyLabelsWidthByCol($groupsByCol, 0, applyLabelsOptions, labelMarkOptions);
      for (groupsColIndex = 0; groupsColIndex < this._groupsColCount.length; groupsColIndex++) {
        $groupsByCol = this._getGroupElementsInColumn($container, colIndex, this._groupsColCount[groupsColIndex]);
        const groupColCount = this._getGroupColCount($groupsByCol);
        for (groupColIndex = 1; groupColIndex < groupColCount; groupColIndex++) {
          this._applyLabelsWidthByCol($groupsByCol, groupColIndex, applyLabelsOptions, labelMarkOptions);
        }
      }
    }
  },
  _labelLocation() {
    return this.option('labelLocation');
  },
  _alignLabelsInColumn(_ref) {
    let {
      layoutManager,
      inOneColumn,
      $container,
      excludeTabbed,
      items
    } = _ref;
    if (!(0, _window.hasWindow)() || this._labelLocation() === 'top') {
      // TODO: label location can be changed to 'left/right' for some labels
      // but this condition disables alignment for such items
      return;
    }
    const labelMarkOptions = (0, _m_formLayout_manager.convertToLabelMarkOptions)(layoutManager._getMarkOptions());
    if (inOneColumn) {
      this._applyLabelsWidth($container, excludeTabbed, true, undefined, labelMarkOptions);
    } else if (this._checkGrouping(items)) {
      this._applyLabelsWidthWithGroups($container, layoutManager._getColCount(), excludeTabbed, labelMarkOptions);
    } else {
      this._applyLabelsWidth($container, excludeTabbed, false, layoutManager._getColCount(), labelMarkOptions);
    }
  },
  _prepareFormData() {
    if (!(0, _type.isDefined)(this.option('formData'))) {
      this.option('formData', {});
    }
  },
  _setStylingModeClass() {
    if (this.option('stylingMode') === 'underlined') {
      this.$element().addClass(_constants.FORM_UNDERLINED_CLASS);
    }
  },
  _initMarkup() {
    // @ts-expect-error
    _validation_engine.default.addGroup(this._getValidationGroup(), false);
    this._clearCachedInstances();
    this._prepareFormData();
    this.$element().addClass(_constants.FORM_CLASS);
    this._setStylingModeClass();
    this.callBase();
    this.setAria('role', 'form', this.$element());
    if (this.option('scrollingEnabled')) {
      this._renderScrollable();
    }
    this._renderLayout();
    this._renderValidationSummary();
    this._lastMarkupScreenFactor = this._targetScreenFactor || this._getCurrentScreenFactor();
    this._attachResizeObserverSubscription();
  },
  _attachResizeObserverSubscription() {
    if ((0, _window.hasWindow)()) {
      const formRootElement = this.$element().get(0);
      _resize_observer.default.unobserve(formRootElement);
      _resize_observer.default.observe(formRootElement, () => {
        this._resizeHandler();
      });
    }
  },
  _resizeHandler() {
    if (this._cachedLayoutManagers.length) {
      (0, _iterator.each)(this._cachedLayoutManagers, (_, layoutManager) => {
        var _layoutManager$option;
        (_layoutManager$option = layoutManager.option('onLayoutChanged')) === null || _layoutManager$option === void 0 || _layoutManager$option(layoutManager.isSingleColumnMode());
      });
    }
  },
  _getCurrentScreenFactor() {
    return (0, _window.hasWindow)() ? (0, _window.getCurrentScreenFactor)(this.option('screenByWidth')) : 'lg';
  },
  _clearCachedInstances() {
    this._itemsRunTimeInfo.clear();
    this._cachedLayoutManagers = [];
  },
  _alignLabels(layoutManager, inOneColumn) {
    this._alignLabelsInColumn({
      $container: this.$element(),
      layoutManager,
      excludeTabbed: true,
      items: this.option('items'),
      inOneColumn
    });
    (0, _visibility_change.triggerResizeEvent)(this.$element().find(`.${_m_constants.TOOLBAR_CLASS}`));
  },
  _clean() {
    this._clearValidationSummary();
    this.callBase();
    this._groupsColCount = [];
    this._cachedColCountOptions = [];
    this._lastMarkupScreenFactor = undefined;
    _resize_observer.default.unobserve(this.$element().get(0));
  },
  _renderScrollable() {
    const useNativeScrolling = this.option('useNativeScrolling');
    this._scrollable = new _ui.default(this.$element(), {
      useNative: !!useNativeScrolling,
      useSimulatedScrollbar: !useNativeScrolling,
      useKeyboard: false,
      direction: 'both',
      bounceEnabled: false
    });
  },
  _getContent() {
    return this.option('scrollingEnabled') ? (0, _renderer.default)(this._scrollable.content()) : this.$element();
  },
  _clearValidationSummary() {
    var _this$_$validationSum;
    (_this$_$validationSum = this._$validationSummary) === null || _this$_$validationSum === void 0 || _this$_$validationSum.remove();
    this._$validationSummary = undefined;
    this._validationSummary = undefined;
  },
  _renderValidationSummary() {
    this._clearValidationSummary();
    if (this.option('showValidationSummary')) {
      this._$validationSummary = (0, _renderer.default)('<div>').addClass(_constants.FORM_VALIDATION_SUMMARY).appendTo(this._getContent());
      this._validationSummary = this._$validationSummary.dxValidationSummary({
        validationGroup: this._getValidationGroup()
      }).dxValidationSummary('instance');
    }
  },
  _prepareItems(items, parentIsTabbedItem, currentPath, isTabs) {
    if (items) {
      const result = [];
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        const path = (0, _m_form4.concatPaths)(currentPath, (0, _m_form4.createItemPathByIndex)(i, isTabs));
        const itemRunTimeInfo = {
          item,
          itemIndex: i,
          path
        };
        const guid = this._itemsRunTimeInfo.add(itemRunTimeInfo);
        if ((0, _type.isString)(item)) {
          item = {
            dataField: item
          };
        }
        if ((0, _type.isObject)(item)) {
          const preparedItem = _extends({}, item);
          // @ts-expect-error
          itemRunTimeInfo.preparedItem = preparedItem;
          preparedItem.guid = guid;
          this._tryPrepareGroupItemCaption(preparedItem);
          this._tryPrepareGroupItem(preparedItem);
          this._tryPrepareTabbedItem(preparedItem, path);
          this._tryPrepareItemTemplate(preparedItem);
          if (parentIsTabbedItem) {
            preparedItem.cssItemClass = _constants.FIELD_ITEM_TAB_CLASS;
          }
          if (preparedItem.items) {
            preparedItem.items = this._prepareItems(preparedItem.items, parentIsTabbedItem, path);
          }
          result.push(preparedItem);
        } else {
          result.push(item);
        }
      }
      return result;
    }
  },
  _tryPrepareGroupItemCaption(item) {
    if (item.itemType === 'group') {
      item._prepareGroupCaptionTemplate = captionTemplate => {
        if (item.captionTemplate) {
          item.groupCaptionTemplate = this._getTemplate(captionTemplate);
        }
        item.captionTemplate = this._itemGroupTemplate.bind(this, item);
      };
      item._prepareGroupCaptionTemplate(item.captionTemplate);
    }
  },
  _tryPrepareGroupItem(item) {
    if (item.itemType === 'group') {
      item.alignItemLabels = (0, _common.ensureDefined)(item.alignItemLabels, true);
      item._prepareGroupItemTemplate = itemTemplate => {
        if (item.template) {
          item.groupContentTemplate = this._getTemplate(itemTemplate);
        }
        item.template = this._itemGroupTemplate.bind(this, item);
      };
      item._prepareGroupItemTemplate(item.template);
    }
  },
  _tryPrepareTabbedItem(item, path) {
    if (item.itemType === 'tabbed') {
      item.template = this._itemTabbedTemplate.bind(this, item);
      item.tabs = this._prepareItems(item.tabs, true, path, true);
    }
  },
  _tryPrepareItemTemplate(item) {
    if (item.template) {
      item.template = this._getTemplate(item.template);
    }
  },
  // @ts-expect-error
  _checkGrouping(items) {
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.itemType === 'group') {
          return true;
        }
      }
    }
  },
  _renderLayout() {
    const that = this;
    let items = that.option('items');
    const $content = that._getContent();
    // TODO: Introduce this.preparedItems and use it for partial rerender???
    // Compare new preparedItems with old preparedItems to detect what should be rerendered?
    items = that._prepareItems(items);
    // #DEBUG
    that._testResultItems = items;
    // #ENDDEBUG
    that._rootLayoutManager = that._renderLayoutManager($content, this._createLayoutManagerOptions(items, {
      isRoot: true,
      colCount: that.option('colCount'),
      alignItemLabels: that.option('alignItemLabels'),
      screenByWidth: this.option('screenByWidth'),
      colCountByScreen: this.option('colCountByScreen'),
      onLayoutChanged(inOneColumn) {
        that._alignLabels.bind(that)(that._rootLayoutManager, inOneColumn);
      },
      onContentReady(e) {
        that._alignLabels(e.component, e.component.isSingleColumnMode());
      }
    }));
  },
  _tryGetItemsForTemplate(item) {
    return item.items || [];
  },
  _itemTabbedTemplate(item, e, $container) {
    const $tabPanel = (0, _renderer.default)('<div>').appendTo($container);
    const tabPanelOptions = (0, _extend.extend)({}, item.tabPanelOptions, {
      dataSource: item.tabs,
      onItemRendered: args => {
        var _item$tabPanelOptions, _item$tabPanelOptions2;
        (_item$tabPanelOptions = item.tabPanelOptions) === null || _item$tabPanelOptions === void 0 || (_item$tabPanelOptions2 = _item$tabPanelOptions.onItemRendered) === null || _item$tabPanelOptions2 === void 0 || _item$tabPanelOptions2.call(_item$tabPanelOptions, args);
        (0, _visibility_change.triggerShownEvent)(args.itemElement);
      },
      itemTemplate: (itemData, e, container) => {
        const $container = (0, _renderer.default)(container);
        const alignItemLabels = (0, _common.ensureDefined)(itemData.alignItemLabels, true);
        const layoutManager = this._renderLayoutManager($container, this._createLayoutManagerOptions(this._tryGetItemsForTemplate(itemData), {
          colCount: itemData.colCount,
          alignItemLabels,
          screenByWidth: this.option('screenByWidth'),
          colCountByScreen: itemData.colCountByScreen,
          cssItemClass: itemData.cssItemClass,
          onLayoutChanged: inOneColumn => {
            this._alignLabelsInColumn({
              $container,
              layoutManager,
              items: itemData.items,
              inOneColumn
            });
          }
        }));
        if (this._itemsRunTimeInfo) {
          this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(itemData.guid, {
            layoutManager
          });
        }
        if (alignItemLabels) {
          this._alignLabelsInColumn({
            $container,
            layoutManager,
            items: itemData.items,
            inOneColumn: layoutManager.isSingleColumnMode()
          });
        }
      }
    });
    const tryUpdateTabPanelInstance = (items, instance) => {
      if (Array.isArray(items)) {
        items.forEach(item => this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
          widgetInstance: instance
        }));
      }
    };
    const tabPanel = this._createComponent($tabPanel, _tab_panel.default, tabPanelOptions);
    (0, _renderer.default)($container).parent().addClass(_constants.FIELD_ITEM_CONTENT_HAS_TABS_CLASS);
    tabPanel.on('optionChanged', e => {
      if (e.fullName === 'dataSource') {
        tryUpdateTabPanelInstance(e.value, e.component);
      }
    });
    tryUpdateTabPanelInstance([{
      guid: item.guid
    }, ...(item.tabs ?? [])], tabPanel);
  },
  _itemGroupCaptionTemplate(item, $group, id) {
    if (item.groupCaptionTemplate) {
      const $captionTemplate = (0, _renderer.default)('<div>').addClass(_constants.FORM_GROUP_CUSTOM_CAPTION_CLASS).attr('id', id).appendTo($group);
      item._renderGroupCaptionTemplate = () => {
        const data = {
          component: this,
          caption: item.caption,
          name: item.name
        };
        item.groupCaptionTemplate.render({
          model: data,
          container: (0, _element.getPublicElement)($captionTemplate)
        });
      };
      item._renderGroupCaptionTemplate();
      return;
    }
    if (item.caption) {
      (0, _renderer.default)('<span>').addClass(_constants.FORM_GROUP_CAPTION_CLASS).text(item.caption).attr('id', id).appendTo($group);
    }
  },
  _itemGroupContentTemplate(item, $group) {
    const $groupContent = (0, _renderer.default)('<div>').addClass(_constants.FORM_GROUP_CONTENT_CLASS).appendTo($group);
    if (item.groupContentTemplate) {
      item._renderGroupContentTemplate = () => {
        $groupContent.empty();
        const data = {
          formData: this.option('formData'),
          component: this
        };
        item.groupContentTemplate.render({
          model: data,
          container: (0, _element.getPublicElement)($groupContent)
        });
      };
      item._renderGroupContentTemplate();
    } else {
      const layoutManager = this._renderLayoutManager($groupContent, this._createLayoutManagerOptions(this._tryGetItemsForTemplate(item), {
        colCount: item.colCount,
        colCountByScreen: item.colCountByScreen,
        alignItemLabels: item.alignItemLabels,
        cssItemClass: item.cssItemClass
      }));
      this._itemsRunTimeInfo && this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
        layoutManager
      });
      const colCount = layoutManager._getColCount();
      if (!this._groupsColCount.includes(colCount)) {
        this._groupsColCount.push(colCount);
      }
      $group.addClass(_constants.GROUP_COL_COUNT_CLASS + colCount);
      $group.attr(_constants.GROUP_COL_COUNT_ATTR, colCount);
    }
  },
  _itemGroupTemplate(item, options, $container) {
    const {
      id
    } = options.editorOptions.inputAttr;
    const $group = (0, _renderer.default)('<div>').toggleClass(_constants.FORM_GROUP_WITH_CAPTION_CLASS, (0, _type.isDefined)(item.caption) && item.caption.length).addClass(_constants.FORM_GROUP_CLASS).appendTo($container);
    const groupAria = {
      role: 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      labelledby: id
    };
    this.setAria(groupAria, $group);
    (0, _renderer.default)($container).parent().addClass(_constants.FIELD_ITEM_CONTENT_HAS_GROUP_CLASS);
    this._itemGroupCaptionTemplate(item, $group, id);
    this._itemGroupContentTemplate(item, $group);
  },
  _createLayoutManagerOptions(items, extendedLayoutManagerOptions) {
    return (0, _m_form4.convertToLayoutManagerOptions)({
      form: this,
      formOptions: this.option(),
      $formElement: this.$element(),
      items,
      validationGroup: this._getValidationGroup(),
      extendedLayoutManagerOptions,
      onFieldDataChanged: args => {
        if (!this._isDataUpdating) {
          this._triggerOnFieldDataChanged(args);
        }
      },
      onContentReady: args => {
        this._itemsRunTimeInfo.addItemsOrExtendFrom(args.component._itemsRunTimeInfo);
        extendedLayoutManagerOptions.onContentReady && extendedLayoutManagerOptions.onContentReady(args);
      },
      onDisposing: _ref2 => {
        let {
          component
        } = _ref2;
        const nestedItemsRunTimeInfo = component.getItemsRunTimeInfo();
        this._itemsRunTimeInfo.removeItemsByItems(nestedItemsRunTimeInfo);
      },
      onFieldItemRendered: () => {
        var _this$_validationSumm;
        (_this$_validationSumm = this._validationSummary) === null || _this$_validationSumm === void 0 || _this$_validationSumm.refreshValidationGroup();
      }
    });
  },
  _renderLayoutManager($parent, layoutManagerOptions) {
    const baseColCountByScreen = {
      lg: layoutManagerOptions.colCount,
      md: layoutManagerOptions.colCount,
      sm: layoutManagerOptions.colCount,
      xs: 1
    };
    this._cachedColCountOptions.push({
      colCountByScreen: (0, _extend.extend)(baseColCountByScreen, layoutManagerOptions.colCountByScreen)
    });
    const $element = (0, _renderer.default)('<div>');
    $element.appendTo($parent);
    const instance = this._createComponent($element, 'dxLayoutManager', layoutManagerOptions);
    instance.on('autoColCountChanged', () => {
      this._clearAutoColCountChangedTimeout();
      this.autoColCountChangedTimeoutId = setTimeout(() => !this._disposed && this._refresh(), 0);
    });
    this._cachedLayoutManagers.push(instance);
    return instance;
  },
  _getValidationGroup() {
    return this.option('validationGroup') || this;
  },
  _createComponent($element, type, config) {
    const that = this;
    config = config || {};
    that._extendConfig(config, {
      readOnly: that.option('readOnly')
    });
    return that.callBase($element, type, config);
  },
  _attachSyncSubscriptions() {
    const that = this;
    that.on('optionChanged', args => {
      const optionFullName = args.fullName;
      if (optionFullName === 'formData') {
        if (!(0, _type.isDefined)(args.value)) {
          that._options.silent('formData', args.value = {});
        }
        that._triggerOnFieldDataChangedByDataSet(args.value);
      }
      if (that._cachedLayoutManagers.length) {
        (0, _iterator.each)(that._cachedLayoutManagers, (index, layoutManager) => {
          if (optionFullName === 'formData') {
            that._isDataUpdating = true;
            layoutManager.option('layoutData', args.value);
            that._isDataUpdating = false;
          }
          if (args.name === 'readOnly' || args.name === 'disabled') {
            layoutManager.option(optionFullName, args.value);
          }
        });
      }
    });
  },
  _optionChanged(args) {
    const splitFullName = args.fullName.split('.');
    // search() is used because the string can be ['items', ' items ', ' items .', 'items[0]', 'items[ 10 ] .', ...]
    if (splitFullName.length > 1 && splitFullName[0].search('items') !== -1 && this._itemsOptionChangedHandler(args)) {
      return;
    }
    if (splitFullName.length > 1 && splitFullName[0].search('formData') !== -1 && this._formDataOptionChangedHandler(args)) {
      return;
    }
    this._defaultOptionChangedHandler(args);
  },
  _defaultOptionChangedHandler(args) {
    switch (args.name) {
      case 'formData':
        if (!this.option('items')) {
          this._invalidate();
        } else if ((0, _type.isEmptyObject)(args.value)) {
          this._clear();
        }
        break;
      case 'onFieldDataChanged':
        break;
      case 'items':
      case 'colCount':
      case 'onEditorEnterKey':
      case 'labelLocation':
      case 'labelMode':
      case 'alignItemLabels':
      case 'showColonAfterLabel':
      case 'customizeItem':
      case 'alignItemLabelsInAllGroups':
      case 'showRequiredMark':
      case 'showOptionalMark':
      case 'requiredMark':
      case 'optionalMark':
      case 'requiredMessage':
      case 'scrollingEnabled':
      case 'formID':
      case 'colCountByScreen':
      case 'screenByWidth':
      case 'stylingMode':
        this._invalidate();
        break;
      case 'showValidationSummary':
        this._renderValidationSummary();
        break;
      case 'minColWidth':
        if (this.option('colCount') === 'auto') {
          this._invalidate();
        }
        break;
      case 'alignRootItemLabels':
      case 'readOnly':
      case 'isDirty':
        break;
      case 'width':
        this.callBase(args);
        this._rootLayoutManager.option(args.name, args.value);
        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
        break;
      case 'validationGroup':
        // @ts-expect-error
        _validation_engine.default.removeGroup(args.previousValue || this);
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  },
  _itemsOptionChangedHandler(args) {
    const nameParts = args.fullName.split('.');
    const {
      value
    } = args;
    const itemPath = this._getItemPath(nameParts);
    const item = this.option(itemPath);
    const optionNameWithoutPath = args.fullName.replace(`${itemPath}.`, '');
    const simpleOptionName = optionNameWithoutPath.split('.')[0].replace(/\[\d+]/, '');
    const itemAction = this._tryCreateItemOptionAction(simpleOptionName, item, item[simpleOptionName], args.previousValue, itemPath);
    let result = this._tryExecuteItemOptionAction(itemAction) || this._tryChangeLayoutManagerItemOption(args.fullName, value);
    if (!result && item) {
      this._changeItemOption(item, optionNameWithoutPath, value);
      const items = this._generateItemsFromData(this.option('items'));
      this.option('items', items);
      result = true;
    }
    return result;
  },
  _formDataOptionChangedHandler(args) {
    const nameParts = args.fullName.split('.');
    const {
      value
    } = args;
    const dataField = nameParts.slice(1).join('.');
    const editor = this.getEditor(dataField);
    if (editor) {
      editor.option('value', value);
    } else {
      this._triggerOnFieldDataChanged({
        dataField,
        value
      });
    }
    return true;
  },
  _tryCreateItemOptionAction(optionName, item, value, previousValue, itemPath) {
    if (optionName === 'tabs') {
      this._itemsRunTimeInfo.removeItemsByPathStartWith(`${itemPath}.tabs`);
      value = this._prepareItems(value, true, itemPath, true); // preprocess user value as in _tryPrepareTabbedItem
    }
    return (0, _m_form2.default)(optionName, {
      item,
      value,
      previousValue,
      itemsRunTimeInfo: this._itemsRunTimeInfo
    });
  },
  _tryExecuteItemOptionAction(action) {
    return action && action.tryExecute();
  },
  _updateValidationGroupAndSummaryIfNeeded(fullName) {
    const optionName = (0, _m_form4.getOptionNameFromFullName)(fullName);
    if (ITEM_OPTIONS_FOR_VALIDATION_UPDATING.includes(optionName)) {
      // @ts-expect-error
      _validation_engine.default.addGroup(this._getValidationGroup(), false);
      if (this.option('showValidationSummary')) {
        var _this$_validationSumm2;
        (_this$_validationSumm2 = this._validationSummary) === null || _this$_validationSumm2 === void 0 || _this$_validationSumm2.refreshValidationGroup();
      }
    }
  },
  _setLayoutManagerItemOption(layoutManager, optionName, value, path) {
    if (this._updateLockCount > 0) {
      !layoutManager._updateLockCount && layoutManager.beginUpdate();
      const key = this._itemsRunTimeInfo.findKeyByPath(path);
      this.postponedOperations.add(key, () => {
        !layoutManager._disposed && layoutManager.endUpdate();
        return (0, _deferred.Deferred)().resolve();
      });
    }
    const contentReadyHandler = e => {
      e.component.off('contentReady', contentReadyHandler);
      if ((0, _m_form4.isFullPathContainsTabs)(path)) {
        const tabPath = (0, _m_form4.tryGetTabPath)(path);
        const tabLayoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(tabPath);
        if (tabLayoutManager) {
          this._alignLabelsInColumn({
            items: tabLayoutManager.option('items'),
            layoutManager: tabLayoutManager,
            $container: tabLayoutManager.$element(),
            inOneColumn: tabLayoutManager.isSingleColumnMode()
          });
        }
      } else {
        this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
      }
    };
    layoutManager.on('contentReady', contentReadyHandler);
    layoutManager.option(optionName, value);
    this._updateValidationGroupAndSummaryIfNeeded(optionName);
  },
  _tryChangeLayoutManagerItemOption(fullName, value) {
    const nameParts = fullName.split('.');
    const optionName = (0, _m_form4.getOptionNameFromFullName)(fullName);
    if (optionName === 'items' && nameParts.length > 1) {
      const itemPath = this._getItemPath(nameParts);
      const layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(itemPath);
      if (layoutManager) {
        this._itemsRunTimeInfo.removeItemsByItems(layoutManager.getItemsRunTimeInfo());
        const items = this._prepareItems(value, false, itemPath);
        this._setLayoutManagerItemOption(layoutManager, optionName, items, itemPath);
        return true;
      }
    } else if (nameParts.length > 2) {
      const endPartIndex = nameParts.length - 2;
      const itemPath = this._getItemPath(nameParts.slice(0, endPartIndex));
      const layoutManager = this._itemsRunTimeInfo.findGroupOrTabLayoutManagerByPath(itemPath);
      if (layoutManager) {
        const fullOptionName = (0, _m_form4.getFullOptionName)(nameParts[endPartIndex], optionName);
        if (optionName === 'editorType') {
          // T903774
          if (layoutManager.option(fullOptionName) !== value) {
            return false;
          }
        }
        if (optionName === 'visible') {
          // T874843
          const formItems = this.option((0, _m_form4.getFullOptionName)(itemPath, 'items'));
          if (formItems && formItems.length) {
            const layoutManagerItems = layoutManager.option('items');
            formItems.forEach((item, index) => {
              const layoutItem = layoutManagerItems[index];
              layoutItem.visibleIndex = item.visibleIndex;
            });
          }
        }
        this._setLayoutManagerItemOption(layoutManager, fullOptionName, value, itemPath);
        return true;
      }
    }
    return false;
  },
  _tryChangeLayoutManagerItemOptions(itemPath, options) {
    let result;
    this.beginUpdate();
    // @ts-expect-error
    (0, _iterator.each)(options, (optionName, optionValue) => {
      result = this._tryChangeLayoutManagerItemOption((0, _m_form4.getFullOptionName)(itemPath, optionName), optionValue);
      if (!result) {
        return false;
      }
    });
    this.endUpdate();
    return result;
  },
  _getItemPath(nameParts) {
    let itemPath = nameParts[0];
    let i;
    for (i = 1; i < nameParts.length; i++) {
      if (nameParts[i].search(/items\[\d+]|tabs\[\d+]/) !== -1) {
        itemPath += `.${nameParts[i]}`;
      } else {
        break;
      }
    }
    return itemPath;
  },
  _triggerOnFieldDataChanged(args) {
    this._updateIsDirty(args.dataField);
    this._createActionByOption('onFieldDataChanged')(args);
  },
  _triggerOnFieldDataChangedByDataSet(data) {
    if (data && (0, _type.isObject)(data)) {
      Object.keys(data).forEach(key => {
        this._triggerOnFieldDataChanged({
          dataField: key,
          value: data[key]
        });
      });
    }
  },
  _updateFieldValue(dataField, value) {
    if ((0, _type.isDefined)(this.option('formData'))) {
      const editor = this.getEditor(dataField);
      this.option(`formData.${dataField}`, value);
      if (editor) {
        const editorValue = editor.option('value');
        if (editorValue !== value) {
          editor.option('value', value);
        }
      }
    }
  },
  _generateItemsFromData(items) {
    const formData = this.option('formData');
    const result = [];
    if (!items && (0, _type.isDefined)(formData)) {
      (0, _iterator.each)(formData, dataField => {
        // @ts-expect-error
        result.push({
          dataField
        });
      });
    }
    if (items) {
      (0, _iterator.each)(items, (index, item) => {
        if ((0, _type.isObject)(item)) {
          // @ts-expect-error
          result.push(item);
        } else {
          // @ts-expect-error
          result.push({
            dataField: item
          });
        }
      });
    }
    return result;
  },
  _getItemByField(field, items) {
    const that = this;
    const fieldParts = (0, _type.isObject)(field) ? field : that._getFieldParts(field);
    const {
      fieldName
    } = fieldParts;
    const {
      fieldPath
    } = fieldParts;
    let resultItem;
    if (items.length) {
      // @ts-expect-error
      (0, _iterator.each)(items, (index, item) => {
        const {
          itemType
        } = item;
        if (fieldPath.length) {
          const path = fieldPath.slice();
          item = that._getItemByFieldPath(path, fieldName, item);
        } else if (itemType === 'group' && !(item.caption || item.name) || itemType === 'tabbed' && !item.name) {
          const subItemsField = that._getSubItemField(itemType);
          item.items = that._generateItemsFromData(item.items);
          item = that._getItemByField({
            fieldName,
            fieldPath
          }, item[subItemsField]);
        }
        if ((0, _m_form4.isEqualToDataFieldOrNameOrTitleOrCaption)(item, fieldName)) {
          resultItem = item;
          return false;
        }
      });
    }
    return resultItem;
  },
  _getFieldParts(field) {
    const fieldSeparator = '.';
    let fieldName = field;
    let separatorIndex = fieldName.indexOf(fieldSeparator);
    const resultPath = [];
    while (separatorIndex !== -1) {
      // @ts-expect-error
      resultPath.push(fieldName.substr(0, separatorIndex));
      fieldName = fieldName.substr(separatorIndex + 1);
      separatorIndex = fieldName.indexOf(fieldSeparator);
    }
    return {
      fieldName,
      fieldPath: resultPath.reverse()
    };
  },
  _getItemByFieldPath(path, fieldName, item) {
    const that = this;
    const {
      itemType
    } = item;
    const subItemsField = that._getSubItemField(itemType);
    const isItemWithSubItems = itemType === 'group' || itemType === 'tabbed' || item.title;
    let result;
    do {
      if (isItemWithSubItems) {
        const name = item.name || item.caption || item.title;
        const isGroupWithName = (0, _type.isDefined)(name);
        const nameWithoutSpaces = (0, _m_form4.getTextWithoutSpaces)(name);
        let pathNode;
        item[subItemsField] = that._generateItemsFromData(item[subItemsField]);
        if (isGroupWithName) {
          pathNode = path.pop();
        }
        if (!path.length) {
          result = that._getItemByField(fieldName, item[subItemsField]);
          if (result) {
            break;
          }
        }
        if (!isGroupWithName || isGroupWithName && nameWithoutSpaces === pathNode) {
          if (path.length) {
            result = that._searchItemInEverySubItem(path, fieldName, item[subItemsField]);
          }
        }
      } else {
        break;
      }
    } while (path.length && !(0, _type.isDefined)(result));
    return result;
  },
  _getSubItemField(itemType) {
    return itemType === 'tabbed' ? 'tabs' : 'items';
  },
  _searchItemInEverySubItem(path, fieldName, items) {
    const that = this;
    let result;
    // @ts-expect-error
    (0, _iterator.each)(items, (index, groupItem) => {
      result = that._getItemByFieldPath(path.slice(), fieldName, groupItem);
      if (result) {
        return false;
      }
    });
    if (!result) {
      result = false;
    }
    return result;
  },
  _changeItemOption(item, option, value) {
    if ((0, _type.isObject)(item)) {
      item[option] = value;
    }
  },
  _dimensionChanged() {
    const currentScreenFactor = this._getCurrentScreenFactor();
    if (this._lastMarkupScreenFactor !== currentScreenFactor) {
      if (this._isColCountChanged(this._lastMarkupScreenFactor, currentScreenFactor)) {
        this._targetScreenFactor = currentScreenFactor;
        this._refresh();
        this._targetScreenFactor = undefined;
      }
      this._lastMarkupScreenFactor = currentScreenFactor;
    }
  },
  _isColCountChanged(oldScreenSize, newScreenSize) {
    let isChanged = false;
    // @ts-expect-error
    (0, _iterator.each)(this._cachedColCountOptions, (index, item) => {
      if (item.colCountByScreen[oldScreenSize] !== item.colCountByScreen[newScreenSize]) {
        isChanged = true;
        return false;
      }
    });
    return isChanged;
  },
  _refresh() {
    const editorSelector = `.${FOCUSED_STATE_CLASS} > :not(.dx-dropdowneditor-input-wrapper) input,` + ` .${FOCUSED_STATE_CLASS} textarea`;
    // @ts-expect-error
    _events_engine.default.trigger(this.$element().find(editorSelector), 'change');
    this.callBase();
  },
  _updateIsDirty(dataField) {
    const editor = this.getEditor(dataField);
    if (!editor) return;
    if (editor.option('isDirty')) {
      this._dirtyFields.add(dataField);
    } else {
      this._dirtyFields.delete(dataField);
    }
    this.option('isDirty', !!this._dirtyFields.size);
  },
  updateRunTimeInfoForEachEditor(editorAction) {
    this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
      const {
        widgetInstance
      } = itemRunTimeInfo;
      // @ts-expect-error
      if ((0, _type.isDefined)(widgetInstance) && _editor.default.isEditor(widgetInstance)) {
        editorAction(widgetInstance);
      }
    });
  },
  _clear() {
    this.updateRunTimeInfoForEachEditor(editor => {
      editor.clear();
      editor.option('isValid', true);
    });
    _validation_engine.default.resetGroup(this._getValidationGroup());
  },
  _updateData(data, value, isComplexData) {
    const that = this;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _data = isComplexData ? value : data;
    if ((0, _type.isObject)(_data)) {
      (0, _iterator.each)(_data, (dataField, fieldValue) => {
        that._updateData(isComplexData ? `${data}.${dataField}` : dataField, fieldValue, (0, _type.isObject)(fieldValue));
      });
    } else if ((0, _type.isString)(data)) {
      that._updateFieldValue(data, value);
    }
  },
  registerKeyHandler(key, handler) {
    this.callBase(key, handler);
    this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
      if ((0, _type.isDefined)(itemRunTimeInfo.widgetInstance)) {
        itemRunTimeInfo.widgetInstance.registerKeyHandler(key, handler);
      }
    });
  },
  _focusTarget() {
    return this.$element().find(`.${_constants.FIELD_ITEM_CONTENT_CLASS} [tabindex]`).first();
  },
  _visibilityChanged() {
    this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
  },
  _clearAutoColCountChangedTimeout() {
    if (this.autoColCountChangedTimeoutId) {
      clearTimeout(this.autoColCountChangedTimeoutId);
      this.autoColCountChangedTimeoutId = undefined;
    }
  },
  _dispose() {
    this._clearAutoColCountChangedTimeout();
    // @ts-expect-error
    _validation_engine.default.removeGroup(this._getValidationGroup());
    this.callBase();
  },
  clear() {
    this._clear();
  },
  resetValues() {
    this._clear();
  },
  reset(editorsData) {
    this.updateRunTimeInfoForEachEditor(editor => {
      const editorName = editor.option('name');
      if (editorsData && editorName in editorsData) {
        editor.reset(editorsData[editorName]);
      } else {
        editor.reset();
      }
    });
    this._renderValidationSummary();
  },
  updateData(data, value) {
    this._updateData(data, value);
  },
  getEditor(dataField) {
    return this._itemsRunTimeInfo.findWidgetInstanceByDataField(dataField) || this._itemsRunTimeInfo.findWidgetInstanceByName(dataField);
  },
  getButton(name) {
    return this._itemsRunTimeInfo.findWidgetInstanceByName(name);
  },
  updateDimensions() {
    const that = this;
    const deferred = (0, _deferred.Deferred)();
    if (that._scrollable) {
      that._scrollable.update().done(() => {
        deferred.resolveWith(that);
      });
    } else {
      deferred.resolveWith(that);
    }
    return deferred.promise();
  },
  itemOption(id, option, value) {
    const items = this._generateItemsFromData(this.option('items'));
    const item = this._getItemByField(id, items);
    const path = (0, _m_form4.getItemPath)(items, item);
    if (!item) {
      return;
    }
    switch (arguments.length) {
      case 1:
        return item;
      case 3:
        {
          const itemAction = this._tryCreateItemOptionAction(option, item, value, item[option], path);
          this._changeItemOption(item, option, value);
          const fullName = (0, _m_form4.getFullOptionName)(path, option);
          if (!this._tryExecuteItemOptionAction(itemAction) && !this._tryChangeLayoutManagerItemOption(fullName, value)) {
            this.option('items', items);
          }
          break;
        }
      default:
        {
          if ((0, _type.isObject)(option)) {
            if (!this._tryChangeLayoutManagerItemOptions(path, option)) {
              let allowUpdateItems;
              (0, _iterator.each)(option, (optionName, optionValue) => {
                const itemAction = this._tryCreateItemOptionAction(optionName, item, optionValue, item[optionName], path);
                this._changeItemOption(item, optionName, optionValue);
                if (!allowUpdateItems && !this._tryExecuteItemOptionAction(itemAction)) {
                  allowUpdateItems = true;
                }
              });
              allowUpdateItems && this.option('items', items);
            }
          }
          break;
        }
    }
  },
  validate() {
    return _validation_engine.default.validateGroup(this._getValidationGroup());
  },
  getItemID(name) {
    return `dx_${this.option('formID')}_${name || new _guid.default()}`;
  },
  getTargetScreenFactor() {
    return this._targetScreenFactor;
  }
});
(0, _component_registrator.default)('dxForm', Form);
var _default = exports.default = Form;