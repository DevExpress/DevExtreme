var $ = require("../../../core/renderer"),
    domAdapter = require("../../../core/dom_adapter"),
    noop = require("../../../core/utils/common").noop,
    each = require("../../../core/utils/iterator").each,
    getPublicElement = require("../../../core/utils/dom").getPublicElement,
    registerComponent = require("../../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space"),
    extend = require("../../../core/utils/extend").extend,
    dateLocalization = require("../../../localization/date"),
    tableCreator = require("../ui.scheduler.table_creator");

var AGENDA_CLASS = "dx-scheduler-agenda",
    AGENDA_DATE_CLASS = "dx-scheduler-agenda-date",
    GROUP_TABLE_CLASS = "dx-scheduler-group-table",

    AGENDA_GROUPED_ATTR = "dx-group-column-count",

    TIME_PANEL_ROW_CLASS = "dx-scheduler-time-panel-row",
    TIME_PANEL_CELL_CLASS = "dx-scheduler-time-panel-cell",
    NODATA_CONTAINER_CLASS = "dx-scheduler-agenda-nodata",

    LAST_ROW_CLASS = "dx-scheduler-date-table-last-row",

    INNER_CELL_MARGIN = 5,
    OUTER_CELL_MARGIN = 20;

var SchedulerAgenda = SchedulerWorkSpace.inherit({

    _activeStateUnit: undefined,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            // Number | "month"
            agendaDuration: 7,
            rowHeight: 60,
            noDataText: ""
        });
    },

    _optionChanged: function(args) {
        var name = args.name,
            value = args.value;

        switch(name) {
            case "agendaDuration":
                break;
            case "noDataText":
            case "rowHeight":
                this._recalculateAgenda(this._rows);
                break;
            case "groups":
                if(!value || !value.length) {
                    if(this._$groupTable) {
                        this._$groupTable.remove();
                        this._$groupTable = null;
                        this._detachGroupCountAttr();
                    }
                } else {
                    if(!this._$groupTable) {
                        this._initGroupTable();
                        this._dateTableScrollable.$content().prepend(this._$groupTable);
                    }
                }
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _renderFocusState: noop,
    _renderFocusTarget: noop,
    _cleanFocusState: noop,

    supportAllDayRow: function() {
        return false;
    },

    _isVerticalGroupedWorkSpace: function() {
        return false;
    },

    _getElementClass: function() {
        return AGENDA_CLASS;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = new Date(this.option("currentDate"));
        this._setStartDayHour(this._firstViewDate);
    },

    _getRowCount: function() {
        return this.option("agendaDuration");
    },

    _getCellCount: function() {
        return 1;
    },

    _getTimePanelRowCount: function() {
        return this.option("agendaDuration");
    },

    _getDateByIndex: noop,

    _getFormat: function() {
        return "d ddd";
    },

    _renderAllDayPanel: noop,

    _toggleAllDayVisibility: noop,

    _initWorkSpaceUnits: function() {
        this._initGroupTable();
        this._$timePanel = $("<table>").addClass(this._getTimePanelClass());
        this._$dateTable = $("<table>").addClass(this._getDateTableClass());
    },

    _initGroupTable: function() {
        var groups = this.option("groups");
        if(groups && groups.length) {
            this._$groupTable = $("<table>").addClass(GROUP_TABLE_CLASS);
        }
    },

    _renderView: function() {
        this._setFirstViewDate();
        this._rows = [];
        this.invoke("getAgendaRows", {
            agendaDuration: this.option("agendaDuration"),
            currentDate: new Date(this.option("currentDate"))
        }).done((function(rows) {
            this._recalculateAgenda(rows);
        }).bind(this));
    },

    _recalculateAgenda: function(rows) {
        var cellTemplates = [];
        this._cleanView();

        if(this._rowsIsEmpty(rows)) {
            this._renderNoData();
            return;
        }
        this._rows = rows;

        if(this._$groupTable) {
            cellTemplates = this._renderGroupHeader();
            this._setGroupHeaderCellsHeight();
        }

        this._renderTimePanel();
        this._renderDateTable();
        this.invoke("agendaIsReady", rows, INNER_CELL_MARGIN, OUTER_CELL_MARGIN);
        this._applyCellTemplates(cellTemplates);
        this._dateTableScrollable.update();
    },

    _renderNoData: function() {
        this._$noDataContainer = $("<div>").addClass(NODATA_CONTAINER_CLASS)
            .html(this.option("noDataText"));

        this._dateTableScrollable.$content().append(this._$noDataContainer);
    },

    _setTableSizes: noop,
    _toggleHorizontalScrollClass: noop,
    _createCrossScrollingConfig: noop,

    _setGroupHeaderCellsHeight: function() {
        var $cells = this._getGroupHeaderCells().filter(function(_, element) {
                return !element.getAttribute("rowSpan");
            }),
            rows = this._removeEmptyRows(this._rows);

        if(!rows.length) {
            return;
        }

        for(var i = 0; i < $cells.length; i++) {
            var $cellContent = $cells.eq(i).find(".dx-scheduler-group-header-content");
            $cellContent.outerHeight(this._getGroupRowHeight(rows[i]));
        }
    },

    _rowsIsEmpty: function(rows) {
        var result = true;

        for(var i = 0; i < rows.length; i++) {
            var groupRow = rows[i];

            for(var j = 0; j < groupRow.length; j++) {
                if(groupRow[j]) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    _detachGroupCountAttr: function() {
        this.$element().removeAttr(AGENDA_GROUPED_ATTR);
    },

    _attachGroupCountAttr: function() {
        this.$element().attr(AGENDA_GROUPED_ATTR, this.option("groups").length);
    },

    _removeEmptyRows: function(rows) {
        var result = [],
            isEmpty = function(data) {
                return !data.some(function(value) {
                    return value > 0;
                });
            };

        for(var i = 0; i < rows.length; i++) {
            if(rows[i].length && !isEmpty(rows[i])) {
                result.push(rows[i]);
            }
        }

        return result;
    },

    _getGroupHeaderContainer: function() {
        return this._$groupTable;
    },

    _makeGroupRows: function() {
        var tree = this.invoke("createReducedResourcesTree"),
            cellTemplate = this.option("resourceCellTemplate"),
            getGroupHeaderContentClass = this._getGroupHeaderContentClass(),
            cellTemplates = [];

        var table = tableCreator.makeGroupedTableFromJSON(tableCreator.VERTICAL, tree, {
            cellTag: "th",
            groupTableClass: GROUP_TABLE_CLASS,
            groupRowClass: this._getGroupRowClass(),
            groupCellClass: this._getGroupHeaderClass(),
            groupCellCustomContent: function(cell, cellText, index, data) {
                var container = domAdapter.createElement("div"),
                    contentWrapper = domAdapter.createElement("div");

                container.className = getGroupHeaderContentClass;
                contentWrapper.appendChild(cellText);
                container.appendChild(contentWrapper);
                container.className = getGroupHeaderContentClass;

                if(cellTemplate && cellTemplate.render) {
                    cellTemplates.push(cellTemplate.render.bind(cellTemplate, {
                        model: {
                            data: data.data,
                            id: data.value,
                            color: data.color,
                            text: cellText.textContent
                        },
                        container: getPublicElement($(container)),
                        index: index
                    }));

                } else {
                    contentWrapper.appendChild(cellText);
                    container.appendChild(contentWrapper);
                }

                cell.appendChild(container);
            },
            cellTemplate: cellTemplate
        });

        return {
            elements: $(table).find("." + this._getGroupRowClass()),
            cellTemplates: cellTemplates
        };
    },

    _cleanView: function() {
        this._$dateTable.empty();
        this._$timePanel.empty();

        if(this._$groupTable) {
            this._$groupTable.empty();
        }

        if(this._$noDataContainer) {
            this._$noDataContainer.empty();
            this._$noDataContainer.remove();

            delete this._$noDataContainer;
        }
    },

    _createWorkSpaceElements: function() {
        this._createWorkSpaceStaticElements();
    },

    _createWorkSpaceStaticElements: function() {
        if(this._$groupTable) {
            this._dateTableScrollable.$content().prepend(this._$groupTable);
        }

        this._dateTableScrollable.$content().append(this._$timePanel, this._$dateTable);
        this.$element().append(this._dateTableScrollable.$element());
    },

    _renderDateTable: function() {
        this._renderTableBody({
            container: getPublicElement(this._$dateTable),
            rowClass: this._getDateTableRowClass(),
            cellClass: this._getDateTableCellClass()
        });
    },

    _attachTablesEvents: noop,
    _attachEvents: noop,
    _cleanCellDataCache: noop,

    needRenderDateTimeIndication: function() {
        return false;
    },

    _prepareCellTemplateOptions: function(text, date, rowIndex, $cell) {
        var groupsOpt = this.option("groups"),
            groups = {},
            path = groupsOpt.length && this._getPathToLeaf(rowIndex) || [];

        path.forEach(function(resourceValue, resourceIndex) {
            var resourceName = groupsOpt[resourceIndex].name;
            groups[resourceName] = resourceValue;
        });

        return {
            model: {
                text: text,
                date: date,
                groups: groups
            },
            container: getPublicElement($cell),
            index: rowIndex
        };
    },

    _renderTableBody: function(options) {
        var cellTemplates = [],
            cellTemplateOpt = options.cellTemplate;

        this._$rows = [];

        var fillTableBody = (function(rowIndex, rowSize) {
            if(rowSize) {
                var date,
                    cellDateNumber,
                    cellDayName,
                    $row = $("<tr>"),
                    $td = $("<td>").height(this._getRowHeight(rowSize));

                if(options.getStartDate) {
                    date = options.getStartDate && options.getStartDate(rowIndex);
                    cellDateNumber = dateLocalization.format(date, "d");
                    cellDayName = dateLocalization.format(date, this._formatWeekday);
                }

                if(cellTemplateOpt && cellTemplateOpt.render) {
                    var templateOptions = this._prepareCellTemplateOptions(cellDateNumber + " " + cellDayName, date, i, $td);

                    cellTemplates.push(cellTemplateOpt.render.bind(cellTemplateOpt, templateOptions));
                } else {
                    if(cellDateNumber && cellDayName) {
                        $td.addClass(AGENDA_DATE_CLASS).text(cellDateNumber + " " + cellDayName);
                    }
                }

                if(options.rowClass) {
                    $row.addClass(options.rowClass);
                }

                if(options.cellClass) {
                    $td.addClass(options.cellClass);
                }

                $row.append($td);
                this._$rows.push($row);
            }
        }).bind(this);

        for(var i = 0; i < this._rows.length; i++) {
            each(this._rows[i], fillTableBody);
            this._setLastRowClass();
        }

        $(options.container).append($("<tbody>").append(this._$rows));
        this._applyCellTemplates(cellTemplates);
    },

    _setLastRowClass: function() {
        if(this._rows.length > 1 && this._$rows.length) {
            var $lastRow = this._$rows[this._$rows.length - 1];

            $lastRow.addClass(LAST_ROW_CLASS);
        }
    },

    _renderTimePanel: function() {
        this._renderTableBody({
            container: getPublicElement(this._$timePanel),
            rowCount: this._getTimePanelRowCount(),
            cellCount: 1,
            rowClass: TIME_PANEL_ROW_CLASS,
            cellClass: TIME_PANEL_CELL_CLASS,
            cellTemplate: this.option("dateCellTemplate"),
            getStartDate: this._getTimePanelStartDate.bind(this)
        });
    },

    _getTimePanelStartDate: function(rowIndex) {
        var current = new Date(this.option("currentDate")),
            cellDate = new Date(current.setDate(current.getDate() + rowIndex));

        return cellDate;
    },

    _getRowHeight: function(rowSize) {
        var baseHeight = this.option("rowHeight"),
            innerOffset = (rowSize - 1) * INNER_CELL_MARGIN;

        return rowSize ? (baseHeight * rowSize) + innerOffset + OUTER_CELL_MARGIN : 0;
    },

    _getGroupRowHeight: function(groupRows) {
        // TODO: hotfix
        if(!groupRows) {
            return;
        }

        var result = 0;

        for(var i = 0; i < groupRows.length; i++) {
            result += this._getRowHeight(groupRows[i]);
        }

        return result;
    },

    getAgendaVerticalStepHeight: function() {
        return this.option("rowHeight");
    },

    getEndViewDate: function() {
        var currentDate = new Date(this.option("currentDate")),
            agendaDuration = this.option("agendaDuration");

        currentDate.setHours(this.option("endDayHour"));

        var result = currentDate.setDate(currentDate.getDate() + agendaDuration - 1) - 60000;

        return new Date(result);
    },

    getCoordinatesByDate: function() {
        return {
            top: 0,
            left: 0,
            max: 0,
            groupIndex: 0
        };
    },

    getCellDataByCoordinates: function() {
        return {
            startDate: null,
            endDate: null
        };
    }

});

registerComponent("dxSchedulerAgenda", SchedulerAgenda);

module.exports = SchedulerAgenda;
