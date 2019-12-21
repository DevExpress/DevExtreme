import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import Guid from '../../core/guid';
import readyCallbacks from '../../core/utils/ready_callbacks';
import Widget from '../widget/ui.widget';
import { initAction, disposeAction } from './speed_dial_main_item';
import { getSwatchContainer } from '../widget/swatch_container';

const ready = readyCallbacks.add;

class SpeedDialAction extends Widget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            icon: '',


            onClick: null,

            label: '',

            visible: true,

            index: 0,

            /**
            * @name dxSpeedDialActionOptions.width
            * @hidden
            */

            /**
            * @name dxSpeedDialActionOptions.height
            * @hidden
            */

            /**
            * @name dxSpeedDialActionOptions.disabled
            * @hidden
            */


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
                        opacity: 0
                    },
                    to: {
                        scale: 1,
                        opacity: 1
                    }
                },
                hide: {
                    type: 'pop',
                    duration: 200,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    from: {
                        scale: 1,
                        opacity: 1
                    },
                    to: {
                        scale: 0,
                        opacity: 0
                    }
                }
            },
            id: new Guid()
        });
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onClick':
            case 'icon':
            case 'label':
            case 'visible':
            case 'index':
                initAction(this);
                break;
            case 'animation':
            case 'id':
                break;
            default:
                super._optionChanged(args);
        }
    }

    _render() {
        this._toggleVisibility(false);

        if(!getSwatchContainer(this.$element())) {
            ready(() => initAction(this));
        } else {
            initAction(this);
        }
    }
    _dispose() {
        disposeAction(this._options.id);
        super._dispose();
    }
}

registerComponent('dxSpeedDialAction', SpeedDialAction);

module.exports = SpeedDialAction;

