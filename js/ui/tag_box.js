"use strict";

var $ = require("../core/renderer"),
    devices = require("../core/devices"),
    dataUtils = require("../core/element_data"),
    eventsEngine = require("../events/core/events_engine"),
    registerComponent = require("../core/component_registrator"),
    browser = require("../core/utils/browser"),
    commonUtils = require("../core/utils/common"),
    noop = commonUtils.noop,
    FilterCreator = require("../core/utils/selection_filter").SelectionFilterCreator,
    deferredUtils = require("../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    getPublicElement = require("../core/utils/dom").getPublicElement,
    typeUtils = require("../core/utils/type"),
    isDefined = typeUtils.isDefined,
    windowUtils = require("../core/utils/window"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    each = require("../core/utils/iterator").each,
    messageLocalization = require("../localization/message"),
    eventUtils = require("../events/utils"),
    clickEvent = require("../events/click"),
    SelectBox = require("./select_box"),
    caret = require("./text_box/utils.caret"),
    BindableTemplate = require("./widget/bindable_template");

var TAGBOX_TAG_DATA_KEY = "dxTagData";

var TAGBOX_CLASS = "dx-tagbox",
    TAGBOX_TAG_CONTAINER_CLASS = "dx-tag-container",
    TAGBOX_TAG_CLASS = "dx-tag",
    TAGBOX_MULTI_TAG_CLASS = "dx-tagbox-multi-tag",
    TAGBOX_CUSTOM_TAG_CLASS = "dx-tag-custom",
    TAGBOX_TAG_REMOVE_BUTTON_CLASS = "dx-tag-remove-button",
    TAGBOX_ONLY_SELECT_CLASS = "dx-tagbox-only-select",
    TAGBOX_SINGLE_LINE_CLASS = "dx-tagbox-single-line",
    TAGBOX_POPUP_WRAPPER_CLASS = "dx-tagbox-popup-wrapper",
    LIST_SELECT_ALL_CHECKBOX_CLASS = "dx-list-select-all-checkbox",
    TAGBOX_TAG_CONTENT_CLASS = "dx-tag-content",
    TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = "dx-tagbox-default-template",
    TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = "dx-tagbox-custom-template",
    NATIVE_CLICK_CLASS = "dx-native-click",

    TEXTEDITOR_CONTAINER_CLASS = "dx-texteditor-container";

var TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;

/**
* @name dxTagBox
* @isEditor
* @inherits dxSelectBox
* @module ui/tag_box
* @export default
*/
var TagBox = SelectBox.inherit({

    _supportedKeys: function() {
        var parent = this.callBase();
        return extend(parent, {
            backspace: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                this._isTagRemoved = true;

                var $tagToDelete = this._$focusedTag || this._tagElements().last();

                if(this._$focusedTag) {
                    this._moveTagFocus("prev", true);
                }

                if($tagToDelete.length === 0) {
                    return;
                }

                this._preserveFocusedTag = true;
                this._removeTagElement($tagToDelete);
                delete this._preserveFocusedTag;
            },
            del: function(e) {
                if(!this._$focusedTag || !this._isCaretAtTheStart()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                this._isTagRemoved = true;

                var $tagToDelete = this._$focusedTag;

                this._moveTagFocus("next", true);

                this._preserveFocusedTag = true;
                this._removeTagElement($tagToDelete);
                delete this._preserveFocusedTag;
            },
            enter: function(e) {
                var isListItemFocused = this._list && this._list.option("focusedElement") !== null,
                    isCustomItem = this.option("acceptCustomValue") && !isListItemFocused;

                if(isCustomItem) {
                    e.preventDefault();
                    (this._searchValue() !== "") && this._customItemAddedHandler();
                    return;
                }

                if(!this.option("opened")) {
                    return;
                }

                e.preventDefault();
                this._keyboardProcessor._childProcessors[0].process(e);
            },
            leftArrow: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                var rtlEnabled = this.option("rtlEnabled");

                if(this._isEditable() && rtlEnabled && !this._$focusedTag) {
                    return;
                }

                e.preventDefault();

                var direction = rtlEnabled ? "next" : "prev";
                this._moveTagFocus(direction);
                !this.option("multiline") && this._scrollContainer(direction);
            },
            rightArrow: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                var rtlEnabled = this.option("rtlEnabled");

                if(this._isEditable() && !rtlEnabled && !this._$focusedTag) {
                    return;
                }

                e.preventDefault();

                var direction = rtlEnabled ? "prev" : "next";
                this._moveTagFocus(direction);
                !this.option("multiline") && this._scrollContainer(direction);
            }
        });
    },

    _isCaretAtTheStart: function() {
        var position = caret(this._input());
        return position.start === 0 && position.end === 0;
    },

    _moveTagFocus: function(direction, clearOnBoundary) {
        if(!this._$focusedTag) {
            var tagElements = this._tagElements();
            this._$focusedTag = direction === "next" ? tagElements.first() : tagElements.last();
            this._toggleFocusClass(true, this._$focusedTag);
            return;
        }

        var $nextFocusedTag = this._$focusedTag[direction]("." + TAGBOX_TAG_CLASS);

        if($nextFocusedTag.length > 0) {
            this._replaceFocusedTag($nextFocusedTag);
        } else if(clearOnBoundary || (direction === "next" && this._isEditable())) {
            this._clearTagFocus();
        }
    },

    _replaceFocusedTag: function($nextFocusedTag) {
        this._toggleFocusClass(false, this._$focusedTag);
        this._$focusedTag = $nextFocusedTag;
        this._toggleFocusClass(true, this._$focusedTag);
    },

    _clearTagFocus: function() {
        if(!this._$focusedTag) {
            return;
        }

        this._toggleFocusClass(false, this._$focusedTag);
        delete this._$focusedTag;
    },

    _focusClassTarget: function($element) {
        if($element && $element.length && $element[0] !== this._focusTarget()[0]) {
            return $element;
        }

        return this.callBase();
    },

    _scrollContainer: function(direction) {
        if(this.option("multiline") || !windowUtils.hasWindow()) {
            return;
        }

        if(!this._$tagsContainer) {
            return;
        }

        var scrollPosition = this._getScrollPosition(direction);
        this._$tagsContainer.scrollLeft(scrollPosition);
    },

    _getScrollPosition: function(direction) {
        if(direction === "start" || direction === "end") {
            return this._getBorderPosition(direction);
        }

        return this._$focusedTag
            ? this._getFocusedTagPosition(direction)
            : this._getBorderPosition("end");
    },

    _getBorderPosition: function(direction) {
        var rtlEnabled = this.option("rtlEnabled"),
            isScrollLeft = (direction === "end") ^ rtlEnabled,
            isScrollReverted = rtlEnabled && !browser.webkit,
            scrollSign = (!rtlEnabled || browser.webkit || browser.msie) ? 1 : -1;

        return (isScrollLeft ^ !isScrollReverted)
            ? 0
            : scrollSign * (this._$tagsContainer.get(0).scrollWidth - this._$tagsContainer.outerWidth());
    },

    _getFocusedTagPosition: function(direction) {
        var rtlEnabled = this.option("rtlEnabled"),
            isScrollLeft = (direction === "next") ^ rtlEnabled,
            scrollOffset = this._$focusedTag.position().left,
            scrollLeft = this._$tagsContainer.scrollLeft();

        if(isScrollLeft) {
            scrollOffset += this._$focusedTag.outerWidth(true) - this._$tagsContainer.outerWidth();
        }

        if(isScrollLeft ^ (scrollOffset < 0)) {
            var scrollCorrection = rtlEnabled && browser.msie ? -1 : 1;
            scrollLeft += scrollOffset * scrollCorrection;
        }

        return scrollLeft;
    },

    _setNextValue: noop,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTagBoxOptions.value
            * @type Array<string,number,Object>
            */
            value: [],

            showDropDownButton: false,

            maxFilterLength: 1500,

            /**
            * @name dxTagBoxOptions.tagTemplate
            * @type template|function
            * @default "tag"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            tagTemplate: "tag",

            selectAllText: messageLocalization.format("dxList-selectAll"),

            /**
            * @name dxTagBoxOptions.hideSelectedItems
            * @type boolean
            * @default false
            */
            hideSelectedItems: false,

            /**
            * @name dxTagBoxOptions.selectedItems
            * @type Array<string,number,Object>
            * @readonly
            */
            selectedItems: [],

            /**
             * @name dxTagBoxOptions.selectAllMode
             * @type Enums.SelectAllMode
             * @default 'page'
             */
            selectAllMode: 'page',

            /**
            * @name dxTagBoxOptions.onSelectAllValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:boolean
            * @action
            */
            onSelectAllValueChanged: null,

            /**
             * @name dxTagBoxOptions.maxDisplayedTags
             * @type number
             * @default undefined
             */
            maxDisplayedTags: undefined,

            /**
             * @name dxTagBoxOptions.showMultiTagOnly
             * @type boolean
             * @default true
             */
            showMultiTagOnly: true,

            /**
            * @name dxTagBoxOptions.onMultiTagPreparing
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 multiTagElement:dxElement
            * @type_function_param1_field5 selectedItems:Array<string,number,Object>
            * @type_function_param1_field6 text:string
            * @type_function_param1_field7 cancel:boolean
            * @action
            */
            onMultiTagPreparing: null,

            /**
            * @name dxTagBoxOptions.multiline
            * @type boolean
            * @default true
            */
            multiline: true,

            /**
             * @name dxTagBoxOptions.useSubmitBehavior
             * @type boolean
             * @default true
             * @hidden
             */
            useSubmitBehavior: true,

            /**
            * @name dxTagBoxOptions.applyValueMode
            * @type Enums.EditorApplyValueMode
            * @default "instantly"
            */

            /**
            * @name dxTagBoxOptions.onSelectionChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 addedItems:Array<string,number,Object>
            * @type_function_param1_field5 removedItems:Array<string,number,Object>
            * @action
            */

            /**
            * @name dxTagBoxOptions.closeAction
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.hiddenAction
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.itemRender
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.openAction
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.shownAction
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.valueChangeEvent
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.maxLength
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.onCopy
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.onCut
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.onPaste
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.spellcheck
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.displayValue
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTagBoxOptions.selectedItem
            * @hidden
            * @inheritdoc
            */
        });
    },

    _init: function() {
        this.callBase();
        this._selectedItems = [];

        this._initSelectAllValueChangedAction();
    },

    _initActions: function() {
        this.callBase();
        this._initMultiTagPreparingAction();
    },

    _initMultiTagPreparingAction: function() {
        this._multiTagPreparingAction = this._createActionByOption("onMultiTagPreparing", {
            beforeExecute: (function(e) {
                this._multiTagPreparingHandler(e.args[0]);
            }).bind(this)
        });
    },

    _multiTagPreparingHandler: function(args) {
        var selectedCount = this._getValue().length;

        if(!this.option("showMultiTagOnly")) {
            args.text = messageLocalization.getFormatter("dxTagBox-moreSelected")(selectedCount - this.option("maxDisplayedTags") + 1);
        } else {
            args.text = messageLocalization.getFormatter("dxTagBox-selected")(selectedCount);
        }
    },

    _initDynamicTemplates: function() {
        this.callBase();

        this._defaultTemplates["tag"] = new BindableTemplate(function($container, data) {

            var $tagContent = $("<div>").addClass(TAGBOX_TAG_CONTENT_CLASS);

            $("<span>")
                .text(data.text || data)
                .appendTo($tagContent);

            $("<div>")
                .addClass(TAGBOX_TAG_REMOVE_BUTTON_CLASS)
                .appendTo($tagContent);

            $container.append($tagContent);
        }.bind(this), ["text"], this.option("integrationOptions.watchMethod"), {
            "text": this._displayGetter
        });
    },

    _toggleSubmitElement: function(enabled) {
        if(enabled) {
            this._renderSubmitElement();
            this._setSubmitValue();
        } else {
            this._$submitElement && this._$submitElement.remove();
            delete this._$submitElement;
        }
    },

    _renderSubmitElement: function() {
        if(!this.option("useSubmitBehavior")) {
            return;
        }

        this._$submitElement = $("<select>")
            .attr("multiple", "multiple")
            .css("display", "none")
            .appendTo(this.$element());
    },

    _setSubmitValue: function() {
        if(!this.option("useSubmitBehavior")) {
            return;
        }

        var value = this._getValue(),
            useDisplayText = this.option("valueExpr") === "this",
            $options = [];

        for(var i = 0, n = value.length; i < n; i++) {
            $options.push(
                $("<option>")
                    .val(useDisplayText ? this._displayGetter(value[i]) : value[i])
                    .attr("selected", "selected")
            );
        }

        this._$submitElement.empty();
        this._$submitElement.append($options);
    },

    _initMarkup: function() {
        this._tagElementsCache = $();
        var isSingleLineMode = !this.option("multiline");

        this.$element()
            .addClass(TAGBOX_CLASS)
            .toggleClass(TAGBOX_ONLY_SELECT_CLASS, !(this.option("searchEnabled") || this.option("acceptCustomValue")))
            .toggleClass(TAGBOX_SINGLE_LINE_CLASS, isSingleLineMode);

        // TODO: texteditor render methods order research
        this._initTagTemplate();

        this.callBase();
    },

    _render: function() {
        this.callBase();

        this._renderTagRemoveAction();
        this._renderSingleLineScroll();
        this._scrollContainer("start");
    },

    _initTagTemplate: function() {
        this._tagTemplate = this._getTemplateByOption("tagTemplate");
    },

    _renderField: function() {
        var isDefaultFieldTemplate = !isDefined(this.option("fieldTemplate"));

        this.$element()
            .toggleClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS, isDefaultFieldTemplate)
            .toggleClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS, !isDefaultFieldTemplate);

        this.callBase();
    },

    _renderTagRemoveAction: function() {
        var tagRemoveAction = this._createAction(this._removeTagHandler.bind(this));
        var eventName = eventUtils.addNamespace(clickEvent.name, "dxTagBoxTagRemove");

        eventsEngine.off(this._$tagsContainer, eventName);
        eventsEngine.on(this._$tagsContainer, eventName, "." + TAGBOX_TAG_REMOVE_BUTTON_CLASS, function(e) {
            tagRemoveAction({ event: e });
        });

        this._renderTypingEvent();
    },

    _renderSingleLineScroll: function() {
        var mouseWheelEvent = eventUtils.addNamespace("dxmousewheel", this.NAME),
            $element = this.$element(),
            isMultiline = this.option("multiline");

        eventsEngine.off($element, mouseWheelEvent);

        if(devices.real().deviceType !== "desktop") {
            this._$tagsContainer && this._$tagsContainer.css("overflowX", isMultiline ? "" : "auto");
            return;
        }

        if(isMultiline) {
            return;
        }

        eventsEngine.on($element, mouseWheelEvent, this._tagContainerMouseWheelHandler.bind(this));
    },

    _tagContainerMouseWheelHandler: function(e) {
        var scrollLeft = this._$tagsContainer.scrollLeft();
        this._$tagsContainer.scrollLeft(scrollLeft + e.delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER);

        return false;
    },

    _renderTypingEvent: function() {
        eventsEngine.on(this._input(), eventUtils.addNamespace("keydown", this.NAME), (function(e) {
            if(!this._isControlKey(e.key) && this._isEditable()) {
                this._clearTagFocus();
            }
        }).bind(this));
    },

    _popupWrapperClass: function() {
        return this.callBase() + " " + TAGBOX_POPUP_WRAPPER_CLASS;
    },

    _renderInput: function() {
        this.callBase();
        this._renderPreventBlur(this._inputWrapper());
    },

    _renderInputValueImpl: function() {
        this._renderMultiSelect();
    },

    _loadInputValue: function() {
        return when();
    },

    _clearTextValue: function() {
        this._input().val("");
        this._toggleEmptinessEventHandler();
    },

    _focusInHandler: function(e) {
        this.callBase(e);

        this._scrollContainer("end");
    },

    _restoreInputText: function() {
        this._clearTextValue();
    },

    _focusOutHandler: function(e) {
        this.callBase(e);

        this._clearTagFocus();

        this._scrollContainer("start");
    },

    _getFirstPopupElement: function() {
        return this.option("showSelectionControls")
            ? this._popup._wrapper().find("." + LIST_SELECT_ALL_CHECKBOX_CLASS)
            : this.callBase();
    },

    _initSelectAllValueChangedAction: function() {
        this._selectAllValueChangeAction = this._createActionByOption("onSelectAllValueChanged");
    },

    _renderList: function() {
        this.callBase();

        this._setListDataSourceFilter();

        if(!this.option("showSelectionControls")) {
            return;
        }

        var $selectAllCheckBox = this._list.$element().find("." + LIST_SELECT_ALL_CHECKBOX_CLASS),
            selectAllCheckbox = $selectAllCheckBox.dxCheckBox("instance");

        selectAllCheckbox.registerKeyHandler("tab", this._popupElementTabHandler.bind(this));
        selectAllCheckbox.registerKeyHandler("escape", this._popupElementEscHandler.bind(this));
    },

    _listConfig: function() {
        var that = this,
            selectionMode = this.option("showSelectionControls") ? "all" : "multiple";

        return extend(this.callBase(), {
            selectionMode: selectionMode,
            selectAllText: this.option("selectAllText"),
            onSelectAllValueChanged: function(e) {
                that._selectAllValueChangeAction({
                    value: e.value
                });
            },
            selectAllMode: this.option("selectAllMode"),
            selectedItems: this._selectedItems,
            onFocusedItemChanged: null
        });
    },

    _renderMultiSelect: function() {
        this._$tagsContainer = this.$element()
            .find("." + TEXTEDITOR_CONTAINER_CLASS)
            .addClass(TAGBOX_TAG_CONTAINER_CLASS)
            .addClass(NATIVE_CLICK_CLASS);

        this._renderInputSize();
        this._renderTags();
        this._popup && this._popup.refreshPosition();
    },

    _listItemClickHandler: function(e) {
        !this.option("showSelectionControls") && this._clearTextValue();

        if(this.option("applyValueMode") === "useButtons") {
            return;
        }

        this.callBase(e);
    },

    _renderInputSize: function() {
        var $input = this._input();
        $input.prop("size", $input.val() ? $input.val().length + 2 : 1);
    },

    _renderInputSubstitution: function() {
        this.callBase();
        this._renderInputSize();
    },

    _getValue: function() {
        return this.option("value") || [];
    },

    _multiTagRequired: function() {
        var values = this._getValue(),
            maxDisplayedTags = this.option("maxDisplayedTags");

        return isDefined(maxDisplayedTags) && values.length > maxDisplayedTags;
    },

    _renderMultiTag: function($input) {
        var $tag = $("<div>")
                .addClass(TAGBOX_TAG_CLASS)
                .addClass(TAGBOX_MULTI_TAG_CLASS);

        var args = {
            multiTagElement: getPublicElement($tag),
            selectedItems: this.option("selectedItems")
        };

        this._multiTagPreparingAction(args);

        if(args.cancel) {
            return false;
        }

        $tag.data(TAGBOX_TAG_DATA_KEY, args.text);
        $tag.insertBefore($input);

        this._tagTemplate.render({
            model: args.text,
            container: getPublicElement($tag)
        });

        return $tag;
    },

    _getFilteredItems: function(values) {
        var creator = new FilterCreator(values);

        var selectedItems = (this._list && this._list.option("selectedItems")) || this.option("selectedItems"),
            clientFilterFunction = creator.getLocalFilter(this._valueGetter),
            filteredItems = selectedItems.filter(clientFilterFunction),
            selectedItemsAlreadyLoaded = filteredItems.length === values.length,
            d = new Deferred();

        if(selectedItemsAlreadyLoaded) {
            return d.resolve(filteredItems).promise();
        } else {
            var dataSourceFilter = this._dataSource.filter(),
                filterExpr = creator.getCombinedFilter(this.option("valueExpr"), dataSourceFilter),
                filterLength = encodeURI(JSON.stringify(filterExpr)).length,
                resultFilter = filterLength > this.option("maxFilterLength") ? undefined : filterExpr;

            this._dataSource.store().load({ filter: resultFilter }).done(function(items) {
                d.resolve(items.filter(clientFilterFunction));
            });

            return d.promise();
        }

    },

    _createTagData: function(values, filteredItems) {
        var items = [];

        each(values, function(valueIndex, value) {
            var item = filteredItems[valueIndex];

            if(isDefined(item)) {
                this._selectedItems.push(item);
                items.splice(valueIndex, 0, item);
            } else {
                var selectedItem = this.option("selectedItem"),
                    customItem = this._valueGetter(selectedItem) === value ? selectedItem : value;

                items.splice(valueIndex, 0, customItem);
            }
        }.bind(this));

        return items;
    },

    _loadTagData: function() {
        var values = this._getValue(),
            tagData = new Deferred();

        this._selectedItems = [];

        this._getFilteredItems(values)
            .done(function(filteredItems) {
                var items = this._createTagData(values, filteredItems);
                tagData.resolve(items);
            }.bind(this))
            .fail(tagData.reject.bind(this));

        return tagData.promise();
    },

    _renderTags: function() {
        this._loadTagData().always((function(items) {
            this._renderTagsCore(items);
        }).bind(this));

        this._renderEmptyState();

        if(!this._preserveFocusedTag) {
            this._clearTagFocus();
        }
    },

    _renderTagsCore: function(items) {
        this._renderInputAddons();

        this.option("selectedItems", this._selectedItems.slice());
        this._cleanTags();

        var $multiTag = this._multiTagRequired() && this._renderMultiTag(this._input()),
            showMultiTagOnly = this.option("showMultiTagOnly"),
            maxDisplayedTags = this.option("maxDisplayedTags");

        items.forEach(function(item, index) {
            if(($multiTag && showMultiTagOnly) || ($multiTag && !showMultiTagOnly && index - maxDisplayedTags >= -1)) {
                return false;
            }
            this._renderTag(item, $multiTag || this._input());
        }.bind(this));

        this._scrollContainer("end");
        this._refreshTagElements();
    },

    _cleanTags: function() {
        if(this._multiTagRequired()) {
            this._tagElements().remove();
        } else {
            var $tags = this._tagElements(),
                values = this._getValue();

            each($tags, function(_, tag) {
                var $tag = $(tag),
                    index = inArray($tag.data(TAGBOX_TAG_DATA_KEY), values);

                if(index < 0) {
                    $tag.remove();
                }
            });
        }
    },

    _renderEmptyState: function() {
        var isEmpty = !(this._getValue().length || this._selectedItems.length || this._searchValue());
        this._toggleEmptiness(isEmpty);
        this._renderDisplayText();
    },

    _renderDisplayText: function() {
        this._renderInputSize();
    },

    _refreshTagElements: function() {
        this._tagElementsCache = this.$element().find("." + TAGBOX_TAG_CLASS);
    },

    _tagElements: function() {
        return this._tagElementsCache;
    },

    _applyTagTemplate: function(item, $tag) {
        this._tagTemplate.render({
            model: item,
            container: getPublicElement($tag)
        });
    },

    _renderTag: function(item, $input) {
        var value = this._valueGetter(item);

        if(!isDefined(value)) {
            return;
        }

        var $tag = this._getTag(value),
            displayValue = this._displayGetter(item),
            itemModel = this._getItemModel(item, displayValue);

        if($tag) {
            if(isDefined(displayValue)) {
                $tag.empty();
                this._applyTagTemplate(itemModel, $tag);
            }

            $tag.removeClass(TAGBOX_CUSTOM_TAG_CLASS);
        } else {
            $tag = this._createTag(value, $input);

            if(isDefined(item)) {
                this._applyTagTemplate(itemModel, $tag);
            } else {
                $tag.addClass(TAGBOX_CUSTOM_TAG_CLASS);
                this._applyTagTemplate(value, $tag);
            }
        }
    },

    _getItemModel: function(item, displayValue) {
        if(typeUtils.isObject(item)) {
            return item;
        } else {
            return displayValue;
        }
    },

    _getTag: function(value) {
        var $tags = this._tagElements(),
            tagsLength = $tags.length;
        var result = false;

        for(var i = 0; i < tagsLength; i++) {
            var $tag = $tags[i],
                tagData = dataUtils.data($tag, TAGBOX_TAG_DATA_KEY);

            if(value === tagData || (commonUtils.equalByValue(value, tagData))) {
                result = $($tag);
                break;
            }
        }
        return result;
    },

    _createTag: function(value, $input) {
        return $("<div>")
            .addClass(TAGBOX_TAG_CLASS)
            .data(TAGBOX_TAG_DATA_KEY, value)
            .insertBefore($input);
    },

    _toggleEmptinessEventHandler: function() {
        this._toggleEmptiness(!this._getValue().length && !this._searchValue().length);
    },

    _customItemAddedHandler: function(e) {
        this.callBase(e);
        this._input().val("");
    },

    _removeTagHandler: function(args) {
        var e = args.event;

        e.stopPropagation();

        var $tag = $(e.target).closest("." + TAGBOX_TAG_CLASS);
        this._removeTagElement($tag);
    },

    _removeTagElement: function($tag) {
        if($tag.hasClass(TAGBOX_MULTI_TAG_CLASS)) {
            if(!this.option("showMultiTagOnly")) {
                this.option("value", this._getValue().slice(0, this.option("maxDisplayedTags")));
            } else {
                this.reset();
            }
            return;
        }

        var itemValue = $tag.data(TAGBOX_TAG_DATA_KEY);
        this._removeTagWithUpdate(itemValue);
        this._refreshTagElements();
    },

    _updateField: noop,

    _removeTagWithUpdate: function(itemValue) {
        var value = this._getValue().slice();
        this._removeTag(value, itemValue);
        this.option("value", value);

        if(value.length === 0) {
            this._clearTagFocus();
        }
    },

    _getCurrentValue: function() {
        return this._lastValue();
    },

    _selectionChangeHandler: function(e) {
        if(this.option("applyValueMode") === "useButtons") {
            return;
        }

        var value = this._getValue().slice();

        each(e.removedItems || [], (function(_, removedItem) {
            this._removeTag(value, this._valueGetter(removedItem));
        }).bind(this));

        each(e.addedItems || [], (function(_, addedItem) {
            this._addTag(value, this._valueGetter(addedItem));
        }).bind(this));

        this._updateWidgetHeight();
        this.option("value", value);
    },

    _removeTag: function(value, item) {
        var index = this._valueIndex(item, value);

        if(index >= 0) {
            value.splice(index, 1);
        }
    },

    _addTag: function(value, item) {
        var index = this._valueIndex(item);

        if(index < 0) {
            value.push(item);
        }
    },

    _fieldRenderData: function() {
        return this._selectedItems.slice();
    },

    _completeSelection: function(value) {
        if(!this.option("showSelectionControls")) {
            this._setValue(value);
        }
    },


    _setValue: function(value) {
        if(value === null) {
            return;
        }

        var useButtons = this.option("applyValueMode") === "useButtons",
            valueIndex = this._valueIndex(value),
            values = (useButtons ? this._list.option("selectedItemKeys") : this._getValue()).slice();

        if(valueIndex >= 0) {
            values.splice(valueIndex, 1);
        } else {
            values.push(value);
        }

        if(this.option("applyValueMode") === "useButtons") {
            this._list.option("selectedItemKeys", values);
        } else {
            this.option("value", values);
        }
    },

    _isSelectedValue: function(value, cache) {
        return this._valueIndex(value, null, cache) > -1;
    },

    _valueIndex: function(value, values, cache) {
        var result = -1;

        if(cache && typeof value !== "object") {
            if(!cache.indexByValues) {
                cache.indexByValues = {};
                values = values || this._getValue();
                values.forEach(function(value, index) {
                    cache.indexByValues[value] = index;
                });
            }
            if(value in cache.indexByValues) {
                return cache.indexByValues[value];
            }
        }

        values = values || this._getValue();


        each(values, (function(index, selectedValue) {
            if(this._isValueEquals(value, selectedValue)) {
                result = index;
                return false;
            }
        }).bind(this));

        return result;
    },

    _lastValue: function() {
        var values = this._getValue(),
            lastValue = values[values.length - 1];
        return isDefined(lastValue) ? lastValue : null;
    },

    _valueChangeEventHandler: noop,

    _shouldRenderSearchEvent: function() {
        return this.option("searchEnabled") || this.option("acceptCustomValue");
    },

    _searchHandler: function(e) {
        if(this.option("searchEnabled") && !!e && !this._isTagRemoved) {
            this.callBase(e);
        }

        this._updateWidgetHeight();
        delete this._isTagRemoved;
    },

    _updateWidgetHeight: function() {
        var element = this.$element(),
            originalHeight = element.height();

        this._renderInputSize();

        var currentHeight = element.height();

        if(this._popup && this.option("opened") && this._isEditable() && currentHeight !== originalHeight) {
            this._popup.repaint();
        }
    },

    _refreshSelected: function() {
        this._list && this._list.option("selectedItems", this._selectedItems);
    },

    _getDataSource: function() {
        return this._dataSource;
    },

    _resetListDataSourceFilter: function() {
        var dataSource = this._getDataSource();

        if(!dataSource) {
            return;
        }

        delete this._userFilter;

        dataSource.filter(null);
        dataSource.reload();
    },

    _setListDataSourceFilter: function() {
        if(!this.option("hideSelectedItems") || !this._list) {
            return;
        }

        var dataSource = this._getDataSource();

        if(!dataSource) {
            return;
        }

        var valueGetterExpr = this._valueGetterExpr();

        if(typeUtils.isString(valueGetterExpr) && valueGetterExpr !== "this") {
            var filter = this._dataSourceFilterExpr();

            if(this._userFilter === undefined) {
                this._userFilter = dataSource.filter() || null;
            }

            this._userFilter && filter.push(this._userFilter);

            filter.length ? dataSource.filter(filter) : dataSource.filter(null);

        } else {
            dataSource.filter(this._dataSourceFilterFunction.bind(this));
        }

        dataSource.load();
    },

    _dataSourceFilterExpr: function() {
        var filter = [];

        each(this._getValue(), (function(index, value) {
            filter.push(["!", [this._valueGetterExpr(), value]]);
        }).bind(this));

        return filter;
    },

    _dataSourceFilterFunction: function(itemData) {
        var itemValue = this._valueGetter(itemData),
            result = true;

        each(this._getValue(), (function(index, value) {
            if(this._isValueEquals(value, itemValue)) {
                result = false;
                return false;
            }
        }).bind(this));

        return result;

    },

    _applyButtonHandler: function() {
        this.option("value", this._getSortedListValues());
        this._clearTextValue();
        this._clearFilter();
        this.callBase();
    },

    _getSortedListValues: function() {
        var listValues = this._getListValues(),
            currentValue = this.option("value") || [],
            existedItems = listValues.length ? currentValue.filter(item => listValues.indexOf(item) !== -1) : [],
            newItems = existedItems.length ? listValues.filter(item => currentValue.indexOf(item) === -1) : listValues;

        return existedItems.concat(newItems);
    },

    _getListValues: function() {
        if(!this._list) {
            return [];
        }

        var that = this,
            selectedItems = this._getPlainItems(this._list.option("selectedItems")),
            result = [];

        each(selectedItems, function(index, item) {
            result[index] = that._valueGetter(item);
        });

        return result;
    },

    _renderOpenedState: function() {
        this.callBase();

        if(this.option("applyValueMode") === "useButtons" && !this.option("opened")) {
            this._refreshSelected();
        }
    },

    _clean: function() {
        this.callBase();
        delete this._defaultTagTemplate;
        delete this._tagTemplate;
    },

    _removeDuplicates: function(from, what) {
        var that = this,
            result = [];

        each(from, function(_, value) {
            var filteredItems = what.filter(function(item) {
                return that._valueGetter(value) === that._valueGetter(item);
            });

            if(!filteredItems.length) {
                result.push(value);
            }
        });

        return result;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onSelectAllValueChanged":
                this._initSelectAllValueChangedAction();
                break;
            case "onMultiTagPreparing":
                this._initMultiTagPreparingAction();
                this._renderTags();
                break;
            case "hideSelectedItems":
                if(args.value) {
                    this._setListDataSourceFilter();
                } else {
                    this._resetListDataSourceFilter();
                }
                break;
            case "useSubmitBehavior":
                this._toggleSubmitElement(args.value);
                break;
            case "displayExpr":
                this.callBase(args);
                this._initTemplates();
                this._invalidate();
                break;
            case "tagTemplate":
                this._initTagTemplate();
                this._invalidate();
                break;
            case "selectAllText":
                this._setListOption("selectAllText", this.option("selectAllText"));
                break;
            case "value":
                this.callBase(args);
                this._setListDataSourceFilter();
                break;
            case "maxDisplayedTags":
            case "showMultiTagOnly":
                this._renderTags();
                break;
            case "selectAllMode":
                this._setListOption(args.name, args.value);
                break;
            case "selectedItem":
                break;
            case "selectedItems":
                var addedItems = this._removeDuplicates(args.value, args.previousValue),
                    removedItems = this._removeDuplicates(args.previousValue, args.value);

                this._selectionChangedAction({
                    addedItems: addedItems,
                    removedItems: removedItems
                });
                break;
            case "multiline":
                this.$element().toggleClass(TAGBOX_SINGLE_LINE_CLASS, !args.value);
                this._renderSingleLineScroll();
                break;
            case "maxFilterLength":
                break;
            default:
                this.callBase(args);
        }
    },

    _getActualSearchValue: function() {
        return this.callBase() || this._searchValue();
    },

    _popupHidingHandler: function() {
        this.callBase();
        this._clearFilter();
    },

    reset: function() {
        this.option("value", []);

        this._clearFilter();
        this._clearSelectedItem();
    }
});

registerComponent("dxTagBox", TagBox);

module.exports = TagBox;
