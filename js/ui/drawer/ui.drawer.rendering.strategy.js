import $ from '../../core/renderer';
import fx from '../../animation/fx';
import { Deferred, when } from '../../core/utils/deferred';
import { camelize } from '../../core/utils/inflector';
import { isDefined } from '../../core/utils/type';
import * as zIndexPool from '../overlay/z_index';

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

    renderPosition(isDrawerOpened, animate) {
        this._prepareAnimationDeferreds(animate);

        const config = this._getPositionRenderingConfig(isDrawerOpened);

        if(this._useDefaultAnimation()) {
            this._defaultPositionRendering(config, isDrawerOpened, animate);
        } else {
            const revealMode = this.getDrawerInstance().option('revealMode');
            if(revealMode === 'slide') {
                this._slidePositionRendering(config, isDrawerOpened, animate);
            } else if(revealMode === 'expand') {
                this._expandPositionRendering(config, isDrawerOpened, animate);
            }
        }
    }

    _prepareAnimationDeferreds(animate) {
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
            drawer.resizeViewContent();
        }
    }

    _getPositionRenderingConfig(isDrawerOpened) {
        const drawer = this.getDrawerInstance();

        return {
            direction: drawer.calcTargetPosition(),
            $panel: $(drawer.content()),
            $content: $(drawer.viewContent()),
            defaultAnimationConfig: this._defaultAnimationConfig(),
            size: this._getPanelSize(isDrawerOpened)
        };
    }

    _useDefaultAnimation() {
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

    renderShaderVisibility(isShaderVisible, animate, duration) {
        const drawer = this.getDrawerInstance();
        const fadeConfig = isShaderVisible ? { from: 0, to: 1 } : { from: 1, to: 0 };

        if(animate) {
            animation.fade($(drawer._$shader), fadeConfig, duration, () => {
                this._drawer._toggleShaderVisibility(isShaderVisible);
                this._shaderAnimation.resolve();
            });
        } else {
            drawer._toggleShaderVisibility(isShaderVisible);
            drawer._$shader.css('opacity', fadeConfig.to);
        }
    }

    updateZIndex() {
        if(this._drawer.option('shading')) {
            if(!isDefined(this._shaderZIndex)) {
                this._shaderZIndex = zIndexPool.base() + 500;
                this._drawer._$shader.css('zIndex', this._shaderZIndex);
            }
        }
    }

    clearZIndex() {
        if(isDefined(this._shaderZIndex)) {
            this._drawer._$shader.css('zIndex', '');
            delete this._shaderZIndex;
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
}

module.exports = DrawerStrategy;
module.exports.animation = animation;
