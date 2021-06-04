import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import { Deferred } from '../../core/utils/deferred';
import messageLocalization from '../../localization/message';
import TextBox from '../text_box';
import Accordion from '../accordion';
import ScrollView from '../scroll_view';
import Tooltip from '../tooltip';

import { getDiagram } from './diagram.importer';
import DiagramFloatingPanel from './ui.diagram.floating_panel';

const DIAGRAM_TOOLBOX_MIN_HEIGHT = 130;
const DIAGRAM_TOOLBOX_POPUP_CLASS = 'dx-diagram-toolbox-popup';
const DIAGRAM_TOOLBOX_PANEL_CLASS = 'dx-diagram-toolbox-panel';
const DIAGRAM_TOOLBOX_INPUT_CONTAINER_CLASS = 'dx-diagram-toolbox-input-container';
const DIAGRAM_TOOLBOX_INPUT_CLASS = 'dx-diagram-toolbox-input';
const DIAGRAM_TOOLTIP_DATATOGGLE = 'shape-toolbox-tooltip';
const DIAGRAM_SKIP_GESTURE_CLASS = 'dx-skip-gesture-event';

class DiagramToolbox extends DiagramFloatingPanel {
    _init() {
        super._init();

        this._toolboxes = [];
        this._filterText = '';
        this._createOnShapeCategoryRenderedAction();
        this._createOnFilterChangedAction();
    }
    _getPopupClass() {
        return DIAGRAM_TOOLBOX_POPUP_CLASS;
    }
    _getPopupHeight() {
        return this.isMobileView() ? '100%' : super._getPopupHeight();
    }
    _getPopupMaxHeight() {
        return this.isMobileView() ? '100%' : super._getPopupMaxHeight();
    }
    _getPopupMinHeight() {
        return DIAGRAM_TOOLBOX_MIN_HEIGHT;
    }
    _getPopupPosition() {
        const $parent = this.option('offsetParent');
        const position = {
            my: 'left top',
            at: 'left top',
            of: $parent
        };
        if(!this.isMobileView()) {
            return extend(position, {
                offset: this.option('offsetX') + ' ' + this.option('offsetY')
            });
        }
        return position;
    }
    _getPopupAnimation() {
        const $parent = this.option('offsetParent');
        if(this.isMobileView()) {
            return {
                hide: this._getPopupSlideAnimationObject({
                    direction: 'left',
                    from: {
                        position: {
                            my: 'left top',
                            at: 'left top',
                            of: $parent
                        }
                    },
                    to: {
                        position: {
                            my: 'right top',
                            at: 'left top',
                            of: $parent
                        }
                    }
                }),
                show: this._getPopupSlideAnimationObject({
                    direction: 'right',
                    from: {
                        position: {
                            my: 'right top',
                            at: 'left top',
                            of: $parent
                        }
                    },
                    to: {
                        position: {
                            my: 'left top',
                            at: 'left top',
                            of: $parent
                        }
                    }
                }),
            };
        }
        return super._getPopupAnimation();
    }
    _getPopupOptions() {
        const options = super._getPopupOptions();
        if(!this.isMobileView()) {
            return extend(options, {
                showTitle: true,
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
                }]
            });
        }
        return options;
    }
    _renderPopupContent($parent) {
        let panelHeight = '100%';
        if(this.option('showSearch')) {
            const $inputContainer = $('<div>')
                .addClass(DIAGRAM_TOOLBOX_INPUT_CONTAINER_CLASS)
                .appendTo($parent);
            this._updateElementWidth($inputContainer);
            this._renderSearchInput($inputContainer);
            if(hasWindow()) {
                panelHeight = 'calc(100% - ' + this._searchInput.$element().height() + 'px)';
            }
        }

        const $panel = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_PANEL_CLASS)
            .appendTo($parent)
            .height(panelHeight);
        this._updateElementWidth($panel);
        this._renderScrollView($panel);
    }
    _updateElementWidth($element) {
        if(this.option('toolboxWidth') !== undefined) {
            $element.css('width', this.option('toolboxWidth'));
        }
    }
    updateMaxHeight() {
        if(this.isMobileView()) return;

        let maxHeight = 6;
        if(this._popup) {
            const $title = this._getPopupTitle();
            maxHeight += $title.outerHeight();
        }
        if(this._accordion) {
            maxHeight += this._accordion.$element().outerHeight();
        }
        if(this._searchInput) {
            maxHeight += this._searchInput.$element().outerHeight();
        }
        this.option('maxHeight', maxHeight);
    }
    _renderSearchInput($parent) {
        const $input = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_INPUT_CLASS)
            .appendTo($parent);
        this._searchInput = this._createComponent($input, TextBox, {
            stylingMode: 'outlined',
            placeholder: messageLocalization.format('dxDiagram-uiSearch'),
            onValueChanged: data => {
                this._onInputChanged(data.value);
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
                    onClick: () => {
                        this._searchInput.focus();
                    }
                }
            }]
        });
    }
    _renderScrollView($parent) {
        const $scrollViewWrapper = $('<div>')
            .appendTo($parent);

        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);

        const $accordion = $('<div>')
            .appendTo(this._scrollView.content());
        this._updateElementWidth($accordion);
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

                    if(this._filterText !== '') {
                        this._onFilterChangedAction({
                            text: this._filterText,
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
        const { Browser } = getDiagram();
        if(Browser.TouchUI) return;

        const $container = this.$element();
        targets.each((index, element) => {
            const $target = $(element);
            const title = $target.attr('title');
            if(title) {
                const $tooltip = $('<div>')
                    .text(title)
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
        this._accordion = this._createComponent($container, Accordion, {
            multiple: true,
            animationDuration: 0,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            collapsible: true,
            displayExpr: 'title',
            dataSource: data,
            disabled: this.option('disabled'),
            itemTemplate: (data, index, $element) => {
                data.onTemplate(this, $element, data);
            },
            onSelectionChanged: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            },
            onContentReady: (e) => {
                for(let i = 0; i < data.length; i++) {
                    if(data[i].expanded === false) {
                        e.component.collapseItem(i);
                    } else if(data[i].expanded === true) {
                        e.component.expandItem(i);
                    }
                }
                this._updateScrollAnimateSubscription(e.component);
            }
        });
    }
    _updateScrollAnimateSubscription(component) {
        component._deferredAnimate = new Deferred();
        component._deferredAnimate.done(() => {
            this.updateMaxHeight();
            this._scrollView.update();
            this._updateScrollAnimateSubscription(component);
        });
    }
    _raiseToolboxDragStart() {
        this._scrollView.$element().addClass(DIAGRAM_SKIP_GESTURE_CLASS);
    }
    _raiseToolboxDragEnd() {
        this._scrollView.$element().removeClass(DIAGRAM_SKIP_GESTURE_CLASS);
    }
    _onInputChanged(text) {
        this._filterText = text;
        this._onFilterChangedAction({
            text: this._filterText,
            filteringToolboxes: this._toolboxes.map(($element, index) => index)
        });
        this._toolboxes.forEach($element => {
            const $tooltipContainer = $($element);
            this._createTooltips($tooltipContainer.find('[data-toggle="' + DIAGRAM_TOOLTIP_DATATOGGLE + '"]'));
        });

        this.updateMaxHeight();
        this._scrollView.update();
    }

    _createOnShapeCategoryRenderedAction() {
        this._onShapeCategoryRenderedAction = this._createActionByOption('onShapeCategoryRendered');
    }
    _createOnFilterChangedAction() {
        this._onFilterChangedAction = this._createActionByOption('onFilterChanged');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onShapeCategoryRendered':
                this._createOnShapeCategoryRenderedAction();
                break;
            case 'onFilterChanged':
                this._createOnFilterChangedAction();
                break;
            case 'showSearch':
            case 'toolboxWidth':
                this._invalidate();
                break;
            case 'toolboxGroups':
                this._accordion.option('dataSource', this._getAccordionDataSource());
                break;
            default:
                super._optionChanged(args);
        }
    }
}
export default DiagramToolbox;
