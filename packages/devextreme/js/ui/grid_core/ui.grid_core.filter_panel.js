import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import modules from './ui.grid_core.modules';
import gridUtils from './ui.grid_core.utils';
import eventsEngine from '../../events/core/events_engine';
import messageLocalization from '../../localization/message';
import CheckBox from '../check_box';
import {
    getCurrentLookupValueText, getCustomOperation, getCurrentValueText,
    getField, getCaptionByOperation, getGroupValue, isCondition, isGroup,
} from '../filter_builder/utils';
import { when, Deferred } from '../../core/utils/deferred';
import { captionize } from '../../core/utils/inflector';
import { registerKeyboardAction } from './ui.grid_core.accessibility';

const FILTER_PANEL_CLASS = 'filter-panel';
const FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + '-text';
const FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + '-checkbox';
const FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + '-clear-filter';
const FILTER_PANEL_LEFT_CONTAINER = FILTER_PANEL_CLASS + '-left';

const FILTER_PANEL_TARGET = 'filterPanel';

const FilterPanelView = modules.View.inherit({
    isVisible: function() {
        return this.option('filterPanel.visible') && this.getController('data').dataSource();
    },

    init: function() {
        this.getController('data').dataSourceChanged.add(() => this.render());
    },

    _renderCore: function() {
        const that = this;
        const $element = that.element();

        $element
            .empty()
            .addClass(that.addWidgetPrefix(FILTER_PANEL_CLASS));
        const $leftContainer = $('<div>')
            .addClass(that.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER))
            .appendTo($element);

        if(that.option('filterValue') || that._filterValueBuffer) {
            $leftContainer.append(that._getCheckElement())
                .append(that._getFilterElement())
                .append(that._getTextElement());
            $element.append(that._getRemoveButtonElement());
        } else {
            $leftContainer.append(that._getFilterElement())
                .append(that._getTextElement());
        }
    },

    _getCheckElement: function() {
        const that = this;
        const $element = $('<div>')
            .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

        that._createComponent($element, CheckBox, {
            value: that.option('filterPanel.filterEnabled'),
            onValueChanged: function(e) {
                that.option('filterPanel.filterEnabled', e.value);
            }
        });
        $element.attr('title', this.option('filterPanel.texts.filterEnabledHint'));
        return $element;
    },

    _getFilterElement: function() {
        const that = this;
        const $element = $('<div>').addClass('dx-icon-filter');

        eventsEngine.on($element, 'click', () => that._showFilterBuilder());

        registerKeyboardAction('filterPanel', that, $element, undefined, () => that._showFilterBuilder());

        that._addTabIndexToElement($element);

        return $element;
    },

    _getTextElement: function() {
        const that = this;
        const $textElement = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
        let filterText;
        const filterValue = that.option('filterValue');
        if(filterValue) {
            when(that.getFilterText(filterValue, that.getController('filterSync').getCustomFilterOperations())).done(function(filterText) {
                const customizeText = that.option('filterPanel.customizeText');
                if(customizeText) {
                    const customText = customizeText({
                        component: that.component,
                        filterValue: filterValue,
                        text: filterText
                    });
                    if(typeof customText === 'string') {
                        filterText = customText;
                    }
                }
                $textElement.text(filterText);
            });
        } else {
            filterText = that.option('filterPanel.texts.createFilter');
            $textElement.text(filterText);
        }

        eventsEngine.on($textElement, 'click', () => that._showFilterBuilder());

        registerKeyboardAction('filterPanel', that, $textElement, undefined, () => that._showFilterBuilder());

        that._addTabIndexToElement($textElement);

        return $textElement;
    },

    _showFilterBuilder: function() {
        this.option('filterBuilderPopup.visible', true);
    },

    _getRemoveButtonElement: function() {
        const that = this;
        const clearFilterValue = () => that.option('filterValue', null);
        const $element = $('<div>')
            .addClass(that.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
            .text(that.option('filterPanel.texts.clearFilter'));

        eventsEngine.on($element, 'click', clearFilterValue);

        registerKeyboardAction('filterPanel', this, $element, undefined, clearFilterValue);

        that._addTabIndexToElement($element);

        return $element;
    },

    _addTabIndexToElement: function($element) {
        if(!this.option('useLegacyKeyboardNavigation')) {
            const tabindex = this.option('tabindex') || 0;
            $element.attr('tabindex', tabindex);
        }
    },

    optionChanged: function(args) {
        switch(args.name) {
            case 'filterValue':
                this._invalidate();
                this.option('filterPanel.filterEnabled', true);
                args.handled = true;
                break;
            case 'filterPanel':
                this._invalidate();
                args.handled = true;
                break;
            default:
                this.callBase(args);
        }
    },

    _getConditionText: function(fieldText, operationText, valueText) {
        let result = `[${fieldText}] ${operationText}`;
        if(isDefined(valueText)) {
            result += valueText;
        }
        return result;
    },

    _getValueMaskedText: function(value) {
        return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
    },

    _getValueText: function(field, customOperation, value) {
        const deferred = new Deferred();
        const hasCustomOperation = customOperation && customOperation.customizeText;
        if(isDefined(value) || hasCustomOperation) {
            if(!hasCustomOperation && field.lookup) {
                getCurrentLookupValueText(field, value, data => {
                    deferred.resolve(this._getValueMaskedText(data));
                });
            } else {
                const displayValue = Array.isArray(value) ? value : gridUtils.getDisplayValue(field, value);
                when(getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done(data => {
                    deferred.resolve(this._getValueMaskedText(data));
                });
            }
        } else {
            deferred.resolve('');
        }
        return deferred.promise();
    },

    getConditionText: function(filterValue, options) {
        const that = this;
        const operation = filterValue[1];
        const deferred = new Deferred();
        const customOperation = getCustomOperation(options.customOperations, operation);
        let operationText;
        const field = getField(filterValue[0], options.columns);
        const fieldText = field.caption || '';
        const value = filterValue[2];

        if(customOperation) {
            operationText = customOperation.caption || captionize(customOperation.name);
        } else if(value === null) {
            operationText = getCaptionByOperation(operation === '=' ? 'isblank' : 'isnotblank', options.filterOperationDescriptions);
        } else {
            operationText = getCaptionByOperation(operation, options.filterOperationDescriptions);
        }
        this._getValueText(field, customOperation, value).done((valueText) => {
            deferred.resolve(that._getConditionText(fieldText, operationText, valueText));
        });
        return deferred;
    },

    getGroupText: function(filterValue, options, isInnerGroup) {
        const that = this;
        const result = new Deferred();
        const textParts = [];
        const groupValue = getGroupValue(filterValue);

        filterValue.forEach(item => {
            if(isCondition(item)) {
                textParts.push(that.getConditionText(item, options));
            } else if(isGroup(item)) {
                textParts.push(that.getGroupText(item, options, true));
            }
        });

        when.apply(this, textParts).done((...args) => {
            let text;
            if(groupValue[0] === '!') {
                const groupText = options.groupOperationDescriptions['not' + groupValue.substring(1, 2).toUpperCase() + groupValue.substring(2)].split(' ');
                text = `${groupText[0]} ${args[0]}`;
            } else {
                text = args.join(` ${options.groupOperationDescriptions[groupValue]} `);
            }
            if(isInnerGroup) {
                text = `(${text})`;
            }
            result.resolve(text);
        });
        return result;
    },

    getFilterText: function(filterValue, customOperations) {
        const that = this;
        const options = {
            customOperations: customOperations,
            columns: that.getController('columns').getFilteringColumns(),
            filterOperationDescriptions: that.option('filterBuilder.filterOperationDescriptions'),
            groupOperationDescriptions: that.option('filterBuilder.groupOperationDescriptions')
        };
        return isCondition(filterValue) ? that.getConditionText(filterValue, options) : that.getGroupText(filterValue, options);
    }
});

export const filterPanelModule = {
    defaultOptions: function() {
        return {
            filterPanel: {
                visible: false,
                filterEnabled: true,
                texts: {
                    createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),
                    clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),
                    filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint'),
                }
            },
        };
    },
    views: {
        filterPanelView: FilterPanelView
    },
    extenders: {
        controllers: {
            data: {
                optionChanged: function(args) {
                    switch(args.name) {
                        case 'filterPanel':
                            this._applyFilter();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                }
            }
        }
    }
};
