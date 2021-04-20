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

    renderPosition(changePositionUsingFxAnimation, animationDuration) {
        const whenPositionAnimationCompleted = new Deferred();
        const whenShaderAnimationCompleted = new Deferred();

        const drawer = this.getDrawerInstance();

        if(changePositionUsingFxAnimation) {
            when.apply($, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(() => {
                drawer._animationCompleteHandler();
            });
        }

        this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);

        if(!changePositionUsingFxAnimation) {
            drawer.resizeViewContent();
        }

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

export default DrawerStrategy;
