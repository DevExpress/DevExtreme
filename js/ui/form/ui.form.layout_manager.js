import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import Guid from "../../core/guid";
import { default as FormItemsRunTimeInfo } from "./ui.form.items_runtime_info";
import registerComponent from "../../core/component_registrator";
import { isDefined, isEmptyObject, isFunction, isObject, type } from "../../core/utils/type";
import domUtils from "../../core/utils/dom";
import { isWrapped, isWritableWrapped, unwrap } from "../../core/utils/variable_wrapper";
import windowUtils from "../../core/utils/window";
import stringUtils from "../../core/utils/string";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import { inArray, normalizeIndexes } from "../../core/utils/array";
import dataUtils from "../../core/utils/data";
import removeEvent from "../../core/remove_event";
import clickEvent from "../../events/click";
import errors from "../widget/ui.errors";
import messageLocalization from "../../localization/message";
import styleUtils from "../../core/utils/style";
import inflector from "../../core/utils/inflector";
import Widget from "../widget/ui.widget";
import Validator from "../validator";
import ResponsiveBox from "../responsive_box";
import themes from "../themes";

import "../text_box";
import "../number_box";
import "../check_box";
import "../date_box";
import "../button";

const FORM_EDITOR_BY_DEFAULT = "dxTextBox";
const FIELD_ITEM_CLASS = "dx-field-item";
const FIELD_EMPTY_ITEM_CLASS = "dx-field-empty-item";
const FIELD_BUTTON_ITEM_CLASS = "dx-field-button-item";
const FIELD_ITEM_REQUIRED_CLASS = "dx-field-item-required";
const FIELD_ITEM_OPTIONAL_CLASS = "dx-field-item-optional";
const FIELD_ITEM_REQUIRED_MARK_CLASS = "dx-field-item-required-mark";
const FIELD_ITEM_OPTIONAL_MARK_CLASS = "dx-field-item-optional-mark";
const FIELD_ITEM_LABEL_CLASS = "dx-field-item-label";
const FIELD_ITEM_LABEL_ALIGN_CLASS = "dx-field-item-label-align";
const FIELD_ITEM_LABEL_CONTENT_CLASS = "dx-field-item-label-content";
const FIELD_ITEM_LABEL_TEXT_CLASS = "dx-field-item-label-text";
const FIELD_ITEM_LABEL_LOCATION_CLASS = "dx-field-item-label-location-";
const FIELD_ITEM_CONTENT_CLASS = "dx-field-item-content";
const FIELD_ITEM_CONTENT_LOCATION_CLASS = "dx-field-item-content-location-";
const FIELD_ITEM_CONTENT_WRAPPER_CLASS = "dx-field-item-content-wrapper";
const FIELD_ITEM_HELP_TEXT_CLASS = "dx-field-item-help-text";
const SINGLE_COLUMN_ITEM_CONTENT = "dx-single-column-item-content";

const LABEL_HORIZONTAL_ALIGNMENT_CLASS = "dx-label-h-align";
const LABEL_VERTICAL_ALIGNMENT_CLASS = "dx-label-v-align";

const FORM_LAYOUT_MANAGER_CLASS = "dx-layout-manager";
const LAYOUT_MANAGER_FIRST_ROW_CLASS = "dx-first-row";
const LAYOUT_MANAGER_FIRST_COL_CLASS = "dx-first-col";
const LAYOUT_MANAGER_LAST_COL_CLASS = "dx-last-col";
const LAYOUT_MANAGER_ONE_COLUMN = "dx-layout-manager-one-col";

const FLEX_LAYOUT_CLASS = "dx-flex-layout";

const INVALID_CLASS = "dx-invalid";

const LAYOUT_STRATEGY_FLEX = "flex";
const LAYOUT_STRATEGY_FALLBACK = "fallback";

const SIMPLE_ITEM_TYPE = "simple";

const TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";

const DATA_OPTIONS = ["dataSource", "items"];
const EDITORS_WITH_ARRAY_VALUE = ["dxTagBox", "dxRangeSlider"];

