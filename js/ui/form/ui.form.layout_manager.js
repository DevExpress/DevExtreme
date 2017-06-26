"use strict";

var $ = require("../../core/renderer"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    utils = require("../../core/utils/common"),
    isEmptyObject = require("../../core/utils/type").isEmptyObject,
    isWrapped = require("../../core/utils/variable_wrapper").isWrapped,
    isWritableWrapped = require("../../core/utils/variable_wrapper").isWritableWrapped,
    unwrap = require("../../core/utils/variable_wrapper").unwrap,
    windowUtils = require("../../core/utils/window"),
    stringUtils = require("../../core/utils/string"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    dataUtils = require("../../core/utils/data"),
    removeEvent = require("../../core/remove_event"),
    clickEvent = require("../../events/click"),
    normalizeIndexes = require("../../core/utils/array").normalizeIndexes,
    errors = require("../widget/ui.errors"),
    messageLocalization = require("../../localization/message"),
    support = require("../../core/utils/support"),
    inflector = require("../../core/utils/inflector"),
    Widget = require("../widget/ui.widget"),
    Validator = require("../validator"),
    ResponsiveBox = require("../responsive_box");

require("../text_box");
require("../number_box");
require("../check_box");
require("../date_box");

var FORM_EDITOR_BY_DEFAULT = "dxTextBox",
    FIELD_ITEM_CLASS = "dx-field-item",
    FIELD_EMPTY_ITEM_CLASS = "dx-field-empty-item",
    FIELD_ITEM_REQUIRED_CLASS = "dx-field-item-required",
    FIELD_ITEM_OPTIONAL_CLASS = "dx-field-item-optional",
    FIELD_ITEM_REQUIRED_MARK_CLASS = "dx-field-item-required-mark",
    FIELD_ITEM_OPTIONAL_MARK_CLASS = "dx-field-item-optional-mark",
    FIELD_ITEM_LABEL_CLASS = "dx-field-item-label",
    FIELD_ITEM_LABEL_ALIGN_CLASS = "dx-field-item-label-align",
    FIELD_ITEM_LABEL_CONTENT_CLASS = "dx-field-item-label-content",
    FIELD_ITEM_LABEL_TEXT_CLASS = "dx-field-item-label-text",
    FIELD_ITEM_LABEL_LOCATION_CLASS = "dx-field-item-label-location-",
    FIELD_ITEM_CONTENT_CLASS = "dx-field-item-content",
    FIELD_ITEM_CONTENT_LOCATION_CLASS = "dx-field-item-content-location-",
    FIELD_ITEM_CONTENT_WRAPPER_CLASS = "dx-field-item-content-wrapper",
    FIELD_ITEM_HELP_TEXT_CLASS = "dx-field-item-help-text",

    LABEL_HORIZONTAL_ALIGNMENT_CLASS = "dx-label-h-align",
    LABEL_VERTICAL_ALIGNMENT_CLASS = "dx-label-v-align",

    FORM_LAYOUT_MANAGER_CLASS = "dx-layout-manager",
    LAYOUT_MANAGER_FIRST_ROW_CLASS = "dx-first-row",
    LAYOUT_MANAGER_FIRST_COL_CLASS = "dx-first-col",
    LAYOUT_MANAGER_LAST_COL_CLASS = "dx-last-col",
    LAYOUT_MANAGER_ONE_COLUMN = "dx-layout-manager-one-col",

    FLEX_LAYOUT_CLASS = "dx-flex-layout",

    LAYOUT_STRATEGY_FLEX = "flex",
    LAYOUT_STRATEGY_FALLBACK = "fallback",

    SIMPLE_ITEM_TYPE = "simple",

    DATA_OPTIONS = ["dataSource", "items"];

var LayoutManager = Widget.inherit({
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
        this.callBase();
        this._itemWatchers = [];
        this._initDataAndItems(this.option("layoutData"));
    },

    _initDataAndItems: function(initialData) {
        this._syncDataWithItems();
        this._updateItems(initialData);
    },

    _syncDataWithItems: function() {
        var that = this,
            userItems = that.option("items");

        if(utils.isDefined(userItems)) {
            $.each(userItems, function(index, item) {
                var value;
                if(item.dataField && that._getDataByField(item.dataField) === undefined) {
                    if(item.editorOptions) {
                        value = item.editorOptions.value;
                    }

                    that._updateFieldValue(item.dataField, value);
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

        if(!isWrapped(layoutData[dataField]) && utils.isDefined(dataField)) {
            this.option("layoutData." + dataField, newValue);
        } else if(isWritableWrapped(layoutData[dataField])) {
            newValue = utils.isFunction(newValue) ? newValue() : newValue;

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
            isUserItemsExist = utils.isDefined(userItems),
            customizeItem = that.option("customizeItem"),
            items,
            processedItems;

        items = isUserItemsExist ? userItems : this._generateItemsByData(layoutData);
        if(utils.isDefined(items)) {
            processedItems = [];

            $.each(items, function(index, item) {
                if(that._isAcceptableItem(item)) {
                    item = that._processItem(item);

                    customizeItem && customizeItem(item);

                    if(utils.isObject(item) && unwrap(item.visible) !== false) {
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
            if(utils.isObject(item) && utils.isDefined(item.visible) && utils.isFunction(watch)) {
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

        if(utils.isDefined(layoutData)) {
            $.each(layoutData, function(dataField) {
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

        return !(utils.isFunction(itemData) && !isWrapped(itemData));
    },

    _processItem: function(item) {
        if(typeof item === "string") {
            item = { dataField: item };
        }

        if(typeof item === "object" && !item.itemType) {
            item.itemType = SIMPLE_ITEM_TYPE;
        }

        if(!utils.isDefined(item.editorType) && utils.isDefined(item.dataField)) {
            var value = this._getDataByField(item.dataField);

            item.editorType = utils.isDefined(value) ? this._getEditorTypeByDataType(utils.type(value)) : FORM_EDITOR_BY_DEFAULT;
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

    _render: function() {
        this._clearEditorInstances();
        this.element().addClass(FORM_LAYOUT_MANAGER_CLASS);

        this.callBase();
    },

    _clearEditorInstances: function() {
        this._editorInstancesByField = {};
    },

    _hasBrowserFlex: function() {
        return support.styleProp(LAYOUT_STRATEGY_FLEX) === LAYOUT_STRATEGY_FLEX;
    },

    _renderContentImpl: function() {
        this.callBase();
        this._renderResponsiveBox();
    },

    _renderResponsiveBox: function() {
        var that = this;

        if(that._items && that._items.length) {
            var colCount = that._getColCount(),
                $container = $("<div />").appendTo(that.element()),
                layoutItems;

            that._prepareItemsWithMerging(colCount);

            layoutItems = that._generateLayoutItems();
            that._extendItemsWithDefaultTemplateOptions(layoutItems, that._items);

            that._responsiveBox = that._createComponent($container, ResponsiveBox, that._getResponsiveBoxConfig(layoutItems, colCount));
        }
    },

    _extendItemsWithDefaultTemplateOptions: function(targetItems, sourceItems) {
        sourceItems.forEach(function(item) {
            if(!item.merged) {
                if(utils.isDefined(item.disabled)) {
                    targetItems[item.visibleIndex].disabled = item.disabled;
                }
                if(utils.isDefined(item.visible)) {
                    targetItems[item.visibleIndex].visible = item.visible;
                }
            }
        });
    },

    _itemStateChangedHandler: function(e) {
        this._refresh();
    },

    _getResponsiveBoxConfig: function(layoutItems, colCount) {
        var that = this,
            colCountByScreen = that.option("colCountByScreen"),
            xsColCount = colCountByScreen && colCountByScreen.xs;

        return {
            onItemStateChanged: this._itemStateChangedHandler.bind(this),
            _layoutStrategy: that._hasBrowserFlex() ? LAYOUT_STRATEGY_FLEX : LAYOUT_STRATEGY_FALLBACK,
            onLayoutChanged: function() {
                var onLayoutChanged = that.option("onLayoutChanged"),
                    isLayoutChanged = that.isLayoutChanged();

                if(onLayoutChanged) {
                    that.element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, isLayoutChanged);
                    onLayoutChanged(isLayoutChanged);
                }
            },
            onContentReady: function(e) {
                if(that.option("onLayoutChanged")) {
                    that.element().toggleClass(LAYOUT_MANAGER_ONE_COLUMN, that.isLayoutChanged(e.component));
                }
                that._fireContentReadyAction();
            },
            itemTemplate: function(e, itemData, $itemElement) {
                if(!e.location) {
                    return;
                }
                var itemRenderedCountInPreviousRows = e.location.row * colCount,
                    item = that._items[e.location.col + itemRenderedCountInPreviousRows],
                    $fieldItem = $("<div/>")
                        .addClass(item.cssClass)
                        .appendTo($itemElement);

                if(e.location.row === 0) {
                    $fieldItem.addClass(LAYOUT_MANAGER_FIRST_ROW_CLASS);
                }
                if(e.location.col === 0) {
                    $fieldItem.addClass(LAYOUT_MANAGER_FIRST_COL_CLASS);
                }
                if((e.location.col === colCount - 1) || (e.location.col + e.location.colspan === colCount)) {
                    $fieldItem.addClass(LAYOUT_MANAGER_LAST_COL_CLASS);
                }

                item.itemType === "empty" ? that._renderEmptyItem($fieldItem) : that._renderFieldItem(item, $fieldItem);
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
            var currentColCount = colCountByScreen[windowUtils.getCurrentScreenFactor(this.option("screenByWidth"))];
            colCount = currentColCount || colCount;
        }

        if(colCount === "auto") {
            if(!!this._cashedColCount) {
                return this._cashedColCount;
            }

            this._cashedColCount = colCount = this._getMaxColCount();
        }

        return colCount < 1 ? 1 : colCount;
    },

    _getMaxColCount: function() {
        var minColWidth = this.option("minColWidth"),
            width = this.element().width(),
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
                if(utils.isDefined(item.colSpan)) {
                    generatedItem.location.colspan = item.colSpan;
                }
                if(utils.isDefined(item.rowSpan)) {
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

    _renderFieldItem: function(item, $container) {
        var that = this,
            name = that._getName(item),
            id = that.getItemID(name),
            isRequired = utils.isDefined(item.isRequired) ? item.isRequired : !!that._hasRequiredRuleInSet(item.validationRules),
            labelOptions = that._getLabelOptions(item, id, isRequired),
            $editor = $("<div/>"),
            helpID = item.helpText ? ("dx-" + new Guid()) : null,
            $label;

        $container
            .addClass(FIELD_ITEM_CLASS)
            .addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS)
            .addClass(that.option("cssItemClass"))
            .addClass(utils.isDefined(item.col) ? "dx-col-" + item.col : "");

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

        that._renderEditor({
            $container: $editor,
            dataField: name,
            editorType: item.editorType,
            editorOptions: item.editorOptions,
            template: that._getTemplateByFieldItem(item),
            isRequired: isRequired,
            helpID: helpID,
            id: id,
            validationBoundary: that.option("validationBoundary")
        });

        var $validationTarget = $editor.children().first();

        if($validationTarget && $validationTarget.data("dx-validation-target")) {
            that._renderValidator($validationTarget, item);
        }

        that._renderHelpText(item, $editor, helpID);

        that._attachClickHandler($label, $editor, item.editorType);
    },

    _hasRequiredRuleInSet: function(rules) {
        var hasRequiredRule;

        if(rules && rules.length) {
            $.each(rules, function(index, rule) {
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
        var largeEditors = ["dxTextArea", "dxRadioGroup", "dxCalendar"];

        return (!!item.helpText && !this._hasBrowserFlex()) || inArray(item.editorType, largeEditors) !== -1;
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

        if(!labelOptions.text && item.dataField) {
            labelOptions.text = inflector.captionize(item.dataField);
        }

        if(labelOptions.text) {
            labelOptions.text += labelOptions.showColon ? ":" : "";
        }

        return labelOptions;
    },

    _renderLabel: function(options) {
        if(utils.isDefined(options.text) && options.text.length > 0) {
            var labelClasses = FIELD_ITEM_LABEL_CLASS + " " + FIELD_ITEM_LABEL_LOCATION_CLASS + options.location,
                $label = $("<label />")
                    .addClass(labelClasses)
                    .attr("for", options.id),
                $labelContent = $("<span/>")
                    .addClass(FIELD_ITEM_LABEL_CONTENT_CLASS)
                    .appendTo($label);

            $("<span />")
                .addClass(FIELD_ITEM_LABEL_TEXT_CLASS)
                .text(options.text)
                .appendTo($labelContent);

            if(options.alignment) {
                $label.css("text-align", options.alignment);
            }

            $labelContent.append(this._renderLabelMark(options.isRequired));

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

            $mark = $("<span />")
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
            defaultEditorOptions = { value: dataValue },
            isDeepExtend = true,
            editorOptions;

        if(options.editorType === "dxTagBox") {
            defaultEditorOptions.value = defaultEditorOptions.value || [];
        }

        editorOptions = extend(isDeepExtend, defaultEditorOptions, options.editorOptions, {
            inputAttr: {
                id: options.id
            },
            validationBoundary: options.validationBoundary
        });

        this._replaceDataOptions(options.editorOptions, editorOptions);

        this._createEditor(options.$container, {
            editorType: options.editorType,
            dataField: options.dataField,
            template: options.template,
            name: options.name,
            helpID: options.helpID,
            isRequired: options.isRequired
        },
            editorOptions);
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

        if(Array.isArray(validationRules)) {
            this._createComponent($editor, Validator, {
                validationRules: validationRules,
                validationGroup: this.option("validationGroup")
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
                component: that.option("form") || that
            };

            template.render({
                model: data,
                container: $container
            });
        } else {
            var $editor = $("<div/>").appendTo($container);

            try {
                editorInstance = that._createComponent($editor, renderOptions.editorType, editorOptions);
                editorInstance.setAria("describedby", renderOptions.helpID);
                editorInstance.setAria("required", renderOptions.isRequired);

                if(renderOptions.dataField) {
                    var componentOwner = that.option("form") || that;

                    editorInstance.on("enterKey", function(args) {
                        componentOwner._createActionByOption("onEditorEnterKey")(extend(args, { dataField: renderOptions.dataField }));
                    });
                    that._registerEditorInstance(editorInstance, renderOptions.dataField);
                    that._createWatcher(editorInstance, $container, renderOptions);
                    that.linkEditorToDataField(editorInstance, renderOptions.dataField, renderOptions.editorType);
                }
            } catch(e) {
                errors.log("E1035", e.message);
            }
        }
    },

    _createWatcher: function(editorInstance, $container, renderOptions) {
        var that = this,
            watch = that._getWatch();

        if(!utils.isFunction(watch)) {
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

        $container.on(removeEvent, dispose);
    },

    _getWatch: function() {
        if(!utils.isDefined(this._watch)) {
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

    _registerEditorInstance: function(instance, dataField) {
        this._editorInstancesByField[dataField] = instance;
    },

    _createComponent: function($editor, type, editorOptions) {
        var that = this,
            readOnlyState = this.option("readOnly"),
            instance;

        instance = that.callBase($editor, type, editorOptions);

        readOnlyState && instance.option("readOnly", readOnlyState);

        that.on("optionChanged", function(args) {
            if(args.name === "readOnly") {
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
            $label.on(clickEvent.name, function() {
                $editor.children().trigger(clickEvent.name);
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

    _optionChanged: function(args) {
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
                if(this.option("items")) {
                    if(!isEmptyObject(args.value)) {
                        $.each(this._editorInstancesByField, function(name, editor) {
                            var valueGetter = dataUtils.compileGetter(name),
                                dataValue = valueGetter(args.value);

                            if(utils.isDefined(dataValue)) {
                                editor.option("value", dataValue);
                            } else {
                                editor.reset();
                                editor.option("isValid", true);
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

    linkEditorToDataField: function(editorInstance, dataField, editorType) {
        var fullFieldName = "layoutData." + dataField,
            that = this,
            isDataUpdating;

        that.on("optionChanged", function(args) {
            if(args.fullName === fullFieldName) {
                isDataUpdating = true;
                if(typeof args.value === "object") {
                    that._managedUpdateEditorOption(editorInstance, "value", args.value);
                } else {
                    editorInstance.option("value", args.value);
                }
                isDataUpdating = false;
            }
        });

        editorInstance.on("valueChanged", function(args) {
            var isObjectValue = typeof args.value === "object",
                isSameObjectValue = isObjectValue && args.value === args.previousValue;

            if(!isDataUpdating && !isSameObjectValue) {
                if(isObjectValue) {
                    that._managedUpdateFieldValue(dataField, args.value);
                } else {
                    that._updateFieldValue(dataField, args.value);
                }
            }
        });
    },

    _managedUpdateEditorOption: function(editorInstance, optionName, value) {
        if(!this._isValueChangedCalled) {
            this._isFieldValueChanged = true;
            editorInstance.option(optionName, value);
            this._isFieldValueChanged = false;
        }
    },

    _managedUpdateFieldValue: function(dataField, value) {
        this._isValueChangedCalled = true;

        if(!this._isFieldValueChanged) {
            this._updateFieldValue(dataField, value);
        }

        this._isValueChangedCalled = false;
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

        if(utils.isObject(data)) {
            $.each(data, function(dataField, fieldValue) {
                that._updateFieldValue(dataField, fieldValue);
            });
        } else if(typeof data === "string") {
            that._updateFieldValue(data, value);
        }
    },

    getEditor: function(field) {
        return this._editorInstancesByField[field];
    },

    isLayoutChanged: function(component) {
        var responsiveBox = this._responsiveBox || component;
        if(responsiveBox) {
            return responsiveBox.option("currentScreenFactor") === responsiveBox.option("singleColumnScreen");
        }
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
