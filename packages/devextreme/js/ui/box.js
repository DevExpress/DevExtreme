import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { hasWindow } from '../core/utils/window';
import { dasherize } from '../core/utils/inflector';
import { isDefined } from '../core/utils/type';
import { normalizeStyleProp, styleProp, stylePropPrefix, setStyle } from '../core/utils/style';
import { each } from '../core/utils/iterator';
import CollectionWidgetItem from './collection/item';
import CollectionWidget from './collection/ui.collection_widget.live_update';

// const _size = __webpack_require__(58664);
// const _index = __webpack_require__(39611);
// import eventsEngine from '../events/core/events_engine';
// const _drag = __webpack_require__(23174);
import Resizable from '../ui/resizable';
import Draggable from '../ui/draggable';

// const DRAGSTART_START_EVENT_NAME = (0, _index.addNamespace)(_drag.start, 'Box');
// const DRAGSTART_EVENT_NAME = (0, _index.addNamespace)(_drag.move, 'Box');
// const DRAGSTART_END_EVENT_NAME = (0, _index.addNamespace)(_drag.end, 'Box');
// const RESIZABLE_HANDLE_CLASS = 'dx-resizable-handle';
const RESIZABLE_RESIZING_CLASS = 'dx-resizable-resizing';


// STYLE box

const BOX_CLASS = 'dx-box';
const BOX_FLEX_CLASS = 'dx-box-flex';
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const SHRINK = 1;
const MINSIZE_MAP = {
    'row': 'minWidth',
    'col': 'minHeight'
};
const MAXSIZE_MAP = {
    'row': 'maxWidth',
    'col': 'maxHeight'
};
const FLEX_JUSTIFY_CONTENT_MAP = {
    'start': 'flex-start',
    'end': 'flex-end',
    'center': 'center',
    'space-between': 'space-between',
    'space-around': 'space-around'
};
const FLEX_ALIGN_ITEMS_MAP = {
    'start': 'flex-start',
    'end': 'flex-end',
    'center': 'center',
    'stretch': 'stretch'
};
const FLEX_DIRECTION_MAP = {
    'row': 'row',
    'col': 'column'
};

const setFlexProp = (element, prop, value) => {
    // NOTE: workaround for jQuery version < 1.11.1 (T181692)
    value = normalizeStyleProp(prop, value);
    element.style[styleProp(prop)] = value;

    // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
    if(!hasWindow()) {
        if(value === '' || !isDefined(value)) {
            return;
        }

        const cssName = dasherize(prop);
        const styleExpr = cssName + ': ' + value + ';';

        setStyle(element, styleExpr, false);
    }
};

class BoxItem extends CollectionWidgetItem {
    _renderVisible(value, oldValue) {
        super._renderVisible(value);
        if(isDefined(oldValue)) {
            this._options.fireItemStateChangedAction({
                name: 'visible',
                state: value,
                oldState: oldValue
            });
        }
    }
}

class LayoutStrategy {
    constructor($element, option, component) {
        this._$element = $element;
        this._option = option;
        this._component = component;
    }

