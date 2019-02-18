(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require("integration/jquery"),
            require("ui/validator");
            require("ui/validation_summary");
            require("ui/text_box");
            require("ui/button");

            module.exports = factory(
                require("jquery"),
                require("ui/set_template_engine"),
                require("aspnet")
            );
        });
    } else {
        factory(
            window.jQuery,
            DevExpress.ui.setTemplateEngine,
            DevExpress.aspnet
        );
    }
}(function($, setTemplateEngine, aspnet) {

    if(QUnit.urlParams["nojquery"]) {
        return;
    }

    QUnit.module(
        "Client Validation",
        {
            beforeEach: function() {
                $("#qunit-fixture").html("<div id='editor'></div><div id='editor2'></div><div id='summary'></div>");
            }
        },
        function() {
            QUnit.test("Get comparison target value", function(assert) {
                $("#editor").dxTextBox({
                    value: "testMVC",
                    name: "FullName"
                });

                assert.equal(aspnet.getEditorValue("FullName"), "testMVC", "value of editor");
            });

            QUnit.test("Create validationSummary items", function(assert) {
                var validationGroup = "test-group";

                $("#editor")
                    .dxTextBox({
                        name: "FullName",
                        validationError: {
                            message: "Server exception"
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $("#summary").dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems(validationGroup, ["FullName"]);

                var summary = $("#summary").dxValidationSummary("instance"),
                    item = summary.option("items")[0],
                    editor = item.validator.$element().dxTextBox("instance");

                assert.equal(summary.option("items").length, 1, "item count is OK");
                assert.equal(item.text, "Server exception", "text of first item is OK");
                assert.equal(editor.option("name"), "FullName", "validator is OK");
            });

            QUnit.test("Create validationSummary items for different validationGroup", function(assert) {
                var validationGroup = "custom-group";

                $("#editor")
                    .dxTextBox({
                        name: "FullName",
                        validationError: {
                            message: "Server exception"
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $("#summary").dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems("custom-group-2", ["FullName"]);

                var summary = $("#summary").dxValidationSummary("instance");

                assert.notOk(summary.option("items").length, "items not found");
            });

            QUnit.test("Create validationSummary items only for editor with related option name", function(assert) {
                var validationGroup = "test-group";

                $("#editor")
                    .dxTextBox({
                        name: "FullName",
                        validationError: {
                            message: "Server exception"
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $("#editor2")
                    .dxTextBox({
                        name: "City"
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $("#summary").dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems(validationGroup, ["FullName"]);

                var summary = $("#summary").dxValidationSummary("instance"),
                    item = summary.option("items")[0];

                assert.equal(summary.option("items").length, 1, "item length is OK");
                assert.equal(item.text, "Server exception", "text of first item is OK");
            });
        }
    );

    QUnit.module(
        "Render component",
        {
            beforeEach: function() {
                $("#qunit-fixture").html(
                    '<div id="button"></div>\
                    \
                    <script id="templateWithCreateComponent" type="text/html">\
                    <div id="templateContent">\
                        <div id="inner-button"></div>\
                        <% DevExpress.aspnet.createComponent("dxButton", { text: "text" }, "inner-button"); %>\
                    </div>\
                    </script>\
                    <script id="simpleTemplate" type="text/html">\
                    <div id="templateContent">\
                        <%= DevExpress.aspnet.renderComponent("dxButton") %>\
                    </div>\
                    </script>\
                    \
                    <script id="templateWithOptions" type="text/html">\
                    <div id="templateContent">\
                        <%= DevExpress.aspnet.renderComponent("dxButton", { text: "text" }) %>\
                    </div>\
                    </script>\
                    \
                    <script id="templateWithID" type="text/html">\
                    <div id="templateContent">\
                        <%= DevExpress.aspnet.renderComponent("dxButton", { }, "test-id") %>\
                    </div>\
                    </script>\
                    \
                    <script id="templateWithExoticId" type="text/html">\
                    <div id="templateContent">\
                        <%= DevExpress.aspnet.renderComponent("dxButton", { }, "id-_1α♠!#$%&()*+,./:;<=>?@[\\\\]^`{|}~") %>\
                    </div>\
                    </script>\
                    \
                    <script id="templateWithValidator" type="text/html">\
                    <div id="templateContent">\
                        <%= DevExpress.aspnet.renderComponent("dxTextBox", { }, "test-id", { validationGroup: "my-group" }) %>\
                    </div>\
                    </script>\
                    \
                    <div id="buttonWithInnerTemplate"><script>// DevExpress.aspnet.setTemplateEngine();</script>BUTTON_CONTENT</div>'
                );

                if(!window.DevExpress || !window.DevExpress.aspnet) {
                    // modular scenario: DevExpress.aspnet object must be exported manually or from a bundle
                    window.DevExpress = { aspnet: aspnet };
                }

                aspnet.setTemplateEngine();
            },
            afterEach: function() {
                delete window.DevExpress;
                setTemplateEngine("default");
            }
        },
        function() {

            function renderTemplate(templateId) {
                $("#button").dxButton({
                    template: $(templateId)
                });

                return $("#templateContent").children();
            }

            QUnit.test("Create component", function(assert) {
                var $result = renderTemplate("#templateWithCreateComponent");
                assert.ok($result.is(".dx-button"));
            });

            QUnit.test("Component element rendering", function(assert) {
                var $result = renderTemplate("#simpleTemplate");
                assert.ok($result.is("div[id|=dx]"));
            });

            QUnit.test("Component rendering", function(assert) {
                var $result = renderTemplate("#simpleTemplate");
                assert.ok($result.is(".dx-button"));
            });

            QUnit.test("Component rendering with options", function(assert) {
                var $result = renderTemplate("#templateWithOptions");
                assert.equal($result.dxButton("option", "text"), "text");
            });

            QUnit.test("Component element rendering with custom ID", function(assert) {
                var $result = renderTemplate("#templateWithID");
                assert.ok($result.is("#test-id"));
            });

            QUnit.test("Component element rendering with validator", function(assert) {
                var $result = renderTemplate("#templateWithValidator");
                assert.equal($result.dxValidator("option", "validationGroup"), "my-group");
            });

            QUnit.test("Exotic characters in component ID should be escaped (T531137)", function(assert) {
                var $result = renderTemplate("#templateWithExoticId");
                assert.ok($result.dxButton("instance"));
            });

            QUnit.test("Inner template is rendered correctly when another script tags exist", function(assert) {
                var $buttonElement = $("#buttonWithInnerTemplate").dxButton();
                $buttonElement.find("script").remove();
                assert.equal($buttonElement.text(), "BUTTON_CONTENT");
            });
        }
    );

    QUnit.module("Template engine", {
        beforeEach: function() {
            $("#qunit-fixture").html(
                '<div id="button"></div>\
                <script id="simpleTemplate" type="text/html"></script>'
            );
            aspnet.setTemplateEngine();
        },
        afterEach: function() {
            setTemplateEngine("default");
        }
    }, function() {
        var testTemplate = function(name, templateSource, expected) {
            QUnit.test(name, function(assert) {
                var $template = $("#simpleTemplate");

                $template.text(templateSource);
                $("#button").dxButton({
                    text: "Test button",
                    template: $template
                });

                assert.equal($(".dx-button-content").text(), expected);
            });
        };

        testTemplate("Echo constant",
            "a <%= 'b' %> c",
            "a b c"
        );

        testTemplate("Echo variable",
            "[<%= text %>]",
            "[Test button]"
        );

        testTemplate("Multiple blocks",
            "[<%= 1 %>][<%= 2 %>][<%= 3 %>]",
            "[1][2][3]"
        );

        testTemplate("Evaluate",
            "<% text %>",
            ""
        );

        testTemplate("Evalute expr w/ semicolon",
            "<% text %>abc",
            "abc"
        );

        testTemplate("For loop",
            "<% for(var i = 0; i < 5; i++) { %><%= i %><% } %>",
            "01234"
        );

        testTemplate("Text escaping",
            "'\"\\\n",
            "'\"\\\n"
        );

        testTemplate("Html encode: inline",
            "<%- '<img />' %>",
            "<img />"
        );

        testTemplate("Html encode: stored in variable",
            "<% var a = '<script>alert(1)</script>'; %><%- a %>",
            "<script>alert(1)</script>"
        );
    });

    QUnit.test("Transcluded content (T691770, T693379)", function(assert) {
        aspnet.setTemplateEngine();
        try {
            window.testCounters = {
                innerEval: 0,
                innerClick: 0
            };

            $("#qunit-fixture").html("\
                <div id=test-button>\
                    <div id=test-button-inner></div>\
                    <script>\
                        testCounters.innerEval++;\
                        $('#test-button-inner')\
                            .append('test-button-inner-text')\
                            .click(function() {\
                                testCounters.innerClick++;\
                            });\
                    </script>\
                </div>\
            ");

            $("#test-button").dxButton();
            $("#test-button-inner").trigger("click");

            assert.equal(window.testCounters.innerEval, 1);
            assert.equal(window.testCounters.innerClick, 1);
            assert.equal($("#test-button-inner").html(), "test-button-inner-text");
        } finally {
            setTemplateEngine("default");
            delete window.testCounters;
        }
    });

}));
