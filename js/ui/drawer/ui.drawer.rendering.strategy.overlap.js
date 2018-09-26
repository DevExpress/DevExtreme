import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";


class OverlapStrategy extends DrawerStrategy {

    renderPanel(template) {
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
            contentTemplate: template,
            visible: true,
            propagateOutsideClick: true
        });
    }

    getOverlayPosition() {
        let position = this._drawer.option("position"),
            result = {};

        if(position === "left") {
            result = {
                my: "top left",
                at: "top left",
            };
        }
        if(position === "right") {
            result = {
                my: "top right",
                at: "top right",
            };
        }

        if(position === "top" || position === "bottom") {
            result = {
                my: position,
                at: position,
            };
        }

        result.of = this._drawer.getOverlayTarget();

        return result;
    }

    setPanelSize() {
        const overlay = this._drawer.getOverlay();

        if(this._drawer._isHorizontalDirection()) {
            overlay.option("height", "100%");
            overlay.option("width", this._drawer.getRealPanelWidth());
        } else {
            overlay.option("width", overlay.option("container").width());
            overlay.option("height", this._drawer.getRealPanelHeight());
        }
    }

    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const direction = this._drawer.option("position");
        const panelPosition = this._getPanelOffset(offset) * this._drawer._getPositionCorrection();

        this._drawer._isHorizontalDirection() && $(this._drawer.viewContent()).css("paddingLeft", this._drawer.option("minSize") * this._drawer._getPositionCorrection());

        if(this._drawer.option("revealMode") === "slide") {
            if(animate) {
                let animationConfig = {
                    $element: $(this._drawer.content()),
                    position: panelPosition,
                    duration: this._drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };

                animation.moveTo(animationConfig);
            } else {

                if(this._drawer._isHorizontalDirection()) {
                    translator.move($(this._drawer.content()), { left: panelPosition });
                } else {
                    translator.move($(this._drawer.content()), { top: panelPosition });
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const $element = this._drawer._overlay.$content();
            const size = this._getPanelSize(offset);
            const direction = this._drawer.option("position");
            const marginTop = this._drawer.getRealPanelHeight() - size;

            let animationConfig = {
                $element: $element,
                size: size,
                duration: this._drawer.option("animationDuration"),
                direction: direction,
                marginTop: marginTop,
                complete: () => {
                    this._contentAnimationResolve();
                    this._panelAnimationResolve();
                }
            };

            if(animate) {
                animation.size(animationConfig);
            } else {
                if(this._drawer._isHorizontalDirection()) {
                    $($element).css("width", size);
                } else {
                    $($element).css("height", size);

                    if(direction === "bottom") {
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
