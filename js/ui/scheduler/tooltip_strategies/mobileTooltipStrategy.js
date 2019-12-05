import Overlay from '../../overlay';
import { TooltipStrategyBase } from './tooltipStrategyBase';
import { getWindow } from '../../../core/utils/window';

const SLIDE_PANEL_CLASS_NAME = 'dx-scheduler-overlay-panel';
const MAX_OVERLAY_HEIGHT = 250;

const animationConfig = {
    show: {
        type: 'slide',
        duration: 300,
        from: { position: { my: 'top', at: 'bottom', of: getWindow() } },
        to: { position: { my: 'center', at: 'center', of: getWindow() } }
    },
    hide: {
        type: 'slide',
        duration: 300,
        to: { position: { my: 'top', at: 'bottom', of: getWindow() } },
        from: { position: { my: 'center', at: 'center', of: getWindow() } }
    }
};

const positionConfig = {
    my: 'bottom',
    at: 'bottom',
    of: getWindow()
};

export class MobileTooltipStrategy extends TooltipStrategyBase {
    _shouldUseTarget() {
        return false;
    }

    _onShowing() {
        this._tooltip.option('height', 'auto');
        const height = this._list.$element().outerHeight();
        this._tooltip.option('height', height > MAX_OVERLAY_HEIGHT ? MAX_OVERLAY_HEIGHT : 'auto');
    }

    _createTooltip(target, dataList) {
        const $overlay = this._createTooltipElement(SLIDE_PANEL_CLASS_NAME);
        return this._options.createComponent($overlay, Overlay, {
            shading: false,
            position: positionConfig,
            animation: animationConfig,
            target: this._options.container,
            container: this._options.container,
            closeOnOutsideClick: true,
            width: '100%',
            height: 'auto',
            onShowing: () => this._onShowing(),
            onShown: this._onShown.bind(this),
            contentTemplate: this._getContentTemplate(dataList)
        });
    }
}
