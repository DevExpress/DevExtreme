import { animation } from './ui.drawer.animation';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { move } from '../../animation/translator';
import { extend } from '../../core/utils/extend';

class PushStrategy extends DrawerStrategy {
    _useDefaultAnimation() {
        return true;
    }

    _defaultPositionRendering(config, _, animate) {
        const drawer = this.getDrawerInstance();

        $(drawer.content()).css(drawer.isHorizontalDirection() ? 'width' : 'height', config.maxSize);
        if(drawer.getMinSize()) {
            let paddingCssPropertyName = 'padding';
            switch(drawer.calcTargetPosition()) {
                case 'left': paddingCssPropertyName += 'Right'; break;
                case 'right': paddingCssPropertyName += 'Left'; break;
                case 'top': paddingCssPropertyName += 'Bottom'; break;
                case 'bottom': paddingCssPropertyName += 'Top'; break;
            }
            $(drawer.viewContent()).css(paddingCssPropertyName, drawer.getMinSize());
        }

        if(animate) {
            const animationConfig = {
                $element: $(drawer.viewContent()),
                position: config.contentPosition,
                direction: drawer.calcTargetPosition(),
                duration: drawer.option('animationDuration'),
                complete: () => {
                    this._elementsAnimationCompleteHandler();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                move($(drawer.viewContent()), { left: config.contentPosition });
            } else {
                move($(drawer.viewContent()), { top: config.contentPosition });
            }
        }
    }

    _getPositionRenderingConfig(isDrawerOpened) {
        return extend(super._getPositionRenderingConfig(isDrawerOpened), {
            contentPosition: this._getPanelSize(isDrawerOpened) * this.getDrawerInstance()._getPositionCorrection(),
            maxSize: this._getPanelSize(true)
        });
    }

    onPanelContentRendered() {
        $(this.getDrawerInstance().viewContent()).addClass('dx-theme-background-color');
    }

}

export default PushStrategy;
