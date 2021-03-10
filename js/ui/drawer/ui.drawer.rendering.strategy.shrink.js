import { animation } from './ui.drawer.animation';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { camelize } from '../../core/utils/inflector';

class ShrinkStrategy extends DrawerStrategy {
    _internalRenderPosition(changePositionUsingFxAnimation) {
        const drawer = this.getDrawerInstance();
        const config = {
            direction: drawer.calcTargetPosition(),
            $panel: $(drawer.content()),
            $content: $(drawer.viewContent()),
            defaultAnimationConfig: {
                complete: () => { this._elementsAnimationCompleteHandler(); }
            },
            size: this._getPanelSize(drawer.option('opened')),
            panelOffset: this._getPanelOffset(drawer.option('opened'))
        };

        const revealMode = drawer.option('revealMode');
        if(revealMode === 'slide') {
            this._renderSlidePosition(config, changePositionUsingFxAnimation);
        } else if(revealMode === 'expand') {
            this._renderExpandPosition(config, changePositionUsingFxAnimation);
        }
    }

    _renderSlidePosition(config, changePositionUsingFxAnimation) {
        if(changePositionUsingFxAnimation) {
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

    _renderExpandPosition(config, changePositionUsingFxAnimation) {
        const drawer = this.getDrawerInstance();

        if(changePositionUsingFxAnimation) {
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

    isViewContentFirst(position, isRtl) {
        return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
    }
}

export default ShrinkStrategy;
