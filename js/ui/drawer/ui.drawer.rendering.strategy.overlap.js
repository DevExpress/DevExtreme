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
            target: $(window),
            height: "100%",
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

        this._drawer._$panel = this._drawer._overlay._$wrapper;
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


        result.of = $(window);

        return result;
    }

    setPanelSize() {
        if(this._drawer._isHorizontalDirection()) {
            this._drawer._overlay.option("height", $(window).height());
            this._drawer._overlay.option("width", this._drawer.getRealPanelWidth());
        } else {
            this._drawer._overlay.option("width", $(window).width());
            this._drawer._overlay.option("height", this._drawer.getRealPanelHeight());
        }
    }

    renderPosition(offset, animate) {
        super.renderPosition(offset, animate);

        const direction = this._drawer.option("position");

        const panelPosition = this._getPanelOffset(offset);

        $(this._drawer.viewContent()).css("paddingLeft", this._drawer.option("minSize") * this._drawer._getPositionCorrection());

        if(this._drawer.option("revealMode") === "slide") {
            if(animate) {
                let animationConfig = {
                    $element: $(this._drawer._$panel),
                    position: panelPosition * this._drawer._getPositionCorrection(),
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
                    translator.move($(this._drawer._$panel), { left: panelPosition * this._drawer._getPositionCorrection() });
                } else {
                    translator.move($(this._drawer._$panel), { top: panelPosition * this._drawer._getPositionCorrection() });
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const $element = this._drawer._overlay.$content();
            const width = this._getPanelWidth(offset);
            if(animate) {
                animation.width($element, width, this._drawer.option("animationDuration"), () => {
                    this._contentAnimationResolve();
                    this._panelAnimationResolve();
                });
            } else {
                $($element).css("width", width);
            }
        }
    }

    getPanelContent() {
        return $(this._drawer._overlay.content());
    }
};

module.exports = OverlapStrategy;
