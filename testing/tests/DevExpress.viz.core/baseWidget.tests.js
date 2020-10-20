/* global currentTest */

const $ = require('jquery');
const renderer = require('core/renderer');
const version = require('core/version');
const resizeCallbacks = require('core/utils/resize_callbacks');
const registerComponent = require('core/component_registrator');
const logger = require('core/utils/console').logger;
const mock = require('../../helpers/mockModule.js').mock;
const errorsModule = require('viz/core/errors_warnings');
errorsModule.ERROR_MESSAGES = {
    W0001: '', // To prevent failure on reading "incidentOccurred" option in tests
    E100: 'Templated text 1: {0}, Templated text 2: {1}',
    W100: 'Warning: Templated text 1: {0}, Templated text 2: {1}'
};
mock('viz/core/errors_warnings', errorsModule);
// const errors = require('viz/core/errors_warnings');
const BaseWidget = require('viz/core/base_widget');
const DEBUG_createEventTrigger = require('viz/core/base_widget.utils').DEBUG_createEventTrigger;
const DEBUG_createResizeHandler = require('viz/core/base_widget.utils').DEBUG_createResizeHandler;
const BaseThemeManager = require('viz/core/base_theme_manager').BaseThemeManager;
const rendererModule = require('viz/core/renderers/renderer');
let dxBaseWidgetTester;
let StubThemeManager;
let StubTitle;
const vizMocks = require('../../helpers/vizMocks.js');
require('viz/core/base_widget');

// TODO: Move export tests to a separate file
require('viz/core/export');

QUnit.testStart(function() {
    const markup =
        '<div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.begin(function() {
    StubThemeManager = vizMocks.stubClass(BaseThemeManager);
    StubTitle = vizMocks.Title;
    dxBaseWidgetTester = BaseWidget.inherit({
        NAME: 'dxBaseWidgetTester',
        _rootClassPrefix: '_rootClassPrefix',
        _rootClass: '_rootClass',
        _eventsMap: $.extend({}, BaseWidget.prototype._eventsMap, {
            'onTestEvent': { name: 'testEvent' }
        }),
        _getAnimationOptions: vizMocks.environmentMethodInvoker('onGetAnimationOptions'),
        _initCore: vizMocks.environmentMethodInvoker('onInitCore'),
        _disposeCore: vizMocks.environmentMethodInvoker('onDisposeCore'),
        _getDefaultSize: vizMocks.environmentMethodInvoker('onGetDefaultSize'),
        _applySize: vizMocks.environmentMethodInvoker('onApplySize'),
        _clean: vizMocks.environmentMethodInvoker('onClean'),
        _render: vizMocks.environmentMethodInvoker('onRender'),
        _createThemeManager: vizMocks.environmentMethodInvoker('onCreateThemeManager'),
        // _handleThemeOptionsCore: vizMocks.environmentMethodInvoker("onHandleThemeOptionsCore")
    });

    registerComponent('dxBaseWidgetTester', dxBaseWidgetTester);

    sinon.stub(rendererModule, 'Renderer', function() {
        return currentTest().renderer;
    });

});

const environment = {
    beforeEach: function() {
        this.themeManager = new StubThemeManager();
        this.title = new StubTitle();
        this.loadingIndicator = new vizMocks.LoadingIndicator();
        this.clock = sinon.useFakeTimers();
        this.createContainer();
        this.renderer = new vizMocks.Renderer();
    },
    afterEach: function() {
        this.$container.remove();
        this.clock.restore();
    },
    tick: function(count) {
        this.clock.tick(count || 0);
    },
    createWidget: function(options) {
        this.widget = new dxBaseWidgetTester(this.$container, options);
        return this.widget;
    },
    onCreateThemeManager: function() {
        return currentTest().themeManager;
    },
    createContainer: function(styles) {
        this.$container = $('#container').css(styles || { width: 200, height: 150 });
    }
};

QUnit.module('Common', environment);

QUnit.test('Renderer creation', function(assert) {
    this.createWidget({ pathModified: 'pathModified-option' });

    assert.deepEqual(rendererModule.Renderer.lastCall.args, [{
        cssClass: '_rootClassPrefix _rootClass',
        pathModified: 'pathModified-option',
        container: this.$container[0]
    }], 'renderer is created');
    assert.deepEqual(this.renderer.root.enableLinks.lastCall.args, [], 'links are enabled');
    assert.deepEqual(this.renderer.root.virtualLink.getCall(0).args, ['core'], 'main');
    assert.deepEqual(this.renderer.root.virtualLink.getCall(1).args, ['peripheral'], 'peripheral');
    assert.deepEqual(this.renderer.root.linkAfter.getCall(0).args, ['core'], 'linkAfter is set');
    assert.deepEqual(this.renderer.root.linkAfter.getCall(1).args, [], 'linkAfter is reset');
});

QUnit.test('sizes of widget are float numbers', function(assert) {
    this.createWidget({
        size: {
            width: 100.3,
            height: 100.3
        }
    });

    assert.deepEqual(this.renderer.resize.lastCall.args, [100, 100]);
});

QUnit.test('Renderer destruction', function(assert) {
    this.createWidget();

    this.$container.remove();

    assert.deepEqual(this.renderer.dispose.lastCall.args, [], 'renderer is destroyed');
    assert.deepEqual(this.renderer.root.checkLinks.lastCall.args, [], 'links are checked');
});

