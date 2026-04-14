import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import ButtonGroup, { type Properties as ButtonGroupProperties } from '@js/ui/button_group';

const CHAT_SUGGESTIONS_CLASS = 'dx-chat-suggestions';

export type SuggestionsOptions = Omit<ButtonGroupProperties, 'selectionMode'>;

class Suggestions {
  private readonly _$container?: dxElementWrapper;

  private _$element?: dxElementWrapper;

  private _buttonGroup?: InstanceType<typeof ButtonGroup>;

  constructor($container: dxElementWrapper, options: SuggestionsOptions | undefined) {
    this._$container = $container;

    this._renderMarkup();
    this._initButtonGroup(options);
  }

  private _getConfiguration(options: SuggestionsOptions): ButtonGroupProperties {
    const items = options.items?.map((item) => ({
      type: 'default',
      ...item,
    })) ?? [];

    return {
      stylingMode: 'outlined',
      ...options,
      items,
      selectionMode: 'none',
    };
  }

  private _renderMarkup(): void {
    this._$element = $('<div>').addClass(CHAT_SUGGESTIONS_CLASS);
    this._$container?.append(this._$element);
  }

  private _initButtonGroup(options: SuggestionsOptions = {}): void {
    const shouldRender = Object.keys(options).length;

    if (shouldRender && this._$element) {
      this._buttonGroup = new ButtonGroup(this._$element.get(0), this._getConfiguration(options));
    }
  }

  updateOptions(options: SuggestionsOptions): void {
    if (!this._buttonGroup) {
      this._initButtonGroup(options);
      return;
    }

    this._buttonGroup?.option(this._getConfiguration(options));
  }

  dispose(): void {
    this._buttonGroup?.dispose();
    this._buttonGroup = undefined;
    this._$element = undefined;
  }
}

export default Suggestions;
