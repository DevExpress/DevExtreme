import { isDefined } from '../../core/utils/type';

var SORT_CLASS = 'dx-sort',
    SORT_NONE_CLASS = 'dx-sort-none',
    SORTUP_CLASS = 'dx-sort-up',
    SORTDOWN_CLASS = 'dx-sort-down',
    HEADERS_ACTION_CLASS = 'action';


module.exports = {
    _applyColumnState: function(options) {
        var that = this,
            ariaSortState,
            $sortIndicator,
            sortingMode = that.option('sorting.mode'),
            rootElement = options.rootElement,
            column = options.column,
            $indicatorsContainer = that._getIndicatorContainer(rootElement);

        if(options.name === 'sort') {
            rootElement.find('.' + SORT_CLASS).remove();
            !$indicatorsContainer.children().length && $indicatorsContainer.remove();

            if((sortingMode === 'single' || sortingMode === 'multiple') && column.allowSorting || isDefined(column.sortOrder)) {
                ariaSortState = column.sortOrder === 'asc' ? 'ascending' : 'descending';
                $sortIndicator = that.callBase(options)
                    .toggleClass(SORTUP_CLASS, column.sortOrder === 'asc')
                    .toggleClass(SORTDOWN_CLASS, column.sortOrder === 'desc');

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
        }
        return this.callBase(name);
    },

    _renderIndicator: function(options) {
        var rtlEnabled,
            column = options.column,
            $container = options.container,
            $indicator = options.indicator;

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
        var $indicatorElements = this.callBase($cell);

        return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not('.' + SORT_NONE_CLASS);
    }
};
