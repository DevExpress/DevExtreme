/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { name as clickEvent } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import { normalizeLoadResult } from '@js/common/data/data_source/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DxElement } from '@js/core/element';
import { getPublicElement } from '@js/core/element';
import { data as elementData } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import type { TemplateBase } from '@js/core/templates/template_base';
import { getIntersection, removeDuplicates } from '@js/core/utils/array';
import { ensureDefined, equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { createTextElementHiddenCopy } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { SelectionFilterCreator as FilterCreator } from '@js/core/utils/selection_filter';
import { getHeight, getOuterWidth } from '@js/core/utils/size';
import { isDefined, isObject, isString } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { ItemClickEvent, SelectionChangedEvent as ListSelectionChangedEvent } from '@js/ui/list';
import type { Properties } from '@js/ui/tag_box';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import type { ItemCache } from '@ts/ui/drop_down_editor/drop_down_list';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import type { DxMouseWheelEvent } from '@ts/ui/scroll_view/types';
import SelectBox from '@ts/ui/select_box';
import caret from '@ts/ui/text_box/utils.caret';
import { allowScroll } from '@ts/ui/text_box/utils.scroll';

function xor(a: boolean, b: boolean): boolean {
  return (a || b) && !(a && b);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TagBoxItem = string | number | any;
type SelectedItemsMap = Record<string, TagBoxItem>;

interface FilterCreatorInstance {
  getCombinedFilter: (
    keyExpr: string | ((item: unknown) => unknown) | undefined,
    dataSourceFilter: unknown[] | null,
  ) => unknown[] | undefined;
  getLocalFilter: (keyGetter: (item: unknown) => unknown) => (item: unknown) => boolean;
}

interface MultiTagPreparingArgs {
  multiTagElement: DxElement;
  selectedItems?: (string | number | unknown)[];
  text?: string;
  cancel?: boolean;
}

interface ValueIndexCache extends ItemCache {
  indexByValues?: Record<string, number>;
}

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
  useSubmitBehavior?: boolean;
}

class TagBox<
  TProperties extends TagBoxProperties = TagBoxProperties,
> extends SelectBox<TProperties> {
  _$focusedTag?: dxElementWrapper;

  _$tagsContainer?: dxElementWrapper;

  _loadFilteredItemsPromise?: DeferredObj<unknown>;

  _filteredGroupedItemsLoadPromise?: DeferredObj<unknown>;

  _selectAllValueChangeAction?: (event?: Record<string, unknown>) => void;

  _multiTagPreparingAction?: (event?: MultiTagPreparingArgs) => void;

  _valuesToUpdate?: TagBoxItem[];

  _preserveFocusedTag?: boolean;

  _isTagRemoved?: boolean;

  _userFilter?: unknown;

  _isDataSourceChanged?: boolean;

  _tagTemplate?: TemplateBase;

  _isDataSourceOptionChanged?: boolean;

  _tagElementsCache?: dxElementWrapper;

  _selectedItems?: TagBoxItem[];

  _tagsToRender?: TagBoxItem[];

  _supportedKeys(): Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (e: KeyboardEvent, options?: KeyboardKeyDownEvent) => boolean | void
  > {
    const parent = super._supportedKeys();
    const sendToList = (options?: KeyboardKeyDownEvent): void => {
      if (!options) {
        return;
      }

      this._list?._keyboardHandler(options);
    };
    const { rtlEnabled } = this.option();

    return {
      ...parent,
      backspace: (e: KeyboardEvent): void => {
        if (!this._isCaretAtTheStart()) {
          return;
        }

        this._processKeyboardEvent(e);
        this._isTagRemoved = true;

        const $tagToDelete = this._$focusedTag || this._tagElements()?.last();

        if (this._$focusedTag) {
          this._moveTagFocus('prev', true);
        }

        if (!$tagToDelete || $tagToDelete.length === 0) {
          return;
        }
        this._preserveFocusedTag = true;
        this._removeTagElement($tagToDelete);
        delete this._preserveFocusedTag;
      },
      upArrow: (e: KeyboardEvent, options?: KeyboardKeyDownEvent) => (
        e.altKey || !this._list ? parent.upArrow.call(this, e) : sendToList(options)
      ),
      downArrow: (e: KeyboardEvent, options?: KeyboardKeyDownEvent) => (
        e.altKey || !this._list ? parent.downArrow.call(this, e) : sendToList(options)
      ),
      del: (e: KeyboardEvent): void => {
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
      enter: (e: KeyboardEvent, options?: KeyboardKeyDownEvent): void => {
        const { opened, acceptCustomValue } = this.option();
        const isListItemFocused = this._list?.option('focusedElement') !== null && opened;
        const isCustomItem = acceptCustomValue && !isListItemFocused;

        if (isCustomItem) {
          e.preventDefault();
          if (this._searchValue() !== '') {
            this._customItemAddedHandler(e);
          }
          return;
        }

        if (opened) {
          this._saveValueChangeEvent(e);
          sendToList(options);
          e.preventDefault();
        }
      },
      space: (e: KeyboardEvent, options?: KeyboardKeyDownEvent): void => {
        const { opened } = this.option();
        const isInputActive = this._shouldRenderSearchEvent();

        if (opened && !isInputActive) {
          this._saveValueChangeEvent(e);
          sendToList(options);
          e.preventDefault();
        }
      },
      leftArrow: (e: KeyboardEvent): void => {
        if (
          !this._isCaretAtTheStart()
            || this._isEmpty()
            || (this._isEditable() && rtlEnabled && !this._$focusedTag)
        ) {
          return;
        }

        e.preventDefault();

        const direction = rtlEnabled ? 'next' : 'prev';
        this._moveTagFocus(direction);

        const { multiline } = this.option();

        if (!multiline) {
          this._scrollContainer(direction);
        }
      },
      rightArrow: (e: KeyboardEvent): void => {
        if (!this._isCaretAtTheStart()
          || this._isEmpty()
          || (this._isEditable() && !rtlEnabled && !this._$focusedTag)
        ) {
          return;
        }

        e.preventDefault();

        const direction = rtlEnabled ? 'prev' : 'next';
        this._moveTagFocus(direction);
        const { multiline } = this.option();

        if (!multiline) {
          this._scrollContainer(direction);
        }
      },
    };
  }

  _processKeyboardEvent(e: KeyboardEvent): void {
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

  _allowSelectItemByTab(): boolean {
    return false;
  }

  _isCaretAtTheStart(): boolean {
    const position = caret(this._input());
    return position?.start === 0 && position.end === 0;
  }

  _updateInputAriaActiveDescendant(id?: string): void {
    this.setAria('activedescendant', id, this._input());
  }

  _moveTagFocus(direction: 'prev' | 'next', clearOnBoundary?: boolean): void {
    if (!this._$focusedTag) {
      const tagElements = this._tagElements();

      this._$focusedTag = direction === 'next' ? tagElements?.first() : tagElements?.last();

      this._toggleFocusClass(true, this._$focusedTag);
      this._updateInputAriaActiveDescendant(this._$focusedTag?.attr('id'));
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
    this._$focusedTag = undefined;
  }

  _focusClassTarget($element?: dxElementWrapper): dxElementWrapper {
    if ($element?.length && $element[0] !== this._focusTarget()[0]) {
      return $element;
    }

    return super._focusClassTarget();
  }

  _getLabelContainer(): dxElementWrapper {
    return this._$tagsContainer ?? super._getLabelContainer();
  }

  _getFieldElement(): dxElementWrapper {
    return this._input();
  }

  _scrollContainer(direction: 'start' | 'end' | 'next' | 'prev'): void {
    const { multiline } = this.option();
    if (multiline || !hasWindow()) {
      return;
    }

    if (!this._$tagsContainer) {
      return;
    }

    const scrollPosition = this._getScrollPosition(direction);
    // @ts-expect-error fix on renderer level
    this._$tagsContainer.scrollLeft(scrollPosition);
  }

  _getScrollPosition(direction: 'start' | 'end' | 'next' | 'prev'): number {
    if (direction === 'start' || direction === 'end') {
      return this._getBorderPosition(direction);
    }

    return this._$focusedTag
      ? this._getFocusedTagPosition(direction)
      : this._getBorderPosition('end');
  }

  _getBorderPosition(direction: 'start' | 'end'): number {
    if (!this._$tagsContainer) {
      return 0;
    }

    const { rtlEnabled } = this.option();
    const isScrollLeft = xor(direction === 'end', Boolean(rtlEnabled));

    const scrollSign = rtlEnabled ? -1 : 1;
    const containerScrollWidth = this._$tagsContainer.get(0).scrollWidth;

    return xor(isScrollLeft, !rtlEnabled)
      ? 0
      : scrollSign * (containerScrollWidth - getOuterWidth(this._$tagsContainer));
  }

  _getFocusedTagPosition(direction: 'next' | 'prev'): number {
    if (!this._$tagsContainer) {
      return 0;
    }

    const { rtlEnabled } = this.option();
    const isScrollLeft = xor(direction === 'next', Boolean(rtlEnabled));

    let { left: scrollOffset = 0 } = this._$focusedTag?.position() || { };
    // @ts-expect-error fix on renderer level
    let scrollLeft = this._$tagsContainer.scrollLeft() as number;

    if (isScrollLeft) {
      scrollOffset += getOuterWidth(this._$focusedTag, true) - getOuterWidth(this._$tagsContainer);
    }

    if (xor(isScrollLeft, scrollOffset < 0)) {
      scrollLeft += scrollOffset;
    }

    return scrollLeft;
  }

  _setNextValue(): void {}

  _getDefaultOptions(): TProperties {
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
    }) as TProperties;
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

  _initMultiTagPreparingAction(): void {
    this._multiTagPreparingAction = this._createActionByOption('onMultiTagPreparing', {
      beforeExecute: (e) => {
        this._multiTagPreparingHandler((e.args as MultiTagPreparingArgs[])[0]);
      },
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _multiTagPreparingHandler(args: MultiTagPreparingArgs): void {
    const { length: selectedCount } = this._getValue();
    const { showMultiTagOnly, maxDisplayedTags } = this.option();

    if (!showMultiTagOnly) {
      // @ts-expect-error getFormatter return type not typed as callable
      args.text = messageLocalization.getFormatter('dxTagBox-moreSelected')(selectedCount - maxDisplayedTags + 1);
    } else {
      // @ts-expect-error getFormatter return type not typed as callable
      args.text = messageLocalization.getFormatter('dxTagBox-selected')(selectedCount);
    }
  }

  _initDynamicTemplates(): void {
    // @ts-expect-error internal property
    super._initDynamicTemplates();

    this._templateManager.addDefaultTemplates({
      tag: new BindableTemplate((
        $container: dxElementWrapper,
        data: TagBoxItem,
      ) => {
        const $tagContent = $('<div>').addClass(TAGBOX_TAG_CONTENT_CLASS);

        $('<span>')
          .text(data.text ?? data)
          .appendTo($tagContent);

        $('<div>')
          .addClass(TAGBOX_TAG_REMOVE_BUTTON_CLASS)
          .appendTo($tagContent);

        $container.append($tagContent);
      }, ['text'], this.option('integrationOptions.watchMethod'), {
        // @ts-expect-error DataExpressionMixin must be typed
        text: this._displayGetter,
      }),
    });
  }

  _toggleSubmitElement(enabled?: unknown): void {
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
    const { useSubmitBehavior } = this.option();
    if (!useSubmitBehavior) {
      return;
    }

    const attributes = {
      multiple: 'multiple',
      'aria-label': 'Selected items',
    };

    this._$submitElement = $('<select>')
      // @ts-expect-error should be fixed on renderer level
      .attr(attributes)
      .css('display', 'none')
      .appendTo(this.$element());
  }

  _setSubmitValue(): void {
    const { useSubmitBehavior } = this.option();

    if (!useSubmitBehavior) {
      return;
    }

    const value = this._getValue();

    const $options = value.map((item) => {
      const useDisplayText = this._shouldUseDisplayValue(item);
      return $('<option>')
        // @ts-expect-error DataExpressionMixin must be typed
        .val(useDisplayText ? this._displayGetter(item) : item)
        .attr('selected', 'selected');
    });

    this._getSubmitElement()
      .empty()
      .append($options);
  }

  _initMarkup(): void {
    this._tagElementsCache = $();
    const { multiline, searchEnabled, acceptCustomValue } = this.option();
    const isSingleLineMode = !multiline;

    this.$element()
      .addClass(TAGBOX_CLASS)
      .toggleClass(TAGBOX_ONLY_SELECT_CLASS, !(searchEnabled || acceptCustomValue))
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

  _getNewLabelId(actualId?: string, newId?: string, shouldRemove?: boolean): string | undefined {
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

  _updateElementAria(id?: string, shouldRemove?: boolean): void {
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

  _initTagTemplate(): void {
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

  _renderTagRemoveAction(): void {
    const tagRemoveAction = this._createAction(this._removeTagHandler.bind(this));
    const eventName = addNamespace(clickEvent, 'dxTagBoxTagRemove');

    eventsEngine.off(this._$tagsContainer, eventName);
    eventsEngine.on(this._$tagsContainer, eventName, `.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`, (event) => {
      tagRemoveAction({ event });
    });
  }

  _renderSingleLineScroll(): void {
    const mouseWheelEvent = addNamespace('dxmousewheel', this.NAME as string);
    const $element = this.$element();
    const { multiline } = this.option();

    eventsEngine.off($element, mouseWheelEvent);

    if (devices.real().deviceType !== 'desktop') {
      if (this._$tagsContainer) {
        this._$tagsContainer.css('overflowX', multiline ? '' : 'auto');
      }
      return;
    }

    if (multiline) {
      return;
    }

    eventsEngine.on($element, mouseWheelEvent, this._tagContainerMouseWheelHandler.bind(this));
  }

  _tagContainerMouseWheelHandler(e: DxMouseWheelEvent): boolean | undefined {
    if (!this._$tagsContainer) {
      return undefined;
    }

    const scrollLeft = this._$tagsContainer.scrollLeft();
    const delta = e.delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER;

    if (!isCommandKeyPressed(e) && allowScroll(this._$tagsContainer, delta, true)) {
      // @ts-expect-error scrollLeft with argument not typed in renderer.d.ts
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this._$tagsContainer.scrollLeft(scrollLeft + delta);
      return false;
    }
    return undefined;
  }

  _renderEvents(): void {
    super._renderEvents();

    const input = this._input();
    const namespace = addNamespace('keydown', this.NAME as string);
    eventsEngine.on(input, namespace, (e: KeyboardEvent) => {
      const keyName = normalizeKeyName(e) ?? '';

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

  _renderPreventBlurOnInputClick(): void {
    const eventName = addNamespace('mousedown', 'dxTagBox');

    eventsEngine.off(this._inputWrapper(), eventName);
    eventsEngine.on(this._inputWrapper(), eventName, (e: MouseEvent) => {
      if (e.target !== this._input()[0] && this._isFocused()) {
        e.preventDefault();
      }
    });
  }

  _renderInputValueImpl(): DeferredObj<unknown> {
    return this._renderMultiSelect();
  }

  _loadInputValue(): DeferredObj<unknown> {
    return when();
  }

  _clearTextValue(): void {
    this._input().val('');
    this._toggleEmptinessEventHandler();
    this.option('text', '');
  }

  _focusInHandler(e: DxEvent<FocusEvent>): void {
    if (!this._preventNestedFocusEvent(e)) {
      this._scrollContainer('end');
    }

    super._focusInHandler(e);
  }

  _renderInputValue(...args: Parameters<SelectBox['_renderInputValue']>): ReturnType<SelectBox['_renderInputValue']> {
    this.option('displayValue', this._searchValue());

    return super._renderInputValue(...args);
  }

  _restoreInputText(saveEditingValue?: boolean): void {
    if (!saveEditingValue) {
      this._clearTextValue();
    }
  }

  _focusOutHandler(e: DxEvent<FocusEvent>): void {
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

  _listConfig(): ListBaseProperties {
    const {
      showSelectionControls, maxFilterQueryLength, selectAllText, selectAllMode,
    } = this.option();
    const selectionMode = showSelectionControls ? 'all' : 'multiple';

    return extend(super._listConfig(), {
      maxFilterLengthInRequest: maxFilterQueryLength,
      selectionMode,
      selectAllText,
      onSelectAllValueChanged: ({ value }: { value: boolean }) => {
        this._selectAllValueChangeAction?.({ value });
      },
      selectAllMode,
      selectedItems: this._selectedItems,
      onFocusedItemChanged: null,
    }) as ListBaseProperties;
  }

  _renderMultiSelect(): DeferredObj<unknown> {
    const d = Deferred();

    this._updateTagsContainer(this._$textEditorInputContainer);
    this._renderInputSize();
    this._renderTags()
      // @ts-expect-error _renderTags returns jQuery Deferred; .done/.fail not on standard Promise
      .done(d.resolve)
      .fail(d.reject);

    // @ts-expect-error d.promise() return type is incompatible with DeferredObj<unknown>
    return d.promise();
  }

  _listItemClickHandler(e?: ItemClickEvent): void {
    const { showSelectionControls, applyValueMode } = this.option();
    if (!showSelectionControls) {
      this._clearTextValue();
    }
    if (applyValueMode === 'useButtons') {
      return;
    }

    super._listItemClickHandler(e);
    this._saveValueChangeEvent(undefined);
  }

  _shouldClearFilter(): boolean {
    const shouldClearFilter = super._shouldClearFilter();
    const { showSelectionControls } = this.option();

    return !showSelectionControls && Boolean(shouldClearFilter);
  }

  _renderInputSize(): void {
    const $input = this._input();
    const value = $input.val();
    const isEmptyInput = isString(value) && value;
    const cursorWidth = 5;
    let width = '';
    let size: string | number = '';
    const { searchEnabled, acceptCustomValue } = this.option();
    const canTypeText = searchEnabled || acceptCustomValue;
    if (isEmptyInput && canTypeText) {
      const $calculationElement = createTextElementHiddenCopy(
        $input,
        value,
        { includePaddings: true },
      );

      $calculationElement.insertAfter($input);
      width = getOuterWidth($calculationElement) + cursorWidth;

      $calculationElement.remove();
    } else if (!value) {
      size = 1;
    }

    $input.css('width', width);
    $input.attr('size', size);
  }

  _renderInputSubstitution(): void {
    super._renderInputSubstitution();
    this._updateWidgetHeight();
  }

  _getValue(): TagBoxItem[] {
    const { value } = this.option();

    return value || [];
  }

  _multiTagRequired(): boolean {
    const values = this._getValue();
    const { maxDisplayedTags } = this.option();

    return isDefined(maxDisplayedTags) && values.length > maxDisplayedTags;
  }

  _renderMultiTag($input: dxElementWrapper): dxElementWrapper | false {
    const tagId = `dx-${new Guid()}`;

    const $tag = $('<div>')
      .attr('id', tagId)
      .addClass(TAGBOX_TAG_CLASS)
      .addClass(TAGBOX_MULTI_TAG_CLASS);

    const { selectedItems } = this.option();

    const args: MultiTagPreparingArgs = {
      multiTagElement: getPublicElement($tag),
      selectedItems: selectedItems ?? [],
    };

    this._multiTagPreparingAction?.(args);

    if (args.cancel) {
      return false;
    }

    $tag.data(TAGBOX_TAG_DATA_KEY, args.text);
    $tag.insertBefore($input);

    this._tagTemplate?.render({
      model: args.text,
      container: getPublicElement($tag),
    });

    this._setTagAria($tag, args.text);
    this._updateElementAria(tagId);

    return $tag;
  }

  _getFilter(creator: FilterCreatorInstance): unknown[] | undefined {
    // @ts-expect-error fix argument type in m_data_controller.ts
    const dataSourceFilter = this._dataController.filter();
    const { valueExpr, maxFilterQueryLength } = this.option();
    const filterExpr = creator.getCombinedFilter(valueExpr, dataSourceFilter);
    const filterQueryLength = encodeURI(JSON.stringify(filterExpr)).length;
    if (filterQueryLength <= (maxFilterQueryLength ?? Infinity)) {
      return filterExpr;
    }

    errors.log('W1019', maxFilterQueryLength);
    return undefined;
  }

  _getFilteredItems(values: unknown[]): Promise<unknown> {
    this._loadFilteredItemsPromise?.reject();
    const creator = new FilterCreator(values) as unknown as FilterCreatorInstance;

    const { selectedItems: listSelectedItems } = this._list?.option() ?? {};
    const isListItemsLoaded = !!listSelectedItems && this._list?._dataController.isLoaded();
    const { selectedItems: optionSelectedItems } = this.option();
    const selectedItems = (listSelectedItems ?? optionSelectedItems) as unknown[];
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const clientFilterFunction = creator.getLocalFilter(this._valueGetter);
    const filteredItems = selectedItems.filter(clientFilterFunction as (item: unknown) => boolean);
    const selectedItemsAlreadyLoaded = filteredItems.length === values.length;
    const d = Deferred<unknown>();
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
      .done((data: unknown, extra: unknown) => {
        this._isDataSourceChanged = false;
        this._isDataSourceOptionChanged = false;
        if (this._disposed) {
          d.reject();
          return;
        }

        const { data: items } = normalizeLoadResult(data, extra);
        const mappedItems = dataController.applyMapFunction(items);
        d.resolve(mappedItems.filter(clientFilterFunction as (item: unknown) => boolean));
      })
      .fail(d.reject);

    this._loadFilteredItemsPromise = d;
    return d.promise();
  }

  _createTagsData(values: unknown[], filteredItems: TagBoxItem[]): Promise<TagBoxItem[]> {
    const items: TagBoxItem[] = [];
    const cache = {};
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    const isValueExprSpecified = this._valueGetterExpr() === 'this';
    const { acceptCustomValue } = this.option();
    const filteredValues: Record<string, TagBoxItem> = {};

    filteredItems.forEach((filteredItem) => {
      const filteredItemValue = isValueExprSpecified
        ? JSON.stringify(filteredItem)
        // @ts-expect-error _valueGetter is injected by DataExpressionMixin
        : this._valueGetter(filteredItem);

      filteredValues[filteredItemValue] = filteredItem;
    });

    const loadItemPromises: unknown[] = [];

    values.forEach((value, index) => {
      const currentItem = filteredValues[
        isValueExprSpecified ? JSON.stringify(value) : value as string
      ];

      if (isValueExprSpecified && !isDefined(currentItem)) {
        if (!this._dataSource) {
          return;
        }

        loadItemPromises.push(
          this._loadItem(value, cache)
            .done((item) => {
              const newItem = this._createTagData(item, value);
              items.splice(index, 0, newItem);
            })
            .fail(() => {
              if (acceptCustomValue) {
                const newItem = this._createTagData(undefined, value);
                items.splice(index, 0, newItem);
              }
            }),
        );
      } else {
        const newItem = this._createTagData(currentItem, value);
        items.splice(index, 0, newItem);
      }
    });

    const d = Deferred<TagBoxItem[]>();
    when.apply(this, loadItemPromises).always(() => {
      d.resolve(items);
    });

    return d.promise();
  }

  _createTagData(item: TagBoxItem | undefined, value: unknown): TagBoxItem {
    if (isDefined(item)) {
      this._selectedItems?.push(item);
      return item;
    }
    const { selectedItem } = this.option();
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const customItem = this._valueGetter(selectedItem) === value ? selectedItem : value;

    return customItem;
  }

  _isGroupedData(): boolean {
    const { grouped } = this.option();

    return Boolean(grouped) && !this._dataController.group();
  }

  _getItemsByValues(values: unknown[]): TagBoxItem[] {
    const resultItems: TagBoxItem[] = [];
    values.forEach((value) => {
      const item = this._getItemFromPlain(value);
      if (isDefined(item)) {
        resultItems.push(item);
      }
    });
    return resultItems;
  }

  _getFilteredGroupedItems(values: unknown[]): Promise<TagBoxItem[]> {
    const selectedItems = Deferred<TagBoxItem[]>();

    if (this._filteredGroupedItemsLoadPromise) {
      // @ts-expect-error operationId is a runtime augmentation not in DeferredObj types
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

  _loadTagsData(): Promise<TagBoxItem[]> {
    const values = this._getValue();
    const tagData = Deferred<TagBoxItem[]>();

    this._selectedItems = [];

    const filteredItemsPromise = this._isGroupedData()
      ? this._getFilteredGroupedItems(values)
      : this._getFilteredItems(values);

    filteredItemsPromise
      // @ts-expect-error .done() is a jQuery-style extension not on standard Promise
      .done((filteredItems: TagBoxItem[]) => {
        const items = this._createTagsData(values, filteredItems);
        // @ts-expect-error .always() is a jQuery-style extension not on standard Promise
        items.always((data: TagBoxItem[]) => {
          tagData.resolve(data);
        });
      })
      .fail(tagData.reject.bind(this));

    return tagData.promise();
  }

  _renderTags(): Promise<undefined> {
    const d = Deferred<undefined>();
    let isPlainDataUsed = false;
    const valuesToUpdate = this._valuesToUpdate;

    if (valuesToUpdate && this._shouldGetItemsFromPlain(valuesToUpdate)) {
      this._selectedItems = this._getItemsFromPlain(valuesToUpdate);

      if (this._selectedItems.length === valuesToUpdate.length) {
        this._tagsToRender = this._sortSelectedItemsByValues(
          this._selectedItems,
          valuesToUpdate,
        );
        this._renderTagsImpl();
        isPlainDataUsed = true;
        d.resolve();
      }
    }

    if (!isPlainDataUsed) {
      this._loadTagsData()
        // @ts-expect-error .done() is a jQuery-style extension not on standard Promise
        .done((items: TagBoxItem[]) => {
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
      this.option('selectedItems', this._selectedItems?.slice());
    }

    const fieldTemplate = this._getFieldTemplate();
    if (!fieldTemplate) {
      this._cleanTags();
      this._renderTagsCore();
    }
  }

  _shouldGetItemsFromPlain(values: unknown[]): boolean {
    return Boolean(
      values
      && this._dataController.isLoaded()
      && values.length <= this._getPlainItems().length,
    );
  }

  _getItemsFromPlain(values: unknown[]): TagBoxItem[] {
    let selectedItems = this._getSelectedItemsFromList(values);
    const needFilterPlainItems = (selectedItems.length === 0 && values.length > 0)
      || (selectedItems.length < values.length);

    if (needFilterPlainItems) {
      const plainItems = this._getPlainItems();
      selectedItems = this._filterSelectedItems(plainItems, values);
    }

    return selectedItems;
  }

  _getSelectedItemsFromList(values: unknown[]): TagBoxItem[] {
    const { selectedItems: listSelectedItems } = this._list
      ? this._list.option()
      : { selectedItems: [] };

    let selectedItems: TagBoxItem[] = [];
    if (values.length === listSelectedItems?.length) {
      selectedItems = this._filterSelectedItems(listSelectedItems, values);
    }

    return selectedItems;
  }

  _shouldUseClickOrderForTags(values: unknown[]): boolean {
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    }, []);

    return selectedByOrderItems;
  }

  _filterSelectedItems(plainItems: TagBoxItem[], values: unknown[]): TagBoxItem[] {
    return plainItems.filter((dataItem: TagBoxItem) => values.some((currentValue) => {
      if (isObject(currentValue)) {
        // @ts-expect-error _isValueEquals is injected by DataExpressionMixin
        return this._isValueEquals(dataItem, currentValue);
      }
      // @ts-expect-error _valueGetter/_isValueEquals are injected by DataExpressionMixin
      return this._isValueEquals(this._valueGetter(dataItem), currentValue);
    }));
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
    this._renderTagsElements(this._tagsToRender ?? []);
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

  _renderTagsElements(items: TagBoxItem[]): void {
    const $multiTag = this._multiTagRequired() && this._renderMultiTag(this._input());
    const { showMultiTagOnly, maxDisplayedTags } = this.option();

    items.forEach((item, index) => {
      const isOverMaxDisplayed = isDefined(maxDisplayedTags)
        && index - maxDisplayedTags >= -1;
      if ($multiTag && (showMultiTagOnly || isOverMaxDisplayed)) {
        return;
      }
      this._renderTag(item, $multiTag || this._input());
    });

    if (this._isFocused()) {
      this._scrollContainer('end');
    }

    this._refreshTagElements();
  }

  _cleanTags(): void {
    if (this._multiTagRequired()) {
      this._tagElements()?.remove();
    } else {
      const $tags = this._tagElements();

      const { selectedItems = [] } = this.option();
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const values = selectedItems.map((item) => this._valueGetter(item));

      Array.from($tags as unknown as ArrayLike<Element>).forEach((tag) => {
        const $tag = $(tag);
        const tagData: TagBoxItem = $tag.data(TAGBOX_TAG_DATA_KEY);
        if (!values.includes(tagData)) {
          $tag.remove();
        }
      });
    }

    this._updateElementAria();
  }

  _renderEmptyState(): void {
    const isEmpty = !(this._getValue().length
      || this._selectedItems?.length
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

  _tagElements(): dxElementWrapper | undefined {
    return this._tagElementsCache;
  }

  _applyTagTemplate(item: TagBoxItem, $tag: dxElementWrapper): void {
    this._tagTemplate?.render({
      model: item,
      container: getPublicElement($tag),
    });
  }

  _renderTag(item: TagBoxItem, $input: dxElementWrapper): void {
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const value = this._valueGetter(item);

    if (!isDefined(value)) {
      return;
    }

    let $tag = this._getTag(value);
    // @ts-expect-error DataExpressionMixin must be typed
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

  _setTagAria($tag: dxElementWrapper, tagText: TagBoxItem): void {
    const aria = {
      role: 'button',
      label: tagText,
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxTagBox-tagRoleDescription'),
    };

    this.setAria(aria, $tag);
  }

  _getItemModel(item: TagBoxItem, displayValue: TagBoxItem): TagBoxItem {
    if (isObject(item) && isDefined(displayValue)) {
      return item;
    }
    return ensureDefined(displayValue, '');
  }

  _getTag(value: TagBoxItem): dxElementWrapper | false {
    const $tags = this._tagElements();
    if (!$tags) {
      return false;
    }

    for (const tag of Array.from($tags as unknown as ArrayLike<Element>)) {
      const tagData: TagBoxItem = elementData(tag, TAGBOX_TAG_DATA_KEY);

      if (value === tagData || equalByValue(value, tagData)) {
        return $(tag);
      }
    }
    return false;
  }

  _createTag(
    value: TagBoxItem,
    $input: dxElementWrapper,
    tagId: string,
    displayValue: TagBoxItem,
  ): dxElementWrapper {
    return $('<div>')
      .attr('id', tagId)
      .addClass(TAGBOX_TAG_CLASS)
      .data(TAGBOX_TAG_DATA_KEY, value)
      .data(TAGBOX_TAG_DISPLAY_VALUE, displayValue)
      .insertBefore($input);
  }

  _toggleEmptinessEventHandler(): void {
    this._toggleEmptiness(!this._getValue().length && !this._searchValue().length);
  }

  _customItemAddedHandler(e: KeyboardEvent): void {
    super._customItemAddedHandler(e);
    this._clearTextValue();
  }

  _removeTagHandler(args: { event: Event }): void {
    const e = args.event;

    e.stopPropagation();
    this._saveValueChangeEvent(e);

    const $tag = $(e.target as Element).closest(`.${TAGBOX_TAG_CLASS}`);
    this._removeTagElement($tag);
  }

  _removeTagElement($tag: dxElementWrapper): void {
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

  _updateField(): void {}

  _removeTagWithUpdate(itemValue: TagBoxItem): void {
    const value = this._getValue().slice();
    this._removeTag(value, itemValue);
    this.option('value', value);
    this.option('selectedItem', null);

    if (value.length === 0) {
      this._clearTagFocus();
    }
  }

  _getCurrentValue(): TagBoxItem {
    return this._lastValue();
  }

  _selectionChangeHandler(e: ListSelectionChangedEvent): void {
    const { applyValueMode, value: currentValue } = this.option();

    if (applyValueMode === 'useButtons') {
      return;
    }

    const value = this._getValue().slice();

    e.removedItems.forEach((removedItem: TagBoxItem) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      this._removeTag(value, this._valueGetter(removedItem));
    });

    e.addedItems.forEach((addedItem: TagBoxItem) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      this._addTag(value, this._valueGetter(addedItem));
    });

    this._updateWidgetHeight();

    const { selectedItemKeys } = this._list?.option() ?? {};

    if (!equalByValue(selectedItemKeys, currentValue)) {
      const listSelectionChangeEvent = this._list?._getSelectionChangeEvent();
      if (listSelectionChangeEvent) {
        this._saveValueChangeEvent(listSelectionChangeEvent);
      }
      this.option('value', value);
    }

    this._list?._saveSelectionChangeEvent(undefined);
  }

  _removeTag(value: unknown[], item: TagBoxItem): void {
    const index = this._valueIndex(item, value);

    if (index >= 0) {
      value.splice(index, 1);
    }
  }

  _addTag(value: unknown[], item: TagBoxItem): void {
    const index = this._valueIndex(item);

    if (index < 0) {
      value.push(item);
    }
  }

  _fieldRenderData(): TagBoxItem[] | undefined {
    return this._selectedItems?.slice();
  }

  _completeSelection(value: TagBoxItem): void {
    const { showSelectionControls } = this.option();
    if (!showSelectionControls) {
      this._setValue(value);
    }
  }

  _setValue(value: TagBoxItem): void {
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

  _isSelectedValue(value: TagBoxItem, cache?: ValueIndexCache): boolean {
    return this._valueIndex(value, null, cache) > -1;
  }

  _valueIndex(
    value: TagBoxItem,
    values?: unknown[] | null,
    cache?: ValueIndexCache,
  ): number {
    if (cache && typeof value !== 'object') {
      if (!cache.indexByValues) {
        const indexByValues: Record<string, number> = {};
        cache.indexByValues = indexByValues;
        const resolvedForCache = values ?? this._getValue();
        resolvedForCache.forEach((item, index) => {
          indexByValues[String(item)] = index;
        });
      }

      if (String(value) in cache.indexByValues) {
        return cache.indexByValues[String(value)];
      }
    }

    const resolvedValues = values ?? this._getValue();

    // @ts-expect-error _isValueEquals is injected by DataExpressionMixin
    return resolvedValues.findIndex((selectedValue) => this._isValueEquals(value, selectedValue));
  }

  _lastValue(): TagBoxItem {
    const values = this._getValue();
    const lastValue = values[values.length - 1];
    return lastValue ?? null;
  }

  _shouldRenderSearchEvent(): boolean | undefined {
    const { searchEnabled, acceptCustomValue } = this.option();
    return searchEnabled || acceptCustomValue;
  }

  _searchHandler(e?: InputEvent | CompositionEvent): void {
    const { searchEnabled } = this.option();
    if (searchEnabled && !!e && !this._isTagRemoved) {
      super._searchHandler(e);
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
    const { opened } = this.option();

    if (this._popup && opened && this._isEditable() && currentHeight !== originalHeight) {
      this._popup.repaint();
    }
  }

  _refreshSelected(): void {
    // @ts-expect-error Fix on list level
    if (this._list?.getDataSource()) {
      this._list.option('selectedItems', this._selectedItems);
    }
  }

  _resetListDataSourceFilter(): void {
    const dataController = this._dataController;
    delete this._userFilter;

    dataController.filter(null);
    dataController.reload();
  }

  _setListDataSourceFilter(): void {
    const { hideSelectedItems } = this.option();
    if (!hideSelectedItems || !this._list) {
      return;
    }

    const dataController = this._dataController;
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    const valueGetterExpr = this._valueGetterExpr();

    if (isString(valueGetterExpr) && valueGetterExpr !== 'this') {
      const filter = this._dataSourceFilterExpr();

      if (this._userFilter === undefined) {
        this._userFilter = dataController.filter(undefined) || null;
      }
      if (this._userFilter) {
        filter.push(this._userFilter);
      }

      if (filter.length) {
        dataController.filter(filter);
      } else {
        dataController.filter(null);
      }
    } else {
      dataController.filter(this._dataSourceFilterFunction.bind(this));
    }

    dataController.load();
  }

  _dataSourceFilterExpr(): unknown[] {
    // @ts-expect-error _valueGetterExpr is injected by DataExpressionMixin
    return this._getValue().map((value) => ['!', [this._valueGetterExpr(), value]]);
  }

  _dataSourceFilterFunction(itemData: TagBoxItem): boolean {
    // @ts-expect-error _valueGetter is injected by DataExpressionMixin
    const itemValue = this._valueGetter(itemData);

    // @ts-expect-error _isValueEquals is injected by DataExpressionMixin
    return !this._getValue().some((value) => this._isValueEquals(value, itemValue));
  }

  _dataSourceChangedHandler(...args: Parameters<SelectBox['_dataSourceChangedHandler']>): void {
    this._isDataSourceChanged = true;
    super._dataSourceChangedHandler(...args);
  }

  _applyButtonHandler(args?: { event?: Event }): void {
    this._saveValueChangeEvent(args?.event);
    this.option('value', this._getSortedListValues());
    this._clearTextValue();
    super._applyButtonHandler();
    this._cancelSearchIfNeed();
  }

  _getSortedListValues(): TagBoxItem[] {
    const listValues = this._getListValues();
    const { value } = this.option();
    const currentValue = value || [];
    const existedItems = listValues.length ? getIntersection(currentValue, listValues) : [];
    const newItems = existedItems.length
      // @ts-expect-error fix on core/m_array level
      ? removeDuplicates(listValues, currentValue)
      : listValues;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return existedItems.concat(newItems);
  }

  _getListValues(): TagBoxItem[] {
    if (!this._list) {
      return [];
    }

    const { selectedItems } = this._list.option();

    return this
      ._getPlainItems(selectedItems)
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((item) => this._valueGetter(item)) as TagBoxItem[];
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
    const { applyValueMode, opened } = this.option();
    if (applyValueMode === 'useButtons' && !opened) {
      this._refreshSelected();
    }
  }

  clear(): void {
    this._restoreInputText();
    const defaultValue = this._getDefaultOptions().value;
    const { value: currentValue } = this.option();
    if (defaultValue?.length === 0
      && defaultValue.length === currentValue?.length
    ) {
      return;
    }
    super.clear();
  }

  _clean(): void {
    super._clean();
    this._valuesToUpdate = undefined;
    this._tagTemplate = undefined;
    this._tagsToRender = undefined;
    this._$tagsContainer = undefined;
  }

  _getSelectedItemsDifference(
    newItems: TagBoxItem[],
    previousItems: TagBoxItem[],
  ): { addedItems: TagBoxItem[]; removedItems: TagBoxItem[] } {
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

    const previousItemsValuesMap = previousItems.reduce<SelectedItemsMap>((map, item) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const value = this._valueGetter(item);
      map[value] = item;
      return map;
    }, {});

    const addedItems: TagBoxItem[] = [];
    newItems.forEach((item) => {
      // @ts-expect-error _valueGetter is injected by DataExpressionMixin
      const value = this._valueGetter(item);
      if (!previousItemsValuesMap[value]) {
        addedItems.push(item);
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete previousItemsValuesMap[value];
    });

    return {
      addedItems,
      removedItems: Object.values(previousItemsValuesMap),
    };
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value, previousValue } = args;
    switch (name) {
      case 'onSelectAllValueChanged':
        this._initSelectAllValueChangedAction();
        break;
      case 'onMultiTagPreparing':
        this._initMultiTagPreparingAction();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
        this._setListOption('selectAllText', value);
        break;
      case 'readOnly':
      case 'disabled':
        super._optionChanged(args);
        if (!value) {
          this._refreshEvents();
        }
        break;
      case 'value':
        this._valuesToUpdate = value as unknown[];
        super._optionChanged(args);
        this._valuesToUpdate = undefined;
        this._setListDataSourceFilter();
        break;
      case 'maxDisplayedTags':
      case 'showMultiTagOnly':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._renderTags();
        break;
      case 'selectAllMode':
        this._setListOption(name, value);
        break;
      case 'selectedItem':
        break;
      case 'selectedItems':
        this._selectionChangedAction(this._getSelectedItemsDifference(
          value as TagBoxItem[],
          previousValue as TagBoxItem[],
        ));
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

  _getActualSearchValue(): string {
    return super._getActualSearchValue() || this._searchValue();
  }

  _popupHidingHandler(): void {
    super._popupHidingHandler();
    this._clearFilter();
  }
}

registerComponent('dxTagBox', TagBox);

export default TagBox;
