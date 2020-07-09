import $ from '../core/renderer';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import inflector from '../core/utils/inflector';
import iteratorUtils from '../core/utils/iterator';
import { isDefined } from '../core/utils/type';
import { extend } from '../core/utils/extend';
import { hasWindow } from '../core/utils/window';
import { getPublicElement } from '../core/element';
import { deferRender } from '../core/utils/common';
import ScrollView from './scroll_view';
import CollectionWidget from './collection/ui.collection_widget.edit';

const TILEVIEW_CLASS = 'dx-tileview';
const TILEVIEW_CONTAINER_CLASS = 'dx-tileview-wrapper';
const TILEVIEW_ITEM_CLASS = 'dx-tile';
const TILEVIEW_ITEM_SELECTOR = '.' + TILEVIEW_ITEM_CLASS;

const TILEVIEW_ITEM_DATA_KEY = 'dxTileData';

const CONFIGS = {
    'horizontal': {
        itemMainRatio: 'widthRatio',
        itemCrossRatio: 'heightRatio',
        baseItemMainDimension: 'baseItemWidth',
        baseItemCrossDimension: 'baseItemHeight',
        mainDimension: 'width',
        crossDimension: 'height',
        mainPosition: 'left',
        crossPosition: 'top'
    },
    'vertical': {
        itemMainRatio: 'heightRatio',
        itemCrossRatio: 'widthRatio',
        baseItemMainDimension: 'baseItemHeight',
        baseItemCrossDimension: 'baseItemWidth',
        mainDimension: 'height',
        crossDimension: 'width',
        mainPosition: 'top',
        crossPosition: 'left'
    }
};

