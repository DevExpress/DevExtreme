import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Accordion from "../accordion";
import ScrollView from "../scroll_view";
import ShapeCategories from "./ui.diagram.shape.categories";

const DIAGRAM_LEFT_PANEL_CLASS = "dx-diagram-left-panel";

class DiagramLeftPanel extends Widget {
    _init() {
        super._init();
        this._showCustomShapes = this.option("showCustomShapes");
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
    _getDataSources() {
        return this.option("dataSources") || {};
    }
    _getAccordionDataSource() {
        var result = [];
        var categories = ShapeCategories.load(this._showCustomShapes);
        for(var i = 0; i < categories.length; i++) {
            result.push({
                category: categories[i].category,
                title: categories[i].title,
                onTemplate: (widget, $element, data) => {
                    this._onShapeCategoryRenderedAction({ category: data.category, $element });
                }
            });
        }
        var dataSources = this._getDataSources();
        for(var key in dataSources) {
            if(dataSources.hasOwnProperty(key)) {
                result.push({
                    key,
                    title: dataSources[key].title,
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
        if(this._showCustomShapes || this._hasDataSources) {
            this._accordionInstance.collapseItem(0);
            this._accordionInstance.expandItem(data.length - 1);
        }
    }
}

module.exports = DiagramLeftPanel;
