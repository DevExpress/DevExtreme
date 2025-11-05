/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// TODO: Can we get rid of this dependency of the PivotGrid here?
import { calculateScrollbarWidth } from '__internal/grids/pivot_grid/m_widget_utils';
import $ from '@js/core/renderer';
import { getHeight, getWidth } from '@js/core/utils/size';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';
import type { ScrollViewProperties } from '@ts/ui/scroll_view/scroll_view';
import ScrollView from '@ts/ui/scroll_view/scroll_view';

interface Properties extends ScrollViewProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreateDiagram?: any;
  useNativeScrolling?: boolean;
}

class DiagramScrollView extends Widget<Properties> {
  // @ts-expect-error ts-error
  _scrollView?: ScrollView;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScroll?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onCreateDiagramAction?: any;

  _init(): void {
    super._init();

    const { EventDispatcher } = getDiagram();
    this.onScroll = new EventDispatcher();

    this._createOnCreateDiagramAction();
  }

  _initMarkup(): void {
    super._initMarkup();

    const $scrollViewWrapper = $('<div>').appendTo(this.$element());
    const options = {
      direction: 'both',
      bounceEnabled: false,
      scrollByContent: false,
      onScroll: ({ scrollOffset }): void => {
        this._raiseOnScroll(scrollOffset.left, scrollOffset.top);
      },
    };
    const { useNativeScrolling } = this.option();
    if (useNativeScrolling !== undefined) {
      // @ts-expect-error ts-error
      options.useNative = useNativeScrolling;
    }
    this._scrollView = this._createComponent(
      $scrollViewWrapper,
      ScrollView,
      // @ts-expect-error ts-error
      options,
    );
    this._onCreateDiagramAction({
      $parent: $(this._scrollView.content()),
      scrollView: this,
    });
  }

  setScroll(left, top): void {
    this._scrollView?.scrollTo({ left, top });
    this._raiseOnScrollWithoutPoint();
  }

  offsetScroll(left, top): void {
    this._scrollView?.scrollBy({ left, top });
    this._raiseOnScrollWithoutPoint();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSize() {
    const { Size } = getDiagram();
    const $element = this._scrollView?.$element();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new Size(
      Math.floor(getWidth($element)),
      Math.floor(getHeight($element)),
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getScrollContainer() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._scrollView?.$element()[0];
  }

  getScrollBarWidth(): number {
    const { useNativeScrolling } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return useNativeScrolling ? calculateScrollbarWidth() : 0;
  }

  detachEvents(): void {}

  _raiseOnScroll(left, top): void {
    const { Point } = getDiagram();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.onScroll.raise('notifyScrollChanged', () => new Point(left, top));
  }

  _raiseOnScrollWithoutPoint(): void {
    const { Point } = getDiagram();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.onScroll.raise('notifyScrollChanged', () => new Point(
      this._scrollView?.scrollLeft(),
      this._scrollView?.scrollTop(),
    ));
  }

  _createOnCreateDiagramAction(): void {
    this._onCreateDiagramAction = this._createActionByOption('onCreateDiagram');
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'onCreateDiagram':
        this._createOnCreateDiagramAction();
        break;
      case 'useNativeScrolling':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default DiagramScrollView;