const TileView = CollectionWidget.inherit({

    _activeStateUnit: TILEVIEW_ITEM_SELECTOR,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            items: null,


            direction: 'horizontal',

            hoverStateEnabled: true,

            showScrollbar: false,

            height: 500,

            baseItemWidth: 100,

            baseItemHeight: 100,

            itemMargin: 20,

            activeStateEnabled: true,

            indicateLoading: true

            /**
            * @name dxTileViewItem
            * @inherits CollectionWidgetItem
            * @type object
            */


            /**
            * @name dxTileViewOptions.selectedIndex
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItem
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItemKeys
            * @hidden
            */

            /**
             * @name dxTileViewOptions.keyExpr
             * @hidden
             */

            /**
            * @name dxTileViewOptions.onSelectionChanged
            * @action
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _itemClass: function() {
        return TILEVIEW_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return TILEVIEW_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$container;
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(TILEVIEW_CLASS);
        this._initScrollView();
    },

    _dataSourceLoadingChangedHandler: function(isLoading) {
        const scrollView = this._scrollView;

        if(!scrollView || !scrollView.startLoading) {
            return;
        }

        if(isLoading && this.option('indicateLoading')) {
            scrollView.startLoading();
        } else {
            scrollView.finishLoading();
        }
    },

    _hideLoadingIfLoadIndicationOff: function() {
        if(!this.option('indicateLoading')) {
            this._dataSourceLoadingChangedHandler(false);
        }
    },

    _initScrollView: function() {
        this._scrollView = this._createComponent(this.$element(), ScrollView, {
            direction: this.option('direction'),
            scrollByContent: true,
            useKeyboard: false,
            showScrollbar: this.option('showScrollbar')
        });

        this._$container = $(this._scrollView.content());
        this._$container.addClass(TILEVIEW_CONTAINER_CLASS);

        this._scrollView.option('onUpdated', this._renderGeometry.bind(this));
    },

    _initMarkup: function() {
        this.callBase();

        deferRender(function() {
            this._cellsPerDimension = 1;

            this._renderGeometry();
            this._updateScrollView();
            this._fireContentReadyAction();
        }.bind(this));
    },

    _updateScrollView: function() {
        this._scrollView.option('direction', this.option('direction'));
        this._scrollView.update();
        this._indicateLoadingIfAlreadyStarted();
    },

    _indicateLoadingIfAlreadyStarted: function() {
        if(this._isDataSourceLoading()) {
            this._dataSourceLoadingChangedHandler(true);
        }
    },

    _renderGeometry: function() {
        this._config = CONFIGS[this.option('direction')];

        const items = this.option('items') || [];
        const config = this._config;
        const itemMargin = this.option('itemMargin');
        const maxItemCrossRatio = Math.max.apply(Math, iteratorUtils.map(items || [], function(item) {
            return Math.round(item[config.itemCrossRatio] || 1);
        }));

        const crossDimensionValue = hasWindow() ?
            this.$element()[config.crossDimension]() : parseInt(this.$element().get(0).style[config.crossDimension]);

        this._cellsPerDimension = Math.floor(crossDimensionValue / (this.option(config.baseItemCrossDimension) + itemMargin));
        this._cellsPerDimension = Math.max(this._cellsPerDimension, maxItemCrossRatio);
        this._cells = [];
        this._cells.push(new Array(this._cellsPerDimension));

        this._arrangeItems(items);
        this._renderContentSize(config, itemMargin);
    },

    _renderContentSize: function(config, itemMargin) {
        if(hasWindow()) {
            const actualContentSize = this._cells.length * this.option(config.baseItemMainDimension) + (this._cells.length + 1) * itemMargin;
            const containerSize = this._$container[config.mainDimension]();

            if(actualContentSize > containerSize) {
                this._$container[config.mainDimension](actualContentSize);
            }
        }
    },

    _arrangeItems: function(items) {
        const config = this._config;
        const itemMainRatio = config.itemMainRatio;
        const itemCrossRatio = config.itemCrossRatio;
        const mainPosition = config.mainPosition;

        this._itemsPositions = [];

        iteratorUtils.each(items, (function(index, item) {
            const currentItem = {};
            currentItem[itemMainRatio] = item[itemMainRatio] || 1;
            currentItem[itemCrossRatio] = item[itemCrossRatio] || 1;
            currentItem.index = index;

            currentItem[itemMainRatio] = (currentItem[itemMainRatio] <= 0) ? 0 : Math.round(currentItem[config.itemMainRatio]);
            currentItem[itemCrossRatio] = (currentItem[itemCrossRatio] <= 0) ? 0 : Math.round(currentItem[config.itemCrossRatio]);

            const itemPosition = this._getItemPosition(currentItem);

            if(itemPosition[mainPosition] === -1) {
                itemPosition[mainPosition] = this._cells.push(new Array(this._cellsPerDimension)) - 1;
            }

            this._occupyCells(currentItem, itemPosition);

            this._arrangeItem(currentItem, itemPosition);

            this._itemsPositions.push(itemPosition);
        }).bind(this));
    },

    _getItemPosition: function(item) {
        const config = this._config;
        const mainPosition = config.mainPosition;
        const crossPosition = config.crossPosition;

        const position = {};
        position[mainPosition] = -1;
        position[crossPosition] = 0;

        for(let main = 0; main < this._cells.length; main++) {
            for(let cross = 0; cross < this._cellsPerDimension; cross++) {
                if(this._itemFit(main, cross, item)) {
                    position[mainPosition] = main;
                    position[crossPosition] = cross;
                    break;
                }
            }

            if(position[mainPosition] > -1) {
                break;
            }
        }

        return position;
    },

    _itemFit: function(mainPosition, crossPosition, item) {
        let result = true;

        const config = this._config;
        const itemRatioMain = item[config.itemMainRatio];
        const itemRatioCross = item[config.itemCrossRatio];

        if(crossPosition + itemRatioCross > this._cellsPerDimension) {
            return false;
        }

        for(let main = mainPosition; main < mainPosition + itemRatioMain; main++) {
            for(let cross = crossPosition; cross < crossPosition + itemRatioCross; cross++) {
                if(this._cells.length - 1 < main) {
                    this._cells.push(new Array(this._cellsPerDimension));
                } else if(this._cells[main][cross] !== undefined) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    _occupyCells: function(item, itemPosition) {
        const config = this._config;
        const itemPositionMain = itemPosition[config.mainPosition];
        const itemPositionCross = itemPosition[config.crossPosition];
        const itemRatioMain = item[config.itemMainRatio];
        const itemRatioCross = item[config.itemCrossRatio];

        for(let main = itemPositionMain; main < itemPositionMain + itemRatioMain; main++) {
            for(let cross = itemPositionCross; cross < itemPositionCross + itemRatioCross; cross++) {
                this._cells[main][cross] = item.index;
            }
        }
    },

    _arrangeItem: function(item, itemPosition) {
        const config = this._config;
        const itemPositionMain = itemPosition[config.mainPosition];
        const itemPositionCross = itemPosition[config.crossPosition];
        const itemRatioMain = item[config.itemMainRatio];
        const itemRatioCross = item[config.itemCrossRatio];
        const baseItemCross = this.option(config.baseItemCrossDimension);
        const baseItemMain = this.option(config.baseItemMainDimension);
        const itemMargin = this.option('itemMargin');


        const cssProps = { display: (itemRatioMain <= 0 || itemRatioCross <= 0) ? 'none' : '' };
        const mainDimension = itemRatioMain * baseItemMain + (itemRatioMain - 1) * itemMargin;
        const crossDimension = itemRatioCross * baseItemCross + (itemRatioCross - 1) * itemMargin;
        cssProps[config.mainDimension] = mainDimension < 0 ? 0 : mainDimension;
        cssProps[config.crossDimension] = crossDimension < 0 ? 0 : crossDimension;
        cssProps[config.mainPosition] = itemPositionMain * baseItemMain + (itemPositionMain + 1) * itemMargin;
        cssProps[config.crossPosition] = itemPositionCross * baseItemCross + (itemPositionCross + 1) * itemMargin;

        if(this.option('rtlEnabled')) {
            const offsetCorrection = this._$container.width();
            const baseItemWidth = this.option('baseItemWidth');
            const itemPositionX = itemPosition.left;
            const offsetPosition = itemPositionX * baseItemWidth;
            const itemBaseOffset = baseItemWidth + itemMargin;
            const itemWidth = itemBaseOffset * item.widthRatio;
            const subItemMargins = itemPositionX * itemMargin;

            cssProps.left = offsetCorrection - (offsetPosition + itemWidth + subItemMargins);
        }

        this._itemElements().eq(item.index).css(cssProps);
    },

    _moveFocus: function(location) {
        const FOCUS_UP = 'up';
        const FOCUS_DOWN = 'down';
        const FOCUS_LEFT = this.option('rtlEnabled') ? 'right' : 'left';
        const FOCUS_RIGHT = this.option('rtlEnabled') ? 'left' : 'right';
        const FOCUS_PAGE_UP = 'pageup';
        const FOCUS_PAGE_DOWN = 'pagedown';

        const horizontalDirection = this.option('direction') === 'horizontal';
        const cells = this._cells;
        const index = $(this.option('focusedElement')).index();
        let targetCol = this._itemsPositions[index].left;
        let targetRow = this._itemsPositions[index].top;

        const colCount = (horizontalDirection ? cells : cells[0]).length;
        const rowCount = (horizontalDirection ? cells[0] : cells).length;
        const getCell = function(col, row) {
            if(horizontalDirection) {
                return cells[col][row];
            }
            return cells[row][col];
        };

        switch(location) {
            case FOCUS_PAGE_UP:
            case FOCUS_UP:
                while(targetRow > 0 && index === getCell(targetCol, targetRow)) {
                    targetRow--;
                }

                if(targetRow < 0) {
                    targetRow = 0;
                }
                break;
            case FOCUS_PAGE_DOWN:
            case FOCUS_DOWN:
                while(targetRow < rowCount && index === getCell(targetCol, targetRow)) {
                    targetRow++;
                }

                if(targetRow === rowCount) {
                    targetRow = rowCount - 1;
                }
                break;
            case FOCUS_RIGHT:
                while(targetCol < colCount && index === getCell(targetCol, targetRow)) {
                    targetCol++;
                }

                if(targetCol === colCount) {
                    targetCol = colCount - 1;
                }
                break;
            case FOCUS_LEFT:
                while(targetCol >= 0 && index === getCell(targetCol, targetRow)) {
                    targetCol--;
                }

                if(targetCol < 0) {
                    targetCol = 0;
                }
                break;
            default:
                this.callBase.apply(this, arguments);
                return;
        }

        const newTargetIndex = getCell(targetCol, targetRow);
        if(!isDefined(newTargetIndex)) {
            return;
        }

        const $newTarget = this._itemElements().eq(newTargetIndex);
        this.option('focusedElement', getPublicElement($newTarget));
        this._scrollToItem($newTarget);
    },

    _scrollToItem: function($itemElement) {
        if(!$itemElement.length) {
            return;
        }

        const config = this._config;
        const outerMainProp = 'outer' + inflector.captionize(config.mainDimension);
        const itemMargin = this.option('itemMargin');
        const itemPosition = $itemElement.position()[config.mainPosition];
        const itemDimension = $itemElement[outerMainProp]();
        const itemTail = itemPosition + itemDimension;
        const scrollPosition = this.scrollPosition();
        const clientWidth = this.$element()[outerMainProp]();

        if(scrollPosition <= itemPosition && itemTail <= scrollPosition + clientWidth) {
            return;
        }

        if(scrollPosition > itemPosition) {
            this._scrollView.scrollTo(itemPosition - itemMargin);
        } else {
            this._scrollView.scrollTo(itemPosition + itemDimension - clientWidth + itemMargin);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'items':
                this.callBase(args);
                this._renderGeometry();
                this._updateScrollView();
                break;
            case 'showScrollbar':
                this._initScrollView();
                break;
            case 'disabled':
                this._scrollView.option('disabled', args.value);
                this.callBase(args);
                break;
            case 'baseItemWidth':
            case 'baseItemHeight':
            case 'itemMargin':
                this._renderGeometry();
                break;
            case 'width':
            case 'height':
                this.callBase(args);
                this._renderGeometry();
                this._updateScrollView();
                break;
            case 'direction':
                this._renderGeometry();
                this._updateScrollView();
                break;
            case 'indicateLoading':
                this._hideLoadingIfLoadIndicationOff();
                break;
            default:
                this.callBase(args);
        }
    },

    scrollPosition: function() {
        return this._scrollView.scrollOffset()[this._config.mainPosition];
    }

});

registerComponent('dxTileView', TileView);

export default TileView;
