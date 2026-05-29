/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { name as clickEvent } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import { normalizeLoadResult } from '@js/common/data/data_source/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { getIntersection, removeDuplicates } from '@js/core/utils/array';
import { ensureDefined, equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { createTextElementHiddenCopy } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { SelectionFilterCreator as FilterCreator } from '@js/core/utils/selection_filter';
import { getHeight, getOuterWidth } from '@js/core/utils/size';
import { isDefined, isObject, isString } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/tag_box';
import errors from '@js/ui/widget/ui.errors';
import SelectBox from '@ts/ui/m_select_box';
import caret from '@ts/ui/text_box/utils.caret';
import { allowScroll } from '@ts/ui/text_box/utils.scroll';

function xor(a: boolean, b: boolean): boolean {
  return (a || b) && !(a && b);
}

type TagBoxItem = string | number | any;
type SelectedItemsMap = Record<string, TagBoxItem>;

const TAGBOX_TAG_DATA_KEY = 'dxTagData';
const TAGBOX_TAG_DISPLAY_VALUE = 'dxTagDisplayValue';

const TAGBOX_CLASS = 'dx-tagbox';
const TAGBOX_TAG_CONTAINER_CLASS = 'dx-tag-container';
const TAGBOX_TAG_CLASS = 'dx-tag';
const TAGBOX_MULTI_TAG_CLASS = 'dx-tagbox-multi-tag';
const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';
const TAGBOX_ONLY_SELECT_CLASS = 'dx-tagbox-only-select';
const TAGBOX_SINGLE_LINE_CLASS = 'dx-tagbox-single-line';
const TAGBOX_POPUP_WRAPPER_CLASS = 'dx-tagbox-popup-wrapper';
const TAGBOX_TAG_CONTENT_CLASS = 'dx-tag-content';
const TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = 'dx-tagbox-default-template';
const TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = 'dx-tagbox-custom-template';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';

const TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;

export interface TagBoxProperties extends Omit<
  Properties,
  'onCustomItemCreating'
  | 'onItemClick' | 'onSelectionChanged'
  | 'onOpened' | 'onClosed'
  | 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
  | 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
}

class TagBox<
  TProperties extends TagBoxProperties = TagBoxProperties,
