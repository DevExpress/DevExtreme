import { getHeight, setHeight, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import { Deferred } from '../../core/utils/deferred';
import messageLocalization from '../../common/core/localization/message';
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
const DIAGRAM_TOOLBOX_START_DRAG_CLASS = '.dxdi-tb-start-drag-flag';

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
                panelHeight = 'calc(100% - ' + getHeight(this._searchInput.$element()) + 'px)';
            }
        }

        const $panel = $('<div>')
            .addClass(DIAGRAM_TOOLBOX_PANEL_CLASS)
            .appendTo($parent);
        setHeight($panel, panelHeight);
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
            maxHeight += getOuterHeight($title);
        }
        if(this._accordion) {
            maxHeight += getOuterHeight(this._accordion.$element());
        }
        if(this._searchInput) {
            maxHeight += getOuterHeight(this._searchInput.$element());
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

        // Prevent scroll toolbox content for dragging vertically
        const _moveIsAllowed = this._scrollView._moveIsAllowed.bind(this._scrollView);
        this._scrollView._moveIsAllowed = (e) => {
            for(let i = 0; i < this._toolboxes.length; i++) {
                const $element = this._toolboxes[i];
                if($($element).children(DIAGRAM_TOOLBOX_START_DRAG_CLASS).length) {
                    return false;
                }
            }
            return _moveIsAllowed(e);
        };

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
                    this._createTooltips($toolboxElement);
                }
            };
            result.push(groupObj);
        }
        return result;
    }
    _createTooltips($toolboxElement) {
        if(this._isTouchMode()) return;

        const targets = $toolboxElement.find('[data-toggle="' + DIAGRAM_TOOLTIP_DATATOGGLE + '"]');
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
    _isTouchMode() {
        const { Browser } = getDiagram();
        return Browser.TouchUI;
    }
    _renderAccordion($container) {
        this._accordion = this._createComponent($container, Accordion, {
            multiple: true,
            animationDuration: 0,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            collapsible: true,
            displayExpr: 'title',
            dataSource: this._getAccordionDataSource(),
            disabled: this.option('disabled'),
            itemTemplate: (data, index, $element) => {
                data.onTemplate(this, $element, data);
            },
            onSelectionChanged: (e) => {
                this._updateScrollAnimateSubscription(e.component);
            },
            onContentReady: (e) => {
                e.component.option('selectedItems', []);
                const items = e.component.option('dataSource');
                for(let i = 0; i < items.length; i++) {
                    if(items[i].expanded === false) {
                        e.component.collapseItem(i);
                    } else if(items[i].expanded === true) {
                        e.component.expandItem(i);
                    }
                }
                // expand first group
                if(items.length && items[0].expanded === undefined) {
                    e.component.expandItem(0);
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

    _onInputChanged(text) {
        this._filterText = text;
        this._onFilterChangedAction({
            text: this._filterText,
            filteringToolboxes: this._toolboxes.map(($element, index) => index)
        });
        this.updateTooltips();

        this.updateMaxHeight();
        this._scrollView.update();
    }
    updateFilter() {
        this._onInputChanged(this._filterText);
    }
    updateTooltips() {
        this._toolboxes.forEach($element => {
            const $tooltipContainer = $($element);
            this._createTooltips($tooltipContainer);
        });
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
