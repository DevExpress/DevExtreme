import { animation } from "./ui.drawer.rendering.strategy";
import DrawerStrategy from "./ui.drawer.rendering.strategy";
import $ from "../../core/renderer";
import translator from "../../animation/translator";
import Overlay from "../overlay";
import typeUtils from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { camelize } from "../../core/utils/inflector";

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
            onContentReady: (args) => {
                whenPanelRendered.resolve();
                this._processOverlayZIndex(args.component.content());
            },
            visible: true,
            propagateOutsideClick: true
        });
    }

    _fixOverlayPosition($overlayContent) {
        // NOTE: overlay should be positioned in extended wrapper
        const drawer = this.getDrawerInstance();

        if(typeUtils.isDefined(this._initialPosition)) {
            translator.move($overlayContent, { left: this._initialPosition.left, top: this._initialPosition.top });
        }
        if(drawer.getDrawerPosition() === "right") {
            $overlayContent.css("left", "auto");

            if(drawer.option("rtlEnabled")) {
                translator.move($overlayContent, { left: 0 });
            }
        }
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
            overlay.option("height", keepMaxSize ? drawer.getRealPanelHeight() : this._getPanelSize(drawer.option("opened")));
        }
    }

    setupContent($content, position, drawer) {
        $content.css("padding" + camelize(position, true), drawer.option("minSize"));

        $content.css("transform", "inherit");
    }

    slidePositionRendering(config, offset, animate) {
        this._initialPosition = config.drawer.getOverlay().$content().position();
        const position = config.drawer.getDrawerPosition();

        this.setupContent(config.$content, position, config.drawer);

        const panelOffset = this._getPanelOffset(offset) * config.drawer._getPositionCorrection();

        if(animate) {
            let animationConfig = extend(config.defaultAnimationConfig, {
                $element: config.$panel,
                position: panelOffset,
                duration: config.drawer.option("animationDuration"),
                direction: position,
            });

            animation.moveTo(animationConfig);
        } else {

            if(config.drawer.isHorizontalDirection()) {
                translator.move(config.$panel, { left: panelOffset });
            } else {
                translator.move(config.$panel, { top: panelOffset });
            }
        }
    }

    expandPositionRendering(config, offset, animate) {
        this._initialPosition = config.drawer.getOverlay().$content().position();
        const position = config.drawer.getDrawerPosition();

        this.setupContent(config.$content, position, config.drawer);

        const $panelOverlayContent = config.drawer.getOverlay().$content();
        const marginTop = config.drawer.getRealPanelHeight() - config.size;

        translator.move($panelOverlayContent, { left: 0 });

        let animationConfig = extend(config.defaultAnimationConfig, {
            $element: $panelOverlayContent,
            size: config.size,
            duration: config.drawer.option("animationDuration"),
            direction: position,
            marginTop: marginTop,
        });

        if(animate) {
            animation.size(animationConfig);
        } else {
            if(config.drawer.isHorizontalDirection()) {
                $($panelOverlayContent).css("width", config.size);
            } else {
                $($panelOverlayContent).css("height", config.size);

                if(position === "bottom") {
                    $($panelOverlayContent).css("marginTop", marginTop);
                }
            }
        }
    }

    getPanelContent() {
        return $(this.getDrawerInstance().getOverlay().content());
    }

    _processOverlayZIndex($element) {
        const styles = $($element).get(0).style;
        const zIndex = styles.zIndex || 1;

        this.getDrawerInstance().setZIndex(zIndex);
    }

    needOrderContent(position) {
        return position === "right" || position === "bottom";
    }
}

module.exports = OverlapStrategy;
