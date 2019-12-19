(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require('integration/jquery'),
            require('ui/button');
            require('ui/form');
            require('ui/popup');
            require('ui/select_box');
            require('ui/text_box');
            require('ui/validator');
            require('ui/validation_summary');

            var aspnet = require('aspnet');
            window.DevExpress = { aspnet: aspnet }; // for DevExpress.aspnet.createComponent in templates

            module.exports = factory(
                require('jquery'),
                require('ui/set_template_engine'),
                aspnet,
                function() { return require('ui/widget/ui.errors'); }
            );
        });
    } else {
        factory(
            window.jQuery,
            DevExpress.ui.setTemplateEngine,
            DevExpress.aspnet,
            function() { return window.DevExpress_ui_widget_errors; }
        );
    }
}(function($, setTemplateEngine, aspnet, errorsAccessor) {

    if(QUnit.urlParams['nojquery']) {
        return;
    }

    QUnit.module(
        'Client Validation',
        {
            beforeEach: function() {
                $('#qunit-fixture').html('<div id=\'editor\'></div><div id=\'editor2\'></div><div id=\'summary\'></div>');
            }
        },
        function() {
            QUnit.test('Get comparison target value', function(assert) {
                $('#editor').dxTextBox({
                    value: 'testMVC',
                    name: 'FullName'
                });

                assert.equal(aspnet.getEditorValue('FullName'), 'testMVC', 'value of editor');
            });

            QUnit.test('Create validationSummary items', function(assert) {
                var validationGroup = 'test-group';

                $('#editor')
                    .dxTextBox({
                        name: 'FullName',
                        validationError: {
                            message: 'Server exception'
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $('#summary').dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems(validationGroup, ['FullName']);

                var summary = $('#summary').dxValidationSummary('instance'),
                    item = summary.option('items')[0],
                    editor = item.validator.$element().dxTextBox('instance');

                assert.equal(summary.option('items').length, 1, 'item count is OK');
                assert.equal(item.text, 'Server exception', 'text of first item is OK');
                assert.equal(editor.option('name'), 'FullName', 'validator is OK');
            });

            QUnit.test('Create validationSummary items for different validationGroup', function(assert) {
                var validationGroup = 'custom-group';

                $('#editor')
                    .dxTextBox({
                        name: 'FullName',
                        validationError: {
                            message: 'Server exception'
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $('#summary').dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems('custom-group-2', ['FullName']);

                var summary = $('#summary').dxValidationSummary('instance');

                assert.notOk(summary.option('items').length, 'items not found');
            });

            QUnit.test('Create validationSummary items only for editor with related option name', function(assert) {
                var validationGroup = 'test-group';

                $('#editor')
                    .dxTextBox({
                        name: 'FullName',
                        validationError: {
                            message: 'Server exception'
                        }
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $('#editor2')
                    .dxTextBox({
                        name: 'City'
                    })
                    .dxValidator({
                        validationGroup: validationGroup
                    });

                $('#summary').dxValidationSummary({
                    validationGroup: validationGroup
                });

                aspnet.createValidationSummaryItems(validationGroup, ['FullName']);

                var summary = $('#summary').dxValidationSummary('instance'),
                    item = summary.option('items')[0];

                assert.equal(summary.option('items').length, 1, 'item length is OK');
                assert.equal(item.text, 'Server exception', 'text of first item is OK');
            });
        }
    );

    QUnit.module(
        'Render component',
        {
            beforeEach: function() {
                $('#qunit-fixture').html(
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

                aspnet.setTemplateEngine();
            },
            afterEach: function() {
                setTemplateEngine('default');
            }
        },
        function() {

            function renderTemplate(templateId) {
                $('#button').dxButton({
                    template: $(templateId)
                });

                return $('#templateContent').children();
            }

            QUnit.test('Create component', function(assert) {
                var $result = renderTemplate('#templateWithCreateComponent');
                assert.ok($result.is('.dx-button'));
            });

            QUnit.test('Component element rendering', function(assert) {
                var $result = renderTemplate('#simpleTemplate');
                assert.ok($result.is('div[id|=dx]'));
            });

            QUnit.test('Component rendering', function(assert) {
                var $result = renderTemplate('#simpleTemplate');
                assert.ok($result.is('.dx-button'));
            });

            QUnit.test('Component rendering with options', function(assert) {
                var $result = renderTemplate('#templateWithOptions');
                assert.equal($result.dxButton('option', 'text'), 'text');
            });

            QUnit.test('Component element rendering with custom ID', function(assert) {
                var $result = renderTemplate('#templateWithID');
                assert.ok($result.is('#test-id'));
            });

            QUnit.test('Component element rendering with validator', function(assert) {
                var $result = renderTemplate('#templateWithValidator');
                assert.equal($result.dxValidator('option', 'validationGroup'), 'my-group');
            });

            QUnit.test('Exotic characters in component ID should be escaped (T531137)', function(assert) {
                var $result = renderTemplate('#templateWithExoticId');
                assert.ok($result.dxButton('instance'));
            });

            QUnit.test('Inner template is rendered correctly when another script tags exist', function(assert) {
                var $buttonElement = $('#buttonWithInnerTemplate').dxButton();
                $buttonElement.find('script').remove();
                assert.equal($buttonElement.text(), 'BUTTON_CONTENT');
            });
        }
    );

    QUnit.module('Template engine', {
        beforeEach: function() {
            $('#qunit-fixture').html(
                '<div id="button"></div>\
                <script id="simpleTemplate" type="text/html"></script>'
            );
            aspnet.setTemplateEngine();
        },
        afterEach: function() {
            setTemplateEngine('default');
        }
    }, function() {
        var testTemplate = function(name, templateSource, expected, enableAlternateTemplateTags) {
            QUnit.test(name, function(assert) {
                var $template = $('#simpleTemplate');

                $template.text(templateSource);

                aspnet.enableAlternateTemplateTags(enableAlternateTemplateTags !== false);
                try {
                    $('#button').dxButton({
                        text: 'Test button',
                        template: $template
                    });
                } finally {
                    aspnet.enableAlternateTemplateTags(true);
                }

                assert.equal($('.dx-button-content').text(), expected);
            });
        };

        testTemplate('Echo constant',
            'a <%= \'b\' %> c',
            'a b c'
        );

        testTemplate('Echo variable',
            '[<%= text %>]',
            '[Test button]'
        );

        testTemplate('Multiple blocks',
            '[<%= 1 %>][<%= 2 %>][<%= 3 %>]',
            '[1][2][3]'
        );

        testTemplate('Evaluate',
            '<% text %>',
            ''
        );

        testTemplate('Evalute expr w/ semicolon',
            '<% text %>abc',
            'abc'
        );

        testTemplate('For loop',
            '<% for(var i = 0; i < 5; i++) { %><%= i %><% } %>',
            '01234'
        );

        testTemplate('Text escaping',
            '\'"\\\n',
            '\'"\\\n'
        );

        testTemplate('Html encode: inline',
            '<%- \'<img />\' %>',
            '<img />'
        );

        testTemplate('Html encode: stored in variable',
            '<% var a = \'<script>alert(1)</script>\'; %><%- a %>',
            '<script>alert(1)</script>'
        );

        QUnit.module('Alternate syntax (T831170)', function() {
            testTemplate('enabled', 'a [%= \'b\' %] c', 'a b c');
            testTemplate('disabled', '[%= 123 %]', '[%= 123 %]', false);
        });
    });

    QUnit.test('Transcluded content (T691770, T693379)', function(assert) {
        aspnet.setTemplateEngine();
        try {
            window.testCounters = {
                innerEval: 0,
                innerClick: 0
            };

            $('#qunit-fixture').html('\
                <div id=test-button>\
                    <div id=test-button-inner></div>\
                    <script>\
                        testCounters.innerEval++;\
                        $(\'#test-button-inner\')\
                            .append(\'test-button-inner-text\')\
                            .click(function() {\
                                testCounters.innerClick++;\
                            });\
                    </script>\
                </div>\
            ');

            $('#test-button').dxButton();
            $('#test-button-inner').trigger('click');

            assert.equal(window.testCounters.innerEval, 1);
            assert.equal(window.testCounters.innerClick, 1);
            assert.equal($('#test-button-inner').html(), 'test-button-inner-text');
        } finally {
            setTemplateEngine('default');
            delete window.testCounters;
        }
    });

    QUnit.test('T744904 - MVCx extension in template', function(assert) {
        aspnet.setTemplateEngine();
        window['MVCx'] = { };
        try {
            $('#qunit-fixture').html(
                '<div id="test-widget"></div>' +
                '<script id="test-template" type="text/html">' +
                '  <script id="dxss_123456789" type="text/javascript"></<% %>script>' +
                '</script>'
            );

            var widgetElement = $('#test-widget');
            widgetElement.dxButton({
                template: $('#test-template')
            });

            assert.ok(widgetElement.html().indexOf('dxss_') < 0);

            window['MVCx'].isDXScriptInitializedOnLoad = true;
            widgetElement.dxButton('instance').repaint();
            assert.ok(widgetElement.html().indexOf('dxss_') > -1);
        } finally {
            setTemplateEngine('default');
            delete window['MVCx'];
        }
    });

    QUnit.test('T758209', function(assert) {
        aspnet.setTemplateEngine();

        var errors = errorsAccessor();
        sinon.spy(errors, 'log');

        try {
            var formID = 'bd859c15-674f-49bf-a6d0-9368508e8d11';
            var textBoxID = '682b4545-09d9-4f63-82ed-91570d869eb6';

            window.__createForm = function() {
                var config = {
                    formData: { testField: 'testValue' },
                    items: [
                        {
                            dataField: 'testField',
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                items: [ 'testValue' ],
                                fieldTemplate: $('#popup1_form_fieldTempalte')
                            }
                        }
                    ]
                };
                DevExpress.aspnet.createComponent('dxForm', config, formID);
            };

            window.__createTextBox = function(obj) {
                DevExpress.aspnet.createComponent('dxTextBox', { value: obj + ' in template' }, textBoxID);
            };


            $('#qunit-fixture').html(
                '<div id="popup1">' +
                '</div>' +

                '<script id="popup1_contentTemplate" type="text/html">' +
                '  <div id=' + formID + '></div>' +
                '  <% __createForm() %>' +
                '</script>' +

                '<script id="popup1_form_fieldTempalte" type="text/html">' +
                '  <div id=' + textBoxID + '></div>' +
                '  <% __createTextBox(obj) %>' +
                '</script>'
            );

            $('#popup1').dxPopup({
                contentTemplate: $('#popup1_contentTemplate'),
                visible: true
            });

            errors.log.args.forEach(function(a) {
                if(a[0] === 'E1035') {
                    throw 'E1035 is found in the log';
                }
            });

            assert.equal(
                $('#' + textBoxID).dxTextBox('instance').option('value'),
                'testValue in template'
            );

        } finally {
            setTemplateEngine('default');
            delete window.__createForm;
            delete window.__createTextBox;
        }
    });

    QUnit.test('T810336', function(assert) {
        aspnet.setTemplateEngine();

        window.__createButton = function(buttonID) {
            DevExpress.aspnet.createComponent('dxButton', { text: buttonID }, buttonID);
        };

        try {
            $('#qunit-fixture').html(
                '<div id="popup1"></div>' +
                '<script id="popup1_contentTemplate" type="text/html">' +
                '  <div id="b1"></div><% __createButton("b1") %>' +
                '  <div id="b2"></div><% __createButton("b2") %>' +
                '</script>'
            );

            $('#popup1').dxPopup({
                contentTemplate: $('#popup1_contentTemplate'),
                visible: true
            });

            assert.ok($('#b1').dxButton('instance'));
            assert.ok($('#b2').dxButton('instance'));

        } finally {
            setTemplateEngine('default');
            delete window.__createButton;
        }
    });

    QUnit.test('T836885', function(assert) {
        aspnet.setTemplateEngine();

        try {
            $('#qunit-fixture').html(
                '<div id=list1></div>' +
                '<script id="list1_itemTemplate" type="text/html">' +
                '  <div id="<%= key %>"></div><% DevExpress.aspnet.createComponent("dxTextBox", { }, key) %>' +
                '</script>'
            );

            // Per https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute
            // "IDs can consist of just digits"
            var NUMERIC_ID = 20191205;

            $('#list1').dxList({
                items: [ { key: NUMERIC_ID } ],
                itemTemplate: $('#list1_itemTemplate')
            });

            assert.ok($('#' + NUMERIC_ID).dxTextBox('instance'));
        } finally {
            setTemplateEngine('default');
        }
    });

}));
