/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getHeight, getOuterHeight, setHeight } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import Accordion from '@js/ui/accordion';
import type { dxPopupAnimation } from '@js/ui/popup';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';
import DiagramFloatingPanel from '@ts/ui/diagram/ui.diagram.floating_panel';
import Tooltip from '@ts/ui/m_tooltip';
import type { PopupProperties } from '@ts/ui/popup/m_popup';
import ScrollView from '@ts/ui/scroll_view/scroll_view';
import TextBox from '@ts/ui/text_box/text_box';

const DIAGRAM_TOOLBOX_MIN_HEIGHT = 130;
const DIAGRAM_TOOLBOX_POPUP_CLASS = 'dx-diagram-toolbox-popup';
const DIAGRAM_TOOLBOX_PANEL_CLASS = 'dx-diagram-toolbox-panel';
const DIAGRAM_TOOLBOX_INPUT_CONTAINER_CLASS = 'dx-diagram-toolbox-input-container';
const DIAGRAM_TOOLBOX_INPUT_CLASS = 'dx-diagram-toolbox-input';
const DIAGRAM_TOOLTIP_DATATOGGLE = 'shape-toolbox-tooltip';
const DIAGRAM_TOOLBOX_START_DRAG_CLASS = '.dxdi-tb-start-drag-flag';

class DiagramToolbox extends DiagramFloatingPanel {
  private _toolboxes?: dxElementWrapper[];

  private _filterText!: string;

  private _searchInput?: TextBox;

  // @ts-expect-error ts-error
  private _scrollView?: ScrollView;

  private _accordion?: Accordion;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onShapeCategoryRenderedAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onFilterChangedAction?: any;

  _init(): void {
    super._init();

    this._toolboxes = [];
    this._filterText = '';
    this._createOnShapeCategoryRenderedAction();
    this._createOnFilterChangedAction();
  }

  _getPopupClass(): string {
    return DIAGRAM_TOOLBOX_POPUP_CLASS;
  }

  _getPopupHeight(): string | number {
    return this.isMobileView() ? '100%' : super._getPopupHeight();
  }

  _getPopupMaxHeight(): string | number {
    return this.isMobileView() ? '100%' : super._getPopupMaxHeight();
  }

