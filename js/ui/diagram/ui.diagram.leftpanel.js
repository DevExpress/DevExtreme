import $ from "../../core/renderer";

import DiagramPanel from "./diagram.panel";
import Accordion from "../accordion";
import ScrollView from "../scroll_view";
import { Deferred } from "../../core/utils/deferred";

const DIAGRAM_LEFT_PANEL_CLASS = "dx-diagram-left-panel";

class DiagramLeftPanel extends DiagramPanel {
    _init() {
        super._init();

        this._toolboxData = this.option("toolboxData") || [];
        this._onShapeCategoryRenderedAction = this._createActionByOption("onShapeCategoryRendered");
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_LEFT_PANEL_CLASS);
        const $scrollViewWrapper = $("<div>")
            .appendTo(this.$element());

        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);

        const $accordion = $("<div>")
            .appendTo(this._scrollView.content());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        var result = [];
        for(var i = 0; i < this._toolboxData.length; i++) {
            var simpleCategory = typeof this._toolboxData[i] === "string";
            var category = simpleCategory ? this._toolboxData[i] : this._toolboxData[i].category;
            var title = simpleCategory ? this._toolboxData[i] : this._toolboxData[i].title;
            var groupObj = {
                category,
                title: title || category,
                style: this._toolboxData[i].style,
                shapes: this._toolboxData[i].shapes,
                onTemplate: (widget, $element, data) => {
                    this._onShapeCategoryRenderedAction({
                        category: data.category,
                        style: data.style,
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
            displayExpr: "title",
            dataSource: data,
            disabled: this.option("disabled"),
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element, data),
            onContentReady: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            }
        });

        for(var i = 0; i < data.length; i++) {
            if(data[i] === false) {
                this._accordionInstance.collapseItem(i);
            } else if(data[i] === true) {
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
            case "disabled":
                this._accordionInstance.option('disabled', args.value);
                break;
            case "toolboxData":
                this._toolboxData = this.option("toolboxData") || [];
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

module.exports = DiagramLeftPanel;
