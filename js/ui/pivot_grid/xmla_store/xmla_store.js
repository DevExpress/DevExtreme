"use strict";

var $ = require("../../../core/renderer"),
    Class = require("../../../core/class"),
    stringFormat = require("../../../core/utils/string").format,
    errors = require("../../../data/errors").errors,
    noop = require("../../../core/utils/common").noop,
    typeUtils = require("../../../core/utils/type"),
    iteratorUtils = require("../../../core/utils/iterator"),
    inArray = require("../../../core/utils/array").inArray,
    pivotGridUtils = require("../ui.pivot_grid.utils"),
    when = require("../../../integration/jquery/deferred").when,
    getLanguageId = require("../../../localization/language_codes").getLanguageId;

exports.XmlaStore = Class.inherit((function() {

    var discover = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>{2}</RequestType><Restrictions><RestrictionList><CATALOG_NAME>{0}</CATALOG_NAME><CUBE_NAME>{1}</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>{0}</Catalog>{3}</PropertyList></Properties></Discover></Body></Envelope>',
        execute = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>{0}</Statement></Command><Properties><PropertyList><Catalog>{1}</Catalog><ShowHiddenCubes>True</ShowHiddenCubes><SspropInitAppName>Microsoft SQL Server Management Studio</SspropInitAppName><Timeout>3600</Timeout>{2}</PropertyList></Properties></Execute></Body></Envelope>',
        mdx = "SELECT {2} FROM {0} {1} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS",
        mdxFilterSelect = "(SELECT {0} FROM {1})",
        mdxWith = "{0} {1} as {2}",
        mdxSlice = "WHERE ({0})",
        mdxNonEmpty = "NonEmpty({0}, {1})",
        mdxAxis = "{0} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON {1}",
        mdxCrossJoin = "CrossJoin({0})",
        mdxSet = "{{0}}",
        each = $.each,

        MEASURE_DEMENSION_KEY = "DX_MEASURES",
        MD_DIMTYPE_MEASURE = "2";

    function execXMLA(requestOptions, data) {
        var deferred = $.Deferred(),
            beforeSend = requestOptions.beforeSend,
            ajaxSettings = {
                url: requestOptions.url,
                dataType: "text",
                data: data,
                headers: {
                    'Content-Type': 'text/xml'
                },
                xhrFields: {
                },
                method: "POST"
            };

        if(typeUtils.isFunction(beforeSend)) {
            beforeSend(ajaxSettings);
        }

        pivotGridUtils.sendRequest(ajaxSettings).fail(function() {
            deferred.reject(arguments);
        }).done(function(text) {
            var parser = new window.DOMParser();
            var xml;

            try {
                try { //For IE
                    xml = parser.parseFromString(text, "text/xml");
                } catch(e) {
                    xml = undefined;
                }

                if(!xml || xml.getElementsByTagName("parsererror").length) {
                    throw new errors.Error("E4023", text);
                }
            } catch(e) {
                deferred.reject({
                    statusText: e.message,
                    stack: e.stack,
                    responseText: text
                });
            }

            deferred.resolve(xml);
        });
        return deferred;
    }

    function getLocaleIdProperty() {
        var languageId = getLanguageId();

        if(languageId !== undefined) {
            return stringFormat("<LocaleIdentifier>{0}</LocaleIdentifier>", languageId);
        }
        return "";
    }

    function mdxDescendants(level, levelMember, nextLevel) {
        levelMember = levelMember ? "." + levelMember : "";
        return "Descendants({" + level + levelMember + "}, " + nextLevel + ", SELF_AND_BEFORE)";
    }

    function getAllMember(dimension) {
        return (dimension.hierarchyName || dimension.dataField) + ".[All]";
    }

    function getAllMembers(field) {
        return field.dataField + ".allMembers";
    }

    function crossJoinElements(elements) {
        var elementsString = elements.join(",");
        return elements.length > 1 ? stringFormat(mdxCrossJoin, elementsString) : elementsString;
    }

    function union(elements) {
        var elementsString = elements.join(",");
        return elements.length > 1 ? "Union(" + elementsString + ")" : elementsString;
    }

    function generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName) {
        var crossJoinArgs = [],
            dimensions = options[axisName],
            dataField,
            allMember,
            fields = [],
            hierarchyName,
            arg,
            prevDimension,
            prevHierarchyName,
            isLastDimensionInGroup,
            isFirstDimensionInGroup,
            expandAllIndex,
            field,
            member,
            i;

        for(i = expandIndex; i <= expandLevel; i++) {
            field = dimensions[i];
            dataField = field.dataField;
            prevHierarchyName = dimensions[i - 1] && dimensions[i - 1].hierarchyName;
            hierarchyName = field.hierarchyName;
            isLastDimensionInGroup = !hierarchyName || !dimensions[i + 1] || dimensions[i + 1].hierarchyName !== hierarchyName;
            expandAllIndex = path.length + expandAllCount + expandIndex;
            arg = null;

            fields.push(field);

            if(i < path.length) {
                if(isLastDimensionInGroup) {
                    arg = "(" + dataField + "." + preparePathValue(path[i]) + ")";
                }
            } else if(i <= expandAllIndex) {
                if(i === 0 && expandAllCount === 0) {
                    allMember = getAllMember(dimensions[expandIndex]);

                    if(!hierarchyName) {
                        arg = getAllMembers(dimensions[expandIndex]);
                    } else {
                        arg = allMember + "," + dimensions[expandIndex].dataField;
                    }

                } else {
                    if(hierarchyName) {
                        member = preparePathValue(slicePath[slicePath.length - 1]);
                        if(isLastDimensionInGroup || i === expandAllIndex) {
                            if(prevHierarchyName === hierarchyName) {
                                if(slicePath.length) {
                                    prevDimension = dimensions[slicePath.length - 1];
                                }
                                if(!prevDimension || prevDimension.hierarchyName !== hierarchyName) {
                                    prevDimension = dimensions[i - 1];
                                    member = "";
                                }

                                arg = mdxDescendants(prevDimension.dataField, member, dataField);
                            } else {
                                arg = getAllMembers(field);
                            }
                        }
                    } else {
                        arg = getAllMembers(field);
                    }
                }
            } else {
                isFirstDimensionInGroup = !hierarchyName || prevHierarchyName !== hierarchyName;
                if(isFirstDimensionInGroup) {
                    arg = "(" + getAllMember(field) + ")";
                }
            }
            if(arg) {
                arg = stringFormat(mdxSet, arg);
                crossJoinArgs.push(arg);
            }
        }

        return crossJoinElements(crossJoinArgs);
    }

    function fillCrossJoins(crossJoins, path, expandLevel, expandIndex, slicePath, options, axisName, cellsString) {
        var expandAllCount = -1,
            dimensions = options[axisName],
            dimensionIndex;

        do {
            expandAllCount++;
            dimensionIndex = path.length + expandAllCount + expandIndex;
            crossJoins.push(stringFormat(mdxNonEmpty, generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName), cellsString));
        } while(dimensions[dimensionIndex] && dimensions[dimensionIndex + 1] && dimensions[dimensionIndex].expanded);
    }

    function declare(expression, withArray, name, type) {
        name = name || ("[DX_Set_" + withArray.length + "]");
        type = type || "set";

        withArray.push(stringFormat(mdxWith, type, name, expression));
        return name;
    }

    function generateAxisMdx(options, axisName, cells, withArray, parseOptions) {
        var dimensions = options[axisName],
            crossJoins = [],
            path = [],
            expandedPaths = [],
            expandIndex = 0,
            expandLevel = 0,
            result = [],
            cellsString = stringFormat(mdxSet, cells.join(","));

        if(dimensions && dimensions.length) {
            if(options.headerName === axisName) {
                path = options.path;
                expandIndex = path.length;
            } else {
                expandedPaths = (axisName === "columns" ? options.columnExpandedPaths : options.rowExpandedPaths) || expandedPaths;
            }
            expandLevel = pivotGridUtils.getExpandedLevel(options, axisName);

            fillCrossJoins(crossJoins, [], expandLevel, expandIndex, path, options, axisName, cellsString);
            each(expandedPaths, function(_, expandedPath) {
                fillCrossJoins(crossJoins, expandedPath, expandLevel, expandIndex, expandedPath, options, axisName, cellsString);
            });

            for(var i = expandLevel; i >= path.length; i--) {
                if(dimensions[i].hierarchyName) {
                    parseOptions.visibleLevels[dimensions[i].hierarchyName] = parseOptions.visibleLevels[dimensions[i].hierarchyName] || [];
                    parseOptions.visibleLevels[dimensions[i].hierarchyName].push(dimensions[i].dataField);
                }
            }
        }

        if(crossJoins.length) {
            result.push(declare(union(crossJoins), withArray, "[" + "DX_" + axisName + "]"));
        }

        if(axisName === "columns" && cells.length) {
            result.push(cellsString);
        }

        return stringFormat(mdxAxis, crossJoinElements(result), axisName);
    }

    function generateAxisFieldsFilter(fields) {
        var filterMembers = [];

        each(fields, function(_, field) {
            var dataField = field.dataField,
                filterExpression = [],
                filterValues = field.filterValues || [],
                filterStringExpression;

            if(field.hierarchyName && typeUtils.isNumeric(field.groupIndex)) {
                return;
            }

            each(filterValues, function(_, filterValue) {
                var filterMdx = dataField + "." + preparePathValue(Array.isArray(filterValue) ? filterValue[filterValue.length - 1] : filterValue);
                if(field.filterType === "exclude") {
                    filterExpression.push(filterMdx + ".parent");
                    filterMdx = "Descendants(" + filterMdx + ")";
                }

                filterExpression.push(filterMdx);
            });

            if(filterValues.length) {
                filterStringExpression = stringFormat(mdxSet, filterExpression.join(","));

                if(field.filterType === "exclude") {
                    filterStringExpression = "Except(" + getAllMembers(field) + "," + filterStringExpression + ")";
                }

                filterMembers.push(filterStringExpression);
            }
        });

        return filterMembers.length ? crossJoinElements(filterMembers) : "";
    }

    function generateFrom(columnsFilter, rowsFilter, filter, cubeName) {
        var from = "[" + cubeName + "]";

        each([columnsFilter, rowsFilter, filter], function(_, filter) {
            if(filter) {
                from = stringFormat(mdxFilterSelect, filter + "on 0", from);
            }
        });

        return from;
    }

    function generateMdxCore(axisStrings, withArray, columns, rows, filters, slice, cubeName) {
        var mdxString = "",
            withString = (withArray.length ? "with " + withArray.join(" ") : "") + " ";

        if(axisStrings.length) {
            mdxString = withString + stringFormat(mdx,
                generateFrom(generateAxisFieldsFilter(columns), generateAxisFieldsFilter(rows), generateAxisFieldsFilter(filters || []), cubeName),
                slice.length ? stringFormat(mdxSlice, slice.join(",")) : "", axisStrings.join(","));
        }

        return mdxString;
    }

    function prepareDataFields(withArray, valueFields) {

        return iteratorUtils.map(valueFields, function(cell) {
            if(typeUtils.isString(cell.expression)) {
                declare(cell.expression, withArray, cell.dataField, "member");
            }
            return cell.dataField;
        });
    }

    function generateMDX(options, cubeName, parseOptions) {
        var columns = options.columns || [],
            rows = options.rows || [],
            values = options.values && options.values.length ? options.values : [{ dataField: '[Measures]' }],
            slice = [],
            withArray = [],
            axisStrings = [],
            dataFields = prepareDataFields(withArray, values);

        parseOptions.measureCount = values.length;
        parseOptions.visibleLevels = {};

        if(options.headerName && options.path) {
            each(options.path, function(index, value) {
                var dimension = options[options.headerName][index];
                if(!dimension.hierarchyName || dimension.hierarchyName !== options[options.headerName][index + 1].hierarchyName) {
                    slice.push(dimension.dataField + "." + preparePathValue(value));
                }
            });
        }

        if(columns.length || dataFields.length) {
            axisStrings.push(generateAxisMdx(options, "columns", dataFields, withArray, parseOptions));
        }

        if(rows.length) {
            axisStrings.push(generateAxisMdx(options, "rows", dataFields, withArray, parseOptions));
        }

        return generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName);
    }

    function createDrillDownAxisSlice(slice, fields, path) {
        each(path, function(index, value) {
            var field = fields[index];
            if(field.hierarchyName && (fields[index + 1] || {}).hierarchyName === field.hierarchyName) {
                return;
            }
            slice.push(field.dataField + "." + preparePathValue(value));
        });
    }

    function generateDrillDownMDX(options, cubeName, params) {
        var columns = options.columns || [],
            rows = options.rows || [],
            values = options.values && options.values.length ? options.values : [{ dataField: '[Measures]' }],
            slice = [],
            withArray = [],
            axisStrings = [],
            dataFields = prepareDataFields(withArray, values),
            maxRowCount = params.maxRowCount,
            customColumns = params.customColumns || [],
            customColumnsString = customColumns.length > 0 ? " return " + customColumns.join(",") : "",
            coreMDX;

        createDrillDownAxisSlice(slice, columns, params.columnPath || []);

        createDrillDownAxisSlice(slice, rows, params.rowPath || []);

        if(columns.length || columns.length || dataFields.length) {
            axisStrings.push([(dataFields[params.dataIndex] || dataFields[0]) + " on 0"]);
        }

        coreMDX = generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName);

        return coreMDX ? "drillthrough" + (maxRowCount > 0 ? " maxrows " + maxRowCount : "") + coreMDX + customColumnsString : coreMDX;
    }

    function getNumber(str) {
        return parseInt(str, 10);
    }

    function parseValue(valueText) {

        return typeUtils.isNumeric(valueText) ? parseFloat(valueText) : valueText;
    }

    function getFirstChild(node, tagName) {
        return (node.getElementsByTagName(tagName) || [])[0];
    }

    function getFirstChildText(node, childTagName) {
        return getNodeText(getFirstChild(node, childTagName));
    }

    function parseAxes(xml) {
        var axes = [];

        each(xml.getElementsByTagName("Axis"), function(_, axisElement) {
            var name = axisElement.getAttribute("name"),
                axis = [],
                index = 0;

            if(name.indexOf("Axis") === 0 && typeUtils.isNumeric(getNumber(name.substr(4)))) {

                axes.push(axis);

                each(axisElement.getElementsByTagName("Tuple"), function(_, tupleElement) {
                    var tupleMembers = tupleElement.childNodes,
                        tuple,
                        levelSum = 0,
                        members = [],
                        level,
                        membersCount = tupleMembers.length - 1,
                        isAxisWithMeasure = axes.length === 1,
                        i;

                    if(isAxisWithMeasure) {
                        membersCount--;
                    }

                    axis.push(members);

                    for(i = membersCount; i >= 0; i--) {
                        tuple = tupleMembers[i];
                        level = getNumber(getFirstChildText(tuple, "LNum"));

                        members[i] = {
                            caption: getFirstChildText(tuple, "Caption"),
                            value: parseValue(getFirstChildText(tuple, "MEMBER_VALUE")),
                            level: level,
                            index: index++,
                            hasValue: !levelSum && (!!level || i === 0),
                            name: getFirstChildText(tuple, "UName"),
                            hierarchyName: tupleMembers[i].getAttribute("Hierarchy"),
                            parentName: getFirstChildText(tuple, "PARENT_UNIQUE_NAME"),
                            levelName: getFirstChildText(tuple, "LName")
                        };

                        levelSum += level;
                    }
                });
            }
        });


        while(axes.length < 2) {
            axes.push([[{
                level: 0
            }]]);
        }

        return axes;
    }

    function getNodeText(node) {
        return node && node && (node.textContent || node.text || node.innerHTML) || "";
    }

    function parseCells(xml, axes, measureCount) {
        var cells = [],
            cell = [],
            index = 0,
            measureIndex,
            cellsOriginal = [],
            cellElements = xml.getElementsByTagName("Cell"),
            errorDictionary = {},
            row;

        for(var i = 0; i < cellElements.length; i++) {
            var xmlCell = cellElements[i],
                valueElement = xmlCell.getElementsByTagName("Value")[0],
                errorElements = valueElement && valueElement.getElementsByTagName("Error") || [],
                text = errorElements.length === 0 ? getNodeText(valueElement) : "#N/A",
                value = parseFloat(text),
                isNumeric = (text - value + 1) > 0,
                cellOrdinal = getNumber(xmlCell.getAttribute("CellOrdinal"));

            if(errorElements.length) {
                errorDictionary[getNodeText(errorElements[0].getElementsByTagName("ErrorCode")[0])] = getNodeText(errorElements[0].getElementsByTagName("Description")[0]);
            }

            cellsOriginal[cellOrdinal] = {
                value: isNumeric ? value : text || null
            };
        }

        each(axes[1], function() {
            row = [];
            cells.push(row);
            each(axes[0], function() {
                measureIndex = index % measureCount;

                if(measureIndex === 0) {
                    cell = [];
                    row.push(cell);
                }

                cell.push(cellsOriginal[index] ? cellsOriginal[index].value : null);
                index++;
            });
        });

        Object.keys(errorDictionary).forEach(function(key) {
            errors.log("W4002", errorDictionary[key]);
        });

        return cells;
    }

    function preparePathValue(pathValue) {
        if(pathValue) {
            return (typeUtils.isString(pathValue) && pathValue.indexOf("&[") !== -1) ? pathValue : "[" + pathValue + "]";
        }
    }

    function getItem(hash, name, member, index) {
        var item = hash[name];

        if(!item) {
            item = {};
            hash[name] = item;
        }

        if(!item.value && member) {
            item.text = member.caption;
            item.value = member.value;
            item.key = name ? name.slice(name.indexOf('&[')) : '';
            item.levelName = member.levelName;
            item.hierarchyName = member.hierarchyName;
            item.parentName = member.parentName;
            item.index = index;
            item.level = member.level;
        }

        return item;
    }

    function getVisibleChildren(item, visibleLevels) {
        var result = [],
            children = item.children && (item.children.length ? item.children : [].concat.apply([], iteratorUtils.map(item.children.grandTotalHash || [], function(e) {
                return e.children;
            }))),
            firstChild = children && children[0];

        if(firstChild && (visibleLevels[firstChild.hierarchyName] && (inArray(firstChild.levelName, visibleLevels[firstChild.hierarchyName]) !== -1) || !visibleLevels[firstChild.hierarchyName] || firstChild.level === 0)) {
            var newChildren = iteratorUtils.map(children, function(child) {
                return child.hierarchyName === firstChild.hierarchyName ? child : null;
            });
            newChildren.grandTotalHash = children.grandTotalHash;
            return newChildren;
        } else if(firstChild) {
            for(var i = 0; i < children.length; i++) {
                if(children[i].hierarchyName === firstChild.hierarchyName) {
                    result.push.apply(result, getVisibleChildren(children[i], visibleLevels));
                }
            }
        }
        return result;
    }

    function processMember(dataIndex, member, parentItem) {
        var currentItem,
            children = parentItem.children = parentItem.children || [],
            hash = children.hash = children.hash || {},
            grandTotalHash = children.grandTotalHash = children.grandTotalHash || {};

        if(member.parentName) {
            parentItem = getItem(hash, member.parentName);
            children = parentItem.children = parentItem.children || [];
        }

        currentItem = getItem(hash, member.name, member, dataIndex);

        if(member.hasValue && !currentItem.added) {
            currentItem.index = dataIndex;
            currentItem.added = true;
            children.push(currentItem);
        }

        if((!parentItem.value || !parentItem.parentName) && member.parentName) {
            grandTotalHash[member.parentName] = parentItem;
        } else {
            if(grandTotalHash[parentItem.name]) {
                delete grandTotalHash[member.parentName];
            }
        }
        return currentItem;
    }

    function getGrandTotalIndex(parentItem, visibleLevels) {
        var grandTotalIndex;
        if(parentItem.children.length === 1 && parentItem.children[0].parentName === "") {
            grandTotalIndex = parentItem.children[0].index;
        //TODO - refactoring
            var grandTotalHash = parentItem.children.grandTotalHash;
            parentItem.children = parentItem.children[0].children || [];

            parentItem.children.grandTotalHash = grandTotalHash;

            parentItem.children = getVisibleChildren(parentItem, visibleLevels);
        } else if(parentItem.children.length === 0) {
            grandTotalIndex = 0;
        }

        return grandTotalIndex;
    }

    function fillDataSourceAxes(dataSourceAxis, axisTuples, measureCount, visibleLevels) {
        var grandTotalIndex,
            result = [];

        each(axisTuples, function(tupleIndex, members) {
            var parentItem = {
                    children: result
                },
                dataIndex = typeUtils.isDefined(measureCount) ? Math.floor(tupleIndex / measureCount) : tupleIndex;

            each(members, function(_, member) {
                parentItem = processMember(dataIndex, member, parentItem);
            });
        });

        var parentItem = {
            children: result
        };

        parentItem.children = getVisibleChildren(parentItem, visibleLevels);

        grandTotalIndex = getGrandTotalIndex(parentItem, visibleLevels);

        pivotGridUtils.foreachTree(parentItem.children, function(items) {
            var item = items[0],
                children = getVisibleChildren(item, visibleLevels);

            if(children.length) {
                item.children = children;
            } else {
                delete item.children;
            }
            delete item.levelName;
            delete item.hierarchyName;
            delete item.added;
            delete item.parentName;
            delete item.level;
        }, true);

        each(parentItem.children || [], function(_, e) {
            dataSourceAxis.push(e);
        });

        return grandTotalIndex;
    }

    function checkError(xml) {
        var faultElementNS = xml.getElementsByTagName("soap:Fault"),
            faultElement = xml.getElementsByTagName("Fault"),
            errorElement = $(faultElement.length ? faultElement : faultElementNS).find("Error"),
            description,
            error;

        if(errorElement.length) {
            description = errorElement.attr("Description");
            error = new errors.Error("E4000", description);
            errors.log("E4000", description);
            return error;
        }
        return null;
    }

    function parseResult(xml, parseOptions) {
        var dataSource = {
                columns: [],
                rows: []
            },
            axes,

            measureCount = parseOptions.measureCount;

        axes = parseAxes(xml);

        dataSource.grandTotalColumnIndex = fillDataSourceAxes(dataSource.columns, axes[0], measureCount, parseOptions.visibleLevels);

        dataSource.grandTotalRowIndex = fillDataSourceAxes(dataSource.rows, axes[1], undefined, parseOptions.visibleLevels);

        dataSource.values = parseCells(xml, axes, measureCount);

        return dataSource;
    }

    function parseDiscoverRowSet(xml, schema, dimensions) {
        var result = [],
            isMeasure = schema === "MEASURE",
            displayFolderField = isMeasure ? "MEASUREGROUP_NAME" : schema + "_DISPLAY_FOLDER";

        each(xml.getElementsByTagName("row"), function(_, row) {
            var hierarchyName = schema === "LEVEL" ? getFirstChildText(row, "HIERARCHY_UNIQUE_NAME") : undefined,
                levelNumber = getFirstChildText(row, "LEVEL_NUMBER");

            if((levelNumber !== "0" || getFirstChildText(row, schema + "_IS_VISIBLE") !== "true") && (getFirstChildText(row, "DIMENSION_TYPE") !== MD_DIMTYPE_MEASURE)) {
                var dimension = isMeasure ? MEASURE_DEMENSION_KEY : getFirstChildText(row, "DIMENSION_UNIQUE_NAME"),
                    dataField = getFirstChildText(row, schema + "_UNIQUE_NAME");
                result.push({
                    dimension: dimensions.names[dimension] || dimension,
                    groupIndex: levelNumber ? getNumber(levelNumber) - 1 : undefined,
                    dataField: dataField,
                    caption: getFirstChildText(row, schema + "_CAPTION"),
                    hierarchyName: hierarchyName,
                    groupName: hierarchyName,
                    displayFolder: getFirstChildText(row, displayFolderField),
                    isMeasure: isMeasure,
                    isDefault: !!dimensions.defaultHierarchies[dataField]
                });
            }
        });

        return result;
    }

    function parseDimensionsDiscoverRowSet(xml) {
        var result = {
            names: {},
            defaultHierarchies: {}
        };

        each($(xml).find("row"), function() {
            var $row = $(this),
                type = $row.children("DIMENSION_TYPE").text(),
                dimensionName = type === MD_DIMTYPE_MEASURE ? MEASURE_DEMENSION_KEY : $row.children("DIMENSION_UNIQUE_NAME").text();

            result.names[dimensionName] = $row.children("DIMENSION_CAPTION").text();
            result.defaultHierarchies[$row.children("DEFAULT_HIERARCHY").text()] = true;
        });
        return result;
    }

    function parseStringWithUnicodeSymbols(str) {
        str = str.replace(/_x(....)_/g, function(whole, group1) {
            return String.fromCharCode(parseInt(group1, 16));
        });

        var stringArray = str.match(/\[.+?\]/gi);
        if(stringArray && stringArray.length) {
            str = stringArray[stringArray.length - 1];
        }

        return str
            .replace(/\[/gi, "")
            .replace(/\]/gi, "")
            .replace(/\$/gi, "")
            .replace(/\./gi, " ");
    }

    function parseDrillDownRowSet(xml) {
        var rows = xml.getElementsByTagName("row"),
            result = [],
            columnNames = {};

        for(var i = 0; i < rows.length; i++) {
            var children = rows[i].childNodes,
                item = {};

            for(var j = 0; j < children.length; j++) {
                var tagName = children[j].tagName,
                    name = columnNames[tagName] = columnNames[tagName] || parseStringWithUnicodeSymbols(tagName);
                item[name] = getNodeText(children[j]);
            }
            result.push(item);
        }

        return result;
    }

    function sendQuery(storeOptions, mdxString) {
        mdxString = $("<div>").text(mdxString).html();
        return execXMLA(storeOptions, stringFormat(execute, mdxString, storeOptions.catalog, getLocaleIdProperty()));
    }

