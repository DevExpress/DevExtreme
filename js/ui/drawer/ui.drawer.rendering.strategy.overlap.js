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
        let position = this._drawer.option("position"),
            rtl = this._drawer.option("rtlEnabled"),
            result = {};

        if(position === "left") {
            result = {
                my: "top left",
                at: "top left",
            };
        }
        if(position === "right" || rtl) {
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

    setPanelSize(keepMaxSize) {
        const overlay = this._drawer.getOverlay();

        if(this._drawer._isHorizontalDirection()) {
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

        const $element = $(this._drawer.content());
        const $content = $(this._drawer.viewContent());

        const direction = this._drawer.option("position");
        const panelPosition = this._getPanelOffset(offset) * this._drawer._getPositionCorrection();

        if(this._drawer._isHorizontalDirection()) {
            $content.css("paddingLeft", this._drawer.option("minSize") * this._drawer._getPositionCorrection());
        }

        $content.css("transform", "inherit");

        if(this._drawer.option("revealMode") === "slide") {
            if(animate) {
                let animationConfig = {
                    $element: $element,
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
                    translator.move($element, { left: panelPosition });
                } else {
                    translator.move($element, { top: panelPosition });
                }
            }
        }

        if(this._drawer.option("revealMode") === "expand") {
            const $element = this._drawer.getOverlay().$content();
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
