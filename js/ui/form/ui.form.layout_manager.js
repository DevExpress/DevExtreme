import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import { default as FormItemsRunTimeInfo } from './ui.form.items_runtime_info';
import registerComponent from '../../core/component_registrator';
import { isDefined, isEmptyObject, isFunction, isObject, type } from '../../core/utils/type';
import { getPublicElement } from '../../core/element';
import variableWrapper from '../../core/utils/variable_wrapper';
import { getCurrentScreenFactor, hasWindow } from '../../core/utils/window';
import { format } from '../../core/utils/string';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { inArray, normalizeIndexes } from '../../core/utils/array';
import { compileGetter } from '../../core/utils/data';
import { removeEvent } from '../../core/remove_event';
import { name as clickEventName } from '../../events/click';
import messageLocalization from '../../localization/message';
import { styleProp } from '../../core/utils/style';
import { captionize } from '../../core/utils/inflector';
import Widget from '../widget/ui.widget';
import Validator from '../validator';
import ResponsiveBox from '../responsive_box';
import { isMaterial } from '../themes';
import {
    FIELD_ITEM_CLASS,
    FLEX_LAYOUT_CLASS,
    LAYOUT_MANAGER_ONE_COLUMN,
    FIELD_ITEM_OPTIONAL_CLASS,
    FIELD_ITEM_REQUIRED_CLASS,
    FIELD_ITEM_CONTENT_WRAPPER_CLASS,
    FORM_LAYOUT_MANAGER_CLASS,
    LABEL_VERTICAL_ALIGNMENT_CLASS,
    LABEL_HORIZONTAL_ALIGNMENT_CLASS,
    FIELD_ITEM_LABEL_ALIGN_CLASS,
    FIELD_EMPTY_ITEM_CLASS,
    SINGLE_COLUMN_ITEM_CONTENT,
    ROOT_SIMPLE_ITEM_CLASS } from './constants';

import '../text_box';
import '../number_box';
import '../check_box';
import '../date_box';
import '../button';
import {
    renderLabel,
    getLabelWidthByText,
    renderHelpText,
    adjustContainerAsButtonItem,
    convertAlignmentToJustifyContent,
    convertAlignmentToTextAlign,
    renderComponentTo,
    renderTemplateTo,
    adjustEditorContainer } from './ui.form.utils';

const FORM_EDITOR_BY_DEFAULT = 'dxTextBox';

const LAYOUT_MANAGER_FIRST_ROW_CLASS = 'dx-first-row';
const LAYOUT_MANAGER_LAST_ROW_CLASS = 'dx-last-row';
const LAYOUT_MANAGER_FIRST_COL_CLASS = 'dx-first-col';
const LAYOUT_MANAGER_LAST_COL_CLASS = 'dx-last-col';

const INVALID_CLASS = 'dx-invalid';

const LAYOUT_STRATEGY_FLEX = 'flex';
const LAYOUT_STRATEGY_FALLBACK = 'fallback';