QUnit.test('Theme manager creation', function(assert) {
    this.createWidget({
        theme: 'theme',
        rtlEnabled: 'rtl'
    });

    assert.strictEqual(typeof this.themeManager.setCallback.lastCall.args[0], 'function', 'callback');
    assert.deepEqual(this.themeManager.setTheme.lastCall.args, ['theme', 'rtl']);
});

QUnit.test('Theme manager destruction', function(assert) {
    this.createWidget();
    this.$container.remove();

    assert.deepEqual(this.themeManager.dispose.lastCall.args, []);
});

QUnit.test('Theme manager callback', function(assert) {
    this.onGetAnimationOptions = function() { return 'animation-option'; };
    // this.onHandleThemeOptionsCore = sinon.spy();
    this.createWidget({
        rtlEnabled: 'rtl-enabled-option',
        encodeHtml: 'encode-html-option'
    });
    this.renderer.lock.reset();
    this.renderer.unlock.reset();

    this.themeManager.setCallback.lastCall.args[0]();

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [{
        animation: 'animation-option',
        rtl: 'rtl-enabled-option',
        encodeHtml: 'encode-html-option'
    }], 'renderer animation options');

    // assert.deepEqual(this.onHandleThemeOptionsCore.lastCall.args, [], "theme options handled");
    // assert.ok(this.renderer.lock.firstCall.calledBefore(this.title.update.lastCall), "renderer is locked");
    // assert.ok(this.renderer.unlock.lastCall.calledAfter(this.onHandleThemeOptionsCore.lastCall), "renderer is unlocked")
});

// T190525
QUnit.test('Event is triggered from "_clean"', function(assert) {
    this.onClean = function() {
        this._eventTrigger('testEvent', {});
    };
    const callback = sinon.spy();
    this.createWidget({
        onTestEvent: callback
    });

    this.$container.remove();

    this.tick();
    assert.strictEqual(callback.callCount, 1, 'callback is called');
});

QUnit.test('T489065. Calls of begin/endUpdate during changes applying are safe', function(assert) {
    const callback = sinon.spy();
    this.createWidget({
        onTestEvent: function(e) {
            e.component.beginUpdate();
            e.component.endUpdate();
            callback();
        }
    });

    this.onApplySize = function() {
        this._eventTrigger('testEvent', {});
    };

    this.widget.option({
        size: {
            width: 1000
        }
    });

    assert.strictEqual(callback.callCount, 1, 'callback is called');
});

QUnit.module('Option changing - mechanism', environment);

QUnit.test('Handler is called once for all options', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_applyChanges');

    this.widget.option({
        encodeHtml: true,
        redrawOnResize: false
    });

    assert.strictEqual(spy.callCount, 1, 'call count');
});

QUnit.test('Handler is called on endUpdate', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_applyChanges');

    this.widget.beginUpdate();
    this.widget.option('title', {});

    assert.strictEqual(spy.lastCall, null, 'not called on option change');

    this.widget.option({
        tooltip: {}
    });
    this.widget.beginUpdate();
    this.widget.option({
        loadingIndicator: {}
    });
    this.widget.option('theme', 100);
    this.widget.endUpdate();

    assert.strictEqual(spy.lastCall, null, 'not called on `endUpdate` because of second `beginUpdate`');

    this.widget.endUpdate();

    assert.strictEqual(spy.callCount, 1, 'call count');
});

QUnit.test('Handler is not called if there are no changed options', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_applyChanges');

    this.widget.beginUpdate();
    this.widget.endUpdate();

    assert.strictEqual(spy.lastCall, null);
});

QUnit.test('Handler is called inside the renderer lock', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_applyChanges');

    this.widget.option('encodeHtml', false);

    assert.ok(this.renderer.lock.lastCall.calledBefore(spy.lastCall) && this.renderer.unlock.lastCall.calledAfter(spy.lastCall));
});

// T318992
QUnit.test('Another handler is called if option is changed inside the handler', function(assert) {
    this.createWidget();
    let lock = false;
    const spy = sinon.stub(this.widget, '_applyChanges', function(options) {
        if(!lock) {
            lock = true;
            this.option('rtlEnabled', 'rtl-enabled');
        } else {
            assert.deepEqual(this.option('rtlEnabled'), 'rtl-enabled', 'changed option');
        }
    });

    this.widget.option('encodeHtml', false);

    assert.strictEqual(spy.callCount, 2, 'call count');
});

// T920836
QUnit.test('Count the actual number of changes', function(assert) {
    const widget = this.createWidget();
    const counts = [];
    const spy = sinon.stub(widget, '_applyChanges', function() {
        counts.push(widget._changes.count());
    });

    widget.beginUpdate();
    widget.option('encodeHtml', false);
    widget.option({ redrawOnResize: true });
    widget.endUpdate();

    widget.beginUpdate();
    widget.option({ size: { width: 150, height: 250 } });
    widget.option({ size: { width: 150, height: 250 } });
    widget.option('theme', 100);
    widget.endUpdate();

    assert.strictEqual(spy.callCount, 2, 'call count');
    assert.deepEqual(counts, [2, 2], 'changes count');
});

QUnit.module('Option changing', environment);

QUnit.test('theme', function(assert) {
    this.createWidget({ rtlEnabled: 'rtl' });

    this.widget.option({ theme: 'theme' });

    assert.deepEqual(this.themeManager.setTheme.lastCall.args, ['theme', 'rtl'], 'theme manager is called');
});

