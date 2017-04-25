"use strict";

var $ = require("jquery"),
    dataCoreUtils = require("../core/utils/data"),
    Route = require("./router").Route;

function prepareNavigateOptions(options, actionArguments) {
    if(actionArguments.args) {
        var sourceEventArguments = actionArguments.args[0];
        options.jQueryEvent = sourceEventArguments.jQueryEvent;
    }
    if((actionArguments.component || {}).NAME === "dxCommand") {
        $.extend(options, actionArguments.component.option());
    }
}

function preventDefaultLinkBehavior(e) {
    if(!e) {
        return;
    }

    var $targetElement = $(e.target);

    if($targetElement.attr('href')) {
        e.preventDefault();
    }
}

var createActionExecutors = function(app) {
    return {
        "routing": {
            execute: function(e) {
                var action = e.action,
                    options = {},
                    routeValues,
                    uri;

                if($.isPlainObject(action)) {
                    routeValues = action.routeValues;

                    if(routeValues && $.isPlainObject(routeValues)) {
                        options = action.options;
                    } else {
                        routeValues = action;
                    }

                    uri = app.router.format(routeValues);

                    prepareNavigateOptions(options, e);
                    preventDefaultLinkBehavior(options.jQueryEvent);
                    app.navigate(uri, options);
                    e.handled = true;
                }
            }
        },
        "hash": {
            execute: function(e) {
                if(typeof e.action !== "string" || e.action.charAt(0) !== "#") {
                    return;
                }

                var uriTemplate = e.action.substr(1),
                    args = e.args[0],
                    uri = uriTemplate;

                var defaultEvaluate = function(expr) {
                    var getter = dataCoreUtils.compileGetter(expr),
                        model = e.args[0].model;

                    return getter(model);
                };

                var evaluate = args.evaluate || defaultEvaluate;

                uri = uriTemplate.replace(/\{([^}]+)\}/g, function(entry, expr) {
                    expr = $.trim(expr);
                    if(expr.indexOf(",") > -1) {
                        expr = $.map(expr.split(","), $.trim);
                    }
                    var value = evaluate(expr);
                    if(value === undefined) {
                        value = "";
                    }
                    value = Route.prototype.formatSegment(value);

                    return value;
                });

                var options = {};
                prepareNavigateOptions(options, e);
                preventDefaultLinkBehavior(options.jQueryEvent);
                app.navigate(uri, options);
                e.handled = true;
            }
        },
        "url": {
            execute: function(e) {
                if(typeof e.action === "string" && e.action.charAt(0) !== "#") {
                    document.location = e.action;
                }
            }
        }
    };
};

exports.createActionExecutors = createActionExecutors;