const SIMPLE_ITEM_TYPE = 'simple';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const DATA_OPTIONS = ['dataSource', 'items'];
const EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider'];

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

    _hasBrowserFlex: function() {
        return styleProp(LAYOUT_STRATEGY_FLEX) === LAYOUT_STRATEGY_FLEX;
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

    _renderTemplate: function($container, item) {
        switch(item.itemType) {
            case 'empty':
                this._renderEmptyItem($container);
                break;
            case 'button':
                this._renderButtonItem(item, $container);
                break;
            default:
                this._renderFieldItem(item, $container);
        }
    },

    _renderTemplates: function(templatesInfo) {
        const that = this;
        each(templatesInfo, function(index, info) {
            that._renderTemplate(info.container, info.formItem);
        });
    },

    _getResponsiveBoxConfig: function(layoutItems, colCount, templatesInfo) {
        const that = this;
        const colCountByScreen = that.option('colCountByScreen');
        const xsColCount = colCountByScreen && colCountByScreen.xs;

        return {
            onItemStateChanged: this._itemStateChangedHandler.bind(this),
            _layoutStrategy: that._hasBrowserFlex() ? LAYOUT_STRATEGY_FLEX : LAYOUT_STRATEGY_FALLBACK,
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
                const $fieldItem = $('<div>')
                    .addClass(item.cssClass)
                    .appendTo($itemElement);

                templatesInfo.push({
                    container: $fieldItem,
                    formItem: item
                });

                $itemElement.toggleClass(SINGLE_COLUMN_ITEM_CONTENT, that.isSingleColumnMode(this));

                if(e.location.row === 0) {
                    $fieldItem.addClass(LAYOUT_MANAGER_FIRST_ROW_CLASS);
                }
                if(e.location.col === 0) {
                    $fieldItem.addClass(LAYOUT_MANAGER_FIRST_COL_CLASS);
                }

                if(item.itemType === SIMPLE_ITEM_TYPE && that.option('isRoot')) {
                    $itemElement.addClass(ROOT_SIMPLE_ITEM_CLASS);
                }
                const isLastColumn = (e.location.col === colCount - 1) || (e.location.col + e.location.colspan === colCount);
                const rowsCount = that._getRowsCount();
                const isLastRow = e.location.row === rowsCount - 1;
                if(isLastColumn) {
                    $fieldItem.addClass(LAYOUT_MANAGER_LAST_COL_CLASS);
                }
                if(isLastRow) {
                    $fieldItem.addClass(LAYOUT_MANAGER_LAST_ROW_CLASS);
                }
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
        const width = this.$element().width();
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
        return $container
            .addClass(FIELD_EMPTY_ITEM_CLASS)
            .html('&nbsp;');
    },

    _renderButtonItem: function(item, $container) {
        // TODO: try to create $container in this function and return it
        adjustContainerAsButtonItem({
            $container,
            justifyContent: convertAlignmentToJustifyContent(item.verticalAlignment),
            textAlign: convertAlignmentToTextAlign(item.horizontalAlignment),
            cssItemClass: this.option('cssItemClass'),
            targetColIndex: item.col
        });

        const $button = $('<div>');
        $container.append($button);
        const buttonWidget = this._createComponent(
            $button, 'dxButton',
            extend({ validationGroup: this.option('validationGroup') }, item.buttonOptions));

        // TODO: try to remove '_itemsRunTimeInfo' from 'render' function
        this._itemsRunTimeInfo.add({
            item,
            widgetInstance: buttonWidget, // TODO: try to remove 'widgetInstance'
            guid: item.guid,
            $itemContainer: $container
        });
    },

    _addItemClasses: function($item, column) {
        $item
            .addClass(FIELD_ITEM_CLASS)
            .addClass(this.option('cssItemClass'))
            .addClass(isDefined(column) ? 'dx-col-' + column : '');
    },

    _renderFieldItem: function(item, $container) {
        const that = this;
        const name = item.dataField || item.name;
        const id = that.getItemID(name);
        const isRequired = isDefined(item.isRequired) ? item.isRequired : !!that._hasRequiredRuleInSet(item.validationRules);
        const labelOptions = that._getLabelOptions(item, id, isRequired);
        const helpID = item.helpText ? ('dx-' + new Guid()) : null;
        const helpText = item.helpText;
        const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;

        const editorOptions = this._convertToEditorOptions({
            dataField: item.dataField,
            editorType: item.editorType,
            allowIndeterminateState: item.allowIndeterminateState,
            editorOptions: item.editorOptions,
            id,
            validationBoundary: that.option('validationBoundary')
        });
        const template = that._getTemplateByFieldItem(item);

        const $editor = $('<div>');
        this._addItemClasses($container, item.col);
        $container.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);

        const $label = (labelOptions.visible && labelOptions.text) ? renderLabel(labelOptions) : null;
        if($label) {
            $container.append($label);
        }

        if(item.itemType === SIMPLE_ITEM_TYPE) {
            if(that._isLabelNeedBaselineAlign(item) && labelOptions.location !== 'top') {
                $container.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
            }
            if(that._hasBrowserFlex()) {
                $container.addClass(FLEX_LAYOUT_CLASS);
            }
        }

        $editor.data('dx-form-item', item);
        if($label) {
            const location = labelOptions.location;

            if(location === 'top' || location === 'left') {
                $container.append($editor);
            }
            if(location === 'right') {
                $container.prepend($editor);
            }

            if(location === 'top') {
                $container.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
            } else {
                $container.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
            }
        } else {
            $container.append($editor);
        }

        adjustEditorContainer({
            $container: $editor,
            labelLocation: this.option('labelLocation'),
        });

        let instance;
        if(template) {
            renderTemplateTo({
                $container: getPublicElement($editor),
                template,
                templateOptions: {
                    dataField: item.dataField,
                    editorType: item.editorType,
                    editorOptions,
                    component: this._getComponentOwner(),
                    name: item.name
                }
            });
        } else {
            instance = renderComponentTo({
                $container: $editor,
                createComponentCallback: this._createComponent.bind(this),
                componentType: item.editorType,
                componentOptions: editorOptions,
                helpID,
                labelID: labelOptions.labelID,
                isRequired
            });

        }

        if(instance && item.dataField) {
            this._bindDataField(instance, item.dataField, item.editorType, $editor);
        }

        this._itemsRunTimeInfo.add({
            item,
            widgetInstance: instance,
            guid: item.guid,
            $itemContainer: $container
        });

        const editorElem = $editor.children().first();
        const $validationTarget = editorElem.hasClass(TEMPLATE_WRAPPER_CLASS) ? editorElem.children().first() : editorElem;
        const validationTargetInstance = $validationTarget && $validationTarget.data('dx-validation-target');

        if(validationTargetInstance) {
            const isItemHaveCustomLabel = item.label && item.label.text;
            const itemName = isItemHaveCustomLabel ? null : name;
            const fieldName = isItemHaveCustomLabel ? item.label.text : itemName && captionize(itemName);
            let validationRules;
            const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;

            if(isSimpleItem) {
                if(item.validationRules) {
                    validationRules = item.validationRules;
                } else {
                    const requiredMessage = format(this.option('requiredMessage'), fieldName || '');
                    validationRules = item.isRequired ? [{ type: 'required', message: requiredMessage }] : null;
                }
            }

            if(Array.isArray(validationRules) && validationRules.length) {
                this._createComponent($validationTarget, Validator, {
                    validationRules: validationRules,
                    validationGroup: this.option('validationGroup'),
                    dataGetter: function() {
                        return {
                            formItem: item
                        };
                    }
                });
            }

            if(isMaterial()) {
                const wrapperClass = '.' + FIELD_ITEM_CONTENT_WRAPPER_CLASS;
                const toggleInvalidClass = function(e) {
                    $(e.element).parents(wrapperClass)
                        .toggleClass(INVALID_CLASS, e.component._isFocused() && e.component.option('isValid') === false);
                };

                validationTargetInstance
                    .on('focusIn', toggleInvalidClass)
                    .on('focusOut', toggleInvalidClass)
                    .on('enterKey', toggleInvalidClass);
            }
        }

        if(helpText && isSimpleItem) {
            const $editorParent = $editor.parent();

            // TODO: DOM hierarchy is changed here: new node is added between $editor and $editor.parent()
            $editorParent.append(
                $('<div>')
                    .addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS)
                    .append($editor)
                    .append(renderHelpText(helpText, helpID))
            );
        }

        const isBooleanEditors = item.editorType === 'dxCheckBox' || item.editorType === 'dxSwitch';

        if($label && isBooleanEditors) {
            eventsEngine.on($label, clickEventName, function() {
                eventsEngine.trigger($editor.children(), clickEventName);
            });
        }
    },

    _hasRequiredRuleInSet: function(rules) {
        let hasRequiredRule;

        if(rules && rules.length) {
            each(rules, function(index, rule) {
                if(rule.type === 'required') {
                    hasRequiredRule = true;
                    return false;
                }
            });
        }

        return hasRequiredRule;
    },

    _isLabelNeedBaselineAlign: function(item) {
        const largeEditors = ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor'];
        return (!!item.helpText && !this._hasBrowserFlex()) || inArray(item.editorType, largeEditors) !== -1;
    },

    _isLabelNeedId: function(item) {
        const editorsRequiringIdForLabel = ['dxRadioGroup', 'dxCheckBox', 'dxLookup', 'dxSlider', 'dxRangeSlider', 'dxSwitch', 'dxHtmlEditor']; // TODO: support "dxCalendar"
        return inArray(item.editorType, editorsRequiringIdForLabel) !== -1;
    },

    _getLabelOptions: function(item, id, isRequired) {
        const labelOptions = extend(
            {
                showColon: this.option('showColonAfterLabel'),
                location: this.option('labelLocation'),
                id: id,
                visible: true,
                isRequired: isRequired
            },
            item ? item.label : {},
            { markOptions: this._getLabelMarkOptions(isRequired) }
        );

        if(this._isLabelNeedId(item)) {
            labelOptions.labelID = `dx-label-${new Guid()}`;
        }

        if(!labelOptions.text && item.dataField) {
            labelOptions.text = captionize(item.dataField);
        }

        if(labelOptions.text) {
            labelOptions.text += labelOptions.showColon ? ':' : '';
        }

        return labelOptions;
    },

    // TODO: used in tests only
    _renderLabel: function(labelOptions) {
        return renderLabel({
            ...labelOptions,
            ...{ markOptions: this._getLabelMarkOptions(labelOptions.isRequired) }
        });
    },

    _getLabelWidthByText: function({ text, location }) {
        return getLabelWidthByText({
            text, location, markOptions: this._getLabelMarkOptions()
        });
    },

    _getLabelMarkOptions: function(isRequired) {
        return {
            isRequiredMark: this.option('showRequiredMark') && isRequired,
            requiredMark: this.option('requiredMark'),
            isOptionalMark: this.option('showOptionalMark') && !isRequired,
            optionalMark: this.option('optionalMark')
        };
    },

    _convertToEditorOptions: function({ dataField, editorType, allowIndeterminateState, editorOptions, id, validationBoundary }) {
        const dataValue = this._getDataByField(dataField);
        const defaultEditorOptions =
            dataValue !== undefined
            || this._isCheckboxUndefinedStateEnabled({
                allowIndeterminateState, editorType, dataField })
                ? { value: dataValue }
                : {};

        if(EDITORS_WITH_ARRAY_VALUE.indexOf(editorType) !== -1) {
            defaultEditorOptions.value = defaultEditorOptions.value || [];
        }

        const formInstance = this.option('form');

        const result = extend(true, defaultEditorOptions,
            editorOptions,
            {
                inputAttr: { id: id },
                validationBoundary: validationBoundary,
                stylingMode: formInstance && formInstance.option('stylingMode')
            },
        );

        if(editorOptions) {
            if(result.dataSource) {
                result.dataSource = editorOptions.dataSource;
            }
            if(result.items) {
                result.items = editorOptions.items;
            }
        }

        if(dataField && !result.name) {
            result.name = dataField;
        }
        return result;
    },

    _replaceDataOptions: function(originalOptions, resultOptions) {
        if(originalOptions) {
            DATA_OPTIONS.forEach(function(item) {
                if(resultOptions[item]) {
                    resultOptions[item] = originalOptions[item];
                }
            });
        }
    },

    _prepareValidationRules: function(userValidationRules, isItemRequired, itemType, itemName) {
        const isSimpleItem = itemType === SIMPLE_ITEM_TYPE;
        let validationRules;

        if(isSimpleItem) {
            if(userValidationRules) {
                validationRules = userValidationRules;
            } else {
                const requiredMessage = format(this.option('requiredMessage'), itemName || '');

                validationRules = isItemRequired ? [{ type: 'required', message: requiredMessage }] : null;
            }
        }

        return validationRules;
    },

    _getComponentOwner: function() {
        return this.option('form') || this;
    },

    _bindDataField: function(editorInstance, dataField, editorType, $container) {
        const componentOwner = this._getComponentOwner();

        editorInstance.on('enterKey', function(args) {
            componentOwner._createActionByOption('onEditorEnterKey')(extend(args, { dataField: dataField }));
        });

        this._createWatcher(editorInstance, $container, dataField);
        this.linkEditorToDataField(editorInstance, dataField, editorType);
    },

    _createWatcher: function(editorInstance, $container, dataField) {
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
                editorInstance.option('value', that._getDataByField(dataField));
            },
            {
                deep: true,
                skipImmediate: true
            }
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

    _getTemplateByFieldItem: function(fieldItem) {
        return fieldItem.template ? this._getTemplate(fieldItem.template) : null;
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

                                    if(dataValue !== undefined || this._isCheckboxUndefinedStateEnabled(
                                        { allowIndeterminateState: itemRunTimeInfo.item.allowIndeterminateState, editorType: itemRunTimeInfo.item.editorType, dataField: itemRunTimeInfo.item.dataField })) {
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
            case 'requiredMessage':
                this._invalidate();
                break;
            case 'customizeItem':
                this._updateItems(this.option('layoutData'));
                this._invalidate();
                break;
            case 'colCount':
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

    getItemID: function(name) {
        const formInstance = this.option('form');
        return formInstance && formInstance.getItemID(name);
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