QUnit.test('rtlEnabled', function(assert) {
    this.createWidget({ theme: 'theme' });

    this.widget.option({ rtlEnabled: 'rtl' });

    assert.deepEqual(this.themeManager.setTheme.lastCall.args, ['theme', 'rtl'], 'theme manager is called');
});

QUnit.test('encodeHtml', function(assert) {
    this.onGetAnimationOptions = function() { return 'animation-option'; };
    // this.onHandleThemeOptionsCore = sinon.spy();
    this.createWidget({
        rtlEnabled: 'rtl-enabled-option',
        pathModified: 'path-modified-option'
    });
    this.widget.option({ encodeHtml: 'encode-html-option' });
    this.themeManager.setCallback.lastCall.args[0]();

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [{
        animation: 'animation-option',
        rtl: 'rtl-enabled-option',
        encodeHtml: 'encode-html-option'
    }], 'renderer animation options');
    // assert.deepEqual(this.onHandleThemeOptionsCore.lastCall.args, [], "theme options handled");
});

QUnit.skip('Option from the invalidating list', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_invalidate');
    this.widget._invalidatingOptions = ['test-option'];

    this.widget.option('test-option', 'test-value');

    assert.deepEqual(spy.lastCall.args, []);
});

QUnit.test('Unknown option', function(assert) {
    this.createWidget();
    const spy = sinon.spy(this.widget, '_invalidate');

    this.widget.option('test-option', 'test-value');

    assert.strictEqual(spy.lastCall, null);
});

QUnit.module('ElementAttr support', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        $('head').append($('<style type=\'text/css\' id=\'size-style\'>' + '.size-class{width:300px;height:300px;}' + '</style>'));
    },
    afterEach: function() {
        $('#size-style').remove();
        environment.afterEach.apply(this, arguments);
    },
    createContainer: function() {
        environment.createContainer.call(this, {});
    }
}));

QUnit.test('Set on creation', function(assert) {
    this.createWidget({ elementAttr: { someAttr: 'attr' } });

    assert.strictEqual(this.$container.attr('someAttr'), 'attr');
});

QUnit.test('Change option', function(assert) {
    this.createWidget({ elementAttr: { class: 'some-class', someAttr: 'attr' } });

    this.widget.option('elementAttr', { someNewAttr: 'newAttr' });

    assert.strictEqual(this.$container.attr('someNewAttr'), 'newAttr');
});

QUnit.test('get sizes from style on creation', function(assert) {
    this.createWidget({ elementAttr: { class: 'size-class' } });

    assert.deepEqual(this.renderer.resize.lastCall.args, [300, 300]);
});

QUnit.test('get sizes from style on option changing', function(assert) {
    this.createWidget({});

    this.widget.option('elementAttr', { class: 'size-class' });

    assert.deepEqual(this.renderer.resize.lastCall.args, [300, 300]);
});

QUnit.module('Order of methods calls', $.extend({}, environment, {
    beforeEach: function() {
        const test = this;
        environment.beforeEach.apply(test, arguments);
        test.spies = [
            'onInitCore',
            'onGetDefaultSize',
            'onApplySize',
            'onClean',
            'onRender',
            'onDisposeCore'
        ];
        $.each(test.spies, function(_, name) {
            test[name] = sinon.spy();
        });
    },
    emulateWindowResize: function() {
        resizeCallbacks.fire();
        this.tick(100);
    },
    checkOrder: function(assert, list) {
        let i;
        const ii = list.length - 1;
        let result = true;
        for(i = 0; i < ii && result; ++i) {
            result = list[i].calledBefore(list[i + 1]);
            assert.ok(result, i.toString());
        }
    },
    reset: function() {
        const test = this;
        $.each(test.spies, function(_, name) {
            test[name].reset();
        });
        this.renderer.stub('resize').reset();
    },
    checkResized: function(assert) {
        this.checkOrder(assert, [
            this.onGetDefaultSize.lastCall,
            this.renderer.resize.lastCall,
            this.onApplySize.lastCall
        ]);
        assert.strictEqual(this.onClean.callCount, 0, 'not cleaned');
        assert.strictEqual(this.onRender.callCount, 0, 'not rendered');
    },
    checkNotResized: function(assert) {
        assert.strictEqual(this.onGetDefaultSize.callCount, 1, 'default size');
        assert.strictEqual(this.renderer.resize.callCount, 0, 'renderer is not resized');
        assert.strictEqual(this.onApplySize.callCount, 0, 'size is not applied');
        assert.strictEqual(this.onClean.callCount, 0, 'not cleaned');
        assert.strictEqual(this.onRender.callCount, 0, 'not rendered');
    }
}));

QUnit.test('Create and destroy', function(assert) {
    const onInitialized = sinon.spy();
    this.createWidget({
        onInitialized: onInitialized
    });
    this.$container.remove();

    this.checkOrder(assert, [
        this.onGetDefaultSize.lastCall,
        rendererModule.Renderer.lastCall,
        this.renderer.resize.lastCall,
        this.onInitCore.lastCall,
        onInitialized.lastCall,
        this.onRender.lastCall,
        this.onApplySize.lastCall,
        this.onClean.lastCall,
        this.onDisposeCore.lastCall,
        this.renderer.dispose.lastCall
    ]);
});

