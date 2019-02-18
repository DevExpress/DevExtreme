var extend = require("../core/utils/extend").extend,
    typeUtils = require("../core/utils/type"),
    iteratorUtils = require("../core/utils/iterator"),
    inArray = require("../core/utils/array").inArray,
    Class = require("../core/class");

// NOTE: replaceState crushes on WP8 if url contains ':' character (T108063)
var JSON_URI_PREFIX = encodeURIComponent("json:");


var Route = Class.inherit({
    _trimSeparators: function(str) {
        return str.replace(/^[/.]+|\/+$/g, "");
    },
    _escapeRe: function(str) {
        return str.replace(/[^-\w]/g, "\\$1");
    },
    _checkConstraint: function(param, constraint) {
        param = String(param);

        if(typeof constraint === "string") {
            constraint = new RegExp(constraint);
        }

        var match = constraint.exec(param);
        if(!match || match[0] !== param) {
            return false;
        }
        return true;
    },
    _ensureReady: function() {
        var that = this;

        if(this._patternRe) {
            return false;
        }

        this._pattern = this._trimSeparators(this._pattern);
        this._patternRe = "";
        this._params = [];
        this._segments = [];
        this._separators = [];

        this._pattern.replace(/[^/]+/g, function(segment, index) {
            that._segments.push(segment);
            if(index) {
                that._separators.push(that._pattern.substr(index - 1, 1));
            }
        });

        iteratorUtils.each(this._segments, function(index) {
            var segment = this,
                separator = index ? that._separators[index - 1] : "";

            if(segment.charAt(0) === ":") {
                segment = segment.substr(1);
                that._params.push(segment);

                that._patternRe += "(?:" + separator + "([^/]*))";
                if(segment in that._defaults) {
                    that._patternRe += "?";
                }
            } else {
                that._patternRe += separator + that._escapeRe(segment);
            }
        });

        this._patternRe = new RegExp("^" + this._patternRe + "$");
    },
    ctor: function(pattern, defaults, constraints) {
        this._pattern = pattern || "";
        this._defaults = defaults || {};
        this._constraints = constraints || {};
    },
    parse: function(uri) {
        var that = this;
        this._ensureReady();
        var matches = this._patternRe.exec(uri);
        if(!matches) {
            return false;
        }
        var result = extend({}, this._defaults);
        iteratorUtils.each(this._params, function(i) {
            var index = i + 1;
            if(matches.length >= index && matches[index]) {
                result[this] = that.parseSegment(matches[index]);
            }
        });

        iteratorUtils.each(this._constraints, function(key) {
            if(!that._checkConstraint(result[key], that._constraints[key])) {
                result = false;
                return false;
            }
        });

        return result;
    },
    format: function(routeValues) {
        var that = this,
            query = "";
        this._ensureReady();

        var mergeValues = extend({}, this._defaults),
            useStatic = 0,
            result = [],
            dels = [],
            unusedRouteValues = {};

        iteratorUtils.each(routeValues, function(paramName, paramValue) {
            routeValues[paramName] = that.formatSegment(paramValue);
            if(!(paramName in mergeValues)) {
                unusedRouteValues[paramName] = true;
            }
        });

        iteratorUtils.each(this._segments, function(index, segment) {
            result[index] = index ? that._separators[index - 1] : '';

            if(segment.charAt(0) === ':') {
                var paramName = segment.substr(1);

                if(!(paramName in routeValues) && !(paramName in that._defaults)) {
                    result = null;
                    return false;
                }

                if(paramName in that._constraints && !that._checkConstraint(routeValues[paramName], that._constraints[paramName])) {
                    result = null;
                    return false;
                }

                if(paramName in routeValues) {
                    if(routeValues[paramName] !== undefined) {
                        mergeValues[paramName] = routeValues[paramName];
                        result[index] += routeValues[paramName];
                        useStatic = index;
                    }
                    delete unusedRouteValues[paramName];
                } else if(paramName in mergeValues) {
                    result[index] += mergeValues[paramName];
                    dels.push(index);
                }

            } else {
                result[index] += segment;
                useStatic = index;
            }
        });

        iteratorUtils.each(mergeValues, function(key, value) {
            if(!!value && inArray(":" + key, that._segments) === -1 && routeValues[key] !== value) {
                result = null;
                return false;
            }
        });

        var unusedCount = 0;
        if(!typeUtils.isEmptyObject(unusedRouteValues)) {
            query = "?";
            iteratorUtils.each(unusedRouteValues, function(key) {
                query += key + "=" + routeValues[key] + "&";
                unusedCount++;
            });
            query = query.substr(0, query.length - 1);
        }

        if(result === null) {
            return false;
        }

        if(dels.length) {
            iteratorUtils.map(dels, function(i) {
                if(i >= useStatic) {
                    result[i] = '';
                }
            });
        }

        var path = result.join('');
        path = path.replace(/\/+$/, "");
        return {
            uri: path + query,
            unusedCount: unusedCount
        };
    },

    formatSegment: function(value) {
        if(Array.isArray(value) || typeUtils.isPlainObject(value)) {
            return JSON_URI_PREFIX + encodeURIComponent(JSON.stringify(value));
        }
        return encodeURIComponent(value);
    },

    parseSegment: function(value) {
        if(value.substr(0, JSON_URI_PREFIX.length) === JSON_URI_PREFIX) {
            try {
                return JSON.parse(decodeURIComponent(value.substr(JSON_URI_PREFIX.length)));
            } catch(x) {
            }
        }
        return decodeURIComponent(value);
    }
});

