import $ from '../core/renderer';
import devices from '../core/devices';
import { data as elementData } from '../core/element_data';
import eventsEngine from '../events/core/events_engine';
import registerComponent from '../core/component_registrator';
import { noop, ensureDefined, equalByValue } from '../core/utils/common';
import { SelectionFilterCreator as FilterCreator } from '../core/utils/selection_filter';
import { Deferred, when } from '../core/utils/deferred';
import { createTextElementHiddenCopy } from '../core/utils/dom';
import { getPublicElement } from '../core/element';
import { isDefined, isObject, isString } from '../core/utils/type';
import { hasWindow } from '../core/utils/window';
import { extend } from '../core/utils/extend';
import { inArray } from '../core/utils/array';
import { each } from '../core/utils/iterator';
import messageLocalization from '../localization/message';
import { addNamespace, normalizeKeyName } from '../events/utils/index';
import { name as clickEvent } from '../events/click';
import caret from './text_box/utils.caret';
import { normalizeLoadResult } from '../data/data_source/utils';
import getScrollRtlBehavior from '../core/utils/scroll_rtl_behavior';

import SelectBox from './select_box';
import { BindableTemplate } from '../core/templates/bindable_template';
import { allowScroll } from './text_box/utils.scroll';

// STYLE tagBox

const TAGBOX_TAG_DATA_KEY = 'dxTagData';

const TAGBOX_CLASS = 'dx-tagbox';
const TAGBOX_TAG_CONTAINER_CLASS = 'dx-tag-container';
const TAGBOX_TAG_CLASS = 'dx-tag';
const TAGBOX_MULTI_TAG_CLASS = 'dx-tagbox-multi-tag';
const TAGBOX_CUSTOM_TAG_CLASS = 'dx-tag-custom';
const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';
const TAGBOX_ONLY_SELECT_CLASS = 'dx-tagbox-only-select';
const TAGBOX_SINGLE_LINE_CLASS = 'dx-tagbox-single-line';
const TAGBOX_POPUP_WRAPPER_CLASS = 'dx-tagbox-popup-wrapper';
const TAGBOX_TAG_CONTENT_CLASS = 'dx-tag-content';
const TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = 'dx-tagbox-default-template';
const TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = 'dx-tagbox-custom-template';
const NATIVE_CLICK_CLASS = 'dx-native-click';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';

const TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;

