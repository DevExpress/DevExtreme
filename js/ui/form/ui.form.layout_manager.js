import { getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { default as FormItemsRunTimeInfo } from './ui.form.items_runtime_info';
import registerComponent from '../../core/component_registrator';
import { isDefined, isEmptyObject, isFunction, isObject, type } from '../../core/utils/type';
import variableWrapper from '../../core/utils/variable_wrapper';
import { getCurrentScreenFactor, hasWindow } from '../../core/utils/window';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { normalizeIndexes } from '../../core/utils/array';
import { compileGetter } from '../../core/utils/data';
import { removeEvent } from '../../events/remove';
import messageLocalization from '../../localization/message';
import Widget from '../widget/ui.widget';
import ResponsiveBox from '../responsive_box';
import {
    LAYOUT_MANAGER_ONE_COLUMN,
    FORM_LAYOUT_MANAGER_CLASS,
    SINGLE_COLUMN_ITEM_CONTENT,
    ROOT_SIMPLE_ITEM_CLASS,
    SIMPLE_ITEM_TYPE,
    FIELD_ITEM_CLASS
} from './constants';

import '../text_box';
import '../number_box';
import '../check_box';
import '../date_box';
import '../button';

import { renderFieldItem } from './components/field_item';
import { renderButtonItem } from './components/button_item';
import { renderEmptyItem } from './components/empty_item';
import { convertToRenderFieldItemOptions } from './ui.form.layout_manager.utils';

const FORM_EDITOR_BY_DEFAULT = 'dxTextBox';

const LAYOUT_MANAGER_FIRST_ROW_CLASS = 'dx-first-row';
const LAYOUT_MANAGER_LAST_ROW_CLASS = 'dx-last-row';
const LAYOUT_MANAGER_FIRST_COL_CLASS = 'dx-first-col';
const LAYOUT_MANAGER_LAST_COL_CLASS = 'dx-last-col';

const LayoutManager = Widget.inherit({
    _getDefaultOptions: function() {
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
            requiredMessage: messageLocalization.getFormatter('dxForm-requiredMessage')
        });
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            layoutData: true,
            validationGroup: true
        });
    },

    _init: function() {
        const layoutData = this.option('layoutData');

        this.callBase();
        this._itemWatchers = [];
        this._itemsRunTimeInfo = new FormItemsRunTimeInfo();
        this._updateReferencedOptions(layoutData);
        this._initDataAndItems(layoutData);
    },

    _dispose: function() {
        this.callBase();

        this._cleanItemWatchers();
    },

    _initDataAndItems: function(initialData) {
        this._syncDataWithItems();
        this._updateItems(initialData);
    },

    _syncDataWithItems: function() {
        const layoutData = this.option('layoutData');
        const userItems = this.option('items');

        if(isDefined(userItems)) {
            userItems.forEach(item => {
                if(item.dataField && this._getDataByField(item.dataField) === undefined) {
                    let value;
                    if(item.editorOptions) {
                        value = item.editorOptions.value;
                    }

                    if(isDefined(value) || item.dataField in layoutData) {
                        this._updateFieldValue(item.dataField, value);
                    }
                }
            });
        }
    },

    _getDataByField: function(dataField) {
        return dataField ? this.option('layoutData.' + dataField) : null;
    },

    _isCheckboxUndefinedStateEnabled: function({ allowIndeterminateState, editorType, dataField }) {
        if(allowIndeterminateState === true && editorType === 'dxCheckBox') {
            const nameParts = ['layoutData', ...dataField.split('.')];
            const propertyName = nameParts.pop();
            const layoutData = this.option(nameParts.join('.'));

            return layoutData && (propertyName in layoutData);
        }

        return false;
    },

    _updateFieldValue: function(dataField, value) {
        const layoutData = this.option('layoutData');
        let newValue = value;

        if(!variableWrapper.isWrapped(layoutData[dataField]) && isDefined(dataField)) {
            this.option('layoutData.' + dataField, newValue);
        } else if(variableWrapper.isWritableWrapped(layoutData[dataField])) {
            newValue = isFunction(newValue) ? newValue() : newValue;

            layoutData[dataField](newValue);
        }

        this._triggerOnFieldDataChanged({ dataField: dataField, value: newValue });
    },

    _triggerOnFieldDataChanged: function(args) {
        this._createActionByOption('onFieldDataChanged')(args);
    },

    _updateItems: function(layoutData) {
        const that = this;
        const userItems = this.option('items');
        const isUserItemsExist = isDefined(userItems);
        const customizeItem = that.option('customizeItem');

        const items = isUserItemsExist ? userItems : this._generateItemsByData(layoutData);
        if(isDefined(items)) {
            const processedItems = [];

            each(items, function(index, item) {
                if(that._isAcceptableItem(item)) {
                    item = that._processItem(item);

                    customizeItem && customizeItem(item);

                    if(isObject(item) && variableWrapper.unwrap(item.visible) !== false) {
                        processedItems.push(item);
                    }
                }
            });

            if(!that._itemWatchers.length || !isUserItemsExist) {
                that._updateItemWatchers(items);
            }

            this._setItems(processedItems);
            this._sortItems();
        }
    },

    _cleanItemWatchers: function() {
        this._itemWatchers.forEach(function(dispose) {
            dispose();
        });
        this._itemWatchers = [];
    },

    _updateItemWatchers: function(items) {
        const that = this;
        const watch = that._getWatch();

        items.forEach(function(item) {
            if(isObject(item) && isDefined(item.visible) && isFunction(watch)) {

                that._itemWatchers.push(
                    watch(
                        function() {
                            return variableWrapper.unwrap(item.visible);
                        },
                        function() {
                            that._updateItems(that.option('layoutData'));
                            that.repaint();
                        },
                        { skipImmediate: true }
                    ));
            }
        });
    },

    _generateItemsByData: function(layoutData) {
        const result = [];

        if(isDefined(layoutData)) {
            each(layoutData, function(dataField) {
                result.push({
                    dataField: dataField
                });
            });
        }

        return result;
    },

    _isAcceptableItem: function(item) {
        const itemField = item.dataField || item;
        const itemData = this._getDataByField(itemField);

        return !(isFunction(itemData) && !variableWrapper.isWrapped(itemData));
    },

    _processItem: function(item) {
        if(typeof item === 'string') {
            item = { dataField: item };
        }

        if(typeof item === 'object' && !item.itemType) {
            item.itemType = SIMPLE_ITEM_TYPE;
        }

        if(!isDefined(item.editorType) && isDefined(item.dataField)) {
            const value = this._getDataByField(item.dataField);

            item.editorType = isDefined(value) ? this._getEditorTypeByDataType(type(value)) : FORM_EDITOR_BY_DEFAULT;
        }

        if(item.editorType === 'dxCheckBox') {
            item.allowIndeterminateState = item.allowIndeterminateState ?? true;
        }

        return item;
    },

    _getEditorTypeByDataType: function(dataType) {
        switch(dataType) {
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

    _sortItems: function() {
        normalizeIndexes(this._items, 'visibleIndex');
        this._sortIndexes();
    },

    _sortIndexes: function() {
        this._items.sort(function(itemA, itemB) {
            const indexA = itemA.visibleIndex;
            const indexB = itemB.visibleIndex;
            let result;

            if(indexA > indexB) {
                result = 1;
            } else if(indexA < indexB) {
                result = -1;
            } else {
                result = 0;
            }

            return result;
        });
    },

    _initMarkup: function() {
        this._itemsRunTimeInfo.clear();
        this.$element().addClass(FORM_LAYOUT_MANAGER_CLASS);

        this.callBase();
        this._renderResponsiveBox();
    },

    _renderResponsiveBox: function() {
        const that = this;
        const templatesInfo = [];

        if(that._items && that._items.length) {
            const colCount = that._getColCount();
            const $container = $('<div>').appendTo(that.$element());

            that._prepareItemsWithMerging(colCount);

            const layoutItems = that._generateLayoutItems();
            that._responsiveBox = that._createComponent($container, ResponsiveBox, that._getResponsiveBoxConfig(layoutItems, colCount, templatesInfo));
            if(!hasWindow()) {
                that._renderTemplates(templatesInfo);
            }
        }
    },

    _itemStateChangedHandler: function(e) {
        this._refresh();
    },

    _renderTemplates: function(templatesInfo) {
        const that = this;

        let itemsWithLabelTemplateCount = 0;

        templatesInfo.forEach(({ item }) => {
            if(item?.label?.template) {
                itemsWithLabelTemplateCount++;
            }
        });

        each(templatesInfo, function(index, info) {
            switch(info.itemType) {
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

    _getResponsiveBoxConfig: function(layoutItems, colCount, templatesInfo) {
        const that = this;
        const colCountByScreen = that.option('colCountByScreen');
        const xsColCount = colCountByScreen && colCountByScreen.xs;

        return {
            onItemStateChanged: this._itemStateChangedHandler.bind(this),
            onLayoutChanged: function() {
                const onLayoutChanged = that.option('onLayoutChanged');
                const isSingleColumnMode = that.isSingleColumnMode();

                if(onLayoutChanged) {
                    that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, isSingleColumnMode);
                    onLayoutChanged(isSingleColumnMode);
                }
            },
            onContentReady: function(e) {
                if(hasWindow()) {
                    that._renderTemplates(templatesInfo);
                }
                if(that.option('onLayoutChanged')) {
                    that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, that.isSingleColumnMode(e.component));
                }
            },
            itemTemplate: function(e, itemData, itemElement) {
                if(!e.location) {
                    return;
                }
                const $itemElement = $(itemElement);
                const itemRenderedCountInPreviousRows = e.location.row * colCount;
                const item = that._items[e.location.col + itemRenderedCountInPreviousRows];
                if(!item) {
                    return;
                }

                const itemCssClassList = [item.cssClass];

                $itemElement.toggleClass(SINGLE_COLUMN_ITEM_CONTENT, that.isSingleColumnMode(this));

                if(e.location.row === 0) {
                    itemCssClassList.push(LAYOUT_MANAGER_FIRST_ROW_CLASS);
                }
                if(e.location.col === 0) {
                    itemCssClassList.push(LAYOUT_MANAGER_FIRST_COL_CLASS);
                }

                if(item.itemType === SIMPLE_ITEM_TYPE && that.option('isRoot')) {
                    $itemElement.addClass(ROOT_SIMPLE_ITEM_CLASS);
                }
                const isLastColumn = (e.location.col === colCount - 1) || (e.location.col + e.location.colspan === colCount);
                const rowsCount = that._getRowsCount();
                const isLastRow = e.location.row === rowsCount - 1;
                if(isLastColumn) {
                    itemCssClassList.push(LAYOUT_MANAGER_LAST_COL_CLASS);
                }
                if(isLastRow) {
                    itemCssClassList.push(LAYOUT_MANAGER_LAST_ROW_CLASS);
                }

                if(item.itemType !== 'empty') {
                    itemCssClassList.push(FIELD_ITEM_CLASS);
                    itemCssClassList.push(that.option('cssItemClass'));
                    if(isDefined(item.col)) {
                        itemCssClassList.push('dx-col-' + item.col);
                    }
                }

                templatesInfo.push({
                    itemType: item.itemType,
                    item,
                    $parent: $itemElement,
                    rootElementCssClassList: itemCssClassList
                });
            },
            cols: that._generateRatio(colCount),
            rows: that._generateRatio(that._getRowsCount(), true),
            dataSource: layoutItems,
            screenByWidth: that.option('screenByWidth'),
            singleColumnScreen: xsColCount ? false : 'xs'
        };
    },

    _getColCount: function() {
        let colCount = this.option('colCount');
        const colCountByScreen = this.option('colCountByScreen');

        if(colCountByScreen) {
            let screenFactor = this.option('form').getTargetScreenFactor();
            if(!screenFactor) {
                screenFactor = hasWindow() ? getCurrentScreenFactor(this.option('screenByWidth')) : 'lg';
            }
            colCount = colCountByScreen[screenFactor] || colCount;
        }

        if(colCount === 'auto') {
            if(this._cashedColCount) {
                return this._cashedColCount;
            }

            this._cashedColCount = colCount = this._getMaxColCount();
        }

        return colCount < 1 ? 1 : colCount;
    },

    _getMaxColCount: function() {
        if(!hasWindow()) {
            return 1;
        }

        const minColWidth = this.option('minColWidth');
        const width = getWidth(this.$element());
        const itemsCount = this._items.length;
        const maxColCount = Math.floor(width / minColWidth) || 1;

        return itemsCount < maxColCount ? itemsCount : maxColCount;
    },

    isCachedColCountObsolete: function() {
        return this._cashedColCount && this._getMaxColCount() !== this._cashedColCount;
    },

    _prepareItemsWithMerging: function(colCount) {
        const items = this._items.slice(0);
        let item;
        let itemsMergedByCol;
        let result = [];
        let j;
        let i;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            result.push(item);

            if(this.option('alignItemLabels') || item.alignItemLabels || item.colSpan) {
                item.col = this._getColByIndex(result.length - 1, colCount);
            }
            if(item.colSpan > 1 && (item.col + item.colSpan <= colCount)) {
                itemsMergedByCol = [];
                for(j = 0; j < item.colSpan - 1; j++) {
                    itemsMergedByCol.push({ merged: true });
                }
                result = result.concat(itemsMergedByCol);
            } else {
                delete item.colSpan;
            }
        }
        this._setItems(result);
    },

    _getColByIndex: function(index, colCount) {
        return index % colCount;
    },

    _setItems: function(items) {
        this._items = items;
        this._cashedColCount = null; // T923489
    },

    _generateLayoutItems: function() {
        const items = this._items;
        const colCount = this._getColCount();
        const result = [];
        let item;
        let i;

        for(i = 0; i < items.length; i++) {
            item = items[i];

            if(!item.merged) {
                const generatedItem = {
                    location: {
                        row: parseInt(i / colCount),
                        col: this._getColByIndex(i, colCount)
                    }
                };
                if(isDefined(item.disabled)) {
                    generatedItem.disabled = item.disabled;
                }
                if(isDefined(item.visible)) {
                    generatedItem.visible = item.visible;
                }
                if(isDefined(item.colSpan)) {
                    generatedItem.location.colspan = item.colSpan;
                }
                if(isDefined(item.rowSpan)) {
                    generatedItem.location.rowspan = item.rowSpan;
                }
                result.push(generatedItem);
            }
        }

        return result;
    },

    _renderEmptyItem: function($container) {
        renderEmptyItem({ $container });
    },

    _renderButtonItem: function({ item, $parent, rootElementCssClassList }) {
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
            $itemContainer: $rootElement
        });
    },

    _renderFieldItem: function({ item, $parent, rootElementCssClassList }, itemsWithLabelTemplateCount) {
        const editorValue = this._getDataByField(item.dataField);
        let canAssignUndefinedValueToEditor = false;
        if(editorValue === undefined) {
            const { allowIndeterminateState, editorType, dataField } = item;
            canAssignUndefinedValueToEditor = this._isCheckboxUndefinedStateEnabled({ allowIndeterminateState, editorType, dataField });
        }

        const name = item.dataField || item.name;
        const formOrLayoutManager = this._getFormOrThis();

        const onLabelTemplateRendered = () => {
            this._incTemplateRenderedCallCount();

            if(this._shouldAlignLabelsOnTemplateRendered(formOrLayoutManager, itemsWithLabelTemplateCount)) {
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

        if(widgetInstance && item.dataField) {
            // TODO: move to renderFieldItem ?
            this._bindDataField(widgetInstance, item.dataField, item.editorType, $fieldEditorContainer);
        }
        this._itemsRunTimeInfo.add({
            item,
            widgetInstance,
            guid: item.guid,
            $itemContainer: $rootElement
        });
    },

    _incTemplateRenderedCallCount() {
        this._labelTemplateRenderedCallCount = (this._labelTemplateRenderedCallCount ?? 0) + 1;
    },

    _shouldAlignLabelsOnTemplateRendered(formOrLayoutManager, totalItemsWithLabelTemplate) {
        return formOrLayoutManager.option('templatesRenderAsynchronously') && this._labelTemplateRenderedCallCount === totalItemsWithLabelTemplate;
    },

    _getMarkOptions: function() {
        return {
            showRequiredMark: this.option('showRequiredMark'),
            requiredMark: this.option('requiredMark'),
            showOptionalMark: this.option('showOptionalMark'),
            optionalMark: this.option('optionalMark')
        };
    },

    _getFormOrThis: function() {
        return this.option('form') || this;
    },

    _bindDataField: function(editorInstance, dataField, editorType, $container) {
        const formOrThis = this._getFormOrThis();

        editorInstance.on('enterKey', function(args) {
            formOrThis._createActionByOption('onEditorEnterKey')(extend(args, { dataField: dataField }));
        });

        this._createWatcher(editorInstance, $container, dataField);
        this.linkEditorToDataField(editorInstance, dataField, editorType);
    },

    _createWatcher: function(editorInstance, $container, dataField) {
        function compareArrays(array1, array2) {
            if(!Array.isArray(array1) || !Array.isArray(array2) || (array1.length !== array2.length)) {
                return false;
            }
            for(let i = 0; i < array1.length; i++) {
                if(array1[i] !== array2[i]) {
                    return false;
                }
            }
            return true;
        }

        const that = this;
        const watch = that._getWatch();

        if(!isFunction(watch)) {
            return;
        }

        const dispose = watch(
            function() {
                return that._getDataByField(dataField);
            },
            function() {
                const fieldValue = that._getDataByField(dataField);
                if(editorInstance.NAME === 'dxTagBox') {
                    const editorValue = editorInstance.option('value');
                    if((fieldValue !== editorValue) && compareArrays(fieldValue, editorValue)) {
                        // handle array only, it can be wrapped into Proxy (T1020953)
                        return;
                    }
                }
                editorInstance.option('value', fieldValue);
            },
            {
                deep: true,
                skipImmediate: true
            },
            ///#DEBUG
            { createWatcherDataField: dataField }
            ///#ENDDEBUG
        );

        eventsEngine.on($container, removeEvent, dispose);
    },

    _getWatch: function() {
        if(!isDefined(this._watch)) {
            const formInstance = this.option('form');

            this._watch = formInstance && formInstance.option('integrationOptions.watchMethod');
        }

        return this._watch;
    },

    _createComponent: function($editor, type, editorOptions) {
        const that = this;
        const readOnlyState = this.option('readOnly');
        const instance = that.callBase($editor, type, editorOptions);

        readOnlyState && instance.option('readOnly', readOnlyState);

        that.on('optionChanged', function(args) {
            if(args.name === 'readOnly' && !isDefined(editorOptions.readOnly)) {
                instance.option(args.name, args.value);
            }
        });

        return instance;
    },

    _generateRatio: function(count, isAutoSize) {
        const result = [];
        let ratio;
        let i;

        for(i = 0; i < count; i++) {
            ratio = { ratio: 1 };
            if(isAutoSize) {
                ratio.baseSize = 'auto';
            }
            result.push(ratio);
        }

        return result;
    },

    _getRowsCount: function() {
        return Math.ceil(this._items.length / this._getColCount());
    },

    _updateReferencedOptions: function(newLayoutData) {
        const layoutData = this.option('layoutData');

        if(isObject(layoutData)) {
            Object.getOwnPropertyNames(layoutData)
                .forEach(property => delete this._optionsByReference['layoutData.' + property]);
        }

        if(isObject(newLayoutData)) {
            Object.getOwnPropertyNames(newLayoutData)
                .forEach(property => this._optionsByReference['layoutData.' + property] = true);
        }
    },

    _resetWidget(instance) {
        this._disableEditorValueChangedHandler = true;
        instance.reset();
        this._disableEditorValueChangedHandler = false;
        instance.option('isValid', true);
    },

    _optionChanged(args) {
        if(args.fullName.search('layoutData.') === 0) {
            return;
        }

        switch(args.name) {
            case 'showRequiredMark':
            case 'showOptionalMark':
            case 'requiredMark':
            case 'optionalMark':
                this._cashedRequiredConfig = null;
                this._invalidate();
                break;
            case 'layoutData':
                this._updateReferencedOptions(args.value);

                if(this.option('items')) {
                    if(!isEmptyObject(args.value)) {
                        this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
                            if(isDefined(itemRunTimeInfo.item)) {
                                const dataField = itemRunTimeInfo.item.dataField;

                                if(dataField && isDefined(itemRunTimeInfo.widgetInstance)) {
                                    const valueGetter = compileGetter(dataField);
                                    const dataValue = valueGetter(args.value);

                                    const { allowIndeterminateState, editorType } = itemRunTimeInfo.item;
                                    if(dataValue !== undefined || this._isCheckboxUndefinedStateEnabled(
                                        { allowIndeterminateState, editorType, dataField })) {
                                        itemRunTimeInfo.widgetInstance.option('value', dataValue);
                                    } else {
                                        this._resetWidget(itemRunTimeInfo.widgetInstance);
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
                if(this.option('colCount') === 'auto') {
                    this._resetColCount();
                }
                break;
            case 'readOnly':
                break;
            case 'width':
                this.callBase(args);

                if(this.option('colCount') === 'auto') {
                    this._resetColCount();
                }
                break;
            case 'onFieldDataChanged':
                break;
            default:
                this.callBase(args);
        }
    },

    _resetColCount: function() {
        this._cashedColCount = null;
        this._invalidate();
    },

    linkEditorToDataField(editorInstance, dataField) {
        this.on('optionChanged', args => {
            if(args.fullName === `layoutData.${dataField}`) {
                editorInstance._setOptionWithoutOptionChange('value', args.value);
            }
        });
        editorInstance.on('valueChanged', args => {
            // TODO: This need only for the KO integration
            const isValueReferenceType = isObject(args.value) || Array.isArray(args.value);
            if(!this._disableEditorValueChangedHandler && !(isValueReferenceType && args.value === args.previousValue)) {
                this._updateFieldValue(dataField, args.value);
            }
        });
    },

    _dimensionChanged: function() {
        if(this.option('colCount') === 'auto' && this.isCachedColCountObsolete()) {
            this._eventsStrategy.fireEvent('autoColCountChanged');
        }
    },

    updateData: function(data, value) {
        const that = this;

        if(isObject(data)) {
            each(data, function(dataField, fieldValue) {
                that._updateFieldValue(dataField, fieldValue);
            });
        } else if(typeof data === 'string') {
            that._updateFieldValue(data, value);
        }
    },

    getEditor: function(field) {
        return this._itemsRunTimeInfo.findWidgetInstanceByDataField(field) || this._itemsRunTimeInfo.findWidgetInstanceByName(field);
    },

    isSingleColumnMode: function(component) {
        const responsiveBox = this._responsiveBox || component;
        if(responsiveBox) {
            return responsiveBox.option('currentScreenFactor') === responsiveBox.option('singleColumnScreen');
        }
    },

    getItemsRunTimeInfo: function() {
        return this._itemsRunTimeInfo;
    }
});

registerComponent('dxLayoutManager', LayoutManager);

export default LayoutManager;
