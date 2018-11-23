import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";
import typeUtils from "../../core/utils/type";
import { getWindow, hasWindow } from "../../core/utils/window";

class OverlapStrategy extends DrawerStrategy {

    renderPanel(template, whenPanelRendered) {
        delete this._initialPosition;

        const position = this.getOverlayPosition();
        const drawer = this.getDrawerInstance();

        drawer._overlay = drawer._createComponent(drawer.content(), Overlay, {
            shading: false,
            container: drawer.getOverlayTarget(),
            position: position,
            width: "auto",
            height: "100%",
            templatesRenderAsynchronously: drawer.option("templatesRenderAsynchronously"),
            animation: {
                show: {
                    duration: 0
                }
            },
            onPositioned: (function(e) {
                this._fixOverlayPosition(e.component.$content());
            }).bind(this),
            contentTemplate: drawer.option("template"),
            onContentReady: () => {
                whenPanelRendered.resolve();
            },
            visible: true,
            propagateOutsideClick: true
        });

        this._processOverlayZIndex();
    }

    _fixOverlayPosition($overlayContent) {
        // NOTE: overlay should be positioned in extended wrapper
        const drawer = this.getDrawerInstance();

        if(typeUtils.isDefined(this._initialPosition)) {
            translator.move($overlayContent, { left: this._initialPosition.left });
        }
        if(drawer.option("position") === "right") {
            $overlayContent.css("left", "auto");

            if(drawer.option("rtlEnabled")) {
                translator.move($overlayContent, { left: 0 });
            }
        }
    }

    getOverlayPosition() {
        const drawer = this.getDrawerInstance();
        const panelPosition = drawer.option("position");

        let result = {};

        if(panelPosition === "left") {
            result = {
                my: "top left",
                at: "top left",
            };
        }
        if(panelPosition === "right") {
            let my = drawer.option("rtlEnabled") ? "top left" : "top right";

            result = {
                my: my,
                at: "top right",
            };
        }

        if(panelPosition === "top" || panelPosition === "bottom") {
            result = {
                my: panelPosition,
                at: panelPosition,
            };
        }

        result.of = drawer.getOverlayTarget();

        return result;
    }

    setPanelSize(keepMaxSize) {
        const drawer = this.getDrawerInstance();
        const overlay = drawer.getOverlay();

        if(drawer.isHorizontalDirection()) {
            overlay.option("height", "100%");
            overlay.option("width", keepMaxSize ? drawer.getRealPanelWidth() : this._getPanelSize(drawer.option("opened")));
        } else {
            overlay.option("width", overlay.option("container").width());
            overlay.option("height", drawer.getRealPanelHeight());
        }
    }

    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const drawer = this.getDrawerInstance();

        this._initialPosition = drawer.getOverlay().$content().position();

        const $content = $(drawer.viewContent());
        const position = drawer.option("position");

        if(drawer.isHorizontalDirection()) {
            $content.css("paddingLeft", drawer.option("minSize") * drawer._getPositionCorrection());
        }

        $content.css("transform", "inherit");

        if(drawer.option("revealMode") === "slide") {
            const $panel = $(drawer.content());

            const panelOffset = this._getPanelOffset(offset) * drawer._getPositionCorrection();

            if(animate) {
                let animationConfig = {
                    $element: $panel,
                    position: panelOffset,
                    duration: drawer.option("animationDuration"),
                    direction: position,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };

                animation.moveTo(animationConfig);
            } else {

                if(drawer.isHorizontalDirection()) {
                    translator.move($panel, { left: panelOffset });
                } else {
                    translator.move($panel, { top: panelOffset });
                }
            }
        }

        if(drawer.option("revealMode") === "expand") {
            const $panelOverlayContent = drawer.getOverlay().$content();
            const size = this._getPanelSize(offset);
            const marginTop = drawer.getRealPanelHeight() - size;

            translator.move($panelOverlayContent, { left: 0 });

            let animationConfig = {
                $element: $panelOverlayContent,
                size: size,
                duration: drawer.option("animationDuration"),
                direction: position,
                marginTop: marginTop,
                complete: () => {
                    this._contentAnimationResolve();
                    this._panelAnimationResolve();
                }
            };

            if(animate) {
                animation.size(animationConfig);
            } else {
                if(drawer.isHorizontalDirection()) {
                    $($panelOverlayContent).css("width", size);
                } else {
                    $($panelOverlayContent).css("height", size);

                    if(position === "bottom") {
                        $($panelOverlayContent).css("marginTop", marginTop);
                    }
                }
            }
        }
    }

    getPanelContent() {
        return $(this.getDrawerInstance().getOverlay().content());
    }

    _processOverlayZIndex() {
        if(!hasWindow()) {
            return;
        }

        const window = getWindow();
        const styles = window.getComputedStyle(this.getPanelContent().get(0));
        const zIndex = styles.zIndex || 1;

        this.getDrawerInstance().setZIndex(zIndex);
    }

    needOrderContent(position) {
        return position === "right" || position === "bottom";
    }
};

module.exports = OverlapStrategy;
