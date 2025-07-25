import type { SearchMode } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { ValueChangedEvent } from '@js/ui/text_box';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import { stubComponent } from '@ts/core/utils/m_stubs';
import type TextBox from '@ts/ui/text_box/m_text_box';

export const getOperationBySearchMode = (searchMode?: SearchMode): string | undefined => (searchMode === 'equals' ? '=' : searchMode);

export type SearchBoxControllerOptions = SearchBoxMixinOptions & {
  tabIndex?: number;
  onValueChanged?: (value: string) => void;
};

interface SearchBoxControllerProps {
  createEditor: (
    $element: dxElementWrapper,
    component: TextBox,
    options: Record<string, unknown>,
  ) => TextBox;
  widgetPrefix: string;
}

class SearchBoxController {
  _createEditor: SearchBoxControllerProps['createEditor'];

  _widgetPrefix: string;

  _$element!: dxElementWrapper | null;

  _editor!: TextBox | null;

  _valueChangeDeferred!: DeferredObj<unknown>;

  // eslint-disable-next-line no-restricted-globals
  _valueChangeTimeout!: ReturnType<typeof setTimeout>;

  _onSearchBoxValueChanged?: (value: string) => void;

  static EditorClass: ReturnType<typeof stubComponent> = stubComponent<TextBox>('TextBox');

  constructor({
    createEditor,
    widgetPrefix,
  }: SearchBoxControllerProps) {
    this._createEditor = createEditor;
    this._widgetPrefix = widgetPrefix;
  }

  static setEditorClass(value): void {
    SearchBoxController.EditorClass = value;
  }

  render($container: dxElementWrapper, options: SearchBoxControllerOptions): void {
    const rootElementClassName = this._addWidgetPrefix('with-search');
    const searchBoxClassName = this._addWidgetPrefix('search');
    const { searchEnabled, onValueChanged } = options;

    this._onSearchBoxValueChanged = onValueChanged;

    if (!searchEnabled) {
      $container.removeClass(rootElementClassName);
      this.remove();
      return;
    }

    if (this._editor) {
      this.updateEditorOptions(options);
    } else {
      const editorOptions = this._getEditorOptions(options);
      $container.addClass(rootElementClassName);
      this._$element = $('<div>').addClass(searchBoxClassName).prependTo($container);
      this._editor = this._createEditor(
        this._$element,
        SearchBoxController.EditorClass as TextBox,
        editorOptions,
      );
    }
  }

  updateEditorOptions(options: SearchBoxControllerOptions): void {
    const editorOptions = this._getEditorOptions(options);
    this._editor?.option(editorOptions);
  }

  _getEditorOptions(options: SearchBoxControllerOptions): Record<string, unknown> {
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
      onValueChanged: (e: ValueChangedEvent): void => {
        this._onValueChanged(e, searchTimeout);
      },
      ...searchEditorOptions,
    };
  }

  _onValueChanged(e: ValueChangedEvent, searchTimeout = 0): void {
    this._valueChangeDeferred = Deferred();
    clearTimeout(this._valueChangeTimeout);

    this._valueChangeDeferred.done((): void => {
      this._onSearchBoxValueChanged?.(e.value);
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
