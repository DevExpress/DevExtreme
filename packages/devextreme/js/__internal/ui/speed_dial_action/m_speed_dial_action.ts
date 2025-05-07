import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import { extend } from '@js/core/utils/extend';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import type { Properties } from '@js/ui/speed_dial_action';
import swatchContainer from '@js/ui/widget/swatch_container';
import Widget from '@ts/core/widget/widget';

import { disposeAction, initAction } from './m_speed_dial_main_item';

const { getSwatchContainer } = swatchContainer;

const ready = readyCallbacks.add;

class SpeedDialAction extends Widget<Properties> {
  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      icon: '',
      onClick: null,
      label: '',
      visible: true,
      index: 0,
      onContentReady: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      animation: {
        show: {
          type: 'pop',
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          from: {
            scale: 0,
            opacity: 0,
          },
          to: {
            scale: 1,
            opacity: 1,
          },
        },
        hide: {
          type: 'pop',
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          from: {
            scale: 1,
            opacity: 1,
          },
          to: {
            scale: 0,
            opacity: 0,
          },
        },
      },
      id: new Guid(),
    });
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'onClick':
      case 'icon':
      case 'label':
      case 'visible':
      case 'index':
      case 'onInitializing':
        initAction(this);
        break;
      case 'animation':
      case 'id':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _render(): void {
    this._toggleVisibility(false);

    if (!getSwatchContainer(this.$element())) {
      ready(() => initAction(this));
    } else {
      initAction(this);
    }
  }

  _dispose() {
    disposeAction(this._options.silent('id'));
    super._dispose();
  }
}

registerComponent('dxSpeedDialAction', SpeedDialAction);

export default SpeedDialAction;
