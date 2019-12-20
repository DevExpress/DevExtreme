import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import dataUtils from '../../core/element_data';
import typeUtils from '../../core/utils/type';
import { getPublicElement } from '../../core/utils/dom';

const ROW_SELECTOR = 'tr';

const SchedulerTableCreator = {

    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',

    insertAllDayRow: function(allDayElements, tableBody, index) {
        if(allDayElements[index]) {
            var row = allDayElements[index].find(ROW_SELECTOR);

            if(!row.length) {
                row = $(domAdapter.createElement(ROW_SELECTOR));
                row.append(allDayElements[index].get(0));
            }

            tableBody.appendChild(row.get ? row.get(0) : row);
        }
    },

    makeTable: function(options) {
        var tableBody = domAdapter.createElement('tbody'),
            templateCallbacks = [],
            row,
            rowCountInGroup = options.groupCount ? options.rowCount / options.groupCount : options.rowCount,
            allDayElementIndex = 0,
            allDayElements = options.allDayElements,
            groupIndex = options.groupIndex,
            rowCount = options.rowCount;

        $(options.container).append(tableBody);

        if(allDayElements) {
            this.insertAllDayRow(allDayElements, tableBody, 0);
            allDayElementIndex++;
        }

        for(var i = 0; i < rowCount; i++) {
            row = domAdapter.createElement(ROW_SELECTOR);
            tableBody.appendChild(row);

            var isLastRowInGroup = (i + 1) % rowCountInGroup === 0;

            if(options.rowClass) {
                row.className = options.rowClass;
            }

            for(var j = 0; j < options.cellCount; j++) {
                var td = domAdapter.createElement('td');
                row.appendChild(td);

                if(options.cellClass) {
                    if(typeUtils.isFunction(options.cellClass)) {
                        td.className = options.cellClass(i, j);
                    } else {
                        td.className = options.cellClass;
                    }
                }


                var cellDataObject,
                    dataKey,
                    dataValue;

                if(options.getCellData) {
                    cellDataObject = options.getCellData(td, i, j, groupIndex);
                    dataKey = cellDataObject.key;
                    dataValue = cellDataObject.value;
                    dataKey && dataUtils.data(td, dataKey, dataValue);
                }

                if(options.cellTemplate && options.cellTemplate.render) {
                    var templateOptions = {
                        model: {
                            text: options.getCellText ? options.getCellText(i, j) : '',
                            date: options.getCellDate ? options.getCellDate(i) : undefined
                        },
                        container: getPublicElement($(td)),
                        index: i * options.cellCount + j
                    };

                    if(dataValue) {
                        if(dataValue.startDate) {
                            templateOptions.model['startDate'] = dataValue.startDate;
                        }

                        if(dataValue.endDate) {
                            templateOptions.model['endDate'] = dataValue.endDate;
                        }

                        if(dataValue.groups) {
                            templateOptions.model['groups'] = dataValue.groups;
                        }

                        if(dataValue.allDay) {
                            templateOptions.model['allDay'] = dataValue.allDay;
                        }
                    }

                    templateCallbacks.push(options.cellTemplate.render.bind(options.cellTemplate, templateOptions));

                } else {
                    if(options.getCellText) {
                        td.innerHTML = '<div>' + options.getCellText(i, j) + '</div>';
                    }
                }
            }

            if(allDayElements && isLastRowInGroup) {
                this.insertAllDayRow(allDayElements, tableBody, allDayElementIndex);
                allDayElementIndex++;
            }
        }

        return templateCallbacks;
    },

    makeGroupedTable: function(type, groups, cssClasses, cellCount, cellTemplate, rowCount, groupByDate) {
        var rows = [];

        if(type === this.VERTICAL) {
            rows = this._makeVerticalGroupedRows(groups, cssClasses, cellTemplate, rowCount);
        } else {
            rows = this._makeHorizontalGroupedRows(groups, cssClasses, cellCount, cellTemplate, groupByDate);
        }

        return rows;
    },

    makeGroupedTableFromJSON: function(type, data, config) {
        var table,
            cellStorage = [],
            rowIndex = 0;

        config = config || {};

        var cellTag = config.cellTag || 'td',
            childrenField = config.childrenField || 'children',
            titleField = config.titleField || 'title',
            groupTableClass = config.groupTableClass,
            groupRowClass = config.groupRowClass,
            groupCellClass = config.groupCellClass,
            groupCellCustomContent = config.groupCellCustomContent;

        function createTable() {
            table = domAdapter.createElement('table');

            if(groupTableClass) {
                table.className = groupTableClass;
            }
        }

        function getChildCount(item) {
            if(item[childrenField]) {
                return item[childrenField].length;
            }
            return 0;
        }

        function createCell(text, childCount, index, data) {
            var cell = {
                element: domAdapter.createElement(cellTag),
                childCount: childCount
            };

            if(groupCellClass) {
                cell.element.className = groupCellClass;
            }

            var cellText = domAdapter.createTextNode(text);
            if(typeof groupCellCustomContent === 'function') {
                groupCellCustomContent(cell.element, cellText, index, data);
            } else {
                cell.element.appendChild(cellText);
            }

            return cell;
        }

        function generateCells(data) {
            for(var i = 0; i < data.length; i++) {
                var childCount = getChildCount(data[i]),
                    cell = createCell(data[i][titleField], childCount, i, data[i]);

                if(!cellStorage[rowIndex]) {
                    cellStorage[rowIndex] = [];
                }
                cellStorage[rowIndex].push(cell);

                if(childCount) {
                    generateCells(data[i][childrenField]);
                } else {
                    rowIndex++;
                }
            }
        }

        function putCellsToRows() {
            cellStorage.forEach(function(cells) {
                var row = domAdapter.createElement(ROW_SELECTOR);
                if(groupRowClass) {
                    row.className = groupRowClass;
                }

                var rowspans = [];

                for(var i = cells.length - 1; i >= 0; i--) {
                    var prev = cells[i + 1],
                        rowspan = cells[i].childCount;
                    if(prev && prev.childCount) {
                        rowspan *= prev.childCount;
                    }
                    rowspans.push(rowspan);
                }
                rowspans.reverse();

                cells.forEach(function(cell, index) {
                    if(rowspans[index]) {
                        cell.element.setAttribute('rowSpan', rowspans[index]);
                    }
                    row.appendChild(cell.element);
                });

                table.appendChild(row);
            });
        }

        createTable();
        generateCells(data);
        putCellsToRows();

        return table;

    },

    _makeFlexGroupedRowCells: function(group, repeatCount, cssClasses, cellTemplate, repeatByDate = 1) {

        let cells = [],
            items = group.items,
            itemCount = items.length;

        for(let i = 0; i < repeatCount * repeatByDate; i++) {
            for(let j = 0; j < itemCount; j++) {
                let $container = $('<div>'),
                    cell = {};

                if(cellTemplate && cellTemplate.render) {
                    let templateOptions = {
                        model: items[j],
                        container: getPublicElement($container),
                        index: i * itemCount + j
                    };

                    if(group.data) {
                        templateOptions.model.data = group.data[j];
                    }

                    cell.template = cellTemplate.render.bind(cellTemplate, templateOptions);
                } else {
                    $container.text(items[j].text).attr('title', items[j].text).addClass('dx-scheduler-group-header-content');
                    $container = $('<div>').append($container);
                }

                const cssClass = typeUtils.isFunction(cssClasses.groupHeaderClass) ? cssClasses.groupHeaderClass(j) : cssClasses.groupHeaderClass;

                cell.element = $container.addClass(cssClass);

                cells.push(cell);
            }
        }

        return cells;
    },

    _makeVerticalGroupedRows: function(groups, cssClasses, cellTemplate) {
        var cellTemplates = [],
            repeatCount = 1,
            cellsArray = [];

        var cellIterator = function(cell) {
            if(cell.template) {
                cellTemplates.push(cell.template);
            }
        };

        for(let i = 0; i < groups.length; i++) {
            if(i > 0) {
                repeatCount = groups[i - 1].items.length * repeatCount;
            }

            var cells = this._makeFlexGroupedRowCells(groups[i], repeatCount, cssClasses, cellTemplate);
            cells.forEach(cellIterator);
            cellsArray.push(cells);
        }

        var rows = [],
            groupCount = cellsArray.length;

        for(let i = 0; i < groupCount; i++) {
            rows.push($('<div>').addClass(cssClasses.groupHeaderRowClass));
        }

        for(let i = groupCount - 1; i >= 0; i--) {
            var currentColumnLength = cellsArray[i].length;
            for(var j = 0; j < currentColumnLength; j++) {
                rows[i].append(cellsArray[i][j].element);
            }
        }

        return {
            elements: $('<div>').addClass('dx-scheduler-group-flex-container').append(rows),
            cellTemplates: cellTemplates
        };
    },

    _makeHorizontalGroupedRows: function(groups, cssClasses, cellCount, cellTemplate, groupByDate) {
        var repeatCount = 1,
            groupCount = groups.length,
            rows = [],
            cellTemplates = [],
            repeatByDate = groupByDate ? cellCount : 1;

        var cellIterator = function(cell) {
            if(cell.template) {
                cellTemplates.push(cell.template);
            }

            return cell.element;
        };


        for(var i = 0; i < groupCount; i++) {
            if(i > 0) {
                repeatCount = groups[i - 1].items.length * repeatCount;
            }

            var cells = this._makeGroupedRowCells(groups[i], repeatCount, cssClasses, cellTemplate, repeatByDate);

            rows.push(
                $('<tr>')
                    .addClass(cssClasses.groupRowClass)
                    .append(cells.map(cellIterator))
            );
        }

        var maxCellCount = rows[groupCount - 1].find('th').length;

        for(var j = 0; j < groupCount; j++) {
            var $cell = rows[j].find('th'),
                colspan = maxCellCount / $cell.length;

            if(!groupByDate) {
                colspan = colspan * cellCount;
            }
            if((colspan > 1 && repeatByDate === 1) || (groupByDate && groupCount > 1)) {
                $cell.attr('colSpan', colspan);
            }
        }


        return {
            elements: rows,
            cellTemplates: cellTemplates
        };
    },

    _makeGroupedRowCells: function(group, repeatCount, cssClasses, cellTemplate, repeatByDate) {
        repeatByDate = repeatByDate || 1;
        repeatCount = repeatCount * repeatByDate;

        var cells = [],
            items = group.items,
            itemCount = items.length;

        for(var i = 0; i < repeatCount; i++) {
            for(var j = 0; j < itemCount; j++) {
                var $container = $('<div>'),
                    cell = {};

                if(cellTemplate && cellTemplate.render) {
                    var templateOptions = {
                        model: items[j],
                        container: getPublicElement($container),
                        index: i * itemCount + j
                    };

                    if(group.data) {
                        templateOptions.model.data = group.data[j];
                    }

                    cell.template = cellTemplate.render.bind(cellTemplate, templateOptions);
                } else {
                    $container.text(items[j].text);
                    $container = $('<div>').append($container);
                }

                $container.addClass(cssClasses.groupHeaderContentClass);

                var cssClass;

                if(typeUtils.isFunction(cssClasses.groupHeaderClass)) {
                    cssClass = cssClasses.groupHeaderClass(j);
                } else {
                    cssClass = cssClasses.groupHeaderClass;
                }

                cell.element = $('<th>').addClass(cssClass).append($container);

                cells.push(cell);
            }
        }

        return cells;
    }
};

module.exports = SchedulerTableCreator;
