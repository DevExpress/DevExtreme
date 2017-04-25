"use strict";

(function(factory) {
    /* global define, DevExpress */
    if(typeof define === "function" && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("./ui/set_template_engine"),
                require("./ui/widget/ui.template_base").renderedCallbacks,
                require("./core/guid")
            );
        });
    } else {
        var ui = DevExpress.ui;

        DevExpress.aspnet = factory(
            window.jQuery,
            ui && ui.setTemplateEngine,
            ui && ui.templateRendered,
            DevExpress.data.Guid
        );
    }
})(function($, setTemplateEngine, templateRendered, Guid) {
    var templateCompiler = createTemplateCompiler();

    function createTemplateCompiler() {
        var OPEN_TAG = "<%",
            CLOSE_TAG = "%>",
            ENCODE_QUALIFIER = "-",
            INTERPOLATE_QUALIFIER = "=";

        function encodeHtml(value) {
            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        }

        function acceptText(bag, text) {
            if(text) {
                bag.push("_.push(", JSON.stringify(text), ");");
            }
        }

        function acceptCode(bag, code) {
            var encode = code.charAt(0) === ENCODE_QUALIFIER,
                value = code.substr(1),
                interpolate = code.charAt(0) === INTERPOLATE_QUALIFIER;

            if(encode || interpolate) {
                bag.push("_.push(");
                bag.push(encode ? encodeHtml(value) : value);
                bag.push(");");
            } else {
                bag.push(code);
            }
        }

        return function(text) {
            // jshint evil:true

            var bag = ["var _ = [];", "with(obj||{}) {"],
                chunks = text.split(OPEN_TAG);

            acceptText(bag, chunks.shift());

            for(var i = 0; i < chunks.length; i++) {
                var tmp = chunks[i].split(CLOSE_TAG);
                if(tmp.length !== 2) {
                    throw "Template syntax error";
                }
                acceptCode(bag, tmp[0]);
                acceptText(bag, tmp[1]);
            }

            bag.push("};", "return _.join('')");

            return new Function("obj", bag.join(''));
        };
    }

    function createTemplateEngine() {

        function outerHtml(element) {
            element = $(element);

            var templateTag = element.length && element[0].nodeName.toLowerCase();
            if(templateTag === "script") {
                return element.html();
            } else {
                element = $("<div>").append(element);
                return element.html();
            }
        }

        return {
            compile: function(element) {
                return templateCompiler(outerHtml(element));
            },
            render: function(template, data) {
                return template(data);
            }
        };
    }

    return {
        renderComponent: function(name, options, id, validatorOptions) {
            id = id || ("dx-" + new Guid());

            var render = function(_, container) {
                var $component = $("#" + id, container)[name](options);
                if($.isPlainObject(validatorOptions)) {
                    $component.dxValidator(validatorOptions);
                }
                templateRendered.remove(render);
            };

            templateRendered.add(render);

            return "<div id=\"" + id + "\"></div>";
        },

        getEditorValue: function(inputName) {
            var $widget = $("input[name='" + inputName + "']").closest(".dx-widget");
            if($widget.length) {
                var dxComponents = $widget.data("dxComponents"),
                    widget = $widget.data(dxComponents[0]);

                if(widget) {
                    return widget.option("value");
                }
            }
        },

        setTemplateEngine: function() {
            setTemplateEngine(createTemplateEngine());
        }
    };
});
