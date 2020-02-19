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

        if(direction === 'right') {
            toConfig['transform'] = 'translate(' + position + 'px, 0px)';
            animationType = 'custom';
        }

        if(direction === 'left') {
            toConfig['left'] = position;
            animationType = 'slide';
        }

        if(direction === 'top' || direction === 'bottom') {
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

    renderPanelContent(template, whenPanelContentRendered) {
        template && template.render({
            container: this.getDrawerInstance().content(),
            onRendered: () => {
                whenPanelContentRendered.resolve();
            }
        });
    }

    renderPosition(isDrawerOpened, animate) {
        const drawer = this.getDrawerInstance();
        const revealMode = drawer.option('revealMode');

        this.prepareAnimationDeferreds(animate);

        const config = this.getPositionRenderingConfig(isDrawerOpened);

        if(this.useDefaultAnimation()) {
            this.defaultPositionRendering(config, isDrawerOpened, animate);
        } else {
            if(revealMode === 'slide') {
                this.slidePositionRendering(config, isDrawerOpened, animate);
            }
            if(revealMode === 'expand') {
                this.expandPositionRendering(config, isDrawerOpened, animate);
            }
        }
    }

    prepareAnimationDeferreds(animate) {
        const drawer = this.getDrawerInstance();

        this._contentAnimation = new Deferred();
        this._panelAnimation = new Deferred();
        this._shaderAnimation = new Deferred();

        drawer._animations.push(this._contentAnimation, this._panelAnimation, this._shaderAnimation);

        if(animate) {
            when.apply($, drawer._animations).done(() => {
                drawer._animationCompleteHandler();
            });
        } else {
            drawer.resizeContent();
        }
    }

    getPositionRenderingConfig(isDrawerOpened) {
        const drawer = this.getDrawerInstance();

        return {
            direction: drawer.getDrawerPosition(),
            $panel: $(drawer.content()),
            $content: $(drawer.viewContent()),
            defaultAnimationConfig: this._defaultAnimationConfig(),
            size: this._getPanelSize(isDrawerOpened)
        };
    }

    useDefaultAnimation() {
        return false;
    }

    _elementsAnimationCompleteHandler() {
        this._contentAnimation.resolve();
        this._panelAnimation.resolve();
    }

    _defaultAnimationConfig() {
        return {
            complete: () => {
                this._elementsAnimationCompleteHandler();
            }
        };
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

    renderShaderVisibility(isDrawerOpened, animate, duration) {
        const drawer = this.getDrawerInstance();
        const fadeConfig = isDrawerOpened ? { from: 0, to: 1 } : { from: 1, to: 0 };

        if(animate) {
            animation.fade($(drawer._$shader), fadeConfig, duration, () => {
                this._drawer._toggleShaderVisibility(isDrawerOpened);
                this._shaderAnimation.resolve();
            });
        } else {
            drawer._toggleShaderVisibility(isDrawerOpened);
            drawer._$shader.css('opacity', fadeConfig.to);
        }
    }

    getPanelContent() {
        return $(this.getDrawerInstance().content());
    }

    getWidth() {
        return this.getDrawerInstance().$element().get(0).getBoundingClientRect().width;
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

    needOrderContent() {
        return false;
    }
}

module.exports = DrawerStrategy;
module.exports.animation = animation;
