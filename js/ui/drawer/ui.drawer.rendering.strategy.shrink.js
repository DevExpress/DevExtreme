import { animation } from './ui.drawer.rendering.strategy';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { camelize } from '../../core/utils/inflector';
import * as zIndexPool from '../overlay/z_index';

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

    setZIndex(zIndex) {
        zIndexPool.create(zIndex + 1);
        this._drawer._$panelContentWrapper.css('zIndex', zIndex + 1);

        super.setZIndex(zIndex);
    }

    clearZIndex() {
        zIndexPool.remove(this._drawer._zIndex + 1);
        this._drawer._$panelContentWrapper.css('zIndex', '');

        super.clearZIndex();
    }
}

module.exports = ShrinkStrategy;
