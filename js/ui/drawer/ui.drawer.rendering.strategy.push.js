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

        if(animate) {
            const animationConfig = {
                $element: config.$content,
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
                move(config.$content, { left: config.contentPosition });
            } else {
                move(config.$content, { top: config.contentPosition });
            }
        }
    }

    _getPositionRenderingConfig(isDrawerOpened) {
        return extend(super._getPositionRenderingConfig(isDrawerOpened), {
            contentPosition: this._getPanelSize(isDrawerOpened) * this.getDrawerInstance()._getPositionCorrection(),
            maxSize: this._getPanelSize(true)
        });
    }
}

export default PushStrategy;
