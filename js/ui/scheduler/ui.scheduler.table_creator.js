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
            let row = allDayElements[index].find(ROW_SELECTOR);

            if(!row.length) {
                row = $(domAdapter.createElement(ROW_SELECTOR));
                row.append(allDayElements[index].get(0));
            }

            tableBody.appendChild(row.get ? row.get(0) : row);
        }
    },

    makeTable: function(options) {
        const tableBody = domAdapter.createElement('tbody');
        const templateCallbacks = [];
        let row;
        const rowCountInGroup = options.groupCount ? options.rowCount / options.groupCount : options.rowCount;
        let allDayElementIndex = 0;
        const allDayElements = options.allDayElements;
        const groupIndex = options.groupIndex;
        const rowCount = options.rowCount;

        $(options.container).append(tableBody);

        if(allDayElements) {
            this.insertAllDayRow(allDayElements, tableBody, 0);
            allDayElementIndex++;
        }

        for(let i = 0; i < rowCount; i++) {
            row = domAdapter.createElement(ROW_SELECTOR);
            tableBody.appendChild(row);

            const isLastRowInGroup = (i + 1) % rowCountInGroup === 0;

            if(options.rowClass) {
                row.className = options.rowClass;
            }

            for(let j = 0; j < options.cellCount; j++) {
                const td = domAdapter.createElement('td');
                row.appendChild(td);

                if(options.cellClass) {
                    if(typeUtils.isFunction(options.cellClass)) {
                        td.className = options.cellClass(i, j);
                    } else {
                        td.className = options.cellClass;
                    }
                }


                var cellDataObject;
                var dataKey;
                var dataValue;

                if(options.getCellData) {
                    cellDataObject = options.getCellData(td, i, j, groupIndex);
                    dataKey = cellDataObject.key;
                    dataValue = cellDataObject.value;
                    dataKey && dataUtils.data(td, dataKey, dataValue);
                }

                if(options.cellTemplate && options.cellTemplate.render) {
                    const templateOptions = {
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
        let rows = [];

        if(type === this.VERTICAL) {
            rows = this._makeVerticalGroupedRows(groups, cssClasses, cellTemplate, rowCount);
        } else {
            rows = this._makeHorizontalGroupedRows(groups, cssClasses, cellCount, cellTemplate, groupByDate);
        }

        return rows;
    },

    makeGroupedTableFromJSON: function(type, data, config) {
        let table;
        const cellStorage = [];
        let rowIndex = 0;

        config = config || {};

        const cellTag = config.cellTag || 'td';
        const childrenField = config.childrenField || 'children';
        const titleField = config.titleField || 'title';
        const groupTableClass = config.groupTableClass;
        const groupRowClass = config.groupRowClass;
        const groupCellClass = config.groupCellClass;
        const groupCellCustomContent = config.groupCellCustomContent;

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
            const cell = {
                element: domAdapter.createElement(cellTag),
                childCount: childCount
            };

            if(groupCellClass) {
                cell.element.className = groupCellClass;
            }

            const cellText = domAdapter.createTextNode(text);
            if(typeof groupCellCustomContent === 'function') {
                groupCellCustomContent(cell.element, cellText, index, data);
            } else {
                cell.element.appendChild(cellText);
            }

            return cell;
        }

        function generateCells(data) {
            for(let i = 0; i < data.length; i++) {
                const childCount = getChildCount(data[i]);
                const cell = createCell(data[i][titleField], childCount, i, data[i]);

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
                const row = domAdapter.createElement(ROW_SELECTOR);
                if(groupRowClass) {
                    row.className = groupRowClass;
                }

                const rowspans = [];

                for(let i = cells.length - 1; i >= 0; i--) {
                    const prev = cells[i + 1];
                    let rowspan = cells[i].childCount;
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

        const cells = [];
        const items = group.items;
        const itemCount = items.length;

        for(let i = 0; i < repeatCount * repeatByDate; i++) {
            for(let j = 0; j < itemCount; j++) {
                const $container = $('<div>');
                const cell = {};

                if(cellTemplate && cellTemplate.render) {
                    const templateOptions = {
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
                }

                const cssClass = typeUtils.isFunction(cssClasses.groupHeaderClass) ? cssClasses.groupHeaderClass(j) : cssClasses.groupHeaderClass;

                cell.element = $('<div>').addClass(cssClass).append($container);

                cells.push(cell);
            }
        }

        return cells;
    },

    _makeVerticalGroupedRows: function(groups, cssClasses, cellTemplate) {
        const cellTemplates = [];
        let repeatCount = 1;
        const cellsArray = [];

        const cellIterator = function(cell) {
            if(cell.template) {
                cellTemplates.push(cell.template);
            }
        };

        for(let i = 0; i < groups.length; i++) {
            if(i > 0) {
                repeatCount = groups[i - 1].items.length * repeatCount;
            }

            const cells = this._makeFlexGroupedRowCells(groups[i], repeatCount, cssClasses, cellTemplate);
            cells.forEach(cellIterator);
            cellsArray.push(cells);
        }

        const rows = [];
        const groupCount = cellsArray.length;

        for(let i = 0; i < groupCount; i++) {
            rows.push($('<div>').addClass(cssClasses.groupHeaderRowClass));
        }

        for(let i = groupCount - 1; i >= 0; i--) {
            const currentColumnLength = cellsArray[i].length;
            for(let j = 0; j < currentColumnLength; j++) {
                rows[i].append(cellsArray[i][j].element);
            }
        }

        return {
            elements: $('<div>').addClass('dx-scheduler-group-flex-container').append(rows),
            cellTemplates: cellTemplates
        };
    },

    _makeHorizontalGroupedRows: function(groups, cssClasses, cellCount, cellTemplate, groupByDate) {
        let repeatCount = 1;
        const groupCount = groups.length;
        const rows = [];
        const cellTemplates = [];
        const repeatByDate = groupByDate ? cellCount : 1;

        const cellIterator = function(cell) {
            if(cell.template) {
                cellTemplates.push(cell.template);
            }

            return cell.element;
        };


        for(let i = 0; i < groupCount; i++) {
            if(i > 0) {
                repeatCount = groups[i - 1].items.length * repeatCount;
            }

            const cells = this._makeGroupedRowCells(groups[i], repeatCount, cssClasses, cellTemplate, repeatByDate);

            rows.push(
                $('<tr>')
                    .addClass(cssClasses.groupRowClass)
                    .append(cells.map(cellIterator))
            );
        }

        const maxCellCount = rows[groupCount - 1].find('th').length;

        for(let j = 0; j < groupCount; j++) {
            const $cell = rows[j].find('th');
            let colspan = maxCellCount / $cell.length;

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

        const cells = [];
        const items = group.items;
        const itemCount = items.length;

        for(let i = 0; i < repeatCount; i++) {
            for(let j = 0; j < itemCount; j++) {
                let $container = $('<div>');
                const cell = {};

                if(cellTemplate && cellTemplate.render) {
                    const templateOptions = {
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
