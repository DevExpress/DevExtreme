import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Accordion from "../accordion";
import ScrollView from "../scroll_view";
import ShapeCategories from "./ui.diagram.shape.categories";

const DIAGRAM_LEFT_PANEL_CLASS = "dx-diagram-left-panel";

class DiagramLeftPanel extends Widget {
    _init() {
        super._init();

        this._dataSources = this.option("dataSources") || {};
        this._customShapes = this.option("customShapes") || [];
        this._onShapeCategoryRenderedAction = this._createActionByOption("onShapeCategoryRendered");
        this._onDataToolboxRenderedAction = this._createActionByOption("onDataToolboxRendered");
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_LEFT_PANEL_CLASS);
        const $scrollViewWrapper = $("<div>")
            .appendTo(this.$element());

        const scrollView = this._createComponent($scrollViewWrapper, ScrollView);

        const $accordion = $("<div>")
            .appendTo(scrollView.content());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        var result = [];
        var categories = ShapeCategories.load(this._customShapes.length > 0);
        for(var i = 0; i < categories.length; i++) {
            result.push({
                category: categories[i].category,
                title: categories[i].title,
                onTemplate: (widget, $element, data) => {
                    this._onShapeCategoryRenderedAction({ category: data.category, $element });
                }
            });
        }
        for(var key in this._dataSources) {
            if(this._dataSources.hasOwnProperty(key)) {
                result.push({
                    key,
                    title: this._dataSources[key].title,
                    onTemplate: (widget, $element, data) => {
                        this._onDataToolboxRenderedAction({ key: data.key, $element });
                    }
                });
                this._hasDataSources = true;
            }
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
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element, data)
        });
        // TODO option for expanded item
        if(this._customShapes.length > 0 || this._hasDataSources) {
            this._accordionInstance.collapseItem(0);
            this._accordionInstance.expandItem(data.length - 1);
        }
    }

    _optionChanged(args) {
        switch(args.name) {
            case "customShapes":
                this._customShapes = args.value || [];
                this._invalidate();
                break;
            case "dataSources":
                this._dataSources = args.value || {};
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

module.exports = DiagramLeftPanel;
