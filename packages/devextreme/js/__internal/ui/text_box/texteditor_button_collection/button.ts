import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/button';
import Button from '@js/ui/button';
import type TextEditorBase from '@ts/ui/text_box/text_editor.base';

type TextEditorButtonInstance = dxElementWrapper | Button;

export const isButtonInstance = (
  instance: unknown,
): instance is Button => instance instanceof Button;

export default class TextEditorButton {
  $container!: dxElementWrapper | null;

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
    } else if ($container) {
      $element.appendTo($container);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _attachEvents(instance: unknown, $element?: dxElementWrapper): void {
    throw new Error('Not implemented');
  }

  _create(): {
    instance: Button | dxElementWrapper;
    $element: dxElementWrapper;
  } | undefined {
    throw new Error('Not implemented');
  }

  _isRendered(): boolean {
    return !!this.instance;
  }

  _isVisible(): boolean {
    const { editor, options } = this;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return options.visible || !editor?.option('readOnly');
  }

  _isDisabled(): boolean | undefined {
    throw new Error('Not implemented');
  }

  _shouldRender(): boolean {
    return this._isVisible() && !this._isRendered();
  }

  dispose(): void {
    const { instance } = this;

    if (instance) {
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
    this.$container = null;
    this.$placeMarker?.remove();
    this.$placeMarker = null;
  }

  render($container: dxElementWrapper | null = this.$container): void {
    this.$container = $container;

    if (this._isVisible()) {
      const { instance, $element } = this._create() ?? {};

      this.instance = instance;
      this._attachEvents(instance, $element);
    } else if ($container) {
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