> extends SelectBox<TProperties> {
  _$focusedTag?: dxElementWrapper;

  _$tagsContainer!: dxElementWrapper;

  _loadFilteredItemsPromise?: DeferredObj<unknown>;

  _filteredGroupedItemsLoadPromise?: DeferredObj<unknown>;

  _selectAllValueChangeAction?: (event?: Record<string, unknown>) => void;

  _multiTagPreparingAction?: (event?: Record<string, unknown>) => void;

  _valuesToUpdate?: any;

  _preserveFocusedTag?: boolean;

  _isTagRemoved?: boolean;

  _userFilter?: any;

  _isDataSourceChanged?: boolean;

  _tagTemplate?: any;

  _isDataSourceOptionChanged?: boolean;

  _tagElementsCache?: dxElementWrapper;

  _selectedItems?: any[];

  _tagsToRender?: any[];

  _supportedKeys(): Record<
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    string, (e: KeyboardEvent, options?: Record<string, unknown>) => boolean | void
  > {
    const parent = super._supportedKeys();
    // @ts-expect-error ts-error
    const sendToList = (options) => this._list._keyboardHandler(options);
    const rtlEnabled = this.option('rtlEnabled');

    return {
      ...parent,
      backspace(e): void {
        if (!this._isCaretAtTheStart()) {
          return;
        }

        this._processKeyboardEvent(e);
        this._isTagRemoved = true;

        const $tagToDelete = this._$focusedTag || this._tagElements().last();

        if (this._$focusedTag) {
          this._moveTagFocus('prev', true);
        }

        if ($tagToDelete.length === 0) {
          return;
        }

        this._preserveFocusedTag = true;
        this._removeTagElement($tagToDelete);
        delete this._preserveFocusedTag;
      },
      upArrow: (e, opts) => (e.altKey || !this._list ? parent.upArrow.call(this, e) : sendToList(opts)),
      downArrow: (e, opts) => (e.altKey || !this._list ? parent.downArrow.call(this, e) : sendToList(opts)),
      del(e) {
        if (!this._$focusedTag || !this._isCaretAtTheStart()) {
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
      enter(e, options): void {
        const isListItemFocused = this._list?.option('focusedElement') !== null && this.option('opened') === true;
        const isCustomItem = this.option('acceptCustomValue') && !isListItemFocused;

        if (isCustomItem) {
          e.preventDefault();
          (this._searchValue() !== '') && this._customItemAddedHandler(e);
          return;
        }

        if (this.option('opened')) {
          this._saveValueChangeEvent(e);
          sendToList(options);
          e.preventDefault();
        }
      },
      space(e, options): void {
        const isOpened = this.option('opened');
        const isInputActive = this._shouldRenderSearchEvent();

        if (isOpened && !isInputActive) {
          this._saveValueChangeEvent(e);
          sendToList(options);
          e.preventDefault();
        }
      },
      leftArrow(e): void {
        if (
          !this._isCaretAtTheStart()
            || this._isEmpty()
            || this._isEditable() && rtlEnabled && !this._$focusedTag
        ) {
          return;
        }

        e.preventDefault();

        const direction = rtlEnabled ? 'next' : 'prev';
        this._moveTagFocus(direction);

        if (!this.option('multiline')) {
          this._scrollContainer(direction);
        }
      },
      rightArrow(e): void {
        if (!this._isCaretAtTheStart()
          || this._isEmpty()
          || this._isEditable() && !rtlEnabled && !this._$focusedTag
        ) {
          return;
        }

        e.preventDefault();

        const direction = rtlEnabled ? 'prev' : 'next';
        this._moveTagFocus(direction);
        !this.option('multiline') && this._scrollContainer(direction);
      },
    };
  }

  _processKeyboardEvent(e): void {
    e.preventDefault();
    e.stopPropagation();
    this._saveValueChangeEvent(e);
  }

  _isEmpty(): boolean {
    return this._getValue().length === 0;
  }

  _updateTagsContainer($element: dxElementWrapper | null | undefined): void {
    if (!$element) {
      return;
    }

    this._$tagsContainer = $element.addClass(TAGBOX_TAG_CONTAINER_CLASS);
  }

  // eslint-disable-next-line class-methods-use-this
  _allowSelectItemByTab(): boolean {
    return false;
  }

  _isCaretAtTheStart(): boolean {
    const position = caret(this._input());
    return position?.start === 0 && position.end === 0;
  }

  _updateInputAriaActiveDescendant(id?): void {
    this.setAria('activedescendant', id, this._input());
  }

  _moveTagFocus(direction: 'prev' | 'next', clearOnBoundary?: boolean): void {
    if (!this._$focusedTag) {
      const tagElements = this._tagElements();

      this._$focusedTag = direction === 'next' ? tagElements.first() : tagElements.last();

      this._toggleFocusClass(true, this._$focusedTag);
      this._updateInputAriaActiveDescendant(this._$focusedTag.attr('id'));
      return;
    }

    const $nextFocusedTag = this._$focusedTag[direction](`.${TAGBOX_TAG_CLASS}`);

    if ($nextFocusedTag.length > 0) {
      this._replaceFocusedTag($nextFocusedTag);
      this._updateInputAriaActiveDescendant($nextFocusedTag.attr('id'));
    } else if (clearOnBoundary || (direction === 'next' && this._isEditable())) {
      this._clearTagFocus();
      this._updateInputAriaActiveDescendant();
    }
  }

  _replaceFocusedTag($nextFocusedTag: dxElementWrapper): void {
    this._toggleFocusClass(false, this._$focusedTag);
    this._$focusedTag = $nextFocusedTag;
    this._toggleFocusClass(true, this._$focusedTag);
  }

  _clearTagFocus(): void {
    if (!this._$focusedTag) {
      return;
    }

    this._toggleFocusClass(false, this._$focusedTag);
    this._updateInputAriaActiveDescendant();
    delete this._$focusedTag;
  }

  _focusClassTarget($element: dxElementWrapper): dxElementWrapper {
    if ($element && $element.length && $element[0] !== this._focusTarget()[0]) {
      return $element;
    }

    return super._focusClassTarget();
  }

  _getLabelContainer(): dxElementWrapper {
    return this._$tagsContainer;
  }

  _getFieldElement() {
    return this._input();
  }

  _scrollContainer(direction: 'start' | 'end'): void {
    if (this.option('multiline') || !hasWindow()) {
      return;
    }

    if (!this._$tagsContainer) {
      return;
    }

    const scrollPosition = this._getScrollPosition(direction);
    // @ts-expect-error ts-error
    this._$tagsContainer.scrollLeft(scrollPosition);
  }

  _getScrollPosition(direction) {
    if (direction === 'start' || direction === 'end') {
      return this._getBorderPosition(direction);
    }

    return this._$focusedTag
      ? this._getFocusedTagPosition(direction)
      : this._getBorderPosition('end');
  }

  _getBorderPosition(direction): number {
    const { rtlEnabled } = this.option();
    // @ts-expect-error ts-error
    const isScrollLeft = xor(direction === 'end', rtlEnabled);

    const scrollSign = rtlEnabled ? -1 : 1;

    return xor(isScrollLeft, !rtlEnabled)
      ? 0
      : scrollSign * (this._$tagsContainer.get(0).scrollWidth - getOuterWidth(this._$tagsContainer));
  }

  _getFocusedTagPosition(direction) {
    const rtlEnabled = this.option('rtlEnabled');
    // @ts-expect-error ts-error
    const isScrollLeft = xor(direction === 'next', rtlEnabled);
    // @ts-expect-error ts-error
    let { left: scrollOffset } = this._$focusedTag.position();
    let scrollLeft = this._$tagsContainer.scrollLeft();

    if (isScrollLeft) {
      scrollOffset += getOuterWidth(this._$focusedTag, true) - getOuterWidth(this._$tagsContainer);
    }

    if (xor(isScrollLeft, scrollOffset < 0)) {
      scrollLeft += scrollOffset;
    }

    return scrollLeft;
  }

  // eslint-disable-next-line class-methods-use-this
  _setNextValue(): void {}

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      value: [],

      showDropDownButton: false,

      maxFilterQueryLength: 1500,

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

      useSubmitBehavior: true,

    });
  }

  _init(): void {
    super._init();
    this._selectedItems = [];

    this._initSelectAllValueChangedAction();
  }

  _initActions(): void {
    super._initActions();
    this._initMultiTagPreparingAction();
  }

  _initMultiTagPreparingAction() {
    this._multiTagPreparingAction = this._createActionByOption('onMultiTagPreparing', {
      beforeExecute: (e) => {
        // @ts-expect-error ts-error
        this._multiTagPreparingHandler(e.args[0]);
      },
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _multiTagPreparingHandler(args) {
    const { length: selectedCount } = this._getValue();

    if (!this.option('showMultiTagOnly')) {
      // @ts-expect-error ts-error
      args.text = messageLocalization.getFormatter('dxTagBox-moreSelected')(selectedCount - this.option('maxDisplayedTags') + 1);
    } else {
      // @ts-expect-error ts-error
      args.text = messageLocalization.getFormatter('dxTagBox-selected')(selectedCount);
    }
  }

  _initDynamicTemplates(): void {
    // @ts-expect-error ts-error
    super._initDynamicTemplates();

    this._templateManager.addDefaultTemplates({
      tag: new BindableTemplate(($container, data) => {
        const $tagContent = $('<div>').addClass(TAGBOX_TAG_CONTENT_CLASS);

        $('<span>')
          .text(data.text ?? data)
          .appendTo($tagContent);

        $('<div>')
          .addClass(TAGBOX_TAG_REMOVE_BUTTON_CLASS)
          .appendTo($tagContent);

        $container.append($tagContent);
      }, ['text'], this.option('integrationOptions.watchMethod'), {
        // @ts-expect-error ts-error
        text: this._displayGetter,
      }),
    });
  }

  _toggleSubmitElement(enabled): void {
    if (enabled) {
      this._renderSubmitElement();
      this._setSubmitValue();
    } else {
      if (this._$submitElement) {
        this._$submitElement.remove();
      }

      delete this._$submitElement;
    }
  }

  _renderSubmitElement(): void {
    if (!this.option('useSubmitBehavior')) {
      return;
    }

    const attributes = {
      multiple: 'multiple',
      'aria-label': 'Selected items',
    };

    this._$submitElement = $('<select>')
      // @ts-expect-error ts-error
      .attr(attributes)
      .css('display', 'none')
      .appendTo(this.$element());
  }

  _setSubmitValue(): void {
    if (!this.option('useSubmitBehavior')) {
      return;
    }

    const value = this._getValue();
    const $options: dxElementWrapper[] = [];

    for (let i = 0, n = value.length; i < n; i++) {
      const useDisplayText = this._shouldUseDisplayValue(value[i]);

      $options.push(
        $('<option>')
          // @ts-expect-error ts-error
          .val(useDisplayText ? this._displayGetter(value[i]) : value[i])
          .attr('selected', 'selected'),
      );
    }

    this._getSubmitElement()
      .empty()
      .append($options);
  }

  _initMarkup(): void {
    this._tagElementsCache = $();
    const isSingleLineMode = !this.option('multiline');

    this.$element()
      .addClass(TAGBOX_CLASS)
      .toggleClass(TAGBOX_ONLY_SELECT_CLASS, !(this.option('searchEnabled') || this.option('acceptCustomValue')))
      .toggleClass(TAGBOX_SINGLE_LINE_CLASS, isSingleLineMode);

    const elementAria = {
      role: 'application',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxTagBox-ariaRoleDescription'),
    };

    this.setAria(elementAria, this.$element());

    this._initTagTemplate();

    super._initMarkup();
  }

  _getNewLabelId(actualId, newId, shouldRemove): string | undefined {
    if (!actualId) {
      return newId;
    }

    if (shouldRemove) {
      if (actualId === newId) {
        return undefined;
      }

      return actualId
        .split(' ')
        .filter((id) => id !== newId)
        .join(' ');
    }

    return `${actualId} ${newId}`;
  }

  _updateElementAria(id?, shouldRemove?: boolean): void {
    const shouldClearLabel = !id;

    if (shouldClearLabel) {
      this.setAria('labelledby', undefined, this.$element());
      return;
    }

    const labelId = this.$element().attr('aria-labelledby');
    const newLabelId = this._getNewLabelId(labelId, id, shouldRemove);

    this.setAria('labelledby', newLabelId, this.$element());
  }

  _render(): void {
    super._render();

    this._renderTagRemoveAction();
    this._renderSingleLineScroll();
    this._scrollContainer('start');
  }

  _initTagTemplate() {
    this._tagTemplate = this._getTemplateByOption('tagTemplate');
  }

  _renderField(): void {
    const { fieldTemplate } = this.option();
    const isDefaultFieldTemplate = !isDefined(fieldTemplate);

    this.$element()
      .toggleClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS, isDefaultFieldTemplate)
      .toggleClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS, !isDefaultFieldTemplate);

    super._renderField();
  }

  _renderTagRemoveAction() {
    const tagRemoveAction = this._createAction(this._removeTagHandler.bind(this));
    const eventName = addNamespace(clickEvent, 'dxTagBoxTagRemove');

    eventsEngine.off(this._$tagsContainer, eventName);
    eventsEngine.on(this._$tagsContainer, eventName, `.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`, (event) => {
      tagRemoveAction({ event });
    });
  }

  _renderSingleLineScroll(): void {
    // @ts-expect-error ts-error
    const mouseWheelEvent = addNamespace('dxmousewheel', this.NAME);
    const $element = this.$element();
    const isMultiline = this.option('multiline');

    eventsEngine.off($element, mouseWheelEvent);

    if (devices.real().deviceType !== 'desktop') {
      if (this._$tagsContainer) {
        this._$tagsContainer.css('overflowX', isMultiline ? '' : 'auto');
      }
      return;
    }

    if (isMultiline) {
      return;
    }

    eventsEngine.on($element, mouseWheelEvent, this._tagContainerMouseWheelHandler.bind(this));
  }

  _tagContainerMouseWheelHandler(e): boolean | undefined {
    const scrollLeft = this._$tagsContainer.scrollLeft();
    const delta = e.delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER;

    if (!isCommandKeyPressed(e) && allowScroll(this._$tagsContainer, delta, true)) {
      // @ts-expect-error ts-error
      this._$tagsContainer.scrollLeft(scrollLeft + delta);
      return false;
    }
    return undefined;
  }

  _renderEvents(): void {
    super._renderEvents();

    const input = this._input();
    // @ts-expect-error ts-error
    const namespace = addNamespace('keydown', this.NAME);
    eventsEngine.on(input, namespace, (e) => {
      const keyName = normalizeKeyName(e);
      // @ts-expect-error ts-error
      if (!this._isControlKey(keyName) && this._isEditable()) {
        this._clearTagFocus();
      }
    });
  }

  _popupWrapperClass(): string {
    return `${super._popupWrapperClass()} ${TAGBOX_POPUP_WRAPPER_CLASS}`;
  }

  _renderInput(): void {
    super._renderInput();
    this._renderPreventBlurOnInputClick();
  }

  _renderPreventBlurOnInputClick() {
    const eventName = addNamespace('mousedown', 'dxTagBox');

    eventsEngine.off(this._inputWrapper(), eventName);
    eventsEngine.on(this._inputWrapper(), eventName, (e) => {
      if (e.target !== this._input()[0] && this._isFocused()) {
        e.preventDefault();
      }
    });
  }

  _renderInputValueImpl(): DeferredObj<unknown> {
    return this._renderMultiSelect();
  }

  _loadInputValue() {
    return when();
  }

  _clearTextValue(): void {
    this._input().val('');
    this._toggleEmptinessEventHandler();
    this.option('text', '');
  }

  _focusInHandler(e): void {
    if (!this._preventNestedFocusEvent(e)) {
      this._scrollContainer('end');
    }

    super._focusInHandler(e);
  }

  _renderInputValue(...args) {
    this.option('displayValue', this._searchValue());

    return super._renderInputValue(...args);
  }

  _restoreInputText(saveEditingValue?): void {
    if (!saveEditingValue) {
      this._clearTextValue();
    }
  }

  _focusOutHandler(e): void {
    if (!this._preventNestedFocusEvent(e)) {
      this._clearTagFocus();
      this._scrollContainer('start');
    }

    super._focusOutHandler(e);
  }

  _initSelectAllValueChangedAction(): void {
    this._selectAllValueChangeAction = this._createActionByOption('onSelectAllValueChanged');
  }

  _renderList(): void {
    super._renderList();
    this._setListDataSourceFilter();
  }

  _canListHaveFocus(): boolean {
    const { applyValueMode } = this.option();
    return applyValueMode === 'useButtons';
  }

  _listConfig() {
    const selectionMode = this.option('showSelectionControls') ? 'all' : 'multiple';

    return extend(super._listConfig(), {
      maxFilterLengthInRequest: this.option('maxFilterQueryLength'),
      selectionMode,
      selectAllText: this.option('selectAllText'),
      onSelectAllValueChanged: ({ value }) => {
        // @ts-expect-error ts-error
        this._selectAllValueChangeAction({ value });
      },
      selectAllMode: this.option('selectAllMode'),
      selectedItems: this._selectedItems,
      onFocusedItemChanged: null,
    });
  }

  _renderMultiSelect(): DeferredObj<unknown> {
    const d = Deferred();

    this._updateTagsContainer(this._$textEditorInputContainer);
    this._renderInputSize();
    this._renderTags()
    // @ts-expect-error ts-error
      .done(d.resolve)
      .fail(d.reject);
    // @ts-expect-error ts-error
    return d.promise();
  }

  _listItemClickHandler(e): void {
    !this.option('showSelectionControls') && this._clearTextValue();

    const { applyValueMode } = this.option();
    if (applyValueMode === 'useButtons') {
      return;
    }

    super._listItemClickHandler(e);
    this._saveValueChangeEvent(undefined);
  }

  _shouldClearFilter(): boolean {
    const shouldClearFilter = super._shouldClearFilter();
    const showSelectionControls = this.option('showSelectionControls');

    return !showSelectionControls && shouldClearFilter;
  }

  _renderInputSize(): void {
    const $input = this._input();
    const value = $input.val();
    const isEmptyInput = isString(value) && value;
    const cursorWidth = 5;
    let width = '';
    let size;
    const canTypeText = this.option('searchEnabled') || this.option('acceptCustomValue');
    if (isEmptyInput && canTypeText) {
      const $calculationElement = createTextElementHiddenCopy($input, value, { includePaddings: true });

      $calculationElement.insertAfter($input);
      width = getOuterWidth($calculationElement) + cursorWidth;

      $calculationElement.remove();
    } else if (!value) {
      size = 1;
    }

    $input.css('width', width);
    $input.attr('size', size ?? '');
  }

  _renderInputSubstitution() {
    super._renderInputSubstitution();
    this._updateWidgetHeight();
  }

  _getValue(): any[] {
    const { value } = this.option();

    return value || [];
  }

  _multiTagRequired(): boolean {
    const values = this._getValue();
    const { maxDisplayedTags } = this.option();

    return isDefined(maxDisplayedTags) && values.length > maxDisplayedTags;
  }

  _renderMultiTag($input) {
    const tagId = `dx-${new Guid()}`;

    const $tag = $('<div>')
      .attr('id', tagId)
      .addClass(TAGBOX_TAG_CLASS)
      .addClass(TAGBOX_MULTI_TAG_CLASS);

    const args = {
      multiTagElement: getPublicElement($tag),
      selectedItems: this.option('selectedItems'),
    };
    // @ts-expect-error ts-error
    this._multiTagPreparingAction(args);

    // @ts-expect-error
    if (args.cancel) {
      return false;
    }

    // @ts-expect-error
    $tag.data(TAGBOX_TAG_DATA_KEY, args.text);
    $tag.insertBefore($input);

    this._tagTemplate.render({
      // @ts-expect-error
      model: args.text,
      container: getPublicElement($tag),
    });

    // @ts-expect-error
    const tagText = args.text;

    this._setTagAria($tag, tagText);
    this._updateElementAria(tagId);
    return $tag;
  }

  _getFilter(creator) {
    const dataSourceFilter = this._dataController.filter();
    const filterExpr = creator.getCombinedFilter(this.option('valueExpr'), dataSourceFilter);
    const filterQueryLength = encodeURI(JSON.stringify(filterExpr)).length;
    const maxFilterQueryLength = this.option('maxFilterQueryLength');
    // @ts-expect-error ts-error
    if (filterQueryLength <= maxFilterQueryLength) {
      return filterExpr;
    }

    errors.log('W1019', maxFilterQueryLength);
  }

  _getFilteredItems(values) {
    this._loadFilteredItemsPromise?.reject();
    const creator = new FilterCreator(values);

    const listSelectedItems = this._list?.option('selectedItems');
    // @ts-expect-error ts-error
    const isListItemsLoaded = !!listSelectedItems && this._list._dataController.isLoaded();
    const selectedItems = listSelectedItems || this.option('selectedItems');
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const clientFilterFunction = creator.getLocalFilter(this._valueGetter);
    // @ts-expect-error ts-error
    const filteredItems = selectedItems.filter(clientFilterFunction);
    const selectedItemsAlreadyLoaded = filteredItems.length === values.length;
    const d = Deferred();
    const dataController = this._dataController;

    if (!this._dataSource) {
      return d.resolve([]).promise();
    }

    if (
      (!this._isDataSourceChanged || isListItemsLoaded)
      && selectedItemsAlreadyLoaded
      && !this._isDataSourceOptionChanged
    ) {
      return d.resolve(filteredItems).promise();
    }
    const { customQueryParams, expand, select } = dataController.loadOptions();
    const filter = this._getFilter(creator);

    dataController
      .loadFromStore({
        filter, customQueryParams, expand, select,
      })
      .done((data, extra) => {
        this._isDataSourceChanged = false;
        this._isDataSourceOptionChanged = false;
        if (this._disposed) {
          d.reject();
          return;
        }

        const { data: items } = normalizeLoadResult(data, extra);
        const mappedItems = dataController.applyMapFunction(items);
        d.resolve(mappedItems.filter(clientFilterFunction));
      })
      .fail(d.reject);

    this._loadFilteredItemsPromise = d;
    return d.promise();
  }

  _createTagsData(values, filteredItems) {
    const items = [];
    const cache = {};
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    const isValueExprSpecified = this._valueGetterExpr() === 'this';
    const { acceptCustomValue } = this.option();
    const filteredValues = {};

    filteredItems.forEach((filteredItem) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const filteredItemValue = isValueExprSpecified ? JSON.stringify(filteredItem) : this._valueGetter(filteredItem);

      filteredValues[filteredItemValue] = filteredItem;
    });

    const loadItemPromises = [];

    values.forEach((value, index) => {
      const currentItem = filteredValues[isValueExprSpecified ? JSON.stringify(value) : value];

      if (isValueExprSpecified && !isDefined(currentItem)) {
        if (!this._dataSource) {
          return;
        }

        loadItemPromises.push(
          // @ts-expect-error ts-error
          this._loadItem(value, cache)
            .done((item) => {
              const newItem = this._createTagData(item, value);
              // @ts-expect-error ts-error
              items.splice(index, 0, newItem);
            })
            .fail(() => {
              if (acceptCustomValue) {
                const newItem = this._createTagData(undefined, value);
                // @ts-expect-error ts-error
                items.splice(index, 0, newItem);
              }
            }),
        );
      } else {
        const newItem = this._createTagData(currentItem, value);
        // @ts-expect-error ts-error
        items.splice(index, 0, newItem);
      }
    });

    const d = Deferred();
    when.apply(this, loadItemPromises).always(() => {
      d.resolve(items);
    });

    return d.promise();
  }

  _createTagData(item, value) {
    if (isDefined(item)) {
      // @ts-expect-error ts-error
      this._selectedItems.push(item);
      return item;
    }
    const selectedItem = this.option('selectedItem');
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const customItem = this._valueGetter(selectedItem) === value ? selectedItem : value;

    return customItem;
  }

  _isGroupedData(): boolean {
    return this.option('grouped') && !this._dataController.group();
  }

  _getItemsByValues(values) {
    const resultItems = [];
    values.forEach((value) => {
      const item = this._getItemFromPlain(value);
      if (isDefined(item)) {
        // @ts-expect-error ts-error
        resultItems.push(item);
      }
    });
    return resultItems;
  }

  _getFilteredGroupedItems(values) {
    const selectedItems = Deferred();

    if (this._filteredGroupedItemsLoadPromise) {
      // @ts-expect-error ts-error
      this._dataController.cancel(this._filteredGroupedItemsLoadPromise.operationId);
    }
    if (!this._dataController.items().length) {
      this._filteredGroupedItemsLoadPromise = this._dataController.load()
        .done(() => {
          selectedItems.resolve(this._getItemsByValues(values));
        })
        .fail(() => {
          selectedItems.resolve([]);
        })
        .always(() => {
          this._filteredGroupedItemsLoadPromise = undefined;
        });
    } else {
      selectedItems.resolve(this._getItemsByValues(values));
    }

    return selectedItems.promise();
  }

  _loadTagsData() {
    const values = this._getValue();
    const tagData = Deferred();

    this._selectedItems = [];

    const filteredItemsPromise = this._isGroupedData()
      ? this._getFilteredGroupedItems(values)
      : this._getFilteredItems(values);

    filteredItemsPromise
      // @ts-expect-error ts-error
      .done((filteredItems) => {
        const items = this._createTagsData(values, filteredItems);
        // @ts-expect-error ts-error
        items.always((data) => {
          tagData.resolve(data);
        });
      })
      .fail(tagData.reject.bind(this));

    return tagData.promise();
  }

  _renderTags() {
    const d = Deferred();
    let isPlainDataUsed = false;

    if (this._shouldGetItemsFromPlain(this._valuesToUpdate)) {
      this._selectedItems = this._getItemsFromPlain(this._valuesToUpdate);

      if (this._selectedItems.length === this._valuesToUpdate.length) {
        this._tagsToRender = this._sortSelectedItemsByValues(
          this._selectedItems,
          this._valuesToUpdate,
        );
        this._renderTagsImpl();
        isPlainDataUsed = true;
        d.resolve();
      }
    }

    if (!isPlainDataUsed) {
      this._loadTagsData()
        // @ts-expect-error ts-error
        .done((items) => {
          if (this._disposed) {
            d.reject();
            return;
          }

          this._tagsToRender = items;
          this._renderTagsImpl();
          d.resolve();
        })
        .fail(d.reject);
    }

    return d.promise();
  }

  _renderTagsImpl(): void {
    this._renderField();
    if (this._shouldUpdateSelectedItems()) {
      // @ts-expect-error ts-error
      this.option('selectedItems', this._selectedItems.slice());
    }

    const fieldTemplate = this._getFieldTemplate();
    if (!fieldTemplate) {
      this._cleanTags();
      this._renderTagsCore();
    }
  }

  _shouldGetItemsFromPlain(values): boolean {
    return values && this._dataController.isLoaded() && values.length <= this._getPlainItems().length;
  }

  _getItemsFromPlain(values) {
    let selectedItems = this._getSelectedItemsFromList(values);
    const needFilterPlainItems = (selectedItems.length === 0 && values.length > 0) || (selectedItems.length < values.length);

    if (needFilterPlainItems) {
      const plainItems = this._getPlainItems();
      selectedItems = this._filterSelectedItems(plainItems, values);
    }

    return selectedItems;
  }

  _getSelectedItemsFromList(values) {
    const { selectedItems: listSelectedItems } = this._list ? this._list.option() : { selectedItems: [] };

    let selectedItems = [];
    if (values.length === listSelectedItems?.length) {
      selectedItems = this._filterSelectedItems(listSelectedItems, values);
    }

    return selectedItems;
  }

  _shouldUseClickOrderForTags(values: TagBox['_valuesToUpdate']): boolean {
    const { maxDisplayedTags, showMultiTagOnly } = this.option();

    return !showMultiTagOnly
      && isDefined(maxDisplayedTags)
      && values.length > maxDisplayedTags;
  }

  _sortSelectedItemsByValues(
    selectedItems: TagBoxItem[],
    values: TagBoxItem[],
  ): TagBoxItem[] {
    if (!this._shouldUseClickOrderForTags(values) || !selectedItems.length) {
      return selectedItems;
    }
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    const isValueExprDefault = this._valueGetterExpr() === 'this';

    const mappedSelectedItems = selectedItems.reduce<SelectedItemsMap>((result, item) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const itemValue = isValueExprDefault ? JSON.stringify(item) : this._valueGetter(item);
      result[itemValue] = item;

      return result;
    }, {});

    const selectedByOrderItems: TagBoxItem[] = values.reduce((result, currentValue) => {
      const normalizedValue = isValueExprDefault ? JSON.stringify(currentValue) : currentValue;
      const item = mappedSelectedItems[normalizedValue];
      if (isDefined(item)) {
        result.push(item);
      }

      return result;
    }, []);

    return selectedByOrderItems;
  }

  _filterSelectedItems(plainItems, values) {
    const selectedItems = plainItems.filter((dataItem) => {
      let currentValue;
      for (let i = 0; i < values.length; i++) {
        currentValue = values[i];
        if (isObject(currentValue)) {
          // @ts-expect-error ts-error
          if (this._isValueEquals(dataItem, currentValue)) {
            return true;
          }
          // @ts-expect-error ts-error
        } else if (this._isValueEquals(this._valueGetter(dataItem), currentValue)) {
          return true;
        }
      }

      return false;
    }, this);

    return selectedItems;
  }

  _processDataSourceChanging(): void {
    this._isDataSourceOptionChanged = true;

    super._processDataSourceChanging();
  }

  _integrateInput(): void {
    super._integrateInput();

    const tagsContainer = this.$element().find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`);

    this._updateTagsContainer(tagsContainer);
    this._renderTagRemoveAction();
    this._renderTagsCore();
  }

  _renderTagsCore(): void {
    this._renderTagsElements(this._tagsToRender);
    this._renderEmptyState();

    if (!this._preserveFocusedTag) {
      this._clearTagFocus();
    }

    this._popup?.refreshPosition();
  }

  _shouldUpdateSelectedItems(): boolean {
    const { selectedItems } = this.option();

    if (isDefined(selectedItems) && selectedItems.length !== this._selectedItems?.length) {
      return true;
    }

    const intersection = getIntersection(selectedItems, this._selectedItems);

    if (intersection.length !== this._selectedItems?.length) {
      return true;
    }

    return false;
  }

  _renderTagsElements(items): void {
    const $multiTag = this._multiTagRequired() && this._renderMultiTag(this._input());
    const { showMultiTagOnly, maxDisplayedTags } = this.option();

    items.forEach((item, index) => {
      // @ts-expect-error ts-error
      if (($multiTag && showMultiTagOnly) || ($multiTag && !showMultiTagOnly && index - maxDisplayedTags >= -1)) {
        return false;
      }
      this._renderTag(item, $multiTag || this._input());
      return undefined;
    });

    if (this._isFocused()) {
      this._scrollContainer('end');
    }

    this._refreshTagElements();
  }

  _cleanTags(): void {
    if (this._multiTagRequired()) {
      this._tagElements().remove();
    } else {
      const $tags = this._tagElements();

      const selectedItems = this.option('selectedItems') ?? [];
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const values = selectedItems.map((item) => this._valueGetter(item));

      each($tags, (_, tag) => {
        const $tag = $(tag);
        const tagData = $tag.data(TAGBOX_TAG_DATA_KEY);

        if (!values.includes(tagData)) {
          $tag.remove();
        }
      });
    }

    this._updateElementAria();
  }

  _renderEmptyState(): void {
    const isEmpty = !(this._getValue().length
      // @ts-expect-error ts-error
      || this._selectedItems.length
      || this._searchValue());
    this._toggleEmptiness(isEmpty);
    this._renderDisplayText();
  }

  _renderDisplayText(): void {
    this._renderInputSize();
  }

  _refreshTagElements(): void {
    this._tagElementsCache = this.$element().find(`.${TAGBOX_TAG_CLASS}`);
  }

  _tagElements(): dxElementWrapper {
    // @ts-expect-error ts-error
    return this._tagElementsCache;
  }

  _applyTagTemplate(item, $tag): void {
    this._tagTemplate.render({
      model: item,
      container: getPublicElement($tag),
    });
  }

  _renderTag(item, $input): void {
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const value = this._valueGetter(item);

    if (!isDefined(value)) {
      return;
    }

    let $tag = this._getTag(value);
    // @ts-expect-error ts-error
    const displayValue = this._displayGetter(item);
    const itemModel = this._getItemModel(item, displayValue);

    if ($tag) {
      const tagDisplayValue = $tag.data(TAGBOX_TAG_DISPLAY_VALUE);

      if (isDefined(displayValue) && !equalByValue(tagDisplayValue, displayValue)) {
        $tag.empty();
        this._applyTagTemplate(itemModel, $tag);
      }
      this._updateElementAria($tag.attr('id'));
    } else {
      const tagId = `dx-${new Guid()}`;

      $tag = this._createTag(value, $input, tagId, displayValue);

      this._setTagAria($tag, isDefined(displayValue) ? displayValue : value);

      if (isDefined(item)) {
        this._applyTagTemplate(itemModel, $tag);
      } else {
        this._applyTagTemplate(value, $tag);
      }

      this._updateElementAria(tagId);
    }
  }

  _setTagAria($tag, tagText) {
    const aria = {
      role: 'button',
      label: tagText,
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxTagBox-tagRoleDescription'),
    };

    this.setAria(aria, $tag);
  }

  _getItemModel(item, displayValue) {
    if (isObject(item) && isDefined(displayValue)) {
      return item;
    }
    return ensureDefined(displayValue, '');
  }

  _getTag(value) {
    const $tags = this._tagElements();
    const tagsLength = $tags.length;
    let result: dxElementWrapper | boolean = false;

    for (let i = 0; i < tagsLength; i++) {
      const $tag = $tags[i];
      const tagData = elementData($tag, TAGBOX_TAG_DATA_KEY);

      if (value === tagData || equalByValue(value, tagData)) {
        result = $($tag);
        break;
      }
    }
    return result;
  }

  _createTag(value, $input, tagId, displayValue): dxElementWrapper {
    return $('<div>')
      .attr('id', tagId)
      .addClass(TAGBOX_TAG_CLASS)
      .data(TAGBOX_TAG_DATA_KEY, value)
      .data(TAGBOX_TAG_DISPLAY_VALUE, displayValue)
      .insertBefore($input);
  }

  _toggleEmptinessEventHandler() {
    this._toggleEmptiness(!this._getValue().length && !this._searchValue().length);
  }

  _customItemAddedHandler(e) {
    super._customItemAddedHandler(e);
    this._clearTextValue();
  }

  _removeTagHandler(args) {
    const e = args.event;

    e.stopPropagation();
    this._saveValueChangeEvent(e);

    const $tag = $(e.target).closest(`.${TAGBOX_TAG_CLASS}`);
    this._removeTagElement($tag);
  }

  _removeTagElement($tag) {
    const { showMultiTagOnly, maxDisplayedTags } = this.option();
    if ($tag.hasClass(TAGBOX_MULTI_TAG_CLASS)) {
      if (!showMultiTagOnly && isDefined(maxDisplayedTags)) {
        const displayedTagsCount = Math.max(0, maxDisplayedTags - 1);
        const newValue = this._getValue().slice(0, displayedTagsCount);
        this.option('value', newValue);
      } else {
        this.clear();
      }
      return;
    }

    const itemValue = $tag.data(TAGBOX_TAG_DATA_KEY);
    const itemId = $tag.attr('id');

    this._removeTagWithUpdate(itemValue);
    this._updateElementAria(itemId, true);
    this._refreshTagElements();
  }

  // eslint-disable-next-line class-methods-use-this
  _updateField(): void {}

  _removeTagWithUpdate(itemValue): void {
    const value = this._getValue().slice();
    this._removeTag(value, itemValue);
    this.option('value', value);
    this.option('selectedItem', null);

    if (value.length === 0) {
      this._clearTagFocus();
    }
  }

  _getCurrentValue() {
    return this._lastValue();
  }

  _selectionChangeHandler(e): void {
    const { applyValueMode } = this.option();

    if (applyValueMode === 'useButtons') {
      return;
    }

    const value = this._getValue().slice();

    each(e.removedItems || [], (_, removedItem) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      this._removeTag(value, this._valueGetter(removedItem));
    });

    each(e.addedItems || [], (_, addedItem) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      this._addTag(value, this._valueGetter(addedItem));
    });

    this._updateWidgetHeight();
    // @ts-expect-error ts-error
    if (!equalByValue(this._list.option('selectedItemKeys'), this.option('value'))) {
      // @ts-expect-error ts-error
      const listSelectionChangeEvent = this._list._getSelectionChangeEvent();
      listSelectionChangeEvent && this._saveValueChangeEvent(listSelectionChangeEvent);
      this.option('value', value);
    }
    // @ts-expect-error ts-error
    this._list._saveSelectionChangeEvent(undefined);
  }

  _removeTag(value, item): void {
    const index = this._valueIndex(item, value);

    if (index >= 0) {
      value.splice(index, 1);
    }
  }

  _addTag(value, item): void {
    const index = this._valueIndex(item);

    if (index < 0) {
      value.push(item);
    }
  }

  // @ts-expect-error ts-error
  _fieldRenderData() {
    // @ts-expect-error ts-error
    return this._selectedItems.slice();
  }

  _completeSelection(value): void {
    if (!this.option('showSelectionControls')) {
      this._setValue(value);
    }
  }

  _setValue(value): void {
    if (value === null) {
      return;
    }

    const { applyValueMode } = this.option();

    const useButtons = applyValueMode === 'useButtons';
    const valueIndex = this._valueIndex(value);

    const { selectedItemKeys } = this._list?.option() || { selectedItemKeys: [] };

    const values = (useButtons ? selectedItemKeys ?? [] : this._getValue()).slice();

    if (valueIndex >= 0) {
      values.splice(valueIndex, 1);
    } else {
      values.push(value);
    }

    if (useButtons) {
      this._list?.option('selectedItemKeys', values);
    } else {
      this.option('value', values);
    }
  }

  _isSelectedValue(value, cache): boolean {
    return this._valueIndex(value, null, cache) > -1;
  }

  _valueIndex(value, values?, cache?) {
    let result = -1;

    if (cache && typeof value !== 'object') {
      if (!cache.indexByValues) {
        cache.indexByValues = {};
        values = values || this._getValue();
        values.forEach((value, index) => {
          cache.indexByValues[value] = index;
        });
      }
      if (value in cache.indexByValues) {
        return cache.indexByValues[value];
      }
    }

    values = values || this._getValue();

    each(values, (index, selectedValue) => {
      // @ts-expect-error ts-error
      if (this._isValueEquals(value, selectedValue)) {
        result = index;
        return false;
      }
      return undefined;
    });

    return result;
  }

  _lastValue() {
    const values = this._getValue();
    const lastValue = values[values.length - 1];
    return lastValue ?? null;
  }

  _shouldRenderSearchEvent(): boolean | undefined {
    const { searchEnabled, acceptCustomValue } = this.option();
    return searchEnabled || acceptCustomValue;
  }

  _searchHandler(e): void {
    if (this.option('searchEnabled') && !!e && !this._isTagRemoved) {
      super._searchHandler(arguments);
      this._setListDataSourceFilter();
    }

    this._updateWidgetHeight();
    delete this._isTagRemoved;
  }

  _updateWidgetHeight(): void {
    const element = this.$element();
    const originalHeight = getHeight(element);

    this._renderInputSize();

    const currentHeight = getHeight(element);

    if (this._popup && this.option('opened') && this._isEditable() && currentHeight !== originalHeight) {
      this._popup.repaint();
    }
  }

  _refreshSelected(): void {
    // @ts-expect-error ts-error
    this._list?.getDataSource() && this._list.option('selectedItems', this._selectedItems);
  }

  _resetListDataSourceFilter(): void {
    const dataController = this._dataController;
    delete this._userFilter;

    dataController.filter(null);
    dataController.reload();
  }

  _setListDataSourceFilter() {
    if (!this.option('hideSelectedItems') || !this._list) {
      return;
    }

    const dataController = this._dataController;
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    const valueGetterExpr = this._valueGetterExpr();

    if (isString(valueGetterExpr) && valueGetterExpr !== 'this') {
      const filter = this._dataSourceFilterExpr();

      if (this._userFilter === undefined) {
        this._userFilter = dataController.filter() || null;
      }
      // @ts-expect-error ts-error
      this._userFilter && filter.push(this._userFilter);

      filter.length ? dataController.filter(filter) : dataController.filter(null);
    } else {
      dataController.filter(this._dataSourceFilterFunction.bind(this));
    }

    dataController.load();
  }

  _dataSourceFilterExpr() {
    const filter = [];
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    this._getValue().forEach((value) => filter.push(['!', [this._valueGetterExpr(), value]]));

    return filter;
  }

  _dataSourceFilterFunction(itemData) {
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const itemValue = this._valueGetter(itemData);
    let result = true;

    each(this._getValue(), (index, value) => {
      // @ts-expect-error ts-error
      if (this._isValueEquals(value, itemValue)) {
        result = false;
        return false;
      }
      return undefined;
    });

    return result;
  }

  _dataSourceChangedHandler(): void {
    this._isDataSourceChanged = true;
    // @ts-expect-error ts-error
    super._dataSourceChangedHandler.apply(this, arguments);
  }

  _applyButtonHandler(args): void {
    this._saveValueChangeEvent(args.event);
    this.option('value', this._getSortedListValues());
    this._clearTextValue();
    super._applyButtonHandler();
    this._cancelSearchIfNeed();
  }

  _getSortedListValues() {
    const listValues = this._getListValues();
    const { value } = this.option();
    const currentValue = value || [];
    const existedItems = listValues.length ? getIntersection(currentValue, listValues) : [];
    const newItems = existedItems.length
      ? removeDuplicates(listValues, currentValue)
      : listValues;

    return existedItems.concat(newItems);
  }

  _getListValues() {
    if (!this._list) {
      return [];
    }

    return this
      ._getPlainItems(this._list.option('selectedItems'))
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      .map((item) => this._valueGetter(item));
  }

  _setListDataSource(): void {
    const currentValue = this._getValue();
    super._setListDataSource();

    const { value } = this.option();
    if (currentValue !== value) {
      this.option('value', currentValue);
    }
    this._refreshSelected();
  }

  _renderOpenedState(): void {
    super._renderOpenedState();
    const { applyValueMode } = this.option();
    if (applyValueMode === 'useButtons' && !this.option('opened')) {
      this._refreshSelected();
    }
  }

  clear(): void {
    this._restoreInputText();
    const defaultValue = this._getDefaultOptions().value;
    const { value: currentValue } = this.option();
    if (defaultValue
      && defaultValue.length === 0
      && currentValue
      && defaultValue.length === currentValue.length
    ) {
      return;
    }
    super.clear();
  }

  _clean(): void {
    super._clean();
    delete this._valuesToUpdate;
    delete this._tagTemplate;
    delete this._tagsToRender;
  }

  _getSelectedItemsDifference(newItems, previousItems) {
    if (!newItems.length) {
      return {
        addedItems: [],
        removedItems: previousItems.slice(),
      };
    }
    if (!previousItems.length) {
      return {
        addedItems: newItems.slice(),
        removedItems: [],
      };
    }

    const previousItemsValuesMap = previousItems.reduce((map, item) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const value = this._valueGetter(item);
      map[value] = item;
      return map;
    }, {});

    const addedItems = [];
    newItems.forEach((item) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const value = this._valueGetter(item);
      if (!previousItemsValuesMap[value]) {
        addedItems.push(item as never);
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete previousItemsValuesMap[value];
    });

    return {
      addedItems,
      removedItems: Object.values(previousItemsValuesMap),
    };
  }

  _optionChanged(args) {
    const { name, value, previousValue } = args;
    switch (name) {
      case 'onSelectAllValueChanged':
        this._initSelectAllValueChangedAction();
        break;
      case 'onMultiTagPreparing':
        this._initMultiTagPreparingAction();
        this._renderTags();
        break;
      case 'hideSelectedItems':
        if (value) {
          this._setListDataSourceFilter();
        } else {
          this._resetListDataSourceFilter();
        }
        break;
      case 'useSubmitBehavior':
        this._toggleSubmitElement(value);
        break;
      case 'displayExpr':
        super._optionChanged(args);
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
      case 'readOnly':
      case 'disabled':
        super._optionChanged(args);
        !value && this._refreshEvents();
        break;
      case 'value':
        this._valuesToUpdate = value;
        super._optionChanged(args);
        this._valuesToUpdate = undefined;
        this._setListDataSourceFilter();
        break;
      case 'maxDisplayedTags':
      case 'showMultiTagOnly':
        this._renderTags();
        break;
      case 'selectAllMode':
        this._setListOption(name, value);
        break;
      case 'selectedItem':
        break;
      case 'selectedItems':
        this._selectionChangedAction(this._getSelectedItemsDifference(value, previousValue));
        break;
      case 'multiline':
        this.$element().toggleClass(TAGBOX_SINGLE_LINE_CLASS, !value);
        this._renderSingleLineScroll();
        break;
      case 'maxFilterQueryLength':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getActualSearchValue() {
    return super._getActualSearchValue() || this._searchValue();
  }

  _popupHidingHandler(): void {
    super._popupHidingHandler();
    this._clearFilter();
  }
}

registerComponent('dxTagBox', TagBox);

export default TagBox;
