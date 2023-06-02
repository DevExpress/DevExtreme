
import { patchFontOptions } from '../core/utils';
import { noop } from '../../core/utils/common';

const pieChartPlugin = {
    name: 'center_template_pie_chart',
    init: noop,
    dispose: function() {
        this._centerTemplateGroup.linkOff().dispose();
    },
    extenders: {
        _createHtmlStructure() {
            const patchedFontOptions = patchFontOptions(this._themeManager._font);
            this._centerTemplateGroup = this._renderer.g()
                .attr({ class: 'dxc-hole-template' })
                .linkOn(this._renderer.root, 'center-template')
                .css(patchedFontOptions)
                .linkAppend();
        },
        _renderExtraElements() {
            this._requestChange(['CENTER_TEMPLATE']);
        },
    },
    members: {
        _renderCenterTemplate() {
            const template = this.option('centerTemplate');
            const centerTemplateGroup = this._centerTemplateGroup.clear();

            if(!template) {
                return;
            }
            centerTemplateGroup.attr({ visibility: 'hidden' });

            const center = this._getCenter();

            this._getTemplate(template).render({
                model: this,
                container: centerTemplateGroup.element,
                onRendered: () => {
                    const group = centerTemplateGroup;
                    const bBox = group.getBBox();
                    const bBoxCenterX = bBox.x + bBox.width / 2;
                    const bBoxCenterY = bBox.y + bBox.height / 2;
                    group.move(center.x - bBoxCenterX, center.y - bBoxCenterY);
                    group.attr({ visibility: 'visible' });
                }
            });
        },
    },
    customize(constructor) {
        constructor.addChange({
            code: 'CENTER_TEMPLATE',
            handler: function() {
                this._renderCenterTemplate();
            },
            option: 'centerTemplate',
        });
    },
};

const gaugePlugin = {
    name: 'center_template_gauge',
    init: noop,
    dispose: pieChartPlugin.dispose,
    extenders: {
        _initCore() {
            this._createCenterTemplateGroup();
        },
        _renderContent() {
            const patchedFontOptions = patchFontOptions(this._themeManager._font);
            this._centerTemplateGroup.css(patchedFontOptions);
            this._requestChange(['CENTER_TEMPLATE']);
        },
        _updateExtraElements() {
            this._requestChange(['CENTER_TEMPLATE']);
        },
    },
    members: {
        _renderCenterTemplate: pieChartPlugin.members._renderCenterTemplate,
        _createCenterTemplateGroup() {
            this._centerTemplateGroup = this._renderer.g()
                .attr({ class: 'dxg-hole-template' })
                .linkOn(this._renderer.root, 'center-template')
                .linkAppend();
        },
    },
    customize: pieChartPlugin.customize,
};

export const plugins = {
    pieChart: pieChartPlugin,
    gauge: gaugePlugin
};