/**
* @name XmlaStore
* @publicName XmlaStore
* @type object
* @module ui/pivot_grid/xmla_store
* @export default
*/

    return {
        ctor: function(options) {
            this._options = options;

        /**
        * @name XmlaStoreOptions_url
        * @publicName url
        * @type string
        */

        /**
        * @name XmlaStoreOptions_catalog
        * @publicName catalog
        * @type string
        */

        /**
        * @name XmlaStoreOptions_cube
        * @publicName cube
        * @type string
        */

        /**
        * @name XmlaStoreOptions_beforeSend
        * @publicName beforeSend
        * @type function(request)
        * @type_function_param1 request:object
        */
        },

        getFields: function() {
            var options = this._options,
                catalog = options.catalog,
                cube = options.cube,
                localeIdProperty = getLocaleIdProperty(),
                dimensionsRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_DIMENSIONS", localeIdProperty)),
                measuresRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_MEASURES", localeIdProperty)),
                hierarchiesRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_HIERARCHIES", localeIdProperty)),
                levelsRequest = execXMLA(options, stringFormat(discover, catalog, cube, "MDSCHEMA_LEVELS", localeIdProperty)),
                result = $.Deferred();

            when(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest).done(function(dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) {
                var dimensions = parseDimensionsDiscoverRowSet(dimensionsResponse),
                    hierarchies = parseDiscoverRowSet(hierarchiesResponse, "HIERARCHY", dimensions),
                    levels = parseDiscoverRowSet(levelsResponse, "LEVEL", dimensions),
                    fields = parseDiscoverRowSet(measuresResponse, "MEASURE", dimensions).concat(hierarchies),
                    levelsByHierarchy = {};

                each(levels, function(_, level) {
                    levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName] || [];
                    levelsByHierarchy[level.hierarchyName].push(level);
                });

                each(hierarchies, function(_, hierarchy) {
                    if(levelsByHierarchy[hierarchy.dataField] && levelsByHierarchy[hierarchy.dataField].length > 1) {
                        hierarchy.groupName = hierarchy.hierarchyName = hierarchy.dataField;

                        fields.push.apply(fields, levelsByHierarchy[hierarchy.hierarchyName]);
                    }
                });
                result.resolve(fields);
            }).fail(result.reject);

            return result;
        },

        load: function(options) {
            var result = $.Deferred(),
                storeOptions = this._options,
                parseOptions = {},
                mdxString = generateMDX(options, storeOptions.cube, parseOptions);

            if(mdxString) {
                when(sendQuery(storeOptions, mdxString)).done(function(executeXml) {
                    var error = checkError(executeXml);

                    if(!error) {
                        result.resolve(parseResult(executeXml, parseOptions));
                    } else {
                        result.reject(error);
                    }
                }).fail(result.reject);
            } else {
                result.resolve({
                    columns: [],
                    rows: [],
                    values: [],
                    grandTotalColumnIndex: 0,
                    grandTotalRowIndex: 0
                });
            }
            return result;
        },
        supportSorting: function() {
            return true;
        },

        getDrillDownItems: function(options, params) {
            var result = $.Deferred(),
                storeOptions = this._options,
                mdxString = generateDrillDownMDX(options, storeOptions.cube, params);

            if(mdxString) {
                when(sendQuery(storeOptions, mdxString)).done(function(executeXml) {
                    var error = checkError(executeXml);

                    if(!error) {
                        result.resolve(parseDrillDownRowSet(executeXml));
                    } else {
                        result.reject(error);
                    }
                }).fail(result.reject);
            } else {
                result.resolve([]);
            }
            return result;
        },

        key: noop,
        filter: noop
    };
})()).include(pivotGridUtils.storeDrillDownMixin);