  _getPopupMinHeight(): number {
    return DIAGRAM_TOOLBOX_MIN_HEIGHT;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPopupPosition() {
    // @ts-expect-error ts-error
    const { offsetParent, offsetX, offsetY } = this.option();
    const position = {
      my: 'left top',
      at: 'left top',
      of: offsetParent,
    };
    if (!this.isMobileView()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return extend(position, {
        offset: `${offsetX} ${offsetY}`,
      });
    }
    return position;
  }

  _getPopupAnimation(): dxPopupAnimation {
    const $parent = this.option('offsetParent');
    if (this.isMobileView()) {
      return {
        hide: this._getPopupSlideAnimationObject({
          direction: 'left',
          from: {
            position: {
              my: 'left top',
              at: 'left top',
              of: $parent,
            },
          },
          to: {
            position: {
              my: 'right top',
              at: 'left top',
              of: $parent,
            },
          },
        }),
        show: this._getPopupSlideAnimationObject({
          direction: 'right',
          from: {
            position: {
              my: 'right top',
              at: 'left top',
              of: $parent,
            },
          },
          to: {
            position: {
              my: 'left top',
              at: 'left top',
              of: $parent,
            },
          },
        }),
      };
    }
    return super._getPopupAnimation();
  }

  _getPopupOptions(): PopupProperties {
    const options = super._getPopupOptions();
    if (!this.isMobileView()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return extend(options, {
        showTitle: true,
        toolbarItems: [
          {
            widget: 'dxButton',
            location: 'center',
            options: {
              activeStateEnabled: false,
              focusStateEnabled: false,
              hoverStateEnabled: false,
              icon: 'diagram-toolbox-drag',
              stylingMode: 'outlined',
              type: 'normal',
            },
          },
        ],
      });
    }
    return options;
  }

  _renderPopupContent($parent: dxElementWrapper): void {
    let panelHeight = '100%';
    if (this.option('showSearch')) {
      const $inputContainer = $('<div>')
        .addClass(DIAGRAM_TOOLBOX_INPUT_CONTAINER_CLASS)
        .appendTo($parent);
      this._updateElementWidth($inputContainer);
      this._renderSearchInput($inputContainer);
      if (hasWindow()) {
        panelHeight = `calc(100% - ${getHeight(this._searchInput?.$element())}px)`;
      }
    }

    const $panel = $('<div>')
      .addClass(DIAGRAM_TOOLBOX_PANEL_CLASS)
      .appendTo($parent);
    setHeight($panel, panelHeight);
    this._updateElementWidth($panel);
    this._renderScrollView($panel);
  }

  _updateElementWidth($element: dxElementWrapper): void {
    if (this.option('toolboxWidth') !== undefined) {
      // @ts-expect-error ts-error
      const { toolboxWidth } = this.option();
      $element.css('width', toolboxWidth);
    }
  }

  updateMaxHeight(): void {
    if (this.isMobileView()) return;

    let maxHeight = 6;
    if (this._popup) {
      const $title = this._getPopupTitle();
      maxHeight += getOuterHeight($title);
    }
    if (this._accordion) {
      maxHeight += getOuterHeight(this._accordion.$element());
    }
    if (this._searchInput) {
      maxHeight += getOuterHeight(this._searchInput.$element());
    }
    this.option('maxHeight', maxHeight);
  }

  _renderSearchInput($parent: dxElementWrapper): void {
    const $input = $('<div>')
      .addClass(DIAGRAM_TOOLBOX_INPUT_CLASS)
      .appendTo($parent);
    this._searchInput = this._createComponent($input, TextBox, {
      stylingMode: 'outlined',
      placeholder: messageLocalization.format('dxDiagram-uiSearch'),
      onValueChanged: (data) => {
        this._onInputChanged(data.value);
      },
      valueChangeEvent: 'keyup',
      buttons: [
        {
          name: 'search',
          location: 'after',
          options: {
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            icon: 'search',
            stylingMode: 'outlined',
            type: 'normal',
            onClick: (): void => {
              this._searchInput?.focus();
            },
          },
        },
      ],
    });
  }

  _renderScrollView($parent: dxElementWrapper): void {
    const $scrollViewWrapper = $('<div>').appendTo($parent);

    // @ts-expect-error ts-error
    this._scrollView = this._createComponent($scrollViewWrapper, ScrollView);

    // Prevent scroll toolbox content for dragging vertically
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _moveIsAllowed = this._scrollView._moveIsAllowed.bind(
      this._scrollView,
    );
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    this._scrollView._moveIsAllowed = (e) => {
      // @ts-expect-error ts-error
      for (let i = 0; i < this._toolboxes?.length; i += 1) {
        const $element = this._toolboxes?.[i];
        if ($($element).children(DIAGRAM_TOOLBOX_START_DRAG_CLASS).length) {
          return false;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return _moveIsAllowed(e);
    };

    const $accordion = $('<div>').appendTo(this._scrollView.content());
    this._updateElementWidth($accordion);
    this._renderAccordion($accordion);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getAccordionDataSource() {
    const result = [];
    const toolboxGroups = this.option('toolboxGroups');
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < toolboxGroups.length; i += 1) {
      const { category } = toolboxGroups[i];
      const { title } = toolboxGroups[i];
      const groupObj = {
        category,
        title: title || category,
        expanded: toolboxGroups[i].expanded,
        displayMode: toolboxGroups[i].displayMode,
        shapes: toolboxGroups[i].shapes,
        onTemplate: (widget, $element, data): void => {
          const $toolboxElement = $($element);
          this._onShapeCategoryRenderedAction({
            category: data.category,
            displayMode: data.displayMode,
            dataToggle: DIAGRAM_TOOLTIP_DATATOGGLE,
            shapes: data.shapes,
            $element: $toolboxElement,
          });
          this._toolboxes?.push($toolboxElement);

          if (this._filterText !== '') {
            this._onFilterChangedAction({
              text: this._filterText,
              // @ts-expect-error ts-error
              // eslint-disable-next-line no-unsafe-optional-chaining
              filteringToolboxes: this._toolboxes?.length - 1,
            });
          }
          this._createTooltips($toolboxElement);
        },
      };
      // @ts-expect-error ts-error
      result.push(groupObj);
    }
    return result;
  }

  _createTooltips($toolboxElement: dxElementWrapper): void {
    if (this._isTouchMode()) return;

    const targets = $toolboxElement.find(
      `[data-toggle="${DIAGRAM_TOOLTIP_DATATOGGLE}"]`,
    );
    const $container = this.$element();
    // @ts-expect-error ts-error
    targets.each((_: number, element: Element) => {
      const $target = $(element);
      const title = $target.attr('title');
      if (title) {
        const $tooltip = $('<div>').text(title).appendTo($container);
        this._createComponent($tooltip, Tooltip, {
          target: $target.get(0),
          showEvent: 'mouseenter',
          hideEvent: 'mouseleave',
          position: 'top',
          animation: {
            show: {
              type: 'fade', from: 0, to: 1, delay: 500,
            },
            hide: {
              type: 'fade', from: 1, to: 0, delay: 100,
            },
          },
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _isTouchMode() {
    const { Browser } = getDiagram();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Browser.TouchUI;
  }

  _renderAccordion($container: dxElementWrapper): void {
    const { disabled } = this.option();

    this._accordion = this._createComponent($container, Accordion, {
      multiple: true,
      animationDuration: 0,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      collapsible: true,
      displayExpr: 'title',
      dataSource: this._getAccordionDataSource(),
      disabled,
      itemTemplate: (data, index, $element): void => {
        data.onTemplate(this, $element, data);
      },
      onSelectionChanged: (e): void => {
        this._updateScrollAnimateSubscription(e.component);
      },
      onContentReady: (e): void => {
        e.component.option('selectedItems', []);
        const items = e.component.option('dataSource');
        for (let i = 0; i < items?.length; i += 1) {
          if (items?.[i].expanded === false) {
            e.component.collapseItem(i);
          } else if (items?.[i].expanded === true) {
            e.component.expandItem(i);
          }
        }
        // expand first group
        if (items?.length && items[0].expanded === undefined) {
          e.component.expandItem(0);
        }

        this._updateScrollAnimateSubscription(e.component);
      },
    });
  }

  _updateScrollAnimateSubscription(component): void {
    // @ts-expect-error ts-error
    component._deferredAnimate = new Deferred();
    component._deferredAnimate.done(() => {
      this.updateMaxHeight();
      this._scrollView.update();
      this._updateScrollAnimateSubscription(component);
    });
  }

  _onInputChanged(text: string): void {
    this._filterText = text;
    this._onFilterChangedAction({
      text: this._filterText,
      filteringToolboxes: this._toolboxes?.map(($element, index) => index),
    });
    this.updateTooltips();

    this.updateMaxHeight();
    this._scrollView.update();
  }

  updateFilter(): void {
    this._onInputChanged(this._filterText);
  }

  updateTooltips(): void {
    this._toolboxes?.forEach(($element) => {
      const $tooltipContainer = $($element);
      this._createTooltips($tooltipContainer);
    });
  }

  _createOnShapeCategoryRenderedAction(): void {
    this._onShapeCategoryRenderedAction = this._createActionByOption(
      // @ts-expect-error ts-error
      'onShapeCategoryRendered',
    );
  }

  _createOnFilterChangedAction(): void {
    // @ts-expect-error ts-error
    this._onFilterChangedAction = this._createActionByOption('onFilterChanged');
  }

  _optionChanged(args): void {
    switch (args.name) {
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
        this._accordion?.option('dataSource', this._getAccordionDataSource());
        break;
      default:
        super._optionChanged(args);
    }
  }
}
export default DiagramToolbox;
