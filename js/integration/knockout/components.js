"use strict";

var $ = require("../../core/renderer"),
    errors = require("../../core/errors"),
    Action = require("../../core/action"),
    compileGetter = require("../../core/utils/data").compileGetter,
    extend = require("../../core/utils/extend").extend,
    ko = require("knockout"),
    iconUtils = require("../../core/utils/icon"),
    inflector = require("../../core/utils/inflector"),
    clickEvent = require("../../events/click");

// TODO: dxAction as dxComponent?
// TODO: A comment for documentation is temporarily located in the framework.command.js file. Waiting for changes in DocGen...
ko.bindingHandlers.dxAction = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var $element = $(element);

        var unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
            actionSource = unwrappedValue,
            actionOptions = { context: element };

        if(unwrappedValue.execute) {
            actionSource = unwrappedValue.execute;
            extend(actionOptions, unwrappedValue);
        }

        var action = new Action(actionSource, actionOptions);

        $element
            .off(".dxActionBinding")
            .on(clickEvent.name + ".dxActionBinding", function(e) {
                action.execute({
                    element: $element,
                    model: viewModel,
                    evaluate: function(expression) {
                        var context = viewModel;
                        if(expression.length > 0 && expression[0] === "$") {
                            context = ko.contextFor(element);
                        }
                        var getter = compileGetter(expression);
                        return getter(context);
                    },
                    jQueryEvent: e
                });

                if(!actionOptions.bubbling) {
                    e.stopPropagation();
                }
            });
    }
};

ko.bindingHandlers.dxControlsDescendantBindings = {
    init: function(_, valueAccessor) {
        return {
            controlsDescendantBindings: ko.unwrap(valueAccessor())
        };
    }
};

ko.bindingHandlers.dxPolymorphWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var widgetName = ko.utils.unwrapObservable(valueAccessor()).name;
        if(!widgetName) {
            return;
        }

        ko.virtualElements.emptyNode(element);

        if(widgetName === "button" || widgetName === "tabs" || widgetName === "dropDownMenu") {
            var deprecatedName = widgetName;
            widgetName = inflector.camelize("dx-" + widgetName);
            errors.log("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead");
        }

        var markup = $("<div data-bind=\"" + widgetName + ": options\">").get(0);
        ko.virtualElements.prepend(element, markup);
        var innerBindingContext = bindingContext.extend(valueAccessor);
        ko.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.dxPolymorphWidget = true;

ko.bindingHandlers.dxIcon = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    },
    update: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    }
};
ko.virtualElements.allowedBindings.dxIcon = true;