QUnit.test('Create and destroy / hidden', function(assert) {
    this.$container.hide();
    this.createWidget();
    this.$container.remove();

    this.checkOrder(assert, [
        this.onGetDefaultSize.lastCall,
        rendererModule.Renderer.lastCall,
        this.renderer.resize.lastCall,
        this.onInitCore.lastCall,
        this.onRender.lastCall,
        this.onApplySize.lastCall,
        this.onClean.lastCall,
        this.onDisposeCore.lastCall,
        this.renderer.dispose.lastCall
    ]);
});

QUnit.test('On window resize', function(assert) {
    this.createWidget();
    this.reset();

    this.$container.width(100);
    this.emulateWindowResize();

    this.checkResized(assert);
});

QUnit.test('On window resize / size is not changed', function(assert) {
    this.createWidget();
    this.reset();

    this.emulateWindowResize();

    this.checkNotResized(assert);
});

QUnit.test('On window resize / hidden', function(assert) {
    this.$container.hide();
    this.createWidget();
    this.reset();

    this.$container.width(100);
    this.emulateWindowResize();

    this.checkResized(assert);
});

QUnit.test('Render when shown / size is changed', function(assert) {
    this.createWidget();
    this.reset();

    this.$container.width(100);
    this.widget.render();

    this.checkResized(assert);
});

QUnit.test('Render when shown / size is not changed', function(assert) {
    this.createWidget();
    this.reset();

    this.widget.render();

    this.checkNotResized(assert);
});

QUnit.test('Render when shown / container became hidden', function(assert) {
    this.createWidget();
    this.reset();

    this.$container.hide().width(100);
    this.widget.render();

    this.checkResized(assert);
});

QUnit.test('Render when hidden / container became shown', function(assert) {
    this.$container.hide();
    this.createWidget();
    this.reset();

    this.$container.show().width(100);
    this.widget.render();

    this.checkResized(assert);
});

QUnit.test('Option changing / size', function(assert) {
    this.createWidget();
    this.reset();

    this.widget.option({ size: { width: 300, height: 100 } });

    this.checkResized(assert);
});

QUnit.test('Option changing / margin', function(assert) {
    this.createWidget();
    this.reset();

    this.widget.option({ margin: { left: 1, right: 2 } });

    this.checkResized(assert);
});

QUnit.test('Option changing / to zeros', function(assert) {
    this.createWidget();
    this.reset();

    this.widget.option({ size: { height: 0 } });

    this.checkResized(assert);
});

QUnit.test('Option changing / to empty canvas', function(assert) {
    this.createWidget();
    this.reset();

    this.widget.option({ size: { width: 200 }, margin: { left: 150, right: 100 } });

    this.checkResized(assert);
});

QUnit.module('Canvas calculation', environment);

QUnit.test('no options', function(assert) {
    this.createWidget();

    assert.deepEqual(this.widget.DEBUG_getCanvas(), {
        width: 200, height: 150,
        left: 0, top: 0, right: 0, bottom: 0
    }, 'canvas');
});

QUnit.test('no options and container has no sizes', function(assert) {
    try {
        sinon.stub(renderer.fn, 'width').returns(0);
        sinon.stub(renderer.fn, 'height').returns(0);
        this.onGetDefaultSize = function() {
            return { width: 400, height: 300, left: 10, top: 20, right: 30, bottom: 40 };
        };
        this.createWidget();

        assert.deepEqual(this.widget.DEBUG_getCanvas(), {
            width: 400, height: 300,
            left: 10, top: 20, right: 30, bottom: 40
        }, 'canvas');
    } finally {
        renderer.fn.width.restore();
        renderer.fn.height.restore();
    }
});

// T665179
QUnit.test('Do not get size from container if size option is set', function(assert) {
    try {
        const width = sinon.stub(renderer.fn, 'width').returns(0);
        const height = sinon.stub(renderer.fn, 'height').returns(0);

        this.createWidget({
            size: {
                width: 200,
                height: 200
            }
        });

        assert.ok(!width.called);
        assert.ok(!height.called);
    } finally {
        renderer.fn.width.restore();
        renderer.fn.height.restore();
    }
});

QUnit.test('no options and container has negative sizes - get default size (T607069)', function(assert) {
    try {
        sinon.stub(renderer.fn, 'width').returns(-2);
        sinon.stub(renderer.fn, 'height').returns(-3);
        this.onGetDefaultSize = function() {
            return { width: 400, height: 300, left: 10, top: 20, right: 30, bottom: 40 };
        };
        this.createWidget();

        assert.deepEqual(this.widget.DEBUG_getCanvas(), {
            width: 400, height: 300,
            left: 10, top: 20, right: 30, bottom: 40
        }, 'canvas');
    } finally {
        renderer.fn.width.restore();
        renderer.fn.height.restore();
    }
});

QUnit.test('container is not visible', function(assert) {
    this.$container.hide();
    this.createWidget();

    assert.deepEqual(this.widget.DEBUG_getCanvas(), {
        width: 200, height: 150,
        left: 0, top: 0, right: 0, bottom: 0
    }, 'canvas');
});

QUnit.test('width is 0', function(assert) {
    this.createWidget({ size: { width: 0, height: 400 } });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), { width: 0, height: 0 }, 'canvas');
});

QUnit.test('height is 0', function(assert) {
    this.createWidget({ size: { width: 300, height: 0 } });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), { width: 0, height: 0 }, 'canvas');
});

