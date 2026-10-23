import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isString } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { dxHtmlEditorMention } from '@js/ui/html_editor';
import type { Properties as ListProperties } from '@js/ui/list';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type List from '@ts/ui/list/list.edit.search';
import Quill from 'devextreme-quill';

import Mention from '../formats/mention';
import type {
  Delta,
  DeltaConstructor,
  DeltaOperation,
  KeyboardModule,
  QuillInstance,
} from '../types/quill';
import type { BaseHtmlEditorModule, BaseModuleOptions } from './base';
import BaseModule from './base';
import PopupModule from './popup';

interface MentionModuleDefaults {
  dataSource: null;
  itemTemplate: string;
  valueExpr: string;
  displayExpr: string;
  template: null;
  searchExpr: null;
  searchTimeout: number;
  minSearchLength: number;
}

interface MentionModuleOptionsInput extends BaseModuleOptions {
  mentions: dxHtmlEditorMention[];
}

interface MentionModuleOptions extends MentionModuleOptionsInput, MentionModuleDefaults {}

type MentionModuleClass = new (
  quill: QuillInstance,
  options: MentionModuleOptionsInput,
) => BaseHtmlEditorModule;

interface MentionConfig extends Omit<dxHtmlEditorMention, 'template' | 'searchExpr'> {
  marker: string;
  itemTemplate: NonNullable<dxHtmlEditorMention['itemTemplate']>;
  valueExpr: NonNullable<dxHtmlEditorMention['valueExpr']>;
  displayExpr: NonNullable<dxHtmlEditorMention['displayExpr']>;
  template: NonNullable<dxHtmlEditorMention['template']> | null;
  searchExpr: NonNullable<dxHtmlEditorMention['searchExpr']> | null;
  searchTimeout: number;
  minSearchLength: number;
}

type ItemGetter = (item: unknown) => unknown;

type MoveDirection = 'prev' | 'next';

interface MentionPopupPosition {
  of: DxEvent;
  offset: { v: number };
  my: 'top left';
  at: 'top left';
  collision: PositionConfig['collision'];
}

// eslint-disable-next-line import/no-mutable-exports
let MentionModule: MentionModuleClass = BaseModule;

