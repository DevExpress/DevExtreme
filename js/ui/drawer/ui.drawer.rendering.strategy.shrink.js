import { animation } from './ui.drawer.rendering.strategy';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import { camelize } from '../../core/utils/inflector';

class ShrinkStrategy extends DrawerStrategy {
    _internalRenderPosition(changePositionUsingFxAnimation) {
        const drawer = this.getDrawerInstance();
        const direction = drawer.calcTargetPosition();
        const $panel = $(drawer.content());
        const panelSize = this._getPanelSize(drawer.option('opened'));
        const panelOffset = this._getPanelOffset(drawer.option('opened'));
        const revealMode = drawer.option('revealMode');

        if(changePositionUsingFxAnimation) {
            if(revealMode === 'slide') {
                animation.margin({
                    complete: () => { this._elementsAnimationCompleteHandler(); },
                    $element: $panel,
                    duration: drawer.option('animationDuration'),
                    direction: direction,
                    margin: panelOffset
                });
            } else if(revealMode === 'expand') {
                animation.size({
                    complete: () => { this._elementsAnimationCompleteHandler(); },
                    $element: $panel,
                    duration: drawer.option('animationDuration'),
                    direction: direction,
                    size: panelSize
                });
            }
        } else {
            if(revealMode === 'slide') {
                $panel.css('margin' + camelize(direction, true), panelOffset);
            } else if(revealMode === 'expand') {
                $panel.css(drawer.isHorizontalDirection() ? 'width' : 'height', panelSize);
            }
        }
    }

    isViewContentFirst(position, isRtl) {
        return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
    }
}

module.exports = ShrinkStrategy;
