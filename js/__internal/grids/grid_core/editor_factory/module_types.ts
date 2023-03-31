import { ViewController } from './ui.grid_core.modules';

interface State {
  _isFocusOverlay: any;
  _updateFocusTimeoutID: any;
  _updateFocusHandler: any;
  _$focusedElement: any;
  _focusTimeoutID: any;
  _$focusOverlay: any;

  focused: any;
}

export interface EditorFactory extends ViewController, State {
  _getFocusedElement: (this: this, $dataGridElement) => any;

  _getFocusCellSelector: (this: this) => any;

  _updateFocusCore: (this: this) => any;

  _needHideBorder: (this: this, $element) => boolean;

  _updateFocus: (this: this, e) => any;

  _updateFocusOverlaySize: (this: this, $element, position) => any;

  callbackNames: (this: this) => any;

  focus: (this: this, $element?, hideBorder?) => any;

  refocus: (this: this) => any;

  renderFocusOverlay: (this: this, $element, hideBorder) => any;

  resize: (this: this) => any;

  loseFocus: (this: this) => any;

  init: (this: this) => any;

  _getContainerRoot: (this: this) => any;

  _attachContainerEventHandlers: (this: this) => any;

  dispose: (this: this) => any;

  createEditor: (this: this, ...args: any[]) => any;

  _getRevertTooltipsSelector: (this: this) => string;
}