QUnit.test('horizontal margins are too big', function(assert) {
    this.createWidget({
        size: { width: 400, height: 300 },
        margin: { left: 300, right: 200 }
    });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), { width: 0, height: 0 }, 'canvas');
});

QUnit.test('vertical margins are too big', function(assert) {
    this.createWidget({
        size: { width: 400, height: 300 },
        margin: { top: 150, bottom: 200 }
    });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), { width: 0, height: 0 }, 'canvas');
});

QUnit.test('size', function(assert) {
    this.createWidget({ size: { width: 150, height: 250 } });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), {
        width: 150, height: 250,
        left: 0, top: 0, right: 0, bottom: 0
    }, 'canvas');
});

QUnit.test('margin', function(assert) {
    this.createWidget({ margin: { left: 1, top: 2, right: 3, bottom: 4 } });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), {
        width: 200, height: 150,
        left: 1, top: 2, right: 3, bottom: 4
    }, 'canvas');
});

QUnit.test('size and margin', function(assert) {
    this.createWidget({
        size: { width: 400, height: 200 },
        margin: { left: 10, top: 20, right: 30, bottom: 40 }
    });

    assert.deepEqual(this.widget.DEBUG_getCanvas(), {
        width: 400, height: 200,
        left: 10, top: 20, right: 30, bottom: 40
    }, 'canvas');
});

QUnit.module('getSize and size manipulations', environment);

QUnit.test('Call render after container is resized', function(assert) {
    this.createWidget();
    this.$container.width(400);
    this.$container.height(300);

    this.widget.render();

    const size = this.widget.getSize();

    // assert
    assert.equal(size.width, 400);
    assert.equal(size.height, 300);
});

QUnit.test('size option changed', function(assert) {
    this.createWidget({
        size: {
            width: 500,
            height: 500
        }
    });
    this.widget.option({
        size: {
            width: 300,
            height: 300
        }
    });

    // Act
    const size = this.widget.getSize();

    // assert
    assert.equal(size.width, 300);
    assert.equal(size.height, 300);
});

QUnit.test('size option changed with initial size. negative width', function(assert) {
    this.$container.width(200);
    this.$container.height(200);
    this.createWidget({
        size: {
            width: 500,
            height: 500
        }
    });
    this.widget.option({
        size: {
            width: -100,
            height: 600
        }
    });

    // Act
    const size = this.widget.getSize();

    // assert
    assert.equal(size.width, 0);
    assert.equal(size.height, 0);
});

QUnit.test('size option changed with initial size. negative height', function(assert) {
    this.$container.width(200);
    this.$container.height(200);
    this.createWidget({
        size: {
            width: 500,
            height: 500
        }
    });
    this.widget.option({
        size: {
            width: 600,
            height: -100
        }
    });

    // Act
    const size = this.widget.getSize();

    // assert
    assert.equal(size.width, 0);
    assert.equal(size.height, 0);
});

QUnit.test('size option changed with container size. negative height', function(assert) {
    this.$container.width(200);
    this.$container.height(200);
    this.createWidget();
    this.widget.option({
        size: {
            width: 600,
            height: -100
        }
    });
    // Act
    const size = this.widget.getSize();

    // assert
    assert.equal(size.width, 0);
    assert.equal(size.height, 0);
});

QUnit.module('Redraw on resize', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.onApplySize = sinon.spy();
    },

    triggerCallback: function() {
        this.$container.width(this.$container.width() + 1);
        resizeCallbacks.fire();
        this.tick(100);
    },

    createWidget: function() {
        const result = environment.createWidget.apply(this, arguments);
        this.onApplySize.reset();
        return result;
    }
}));

QUnit.test('option is not defined', function(assert) {
    this.createWidget();

    this.triggerCallback();

    assert.strictEqual(this.onApplySize.callCount, 1);
});

QUnit.test('option is false', function(assert) {
    this.createWidget({ redrawOnResize: false });

    this.triggerCallback();

    assert.strictEqual(this.onApplySize.callCount, 0);
});

QUnit.test('option changing 1', function(assert) {
    this.createWidget({ redrawOnResize: false });

    this.triggerCallback();
    this.widget.option({ redrawOnResize: true });
    this.triggerCallback();

    assert.strictEqual(this.onApplySize.callCount, 1);
});

QUnit.test('option changing 2', function(assert) {
    this.createWidget({ redrawOnResize: true });

    this.triggerCallback();
    this.widget.option({ redrawOnResize: false });
    this.triggerCallback();

    assert.strictEqual(this.onApplySize.callCount, 1);
});

QUnit.test('disposing', function(assert) {
    this.createWidget();
    this.$container.remove();

    this.triggerCallback();

    assert.strictEqual(this.onApplySize.callCount, 0);
});

QUnit.test('disposing during delay', function(assert) {
    this.createWidget();

    resizeCallbacks.fire();
    this.clock.tick(50);
    this.$container.remove();
    this.clock.tick(100);

    assert.strictEqual(this.onApplySize.callCount, 0);
});

QUnit.module('Visibility changing', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.createWidget();
        this.renderStub = sinon.stub(this.widget, 'render');
    }
}));

QUnit.test('Hide', function(assert) {
    // act
    this.$container.trigger('dxhiding');

    assert.strictEqual(this.renderStub.callCount, 1);
});

