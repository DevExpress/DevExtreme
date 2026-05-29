import type { SearchMode } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { ValueChangedEvent } from '@js/ui/text_box';
import type { SearchBoxMixinOptions } from '@js/ui/widget/ui.search_box_mixin';
import { stubComponent } from '@ts/core/utils/m_stubs';
import type TextBox from '@ts/ui/text_box/text_box';
import type { TextBoxProperties } from '@ts/ui/text_box/text_box';

export const getOperationBySearchMode = (searchMode?: SearchMode): string | undefined => (searchMode === 'equals' ? '=' : searchMode);

export type SearchBoxControllerOptions = SearchBoxMixinOptions & {
  tabIndex?: number;
  onValueChanged?: (value: string) => void;
};

class SearchBoxController {
  static EditorClass: (new (...args) => TextBox) = stubComponent('TextBox');

  _editor?: TextBox | null;

  _valueChangeDeferred!: DeferredObj<unknown>;

  // eslint-disable-next-line no-restricted-globals
  _valueChangeTimeout!: ReturnType<typeof setTimeout>;

  _onSearchBoxValueChanged?: (value: string) => void;

  static setEditorClass(value: new (...args) => TextBox): void {
    SearchBoxController.EditorClass = value;
  }

  render(
    widgetPrefix: string,
    $container: dxElementWrapper,
    options: SearchBoxControllerOptions,
    createEditorCallback: (
      $element: dxElementWrapper,
      component: (new (...args) => TextBox),
      options: TextBoxProperties,
    ) => TextBox,
  ): void {
    const rootElementClassName = `${widgetPrefix}-with-search`;
    const searchBoxClassName = `${widgetPrefix}-search`;
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
      const $editor = $('<div>')
        .addClass(searchBoxClassName)
        .prependTo($container);

      this._editor = createEditorCallback(
        $editor,
        SearchBoxController.EditorClass,
        editorOptions,
      );
    }
  }

  updateEditorOptions(options: SearchBoxControllerOptions): void {
    const editorOptions = this._getEditorOptions(options);
    this._editor?.option(editorOptions);
  }

  _getEditorOptions(options: SearchBoxControllerOptions): TextBoxProperties {
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
      // @ts-expect-error ts-error
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
    this._editor?.$element().remove();
    this._editor = null;
  }

  focus(): void {
    this._editor?.focus();
  }

  dispose(): void {
    this.remove();
  }
}

export default SearchBoxController;