/**
* @name Router
* @type object
* @module framework/router
* @export default
* @deprecated
*/
var Router = Class.inherit({
    ctor: function() {
        this._registry = [];
    },

    _trimSeparators: function(str) {
        return str.replace(/^[/.]+|\/+$/g, "");
    },

    _createRoute: function(pattern, defaults, constraints) {
        return new Route(pattern, defaults, constraints);
    },

    /**
    * @name RouterMethods.register
    * @publicName register(pattern, defaults, constraints)
    * @type method
    * @param1 pattern:string
    * @param2 defaults:object|undefined
    * @param3 constraints:object|undefined
    */
    register: function(pattern, defaults, constraints) {
        this._registry.push(this._createRoute(pattern, defaults, constraints));
    },

    _parseQuery: function(query) {
        var result = {},
            values = query.split("&");

        iteratorUtils.each(values, function(index, value) {
            var keyValuePair = value.split("=");
            result[keyValuePair[0]] = decodeURIComponent(keyValuePair[1]);
        });
        return result;
    },

    /**
    * @name RouterMethods.parse
    * @publicName parse(uri)
    * @type method
    * @param1 uri:string
    * @return object
    */
    parse: function(uri) {
        var that = this,
            result;
        uri = this._trimSeparators(uri);
        var parts = uri.split("?", 2),
            path = parts[0],
            query = parts[1];

        iteratorUtils.each(this._registry, function() {
            var parseResult = this.parse(path);
            if(parseResult !== false) {
                result = parseResult;
                if(query) {
                    result = extend(result, that._parseQuery(query));
                }
                return false;
            }
        });
        return result ? result : false;
    },

    /**
    * @name RouterMethods.format
    * @publicName format(obj)
    * @type method
    * @param1 obj:object
    * @return string
    */
    format: function(obj) {
        var result = false,
            minUnusedCount = 99999;
        obj = obj || {};
        iteratorUtils.each(this._registry, function() {
            var toFormat = extend(true, {}, obj);
            var formatResult = this.format(toFormat);
            if(formatResult !== false) {
                if(minUnusedCount > formatResult.unusedCount) {
                    minUnusedCount = formatResult.unusedCount;
                    result = formatResult.uri;
                }
            }
        });
        return result;
    }
});

///#DEBUG
Route.__internals = {
    JSON_URI_PREFIX: JSON_URI_PREFIX
};
///#ENDDEBUG

module.exports = Router;
module.exports.Route = Route;
