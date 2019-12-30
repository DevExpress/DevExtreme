SystemJS.config({
    map: {
        'jqueryify': SystemJS.map.jquery
    }
});

define(function(require) {
    const $ = require('jquery');
    const Template = require('core/templates/template').Template;
    const setTemplateEngine = require('core/templates/template_engine_registry').setTemplateEngine;
    const errors = require('core/errors');

    window.Handlebars = require('../../../node_modules/handlebars/dist/handlebars.min.js');
    window.Hogan = require('../../../node_modules/hogan.js/dist/hogan-3.0.2.js');
    require('../../../node_modules/jquery.tmpl/index.js');
    require('../../../node_modules/jsrender/jsrender.min.js');
    window.Mustache = require('../../../node_modules/mustache/mustache.min.js');
    window._ = require('../../../node_modules/underscore/underscore-min.js');

    QUnit.module('custom template rendering', {
        beforeEach: function() {
            this.originalLog = errors.log;
        },
        afterEach: function() {
            errors.log = this.originalLog;
        }
    });

    const createMarkup = function(content, tag) {
        return $('<' + tag + '>').html(content);
    };

    const renderTemplate = function(engine, element, data, assert) {
        setTemplateEngine(engine);
        const template = new Template(element);
        const container = $('<div>');

        const result = template.render({ model: data, container: container });

        assert.notEqual(typeof result, 'string', 'correct result type');

        return container;
    };

    const checkTemplateEngine = function(engine, string, assert) {
        let log;
        errors.log = function() {
            log.push($.makeArray(arguments));
        };

        // empty
        log = [];
        renderTemplate(engine, $(), { text: '123' }, assert);
        assert.equal(log.length, 0);

        // script
        log = [];
        errors.log = function() {
            log.push($.makeArray(arguments));
        };
        const container = renderTemplate(engine, createMarkup(string, 'script type="text/html"'), { text: '123' }, assert);
        assert.equal(container.text(), '123');
        assert.equal(log.length, 0);
    };

    QUnit.module('predefined templates');

    QUnit.test('jquery-tmpl', function(assert) {
        checkTemplateEngine('jquery-tmpl', '${text}', assert);
    });

    QUnit.test('jsrender', function(assert) {
        checkTemplateEngine('jsrender', '{{:text}}', assert);
    });

    QUnit.test('mustache', function(assert) {
        checkTemplateEngine('mustache', '{{text}}', assert);
    });

    QUnit.test('hogan', function(assert) {
        checkTemplateEngine('hogan', '{{text}}', assert);
    });

    QUnit.test('underscore', function(assert) {
        checkTemplateEngine('underscore', '<%=text%>', assert);
    });

    QUnit.test('handlebars', function(assert) {
        checkTemplateEngine('handlebars', '{{text}}', assert);
    });

    QUnit.module('user template engine');

    const customUserTemplate = {
        compile: function(element) {
            element = $(element);
            if(element[0].nodeName.toLowerCase() !== 'script') {
                element = $('<div>').append(element);
            }

            const text = element.html();

            return text.split('$');
        },
        render: function(template, data, index) {
            let i;
            const result = template.slice(0);
            for(i = 0; i < template.length; i++) {
                if(template[i] in data) {
                    result[i] = data[template[i]];
                }
                if(template[i] === '@index') {
                    result[i] = index;
                }
            }
            return result.join('');
        }
    };

    QUnit.test('custom user template engine for div template', function(assert) {
        setTemplateEngine(customUserTemplate);

        const template = new Template($('<div>$text$</div>'));
        const container = $('<div>');

        // act
        template.render({ model: { text: 123 }, container: container });

        // assert
        assert.equal(container.children().length, 1);
        assert.equal(container.children().text(), '123');
    });

    QUnit.test('custom user template engine for script template', function(assert) {
        setTemplateEngine(customUserTemplate);

        const template = new Template($('<script type=\'text/html\'>Text: <b>$text$</b></script>'));
        const container = $('<div>');

        // act
        template.render({ model: { text: 123 }, container: container });

        // assert
        assert.equal(container.children('b').length, 1);
        assert.equal(container.text().replace('\r\n', ''), 'Text: 123');
    });

    QUnit.test('custom user template engine has access to item index', function(assert) {
        setTemplateEngine(customUserTemplate);

        const template = new Template($('<div>$text$, ($@index$)</div>'));
        const container = $('<div>');

        // act
        template.render({ model: { text: 123 }, container: container, index: 1 });

        // assert
        assert.equal(container.children().text(), '123, (1)');
    });

    QUnit.test('removing div template from document on creation', function(assert) {
        setTemplateEngine(customUserTemplate);

        const template = new Template($('<div>$text$</div>'));
        const container = $('<div>');

        // act
        template.render({ model: { text: 123 }, container: container });

        // assert
        assert.equal(container.children().length, 1);
        assert.equal(container.children().text(), '123');
    });

    QUnit.test('template render result', function(assert) {
        // act
        setTemplateEngine(customUserTemplate);

        const template = new Template($('<div>$text$</div>'));
        const container = $('<div>');

        // act
        let result = template.render({ model: { text: 123 }, container: container });

        result = $(result);

        // assert
        assert.equal(result.length, 1);
        assert.equal(result[0].tagName.toLowerCase(), 'div');
        assert.equal(result.text(), '123');
    });


    QUnit.module('default template engine', {
        beforeEach: function() {
            setTemplateEngine('default');
        }
    });

    QUnit.test('default template engine should clone element', function(assert) {
        const $element = $('<div>123</div>');
        const template = new Template($element);
        const $result = template.render({ model: null, container: $('<div>') });

        assert.notEqual($result[0], $element[0]);
    });

    QUnit.test('default template engine should preserve element for transcluded templates', function(assert) {
        const $element = $('<div>123</div>');
        const template = new Template($element);
        const $result = template.render({ model: null, container: $('<div>'), transclude: true });

        assert.equal($result[0], $element[0]);
    });
});