const LayoutManager = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            layoutData: {},
            readOnly: false,
            colCount: 1,
            colCountByScreen: undefined,
            labelLocation: "left",
            onFieldDataChanged: null,
            onEditorEnterKey: null,
            customizeItem: null,
            alignItemLabels: true,
            minColWidth: 200,
            showRequiredMark: true,
            screenByWidth: null,
            showOptionalMark: false,
            requiredMark: "*",
            optionalMark: messageLocalization.format("dxForm-optionalMark"),
            requiredMessage: messageLocalization.getFormatter("dxForm-requiredMessage")
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
        var layoutData = this.option("layoutData");

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
        const layoutData = this.option("layoutData");
        const userItems = this.option("items");

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
        return dataField ? this.option("layoutData." + dataField) : null;
    },

    _updateFieldValue: function(dataField, value) {
        var layoutData = this.option("layoutData"),
            newValue = value;

        if(!isWrapped(layoutData[dataField]) && isDefined(dataField)) {
            this.option("layoutData." + dataField, newValue);
        } else if(isWritableWrapped(layoutData[dataField])) {
            newValue = isFunction(newValue) ? newValue() : newValue;

            layoutData[dataField](newValue);
        }

        this._triggerOnFieldDataChanged({ dataField: dataField, value: newValue });
    },

    _triggerOnFieldDataChanged: function(args) {
        this._createActionByOption("onFieldDataChanged")(args);
    },

    _updateItems: function(layoutData) {
        var that = this,
            userItems = this.option("items"),
            isUserItemsExist = isDefined(userItems),
            customizeItem = that.option("customizeItem"),
            items,
            processedItems;

        items = isUserItemsExist ? userItems : this._generateItemsByData(layoutData);
        if(isDefined(items)) {
            processedItems = [];

            each(items, function(index, item) {
                if(that._isAcceptableItem(item)) {
                    item = that._processItem(item);

                    customizeItem && customizeItem(item);

                    if(isObject(item) && unwrap(item.visible) !== false) {
                        processedItems.push(item);
                    }
                }
            });

            if(!that._itemWatchers.length || !isUserItemsExist) {
                that._updateItemWatchers(items);
            }

            this._items = processedItems;

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
        var that = this,
            watch = that._getWatch();

        items.forEach(function(item) {
            if(isObject(item) && isDefined(item.visible) && isFunction(watch)) {

                that._itemWatchers.push(
                    watch(
                        function() {
                            return unwrap(item.visible);
                        },
                        function() {
                            that._updateItems(that.option("layoutData"));
                            that.repaint();
                        },
                        { skipImmediate: true }
                    ));
            }
        });
    },

    _generateItemsByData: function(layoutData) {
        var result = [];

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
        var itemField = item.dataField || item,
            itemData = this._getDataByField(itemField);

        return !(isFunction(itemData) && !isWrapped(itemData));
    },

    _processItem: function(item) {
        if(typeof item === "string") {
            item = { dataField: item };
        }

        if(typeof item === "object" && !item.itemType) {
            item.itemType = SIMPLE_ITEM_TYPE;
        }

        if(!isDefined(item.editorType) && isDefined(item.dataField)) {
            var value = this._getDataByField(item.dataField);

            item.editorType = isDefined(value) ? this._getEditorTypeByDataType(type(value)) : FORM_EDITOR_BY_DEFAULT;
        }

        return item;
    },

    _getEditorTypeByDataType: function(dataType) {
        switch(dataType) {
            case "number":
                return "dxNumberBox";
            case "date":
                return "dxDateBox";
            case "boolean":
                return "dxCheckBox";
            default:
                return "dxTextBox";
        }
    },

    _sortItems: function() {
        normalizeIndexes(this._items, "visibleIndex");
        this._sortIndexes();
    },

    _sortIndexes: function() {
        this._items.sort(function(itemA, itemB) {
            var indexA = itemA.visibleIndex,
                indexB = itemB.visibleIndex,
                result;

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
        return styleUtils.styleProp(LAYOUT_STRATEGY_FLEX) === LAYOUT_STRATEGY_FLEX;
    },

    _renderResponsiveBox: function() {
        var that = this,
            templatesInfo = [];

        if(that._items && that._items.length) {
            var colCount = that._getColCount(),
                $container = $("<div>").appendTo(that.$element()),
                layoutItems;

            that._prepareItemsWithMerging(colCount);

            layoutItems = that._generateLayoutItems();
            that._extendItemsWithDefaultTemplateOptions(layoutItems, that._items);

            that._responsiveBox = that._createComponent($container, ResponsiveBox, that._getResponsiveBoxConfig(layoutItems, colCount, templatesInfo));
            if(!windowUtils.hasWindow()) {
                that._renderTemplates(templatesInfo);
            }
        }
    },

    _extendItemsWithDefaultTemplateOptions: function(targetItems, sourceItems) {
        sourceItems.forEach(function(item) {
            if(!item.merged) {
                if(isDefined(item.disabled)) {
                    targetItems[item.visibleIndex].disabled = item.disabled;
                }
                if(isDefined(item.visible)) {
                    targetItems[item.visibleIndex].visible = item.visible;
                }
            }
        });
    },

    _itemStateChangedHandler: function(e) {
        this._refresh();
    },

    _renderTemplate: function($container, item) {
        switch(item.itemType) {
            case "empty":
                this._renderEmptyItem($container);
                break;
            case "button":
                this._renderButtonItem(item, $container);
                break;
            default:
                this._renderFieldItem(item, $container);
        }
    },

    _renderTemplates: function(templatesInfo) {
        var that = this;
        each(templatesInfo, function(index, info) {
            that._renderTemplate(info.container, info.formItem);
        });
    },

    _getResponsiveBoxConfig: function(layoutItems, colCount, templatesInfo) {
        var that = this,
            colCountByScreen = that.option("colCountByScreen"),
            xsColCount = colCountByScreen && colCountByScreen.xs;

        return {
            onItemStateChanged: this._itemStateChangedHandler.bind(this),
            _layoutStrategy: that._hasBrowserFlex() ? LAYOUT_STRATEGY_FLEX : LAYOUT_STRATEGY_FALLBACK,
            onLayoutChanged: function() {
                var onLayoutChanged = that.option("onLayoutChanged"),
                    isSingleColumnMode = that.isSingleColumnMode();

                if(onLayoutChanged) {
                    that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, isSingleColumnMode);
                    onLayoutChanged(isSingleColumnMode);
                }
            },
            onContentReady: function(e) {
                if(windowUtils.hasWindow()) {
                    that._renderTemplates(templatesInfo);
                }
                if(that.option("onLayoutChanged")) {
                    that.$element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, that.isSingleColumnMode(e.component));
                }
            },
            itemTemplate: function(e, itemData, itemElement) {
                if(!e.location) {
                    return;
                }
                var $itemElement = $(itemElement),
                    itemRenderedCountInPreviousRows = e.location.row * colCount,
                    item = that._items[e.location.col + itemRenderedCountInPreviousRows],
                    $fieldItem = $("<div>")
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
                if((e.location.col === colCount - 1) || (e.location.col + e.location.colspan === colCount)) {
                    $fieldItem.addClass(LAYOUT_MANAGER_LAST_COL_CLASS);
                }
            },
            cols: that._generateRatio(colCount),
            rows: that._generateRatio(that._getRowsCount(), true),
            dataSource: layoutItems,
            screenByWidth: that.option("screenByWidth"),
            singleColumnScreen: xsColCount ? false : "xs"
        };
    },

    _getColCount: function() {
        var colCount = this.option("colCount"),
            colCountByScreen = this.option("colCountByScreen");

        if(colCountByScreen) {
            var screenFactor = this.option("form").getTargetScreenFactor();
            if(!screenFactor) {
                screenFactor = windowUtils.hasWindow() ? windowUtils.getCurrentScreenFactor(this.option("screenByWidth")) : "lg";
            }
            colCount = colCountByScreen[screenFactor] || colCount;
        }

        if(colCount === "auto") {
            if(this._cashedColCount) {
                return this._cashedColCount;
            }

            this._cashedColCount = colCount = this._getMaxColCount();
        }

        return colCount < 1 ? 1 : colCount;
    },

    _getMaxColCount: function() {
        if(!windowUtils.hasWindow()) {
            return 1;
        }

        var minColWidth = this.option("minColWidth"),
            width = this.$element().width(),
            itemsCount = this._items.length,
            maxColCount = Math.floor(width / minColWidth) || 1;

        return itemsCount < maxColCount ? itemsCount : maxColCount;
    },

    isCachedColCountObsolete: function() {
        return this._cashedColCount && this._getMaxColCount() !== this._cashedColCount;
    },

    _prepareItemsWithMerging: function(colCount) {
        var items = this._items.slice(0),
            item,
            itemsMergedByCol,
            result = [],
            j,
            i;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            result.push(item);

            if(this.option("alignItemLabels") || item.alignItemLabels || item.colSpan) {
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
        this._items = result;
    },

    _getColByIndex: function(index, colCount) {
        return index % colCount;
    },

    _generateLayoutItems: function() {
        var items = this._items,
            colCount = this._getColCount(),
            result = [],
            item,
            i;

        for(i = 0; i < items.length; i++) {
            item = items[i];

            if(!item.merged) {
                var generatedItem = {
                    location: {
                        row: parseInt(i / colCount),
                        col: this._getColByIndex(i, colCount)
                    }
                };
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
            .html("&nbsp;");
    },

    _getButtonHorizontalAlignment: function(item) {
        if(isDefined(item.horizontalAlignment)) {
            return item.horizontalAlignment;
        }

        if(isDefined(item.alignment)) {
            errors.log("W0001", "dxForm", "alignment", "18.1", "Use the 'horizontalAlignment' option in button items instead.");
            return item.alignment;
        }

        return "right";
    },

    _getButtonVerticalAlignment: function(item) {
        switch(item.verticalAlignment) {
            case "center":
                return "center";
            case "bottom":
                return "flex-end";
            default:
                return "flex-start";
        }
    },

    _renderButtonItem: function(item, $container) {
        var $button = $("<div>").appendTo($container),
            defaultOptions = {
                validationGroup: this.option("validationGroup")
            };

        $container
            .addClass(FIELD_BUTTON_ITEM_CLASS)
            .css("textAlign", this._getButtonHorizontalAlignment(item));

        $container.parent().css("justifyContent", this._getButtonVerticalAlignment(item));

        var instance = this._createComponent($button, "dxButton", extend(defaultOptions, item.buttonOptions));

        this._itemsRunTimeInfo.add({
            item,
            widgetInstance: instance,
            guid: item.guid,
            $itemContainer: $container
        });
        this._addItemClasses($container, item.col);

        return $button;
    },

    _addItemClasses: function($item, column) {
        $item
            .addClass(FIELD_ITEM_CLASS)
            .addClass(this.option("cssItemClass"))
            .addClass(isDefined(column) ? "dx-col-" + column : "");
    },

    _renderFieldItem: function(item, $container) {
        var that = this,
            name = that._getName(item),
            id = that.getItemID(name),
            isRequired = isDefined(item.isRequired) ? item.isRequired : !!that._hasRequiredRuleInSet(item.validationRules),
            labelOptions = that._getLabelOptions(item, id, isRequired),
            $editor = $("<div>"),
            helpID = item.helpText ? ("dx-" + new Guid()) : null,
            $label;

        this._addItemClasses($container, item.col);
        $container.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);

        if(labelOptions.visible && labelOptions.text) {
            $label = that._renderLabel(labelOptions).appendTo($container);
        }

        if(item.itemType === SIMPLE_ITEM_TYPE) {
            if(that._isLabelNeedBaselineAlign(item) && labelOptions.location !== "top") {
                $container.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
            }
            that._hasBrowserFlex() && $container.addClass(FLEX_LAYOUT_CLASS);
        }

        $editor.data("dx-form-item", item);
        that._appendEditorToField({
            $fieldItem: $container,
            $label: $label,
            $editor: $editor,
            labelOptions: labelOptions
        });

        var instance = that._renderEditor({
            $container: $editor,
            dataField: item.dataField,
            name: item.name,
            editorType: item.editorType,
            editorOptions: item.editorOptions,
            template: that._getTemplateByFieldItem(item),
            isRequired: isRequired,
            helpID: helpID,
            labelID: labelOptions.labelID,
            id: id,
            validationBoundary: that.option("validationBoundary")
        });

        this._itemsRunTimeInfo.add({
            item,
            widgetInstance: instance,
            guid: item.guid,
            $itemContainer: $container
        });

        const editorElem = $editor.children().first();
        const $validationTarget = editorElem.hasClass(TEMPLATE_WRAPPER_CLASS) ? editorElem.children().first() : editorElem;

        if($validationTarget && $validationTarget.data("dx-validation-target")) {
            that._renderValidator($validationTarget, item);
        }

        that._renderHelpText(item, $editor, helpID);

        that._attachClickHandler($label, $editor, item.editorType);
    },

    _hasRequiredRuleInSet: function(rules) {
        var hasRequiredRule;

        if(rules && rules.length) {
            each(rules, function(index, rule) {
                if(rule.type === "required") {
                    hasRequiredRule = true;
                    return false;
                }
            });
        }

        return hasRequiredRule;
    },

    _getName: function(item) {
        return item.dataField || item.name;
    },

    _isLabelNeedBaselineAlign: function(item) {
        const largeEditors = ["dxTextArea", "dxRadioGroup", "dxCalendar", "dxHtmlEditor"];
        return (!!item.helpText && !this._hasBrowserFlex()) || inArray(item.editorType, largeEditors) !== -1;
    },

    _isLabelNeedId: function(item) {
        const editorsRequiringIdForLabel = ["dxRadioGroup", "dxCheckBox", "dxLookup", "dxSlider", "dxRangeSlider", "dxSwitch", "dxHtmlEditor"]; // TODO: support "dxCalendar"
        return inArray(item.editorType, editorsRequiringIdForLabel) !== -1;
    },

    _getLabelOptions: function(item, id, isRequired) {
        var labelOptions = extend(
            {
                showColon: this.option("showColonAfterLabel"),
                location: this.option("labelLocation"),
                id: id,
                visible: true,
                isRequired: isRequired
            },
            item ? item.label : {}
        );

        if(this._isLabelNeedId(item)) {
            labelOptions.labelID = `dx-label-${new Guid()}`;
        }

        if(!labelOptions.text && item.dataField) {
            labelOptions.text = inflector.captionize(item.dataField);
        }

        if(labelOptions.text) {
            labelOptions.text += labelOptions.showColon ? ":" : "";
        }

        return labelOptions;
    },

    _renderLabel: function(options) {
        const { text, id, location, alignment, isRequired, labelID = null } = options;

        if(isDefined(text) && text.length > 0) {
            const labelClasses = FIELD_ITEM_LABEL_CLASS + " " + FIELD_ITEM_LABEL_LOCATION_CLASS + location;
            const $label = $("<label>")
                .addClass(labelClasses)
                .attr("for", id)
                .attr("id", labelID);

            const $labelContent = $("<span>")
                .addClass(FIELD_ITEM_LABEL_CONTENT_CLASS)
                .appendTo($label);

            $("<span>")
                .addClass(FIELD_ITEM_LABEL_TEXT_CLASS)
                .text(text)
                .appendTo($labelContent);

            if(alignment) {
                $label.css("textAlign", alignment);
            }

            $labelContent.append(this._renderLabelMark(isRequired));

            return $label;
        }
    },

    _renderLabelMark: function(isRequired) {
        var $mark,
            requiredMarksConfig = this._getRequiredMarksConfig(),
            isRequiredMark = requiredMarksConfig.showRequiredMark && isRequired,
            isOptionalMark = requiredMarksConfig.showOptionalMark && !isRequired;

        if(isRequiredMark || isOptionalMark) {
            var markClass = isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS,
                markText = isRequiredMark ? requiredMarksConfig.requiredMark : requiredMarksConfig.optionalMark;

            $mark = $("<span>")
                .addClass(markClass)
                .html("&nbsp" + markText);
        }

        return $mark;
    },

    _getRequiredMarksConfig: function() {
        if(!this._cashedRequiredConfig) {
            this._cashedRequiredConfig = {
                showRequiredMark: this.option("showRequiredMark"),
                showOptionalMark: this.option("showOptionalMark"),
                requiredMark: this.option("requiredMark"),
                optionalMark: this.option("optionalMark")
            };
        }

        return this._cashedRequiredConfig;
    },

    _renderEditor: function(options) {
        var dataValue = this._getDataByField(options.dataField),
            defaultEditorOptions = dataValue !== undefined ? { value: dataValue } : {},
            isDeepExtend = true,
            editorOptions;

        if(EDITORS_WITH_ARRAY_VALUE.indexOf(options.editorType) !== -1) {
            defaultEditorOptions.value = defaultEditorOptions.value || [];
        }

        var formInstance = this.option("form");

        editorOptions = extend(isDeepExtend, defaultEditorOptions, options.editorOptions, {
            inputAttr: {
                id: options.id
            },
            validationBoundary: options.validationBoundary,
            stylingMode: formInstance && formInstance.option("stylingMode")
        });

        this._replaceDataOptions(options.editorOptions, editorOptions);

        let renderOptions = {
            editorType: options.editorType,
            dataField: options.dataField,
            template: options.template,
            name: options.name,
            helpID: options.helpID,
            labelID: options.labelID,
            isRequired: options.isRequired
        };

        return this._createEditor(options.$container, renderOptions, editorOptions);
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

    _renderValidator: function($editor, item) {
        var fieldName = this._getFieldLabelName(item),
            validationRules = this._prepareValidationRules(item.validationRules, item.isRequired, item.itemType, fieldName);

        if(Array.isArray(validationRules) && validationRules.length) {
            this._createComponent($editor, Validator, {
                validationRules: validationRules,
                validationGroup: this.option("validationGroup"),
                dataGetter: function() {
                    return {
                        formItem: item
                    };
                }
            });
        }
    },

    _getFieldLabelName: function(item) {
        var isItemHaveCustomLabel = item.label && item.label.text,
            itemName = isItemHaveCustomLabel ? null : this._getName(item);

        return isItemHaveCustomLabel ? item.label.text : itemName && inflector.captionize(itemName);
    },

    _prepareValidationRules: function(userValidationRules, isItemRequired, itemType, itemName) {
        var isSimpleItem = itemType === SIMPLE_ITEM_TYPE,
            validationRules;

        if(isSimpleItem) {
            if(userValidationRules) {
                validationRules = userValidationRules;
            } else {
                var requiredMessage = stringUtils.format(this.option("requiredMessage"), itemName || "");

                validationRules = isItemRequired ? [{ type: "required", message: requiredMessage }] : null;
            }
        }

        return validationRules;
    },

    _addWrapperInvalidClass: function(editorInstance) {
        var wrapperClass = "." + FIELD_ITEM_CONTENT_WRAPPER_CLASS,
            toggleInvalidClass = function(e) {
                $(e.element).parents(wrapperClass)
                    .toggleClass(INVALID_CLASS, e.component._isFocused() && e.component.option("isValid") === false);
            };

        editorInstance
            .on("focusIn", toggleInvalidClass)
            .on("focusOut", toggleInvalidClass)
            .on("enterKey", toggleInvalidClass);
    },

    _createEditor: function($container, renderOptions, editorOptions) {
        var that = this,
            template = renderOptions.template,
            editorInstance;

        if(renderOptions.dataField && !editorOptions.name) {
            editorOptions.name = renderOptions.dataField;
        }

        that._addItemContentClasses($container);

        if(template) {
            var data = {
                dataField: renderOptions.dataField,
                editorType: renderOptions.editorType,
                editorOptions: editorOptions,
                component: that._getComponentOwner(),
                name: renderOptions.name
            };

            template.render({
                model: data,
                container: domUtils.getPublicElement($container)
            });
        } else {
            var $editor = $("<div>").appendTo($container);

            try {
                editorInstance = that._createComponent($editor, renderOptions.editorType, editorOptions);
                editorInstance.setAria("describedby", renderOptions.helpID);
                editorInstance.setAria("labelledby", renderOptions.labelID);
                editorInstance.setAria("required", renderOptions.isRequired);

                if(themes.isMaterial()) {
                    that._addWrapperInvalidClass(editorInstance);
                }

                if(renderOptions.dataField) {
                    that._bindDataField(editorInstance, renderOptions, $container);
                }
            } catch(e) {
                errors.log("E1035", e.message);
            }
        }

        return editorInstance;
    },

    _getComponentOwner: function() {
        return this.option("form") || this;
    },

    _bindDataField: function(editorInstance, renderOptions, $container) {
        var componentOwner = this._getComponentOwner();

        editorInstance.on("enterKey", function(args) {
            componentOwner._createActionByOption("onEditorEnterKey")(extend(args, { dataField: renderOptions.dataField }));
        });

        this._createWatcher(editorInstance, $container, renderOptions);
        this.linkEditorToDataField(editorInstance, renderOptions.dataField, renderOptions.editorType);
    },

    _createWatcher: function(editorInstance, $container, renderOptions) {
        var that = this,
            watch = that._getWatch();

        if(!isFunction(watch)) {
            return;
        }

        var dispose = watch(
            function() {
                return that._getDataByField(renderOptions.dataField);
            },
            function() {
                editorInstance.option("value", that._getDataByField(renderOptions.dataField));
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
            var formInstance = this.option("form");

            this._watch = formInstance && formInstance.option("integrationOptions.watchMethod");
        }

        return this._watch;
    },

    _addItemContentClasses: function($itemContent) {
        var locationSpecificClass = this._getItemContentLocationSpecificClass();
        $itemContent.addClass([FIELD_ITEM_CONTENT_CLASS, locationSpecificClass].join(" "));
    },

    _getItemContentLocationSpecificClass: function() {
        var labelLocation = this.option("labelLocation"),
            oppositeClasses = {
                right: "left",
                left: "right",
                top: "bottom"
            };

        return FIELD_ITEM_CONTENT_LOCATION_CLASS + oppositeClasses[labelLocation];
    },

    _createComponent: function($editor, type, editorOptions) {
        var that = this,
            readOnlyState = this.option("readOnly"),
            instance;

        instance = that.callBase($editor, type, editorOptions);

        readOnlyState && instance.option("readOnly", readOnlyState);

        that.on("optionChanged", function(args) {
            if(args.name === "readOnly" && !isDefined(editorOptions.readOnly)) {
                instance.option(args.name, args.value);
            }
        });

        return instance;
    },

    _getTemplateByFieldItem: function(fieldItem) {
        return fieldItem.template ? this._getTemplate(fieldItem.template) : null;
    },

    _appendEditorToField: function(params) {
        if(params.$label) {
            var location = params.labelOptions.location;

            if(location === "top" || location === "left") {
                params.$fieldItem.append(params.$editor);
            }

            if(location === "right") {
                params.$fieldItem.prepend(params.$editor);
            }

            this._addInnerItemAlignmentClass(params.$fieldItem, location);
        } else {
            params.$fieldItem.append(params.$editor);
        }
    },

    _addInnerItemAlignmentClass: function($fieldItem, location) {
        if(location === "top") {
            $fieldItem.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
        } else {
            $fieldItem.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
        }
    },

    _renderHelpText: function(fieldItem, $editor, helpID) {
        var helpText = fieldItem.helpText,
            isSimpleItem = fieldItem.itemType === SIMPLE_ITEM_TYPE;

        if(helpText && isSimpleItem) {
            var $editorWrapper = $("<div>").addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS);

            $editor.wrap($editorWrapper);

            $("<div>")
                .addClass(FIELD_ITEM_HELP_TEXT_CLASS)
                .attr("id", helpID)
                .text(helpText)
                .appendTo($editor.parent());
        }
    },

    _attachClickHandler: function($label, $editor, editorType) {
        var isBooleanEditors = editorType === "dxCheckBox" || editorType === "dxSwitch";

        if($label && isBooleanEditors) {
            eventsEngine.on($label, clickEvent.name, function() {
                eventsEngine.trigger($editor.children(), clickEvent.name);
            });
        }
    },

    _generateRatio: function(count, isAutoSize) {
        var result = [],
            ratio,
            i;

        for(i = 0; i < count; i++) {
            ratio = { ratio: 1 };
            if(isAutoSize) {
                ratio.baseSize = "auto";
            }
            result.push(ratio);
        }

        return result;
    },

    _getRowsCount: function() {
        return Math.ceil(this._items.length / this._getColCount());
    },

    _updateReferencedOptions: function(newLayoutData) {
        var layoutData = this.option("layoutData");

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
        const defaultOptions = instance._getDefaultOptions();
        instance._setOptionSilent("value", defaultOptions.value);
        instance.option("isValid", true);
    },

    _optionChanged(args) {
        if(args.fullName.search("layoutData.") === 0) {
            return;
        }

        switch(args.name) {
            case "showRequiredMark":
            case "showOptionalMark":
            case "requiredMark":
            case "optionalMark":
                this._cashedRequiredConfig = null;
                this._invalidate();
                break;
            case "layoutData":
                this._updateReferencedOptions(args.value);

                if(this.option("items")) {
                    if(!isEmptyObject(args.value)) {
                        this._itemsRunTimeInfo.each((_, itemRunTimeInfo) => {
                            if(isDefined(itemRunTimeInfo.item)) {
                                const dataField = itemRunTimeInfo.item.dataField;

                                if(dataField && isDefined(itemRunTimeInfo.widgetInstance)) {
                                    const valueGetter = dataUtils.compileGetter(dataField);
                                    const dataValue = valueGetter(args.value);

                                    if(dataValue === undefined) {
                                        this._resetWidget(itemRunTimeInfo.widgetInstance);
                                    } else {
                                        itemRunTimeInfo.widgetInstance.option("value", dataValue);
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
            case "items":
                this._cleanItemWatchers();
                this._initDataAndItems(args.value);
                this._invalidate();
                break;
            case "alignItemLabels":
            case "labelLocation":
            case "requiredMessage":
                this._invalidate();
                break;
            case "customizeItem":
                this._updateItems(this.option("layoutData"));
                this._invalidate();
                break;
            case "colCount":
                this._resetColCount();
                break;
            case "minColWidth":
                if(this.option("colCount") === "auto") {
                    this._resetColCount();
                }
                break;
            case "readOnly":
                break;
            case "width":
                this.callBase(args);

                if(this.option("colCount") === "auto") {
                    this._resetColCount();
                }
                break;
            case "onFieldDataChanged":
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
        this.on("optionChanged", args => {
            if(args.fullName === `layoutData.${dataField}`) {
                editorInstance._setOptionSilent("value", args.value);
            }
        });
        editorInstance.on("valueChanged", args => {
            if(!(isObject(args.value) && args.value === args.previousValue)) {
                this._updateFieldValue(dataField, args.value);
            }
        });
    },

    _dimensionChanged: function() {
        if(this.option("colCount") === "auto" && this.isCachedColCountObsolete()) {
            this.fireEvent("autoColCountChanged");
        }
    },

    getItemID: function(name) {
        var formInstance = this.option("form");
        return formInstance && formInstance.getItemID(name);
    },

    updateData: function(data, value) {
        var that = this;

        if(isObject(data)) {
            each(data, function(dataField, fieldValue) {
                that._updateFieldValue(dataField, fieldValue);
            });
        } else if(typeof data === "string") {
            that._updateFieldValue(data, value);
        }
    },

    getEditor: function(field) {
        return this._itemsRunTimeInfo.findWidgetInstanceByDataField(field) || this._itemsRunTimeInfo.findWidgetInstanceByName(field);
    },

    isSingleColumnMode: function(component) {
        var responsiveBox = this._responsiveBox || component;
        if(responsiveBox) {
            return responsiveBox.option("currentScreenFactor") === responsiveBox.option("singleColumnScreen");
        }
    },

    getItemsRunTimeInfo: function() {
        return this._itemsRunTimeInfo;
    }
});

registerComponent("dxLayoutManager", LayoutManager);

module.exports = LayoutManager;

//#DEBUG
module.exports.__internals = {
    FIELD_ITEM_CLASS: FIELD_ITEM_CLASS,
    FIELD_EMPTY_ITEM_CLASS: FIELD_EMPTY_ITEM_CLASS,
    FIELD_ITEM_CONTENT_CLASS: FIELD_ITEM_CONTENT_CLASS,
    FIELD_ITEM_CONTENT_LOCATION_CLASS: FIELD_ITEM_CONTENT_LOCATION_CLASS,
    FIELD_ITEM_LABEL_CLASS: FIELD_ITEM_LABEL_CLASS,
    FIELD_ITEM_LABEL_ALIGN_CLASS: FIELD_ITEM_LABEL_ALIGN_CLASS,
    FIELD_ITEM_LABEL_LOCATION_CLASS: FIELD_ITEM_LABEL_LOCATION_CLASS,
    LABEL_HORIZONTAL_ALIGNMENT_CLASS: LABEL_HORIZONTAL_ALIGNMENT_CLASS,
    LABEL_VERTICAL_ALIGNMENT_CLASS: LABEL_VERTICAL_ALIGNMENT_CLASS,
    FORM_LAYOUT_MANAGER_CLASS: FORM_LAYOUT_MANAGER_CLASS,
    FIELD_ITEM_CONTENT_WRAPPER_CLASS: FIELD_ITEM_CONTENT_WRAPPER_CLASS,
    FIELD_ITEM_HELP_TEXT_CLASS: FIELD_ITEM_HELP_TEXT_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS: FIELD_ITEM_LABEL_CONTENT_CLASS,
    FIELD_ITEM_LABEL_TEXT_CLASS: FIELD_ITEM_LABEL_TEXT_CLASS,
    FIELD_ITEM_REQUIRED_CLASS: FIELD_ITEM_REQUIRED_CLASS,
    FIELD_ITEM_OPTIONAL_CLASS: FIELD_ITEM_OPTIONAL_CLASS,
    FIELD_ITEM_REQUIRED_MARK_CLASS: FIELD_ITEM_REQUIRED_MARK_CLASS,
    FIELD_ITEM_OPTIONAL_MARK_CLASS: FIELD_ITEM_OPTIONAL_MARK_CLASS,
    LAYOUT_MANAGER_ONE_COLUMN: LAYOUT_MANAGER_ONE_COLUMN,
    FLEX_LAYOUT_CLASS: FLEX_LAYOUT_CLASS
};
//#ENDDEBUG
