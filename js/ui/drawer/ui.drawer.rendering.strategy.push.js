import { animation } from './ui.drawer.rendering.strategy';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import translator from '../../animation/translator';
import { extend } from '../../core/utils/extend';

class PushStrategy extends DrawerStrategy {
    useDefaultAnimation() {
        return true;
    }

    defaultPositionRendering(config, offset, animate) {
        const drawer = this.getDrawerInstance();

        $(drawer.content()).css(drawer.isHorizontalDirection() ? 'width' : 'height', config.maxSize);

        if(animate) {
            let animationConfig = {
                $element: config.$content,
                position: config.contentPosition,
                direction: drawer.getDrawerPosition(),
                duration: drawer.option('animationDuration'),
                complete: () => {
                    this._elementsAnimationCompleteHandler();
                }
            };

            animation.moveTo(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                translator.move(config.$content, { left: config.contentPosition });
            } else {
                translator.move(config.$content, { top: config.contentPosition });
            }
        }
    }

    getPositionRenderingConfig(offset) {
        return extend(super.getPositionRenderingConfig(offset), {
            contentPosition: this._getPanelSize(offset) * this.getDrawerInstance()._getPositionCorrection(),
            maxSize: this._getPanelSize(true)
        });
    }
}

module.exports = PushStrategy;
