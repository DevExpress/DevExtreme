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
            container: this._drawer._$wrapper,
            width: 200,
            position: position,
            animation: {
                show: {
                    duration: 0
                }
            },
            contentTemplate: template,
            visible: true,
            propagateOutsideClick: true
        });

        if(this._drawer.option("position") === "left") {
            this._drawer._overlay && this._drawer._overlay.option("width", this._drawer.getRealPanelWidth());
        }
        if(this._drawer.option("position") === "top" || this._drawer.option("position") === "bottom") {
            this._drawer._overlay && this._drawer._overlay.option("width", this._drawer.getRealPanelWidth());
            this._drawer._overlay && this._drawer._overlay.option("height", this._drawer.getRealPanelHeight());
        }
    }

    getOverlayPosition() {
        let position = this._drawer.option("position"),
            result = {};

        if(position === "left" || position === "right") {
            result = {
                my: "top left",
                at: "top left",
            };
        }
        if(position === "top") {
            result = {
                my: "top",
                at: "top",
            };
        }

        if(position === "bottom") {
            result = {
                my: "bottom",
                at: "bottom",
            };
        }

        result.of = $(window);

        return result;
    }

    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const direction = this._drawer.option("position");
        const panelPosition = this._getPanelOffset(offset);

        $(this._drawer.viewContent()).css("paddingLeft", this._drawer.option("minWidth") * this._drawer._getPositionCorrection());

        if(this._drawer.option("revealMode") === "slide") {
            if(animate) {
                let animationConfig = {
                    $element: $(this._drawer._$panel),
                    position: direction === "bottom" ? panelPosition * this._drawer._getPositionCorrection() : panelPosition,
                    duration: this._drawer.option("animationDuration"),
                    direction: direction,
                    complete: () => {
                        this._contentAnimationResolve();
                        this._panelAnimationResolve();
                    }
                };

                animation.moveTo(animationConfig);
            } else {

                if(direction === "left" || direction === "right") {
                    translator.move($(this._drawer._$panel), { left: panelPosition * this._drawer._getPositionCorrection() });
                }

                if(direction === "top" || direction === "bottom") {
                    translator.move($(this._drawer._$panel), { top: panelPosition * this._drawer._getPositionCorrection() });
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const width = this._getPanelWidth(offset);
            if(animate) {
                animation.width($(this._drawer._$panel), width, this._drawer.option("animationDuration"), () => {
                    this._contentAnimationResolve();
                    this._panelAnimationResolve();
                });
            } else {
                $(this._drawer._$panel).css("width", width);
            }
        }
    }
};

module.exports = OverlapStrategy;
