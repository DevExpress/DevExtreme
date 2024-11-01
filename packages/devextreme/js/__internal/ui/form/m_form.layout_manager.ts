import '@js/ui/text_box';
import '@js/ui/number_box';
import '@js/ui/check_box';
import '@js/ui/date_box';
import '@js/ui/button';

import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { normalizeIndexes } from '@js/core/utils/array';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import {
  isDefined, isEmptyObject, isFunction, isObject, type,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
// @ts-expect-error
import { getCurrentScreenFactor, hasWindow } from '@js/core/utils/window';
import ResponsiveBox from '@js/ui/responsive_box';
import Widget from '@js/ui/widget/ui.widget';

import { renderButtonItem } from './components/m_button_item';
import { renderEmptyItem } from './components/m_empty_item';
import { renderFieldItem } from './components/m_field_item';
import {
  FIELD_ITEM_CLASS,
  FORM_LAYOUT_MANAGER_CLASS,
  LAYOUT_MANAGER_ONE_COLUMN,
  ROOT_SIMPLE_ITEM_CLASS,
  SIMPLE_ITEM_TYPE,
  SINGLE_COLUMN_ITEM_CONTENT,
} from './constants';
// eslint-disable-next-line import/no-named-default
import { default as FormItemsRunTimeInfo } from './m_form.items_runtime_info';
import { convertToRenderFieldItemOptions } from './m_form.layout_manager.utils';

const FORM_EDITOR_BY_DEFAULT = 'dxTextBox';

const LAYOUT_MANAGER_FIRST_ROW_CLASS = 'dx-first-row';
const LAYOUT_MANAGER_LAST_ROW_CLASS = 'dx-last-row';
const LAYOUT_MANAGER_FIRST_COL_CLASS = 'dx-first-col';
const LAYOUT_MANAGER_LAST_COL_CLASS = 'dx-last-col';

// @ts-expect-error
const LayoutManager = Widget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      layoutData: {},
      readOnly: false,
      colCount: 1,
      colCountByScreen: undefined,
      labelLocation: 'left',
      onFieldDataChanged: null,
      onEditorEnterKey: null,
      customizeItem: null,
      alignItemLabels: true,
      minColWidth: 200,
      showRequiredMark: true,
      screenByWidth: null,
      showOptionalMark: false,
      requiredMark: '*',
      labelMode: 'outside',
      optionalMark: messageLocalization.format('dxForm-optionalMark'),
      requiredMessage: messageLocalization.getFormatter('dxForm-requiredMessage'),
    });
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      layoutData: true,
      validationGroup: true,
    });
  },

  _init() {
    const layoutData = this.option('layoutData');

    this.callBase();
    this._itemWatchers = [];
    this._itemsRunTimeInfo = new FormItemsRunTimeInfo();
    this._updateReferencedOptions(layoutData);
    this._initDataAndItems(layoutData);
  },

  _dispose() {
    this.callBase();

    this._cleanItemWatchers();
  },

  _initDataAndItems(initialData) {
    this._syncDataWithItems();
    this._updateItems(initialData);
  },

  _syncDataWithItems() {
    const layoutData = this.option('layoutData');
    const userItems = this.option('items');

    if (isDefined(userItems)) {
      userItems.forEach((item) => {
        if (item.dataField && this._getDataByField(item.dataField) === undefined) {
          let value;
          if (item.editorOptions) {
            value = item.editorOptions.value;
          }

          if (isDefined(value) || item.dataField in layoutData) {
            this._updateFieldValue(item.dataField, value);
          }
        }
      });
    }
  },

  _getDataByField(dataField) {
    return dataField ? this.option(`layoutData.${dataField}`) : null;
  },

  _isCheckboxUndefinedStateEnabled({ allowIndeterminateState, editorType, dataField }) {
    if (allowIndeterminateState === true && editorType === 'dxCheckBox') {
      const nameParts = ['layoutData', ...dataField.split('.')];
      const propertyName = nameParts.pop();
      const layoutData = this.option(nameParts.join('.'));

      return layoutData && (propertyName in layoutData);
    }

    return false;
  },

  _updateFieldValue(dataField, value) {
    const layoutData = this.option('layoutData');
    let newValue = value;

    if (!variableWrapper.isWrapped(layoutData[dataField]) && isDefined(dataField)) {
      this.option(`layoutData.${dataField}`, newValue);
    } else if (variableWrapper.isWritableWrapped(layoutData[dataField])) {
      newValue = isFunction(newValue) ? newValue() : newValue;

      layoutData[dataField](newValue);
    }

    this._triggerOnFieldDataChanged({ dataField, value: newValue });
  },

  _triggerOnFieldDataChanged(args) {
    this._createActionByOption('onFieldDataChanged')(args);
  },

  _updateItems(layoutData) {
    const that = this;
    const userItems = this.option('items');
    const isUserItemsExist = isDefined(userItems);
    const customizeItem = that.option('customizeItem');

    const items = isUserItemsExist ? userItems : this._generateItemsByData(layoutData);
    if (isDefined(items)) {
      const processedItems: any = [];

      each(items, (index, item) => {
        if (that._isAcceptableItem(item)) {
          item = that._processItem(item);

          customizeItem && customizeItem(item);

          // @ts-expect-error
          if (isObject(item) && variableWrapper.unwrap(item.visible) !== false) {
            processedItems.push(item);
          }
        }
      });

      if (!that._itemWatchers.length || !isUserItemsExist) {
        that._updateItemWatchers(items);
      }

      this._setItems(processedItems);
      this._sortItems();
    }
  },

  _cleanItemWatchers() {
    this._itemWatchers.forEach((dispose) => {
      dispose();
    });
    this._itemWatchers = [];
  },

  _updateItemWatchers(items) {
    const that = this;
    const watch = that._getWatch();

    items.forEach((item) => {
      // @ts-expect-error
      if (isObject(item) && isDefined(item.visible) && isFunction(watch)) {
        that._itemWatchers.push(
          watch(
            // @ts-expect-error
            () => variableWrapper.unwrap(item.visible),
            () => {
              that._updateItems(that.option('layoutData'));
              that.repaint();
            },
            { skipImmediate: true },
          ),
        );
      }
    });
  },

  _generateItemsByData(layoutData) {
    const result = [];

    if (isDefined(layoutData)) {
      each(layoutData, (dataField) => {
        // @ts-expect-error
        result.push({
          dataField,
        });
      });
    }

    return result;
  },

  _isAcceptableItem(item) {
    const itemField = item.dataField || item;
    const itemData = this._getDataByField(itemField);

    return !(isFunction(itemData) && !variableWrapper.isWrapped(itemData));
  },

  _processItem(item) {
    if (typeof item === 'string') {
      item = { dataField: item };
    }

    if (typeof item === 'object' && !item.itemType) {
      item.itemType = SIMPLE_ITEM_TYPE;
    }

    if (!isDefined(item.editorType) && isDefined(item.dataField)) {
      const value = this._getDataByField(item.dataField);

      item.editorType = isDefined(value) ? this._getEditorTypeByDataType(type(value)) : FORM_EDITOR_BY_DEFAULT;
    }

    if (item.editorType === 'dxCheckBox') {
      item.allowIndeterminateState = item.allowIndeterminateState ?? true;
    }

    return item;
  },

  _getEditorTypeByDataType(dataType) {
    switch (dataType) {
      case 'number':
        return 'dxNumberBox';
      case 'date':
        return 'dxDateBox';
      case 'boolean':
        return 'dxCheckBox';
      default:
        return 'dxTextBox';
    }
  },

  _sortItems() {
    normalizeIndexes(this._items, 'visibleIndex');
    this._sortIndexes();
  },

  _sortIndexes() {
    this._items.sort((itemA, itemB) => {
      const indexA = itemA.visibleIndex;
      const indexB = itemB.visibleIndex;
      let result;

      if (indexA > indexB) {
        result = 1;
      } else if (indexA < indexB) {
        result = -1;
      } else {
        result = 0;
      }

      return result;
    });
  },

  _initMarkup() {
    this._itemsRunTimeInfo.clear();
    this.$element().addClass(FORM_LAYOUT_MANAGER_CLASS);

    this.callBase();
    this._renderResponsiveBox();
  },

  _renderResponsiveBox() {
    const that = this;
    const templatesInfo = [];

    if (that._items && that._items.length) {
      const colCount = that._getColCount();
      const $container = $('<div>').appendTo(that.$element());

      that._prepareItemsWithMerging(colCount);

      const layoutItems = that._generateLayoutItems();
      that._responsiveBox = that._createComponent($container, ResponsiveBox, that._getResponsiveBoxConfig(layoutItems, colCount, templatesInfo));
      if (!hasWindow()) {
        that._renderTemplates(templatesInfo);
      }
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemStateChangedHandler(e) {
    this._refresh();
  },

  _renderTemplates(templatesInfo) {
    const that = this;

    let itemsWithLabelTemplateCount = 0;

    templatesInfo.forEach(({ item }) => {
      if (item?.label?.template) {
        itemsWithLabelTemplateCount++;
      }
    });

    each(templatesInfo, (index, info) => {
      switch (info.itemType) {
        case 'empty':
          renderEmptyItem(info);
          break;
        case 'button':
          that._renderButtonItem(info);
          break;
        default: {
          that._renderFieldItem(info, itemsWithLabelTemplateCount);
        }
      }
    });
  },

  _getResponsiveBoxConfig(layoutItems, colCount, templatesInfo) {
    const that = this;
    const colCountByScreen = that.option('colCountByScreen');
    const xsColCount = colCountByScreen && colCountByScreen.xs;

    return {
      onItemStateChanged: this._itemStateChangedHandler.bind(this),
      onLayoutChanged() {
        const onLayoutChanged = that.option('onLayoutChanged');
        const isSingleColumnMode = that.isSingleColumnMode();

        if (onLayoutChanged) {
          that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, isSingleColumnMode);
          onLayoutChanged(isSingleColumnMode);
        }
      },
      onContentReady(e) {
        if (hasWindow()) {
          that._renderTemplates(templatesInfo);
        }
        if (that.option('onLayoutChanged')) {
          that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, that.isSingleColumnMode(e.component));
        }
      },
      itemTemplate(e, itemData, itemElement) {
        if (!e.location) {
          return;
        }
        const $itemElement = $(itemElement);
        const itemRenderedCountInPreviousRows = e.location.row * colCount;
        const item = that._items[e.location.col + itemRenderedCountInPreviousRows];
        if (!item) {
          return;
        }

        const itemCssClassList = [item.cssClass];

        $itemElement.toggleClass(SINGLE_COLUMN_ITEM_CONTENT, that.isSingleColumnMode(this));

        if (e.location.row === 0) {
          itemCssClassList.push(LAYOUT_MANAGER_FIRST_ROW_CLASS);
        }
        if (e.location.col === 0) {
          itemCssClassList.push(LAYOUT_MANAGER_FIRST_COL_CLASS);
        }

        if (item.itemType === SIMPLE_ITEM_TYPE && that.option('isRoot')) {
          $itemElement.addClass(ROOT_SIMPLE_ITEM_CLASS);
        }
        const isLastColumn = (e.location.col === colCount - 1) || (e.location.col + e.location.colspan === colCount);
        const rowsCount = that._getRowsCount();
        const isLastRow = e.location.row === rowsCount - 1;
        if (isLastColumn) {
          itemCssClassList.push(LAYOUT_MANAGER_LAST_COL_CLASS);
        }
        if (isLastRow) {
          itemCssClassList.push(LAYOUT_MANAGER_LAST_ROW_CLASS);
        }

        if (item.itemType !== 'empty') {
          itemCssClassList.push(FIELD_ITEM_CLASS);
          itemCssClassList.push(that.option('cssItemClass'));
          if (isDefined(item.col)) {
            itemCssClassList.push(`dx-col-${item.col}`);
          }
        }

        templatesInfo.push({
          itemType: item.itemType,
          item,
          $parent: $itemElement,
          rootElementCssClassList: itemCssClassList,
        });
      },
      cols: that._generateRatio(colCount),
      rows: that._generateRatio(that._getRowsCount(), true),
      dataSource: layoutItems,
      screenByWidth: that.option('screenByWidth'),
      singleColumnScreen: xsColCount ? false : 'xs',
    };
  },

  _getColCount() {
    let colCount = this.option('colCount');
    const colCountByScreen = this.option('colCountByScreen');

    if (colCountByScreen) {
      let screenFactor = this.option('form').getTargetScreenFactor();
      if (!screenFactor) {
        screenFactor = hasWindow() ? getCurrentScreenFactor(this.option('screenByWidth')) : 'lg';
      }
      colCount = colCountByScreen[screenFactor] || colCount;
    }

    if (colCount === 'auto') {
      if (this._cashedColCount) {
        return this._cashedColCount;
      }

      this._cashedColCount = colCount = this._getMaxColCount();
    }

    return colCount < 1 ? 1 : colCount;
  },

  _getMaxColCount() {
    if (!hasWindow()) {
      return 1;
    }

    const minColWidth = this.option('minColWidth');
    const width = getWidth(this.$element());
    const itemsCount = this._items.length;
    const maxColCount = Math.floor(width / minColWidth) || 1;

    return itemsCount < maxColCount ? itemsCount : maxColCount;
  },

  isCachedColCountObsolete() {
    return this._cashedColCount && this._getMaxColCount() !== this._cashedColCount;
  },

  _prepareItemsWithMerging(colCount) {
    const items = this._items.slice(0);
    let item;
    let itemsMergedByCol;
    let result = [];
    let j;
    let i;

    for (i = 0; i < items.length; i++) {
      item = items[i];
      // @ts-expect-error
      result.push(item);

      if (this.option('alignItemLabels') || item.alignItemLabels || item.colSpan) {
        item.col = this._getColByIndex(result.length - 1, colCount);
      }
      if (item.colSpan > 1 && (item.col + item.colSpan <= colCount)) {
        itemsMergedByCol = [];
        for (j = 0; j < item.colSpan - 1; j++) {
          itemsMergedByCol.push({ merged: true });
        }
        result = result.concat(itemsMergedByCol);
      } else {
        delete item.colSpan;
      }
    }
    this._setItems(result);
  },

  _getColByIndex(index, colCount) {
    return index % colCount;
  },

  _setItems(items) {
    this._items = items;
    this._cashedColCount = null; // T923489
  },

  _generateLayoutItems() {
    const items = this._items;
    const colCount = this._getColCount();
    const result: any = [];
    let item;
    let i;

    for (i = 0; i < items.length; i++) {
      item = items[i];

      if (!item.merged) {
        const generatedItem: any = {
          location: {
            // @ts-expect-error
            // eslint-disable-next-line radix
            row: parseInt(i / colCount),
            col: this._getColByIndex(i, colCount),
          },
        };
        if (isDefined(item.disabled)) {
          generatedItem.disabled = item.disabled;
        }
        if (isDefined(item.visible)) {
          generatedItem.visible = item.visible;
        }
        if (isDefined(item.colSpan)) {
          generatedItem.location.colspan = item.colSpan;
        }
        if (isDefined(item.rowSpan)) {
          generatedItem.location.rowspan = item.rowSpan;
        }
        result.push(generatedItem);
      }
    }

    return result;
  },

  _renderEmptyItem($container) {
    // @ts-expect-error
    renderEmptyItem({ $container });
  },

  _renderButtonItem({ item, $parent, rootElementCssClassList }) {
    const { $rootElement, buttonInstance } = renderButtonItem({
      item,
      $parent,
      rootElementCssClassList,
      validationGroup: this.option('validationGroup'),
      createComponentCallback: this._createComponent.bind(this),
    });

    // TODO: try to remove '_itemsRunTimeInfo' from 'render' function
    this._itemsRunTimeInfo.add({
      item,
      widgetInstance: buttonInstance, // TODO: try to remove 'widgetInstance'
      guid: item.guid,
      $itemContainer: $rootElement,
    });
  },

  _renderFieldItem({ item, $parent, rootElementCssClassList }, itemsWithLabelTemplateCount) {
    const editorValue = this._getDataByField(item.dataField);
    let canAssignUndefinedValueToEditor = false;
    if (editorValue === undefined) {
      const { allowIndeterminateState, editorType, dataField } = item;
      canAssignUndefinedValueToEditor = this._isCheckboxUndefinedStateEnabled({ allowIndeterminateState, editorType, dataField });
    }

    const name = item.dataField || item.name;
    const formOrLayoutManager = this._getFormOrThis();

    const onLabelTemplateRendered = () => {
      this._incTemplateRenderedCallCount();

      if (this._shouldAlignLabelsOnTemplateRendered(formOrLayoutManager, itemsWithLabelTemplateCount)) {
        formOrLayoutManager._alignLabels(this, this.isSingleColumnMode(formOrLayoutManager));
      }
    };

    const { $fieldEditorContainer, widgetInstance, $rootElement } = renderFieldItem(convertToRenderFieldItemOptions({
      $parent,
      rootElementCssClassList,
      item,
      name,
      editorValue,
      canAssignUndefinedValueToEditor,
      formOrLayoutManager: this._getFormOrThis(),
      createComponentCallback: this._createComponent.bind(this),
      formLabelLocation: this.option('labelLocation'),
      requiredMessageTemplate: this.option('requiredMessage'),
      validationGroup: this.option('validationGroup'),
      editorValidationBoundary: this.option('validationBoundary'),
      editorStylingMode: this.option('form') && this.option('form').option('stylingMode'),
      showColonAfterLabel: this.option('showColonAfterLabel'),
      managerLabelLocation: this.option('labelLocation'),
      template: item.template ? this._getTemplate(item.template) : null,
      labelTemplate: item.label?.template ? this._getTemplate(item.label.template) : null,
      itemId: this.option('form') && this.option('form').getItemID(name),
      managerMarkOptions: this._getMarkOptions(),
      labelMode: this.option('labelMode'),
      onLabelTemplateRendered,
    }));

    this.option('onFieldItemRendered')?.();

    if (widgetInstance && item.dataField) {
      // TODO: move to renderFieldItem ?
      this._bindDataField(widgetInstance, item.dataField, item.editorType, $fieldEditorContainer);
    }
    this._itemsRunTimeInfo.add({
      item,
      widgetInstance,
      guid: item.guid,
      $itemContainer: $rootElement,
    });
  },

  _incTemplateRenderedCallCount() {
    this._labelTemplateRenderedCallCount = (this._labelTemplateRenderedCallCount ?? 0) + 1;
  },

  _shouldAlignLabelsOnTemplateRendered(formOrLayoutManager, totalItemsWithLabelTemplate) {
    return formOrLayoutManager.option('templatesRenderAsynchronously') && this._labelTemplateRenderedCallCount === totalItemsWithLabelTemplate;
  },

  _getMarkOptions() {
    return {
      showRequiredMark: this.option('showRequiredMark'),
      requiredMark: this.option('requiredMark'),
      showOptionalMark: this.option('showOptionalMark'),
      optionalMark: this.option('optionalMark'),
    };
  },

  _getFormOrThis() {
    return this.option('form') || this;
  },

  _bindDataField(editorInstance, dataField, editorType, $container) {
    const formOrThis = this._getFormOrThis();

    editorInstance.on('enterKey', (args) => {
      formOrThis._createActionByOption('onEditorEnterKey')(extend(args, { dataField }));
    });

    this._createWatcher(editorInstance, $container, dataField);
    this.linkEditorToDataField(editorInstance, dataField, editorType);
  },

  _createWatcher(editorInstance, $container, dataField) {
    function compareArrays(array1, array2) {
      if (!Array.isArray(array1) || !Array.isArray(array2) || (array1.length !== array2.length)) {
        return false;
      }
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    }

    const that = this;
    const watch = that._getWatch();

    if (!isFunction(watch)) {
      return;
    }

    const dispose = watch(
      () => that._getDataByField(dataField),
      () => {
        const fieldValue = that._getDataByField(dataField);
        if (editorInstance.NAME === 'dxTagBox') {
          const editorValue = editorInstance.option('value');
          if ((fieldValue !== editorValue) && compareArrays(fieldValue, editorValue)) {
            // handle array only, it can be wrapped into Proxy (T1020953)
            return;
          }
        }
        editorInstance.option('value', fieldValue);
      },
      {
        deep: true,
        skipImmediate: true,
      },
      /// #DEBUG
      { createWatcherDataField: dataField },
      /// #ENDDEBUG
    );

    eventsEngine.on($container, removeEvent, dispose);
  },

  _getWatch() {
    if (!isDefined(this._watch)) {
      const formInstance = this.option('form');

      this._watch = formInstance && formInstance.option('integrationOptions.watchMethod');
    }

    return this._watch;
  },

  _createComponent($editor, type, editorOptions) {
    const readOnlyState = this.option('readOnly');
    // @ts-expect-error
    let hasEditorReadOnly = Object.hasOwn(editorOptions, 'readOnly');
    const instance = this.callBase($editor, type, {
      ...editorOptions,
      readOnly: !hasEditorReadOnly ? readOnlyState : editorOptions.readOnly,
    });

    let isChangeByForm = false;
    instance.on('optionChanged', (args) => {
      if (args.name === 'readOnly' && !isChangeByForm) {
        hasEditorReadOnly = true;
      }
    });

    this.on('optionChanged', (args) => {
      if (args.name === 'readOnly' && !hasEditorReadOnly) {
        isChangeByForm = true;
        instance.option(args.name, args.value);
        isChangeByForm = false;
      }
    });

    return instance;
  },

  _generateRatio(count, isAutoSize) {
    const result: any = [];
    let ratio;
    let i;

    for (i = 0; i < count; i++) {
      ratio = { ratio: 1 };
      if (isAutoSize) {
        ratio.baseSize = 'auto';
      }
      result.push(ratio);
    }

    return result;
  },

  _getRowsCount() {
    return Math.ceil(this._items.length / this._getColCount());
  },

  _updateReferencedOptions(newLayoutData) {
    const layoutData = this.option('layoutData');

    if (isObject(layoutData)) {
      Object.getOwnPropertyNames(layoutData)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        .forEach((property) => delete this._optionsByReference[`layoutData.${property}`]);
    }

    if (isObject(newLayoutData)) {
      Object.getOwnPropertyNames(newLayoutData)
        // eslint-disable-next-line no-return-assign
        .forEach((property) => this._optionsByReference[`layoutData.${property}`] = true);
    }
  },

  _clearWidget(instance) {
    this._disableEditorValueChangedHandler = true;
    instance.clear();
    this._disableEditorValueChangedHandler = false;
    instance.option('isValid', true);
  },

  _optionChanged(args) {
    if (args.fullName.search('layoutData.') === 0) {
      return;
    }

    switch (args.name) {
      case 'showRequiredMark':
      case 'showOptionalMark':
      case 'requiredMark':
      case 'optionalMark':
        this._cashedRequiredConfig = null;
        this._invalidate();
        break;
      case 'layoutData':
        this._updateReferencedOptions(args.value);

        if (this.option('items')) {
          if (!isEmptyObject(args.value)) {
            this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
              if (isDefined(itemRunTimeInfo.item)) {
                const { dataField } = itemRunTimeInfo.item;

                if (dataField && isDefined(itemRunTimeInfo.widgetInstance)) {
                  const valueGetter = compileGetter(dataField);
                  // @ts-expect-error
                  const dataValue = valueGetter(args.value);

                  const { allowIndeterminateState, editorType } = itemRunTimeInfo.item;
                  if (dataValue !== undefined || this._isCheckboxUndefinedStateEnabled(
                    { allowIndeterminateState, editorType, dataField },
                  )) {
                    itemRunTimeInfo.widgetInstance.option('value', dataValue);
                  } else {
                    this._clearWidget(itemRunTimeInfo.widgetInstance);
                  }
                }
              }
            });
          }
        } else {
          this._initDataAndItems(args.value);
          this._invalidate();
        }
        break;
      case 'items':
        this._cleanItemWatchers();
        this._initDataAndItems(args.value);
        this._invalidate();
        break;
      case 'alignItemLabels':
      case 'labelLocation':
      case 'labelMode':
      case 'requiredMessage':
        this._invalidate();
        break;
      case 'customizeItem':
        this._updateItems(this.option('layoutData'));
        this._invalidate();
        break;
      case 'colCount':
      case 'colCountByScreen':
        this._resetColCount();
        break;
      case 'minColWidth':
        if (this.option('colCount') === 'auto') {
          this._resetColCount();
        }
        break;
      case 'readOnly':
        break;
      case 'width':
        this.callBase(args);

        if (this.option('colCount') === 'auto') {
          this._resetColCount();
        }
        break;
      case 'onFieldDataChanged':
        break;
      default:
        this.callBase(args);
    }
  },

  _resetColCount() {
    this._cashedColCount = null;
    this._invalidate();
  },

  linkEditorToDataField(editorInstance, dataField) {
    this.on('optionChanged', (args) => {
      if (args.fullName === `layoutData.${dataField}`) {
        editorInstance._setOptionWithoutOptionChange('value', args.value);
      }
    });
    editorInstance.on('valueChanged', (args) => {
      // TODO: This need only for the KO integration
      const isValueReferenceType = isObject(args.value) || Array.isArray(args.value);
      if (!this._disableEditorValueChangedHandler && !(isValueReferenceType && args.value === args.previousValue)) {
        this._updateFieldValue(dataField, args.value);
      }
    });
  },

  _dimensionChanged() {
    if (this.option('colCount') === 'auto' && this.isCachedColCountObsolete()) {
      this._eventsStrategy.fireEvent('autoColCountChanged');
    }
  },

  updateData(data, value) {
    const that = this;

    if (isObject(data)) {
      each(data, (dataField, fieldValue) => {
        that._updateFieldValue(dataField, fieldValue);
      });
    } else if (typeof data === 'string') {
      that._updateFieldValue(data, value);
    }
  },

  getEditor(field) {
    return this._itemsRunTimeInfo.findWidgetInstanceByDataField(field) || this._itemsRunTimeInfo.findWidgetInstanceByName(field);
  },

  // @ts-expect-error
  isSingleColumnMode(component) {
    const responsiveBox = this._responsiveBox || component;
    if (responsiveBox) {
      return responsiveBox.option('currentScreenFactor') === responsiveBox.option('singleColumnScreen');
    }
  },

  getItemsRunTimeInfo() {
    return this._itemsRunTimeInfo;
  },
});

registerComponent('dxLayoutManager', LayoutManager);

export default LayoutManager;
