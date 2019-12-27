import { animation } from './ui.drawer.rendering.strategy';
import DrawerStrategy from './ui.drawer.rendering.strategy';
import $ from '../../core/renderer';
import translator from '../../animation/translator';
import Overlay from '../overlay';
import { ensureDefined } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { camelize } from '../../core/utils/inflector';

class OverlapStrategy extends DrawerStrategy {

    renderPanel(template, whenPanelRendered) {
        delete this._initialPosition;

        const position = this.getOverlayPosition();
        const drawer = this.getDrawerInstance();

        const { opened, minSize } = drawer.option();

        drawer._overlay = drawer._createComponent(drawer.content(), Overlay, {
            shading: false,
            container: drawer.getOverlayTarget(),
            position: position,
            width: opened ? 'auto' : minSize || 0,
            height: '100%',
            templatesRenderAsynchronously: drawer.option('templatesRenderAsynchronously'),
            animation: {
                show: {
                    duration: 0
                }
            },
            onPositioned: (function(e) {
                this._fixOverlayPosition(e.component.$content());
            }).bind(this),
            contentTemplate: drawer.option('template'),
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
        const position = ensureDefined(this._initialPosition, { left: 0, top: 0 });
        translator.move($overlayContent, position);

        const drawer = this.getDrawerInstance();
        if(drawer.getDrawerPosition() === 'right') {
            $overlayContent.css('left', 'auto');
        }
    }

    getOverlayPosition() {
        const drawer = this.getDrawerInstance();
        const panelPosition = drawer.getDrawerPosition();

        let result = {};

        if(panelPosition === 'left') {
            result = {
                my: 'top left',
                at: 'top left',
            };
        }
        if(panelPosition === 'right') {
            const my = drawer.option('rtlEnabled') ? 'top left' : 'top right';

            result = {
                my: my,
                at: 'top right',
            };
        }

        if(panelPosition === 'top' || panelPosition === 'bottom') {
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
            overlay.option('height', '100%');
            overlay.option('width', keepMaxSize ? drawer.getRealPanelWidth() : this._getPanelSize(drawer.option('opened')));
        } else {
            overlay.option('width', overlay.option('container').width());
            overlay.option('height', keepMaxSize ? drawer.getRealPanelHeight() : this._getPanelSize(drawer.option('opened')));
        }
    }

    setupContent($content, position) {
        const drawer = this.getDrawerInstance();

        $content.css('padding' + camelize(position, true), drawer.option('minSize'));
        $content.css('transform', 'inherit');
    }

    slidePositionRendering(config, offset, animate) {
        const drawer = this.getDrawerInstance();

        this._initialPosition = drawer.isHorizontalDirection() ? { left: config.panelOffset } : { top: config.panelOffset };
        const position = drawer.getDrawerPosition();

        this.setupContent(config.$content, position, config.drawer);

        if(animate) {
            const animationConfig = extend(config.defaultAnimationConfig, {
                $element: config.$panel,
                position: config.panelOffset,
                duration: drawer.option('animationDuration'),
                direction: position,
            });

            animation.moveTo(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                translator.move(config.$panel, { left: config.panelOffset });
            } else {
                translator.move(config.$panel, { top: config.panelOffset });
            }
        }
    }

    expandPositionRendering(config, offset, animate) {
        const drawer = this.getDrawerInstance();

        this._initialPosition = { left: 0 };
        const position = drawer.getDrawerPosition();

        this.setupContent(config.$content, position);

        translator.move(config.$panelOverlayContent, { left: 0 });

        const animationConfig = extend(config.defaultAnimationConfig, {
            $element: config.$panelOverlayContent,
            size: config.size,
            duration: drawer.option('animationDuration'),
            direction: position,
            marginTop: config.marginTop,
        });

        if(animate) {
            animation.size(animationConfig);
        } else {
            if(drawer.isHorizontalDirection()) {
                $(config.$panelOverlayContent).css('width', config.size);
            } else {
                $(config.$panelOverlayContent).css('height', config.size);

                if(position === 'bottom') {
                    $(config.$panelOverlayContent).css('marginTop', config.marginTop);
                }
            }
        }
    }

    getPositionRenderingConfig(offset) {
        const drawer = this.getDrawerInstance();
        const config = super.getPositionRenderingConfig(offset);

        return extend(config, {
            panelOffset: this._getPanelOffset(offset) * this.getDrawerInstance()._getPositionCorrection(),
            $panelOverlayContent: drawer.getOverlay().$content(),
            marginTop: drawer.getRealPanelHeight() - config.size
        });
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
        return position === 'right' || position === 'bottom';
    }
}

module.exports = OverlapStrategy;
