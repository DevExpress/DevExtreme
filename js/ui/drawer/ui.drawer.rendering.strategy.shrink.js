import { animation } from './ui.drawer.rendering.strategy';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { camelize } from '../../core/utils/inflector';

class ShrinkStrategy extends DrawerStrategy {

    slidePositionRendering(config, offset, animate) {
        if(animate) {
            let animationConfig = extend(config.defaultAnimationConfig, {
                $element: config.$panel,
                margin: config.panelOffset,
                duration: this.getDrawerInstance().option('animationDuration'),
                direction: config.direction
            });
            animation.margin(animationConfig);
        } else {
            config.$panel.css('margin' + camelize(config.direction, true), config.panelOffset);
        }
    }

    expandPositionRendering(config, offset, animate) {
        const drawer = this.getDrawerInstance();

        if(animate) {
            let animationConfig = extend(config.defaultAnimationConfig, {
                $element: config.$panel,
                size: config.size,
                duration: drawer.option('animationDuration'),
                direction: config.direction
            });
            animation.size(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                $(config.$panel).css('width', config.size);
            } else {
                $(config.$panel).css('height', config.size);
            }
        }
    }

    getPositionRenderingConfig(offset) {
        return extend(super.getPositionRenderingConfig(offset), {
            panelOffset: this._getPanelOffset(offset)
        });
    }

    needOrderContent(position, isRtl) {
        return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
    }
}

module.exports = ShrinkStrategy;
