import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import type { EditorProperties } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';

const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';

export interface RadioButtonProperties extends EditorProperties {

}

class RadioButton extends Editor {
  _$icon?: dxElementWrapper;

  _clickAction?: (event?: Record<string, unknown>) => void;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => void | boolean> {
    const click = function (e) {
      e.preventDefault();
      this._clickAction({ event: e });
    };
    return {
      ...super._supportedKeys(),
      space: click,
    };
  }

  _getDefaultOptions(): RadioButtonProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      activeStateEnabled: true,
      value: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _canValueBeChangedByClick(): boolean {
    return true;
  }

  _defaultOptionsRules(): DefaultOptionsRule<RadioButtonProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this.$element().addClass(RADIO_BUTTON_CLASS);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderIcon();
    this._renderCheckedState(this.option('value'));
    this._renderClick();
    this.setAria('role', 'radio');
  }

  _renderIcon(): void {
    this._$icon = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

    $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo(this._$icon);
    this.$element().append(this._$icon);
  }

  _renderCheckedState(checked): void {
    this.$element()
      .toggleClass(RADIO_BUTTON_CHECKED_CLASS, checked)
      .find(`.${RADIO_BUTTON_ICON_CLASS}`)
      .toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, checked);
    this.setAria('checked', checked);
  }

  _renderClick(): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);

    this._clickAction = this._createAction((args) => {
      this._clickHandler(args.event);
    });

    eventsEngine.off(this.$element(), eventName);
    eventsEngine.on(this.$element(), eventName, (e) => {
      this._clickAction?.({ event: e });
    });
  }

  _clickHandler(e): void {
    this._saveValueChangeEvent(e);
    this.option('value', true);
  }

  _optionChanged(args: OptionChanged<RadioButtonProperties>): void {
    switch (args.name) {
      case 'value':
        this._renderCheckedState(args.value);
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxRadioButton', RadioButton);

export default RadioButton;
