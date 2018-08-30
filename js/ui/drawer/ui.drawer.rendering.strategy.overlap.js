import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";


class OverlapStrategy extends DrawerStrategy {

    renderPanel(template) {
        this._drawer._overlay = this._drawer._createComponent(this._drawer.content(), Overlay, {
            shading: false,
            container: this._drawer._$wrapper,
            width: 200,
            position: {
                my: "top left",
                at: "top left",
                of: $(window),
                offset: {
                    x: 0,
                    y: 0
                }
            },
            animation: {
                show: {
                    duration: 0
                }
            },
            contentTemplate: template,
            visible: true,
            propagateOutsideClick: true
        });

        this._drawer._overlay && this._drawer._overlay.option("width", this._drawer.getRealPanelWidth());
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
                translator.move($(this._drawer._$panel), { left: panelPosition * this._drawer._getPositionCorrection() });
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
