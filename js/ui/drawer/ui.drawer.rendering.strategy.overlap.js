import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";
import typeUtils from "../../core/utils/type";


class OverlapStrategy extends DrawerStrategy {

    renderPanel(template, whenPanelRendered) {
        delete this._initialPosition;

        const position = this.getOverlayPosition();
        const drawer = this.getDrawerInstance();
        delete this._initialPosition;

        drawer._overlay = drawer._createComponent(drawer.content(), Overlay, {
            shading: false,
            container: drawer.getOverlayTarget(),
            position: position,
            height: "100%",
            animation: {
                show: {
                    duration: 0
                }
            },
            onPositioned: (function(e) {
                // NOTE: overlay should be positioned in extended wrapper
                if(typeUtils.isDefined(this._initialPosition)) {
                    translator.move(e.component.$content(), { left: this._initialPosition.left });
                }
                if(this.getDrawerInstance().getDrawerPosition() === "right") {
                    e.component.$content().css("left", "auto");
                }
            }).bind(this),
            contentTemplate: template,
            onContentReady: () => {
                whenPanelRendered.resolve();
            },
            visible: true,
            propagateOutsideClick: true
        });
    }

    getOverlayPosition() {
        const drawer = this.getDrawerInstance();
        const panelPosition = drawer.getDrawerPosition();

        let result = {};

        if(panelPosition === "left") {
            result = {
                my: "top left",
                at: "top left",
            };
        }
        if(panelPosition === "right") {
            result = {
                my: "top right",
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
        const position = drawer.getDrawerPosition();

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
};

module.exports = OverlapStrategy;
