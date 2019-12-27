import { isDefined } from '../../core/utils/type';
import $ from '../../core/renderer';

const SORT_CLASS = 'dx-sort';
const SORT_NONE_CLASS = 'dx-sort-none';
const SORTUP_CLASS = 'dx-sort-up';
const SORTDOWN_CLASS = 'dx-sort-down';
const SORT_INDEX_CLASS = 'dx-sort-index';
const SORT_INDEX_ICON_CLASS = 'dx-sort-index-icon';
const HEADERS_ACTION_CLASS = 'action';


module.exports = {
    _applyColumnState: function(options) {
        const that = this;
        let ariaSortState;
        let $sortIndicator;
        const sortingMode = that.option('sorting.mode');
        const rootElement = options.rootElement;
        const column = options.column;
        const $indicatorsContainer = that._getIndicatorContainer(rootElement);

        if(options.name === 'sort') {
            rootElement.find('.' + SORT_CLASS).remove();
            !$indicatorsContainer.children().length && $indicatorsContainer.remove();

            if((sortingMode === 'single' || sortingMode === 'multiple') && column.allowSorting || isDefined(column.sortOrder)) {
                ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
                $sortIndicator = that.callBase(options)
                    .toggleClass(SORTUP_CLASS, column.sortOrder === 'asc')
                    .toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');

                const hasSeveralSortIndexes = that.getController && !!that.getController('columns').columnOption('sortIndex:1');
                if(hasSeveralSortIndexes && that.option('sorting.showSortIndexes') && column.sortIndex >= 0) {
                    $('<span>')
                        .addClass(SORT_INDEX_ICON_CLASS)
                        .text(column.sortIndex + 1)
                        .appendTo($sortIndicator);
                    $sortIndicator.addClass(SORT_INDEX_CLASS);
                }

                options.rootElement.addClass(that.addWidgetPrefix(HEADERS_ACTION_CLASS));
            }

            if(!isDefined(column.sortOrder)) {
                that.setAria('sort', 'none', rootElement);
            } else {
                that.setAria('sort', ariaSortState, rootElement);
            }

            return $sortIndicator;
        } else {
            return that.callBase(options);
        }
    },

    _getIndicatorClassName: function(name) {
        if(name === 'sort') {
            return SORT_CLASS;
        } else if(name === 'sortIndex') {
            return SORT_INDEX_ICON_CLASS;
        }
        return this.callBase(name);
    },

    _renderIndicator: function(options) {
        let rtlEnabled;
        const column = options.column;
        const $container = options.container;
        const $indicator = options.indicator;

        if(options.name === 'sort') {
            rtlEnabled = this.option('rtlEnabled');

            if(!isDefined(column.sortOrder)) {
                $indicator && $indicator.addClass(SORT_NONE_CLASS);
            }

            if($container.children().length && (!rtlEnabled && options.columnAlignment === 'left' || rtlEnabled && options.columnAlignment === 'right')) {
                $container.prepend($indicator);
                return;
            }
        }

        this.callBase(options);
    },

    _updateIndicator: function($cell, column, indicatorName) {
        if(indicatorName === 'sort' && isDefined(column.groupIndex)) {
            return;
        }

        return this.callBase.apply(this, arguments);
    },

    _getIndicatorElements: function($cell, returnAll) {
        const $indicatorElements = this.callBase($cell);

        return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not('.' + SORT_NONE_CLASS);
    }
};
