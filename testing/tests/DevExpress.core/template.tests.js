import $ from 'jquery';
import { TemplateBase, renderedCallbacks as templateRendered } from 'core/templates/template_base';

QUnit.module('designer integration');

QUnit.test('template should receive dxshown event when attached to container', function(assert) {
    assert.expect(1);

    var $template = $('<div>').text('test');

    var templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    var template = new templateClass();

    var patcher = function($markup) {
        $markup.text('text');
    };

    templateRendered.add(patcher);

    var $container = $('<div>').appendTo('#qunit-fixture');
    template.render({
        model: {},
        container: $container
    });

    assert.equal($.trim($container.text()), 'text', 'template result was patched');

    templateRendered.remove(patcher);
});


QUnit.module('DevExtreme.AspNet.MVC wrappers integration');

QUnit.test('templateRendered callbacks should be fired after template appended to container', function(assert) {
    var $template = $('<div>').text('test');

    var templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    var template = new templateClass();

    var callback = function(element, container) {
        assert.ok(container.find(element).length);
    };

    templateRendered.add(callback);

    var $container = $('<div>').appendTo('#qunit-fixture');
    template.render({
        model: {},
        container: $container
    });

    templateRendered.remove(callback);
});

QUnit.test('templateRendered callbacks should be fired before template.onRendered', function(assert) {
    assert.expect(1);

    const $template = $('<div>').text('test');
    const templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    const template = new templateClass();
    let isChildCallbackCalled = false;

    const childCallback = () => {
        isChildCallbackCalled = true;
        templateRendered.remove(childCallback);
    };

    const parentCallback = () => {
        templateRendered.add(childCallback);
        templateRendered.remove(parentCallback);

        template.render({
            model: {},
            container: $child,
            onRendered: function() {
                assert.ok(isChildCallbackCalled, 'templateRendered callback should called before \'onRendered\'');
            }
        });
    };

    templateRendered.add(parentCallback);

    const $parent = $('<div>').appendTo('#qunit-fixture');
    const $child = $('<div>').appendTo($parent);

    template.render({
        model: {},
        container: $parent
    });
});


QUnit.module('showing');

var VISIBILITY_CHANGE_HANDLER_CLASS = 'dx-visibility-change-handler',
    SHOWN_EVENT_NAME = 'dxshown';

QUnit.test('template should receive dxshown event when attached to container', function(assert) {
    assert.expect(1);

    var $template = $('<div>')
        .addClass(VISIBILITY_CHANGE_HANDLER_CLASS)
        .on(SHOWN_EVENT_NAME, function() {
            assert.ok(true, 'shown received');
        });

    var templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    var template = new templateClass();

    var $container = $('<div>').appendTo('#qunit-fixture');
    template.render({
        model: {},
        container: $container
    });
});

QUnit.test('template should not receive dxshown event if already attached to container', function(assert) {
    assert.expect(0);

    var $template = $('<div>')
        .addClass(VISIBILITY_CHANGE_HANDLER_CLASS)
        .on(SHOWN_EVENT_NAME, function() {
            assert.ok(false, 'shown received');
        });

    var templateClass = class extends TemplateBase {
        _renderCore(_, __, $container) {
            return $template.appendTo($container);
        }
    };
    var template = new templateClass();

    var $container = $('<div>').appendTo('#qunit-fixture');
    template.render({
        model: {},
        container: $container
    });
});

QUnit.test('template should not receive dxshown event when not attached to container', function(assert) {
    assert.expect(0);

    var $template = $('<div>')
        .addClass(VISIBILITY_CHANGE_HANDLER_CLASS)
        .on(SHOWN_EVENT_NAME, function() {
            assert.ok(false, 'shown received');
        });

    var templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    var template = new templateClass();

    template.render({
        model: {}
    });
});

QUnit.test('template should not receive dxshown event when attached to detached container', function(assert) {
    assert.expect(0);

    var $template = $('<div>')
        .addClass(VISIBILITY_CHANGE_HANDLER_CLASS)
        .on(SHOWN_EVENT_NAME, function() {
            assert.ok(false, 'shown received');
        });

    var templateClass = class extends TemplateBase {
        _renderCore() {
            return $template;
        }
    };
    var template = new templateClass();

    var $container = $('<div>');
    template.render({
        model: {},
        container: $container
    });
});

QUnit.test('template should call onRendered method', function(assert) {
    var renderCoreHandler = sinon.spy(),
        onRenderedHandler = sinon.spy(),
        TestTemplate = class extends TemplateBase {
            _renderCore() {
                return renderCoreHandler.apply(this, arguments);
            }
        },
        template = new TestTemplate();

    template.render({ onRendered: onRenderedHandler });

    assert.strictEqual(renderCoreHandler.getCall(0).args[0].onRendered, undefined, 'onRendered has been removed on first call');
    assert.equal(onRenderedHandler.callCount, 1, 'onRendered has been called once');
});