if (Quill) {
  const USER_ACTION = 'user';
  const DEFAULT_MARKER = '@';

  const KEYS = {
    ARROW_UP: 'upArrow',
    ARROW_DOWN: 'downArrow',
    ARROW_LEFT: 'leftArrow',
    ARROW_RIGHT: 'rightArrow',
    ENTER: 'enter',
    ESCAPE: 'escape',
    SPACE: 'space',
    PAGE_UP: 'pageUp',
    PAGE_DOWN: 'pageDown',
    END: 'end',
    HOME: 'home',
  };

  const NAVIGATION_KEYS = [
    KEYS.ARROW_LEFT,
    KEYS.ARROW_RIGHT,
    KEYS.PAGE_UP,
    KEYS.PAGE_DOWN,
    KEYS.END,
    KEYS.HOME,
  ];

  const ALLOWED_PREFIX_CHARS = [' ', '\n'];

  const DISABLED_STATE_CLASS = 'dx-state-disabled';

  Quill.register({ 'formats/mention': Mention }, true);
  MentionModule = class extends PopupModule {
    declare options: MentionModuleOptions;

    declare _list: List;

    _searchTimer?: ReturnType<typeof setTimeout>;

    _mentions: Record<string, MentionConfig>;

    _isMentionActive?: boolean;

    _valueGetter!: ItemGetter;

    _idGetter!: ItemGetter;

    _searchValue!: string;

    _activeMentionConfig!: MentionConfig;

    _hasSearch?: boolean;

    constructor(quill: QuillInstance, options: MentionModuleOptionsInput) {
      super(quill, options);
      this._mentions = {};

      options.mentions.forEach((item) => {
        let { marker } = item;
        if (!marker) {
          marker = DEFAULT_MARKER;
          item.marker = marker;
        }

        const { template } = item;
        if (template) {
          const preparedTemplate = this.editorInstance._getTemplate(template);
          if (preparedTemplate) {
            // @ts-expect-error Mention is a QuillDependent: the no-Quill stand-in has no templates
            Mention.addTemplate({
              marker,
              editorKey: this.editorInstance.getMentionKeyInTemplateStorage(),
            }, preparedTemplate);
          }
        }

        // @ts-expect-error marker is set above when the item has none; extend() keeps it optional
        this._mentions[marker] = extend({}, this._getDefaultOptions(), item);
      });

      this._attachKeyboardHandlers();
      this.addCleanCallback(this.clean.bind(this));
      this.quill.on('text-change', this.onTextChange.bind(this));
    }

    _getDefaultOptions(): MentionModuleDefaults {
      const baseConfig = super._getDefaultOptions();

      return extend(baseConfig, {
        itemTemplate: 'item',
        valueExpr: 'this',
        displayExpr: 'this',
        template: null,
        searchExpr: null,
        searchTimeout: 500,
        minSearchLength: 0,
      });
    }

    _attachKeyboardHandlers(): void {
      const keyboardModule: KeyboardModule = this.quill.keyboard;

      keyboardModule.addBinding({
        key: KEYS.ARROW_UP,
      }, this._moveToItem.bind(this, 'prev'));

      keyboardModule.addBinding({
        key: KEYS.ARROW_DOWN,
      }, this._moveToItem.bind(this, 'next'));

      keyboardModule.addBinding({
        key: [KEYS.ENTER, KEYS.SPACE],
      }, this._selectItemHandler.bind(this));

      const enterBindings = keyboardModule.bindings[KEYS.ENTER];
      // @ts-expect-error pop() is typed as possibly undefined; the binding added above is there
      enterBindings.unshift(enterBindings.pop());

      keyboardModule.addBinding({
        key: KEYS.ESCAPE,
      }, this._escapeKeyHandler.bind(this));

      keyboardModule.addBinding({
        key: [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT],
        shiftKey: true,
      }, this._ignoreKeyHandler.bind(this));

      keyboardModule.addBinding({
        key: NAVIGATION_KEYS,
      }, this._ignoreKeyHandler.bind(this));
    }

    _moveToItem(direction: MoveDirection): boolean {
      // @ts-expect-error getDataSource is mixed in by DataHelperMixin at runtime; not on the type
      const dataSource = this._list.getDataSource();

      if (this._isMentionActive && !dataSource.isLoading()) {
        const $focusedItem = $(this._list.option('focusedElement'));
        const defaultItemPosition = direction === 'next' ? 'first' : 'last';
        let $nextItem = $focusedItem[direction]();

        $nextItem = $nextItem.length ? $nextItem : this._activeListItems[defaultItemPosition]();
        this._list.option('focusedElement', getPublicElement($nextItem));
        this._list.scrollToItem($nextItem);
      }

      return !this._isMentionActive;
    }

    _ignoreKeyHandler(): boolean {
      return !this._isMentionActive;
    }

    _fitIntoRange(value: number, start: number, end: number): number {
      if (value > end) {
        return start;
      }

      if (value < start) {
        return end;
      }

      return value;
    }

    _selectItemHandler(): boolean {
      if (this._isMentionActive) {
        // @ts-expect-error items is optional in the d.ts; the list always holds an array
        if (this._list.option('items').length) {
          // @ts-expect-error selectItem() is typed without null; focusedElement is possibly null
          this._list.selectItem(this._list.option('focusedElement'));
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
          this._popup.hide();
        }
      }
      return !this._isMentionActive;
    }

    _escapeKeyHandler(): boolean {
      if (this._isMentionActive) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
        this._popup.hide();
      }

      return !this._isMentionActive;
    }

    renderList($container: dxElementWrapper, options: ListProperties): void {
      this.compileGetters(this.options);
      super.renderList($container, options);
    }

    compileGetters({ displayExpr, valueExpr }: Pick<MentionConfig, 'displayExpr' | 'valueExpr'>): void {
      // @ts-expect-error compileGetter is typed as (expr: string) => unknown
      this._valueGetter = compileGetter(displayExpr);
      // @ts-expect-error compileGetter is typed as (expr: string) => unknown
      this._idGetter = compileGetter(valueExpr);
    }

    _getListConfig(options: MentionModuleOptions): ListProperties {
      const baseConfig = super._getListConfig(options);

      return extend(baseConfig, {
        itemTemplate: this.options.itemTemplate,
        onContentReady: () => {
          if (this._hasSearch) {
            this._popup.repaint();
            this._focusFirstElement();
            this._hasSearch = false;
          }
        },
      });
    }

    insertEmbedContent(): void {
      const markerLength = this._activeMentionConfig.marker.length;
      const textLength = markerLength + this._searchValue.length;
      const caretPosition = this.getPosition();
      const selectedItem = this._list.option('selectedItem');
      const value = {
        value: this._valueGetter(selectedItem),
        id: this._idGetter(selectedItem),
        marker: this._activeMentionConfig.marker,
        keyInTemplateStorage: this.editorInstance.getMentionKeyInTemplateStorage(),
      };
      const Delta: DeltaConstructor = Quill.import('delta');
      // @ts-expect-error savePosition() runs before the popup is shown
      const startIndex = Math.max(0, caretPosition - markerLength);
      const currentFormat = this.quill.getFormat(startIndex);

      const newDelta = new Delta()
        .retain(startIndex)
        .delete(textLength)
        .insert({ mention: value })
        .insert(' ', currentFormat);

      this.quill.updateContents(newDelta);
      this.quill.setSelection(startIndex + 2);
    }

    _getLastInsertOperation(ops: DeltaOperation[]): DeltaOperation | null {
      const lastOperation = ops[ops.length - 1];
      const isLastOperationInsert = 'insert' in lastOperation;

      if (isLastOperationInsert) {
        return lastOperation;
      }

      const isLastOperationDelete = 'delete' in lastOperation;

      if (isLastOperationDelete && ops.length >= 2) {
        const penultOperation = ops[ops.length - 2];
        const isPenultOperationInsert = 'insert' in penultOperation;
        const isSelectionReplacing = isLastOperationDelete && isPenultOperationInsert;

        if (isSelectionReplacing) {
          return penultOperation;
        }
      }

      return null;
    }

    onTextChange(newDelta: Delta, oldDelta: Delta, source: string): void {
      if (source === USER_ACTION) {
        const lastOperation = newDelta.ops[newDelta.ops.length - 1];

        if (this._isMentionActive && this._isPopupVisible) {
          if (this._processSearchValue(lastOperation)) {
            this._filterList(this._searchValue);
          }
        } else {
          const { ops } = newDelta;
          const lastInsertOperation = this._getLastInsertOperation(ops);

          if (lastInsertOperation) {
            this.checkMentionRequest(lastInsertOperation, ops);
          }
        }
      }
    }

    get _isPopupVisible(): boolean | undefined {
      return this._popup?.option('visible');
    }

    _processSearchValue(operation: DeltaOperation): boolean {
      const isInsertOperation = 'insert' in operation;
      if (isInsertOperation) {
        if (!isString(operation.insert)) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
          this._popup.hide();
          return false;
        }
        this._searchValue += operation.insert;
      } else {
        // @ts-expect-error delete is undefined for a retain op; undefined > 1 is false
        if (!this._searchValue.length || operation.delete > 1) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
          this._popup.hide();
          return false;
        }
        this._searchValue = this._searchValue.slice(0, -1);
      }

      return true;
    }

    checkMentionRequest({ insert }: DeltaOperation, ops: DeltaOperation[]): void {
      const caret = this.quill.getSelection();

      if (!insert || !isString(insert) || !caret || this._isMarkerPartOfText(ops[0].retain)) {
        return;
      }

      this._activeMentionConfig = this._mentions[insert];

      if (this._activeMentionConfig) {
        this._updateList(this._activeMentionConfig);
        // NOTE: Fix of off-by-one error in selection index after insert on a new line.
        // See https://github.com/quilljs/quill/issues/1763.
        const isOnNewLine = caret.index && this._getCharByIndex(caret.index - 1) === '\n';
        this.savePosition(caret.index + Number(isOnNewLine));
        this._popup.option('position', this._popupPosition);
        this._searchValue = '';
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
        this._popup.show();
      }
    }

    _isMarkerPartOfText(retain: number | undefined): boolean {
      // @ts-expect-error includes() is typed for strings; an object insert never matches
      if (!retain || ALLOWED_PREFIX_CHARS.includes(this._getCharByIndex(retain - 1))) {
        return false;
      }

      return true;
    }

    _getCharByIndex(index: number): DeltaOperation['insert'] {
      return this.quill.getContents(index, 1).ops[0].insert;
    }

    _updateList({
      dataSource, displayExpr, valueExpr, itemTemplate, searchExpr,
    }: MentionConfig): void {
      this.compileGetters({ displayExpr, valueExpr });
      this._list.unselectAll();
      this._list.option({
        dataSource,
        displayExpr,
        itemTemplate,
        searchExpr,
      });
    }

    _filterList(searchValue: string): void {
      if (!this._isMinSearchLengthExceeded(searchValue)) {
        this._resetFilter();
        return;
      }

      const { searchTimeout } = this._activeMentionConfig;

      if (searchTimeout) {
        clearTimeout(this._searchTimer);
        this._searchTimer = setTimeout(() => {
          this._search(searchValue);
        }, searchTimeout);
      } else {
        this._search(searchValue);
      }
    }

    _isMinSearchLengthExceeded(searchValue: string): boolean {
      return searchValue.length >= this._activeMentionConfig.minSearchLength;
    }

    _resetFilter(): void {
      clearTimeout(this._searchTimer);
      this._search(null);
    }

    _search(searchValue: string | null): void {
      this._hasSearch = true;
      this._list.option('searchValue', searchValue);
    }

    _focusFirstElement(): void {
      if (!this._list) {
        return;
      }

      const $firstItem = this._activeListItems.first();
      this._list.option('focusedElement', getPublicElement($firstItem));
      this._list.scrollToItem($firstItem);
    }

    _toggleActiveDescendant(shown: boolean): void {
      if (shown) {
        const ariaId = this._list.getFocusedItemId();
        this.quill.root.setAttribute('aria-activedescendant', ariaId);
      } else {
        this.quill.root.removeAttribute('aria-activedescendant');
      }
    }

    get _popupPosition(): MentionPopupPosition {
      const position = this.getPosition();
      const {
        left: mentionLeft,
        top: mentionTop,
        height: mentionHeight,
      // @ts-expect-error savePosition() runs before the popup is shown
      } = this.quill.getBounds(position ? position - 1 : position);
      // @ts-expect-error offset() is typed as possibly undefined
      const { left: leftOffset, top: topOffset } = $(this.quill.root).offset();
      // @ts-expect-error Event is not in the events_engine d.ts
      const positionEvent = eventsEngine.Event('positionEvent', {
        pageX: leftOffset + mentionLeft,
        pageY: topOffset + mentionTop,
      });
      return {
        of: positionEvent,
        offset: {
          v: mentionHeight,
        },
        my: 'top left',
        at: 'top left',
        collision: {
          y: 'flip',
          x: 'flipfit',
        },
      };
    }

    _getPopupConfig(): PopupProperties {
      return extend(super._getPopupConfig(), {
        hideOnParentScroll: false,
        onShown: () => {
          this._toggleActiveDescendant(true);
          this._isMentionActive = true;
          this._hasSearch = false;
          this._focusFirstElement();
        },
        onHidden: () => {
          this._toggleActiveDescendant(false);
          this._list.unselectAll();
          this._list.option('focusedElement', null);
          this._isMentionActive = false;
          this._search(null);
        },
        focusStateEnabled: false,
      });
    }

    get _activeListItems(): dxElementWrapper {
      return this._list.itemElements().filter(`:not(.${DISABLED_STATE_CLASS})`);
    }

    clean(): void {
      Object.keys(this._mentions).forEach((marker) => {
        if (this._mentions[marker].template) {
          // @ts-expect-error Mention is a QuillDependent: the no-Quill stand-in has no templates
          Mention.removeTemplate({
            marker,
            editorKey: this.editorInstance.getMentionKeyInTemplateStorage(),
          });
        }
      });
    }
  };
}

export default MentionModule;
