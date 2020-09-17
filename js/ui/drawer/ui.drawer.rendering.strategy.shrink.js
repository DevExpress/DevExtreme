import { animation } from './ui.drawer.animation';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { camelize } from '../../core/utils/inflector';

class ShrinkStrategy extends DrawerStrategy {
    _slidePositionRendering(config, _, animate) {
        if(animate) {
            const animationConfig = extend(config.defaultAnimationConfig, {
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

    _expandPositionRendering(config, _, animate) {
        const drawer = this.getDrawerInstance();

        if(animate) {
            const animationConfig = extend(config.defaultAnimationConfig, {
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

    _getPositionRenderingConfig(isDrawerOpened) {
        return extend(super._getPositionRenderingConfig(isDrawerOpened), {
            panelOffset: this._getPanelOffset(isDrawerOpened)
        });
    }

    isViewContentFirst(position, isRtl) {
        return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
    }
}

export default ShrinkStrategy;