QUnit.test('Show', function(assert) {
    // arrange
    this.$container.trigger('dxhiding').hide();
    this.renderStub.reset();

    // act
    this.$container.show().trigger('dxshown');

    assert.strictEqual(this.renderStub.callCount, 1);
});

QUnit.module('Fix renderer root placement for sharping', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
    },

    triggerResizeCallback: function() {
        this.$container.width(this.$container.width() + 1);
        resizeCallbacks.fire();
        this.tick(100);
    },

    createWidget: function() {
        return environment.createWidget.apply(this, arguments);
    }
}));

QUnit.test('Call renderer.fixPlacement on window resize', function(assert) {
    this.createWidget();

    this.triggerResizeCallback();

    assert.strictEqual(this.renderer.fixPlacement.callCount, 1);
});

QUnit.test('Call renderer.fixPlacement on window resize even if redrawOnResize false', function(assert) {
    this.createWidget({ redrawOnResize: false });

    this.triggerResizeCallback();

    assert.strictEqual(this.renderer.fixPlacement.callCount, 1);
});

QUnit.test('Call renderer.fixPlacement on container visibility change (show)', function(assert) {
    // arrange
    this.createWidget();
    this.$container.trigger('dxhiding').hide();

    // act
    this.$container.show().trigger('dxshown');

    assert.strictEqual(this.renderer.fixPlacement.callCount, 2);
});

QUnit.module('Incident occurred', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.error = sinon.stub(logger, 'error');
        this.warn = sinon.stub(logger, 'warn');
    },
    afterEach: function() {
        this.error.restore();
        this.warn.restore();
        environment.afterEach.apply(this, arguments);
    },
    triggerIncident: function() {
        this.widget._incidentOccurred.apply(null, arguments);
    }
}));

QUnit.test('default method use console.warn', function(assert) {
    this.createWidget();

    this.triggerIncident('E100');

    assert.ok(this.error.calledOnce);
});

QUnit.test('suppress default method if there is onIncidentOccurred subscription', function(assert) {
    this.createWidget();

    const onIncidentOccurred = sinon.spy();
    this.widget.on('incidentOccurred', onIncidentOccurred);

    this.triggerIncident('E100');

    assert.ok(!this.error.called);
    assert.ok(onIncidentOccurred.calledOnce);
});

QUnit.test('call with some arguments', function(assert) {
    const onIncidentOccurred = sinon.spy();
    this.createWidget({ onIncidentOccurred: onIncidentOccurred });

    this.triggerIncident('E100', ['argument1', 'argument2']);

    assert.deepEqual(onIncidentOccurred.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        target: {
            id: 'E100',
            args: ['argument1', 'argument2'],
            type: 'error',
            text: 'Templated text 1: argument1, Templated text 2: argument2',
            widget: 'dxBaseWidgetTester',
            version: version
        }
    }]);
});

QUnit.test('call with some arguments. warning', function(assert) {
    const onIncidentOccurred = sinon.spy();
    this.createWidget({ onIncidentOccurred: onIncidentOccurred });

    this.triggerIncident('W100', ['argument1', 'argument2']);

    assert.deepEqual(onIncidentOccurred.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        target: {
            id: 'W100',
            args: ['argument1', 'argument2'],
            type: 'warning',
            text: 'Warning: Templated text 1: argument1, Templated text 2: argument2',
            widget: 'dxBaseWidgetTester',
            version: version
        }
    }]);
});

QUnit.test('in default output message with url in logger. without arguments', function(assert) {
    this.createWidget();

    this.triggerIncident('E100');

    assert.ok(this.error.calledOnce);
    assert.equal(this.error.firstCall.args[0].replace(/\d+_\d+/, '0_1'), 'E100 - Templated text 1: {0}, Templated text 2: {1}. See:\nhttp://js.devexpress.com/error/0_1/E100');
});

QUnit.test('default incidentOccurred show warning', function(assert) {
    this.createWidget();

    this.triggerIncident('W100');

    assert.ok(this.warn.calledOnce);
    assert.equal(this.warn.firstCall.args[0].replace(/\d+_\d+/, '0_1'), 'W100 - Warning: Templated text 1: {0}, Templated text 2: {1}. See:\nhttp://js.devexpress.com/error/0_1/W100');
});

QUnit.test('in default output message with url in logger', function(assert) {
    this.createWidget();

    this.triggerIncident('E100', ['argument1', 'argument2']);

    assert.ok(this.error.calledOnce);
    assert.equal(this.error.firstCall.args[0].replace(/\d+_\d+/, '0_1'), 'E100 - Templated text 1: argument1, Templated text 2: argument2. See:\nhttp://js.devexpress.com/error/0_1/E100');
});

QUnit.module('drawn', $.extend({}, environment, {
    triggerDrawn: function() {
        this.widget._drawn();
        this.tick();
    }
}));

QUnit.test('without set drawn handler', function(assert) {
    // arrange
    this.createWidget();

    // act
    this.triggerDrawn();

    // assert
    assert.ok(true, 'no exceptions');
});

QUnit.test('with set drawn handler', function(assert) {
    // arrange
    const onDrawnCallback = sinon.spy();
    this.createWidget({ onDrawn: onDrawnCallback });

    // act
    this.triggerDrawn();

    // assert
    assert.deepEqual(onDrawnCallback.lastCall.args, [{
        component: this.widget,
        element: this.widget.element()
    }]);
});

