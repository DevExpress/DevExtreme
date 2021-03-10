import $ from '../../core/renderer';
import { animation } from './ui.drawer.animation';
import { Deferred, when } from '../../core/utils/deferred';

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
        this._prepareAnimationDeferreds(changePositionUsingFxAnimation);

        this._internalRenderPosition(changePositionUsingFxAnimation);
        this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration);
    }

    _prepareAnimationDeferreds(changePositionUsingFxAnimation) {
        const drawer = this.getDrawerInstance();

        this._contentAnimation = new Deferred();
        this._panelAnimation = new Deferred();
        this._shaderAnimation = new Deferred();

        drawer._animations.push(this._contentAnimation, this._panelAnimation, this._shaderAnimation);

        if(changePositionUsingFxAnimation) {
            when.apply($, drawer._animations).done(() => {
                drawer._animationCompleteHandler();
            });
        } else {
            drawer.resizeViewContent();
        }
    }

    _elementsAnimationCompleteHandler() {
        this._contentAnimation.resolve();
        this._panelAnimation.resolve();
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

    renderShaderVisibility(changePositionUsingFxAnimation, duration) {
        const drawer = this.getDrawerInstance();
        const isShaderVisible = drawer.option('opened');
        const fadeConfig = isShaderVisible ? { from: 0, to: 1 } : { from: 1, to: 0 };

        if(changePositionUsingFxAnimation) {
            animation.fade($(drawer._$shader), fadeConfig, duration, () => {
                this._drawer._toggleShaderVisibility(isShaderVisible);
                this._shaderAnimation.resolve();
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

export default DrawerStrategy;
