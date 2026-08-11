import type { FloatingActionButtonDirection } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import type { dxOverlayAnimation } from '@js/ui/overlay';
import type { Properties } from '@js/ui/speed_dial_action';
import swatchContainer from '@ts/core/utils/swatch_container';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import type { FloatingActionButtonPosition } from './speed_dial_item';
import { disposeAction, initAction } from './speed_dial_main_item';

const { getSwatchContainer } = swatchContainer;

const ready = readyCallbacks.add;

export interface SpeedDialActionProperties extends Omit<Properties, 'onClick'> {
  onClick?: Properties['onClick'] | null;

  onInitializing?: (e: unknown) => void;

  animation?: dxOverlayAnimation;

  id?: Guid;

  actions?: SpeedDialAction[];

  actionComponent?: SpeedDialAction;

  actionVisible?: boolean;

  direction?: FloatingActionButtonDirection;

  position?: FloatingActionButtonPosition;

  parentPosition?: FloatingActionButtonPosition;

  zIndex?: number;
}

class SpeedDialAction extends Widget<SpeedDialActionProperties> {
  _getDefaultOptions(): SpeedDialActionProperties {
    return {
      ...super._getDefaultOptions(),
      icon: '',
      onClick: null,
      label: '',
      visible: true,
      index: 0,
      onContentReady: undefined,
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
    };
  }

  _optionChanged(args: OptionChanged<SpeedDialActionProperties>): void {
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

  _dispose(): void {
    disposeAction(this._options.silent('id'));
    super._dispose();
  }
}

registerComponent('dxSpeedDialAction', SpeedDialAction);

export default SpeedDialAction;
