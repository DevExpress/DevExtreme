import $ from '../../core/renderer';

import DiagramPanel from './diagram.panel';
import Accordion from '../accordion';
import ScrollView from '../scroll_view';
import { Deferred } from '../../core/utils/deferred';

const DIAGRAM_LEFT_PANEL_CLASS = 'dx-diagram-left-panel';

class DiagramLeftPanel extends DiagramPanel {
    _init() {
        super._init();

        this._onShapeCategoryRenderedAction = this._createActionByOption('onShapeCategoryRendered', {
            excludeValidators: ['disabled']
        });
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_LEFT_PANEL_CLASS);
        const $scrollViewWrapper = $('<div>')
            .appendTo(this.$element());

        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);

        const $accordion = $('<div>')
            .appendTo(this._scrollView.content());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        var result = [];
        var toolboxGroups = this.option('toolboxGroups');
        for(var i = 0; i < toolboxGroups.length; i++) {
            var category = toolboxGroups[i].category;
            var title = toolboxGroups[i].title;
            var groupObj = {
                category,
                title: title || category,
                expanded: toolboxGroups[i].expanded,
                displayMode: toolboxGroups[i].displayMode,
                shapes: toolboxGroups[i].shapes,
                onTemplate: (widget, $element, data) => {
                    this._onShapeCategoryRenderedAction({
                        category: data.category,
                        displayMode: data.displayMode,
                        shapes: data.shapes,
                        $element
                    });
                }
            };
            result.push(groupObj);
        }
        return result;
    }
    _renderAccordion($container) {
        var data = this._getAccordionDataSource();
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            collapsible: true,
            displayExpr: 'title',
            dataSource: data,
            disabled: this.option('disabled'),
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element, data),
            onContentReady: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            }
        });

        for(var i = 0; i < data.length; i++) {
            if(data[i].expanded === false) {
                this._accordionInstance.collapseItem(i);
            } else if(data[i].expanded === true) {
                this._accordionInstance.expandItem(i);
            }
        }
    }

    _updateScrollAnimateSubscription(component) {
        component._deferredAnimate = new Deferred();
        component._deferredAnimate.done(() => {
            this._scrollView.update();
            this._updateScrollAnimateSubscription(component);
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'disabled':
                this._accordionInstance.option('disabled', args.value);
                break;
            case 'toolboxGroups':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

module.exports = DiagramLeftPanel;
