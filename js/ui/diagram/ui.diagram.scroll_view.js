import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import ScrollView from '../scroll_view';

import { getDiagram } from './diagram.importer';

class DiagramScrollView extends Widget {
    _init() {
        super._init();

        const { EventDispatcher } = getDiagram();
        this.onScroll = new EventDispatcher();

        this._createOnCreateDiagramAction();
    }
    _initMarkup() {
        super._initMarkup();

        const $scrollViewWrapper = $('<div>')
            .appendTo(this.$element());
        this._scrollView = this._createComponent($scrollViewWrapper, ScrollView, {
            direction: 'both',
            bounceEnabled: false,
            onScroll: ({ scrollOffset }) => {
                this._raiseOnScroll(scrollOffset.left, scrollOffset.top);
            }
        });
        this._onCreateDiagramAction({
            $parent: $(this._scrollView.content()),
            scrollView: this
        });
    }

    setScroll(left, top) {
        this._scrollView.scrollTo({ left, top });
        this._raiseOnScrollWithoutPoint();
    }
    offsetScroll(left, top) {
        this._scrollView.scrollBy({ left, top });
        this._raiseOnScrollWithoutPoint();
    }
    getSize() {
        const { Size } = getDiagram();
        const $element = this._scrollView.$element();
        return new Size(
            Math.floor($element.width()),
            Math.floor($element.height())
        );
    }
    getScrollContainer() {
        return this._scrollView.$element()[0];
    }
    getScrollBarWidth() {
        return 0;
    }
    detachEvents() {
    }

    _raiseOnScroll(left, top) {
        const { Point } = getDiagram();
        this.onScroll.raise('notifyScrollChanged', () => {
            return new Point(left, top);
        });
    }
    _raiseOnScrollWithoutPoint() {
        const { Point } = getDiagram();
        this.onScroll.raise('notifyScrollChanged', () => {
            return new Point(this._scrollView.scrollLeft(), this._scrollView.scrollTop());
        });
    }
    _createOnCreateDiagramAction() {
        this._onCreateDiagramAction = this._createActionByOption('onCreateDiagram');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onCreateDiagram':
                this._createOnCreateDiagramAction();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

export default DiagramScrollView;
