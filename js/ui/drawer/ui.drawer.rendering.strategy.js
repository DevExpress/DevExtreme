import $ from '../../core/renderer';
import fx from '../../animation/fx';
import { Deferred, when } from '../../core/utils/deferred';
import { camelize } from '../../core/utils/inflector';

const animation = {
    moveTo(config) {
        const $element = config.$element;
        const position = config.position;
        const direction = config.direction || 'left';
        const toConfig = {};
        let animationType;

        switch(direction) {
            case 'right':
                toConfig['transform'] = 'translate(' + position + 'px, 0px)';
                animationType = 'custom';
                break;
            case 'left':
                toConfig['left'] = position;
                animationType = 'slide';
                break;
            case 'top':
            case 'bottom':
                toConfig['top'] = position;
                animationType = 'slide';
        }

        fx.animate($element, {
            type: animationType,
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },
    margin(config) {
        const $element = config.$element;
        const margin = config.margin;
        const direction = config.direction || 'left';
        const toConfig = {};

        toConfig['margin' + camelize(direction, true)] = margin;

        fx.animate($element, {
            to: toConfig,
            duration: config.duration,
            complete: config.complete
        });
    },
    fade($element, config, duration, completeAction) {
        fx.animate($element, {
            type: 'fade',
            to: config.to,
            from: config.from,
            duration,
            complete: completeAction
        });
    },

    size(config) {
        const $element = config.$element;
        const size = config.size;
        const direction = config.direction || 'left';
        const marginTop = config.marginTop || 0;
        const duration = config.duration;
        const toConfig = {};


        if(direction === 'right' || direction === 'left') {
            toConfig['width'] = size;
        } else {
            toConfig['height'] = size;
        }

        if(direction === 'bottom') {
            toConfig['marginTop'] = marginTop;
        }

        fx.animate($element, {
            to: toConfig,
            duration,
            complete: config.complete
        });
    },

    complete($element) {
        fx.stop($element, true);
    }
};

class DrawerStrategy {

    constructor(drawer) {
        this._drawer = drawer;
    }

    getDrawerInstance() {
        return this._drawer;
    }

    renderPanelContent(whenPanelContentRendered) {
        const drawer = this.getDrawerInstance();
        const template = drawer._getTemplate(drawer.option('template'));
        if(template) {
            template.render({
                container: drawer.content(),
                onRendered: () => {
                    whenPanelContentRendered.resolve();
                }
            });
        }
    }

    renderPosition(isDrawerOpened, changePositionUsingFxAnimation, animationDuration) {
        const whenPositionAnimationCompleted = new Deferred();
        const whenShaderAnimationCompleted = new Deferred();

        const drawer = this.getDrawerInstance();

        if(changePositionUsingFxAnimation) {
            when.apply($, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(() => {
                drawer._animationCompleteHandler();
            });
        } else {
            drawer.resizeViewContent();
        }

        this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);
        this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration, whenShaderAnimationCompleted);
    }

    _getPanelOffset(isDrawerOpened) {
        const drawer = this.getDrawerInstance();
        const size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();

        if(isDrawerOpened) {
            return -(size - drawer.getMaxSize());
        } else {
            return -(size - drawer.getMinSize());
        }
    }

    _getPanelSize(isDrawerOpened) {
        return isDrawerOpened ? this.getDrawerInstance().getMaxSize() : this.getDrawerInstance().getMinSize();
    }

    renderShaderVisibility(changePositionUsingFxAnimation, duration, whenAnimationCompleted) {
        const drawer = this.getDrawerInstance();
        const isShaderVisible = drawer.option('opened');
        const fadeConfig = isShaderVisible ? { from: 0, to: 1 } : { from: 1, to: 0 };

        if(changePositionUsingFxAnimation) {
            animation.fade($(drawer._$shader), fadeConfig, duration, () => {
                this._drawer._toggleShaderVisibility(isShaderVisible);
                whenAnimationCompleted.resolve();
            });
        } else {
            drawer._toggleShaderVisibility(isShaderVisible);
            drawer._$shader.css('opacity', fadeConfig.to);
        }
    }

    getPanelContent() {
        return $(this.getDrawerInstance().content());
    }

    setPanelSize(calcFromRealPanelSize) { // TODO: keep for ui.file_manager.adaptivity.js
        this.refreshPanelElementSize(calcFromRealPanelSize);
    }

    refreshPanelElementSize(calcFromRealPanelSize) {
        const drawer = this.getDrawerInstance();
        const panelSize = this._getPanelSize(drawer.option('opened'));

        if(drawer.isHorizontalDirection()) {
            $(drawer.content()).width(calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize);
        } else {
            $(drawer.content()).height(calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize);
        }
    }

    isViewContentFirst() {
        return false;
    }

    onPanelContentRendered() {
    }
}

module.exports = DrawerStrategy;
module.exports.animation = animation;