    renderBox() {
        this._$element.css({
            display: stylePropPrefix('flexDirection') + 'flex'
        });
        setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[this._option('direction')]);
    }

    renderAlign() {
        this._$element.css({
            justifyContent: this._normalizedAlign()
        });
    }

    _normalizedAlign() {
        const align = this._option('align');
        return (align in FLEX_JUSTIFY_CONTENT_MAP) ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
    }

    renderCrossAlign() {
        this._$element.css({
            alignItems: this._normalizedCrossAlign()
        });
    }

    _normalizedCrossAlign() {
        const crossAlign = this._option('crossAlign');
        return (crossAlign in FLEX_ALIGN_ITEMS_MAP) ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
    }

    _createDragElement($element) {
        let result = $element;
        const clone = true; // this.option('clone');
        const $container = this._$element; // this._getContainer();
        // let template = this.option('dragTemplate');

        // if(template) {
        //     template = this._getTemplate(template);
        //     result = $('<div>').appendTo($container);
        //     template.render(this._getDragTemplateArgs($element, result));
        // } else
        if(clone) {
            debugger;
            result = $('<div>').appendTo($container);
            $element.clone().css({
                width: $element.css('width'),
                height: $element.css('height'),
            }).appendTo(result);
        }

        return result
            .toggleClass('dx-resizable-clone', result.get(0) !== $element.get(0))
            .toggleClass('dx-rtl', this._component.option('rtlEnabled'));
    }

    _addResizableToItem($item) {
        const that = this;

        // draggable
        // this.resizable = that._component._createComponent($('<div>'), Draggable, {
        //     container: that._$element,
        //     // handles: that._option('direction') === 'row' ? 'right' : 'bottom',
        //     // step: 100, // It doesn't work
        //     onDragStart: e => {
        //         const box = $(e.event.target).closest('.dx-box');
        //         that.prevLayout = [];
        //         that.panelConstraintsArray = [];

        //         box.children('.dx-box-item').each((_, item) => {
        //             // $item.css('flex-basis');
        //             that.prevLayout.push(parseFloat($(item).css('flex-grow')));
        //             that.panelConstraintsArray.push(extend({
        //                 collapsedSize: undefined,
        //                 collapsible: undefined,
        //                 defaultSize: undefined,
        //                 maxSize: undefined,
        //                 minSize: undefined
        //             }, $(item).data(BOX_ITEM_DATA_KEY)));
        //         });
        //         console.log('prevLayout', this.prevLayout);
        //         console.log(that.panelConstraintsArray);
        //     },
        //     onDragMove: e => {
        //         // const box = $(e.event.target).closest('.dx-box');
        //         // const boxItem = $(e.event.target).parent();
        //         // console.log('resize', e.event, box);
        //         // // console.log('offset', offsetPercentage);

        //         // const nextLayout = that._adjustLayoutByDelta(e);
        //         // console.log(nextLayout);
        //         // const $panes = box.children('.dx-box-item');

        //         // console.log($panes);
        //         // $panes.each((index, pane) => {
        //         //     setFlexProp(pane, 'flexGrow', nextLayout[index]);
        //         // });


        //         // setLayout(nextLayout);
        //         // eagerValuesRef.current.layout = nextLayout;
        //         // if (onLayout) {
        //         //   onLayout(nextLayout);
        //         // }
        //         // callPanelCallbacks(
        //         //   panelDataArray,
        //         //   nextLayout,
        //         //   panelIdToLastNotifiedSizeMapRef.current
        //         // );
        //         // if(!this._$target) {
        //         //     return;
        //         // }
        //         // $(this._$target).attr({
        //         //     height: e.height,
        //         //     width: e.width
        //         // });
        //         // this.updateFramePosition();
        //     },
        //     onDragEnd(e) {
        //         const box = $(e.event.target).closest('.dx-box');
        //         const boxItem = $(e.event.target).parent();
        //         console.log('resize', e.event, box);
        //         // console.log('offset', offsetPercentage);

        //         const nextLayout = that._adjustLayoutByDelta(e);
        //         console.log(nextLayout);
        //         const $panes = box.children('.dx-box-item');

        //         console.log($panes);
        //         $panes.each((index, pane) => {
        //             setFlexProp(pane, 'flexGrow', nextLayout[index]);
        //         });
        //         // setLayout(nextLayout);
        //         // eagerValuesRef.current.layout = nextLayout;
        //         // if (onLayout) {
        //         //   onLayout(nextLayout);
        //         // }
        //         // callPanelCallbacks(
        //         //   panelDataArray,
        //         //   nextLayout,
        //         //   panelIdToLastNotifiedSizeMapRef.current
        //         // );
        //         // if(!this._$target) {
        //         //     return;
        //         // }
        //         // $(this._$target).attr({
        //         //     height: e.height,
        //         //     width: e.width
        //         // });
        //         // this.updateFramePosition();
        //     }
        // });

        // with resizable
        this.resizable = that._component._createComponent($item, Resizable, {
            handles: that._option('direction') === 'row' ? 'right' : 'bottom',
            step: 100, // It doesn't work
            onResizeStart: e => {
                const box = $(e.event.target).closest('.dx-box');
                that.prevLayout = [];
                that.panelConstraintsArray = [];

                box.children('.dx-box-item').each((_, item) => {
                    // $item.css('flex-basis');
                    that.prevLayout.push(parseFloat($(item).css('flex-grow')));
                    that.panelConstraintsArray.push(extend({
                        collapsedSize: undefined,
                        collapsible: undefined,
                        defaultSize: undefined,
                        maxSize: undefined,
                        minSize: undefined
                    }, $(item).data(BOX_ITEM_DATA_KEY)));
                });
                console.log('prevLayout', this.prevLayout);
                console.log(that.panelConstraintsArray);

                debugger;
                // that._createDragElement(that.resizable._handles[0]);
            },
            onResize: e => {
                const box = $(e.event.target).closest('.dx-box');
                const boxItem = $(e.event.target).parent();
                console.log('resize', e.event, box);
                // console.log('offset', offsetPercentage);

                const nextLayout = that._adjustLayoutByDelta(e);
                console.log(nextLayout);
                const $panes = box.children('.dx-box-item');

                console.log($panes);
                $panes.each((index, pane) => {
                    setFlexProp(pane, 'flexGrow', nextLayout[index]);
                });


                // setLayout(nextLayout);


                // eagerValuesRef.current.layout = nextLayout;
                // if (onLayout) {
                //   onLayout(nextLayout);
                // }
                // callPanelCallbacks(
                //   panelDataArray,
                //   nextLayout,
                //   panelIdToLastNotifiedSizeMapRef.current
                // );
                // if(!this._$target) {
                //     return;
                // }
                // $(this._$target).attr({
                //     height: e.height,
                //     width: e.width
                // });
                // this.updateFramePosition();
            },
            onResizeEnd(e) {
                // const box = $(e.event.target).closest('.dx-box');
                // const boxItem = $(e.event.target).parent();
                // console.log('resize', e.event, box);
                // // console.log('offset', offsetPercentage);

                // const nextLayout = that._adjustLayoutByDelta(e);
                // console.log(nextLayout);
                // const $panes = box.children('.dx-box-item');

                // console.log($panes);
                // $panes.each((index, pane) => {
                //     setFlexProp(pane, 'flexGrow', nextLayout[index]);
                // });


                // setLayout(nextLayout);
                // eagerValuesRef.current.layout = nextLayout;
                // if (onLayout) {
                //   onLayout(nextLayout);
                // }
                // callPanelCallbacks(
                //   panelDataArray,
                //   nextLayout,
                //   panelIdToLastNotifiedSizeMapRef.current
                // );
                // if(!this._$target) {
                //     return;
                // }
                // $(this._$target).attr({
                //     height: e.height,
                //     width: e.width
                // });
                // this.updateFramePosition();
            }
        });

        // this.resizable._handles[0].dxDraggable({
        //     clone: true,
        //     container: this._$element,
        // });
    }

    renderItems($items) {
        const flexPropPrefix = stylePropPrefix('flexDirection');
        const direction = this._option('direction');
        const that = this;

        debugger;
        each($items, function() {
            const $item = $(this);
            const item = $item.data(BOX_ITEM_DATA_KEY);

            $item.css({ display: flexPropPrefix + 'flex' })
                .css(MAXSIZE_MAP[direction], item.maxSize || 'none')
                .css(MINSIZE_MAP[direction], item.minSize || '0px'); // handler minSize, но не для последнего у которого нет handler

            setFlexProp($item.get(0), 'flexBasis', item.baseSize || 0);
            setFlexProp($item.get(0), 'flexGrow', item.ratio);
            setFlexProp($item.get(0), 'flexShrink', isDefined(item.shrink) ? item.shrink : SHRINK);

            setFlexProp($item.get(0), 'flexDirection', FLEX_DIRECTION_MAP[that._option('direction')]);

            // console.log($item.index(), $items.length);
            // if($item.get(0) !== $items[$items.length - 1]) {
            //     console.log('handles', that._option('direction') === 'row' ? 'right' : 'bottom');
            //     that._addResizableToItem($item);
            // }
            // if($item.children().eq(0).hasClass('dx-resizable-handle')) {
            //     // const eventName = addNamespace('mousedown', 'Box');
            //     // const mouseMoveEventName = addNamespace('mousemove', 'Box');
            //     console.log({
            //         [`.${DRAGSTART_START_EVENT_NAME}`]: () => {
            //             console.log('dragstart');
            //         },
            //         [`.${DRAGSTART_EVENT_NAME}`]: () => {
            //             console.log('drag');
            //         },
            //         [`.${DRAGSTART_END_EVENT_NAME}`]: () => {
            //             console.log('dragstart');
            //         }
            //     });
            //     this.resizable = that._component._createComponent($item.prev(), Resizable, {
            //         handles: 'right',
            //         onResize: (e) => {
            //             console.log('resize');
            //             // if(!this._$target) {
            //             //     return;
            //             // }
            //             // $(this._$target).attr({
            //             //     height: e.height,
            //             //     width: e.width
            //             // });
            //             // this.updateFramePosition();
            //         }
            //     });
            //     // eventsEngine.on($item.children().eq(0), {
            //     //     [`${DRAGSTART_START_EVENT_NAME}`]: that._dragStartHandler.bind(that),
            //     //     [`${DRAGSTART_EVENT_NAME}`]: that._dragHandler.bind(that),
            //     //     [`${DRAGSTART_END_EVENT_NAME}`]: () => {
            //     //         console.log('dragstart');
            //     //     }
            //     // }, {
            //     //     direction: 'both',
            //     //     immediate: true
            //     // });
            //     // eventsEngine.off($item.children().eq(0), eventName);
            //     // eventsEngine.off($item.children().eq(0), mouseMoveEventName);
            //     // eventsEngine.on($item.children().eq(0), eventName, (e) => {
            //     //     console.log('mousedown');
            //     // });
            //     // eventsEngine.on($item.children().eq(0), mouseMoveEventName, (e) => {
            //     //     console.log('mousemove');
            //     // });
            // }

            $item.children().each((_, itemContent) => {
                if($(itemContent).hasClass('dx-resizable-handle')) return;

                $(itemContent).css({
                    width: 'auto',
                    height: 'auto',
                    display: stylePropPrefix('flexDirection') + 'flex',
                    flexBasis: 0
                });

                setFlexProp(itemContent, 'flexGrow', 1);
                setFlexProp(itemContent, 'flexDirection', $(itemContent)[0].style.flexDirection || 'column');
            });
        });
    }

    _fuzzyCompareNumbers(actual, expected) {
        const fractionDigits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
        const delta = parseFloat(actual.toFixed(fractionDigits)) - parseFloat(expected.toFixed(fractionDigits));
        if(delta === 0) {
            return 0;
        } else {
            return delta > 0 ? 1 : -1;
        }
    }
    _resizePanel(_ref) {
        let {
            // eslint-disable-next-line prefer-const
            panelConstraints: panelConstraintsArray,
            // eslint-disable-next-line prefer-const
            panelIndex,
            size
        } = _ref;
        const panelConstraints = panelConstraintsArray[panelIndex];
        const {
            collapsedSize = 0,
            collapsible,
            maxSize = 100,
            minSize = 0
        } = panelConstraints;
        if(this._fuzzyCompareNumbers(size, minSize) < 0) {
            if(collapsible) {
            // Collapsible panels should snap closed or open only once they cross the halfway point between collapsed and min size.
                const halfwayPoint = (collapsedSize + minSize) / 2;
                if(this._fuzzyCompareNumbers(size, halfwayPoint) < 0) {
                    size = collapsedSize;
                } else {
                    size = minSize;
                }
            } else {
                size = minSize;
            }
        }
        size = Math.min(maxSize, size);
        size = parseFloat(size.toFixed(5)); // todo
        return size;
    }
    _adjustLayoutByDelta(e) {
        const box = $(e.event.target).closest('.dx-box');
        const groupRect = box.get(0).getBoundingClientRect();
        const groupSizeInPixels = this._option('direction') === 'row' ? groupRect.width : groupRect.height;
        // debugger;
        const offset = this._option('direction') === 'row' ? e.event.offset.x : e.event.offset.y;
        let delta = offset / groupSizeInPixels * 100;
        console.log('delta', this.delta);
        const prevLayout = this.prevLayout;
        const nextLayout = [...prevLayout];
        // let delta = e.event.offset.x;
        let deltaApplied = 0;
        const panelConstraintsArray = this.panelConstraintsArray;
        debugger;
        const [firstPivotIndex, secondPivotIndex] = [$(e.event.target).prev().data().dxItemIndex, $(e.event.target).prev().data().dxItemIndex + 1]; // $(e.event.target).next().index() + 1];
        console.log(firstPivotIndex, secondPivotIndex);
        const increment = delta < 0 ? 1 : -1;
        let index = delta < 0 ? secondPivotIndex : firstPivotIndex;
        let maxAvailableDelta = 0;
        // DEBUG.push("pre calc...");
        while(true) {
            const prevSize = prevLayout[index];
            const maxSafeSize = this._resizePanel({
                panelConstraints: panelConstraintsArray,
                panelIndex: index,
                size: 100
            });
            const delta = maxSafeSize - prevSize;
            // DEBUG.push(`  ${index}: ${prevSize} -> ${maxSafeSize}`);
            maxAvailableDelta += delta;
            index += increment;
            if(index < 0 || index >= panelConstraintsArray.length) {
                break;
            }
        }
        console.log('maxAvailableDelta', maxAvailableDelta);
        console.log('index', index);
        const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
        delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta;
        console.log('minAbsDelta', minAbsDelta);
        const pivotIndex = delta < 0 ? firstPivotIndex : secondPivotIndex;
        index = pivotIndex;
        while(index >= 0 && index < panelConstraintsArray.length) {
            const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);
            const prevSize = prevLayout[index];
            // assert(prevSize != null);
            const unsafeSize = prevSize - deltaRemaining;
            const safeSize = this._resizePanel({
                panelConstraints: panelConstraintsArray,
                panelIndex: index,
                size: unsafeSize
            });
            if(!(this._fuzzyCompareNumbers(prevSize, safeSize) === 0)) {
                deltaApplied += prevSize - safeSize;
                nextLayout[index] = safeSize;
                if(deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, {
                    numeric: true
                }) >= 0) {
                    break;
                }
            }
            if(delta < 0) {
                index--;
            } else {
                index++;
            }
        }
        if(this._fuzzyCompareNumbers(deltaApplied, 0) === 0) {
            // console.log(DEBUG.join("\n"));
            return prevLayout;
        }
        {
            // Now distribute the applied delta to the panels in the other direction
            const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
            const prevSize = prevLayout[pivotIndex];
            // assert(prevSize != null);
            const unsafeSize = prevSize + deltaApplied;
            const safeSize = this._resizePanel({
                panelConstraints: panelConstraintsArray,
                panelIndex: pivotIndex,
                size: unsafeSize
            });
            // Adjust the pivot panel before, but only by the amount that surrounding panels were able to shrink/contract.
            nextLayout[pivotIndex] = safeSize;
            // Edge case where expanding or contracting one panel caused another one to change collapsed state
            if(!(this._fuzzyCompareNumbers(safeSize, unsafeSize) === 0)) {
                let deltaRemaining = unsafeSize - safeSize;
                const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
                let index = pivotIndex;
                while(index >= 0 && index < panelConstraintsArray.length) {
                    const prevSize = nextLayout[index];
                    // assert(prevSize != null);
                    const unsafeSize = prevSize + deltaRemaining;
                    const safeSize = this._resizePanel({
                        panelConstraints: panelConstraintsArray,
                        panelIndex: index,
                        size: unsafeSize
                    });
                    if(!(this._fuzzyCompareNumbers(prevSize, safeSize) === 0)) {
                        deltaRemaining -= safeSize - prevSize;
                        nextLayout[index] = safeSize;
                    }
                    if(this._fuzzyCompareNumbers(deltaRemaining, 0) === 0) {
                        break;
                    }
                    if(delta > 0) {
                        index--;
                    } else {
                        index++;
                    }
                }
            }
        }
        const totalSize = nextLayout.reduce((total, size) => size + total, 0);
        // DEBUG.push(`total size: ${totalSize}`);
        // console.log(DEBUG.join("\n"));
        console.log(nextLayout);
        if(!(this._fuzzyCompareNumbers(totalSize, 100) === 0)) {
            return prevLayout;
        }
        console.log(nextLayout);
        return nextLayout;
    }
    _dragStartHandler(e) {
        console.log('dragstart');
        // const $element = this.$element();
        // if($element.is('.dx-state-disabled, .dx-state-disabled *')) {
        //     e.cancel = true;
        //     return;
        // }
        debugger;
        this._toggleResizingClass(true);
        this._movingSides = {
            left: true,
            right: true
        }; // this._getMovingSides(e);
        // this._elementLocation = locate($element);
        // this._elementSize = this._getElementSize();
        this._renderDragOffsets(e);
        // this._resizeStartAction({
        //     event: e,
        //     width: this._elementSize.width,
        //     height: this._elementSize.height,
        //     handles: this._movingSides
        // });
        e.targetElements = null;
    }
    _dragHandler(e) {
        console.log('drag', e);
        const offset = this._getOffset(e);
        console.log(offset);
        // const delta = this._getDeltaByOffset(offset);
        // const dimensions = this._updateDimensions(delta);
        // this._updatePosition(delta, dimensions);
        // this._triggerResizeAction(e, dimensions);
    }
    _getOffset(e) {
        const offset = e.offset;
        const sides = this._movingSides;
        if(!sides.left && !sides.right) offset.x = 0;
        if(!sides.top && !sides.bottom) offset.y = 0;
        return offset;
    }
    _renderDragOffsets(e) {
        // const area = this._getArea();
        // if(!area) {
        //     return;
        // }
        // const $handle = $(e.target).closest('.' + RESIZABLE_HANDLE_CLASS);
        // const handleWidth = getOuterWidth($handle);
        // const handleHeight = getOuterHeight($handle);
        // const handleOffset = $handle.offset();
        // const areaOffset = area.offset;
        // const scrollOffset = this._getAreaScrollOffset();
        // e.maxLeftOffset = this._leftMaxOffset = handleOffset.left - areaOffset.left - scrollOffset.scrollX;
        // e.maxRightOffset = this._rightMaxOffset = areaOffset.left + area.width - handleOffset.left - handleWidth + scrollOffset.scrollX;
        // e.maxTopOffset = this._topMaxOffset = handleOffset.top - areaOffset.top - scrollOffset.scrollY;
        // e.maxBottomOffset = this._bottomMaxOffset = areaOffset.top + area.height - handleOffset.top - handleHeight + scrollOffset.scrollY;
    }
    _toggleResizingClass(value) {
        this._$element.toggleClass(RESIZABLE_RESIZING_CLASS, value);

    }
}

