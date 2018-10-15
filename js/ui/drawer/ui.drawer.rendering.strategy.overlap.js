import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";
import typeUtils from "../../core/utils/type";


class OverlapStrategy extends DrawerStrategy {

    renderPanel(template) {
        delete this._initialPosition;

        let position = this.getOverlayPosition();

        this._drawer._overlay = this._drawer._createComponent(this._drawer.content(), Overlay, {
            shading: false,
            container: this._drawer.getOverlayTarget(),
            position: position,
            height: "100%",
            animation: {
                show: {
                    duration: 0
                }
            },
            onPositioned: (function(e) {
                if(typeUtils.isDefined(this._initialPosition)) {
                    translator.move(e.component.$content(), { left: this._initialPosition.left });
                }
            }).bind(this),
            contentTemplate: template,
            visible: true,
            propagateOutsideClick: true
        });
    }

    getOverlayPosition() {
        debugger;
        let panelPosition = this._drawer.getDrawerPosition(),
            result = {};

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

        result.of = this._drawer.getOverlayTarget();

        return result;
    }

    setPanelSize(keepMaxSize) {
        const overlay = this._drawer.getOverlay();

        if(this._drawer.isHorizontalDirection()) {
            overlay.option("height", "100%");
            overlay.option("width", keepMaxSize ? this._drawer.getRealPanelWidth() : this._getPanelSize(this._drawer.option("opened")));
        } else {
            overlay.option("width", overlay.option("container").width());
            overlay.option("height", this._drawer.getRealPanelHeight());
        }
    }

    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        this._initialPosition = this._drawer.getOverlay().$content().position();

        const $content = $(this._drawer.viewContent());
        const position = this._drawer.getDrawerPosition();

        if(this._drawer.isHorizontalDirection()) {
            $content.css("paddingLeft", this._drawer.option("minSize") * this._drawer._getPositionCorrection());
        }

        $content.css("transform", "inherit");

        if(this._drawer.option("revealMode") === "slide") {
            const $element = $(this._drawer.content());
            const panelOffset = this._getPanelOffset(offset) * this._drawer._getPositionCorrection();

            if(animate) {
                let animationConfig = {
                    $element: $element,
                    position: panelOffset,
                    duration: this._drawer.option("animationDuration"),
                    direction: position,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };

                animation.moveTo(animationConfig);
            } else {

                if(this._drawer.isHorizontalDirection()) {
                    translator.move($element, { left: panelOffset });
                } else {
                    translator.move($element, { top: panelOffset });
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const $element = this._drawer.getOverlay().$content();
            const size = this._getPanelSize(offset);
            const marginTop = this._drawer.getRealPanelHeight() - size;

            let animationConfig = {
                $element: $element,
                size: size,
                duration: this._drawer.option("animationDuration"),
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
                if(this._drawer.isHorizontalDirection()) {
                    $($element).css("width", size);
                } else {
                    $($element).css("height", size);

                    if(position === "bottom") {
                        $($element).css("marginTop", marginTop);
                    }
                }
            }
        }
    }

    getPanelContent() {
        return $(this._drawer._overlay.content());
    }
};

module.exports = OverlapStrategy;