QUnit.module('isReady', $.extend({}, environment, {
    triggerDrawn: function() {
        this.widget._drawn();
        this.tick();
    }
}));

QUnit.test('isReady on drawn', function(assert) {
    // arrange
    this.createWidget();

    // act
    this.triggerDrawn();
    // assert
    assert.ok(this.renderer.onEndAnimation.calledOnce);
    assert.ok(!this.widget.isReady());
});

QUnit.test('isReady after call ready callback', function(assert) {
    // arrange
    this.createWidget();
    this.renderer.onEndAnimation = function(complete) {
        complete();
    };
    // act
    this.triggerDrawn();
    // assert

    assert.ok(this.widget.isReady());
});

QUnit.module('New events mechanism', $.extend({}, environment, {
    triggerEvent: function(name, arg, complete) {
        this.widget._eventTrigger(name, arg, complete);
        this.tick();
    }
}));

QUnit.test('No options, no bindings', function(assert) {
    this.createWidget();

    this.triggerEvent('testEvent', { data: 'test' });

    assert.ok(true, 'no errors');
});

QUnit.test('Only binding', function(assert) {
    this.createWidget();
    const callback = sinon.stub();
    this.widget.on('testEvent', callback);

    this.triggerEvent('testEvent', { data: 'test' });

    assert.deepEqual(callback.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        data: 'test'
    }]);
});

QUnit.test('Trigger event with complete', function(assert) {
    this.createWidget();
    const callback = sinon.stub();
    const complete = sinon.stub();
    this.widget.on('testEvent', callback);

    this.triggerEvent('testEvent', { data: 'test' }, complete);

    assert.ok(callback.calledOnce);
    assert.ok(complete.calledOnce);

});

QUnit.test('Only option', function(assert) {
    const callback = sinon.stub();
    this.createWidget({ onTestEvent: callback });

    this.triggerEvent('testEvent', { data: 10 });

    assert.deepEqual(callback.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        data: 10
    }]);
});

QUnit.test('Option and binding', function(assert) {
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();
    this.createWidget({ onTestEvent: callback1 });
    this.widget.on('testEvent', callback2);

    this.triggerEvent('testEvent', { data1: 'A', data2: 'B' });

    assert.deepEqual(callback1.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        data1: 'A', data2: 'B'
    }], 'option');
    assert.deepEqual(callback2.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        data1: 'A', data2: 'B'
    }], 'binding');
});

QUnit.test('Several bindings', function(assert) {
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();
    const callback3 = sinon.stub();
    this.createWidget({ onTestEvent: callback1 });

    this.triggerEvent('testEvent', { tag: 1 });

    assert.deepEqual(callback1.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 1
    }], 'option / 1');

    this.widget.on('testEvent', callback2);
    this.triggerEvent('testEvent', { tag: 2 });

    assert.deepEqual(callback1.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 2
    }], 'option / 2');
    assert.deepEqual(callback2.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 2
    }], 'binding 1 / 2');

    this.widget.on('testEvent', callback3);
    this.triggerEvent('testEvent', { tag: 3 });

    assert.deepEqual(callback1.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 3
    }], 'option / 3');
    assert.deepEqual(callback2.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 3
    }], 'binding 1 / 3');
    assert.deepEqual(callback3.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 3
    }], 'binding 2 / 3');

    this.widget.off('testEvent', callback2);
    this.triggerEvent('testEvent', { tag: 4 });

    assert.deepEqual(callback1.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 4
    }], 'option / 4');
    assert.deepEqual(callback2.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 3
    }], 'binding 1 / 4');
    assert.deepEqual(callback3.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 4
    }], 'binding 2 / 4');
});

QUnit.test('Option changing - set callback', function(assert) {
    const callback = sinon.stub();
    this.createWidget();

    this.widget.option('onTestEvent', callback);
    this.triggerEvent('testEvent', { tag: 'data' });

    assert.deepEqual(callback.lastCall.args, [{
        component: this.widget,
        element: this.widget.element(),
        tag: 'data'
    }]);
});

QUnit.test('Option changing - reset callback', function(assert) {
    const callback = sinon.stub();
    this.createWidget({ onTestEvent: callback });

    this.widget.option('onTestEvent', null);
    this.triggerEvent('testEvent', { tag: 'data' });

    assert.strictEqual(callback.lastCall, null);
});

QUnit.module('createResizeHandler', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    },

    create: DEBUG_createResizeHandler,

    tick: function(count) {
        this.clock.tick(count);
    }
});

QUnit.test('Callback is called after delay', function(assert) {
    const callback = sinon.spy();
    const handler = this.create(callback);

    handler();

    assert.strictEqual(callback.callCount, 0, 'not called immediately');
    this.tick(40);
    assert.strictEqual(callback.callCount, 0, 'not called if timeout not passed');
    this.tick(60);
    assert.strictEqual(callback.callCount, 1, 'called if timeout passed');
});

QUnit.test('Single callback is called for multiple calls', function(assert) {
    const callback = sinon.spy();
    const handler = this.create(callback);

    handler();
    handler();

    this.tick(100);
    assert.strictEqual(callback.callCount, 1);
});

QUnit.test('Timeout is reset after new call', function(assert) {
    const callback = sinon.spy();
    const handler = this.create(callback);

    handler();
    this.tick(60);
    handler();
    this.tick(40);

    assert.strictEqual(callback.callCount, 0, 'not called if first timeout passed');
    this.tick(60);
    assert.strictEqual(callback.callCount, 1, 'called if second timeout passed');

});

