import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

export default class TextEditorButton {
  $container?: dxElementWrapper;

  $placeMarker?: dxElementWrapper;

  instance?: any;

  editor?: any;

  name?: any;

  options?: any;

  constructor(name, editor, options) {
    this.instance = null;

    // @ts-expect-error
    this.$container = null;
    // @ts-expect-error
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }

  _addPlaceMarker($container) {
    this.$placeMarker = $('<div>').appendTo($container);
  }

  _addToContainer($element) {
    const { $placeMarker, $container } = this;

    $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _attachEvents(instance: any, $element: dxElementWrapper) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }

  _create(): {
    instance: any;
    $element: dxElementWrapper;
  } {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }

  _isRendered() {
    return !!this.instance;
  }

  _isVisible() {
    const { editor, options } = this;

    return options.visible || !editor.option('readOnly');
  }

  _isDisabled() {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }

  _shouldRender() {
    return this._isVisible() && !this._isRendered();
  }

  dispose() {
    const { instance, $placeMarker } = this;

    if (instance) {
      // TODO: instance.dispose()
      instance.dispose ? instance.dispose() : instance.remove();
      this.instance = null;
    }

    $placeMarker && $placeMarker.remove();
  }

  render($container = this.$container) {
    this.$container = $container;

    if (this._isVisible()) {
      const { instance, $element } = this._create();

      this.instance = instance;
      this._attachEvents(instance, $element);
    } else {
      this._addPlaceMarker($container);
    }
  }

  update() {
    if (this._shouldRender()) {
      this.render();
    }

    return !!this.instance;
  }
}