const TagBox = SelectBox.inherit({

    _supportedKeys: function() {
        const parent = this.callBase();
        const sendToList = options => this._list._keyboardHandler(options);

        return extend({}, parent, {
            backspace: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                this._processKeyboardEvent(e);
                this._isTagRemoved = true;

                const $tagToDelete = this._$focusedTag || this._tagElements().last();

                if(this._$focusedTag) {
                    this._moveTagFocus('prev', true);
                }

                if($tagToDelete.length === 0) {
                    return;
                }

                this._preserveFocusedTag = true;
                this._removeTagElement($tagToDelete);
                delete this._preserveFocusedTag;
            },
            upArrow: (e, opts) => {
                return e.altKey || !this._list ? parent.upArrow.call(this, e) : sendToList(opts);
            },
            downArrow: (e, opts) => {
                return e.altKey || !this._list ? parent.downArrow.call(this, e) : sendToList(opts);
            },
            del: function(e) {
                if(!this._$focusedTag || !this._isCaretAtTheStart()) {
                    return;
                }

                this._processKeyboardEvent(e);
                this._isTagRemoved = true;

                const $tagToDelete = this._$focusedTag;

                this._moveTagFocus('next', true);

                this._preserveFocusedTag = true;
                this._removeTagElement($tagToDelete);
                delete this._preserveFocusedTag;
            },
            enter: function(e, options) {
                const isListItemFocused = this._list && this._list.option('focusedElement') !== null;
                const isCustomItem = this.option('acceptCustomValue') && !isListItemFocused;

                if(isCustomItem) {
                    e.preventDefault();
                    (this._searchValue() !== '') && this._customItemAddedHandler(e);
                    return;
                }

                if(this.option('opened')) {
                    this._saveValueChangeEvent(e);
                    sendToList(options);
                    e.preventDefault();
                }
            },
            space: function(e, options) {
                const isOpened = this.option('opened');
                const isInputActive = this._shouldRenderSearchEvent();

                if(isOpened && !isInputActive) {
                    this._saveValueChangeEvent(e);
                    sendToList(options);
                    e.preventDefault();
                }
            },
            leftArrow: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                const rtlEnabled = this.option('rtlEnabled');

                if(this._isEditable() && rtlEnabled && !this._$focusedTag) {
                    return;
                }

                e.preventDefault();

                const direction = rtlEnabled ? 'next' : 'prev';
                this._moveTagFocus(direction);
                !this.option('multiline') && this._scrollContainer(direction);
            },
            rightArrow: function(e) {
                if(!this._isCaretAtTheStart()) {
                    return;
                }

                const rtlEnabled = this.option('rtlEnabled');

                if(this._isEditable() && !rtlEnabled && !this._$focusedTag) {
                    return;
                }

                e.preventDefault();

                const direction = rtlEnabled ? 'prev' : 'next';
                this._moveTagFocus(direction);
                !this.option('multiline') && this._scrollContainer(direction);
            }
        });
    },

    _processKeyboardEvent: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this._saveValueChangeEvent(e);
    },

    _updateTagsContainer: function($element) {
        this._$tagsContainer = $element
            .addClass(TAGBOX_TAG_CONTAINER_CLASS)
            .addClass(NATIVE_CLICK_CLASS);
        this._$tagsContainer.parent().addClass(NATIVE_CLICK_CLASS);
    },

    _allowSelectItemByTab: function() {
        return false;
    },

    _isCaretAtTheStart: function() {
        const position = caret(this._input());
        return position.start === 0 && position.end === 0;
    },

    _moveTagFocus: function(direction, clearOnBoundary) {
        if(!this._$focusedTag) {
            const tagElements = this._tagElements();
            this._$focusedTag = direction === 'next' ? tagElements.first() : tagElements.last();
            this._toggleFocusClass(true, this._$focusedTag);
            return;
        }

        const $nextFocusedTag = this._$focusedTag[direction](`.${TAGBOX_TAG_CLASS}`);

        if($nextFocusedTag.length > 0) {
            this._replaceFocusedTag($nextFocusedTag);
        } else if(clearOnBoundary || (direction === 'next' && this._isEditable())) {
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
        if(this.option('multiline') || !hasWindow()) {
            return;
        }

        if(!this._$tagsContainer) {
            return;
        }

        const scrollPosition = this._getScrollPosition(direction);
        this._$tagsContainer.scrollLeft(scrollPosition);
    },

    _getScrollPosition: function(direction) {
        if(direction === 'start' || direction === 'end') {
            return this._getBorderPosition(direction);
        }

        return this._$focusedTag
            ? this._getFocusedTagPosition(direction)
            : this._getBorderPosition('end');
    },

    _getBorderPosition: function(direction) {
        const rtlEnabled = this.option('rtlEnabled');
        const isScrollLeft = (direction === 'end') ^ rtlEnabled;

        const scrollBehavior = getScrollRtlBehavior();
        const isScrollInverted = rtlEnabled && (scrollBehavior.decreasing ^ scrollBehavior.positive);
        const scrollSign = !rtlEnabled || scrollBehavior.positive ? 1 : -1;

        return (isScrollLeft ^ !isScrollInverted)
            ? 0
            : scrollSign * (this._$tagsContainer.get(0).scrollWidth - this._$tagsContainer.outerWidth());
    },

    _getFocusedTagPosition: function(direction) {
        const rtlEnabled = this.option('rtlEnabled');
        const isScrollLeft = (direction === 'next') ^ rtlEnabled;
        let { left: scrollOffset } = this._$focusedTag.position();
        let scrollLeft = this._$tagsContainer.scrollLeft();

        if(isScrollLeft) {
            scrollOffset += this._$focusedTag.outerWidth(true) - this._$tagsContainer.outerWidth();
        }

        if(isScrollLeft ^ (scrollOffset < 0)) {
            const scrollBehavior = getScrollRtlBehavior();
            const scrollCorrection = rtlEnabled && !scrollBehavior.decreasing && scrollBehavior.positive ? -1 : 1;
            scrollLeft += scrollOffset * scrollCorrection;
        }

        return scrollLeft;
    },

    _setNextValue: noop,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: [],

            showDropDownButton: false,

            maxFilterLength: 1500,

            tagTemplate: 'tag',

            selectAllText: messageLocalization.format('dxList-selectAll'),

            hideSelectedItems: false,

            selectedItems: [],

            selectAllMode: 'page',

            onSelectAllValueChanged: null,

            maxDisplayedTags: undefined,

            showMultiTagOnly: true,

            onMultiTagPreparing: null,

            multiline: true,

            /**
             * @name dxTagBoxOptions.useSubmitBehavior
             * @type boolean
             * @default true
             * @hidden
             */
            useSubmitBehavior: true,


            /**
            * @name dxTagBoxOptions.closeAction
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.hiddenAction
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.itemRender
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.openAction
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.shownAction
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.valueChangeEvent
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.onCopy
            * @hidden
            * @action
            */

            /**
            * @name dxTagBoxOptions.onCut
            * @hidden
            * @action
            */

            /**
            * @name dxTagBoxOptions.onPaste
            * @hidden
            * @action
            */

            /**
            * @name dxTagBoxOptions.spellcheck
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.displayValue
            * @hidden
            */

            /**
            * @name dxTagBoxOptions.selectedItem
            * @hidden
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
        this._multiTagPreparingAction = this._createActionByOption('onMultiTagPreparing', {
            beforeExecute: (function(e) {
                this._multiTagPreparingHandler(e.args[0]);
            }).bind(this),
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _multiTagPreparingHandler: function(args) {
        const { length: selectedCount } = this._getValue();

        if(!this.option('showMultiTagOnly')) {
            args.text = messageLocalization.getFormatter('dxTagBox-moreSelected')(selectedCount - this.option('maxDisplayedTags') + 1);
        } else {
            args.text = messageLocalization.getFormatter('dxTagBox-selected')(selectedCount);
        }
    },

    _initDynamicTemplates: function() {
        this.callBase();

        this._templateManager.addDefaultTemplates({
            tag: new BindableTemplate(($container, data) => {
                const $tagContent = $('<div>').addClass(TAGBOX_TAG_CONTENT_CLASS);

                $('<span>')
                    .text(data.text || data)
                    .appendTo($tagContent);

                $('<div>')
                    .addClass(TAGBOX_TAG_REMOVE_BUTTON_CLASS)
                    .appendTo($tagContent);

                $container.append($tagContent);
            }, ['text'], this.option('integrationOptions.watchMethod'), {
                'text': this._displayGetter
            })
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
        if(!this.option('useSubmitBehavior')) {
            return;
        }

        this._$submitElement = $('<select>')
            .attr('multiple', 'multiple')
            .css('display', 'none')
            .appendTo(this.$element());
    },

    _setSubmitValue: function() {
        if(!this.option('useSubmitBehavior')) {
            return;
        }

        const value = this._getValue();
        const $options = [];

        for(let i = 0, n = value.length; i < n; i++) {
            const useDisplayText = this._shouldUseDisplayValue(value[i]);

            $options.push(
                $('<option>')
                    .val(useDisplayText ? this._displayGetter(value[i]) : value[i])
                    .attr('selected', 'selected')
            );
        }

        this._getSubmitElement()
            .empty()
            .append($options);
    },

    _initMarkup: function() {
        this._tagElementsCache = $();
        const isSingleLineMode = !this.option('multiline');

        this.$element()
            .addClass(TAGBOX_CLASS)
            .toggleClass(TAGBOX_ONLY_SELECT_CLASS, !(this.option('searchEnabled') || this.option('acceptCustomValue')))
            .toggleClass(TAGBOX_SINGLE_LINE_CLASS, isSingleLineMode);

        // TODO: texteditor render methods order research
        this._initTagTemplate();

        this.callBase();
    },

    _render: function() {
        this.callBase();

        this._renderTagRemoveAction();
        this._renderSingleLineScroll();
        this._scrollContainer('start');
    },

    _initTagTemplate: function() {
        this._tagTemplate = this._getTemplateByOption('tagTemplate');
    },

    _renderField: function() {
        const isDefaultFieldTemplate = !isDefined(this.option('fieldTemplate'));

        this.$element()
            .toggleClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS, isDefaultFieldTemplate)
            .toggleClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS, !isDefaultFieldTemplate);

        this.callBase();
    },

    _renderTagRemoveAction: function() {
        const tagRemoveAction = this._createAction(this._removeTagHandler.bind(this));
        const eventName = addNamespace(clickEvent, 'dxTagBoxTagRemove');

        eventsEngine.off(this._$tagsContainer, eventName);
        eventsEngine.on(this._$tagsContainer, eventName, `.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`, (event) => {
            tagRemoveAction({ event });
        });

        this._renderTypingEvent();
    },

    _renderSingleLineScroll: function() {
        const mouseWheelEvent = addNamespace('dxmousewheel', this.NAME);
        const $element = this.$element();
        const isMultiline = this.option('multiline');

        eventsEngine.off($element, mouseWheelEvent);

        if(devices.real().deviceType !== 'desktop') {
            this._$tagsContainer && this._$tagsContainer.css('overflowX', isMultiline ? '' : 'auto');
            return;
        }

        if(isMultiline) {
            return;
        }

        eventsEngine.on($element, mouseWheelEvent, this._tagContainerMouseWheelHandler.bind(this));
    },

    _tagContainerMouseWheelHandler: function(e) {
        const scrollLeft = this._$tagsContainer.scrollLeft();
        const delta = e.delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER;

        if(allowScroll(this._$tagsContainer, delta, true)) {
            this._$tagsContainer.scrollLeft(scrollLeft + delta);
            return false;
        }
    },

    _renderTypingEvent: function() {
        eventsEngine.on(this._input(), addNamespace('keydown', this.NAME), (e) => {
            const keyName = normalizeKeyName(e);
            if(!this._isControlKey(keyName) && this._isEditable()) {
                this._clearTagFocus();
            }
        });
    },

    _popupWrapperClass: function() {
        return this.callBase() + ' ' + TAGBOX_POPUP_WRAPPER_CLASS;
    },

    _renderInput: function() {
        this.callBase();
        this._renderPreventBlur(this._inputWrapper());
    },

    _renderInputValueImpl: function() {
        return this._renderMultiSelect();
    },

    _loadInputValue: function() {
        return when();
    },

    _clearTextValue: function() {
        this._input().val('');
        this._toggleEmptinessEventHandler();
    },

    _focusInHandler: function(e) {
        if(!this._preventNestedFocusEvent(e)) {
            this._scrollContainer('end');
        }

        this.callBase(e);
    },

    _restoreInputText: function(saveEditingValue) {
        if(!saveEditingValue) {
            this._clearTextValue();
        }
    },

    _focusOutHandler: function(e) {
        if(!this._preventNestedFocusEvent(e)) {
            this._clearTagFocus();
            this._scrollContainer('start');
        }

        this.callBase(e);
    },

    _getFirstPopupElement: function() {
        return this.option('showSelectionControls')
            ? this._list.$element()
            : this.callBase();
    },

    _initSelectAllValueChangedAction: function() {
        this._selectAllValueChangeAction = this._createActionByOption('onSelectAllValueChanged');
    },

    _renderList: function() {
        this.callBase();
        this._setListDataSourceFilter();

        if(this.option('showSelectionControls')) {
            this._list.registerKeyHandler('tab', (e) => this._popupElementTabHandler(e));
            this._list.registerKeyHandler('escape', (e) => this._popupElementEscHandler(e));
        }
    },

    _canListHaveFocus: function() {
        return this.option('applyValueMode') === 'useButtons';
    },

    _listConfig: function() {
        const selectionMode = this.option('showSelectionControls') ? 'all' : 'multiple';

        return extend(this.callBase(), {
            selectionMode: selectionMode,
            selectAllText: this.option('selectAllText'),
            onSelectAllValueChanged: ({ value }) => {
                this._selectAllValueChangeAction({ value });
            },
            selectAllMode: this.option('selectAllMode'),
            selectedItems: this._selectedItems,
            onFocusedItemChanged: null
        });
    },

    _renderMultiSelect: function() {
        const d = new Deferred();

        this._updateTagsContainer(this._$textEditorInputContainer);
        this._renderInputSize();
        this._renderTags()
            .done(() => {
                this._popup && this._popup.refreshPosition();
                d.resolve();
            })
            .fail(d.reject);

        return d.promise();
    },

    _listItemClickHandler: function(e) {
        !this.option('showSelectionControls') && this._clearTextValue();

        if(this.option('applyValueMode') === 'useButtons') {
            return;
        }

        this.callBase(e);
        this._saveValueChangeEvent(undefined);
    },

    _shouldClearFilter: function() {
        const shouldClearFilter = this.callBase();
        const showSelectionControls = this.option('showSelectionControls');

        return !showSelectionControls && shouldClearFilter;
    },

    _renderInputSize: function() {
        const $input = this._input();
        const value = $input.val();
        const isEmptyInput = isString(value) && value;
        const cursorWidth = 5;
        let width = '';
        let size = '';
        const canTypeText = this.option('searchEnabled') || this.option('acceptCustomValue');
        if(isEmptyInput && canTypeText) {
            const $calculationElement = createTextElementHiddenCopy($input, value, { includePaddings: true });

            $calculationElement.insertAfter($input);
            width = $calculationElement.outerWidth() + cursorWidth;

            $calculationElement.remove();
        } else if(!value) {
            size = 1;
        }

        $input.css('width', width);
        $input.attr('size', size);
    },

    _renderInputSubstitution: function() {
        this.callBase();
        this._renderInputSize();
    },

    _getValue: function() {
        return this.option('value') || [];
    },

    _multiTagRequired: function() {
        const values = this._getValue();
        const maxDisplayedTags = this.option('maxDisplayedTags');

        return isDefined(maxDisplayedTags) && values.length > maxDisplayedTags;
    },

    _renderMultiTag: function($input) {
        const $tag = $('<div>')
            .addClass(TAGBOX_TAG_CLASS)
            .addClass(TAGBOX_MULTI_TAG_CLASS);

        const args = {
            multiTagElement: getPublicElement($tag),
            selectedItems: this.option('selectedItems')
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
        const creator = new FilterCreator(values);

        const selectedItems = (this._list && this._list.option('selectedItems')) || this.option('selectedItems');
        const clientFilterFunction = creator.getLocalFilter(this._valueGetter);
        const filteredItems = selectedItems.filter(clientFilterFunction);
        const selectedItemsAlreadyLoaded = filteredItems.length === values.length;
        const d = new Deferred();

        if(!this._isDataSourceChanged && selectedItemsAlreadyLoaded) {
            return d.resolve(filteredItems).promise();
        } else {
            const dataSource = this._dataSource;
            const dataSourceFilter = dataSource.filter();
            const filterExpr = creator.getCombinedFilter(this.option('valueExpr'), dataSourceFilter);
            const filterLength = encodeURI(JSON.stringify(filterExpr)).length;
            const filter = filterLength > this.option('maxFilterLength') ? undefined : filterExpr;
            const { customQueryParams, expand } = dataSource.loadOptions();

            dataSource
                .store()
                .load({ filter, customQueryParams, expand })
                .done((data, extra) => {
                    this._isDataSourceChanged = false;
                    if(this._disposed) {
                        d.reject();
                        return;
                    }

                    const { data: items } = normalizeLoadResult(data, extra);
                    const mappedItems = dataSource._applyMapFunction(items);
                    d.resolve(mappedItems.filter(clientFilterFunction));
                })
                .fail(d.reject);

            return d.promise();
        }
    },

    _createTagsData: function(values, filteredItems) {
        const items = [];
        const cache = {};
        const isValueExprSpecified = this._valueGetterExpr() === 'this';
        const filteredValues = {};

        filteredItems.forEach((filteredItem) => {
            const filteredItemValue = isValueExprSpecified ? JSON.stringify(filteredItem) : this._valueGetter(filteredItem);

            filteredValues[filteredItemValue] = filteredItem;
        });

        const loadItemPromises = [];

        values.forEach((value, index) => {
            const currentItem = filteredValues[isValueExprSpecified ? JSON.stringify(value) : value];

            if(isValueExprSpecified && !isDefined(currentItem)) {
                loadItemPromises.push(this._loadItem(value, cache).always((item) => {
                    const newItem = this._createTagData(items, item, value, index);
                    items.splice(index, 0, newItem);
                }));
            } else {
                const newItem = this._createTagData(items, currentItem, value, index);
                items.splice(index, 0, newItem);
            }
        });

        const d = new Deferred();
        when.apply(this, loadItemPromises).always(function() {
            d.resolve(items);
        });

        return d.promise();
    },

    _createTagData: function(items, item, value, valueIndex) {
        if(isDefined(item)) {
            this._selectedItems.push(item);
            return item;
        } else {
            const selectedItem = this.option('selectedItem');
            const customItem = this._valueGetter(selectedItem) === value ? selectedItem : value;

            return customItem;
        }
    },

    _isGroupedData: function() {
        return this.option('grouped') && !this._dataSource.group();
    },

    _getItemsByValues: function(values) {
        const resultItems = [];
        values.forEach(function(value) {
            const item = this._getItemFromPlain(value);
            if(isDefined(item)) {
                resultItems.push(item);
            }
        }.bind(this));
        return resultItems;
    },

    _getFilteredGroupedItems: function(values) {
        const selectedItems = new Deferred();
        if(!this._dataSource.items().length) {
            this._dataSource.load().done(function() {
                selectedItems.resolve(this._getItemsByValues(values));
            }.bind(this)).fail(selectedItems.resolve([]));
        } else {
            selectedItems.resolve(this._getItemsByValues(values));
        }

        return selectedItems.promise();
    },

    _loadTagsData: function() {
        const values = this._getValue();
        const tagData = new Deferred();

        this._selectedItems = [];

        const filteredItemsPromise = this._isGroupedData() ? this._getFilteredGroupedItems(values) : this._getFilteredItems(values);

        filteredItemsPromise
            .done((filteredItems) => {
                const items = this._createTagsData(values, filteredItems);
                items.always(function(data) {
                    tagData.resolve(data);
                });
            })
            .fail(tagData.reject.bind(this));

        return tagData.promise();
    },

    _renderTags: function() {
        const d = new Deferred();
        let isPlainDataUsed = false;

        if(this._shouldGetItemsFromPlain(this._valuesToUpdate)) {
            this._selectedItems = this._getItemsFromPlain(this._valuesToUpdate);

            if(this._selectedItems.length === this._valuesToUpdate.length) {
                this._renderTagsImpl(this._selectedItems);
                isPlainDataUsed = true;
                d.resolve();
            }
        }

        if(!isPlainDataUsed) {
            this._loadTagsData()
                .done((items) => {
                    if(this._disposed) {
                        d.reject();
                        return;
                    }

                    this._renderTagsImpl(items);
                    d.resolve();
                })
                .fail(d.reject);
        }

        return d.promise();
    },

    _renderTagsImpl: function(items) {
        this._renderTagsCore(items);
        this._renderEmptyState();

        if(!this._preserveFocusedTag) {
            this._clearTagFocus();
        }
    },

    _shouldGetItemsFromPlain: function(values) {
        return values && this._dataSource.isLoaded() && values.length <= this._getPlainItems().length;
    },

    _getItemsFromPlain: function(values) {
        const plainItems = this._getPlainItems();
        const selectedItems = plainItems.filter((dataItem) => {
            let currentValue;
            for(let i = 0; i < values.length; i++) {
                currentValue = values[i];
                if(isObject(currentValue)) {
                    if(this._isValueEquals(dataItem, currentValue)) {
                        return true;
                    }
                } else if(this._isValueEquals(this._valueGetter(dataItem), currentValue)) {
                    return true;
                }
            }

            return false;
        }, this);

        return selectedItems;
    },

    _integrateInput: function() {
        this.callBase();
        this._updateTagsContainer($(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`));
        this._renderTagRemoveAction();
    },

    _renderTagsCore: function(items) {
        this._renderField();

        this.option('selectedItems', this._selectedItems.slice());
        this._cleanTags();

        const $multiTag = this._multiTagRequired() && this._renderMultiTag(this._input());
        const showMultiTagOnly = this.option('showMultiTagOnly');
        const maxDisplayedTags = this.option('maxDisplayedTags');

        items.forEach((item, index) => {
            if(($multiTag && showMultiTagOnly) || ($multiTag && !showMultiTagOnly && index - maxDisplayedTags >= -1)) {
                return false;
            }
            this._renderTag(item, $multiTag || this._input());
        });

        if(this._isFocused()) {
            this._scrollContainer('end');
        }

        this._refreshTagElements();
    },

    _cleanTags: function() {
        if(this._multiTagRequired()) {
            this._tagElements().remove();
        } else {
            const $tags = this._tagElements();
            const values = this._getValue();

            each($tags, function(_, tag) {
                const $tag = $(tag);
                const index = inArray($tag.data(TAGBOX_TAG_DATA_KEY), values);

                if(index < 0) {
                    $tag.remove();
                }
            });
        }
    },

    _renderEmptyState: function() {
        const isEmpty = !(this._getValue().length || this._selectedItems.length || this._searchValue());
        this._toggleEmptiness(isEmpty);
        this._renderDisplayText();
    },

    _renderDisplayText: function() {
        this._renderInputSize();
    },

    _refreshTagElements: function() {
        this._tagElementsCache = this.$element().find(`.${TAGBOX_TAG_CLASS}`);
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
        const value = this._valueGetter(item);

        if(!isDefined(value)) {
            return;
        }

        let $tag = this._getTag(value);
        const displayValue = this._displayGetter(item);
        const itemModel = this._getItemModel(item, displayValue);

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
        if(isObject(item) && displayValue) {
            return item;
        } else {
            return ensureDefined(displayValue, '');
        }
    },

    _getTag: function(value) {
        const $tags = this._tagElements();
        const tagsLength = $tags.length;
        let result = false;

        for(let i = 0; i < tagsLength; i++) {
            const $tag = $tags[i];
            const tagData = elementData($tag, TAGBOX_TAG_DATA_KEY);

            if(value === tagData || (equalByValue(value, tagData))) {
                result = $($tag);
                break;
            }
        }
        return result;
    },

    _createTag: function(value, $input) {
        return $('<div>')
            .addClass(TAGBOX_TAG_CLASS)
            .data(TAGBOX_TAG_DATA_KEY, value)
            .insertBefore($input);
    },

    _toggleEmptinessEventHandler: function() {
        this._toggleEmptiness(!this._getValue().length && !this._searchValue().length);
    },

    _customItemAddedHandler: function(e) {
        this.callBase(e);
        this._input().val('');
    },

    _removeTagHandler: function(args) {
        const e = args.event;

        e.stopPropagation();
        this._saveValueChangeEvent(e);

        const $tag = $(e.target).closest(`.${TAGBOX_TAG_CLASS}`);
        this._removeTagElement($tag);
    },

    _removeTagElement: function($tag) {
        if($tag.hasClass(TAGBOX_MULTI_TAG_CLASS)) {
            if(!this.option('showMultiTagOnly')) {
                this.option('value', this._getValue().slice(0, this.option('maxDisplayedTags')));
            } else {
                this.reset();
            }
            return;
        }

        const itemValue = $tag.data(TAGBOX_TAG_DATA_KEY);
        this._removeTagWithUpdate(itemValue);
        this._refreshTagElements();
    },

    _updateField: noop,

    _removeTagWithUpdate: function(itemValue) {
        const value = this._getValue().slice();
        this._removeTag(value, itemValue);
        this.option('value', value);

        if(value.length === 0) {
            this._clearTagFocus();
        }
    },

    _getCurrentValue: function() {
        return this._lastValue();
    },

    _selectionChangeHandler: function(e) {
        if(this.option('applyValueMode') === 'useButtons') {
            return;
        }

        const value = this._getValue().slice();

        each(e.removedItems || [], (_, removedItem) => {
            this._removeTag(value, this._valueGetter(removedItem));
        });

        each(e.addedItems || [], (_, addedItem) => {
            this._addTag(value, this._valueGetter(addedItem));
        });

        this._updateWidgetHeight();

        if(!equalByValue(this._list.option('selectedItemKeys'), this.option('value'))) {
            const listSelectionChangeEvent = this._list._getSelectionChangeEvent();
            listSelectionChangeEvent && this._saveValueChangeEvent(listSelectionChangeEvent);
            this.option('value', value);
        }
        this._list._saveSelectionChangeEvent(undefined);
    },

    _removeTag: function(value, item) {
        const index = this._valueIndex(item, value);

        if(index >= 0) {
            value.splice(index, 1);
        }
    },

    _addTag: function(value, item) {
        const index = this._valueIndex(item);

        if(index < 0) {
            value.push(item);
        }
    },

    _fieldRenderData: function() {
        return this._selectedItems.slice();
    },

    _completeSelection: function(value) {
        if(!this.option('showSelectionControls')) {
            this._setValue(value);
        }
    },


    _setValue: function(value) {
        if(value === null) {
            return;
        }

        const useButtons = this.option('applyValueMode') === 'useButtons';
        const valueIndex = this._valueIndex(value);
        const values = (useButtons ? this._list.option('selectedItemKeys') : this._getValue()).slice();

        if(valueIndex >= 0) {
            values.splice(valueIndex, 1);
        } else {
            values.push(value);
        }

        if(this.option('applyValueMode') === 'useButtons') {
            this._list.option('selectedItemKeys', values);
        } else {
            this.option('value', values);
        }
    },

    _isSelectedValue: function(value, cache) {
        return this._valueIndex(value, null, cache) > -1;
    },

    _valueIndex: function(value, values, cache) {
        let result = -1;

        if(cache && typeof value !== 'object') {
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


        each(values, (index, selectedValue) => {
            if(this._isValueEquals(value, selectedValue)) {
                result = index;
                return false;
            }
        });

        return result;
    },

    _lastValue: function() {
        const values = this._getValue();
        const lastValue = values[values.length - 1];
        return isDefined(lastValue) ? lastValue : null;
    },

    _valueChangeEventHandler: noop,

    _shouldRenderSearchEvent: function() {
        return this.option('searchEnabled') || this.option('acceptCustomValue');
    },

    _searchHandler: function(e) {
        if(this.option('searchEnabled') && !!e && !this._isTagRemoved) {
            this.callBase(e);
            this._setListDataSourceFilter();
        }

        this._updateWidgetHeight();
        delete this._isTagRemoved;
    },

    _updateWidgetHeight: function() {
        const element = this.$element();
        const originalHeight = element.height();

        this._renderInputSize();

        const currentHeight = element.height();

        if(this._popup && this.option('opened') && this._isEditable() && currentHeight !== originalHeight) {
            this._popup.repaint();
        }
    },

    _refreshSelected: function() {
        this._list?.getDataSource() && this._list.option('selectedItems', this._selectedItems);
    },

    _resetListDataSourceFilter: function() {
        const dataSource = this._getDataSource();

        if(!dataSource) {
            return;
        }

        delete this._userFilter;

        dataSource.filter(null);
        dataSource.reload();
    },

    _setListDataSourceFilter: function() {
        if(!this.option('hideSelectedItems') || !this._list) {
            return;
        }

        const dataSource = this._getDataSource();

        if(!dataSource) {
            return;
        }

        const valueGetterExpr = this._valueGetterExpr();

        if(isString(valueGetterExpr) && valueGetterExpr !== 'this') {
            const filter = this._dataSourceFilterExpr();

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
        const filter = [];

        each(this._getValue(), (index, value) => {
            filter.push(['!', [this._valueGetterExpr(), value]]);
        });

        return filter;
    },

    _dataSourceFilterFunction: function(itemData) {
        const itemValue = this._valueGetter(itemData);
        let result = true;

        each(this._getValue(), (index, value) => {
            if(this._isValueEquals(value, itemValue)) {
                result = false;
                return false;
            }
        });

        return result;

    },

    _dataSourceChangedHandler: function() {
        if(this._list) {
            this._isDataSourceChanged = true;
        }
        this.callBase.apply(this, arguments);
    },

    _applyButtonHandler: function() {
        this.option('value', this._getSortedListValues());
        this._clearTextValue();
        this._clearFilter();
        this.callBase();
    },

    _getSortedListValues: function() {
        const listValues = this._getListValues();
        const currentValue = this.option('value') || [];
        const existedItems = listValues.length ? currentValue.filter(item => listValues.indexOf(item) !== -1) : [];
        const newItems = existedItems.length ? listValues.filter(item => currentValue.indexOf(item) === -1) : listValues;

        return existedItems.concat(newItems);
    },

    _getListValues: function() {
        if(!this._list) {
            return [];
        }

        const selectedItems = this._getPlainItems(this._list.option('selectedItems'));
        const result = [];

        each(selectedItems, (index, item) => {
            result[index] = this._valueGetter(item);
        });

        return result;
    },

    _setListDataSource: function() {
        const currentValue = this._getValue();
        this.callBase();
        if(currentValue !== this.option('value')) {
            this.option('value', currentValue);
        }
        this._refreshSelected();
    },

    _renderOpenedState: function() {
        this.callBase();

        if(this.option('applyValueMode') === 'useButtons' && !this.option('opened')) {
            this._refreshSelected();
        }
    },

    reset: function() {
        this._restoreInputText();
        const defaultValue = this._getDefaultOptions().value;
        const currentValue = this.option('value');
        if(defaultValue && defaultValue.length === 0 && currentValue && defaultValue.length === currentValue.length) {
            return;
        }
        this.callBase();
    },

    _clean: function() {
        this.callBase();
        delete this._defaultTagTemplate;
        delete this._valuesToUpdate;
        delete this._tagTemplate;
    },

    _removeDuplicates: function(from, what) {
        const result = [];

        each(from, (_, value) => {
            const filteredItems = what.filter((item) => {
                return this._valueGetter(value) === this._valueGetter(item);
            });

            if(!filteredItems.length) {
                result.push(value);
            }
        });

        return result;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onSelectAllValueChanged':
                this._initSelectAllValueChangedAction();
                break;
            case 'onMultiTagPreparing':
                this._initMultiTagPreparingAction();
                this._renderTags();
                break;
            case 'hideSelectedItems':
                if(args.value) {
                    this._setListDataSourceFilter();
                } else {
                    this._resetListDataSourceFilter();
                }
                break;
            case 'useSubmitBehavior':
                this._toggleSubmitElement(args.value);
                break;
            case 'displayExpr':
                this.callBase(args);
                this._initTemplates();
                this._invalidate();
                break;
            case 'tagTemplate':
                this._initTagTemplate();
                this._invalidate();
                break;
            case 'selectAllText':
                this._setListOption('selectAllText', this.option('selectAllText'));
                break;
            case 'value':
                this._valuesToUpdate = args?.value;
                this.callBase(args);
                this._valuesToUpdate = undefined;
                this._setListDataSourceFilter();
                break;
            case 'maxDisplayedTags':
            case 'showMultiTagOnly':
                this._renderTags();
                break;
            case 'selectAllMode':
                this._setListOption(args.name, args.value);
                break;
            case 'selectedItem':
                break;
            case 'selectedItems':
                this._selectionChangedAction({
                    addedItems: this._removeDuplicates(args.value, args.previousValue),
                    removedItems: this._removeDuplicates(args.previousValue, args.value)
                });
                break;
            case 'multiline':
                this.$element().toggleClass(TAGBOX_SINGLE_LINE_CLASS, !args.value);
                this._renderSingleLineScroll();
                break;
            case 'maxFilterLength':
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
    }
});

registerComponent('dxTagBox', TagBox);

export default TagBox;
