import type { SearchMode } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { ValueChangedEvent } from '@js/ui/text_box';
import TextBox from '@js/ui/text_box';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';

export type SearchBoxControllerOptions = SearchBoxMixinOptions & {
  tabIndex?: number;
  onValueChanged?: (value: string) => void;
};

export const getOperationBySearchMode = (searchMode?: SearchMode): string | undefined => (searchMode === 'equals' ? '=' : searchMode);

class SearchBoxController {
  _createEditor!: (
    $element: dxElementWrapper,
    component: typeof TextBox,
    options: Record<string, unknown>,
  ) => TextBox;

  _widgetPrefix: string;

  _editorWidget: typeof TextBox = TextBox;

  _$element!: dxElementWrapper | null;

  _editor!: TextBox | null;

  _valueChangeDeferred!: DeferredObj<unknown>;

  // eslint-disable-next-line no-restricted-globals
  _valueChangeTimeout!: ReturnType<typeof setTimeout>;

  _onValueChange?: (value: string) => void;

  constructor({
    createEditor,
    widgetPrefix,
    editorWidget = TextBox,
  }) {
    this._createEditor = createEditor;
    this._widgetPrefix = widgetPrefix;
    this._editorWidget = editorWidget;
  }

  render($container: dxElementWrapper, options: SearchBoxControllerOptions): void {
    const rootElementClassName = this._addWidgetPrefix('with-search');
    const searchBoxClassName = this._addWidgetPrefix('search');
    const { searchEnabled, onValueChanged } = options;

    this._onValueChange = onValueChanged;

    if (!searchEnabled) {
      $container.removeClass(rootElementClassName);
      this.remove();
      return;
    }

    // const editorOptions = this._getEditorOptions(options);

    if (this._editor) {
      // this._editor.option(editorOptions);
      this.updateEditorOptions(options);
    } else {
      const editorOptions = this._getEditorOptions(options);
      $container.addClass(rootElementClassName);
      this._$element = $('<div>').addClass(searchBoxClassName).prependTo($container);
      this._editor = this._createEditor(this._$element, this._editorWidget, editorOptions);
    }
  }

  updateEditorOptions(options: SearchBoxControllerOptions): void {
    const editorOptions = this._getEditorOptions(options);
    this._editor?.option(editorOptions);
  }

  _getEditorOptions(options: SearchBoxControllerOptions): any {
    const {
      tabIndex,
      searchValue,
      searchEditorOptions,
      searchTimeout,
    } = options;
    const placeholder = messageLocalization.format('Search');

    return {
      mode: 'search',
      placeholder,
      tabIndex,
      value: searchValue,
      valueChangeEvent: 'input',
      inputAttr: { 'aria-label': placeholder },
      onValueChanged: (e: ValueChangedEvent): void => this._onValueChanged(e, searchTimeout),
      ...searchEditorOptions,
    };
  }

  _onValueChanged(e: ValueChangedEvent, searchTimeout = 0): void {
    this._valueChangeDeferred = Deferred();
    clearTimeout(this._valueChangeTimeout);

    this._valueChangeDeferred.done((): void => {
      this._onValueChange?.(e.value);
    });

    if (e.event?.type === 'input' && searchTimeout) {
      // eslint-disable-next-line no-restricted-globals
      this._valueChangeTimeout = setTimeout((): void => {
        this._valueChangeDeferred?.resolve();
      }, searchTimeout);
    } else {
      this._valueChangeDeferred?.resolve();
    }
  }

  resolveValueChange(): void {
    this._valueChangeDeferred?.resolve();
  }

  remove(): void {
    this._$element?.remove();
    this._$element = null;
    this._editor = null;
  }

  focus(): void {
    this._editor?.focus();
  }

  dispose(): void {
    this.remove();
  }

  _addWidgetPrefix(className: string): string {
    return `${this._widgetPrefix}-${className}`;
  }
}

export default SearchBoxController;