QUnit.test('Callback disposing', function(assert) {
    const callback = sinon.spy();
    const handler = this.create(callback);

    handler();
    this.tick(40);
    handler.dispose();
    this.tick(60);

    assert.strictEqual(callback.callCount, 0);
});

QUnit.module('EventTrigger', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.callback = sinon.spy();
        this.callbackGetter = sinon.stub().returns({ callback: this.callback });
    },

    afterEach: function() {
        this.clock.restore();
    },

    create: function(map) {
        return DEBUG_createEventTrigger(map, this.callbackGetter);
    },

    waitForCallback: function() {
        this.clock.tick(0);
    }
});

QUnit.test('creation', function(assert) {
    this.create({
        'name-1': {
            name: 'name-1-n'
        },
        'name-2': {
        },
        'name-3': {
            name: 'name-3-n'
        }
    });

    assert.strictEqual(this.callbackGetter.callCount, 2, 'callback getter - call count');
    assert.deepEqual(this.callbackGetter.getCall(0).args, ['name-1'], 'callback getter - call 1');
    assert.deepEqual(this.callbackGetter.getCall(1).args, ['name-3'], 'callback getter - call 2');
});

QUnit.test('calling', function(assert) {
    this.callbackGetter.returns(this.callback);
    const trigger = this.create({
        'name-1': { name: 'name-1-n' }
    });
    const arg = { tag: 'arg' };
    const complete = sinon.spy();

    trigger('name-1-n', arg, complete);

    assert.deepEqual(this.callback.lastCall.args, [arg], 'callback is called after timeout');
    assert.deepEqual(complete.lastCall.args, [], 'complete is called after timeout');
});

QUnit.test('calling by unknown name', function(assert) {
    const trigger = this.create({
        'name-1': { name: 'name-1-n' }
    });

    try {
        trigger('name-2-n', {});
        assert.ok(false);
    } catch(_) {
        assert.ok(true);
    }
});

QUnit.test('updating', function(assert) {
    const trigger = this.create({
        'name-1': {}
    });
    this.callbackGetter.reset();

    assert.strictEqual(trigger.change('name-1'), true, 'common');
    assert.strictEqual(trigger.change('name-3'), false, 'unknown');

    trigger.applyChanges();
    assert.strictEqual(this.callbackGetter.callCount, 1, 'callback getter - call count');
    assert.deepEqual(this.callbackGetter.getCall(0).args, ['name-1'], 'callback getter - call 1');
});

QUnit.module('Misc API', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.createWidget();
    }
}));

QUnit.test('get widget markup', function(assert) {
    // arrange
    this.renderer.svg = function() {
        return 'some markup';
    };
    // act
    assert.equal(this.widget.svg(), 'some markup', 'markup, returned from element');
});

QUnit.module('Disabled', environment);

QUnit.test('Create without disabled state', function(assert) {
    this.createWidget();

    assert.strictEqual(this.renderer.root.stub('attr').callCount, 1);
    assert.deepEqual(this.renderer.root.stub('attr').lastCall.args, ['pointer-events']);
});

QUnit.test('Create with disabled state', function(assert) {
    sinon.stub(this.renderer, 'getGrayScaleFilter').returns({ id: 'grayScaleFilterRef' });
    this.createWidget({
        disabled: true
    });

    assert.deepEqual(this.renderer.root.stub('attr').lastCall.args, [{
        'pointer-events': 'none',
        filter: 'grayScaleFilterRef'
    }]);
});

QUnit.test('Set disabled state, initially not disabled', function(assert) {
    sinon.stub(this.renderer, 'getGrayScaleFilter').returns({ id: 'grayScaleFilterRef' });
    const rs = this.createWidget();

    rs.option({
        disabled: true
    });

    assert.deepEqual(this.renderer.root.stub('attr').lastCall.args, [{
        'pointer-events': 'none',
        filter: 'grayScaleFilterRef'
    }]);
});

QUnit.test('Reset disabled state, initially disabled', function(assert) {
    sinon.stub(this.renderer, 'getGrayScaleFilter').returns({ id: 'grayScaleFilterRef' });
    const rs = this.createWidget({
        disabled: true
    });

    rs.option({
        disabled: false
    });

    assert.deepEqual(this.renderer.root.stub('attr').lastCall.args, [{
        'pointer-events': 0,
        filter: null
    }]);
});

QUnit.test('Change disabled option if root has pointer-events attr', function(assert) {
    sinon.stub(this.renderer, 'getGrayScaleFilter').returns({ id: 'grayScaleFilterRef' });
    this.renderer.root.attr({ 'pointer-events': 'some-value' });

    const widget = this.createWidget({
        disabled: true
    });

    widget.option('disabled', false);

    assert.deepEqual(this.renderer.root.attr.lastCall.args, [{ 'pointer-events': 'some-value', filter: null }]);
});

QUnit.test('Change disabled option if root has empty pointer-events attr', function(assert) {
    sinon.stub(this.renderer, 'getGrayScaleFilter').returns({ id: 'grayScaleFilterRef' });
    this.renderer.root.attr({ 'pointer-events': '' });

    const widget = this.createWidget({
        disabled: true
    });

    widget.option('disabled', false);

    assert.deepEqual(this.renderer.root.attr.lastCall.args, [{ 'pointer-events': '', filter: null }]);
});