class Box extends CollectionWidget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            direction: 'row',

            align: 'start',

            crossAlign: 'stretch',

            /**
            * @name dxBoxOptions.activeStateEnabled
            * @hidden
            */
            activeStateEnabled: false,

            /**
            * @name dxBoxOptions.focusStateEnabled
            * @hidden
            */
            focusStateEnabled: false,

            onItemStateChanged: undefined,

            _queue: undefined

            /**
            * @name dxBoxOptions.hint
            * @hidden
            */
            /**
            * @name dxBoxOptions.noDataText
            * @hidden
            */
            /**
            * @name dxBoxOptions.onSelectionChanged
            * @action
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedIndex
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItem
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItems
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItemKeys
            * @hidden
            */
            /**
            * @name dxBoxOptions.keyExpr
            * @hidden
            */
            /**
            * @name dxBoxOptions.tabIndex
            * @hidden
            */
            /**
            * @name dxBoxOptions.accessKey
            * @hidden
            */
        });
    }

    _itemClass() {
        return BOX_ITEM_CLASS;
    }

    _itemDataKey() {
        return BOX_ITEM_DATA_KEY;
    }

    _itemElements() {
        return this._itemContainer().children(this._itemSelector());
    }

    _init() {
        super._init();
        this.$element().addClass(BOX_FLEX_CLASS);
        this._initLayout();
        this._initBoxQueue();
    }

    _initLayout() {
        this._layout = new LayoutStrategy(this.$element(), this.option.bind(this), this);
    }

    _initBoxQueue() {
        this._queue = this.option('_queue') || [];
    }

    _queueIsNotEmpty() {
        return this.option('_queue') ? false : !!this._queue.length;
    }

    _pushItemToQueue($item, config) {
        debugger;
        this._queue.push({ $item: $item, config: config });
    }

    _shiftItemFromQueue() {
        return this._queue.shift();
    }

    _initMarkup() {
        this.$element().addClass(BOX_CLASS);
        this._layout.renderBox();
        super._initMarkup();
        this._renderAlign();
        this._renderActions();
    }

    _renderActions() {
        this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
    }

    _renderAlign() {
        this._layout.renderAlign();
        this._layout.renderCrossAlign();
    }

    _renderItems(items) {
        super._renderItems(items);

        while(this._queueIsNotEmpty()) {
            const item = this._shiftItemFromQueue();
            this._createComponent(item.$item, Box, extend({
                itemTemplate: this.option('itemTemplate'),
                itemHoldTimeout: this.option('itemHoldTimeout'),
                onItemHold: this.option('onItemHold'),
                onItemClick: this.option('onItemClick'),
                onItemContextMenu: this.option('onItemContextMenu'),
                onItemRendered: this.option('onItemRendered'),
                _queue: this._queue
            }, item.config));
        }

        this._layout.renderItems(this._itemElements());
    }

    _renderItem(index, itemData, $container, $itemToReplace) {
        debugger;


        debugger;


        const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

        const $existPanes = this.$element().children('.dx-box-item');
        // if(index === $existPanes.length && $existPanes.length > 1) { // last

        const $lastElement = $existPanes.last();

        this._layout._addResizableToItem($lastElement);
        // }


        return $itemFrame;
    }

    _renderItemContent(args) {
        const $itemNode = args.itemData && args.itemData.node;
        if($itemNode) {
            return this._renderItemContentByNode(args, $itemNode);
        }

        return super._renderItemContent(args);
    }

    _postprocessRenderItem(args) {
        const boxConfig = args.itemData.box;
        if(!boxConfig) {
            return;
        }

        this._pushItemToQueue(args.itemContent, boxConfig);
    }

    _createItemByTemplate(itemTemplate, args) {
        if(args.itemData.box) {
            return itemTemplate.source ? itemTemplate.source() : $();
        }
        return super._createItemByTemplate(itemTemplate, args);
    }

    _itemOptionChanged(item, property, value, oldValue) {
        if(property === 'visible') {
            this._onItemStateChanged({
                name: property,
                state: value,
                oldState: oldValue !== false
            });
        }
        super._itemOptionChanged(item, property, value);
    }

    _optionChanged(args) {
        switch(args.name) {
            case '_queue':
            case 'direction':
                this._invalidate();
                break;
            case 'align':
                this._layout.renderAlign();
                break;
            case 'crossAlign':
                this._layout.renderCrossAlign();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _itemOptions() {
        const options = super._itemOptions();

        options.fireItemStateChangedAction = e => {
            this._onItemStateChanged(e);
        };

        return options;
    }

    /**
    * @name dxBox.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxBox.focus
    * @publicName focus()
    * @hidden
    */
}

Box.ItemClass = BoxItem;

registerComponent('dxBox', Box);

export default Box;

/**
 * @name dxBoxItem
 * @inherits CollectionWidgetItem
 * @type object
 */
