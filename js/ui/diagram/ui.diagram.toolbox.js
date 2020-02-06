import $ from '../../core/renderer';
import { Deferred } from '../../core/utils/deferred';
import { hasWindow } from '../../core/utils/window';
import Widget from '../widget/ui.widget';
import Popup from '../popup';
import TextBox from '../text_box';
import Accordion from '../accordion';
import ScrollView from '../scroll_view';
import Tooltip from '../tooltip';

const DIAGRAM_TOOLBOX_SPACING = 22;
const DIAGRAM_TOOLBOX_POPUP_WIDTH = 136;
const DIAGRAM_TOOLBOX_POPUP_CLASS = 'dx-diagram-toolbox-popup';
const DIAGRAM_TOOLBOX_PANEL_CLASS = 'dx-diagram-toolbox-panel';
const DIAGRAM_TOOLBOX_INPUT_CLASS = 'dx-diagram-toolbox-input';
const DIAGRAM_TOOLTIP_DATATOGGLE = 'shape-toolbox-tooltip';
const DIAGRAM_SKIP_GESTURE_CLASS = 'dx-skip-gesture-event';

class DiagramToolbox extends Widget {
    _init() {
        super._init();

        this._toolboxes = [];
        this.filterText = '';
        this._onShapeCategoryRenderedAction = this._createActionByOption('onShapeCategoryRendered');
        this._onFilterChangedAction = this._createActionByOption('onFilterChanged');
    }
    _initMarkup() {
        super._initMarkup();

        const that = this;
        const $parent = this.$element();

        const popupHeight = hasWindow() ? $parent.height() - 2 * DIAGRAM_TOOLBOX_SPACING : 200;
        const $popupElement = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_POPUP_CLASS)
            .appendTo($parent);

        this._popupInstance = this._createComponent($popupElement, Popup, {
            animation: null,
            width: DIAGRAM_TOOLBOX_POPUP_WIDTH,
            height: popupHeight,
            position: {
                my: 'left top',
                at: 'left top',
                of: $parent,
                offset: DIAGRAM_TOOLBOX_SPACING + ' ' + DIAGRAM_TOOLBOX_SPACING
            },
            shading: false,
            toolbarItems: [{
                widget: 'dxButton',
                location: 'center',
                options: {
                    activeStateEnabled: false,
                    focusStateEnabled: false,
                    hoverStateEnabled: false,
                    icon: 'diagram-toolbox-drag',
                    stylingMode: 'outlined',
                    type: 'normal',
                }
            }],
            onContentReady: function() {
                that._renderPopupContent(that._popupInstance.content());
            }
        });

        if(this.option('visible')) {
            this._popupInstance.show();
        }
    }
    _renderPopupContent($parent) {
        const that = this;
        const $input = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_INPUT_CLASS)
            .appendTo($parent);
        this._searchInputInstance = this._createComponent($input, TextBox, {
            placeholder: 'Search',
            onValueChanged: function(data) {
                that._onInputChanged(data.value);
            },
            valueChangeEvent: 'keyup',
            buttons: [{
                name: 'search',
                location: 'after',
                options: {
                    activeStateEnabled: false,
                    focusStateEnabled: false,
                    hoverStateEnabled: false,
                    icon: 'search',
                    stylingMode: 'outlined',
                    type: 'normal',
                    onClick: function() {
                        that._searchInputInstance.focus();
                    }
                }
            }]
        });

        const $panel = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_PANEL_CLASS)
            .appendTo($parent);
        this._renderScrollView($panel);
    }
    _renderScrollView($parent) {
        super._initMarkup();

        const $scrollViewWrapper = $('<div>')
            .appendTo($parent);

        this._scrollViewInstance = this._createComponent($scrollViewWrapper, ScrollView);

        const $accordion = $('<div>')
            .appendTo(this._scrollViewInstance.content());

        this._renderAccordion($accordion);
    }

    _getAccordionDataSource() {
        const result = [];
        const toolboxGroups = this.option('toolboxGroups');
        for(let i = 0; i < toolboxGroups.length; i++) {
            const category = toolboxGroups[i].category;
            const title = toolboxGroups[i].title;
            const groupObj = {
                category,
                title: title || category,
                expanded: toolboxGroups[i].expanded,
                displayMode: toolboxGroups[i].displayMode,
                shapes: toolboxGroups[i].shapes,
                onTemplate: (widget, $element, data) => {
                    const $toolboxElement = $($element);
                    this._onShapeCategoryRenderedAction({
                        category: data.category,
                        displayMode: data.displayMode,
                        dataToggle: DIAGRAM_TOOLTIP_DATATOGGLE,
                        shapes: data.shapes,
                        $element: $toolboxElement
                    });
                    this._toolboxes.push($toolboxElement);

                    if(this.filterText !== '') {
                        this._onFilterChangedAction({
                            text: this.filterText,
                            filteringToolboxes: this._toolboxes.length - 1
                        });
                    }
                    this._createTooltips($toolboxElement.find('[data-toggle="' + DIAGRAM_TOOLTIP_DATATOGGLE + '"]'));
                }
            };
            result.push(groupObj);
        }
        return result;
    }
    _createTooltips(targets) {
        const $container = this.$element();
        targets.each((index, element) => {
            const $target = $(element);
            const title = $target.attr('title');
            if(title) {
                const $tooltip = $('<div>')
                    .html(title)
                    .appendTo($container);
                this._createComponent($tooltip, Tooltip, {
                    target: $target.get(0),
                    showEvent: 'mouseenter',
                    hideEvent: 'mouseleave',
                    position: 'top',
                    animation: {
                        show: { type: 'fade', from: 0, to: 1, delay: 500 },
                        hide: { type: 'fade', from: 1, to: 0, delay: 100 }
                    }
                });
            }
        });
    }
    _renderAccordion($container) {
        const data = this._getAccordionDataSource();
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            collapsible: true,
            displayExpr: 'title',
            dataSource: data,
            disabled: this.option('disabled'),
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element, data),
            onContentReady: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            }
        });

        for(let i = 0; i < data.length; i++) {
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
            this._scrollViewInstance.update();
            this._updateScrollAnimateSubscription(component);
        });
    }
    _raiseToolboxDragStart() {
        this._scrollViewInstance.$element().addClass(DIAGRAM_SKIP_GESTURE_CLASS);
    }
    _raiseToolboxDragEnd() {
        this._scrollViewInstance.$element().removeClass(DIAGRAM_SKIP_GESTURE_CLASS);
    }
    _onInputChanged(text) {
        this.filterText = text;
        this._onFilterChangedAction({
            text: this.filterText,
            filteringToolboxes: this._toolboxes.map(($element, index) => index)
        });
        this._toolboxes.forEach($element => {
            const $tooltipContainer = $($element);
            this._createTooltips($tooltipContainer.find('[data-toggle="' + DIAGRAM_TOOLTIP_DATATOGGLE + '"]'));
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'visible':
                this._popupInstance.option('visible', args.value);
                break;
            case 'toolboxGroups':
                this._accordionInstance.option('dataSource', this._getAccordionDataSource());
                break;
            default:
                super._optionChanged(args);
        }
    }
}
module.exports = DiagramToolbox;
