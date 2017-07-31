"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    dataUtils = require("../core/element_data"),
    devices = require("../core/devices"),
    noop = require("../core/utils/common").noop,
    isDefined = require("../core/utils/type").isDefined,
    arrayUtils = require("../core/utils/array"),
    iteratorUtils = require("../core/utils/iterator"),
    extend = require("../core/utils/extend").extend,
    messageLocalization = require("../localization/message"),
    registerComponent = require("../core/component_registrator"),
    eventUtils = require("../events/utils"),
    SelectBox = require("./select_box"),
    clickEvent = require("../events/click"),
    caret = require("./text_box/utils.caret"),
    browser = require("../core/utils/browser"),
    when = require("../integration/jquery/deferred").when,
    pointerEvents = require("../events/pointer"),
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
    NATIVE_CLICK_CLASS = "dx-native-click";

var TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;

/**
* @name dxTagBox
* @isEditor
* @publicName dxTagBox
* @inherits dxSelectBox
* @groupName Editors
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
        return caret(this._input()).start === 0;
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
        if(this.option("multiline")) {
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

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxTagBoxOptions_values
            * @publicName values
            * @deprecated dxTagBoxOptions_value
            * @extend_doc
            */
            "values": { since: "16.1", alias: "value" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTagBoxOptions_value
            * @publicName value
            * @type array
            */
            value: [],

            showDropDownButton: false,

            /**
            * @name dxTagBoxOptions_tagTemplate
            * @publicName tagTemplate
            * @type template
            * @default "tag"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemElement:jQuery
            * @type_function_return string|Node|jQuery
            */
            tagTemplate: "tag",

            selectAllText: messageLocalization.format("dxList-selectAll"),

            /**
            * @name dxTagBoxOptions_hideSelectedItems
            * @publicName hideSelectedItems
            * @type boolean
            * @default false
            */
            hideSelectedItems: false,

            /**
            * @name dxTagBoxOptions_selectedItems
            * @publicName selectedItems
            * @type array
            * @readonly
            */
            selectedItems: [],

            /**
             * @name  dxTagBoxOptions_selectAllMode
             * @publicName selectAllMode
             * @type string
             * @default 'page'
             * @acceptValues 'page'|'allPages'
             */
            selectAllMode: 'page',

            /**
            * @name dxTagBoxOptions_onSelectAllValueChanged
            * @publicName onSelectAllValueChanged
            * @extends Action
            * @type_function_param1_field4 value:boolean
            * @action
            */
            onSelectAllValueChanged: null,

            /**
             * @name dxTagBoxOptions_maxDisplayedTags
             * @publicName maxDisplayedTags
             * @type number
             * @default undefined
             */
            maxDisplayedTags: undefined,

            /**
             * @name dxTagBoxOptions_showMultiTagOnly
             * @publicName showMultiTagOnly
             * @type boolean
             * @default true
             */
            showMultiTagOnly: true,

            /**
             * @name dxTagBoxOptions_onMultiTagPreparing
             * @publicName onMultiTagPreparing
             * @extends Action
             * @type_function_param1_field4 multiTagElement:jQuery
             * @type_function_param1_field5 selectedItems:array
             * @type_function_param1_field6 text:string
             * @type_function_param1_field7 cancel:boolean
             * @action
             */
            onMultiTagPreparing: null,

            /**
            * @name dxTagBoxOptions_multiline
            * @publicName multiline
            * @type boolean
            * @default true
            */
            multiline: true

            /**
            * @name dxTagBoxOptions_applyValueMode
            * @publicName applyValueMode
            * @type string
            * @default "instantly"
            * @acceptValues 'useButtons'|'instantly'
            */

            /**
            * @name dxTagBoxOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @extends Action
            * @type_function_param1_field4 addedItems:array
            * @type_function_param1_field5 removedItems:array
            * @action
            */

            /**
            * @name dxTagBoxOptions_closeAction
            * @publicName closeAction
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_hiddenAction
            * @publicName hiddenAction
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_itemRender
            * @publicName itemRender
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_openAction
            * @publicName openAction
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_shownAction
            * @publicName shownAction
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_valueChangeEvent
            * @publicName valueChangeEvent
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_maxLength
            * @publicName maxLength
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_onCopy
            * @publicName onCopy
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_onCut
            * @publicName onCut
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_onPaste
            * @publicName onPaste
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_spellcheck
            * @publicName spellcheck
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_displayValue
            * @publicName displayValue
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTagBoxOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @extend_doc
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

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["tag"] = new BindableTemplate(function($container, data) {
            var $tagContent = $("<div>").addClass(TAGBOX_TAG_CONTENT_CLASS);

            $("<span>")
                .text(data)
                .appendTo($tagContent);

            $("<div>")
                .addClass(TAGBOX_TAG_REMOVE_BUTTON_CLASS)
                .appendTo($tagContent);

            $container.append($tagContent);
        }, [], this.option("integrationOptions.watchMethod"));
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<select>")
            .attr("multiple", "multiple")
            .css("display", "none")
            .appendTo(this.element());
    },

    _setSubmitValue: function() {
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

        this._$submitElement.html($options);
    },

    _render: function() {
        this._tagElementsCache = $();

        var isSingleLineMode = !this.option("multiline");

        this.element()
            .addClass(TAGBOX_CLASS)
            .toggleClass(TAGBOX_ONLY_SELECT_CLASS, !(this.option("searchEnabled") || this.option("acceptCustomValue")))
            .toggleClass(TAGBOX_SINGLE_LINE_CLASS, isSingleLineMode);

        // TODO: texteditor render methods order research
        this._toggleRTLDirection(this.option("rtlEnabled"));
        this._initTagTemplate();

        this.callBase();

        if(isSingleLineMode) {
            this._renderPreventBlur();
        }

        this._renderTagRemoveAction();
        this._renderSingleLineScroll();
        this._scrollContainer("start");
    },

    _initTagTemplate: function() {
        this._tagTemplate = this._getTemplateByOption("tagTemplate");
    },

    _renderField: function() {
        var isDefaultFieldTemplate = !isDefined(this.option("fieldTemplate"));

        this.element()
            .toggleClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS, isDefaultFieldTemplate)
            .toggleClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS, !isDefaultFieldTemplate);

        this.callBase();
    },

    _renderPreventBlur: function() {
        var eventName = eventUtils.addNamespace(pointerEvents.down, "dxTagBoxContainer");

        if(this._$tagsContainer) {
            eventsEngine.off(this._$tagsContainer, eventName);
            eventsEngine.on(this._$tagsContainer, eventName, function(e) {
                e.preventDefault();
            });
        }
    },

    _renderTagRemoveAction: function() {
        var tagRemoveAction = this._createAction(this._removeTagHandler.bind(this));
        var eventName = eventUtils.addNamespace(clickEvent.name, "dxTagBoxTagRemove");
        var $container = this.element().find(".dx-texteditor-container");

        eventsEngine.off($container, eventName);
        eventsEngine.on($container, eventName, "." + TAGBOX_TAG_REMOVE_BUTTON_CLASS, function(e) {
            tagRemoveAction({ jQueryEvent: e });
        });

        this._renderTypingEvent();
    },

    _renderSingleLineScroll: function() {
        var mouseWheelEvent = eventUtils.addNamespace("dxmousewheel", this.NAME),
            $element = this.element(),
            isMultiline = this.option("multiline");

        eventsEngine.off($element, mouseWheelEvent);

        if(devices.real().deviceType !== "desktop") {
            this._$tagsContainer && this._$tagsContainer.css("overflow-x", isMultiline ? "" : "auto");
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

    _renderInputValueImpl: function() {
        this._renderMultiSelect();
    },

    _loadInputValue: function() {
        return $.when();
    },

    _clearTextValue: function() {
        this._input().val("");
    },

    _focusInHandler: function(e) {
        this.callBase(e);

        this._scrollContainer("end");
    },

    _focusOutHandler: function(e) {
        if(this.option("opened") && this.option("applyValueMode") === "useButtons") {
            return;
        }

        this.callBase(e);
        this._clearTextValue();
        this._clearTagFocus();

        this._scrollContainer("start");
    },

    _getFirstPopupElement: function() {
        return this.option("showSelectionControls")
            ? this._popup._wrapper().find("." + LIST_SELECT_ALL_CHECKBOX_CLASS)
            : this.callBase();
    },

    _suppressingSelectionChanged: function(callback) {
        this._setListOption("onSelectionChanged", noop);
        callback.call(this);
        this._setListOption("onSelectionChanged", this._getSelectionChangeHandler());
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

        var $selectAllCheckBox = this._list.element().find("." + LIST_SELECT_ALL_CHECKBOX_CLASS),
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
        this._$tagsContainer = this.element()
            .find(".dx-texteditor-container")
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
            multiTagElement: $tag,
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
            container: $tag
        });

        return $tag;
    },

    _loadTagData: function() {
        var values = this._getValue(),
            tagData = $.Deferred(),
            items = [];

        this._selectedItems = [];

        var itemLoadDeferreds = iteratorUtils.map(values, (function(value) {
            return this._loadItem(value).always((function(item) {
                var valueIndex = values.indexOf(value);

                if(isDefined(item)) {
                    this._selectedItems.push(item);
                    items.splice(valueIndex, 0, item);
                } else {
                    items.splice(valueIndex, 0, value);
                }
            }).bind(this));
        }).bind(this));

        when.apply($, itemLoadDeferreds)
            .done(function() { tagData.resolve(items); })
            .fail(function() { tagData.reject(items); });

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
        this._tagElements().remove();

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

    _renderEmptyState: function() {
        var isEmpty = !(this._getValue().length || this._selectedItems.length || this._searchValue());
        this._toggleEmptiness(isEmpty);
        this._renderDisplayText();
    },

    _renderDisplayText: function() {
        this._renderInputSize();
    },

    _refreshTagElements: function() {
        this._tagElementsCache = this.element().find("." + TAGBOX_TAG_CLASS);
    },

    _tagElements: function() {
        return this._tagElementsCache;
    },

    _getDefaultTagTemplate: function() {
        return this._defaultTemplates["tag"];
    },

    _applyTagTemplate: function(item, $tag) {
        if(this._displayGetterExpr() && this._tagTemplate === this._getDefaultTagTemplate()) {
            item = this._displayGetter(item);
        }

        this._tagTemplate.render({
            model: item,
            container: $tag
        });
    },

    _renderTag: function(item, $input) {
        var value = this._valueGetter(item) || item,
            $tag = this._getTag(value);

        if($tag) {
            if(!$tag.hasClass(TAGBOX_CUSTOM_TAG_CLASS)) {
                return $.Deferred().resolve();
            }

            $tag.removeClass(TAGBOX_CUSTOM_TAG_CLASS);
        } else {
            $tag = this._createTag(value, $input);
        }

        if(isDefined(item)) {
            this._applyTagTemplate(item, $tag);
        } else {
            $tag.addClass(TAGBOX_CUSTOM_TAG_CLASS);
            this._applyTagTemplate(value, $tag);
        }
    },

    _getTag: function(value) {
        var $tags = this._tagElements(),
            tagsLength = $tags.length;
        var result = false;

        for(var i = 0; i < tagsLength; i++) {
            var $tag = $tags[i];
            if(value === dataUtils.data($tag, TAGBOX_TAG_DATA_KEY)) {
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
        var e = args.jQueryEvent;

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

        iteratorUtils.each(e.removedItems || [], (function(_, removedItem) {
            this._removeTag(value, this._valueGetter(removedItem));
        }).bind(this));

        iteratorUtils.each(e.addedItems || [], (function(_, addedItem) {
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

    _setValue: function(value) {
        if(value === null) {
            return;
        }

        if(this.option("showSelectionControls")) {
            return;
        }

        var valueIndex = this._valueIndex(value),
            values = this._getValue().slice();

        if(valueIndex >= 0) {
            values.splice(valueIndex, 1);
        } else {
            values.push(value);
        }

        this.option("value", values);
    },

    _isSelectedValue: function(value) {
        return this._valueIndex(value) > -1;
    },

    _valueIndex: function(value, values) {
        values = values || this._getValue();

        var result = -1;

        iteratorUtils.each(values, (function(index, selectedValue) {
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
        var element = this.element(),
            originalHeight = element.height();

        this._renderInputSize();

        var currentHeight = element.height();

        if(this._popup && this.option("opened") && this._isEditable() && currentHeight !== originalHeight) {
            this._popup.repaint();
        }
    },

    _refreshSelected: function() {
        this._list && this._suppressingSelectionChanged(function() {
            this.callBase();
        });
    },

    _resetListDataSourceFilter: function() {
        var dataSource = this._getDataSource();

        if(!dataSource) {
            return;
        }

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

        dataSource.filter(this._dataSourceFilter.bind(this));
        dataSource.reload();
    },

    _dataSourceFilter: function(itemData) {
        var itemValue = this._valueGetter(itemData),
            result = true;

        iteratorUtils.each(this._getValue(), (function(index, value) {
            if(this._isValueEquals(value, itemValue)) {
                result = false;
                return false;
            }
        }).bind(this));

        return result;
    },

    _applyButtonHandler: function() {
        this.option("value", this._getListValues());
        this._clearTextValue();
        this.callBase();
    },

    _getListValues: function() {
        if(!this._list) {
            return [];
        }

        var that = this,
            selectedItems = this._getPlainItems(this._list.option("selectedItems")),
            result = [];

        iteratorUtils.each(selectedItems, function(index, item) {
            result[index] = that._valueGetter(item);
        });

        return result;
    },

    _renderOpenedState: function() {
        this.callBase();

        if(this.option("applyValueMode" === "useButtons" && !this.option("opened"))) {
            this._refreshSelected();
        }
    },

    _clean: function() {
        this.callBase();
        delete this._defaultTagTemplate;
        delete this._tagTemplate;
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
            case "displayExpr":
                this.callBase(args);
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
                var addedItems = arrayUtils.removeDuplicates(args.value, args.previousValue),
                    removedItems = arrayUtils.removeDuplicates(args.previousValue, args.value);

                this._selectionChangedAction({
                    addedItems: addedItems,
                    removedItems: removedItems
                });
                break;
            case "multiline":
                this.element().toggleClass(TAGBOX_SINGLE_LINE_CLASS, !args.value);
                this._renderSingleLineScroll();
                break;
            default:
                this.callBase(args);
        }
    },

    reset: function() {
        this.option("value", []);

        this._clearFilter();
        this._clearSelectedItem();
    }
});

registerComponent("dxTagBox", TagBox);

module.exports = TagBox;
