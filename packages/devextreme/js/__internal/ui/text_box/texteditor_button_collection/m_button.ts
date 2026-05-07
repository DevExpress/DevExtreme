import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/button';
import Button from '@js/ui/button';

import type TextEditorBase from '../m_text_editor.base';

type TextEditorButtonInstance = dxElementWrapper | Button;

export const isButtonInstance = (
  instance: unknown,
): instance is Button => instance instanceof Button;

export default class TextEditorButton {
  $container!: dxElementWrapper;

  $placeMarker?: dxElementWrapper | null;

  instance?: TextEditorButtonInstance | null;

  editor!: TextEditorBase | null;

  name!: string;

  options!: Properties;

  constructor(
    name: string,
    editor: TextEditorBase,
    options: Properties,
  ) {
    this.instance = null;
    // @ts-expect-error ts-error
    this.$container = null;
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }

  _addPlaceMarker($container: dxElementWrapper): void {
    this.$placeMarker = $('<div>').appendTo($container);
  }

  _addToContainer($element: dxElementWrapper): void {
    const { $placeMarker, $container } = this;

    if ($placeMarker) {
      $placeMarker.replaceWith($element);
    } else {
      $element.appendTo($container);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _attachEvents(instance: unknown, $element?: dxElementWrapper): void {
    throw 'Not implemented';
  }

  // eslint-disable-next-line class-methods-use-this
  _create(): {
    instance: Button | dxElementWrapper;
    $element: dxElementWrapper;
  } | undefined {
    throw 'Not implemented';
  }

  _isRendered(): boolean {
    return !!this.instance;
  }

  _isVisible(): boolean {
    const { editor, options } = this;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return options.visible || !editor?.option('readOnly');
  }

  // eslint-disable-next-line class-methods-use-this
  _isDisabled(): boolean | undefined {
    throw 'Not implemented';
  }

  _shouldRender(): boolean {
    return this._isVisible() && !this._isRendered();
  }

  dispose(): void {
    const { instance } = this;

    if (instance) {
      // TODO: instance.dispose()
      if (isButtonInstance(instance)) {
        instance.dispose();
        instance.$element().remove();
        // @ts-expect-error _$element is private
        instance._$element = null;
      } else {
        instance.remove();
      }
    }

    this.instance = null;
    this.editor = null;
    // @ts-expect-error $container can be null and undefined
    this.$container = null;
    this.$placeMarker?.remove();
    this.$placeMarker = null;
  }

  render($container: dxElementWrapper = this.$container): void {
    this.$container = $container;

    if (this._isVisible()) {
      const { instance, $element } = this._create() ?? {};

      this.instance = instance;
      this._attachEvents(instance, $element);
    } else {
      this._addPlaceMarker($container);
    }
  }

  update(): boolean {
    if (this._shouldRender()) {
      this.render();
    }

    return !!this.instance;
  }
}
