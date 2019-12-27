const $ = require('jquery');
const animation = require('viz/core/renderers/animation');
const renderers = require('viz/core/renderers/renderer');
const vizMocks = require('../../helpers/vizMocks.js');
const browser = require('core/utils/browser');

$('<div>')
    .attr('id', 'qunit-fixture')
    .css({ width: 300, height: 300 })
    .appendTo($('body'));

function getMockElement() {
    return {
        setAttributeNS: sinon.spy(),
        appendChild: sinon.spy()
    };
}

renderers.DEBUG_set_getNextDefsSvgId(function() { return 'DevExpressId'; });

QUnit.testDone(function() {
    renderers.SvgElement.reset && renderers.SvgElement.reset();
});

const elementsName = ['SvgElement', 'RectSvgElement', 'PathSvgElement', 'ArcSvgElement', 'TextSvgElement'];

function setMockElements() {
    function wrapElement(elementName) {
        sinon.stub(renderers, elementName, vizMocks.stubClass(renderers[elementName], null, {
            $constructor: function() {
                this.renderer = arguments[0];
                this.element = getMockElement();
                this._settings = {};
            },
            $thisReturnFunctions: ['attr', 'css', 'append']
        }));
    }

    elementsName.forEach(function(elementName) {
        wrapElement(elementName);
    });
}

function resetMockElements() {
    elementsName.forEach(function(elementName) {
        renderers[elementName].restore();
    });
}

animation.AnimationController = vizMocks.stubClass(animation.AnimationController);

const Renderer = renderers.Renderer;

QUnit.module('Renderer common API', {
    before: setMockElements,
    after: resetMockElements,
    beforeEach: function() {
        this.container = document.createElement('div');
    },
    createRenderer: function(params) {
        return new Renderer($.extend({
            container: this.container
        }, params));
    }
});

QUnit.test('Creation', function(assert) {
    // arrange
    // act
    const renderer = this.createRenderer({
        cssClass: 'my-super-class',
        pathModified: 'yes',
        container: this.container
    });

    // assert
    assert.ok(renderer.root, 'root element is created');
    assert.equal(renderer.root.ctorArgs[0], renderer, 'root element Renderer param');
    assert.equal(renderer.root.ctorArgs[1], 'svg', 'root element TagName param');
    assert.strictEqual(renderer.root.attr.callCount, 2, 'root\'s attr call count');
    assert.deepEqual(renderer.root.attr.firstCall.args, [{
        xmlns: 'http://www.w3.org/2000/svg',
        version: '1.1',
        // backward compatibility
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0
    }], 'root\'s default params');
    assert.deepEqual(renderer.root.attr.secondCall.args, [{
        'class': 'my-super-class',
    }], 'root\'s class');
    assert.deepEqual(renderer.root.css.firstCall.args[0], {
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        '-webkit-user-select': 'none',
        display: 'block',
        overflow: 'hidden',
        'line-height': 'normal' // T179515
    }, 'root\'s css params');

    assert.deepEqual(renderers.SvgElement.getCall(1).returnValue.ctorArgs, [renderer, 'defs', undefined], 'defs element is created');
    assert.deepEqual(renderer._animationController.ctorArgs, [renderer.root.element], 'animationController is created');
    assert.strictEqual(renderer.pathModified, true, 'pathModified');

    assert.strictEqual(renderer.root.append.lastCall.args[0].element, this.container, 'root is appended');
    assert.deepEqual(renderers.SvgElement.getCall(1).returnValue.append.lastCall.args, [renderer.root], 'defs is appended');
});

QUnit.test('setOptions', function(assert) {
    // arrange
    const renderer = this.createRenderer({
        rtl: 'yes',
        encodeHtml: 'yes',
        cssClass: 'my-super-class',
        animation: { enabled: false, duration: 2000, easing: 'linear' }
    });
    renderer.root.stub('attr').reset();
    renderer.root.stub('css').reset();

    // act
    renderer.setOptions({
        rtl: false,
        encodeHtml: false,
        animation: { enabled: true, duration: 500, easing: 'cubic' }
    });

    // assert
    assert.strictEqual(renderer.pathModified, false, 'pathModified');
    assert.strictEqual(renderer.rtl, false, 'rtl');
    assert.strictEqual(renderer.encodeHtml, false, 'encodeHtml');

    assert.strictEqual(renderer.root.stub('attr').callCount, 1, 'root\'s attr called');
    assert.deepEqual(renderer.root.stub('attr').lastCall.args[0], {
        direction: 'ltr'
    }, 'root\'s attr params');
    assert.strictEqual(renderer.root.stub('css').callCount, 0, 'root\'s css');

    assert.deepEqual(renderer._animation, { enabled: true, duration: 500, easing: 'cubic' }, 'animation options');
});

QUnit.test('Update animation options', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    let result;
    renderer.setOptions({ animation: { enabled: false, duration: 2000, easing: 'linear' } });

    // act
    result = renderer.updateAnimationOptions({ duration: 3000, someOtherOption: 1 });

    // assert
    assert.equal(result, renderer);
    assert.deepEqual(renderer._animation, { enabled: false, duration: 3000, easing: 'linear', someOtherOption: 1 }, 'animation options');
});

QUnit.test('Animation enabled', function(assert) {
    // arrange
    const renderer1 = this.createRenderer();
    const renderer2 = this.createRenderer();
    renderer2.setOptions({ animation: { enabled: false } });

    // act/assert
    assert.equal(renderer1.animationEnabled(), true);
    assert.equal(renderer2.animationEnabled(), false);
});

QUnit.test('stopAllAnimations', function(assert) {
    // arrange
    const renderer1 = this.createRenderer();
    const renderer2 = this.createRenderer();
    let result1;
    let result2;

    // act
    result1 = renderer1.stopAllAnimations();
    result2 = renderer2.stopAllAnimations(true);

    // assert
    assert.equal(result1, renderer1);
    assert.equal(renderer1._animationController.stub('stop').callCount, 1, 'Stop without lock. animationController\'s stop method called');
    assert.equal(renderer1._animationController.stub('lock').callCount, 0, 'Stop without lock. animationController\'s lock method not called');
    assert.equal(result2, renderer2);
    assert.equal(renderer2._animationController.stub('stop').callCount, 0, 'Stop with lock. animationController\'s stop method not called');
    assert.equal(renderer2._animationController.stub('lock').callCount, 1, 'Stop with lock. animationController\'s lock method called');
});

QUnit.test('animateElement', function(assert) {
    // arrange
    const element = { a: 'a' };
    const params = { b: 'b' };
    const options = { c: 'c' };
    const renderer = this.createRenderer();
    let result;

    // act
    result = renderer.animateElement(element, params, options);

    // assert
    assert.equal(result, renderer);
    assert.equal(renderer._animationController.stub('animateElement').callCount, 1, 'animationController\'s animateElement method called');
    assert.equal(renderer._animationController.stub('animateElement').firstCall.args[0], element, 'animationController animateElement\'s element param');
    assert.equal(renderer._animationController.stub('animateElement').firstCall.args[1], params, 'animationController animateElement\'s params param');
    assert.equal(renderer._animationController.stub('animateElement').firstCall.args[2], options, 'animationController animateElement\'s options param');
});

QUnit.test('Resize with wrong size', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    let result;

    renderer.root.stub('attr').reset();

    // act
    result = renderer.resize(0, -10);

    // assert
    assert.equal(result, renderer);
    assert.strictEqual(renderer.root.stub('attr').callCount, 0, 'root is not resized');
});

QUnit.test('Resize with good size', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    let result;

    renderer.root.stub('attr').reset();

    // act
    result = renderer.resize(1000, 100);

    // assert
    assert.equal(result, renderer);
    assert.strictEqual(renderer.root.stub('attr').callCount, 1, 'root is resized');
    assert.deepEqual(renderer.root.stub('attr').firstCall.args[0], { width: 1000, height: 100 }, 'size is passed');
});

// Q558365
QUnit.test('Svg method', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    let svgString;

    renderer.root.stub('markup').returns('root\'s markup');

    // act
    svgString = renderer.svg();

    // assert
    assert.strictEqual(renderer.root.stub('markup').callCount, 1, 'got root\'s markup');
    assert.strictEqual(svgString, 'root\'s markup', 'return root\'s markup');
});

QUnit.test('getRootOffset', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    let offset;

    renderer.root.stub('getOffset').returns({ top: 5, left: 10 });

    // act
    offset = renderer.getRootOffset();

    // assert
    assert.strictEqual(renderer.root.stub('getOffset').callCount, 1, 'got root\'s offset');
    assert.deepEqual(offset, { top: 5, left: 10 }, 'return root\'s offset');
});

QUnit.test('Disposing', function(assert) {
    const renderer = this.createRenderer();
    let animationControllerDisposed = false;
    let rootDispose;
    let defsDispose;

    rootDispose = renderer.root.stub('dispose');
    defsDispose = renderers.SvgElement.getCall(1).returnValue.stub('dispose');
    renderer._animationController.dispose = function() {
        animationControllerDisposed = true;
    };

    renderer.dispose();

    assert.ok(rootDispose.called);
    assert.ok(defsDispose.called);
    assert.ok(animationControllerDisposed);
    for(const key in renderer) {
        assert.strictEqual(renderer[key], null);
    }
});

QUnit.test('onEndAnimation', function(assert) {
    // arrange
    const renderer = this.createRenderer();
    const endAnimation = 'endAnimation';
    let animationControllerEndAnimationStub;

    // act
    renderer.onEndAnimation(endAnimation);

    animationControllerEndAnimationStub = renderer._animationController.stub('onEndAnimation');

    // assert
    assert.equal(animationControllerEndAnimationStub.callCount, 1);
    assert.deepEqual(animationControllerEndAnimationStub.firstCall.args, [endAnimation]);
});

QUnit.module('Locking', {
    before: setMockElements,
    beforeEach: function() {
        this.container = document.createElement('div');
        this.renderer = new Renderer({ container: this.container });
        this.renderer.root.append.reset();
    },

    afterEach: function() {
        renderers.DEBUG_removeBackupContainer();
    },

    after: resetMockElements,

    appendContainer: function() {
        $('#qunit-fixture').append(this.container);
    }
});

QUnit.test('Lock / container is in DOM', function(assert) {
    this.appendContainer();

    this.renderer.lock();

    assert.strictEqual(this.renderer.root.append.lastCall, null);
});

QUnit.test('Lock / container is not in DOM', function(assert) {
    this.renderer.lock();

    assert.ok(this.renderer.root.append.lastCall.args[0].element);
});

QUnit.test('Lock / second call', function(assert) {
    this.renderer.lock();

    this.renderer.lock();

    assert.strictEqual(this.renderer.root.append.callCount, 1);
});

QUnit.test('Unlock / container is in DOM', function(assert) {
    this.appendContainer();
    this.renderer.lock();

    this.renderer.unlock();

    assert.strictEqual(this.renderer.root.append.lastCall, null);
});

QUnit.test('Unlock / container is not in DOM', function(assert) {
    this.renderer.lock();

    this.renderer.unlock();

    assert.strictEqual(this.renderer.root.append.lastCall.args[0].element, this.container);
});

QUnit.test('Unlock / first call of two', function(assert) {
    this.renderer.lock();
    this.renderer.lock();

    this.renderer.unlock();

    assert.strictEqual(this.renderer.root.append.callCount, 1);
});

QUnit.test('Backup container does not stay in DOM', function(assert) {
    this.renderer.lock();
    const container = this.renderer.root.append.lastCall.args[0].element;
    this.renderer.unlock();

    assert.strictEqual(container.parentNode, null);
});

QUnit.test('Several renderers share same backup container', function(assert) {
    this.renderer.lock();
    const container = this.renderer.root.append.lastCall.args[0].element;
    const renderer = new Renderer({ container: document.createElement('div') });

    renderer.lock();

    assert.strictEqual(renderer.root.append.lastCall.args[0].element, container, 'container is shared');

    this.renderer.unlock();

    assert.ok(container.parentNode, 'container is not removed after first renderer');

    renderer.unlock();

    assert.ok(!container.parentNode, 'container is removed after second renderer');
});

QUnit.module('Fix sharping', {
    before: setMockElements,
    after: resetMockElements,
    beforeEach: function() {
        const that = this;
        this.boundingRect = { left: 123.76, top: 2.15 };
        this.container = document.createElement('div');
        sinon.stub(this.container, 'getBoundingClientRect', function() {
            return that.boundingRect;
        });
    }
});

QUnit.test('Compensate root coordinates on creation', function(assert) {
    // arrange
    // act
    const renderer = new Renderer({
        container: this.container
    });

    // assert
    if(browser.mozilla) {
        assert.deepEqual(renderer.root.move.firstCall.args, [-0.76, -0.15]);
    } else if(browser.msie) {
        assert.deepEqual(renderer.root.css.getCall(1).args, [{
            transform: 'translate(-0.76px,-0.15px)'
        }]);
    } else {
        assert.deepEqual(renderer.root.stub('move').callCount, 0);
        assert.deepEqual(renderer.root.css.callCount, 1);
    }
});

QUnit.test('Compensate root coordinates on Unlock', function(assert) {
    // arrange
    const renderer = new Renderer({
        container: this.container
    });
    renderer.lock();
    $('#qunit-fixture').append(this.container);
    this.boundingRect = { left: 123.34, top: 2.5 };

    // act
    renderer.unlock();

    // assert
    if(browser.mozilla) {
        assert.deepEqual(renderer.root.move.callCount, 2);
        assert.deepEqual(renderer.root.move.lastCall.args, [-0.34, -0.5]);
    } else if(browser.msie) {
        assert.deepEqual(renderer.root.css.callCount, 3);
        assert.deepEqual(renderer.root.css.getCall(2).args, [{
            transform: 'translate(-0.34px,-0.5px)'
        }]);
    } else {
        assert.deepEqual(renderer.root.stub('move').callCount, 0);
        assert.deepEqual(renderer.root.css.callCount, 1);
    }
});

QUnit.test('Compensate root coordinates on fixPlacement call', function(assert) {
    // arrange
    const renderer = new Renderer({
        container: this.container
    });
    this.boundingRect = { left: 123.34, top: 2.5 };

    // act
    renderer.fixPlacement();

    // assert
    if(browser.mozilla) {
        assert.deepEqual(renderer.root.move.callCount, 2);
        assert.deepEqual(renderer.root.move.lastCall.args, [-0.34, -0.5]);
    } else if(browser.msie) {
        assert.deepEqual(renderer.root.css.callCount, 3);
        assert.deepEqual(renderer.root.css.getCall(2).args, [{
            transform: 'translate(-0.34px,-0.5px)'
        }]);
    } else {
        assert.deepEqual(renderer.root.stub('move').callCount, 0);
        assert.deepEqual(renderer.root.css.callCount, 1);
    }
});

QUnit.test('Remove compensation before getting markup, compensate again after', function(assert) {
    // arrange
    const renderer = new Renderer({
        container: this.container
    });
    this.boundingRect = { left: 123.34, top: 2.5 };
    renderer.root.stub('attr').reset();
    renderer.root.stub('css').reset();
    renderer.root.stub('markup').reset();
    renderer.root.stub('move').reset();

    // act
    renderer.svg();

    // assert
    if(browser.mozilla) {
        assert.deepEqual(renderer.root.attr.callCount, 1);
        assert.deepEqual(renderer.root.attr.getCall(0).args, [{ transform: null }]);

        assert.strictEqual(renderer.root.markup.callCount, 1);
        assert.ok(renderer.root.markup.getCall(0).calledAfter(renderer.root.attr.getCall(0)));

        assert.deepEqual(renderer.root.move.callCount, 1);
        assert.deepEqual(renderer.root.move.getCall(0).args, [-0.34, -0.5]);
        assert.ok(renderer.root.move.getCall(0).calledAfter(renderer.root.markup.getCall(0)));

    } else if(browser.msie) {
        assert.deepEqual(renderer.root.css.callCount, 2);
        assert.deepEqual(renderer.root.css.getCall(0).args, [{ transform: '' }]);

        assert.strictEqual(renderer.root.markup.callCount, 1);
        assert.ok(renderer.root.markup.getCall(0).calledAfter(renderer.root.css.getCall(0)));

        assert.deepEqual(renderer.root.css.getCall(1).args, [{
            transform: 'translate(-0.34px,-0.5px)'
        }]);
        assert.ok(renderer.root.css.getCall(1).calledAfter(renderer.root.markup.getCall(0)));
    } else {
        assert.deepEqual(renderer.root.stub('move').callCount, 0);
        assert.deepEqual(renderer.root.stub('css').callCount, 0);
        assert.strictEqual(renderer.root.markup.callCount, 1);
    }
});

QUnit.module('Renderer drawing API', {
    before: setMockElements,

    beforeEach: function() {
        const container = document.createElement('div');
        this.renderer = new Renderer({ container: container });
    },

    after: resetMockElements
});

QUnit.test('rect without params', function(assert) {
    // act
    const rect = this.renderer.rect();

    // assert
    assert.ok(rect, 'rect element is created');
    assert.ok(rect instanceof renderers.RectSvgElement);
    assert.deepEqual(rect.ctorArgs, [this.renderer]);
    assert.strictEqual(rect.stub('attr').callCount, 1, 'rect\'s attr called once');
    assert.deepEqual(rect.stub('attr').firstCall.args[0], { x: 0, y: 0, width: 0, height: 0 }, 'rect\'s attr params');
    assert.strictEqual(rect.stub('css').callCount, 0, 'rect\'s css is not called');
    assert.strictEqual(rect.stub('append').callCount, 0, 'rect is not appended');
});

QUnit.test('rect with params', function(assert) {
    // act
    const rect = this.renderer.rect(10, 20, 30, 40);

    // assert
    assert.ok(rect, 'rect element is created');
    assert.ok(rect instanceof renderers.RectSvgElement);
    assert.deepEqual(rect.ctorArgs, [this.renderer]);
    assert.strictEqual(rect.stub('attr').callCount, 1, 'rect\'s attr called once');
    assert.deepEqual(rect.stub('attr').firstCall.args[0], { x: 10, y: 20, width: 30, height: 40 }, 'rect\'s attr params');
    assert.strictEqual(rect.stub('css').callCount, 0, 'rect\'s css is not called');
    assert.strictEqual(rect.stub('append').callCount, 0, 'rect is not appended');
});

QUnit.test('simple rect', function(assert) {
    const rect = this.renderer.simpleRect();

    assert.ok(rect instanceof renderers.SvgElement, 'instance type');
    assert.deepEqual(rect.ctorArgs, [this.renderer, 'rect', undefined], 'tag name');
});

QUnit.test('circle without params', function(assert) {
    // act
    const circle = this.renderer.circle();

    // assert
    assert.ok(circle, 'circle element is created');
    assert.ok(circle instanceof renderers.SvgElement);
    assert.deepEqual(circle.ctorArgs, [this.renderer, 'circle', undefined]);
    assert.strictEqual(circle.stub('attr').callCount, 1, 'circle\'s attr called once');
    assert.deepEqual(circle.stub('attr').firstCall.args[0], { cx: 0, cy: 0, r: 0 }, 'circle\'s attr params');
    assert.strictEqual(circle.stub('css').callCount, 0, 'circle\'s css is not called');
    assert.strictEqual(circle.stub('append').callCount, 0, 'circle is not appended');
});

QUnit.test('circle with params', function(assert) {
    // act
    const circle = this.renderer.circle(10, 20, 30);

    // assert
    assert.ok(circle, 'circle element is created');
    assert.ok(circle instanceof renderers.SvgElement);
    assert.deepEqual(circle.ctorArgs, [this.renderer, 'circle', undefined]);
    assert.strictEqual(circle.stub('attr').callCount, 1, 'circle\'s attr called once');
    assert.deepEqual(circle.stub('attr').firstCall.args[0], { cx: 10, cy: 20, r: 30 }, 'rect\'s attr params');
    assert.strictEqual(circle.stub('css').callCount, 0, 'circle\'s css is not called');
    assert.strictEqual(circle.stub('append').callCount, 0, 'circle is not appended');
});

QUnit.test('g', function(assert) {
    // act
    const group = this.renderer.g();

    // assert
    assert.ok(group, 'group element is created');
    assert.ok(group instanceof renderers.SvgElement);
    assert.deepEqual(group.ctorArgs, [this.renderer, 'g', undefined]);
    assert.strictEqual(group.stub('attr').callCount, 0, 'group\'s attr is not called');
    assert.strictEqual(group.stub('css').callCount, 0, 'group\'s css is not called');
    assert.strictEqual(group.stub('append').callCount, 0, 'group is not appended');
});

QUnit.test('image without params', function(assert) {
    // act
    const image = this.renderer.image();

    // assert
    assert.ok(image, 'image element is created');
    assert.ok(image instanceof renderers.SvgElement);
    assert.deepEqual(image.ctorArgs, [this.renderer, 'image', undefined]);
    assert.strictEqual(image.stub('attr').callCount, 1, 'image\'s attr called once');
    assert.deepEqual(image.stub('attr').firstCall.args[0], { x: 0, y: 0, width: 0, height: 0, preserveAspectRatio: 'none' }, 'image\'s attr params');
    assert.strictEqual(image.stub('css').callCount, 0, 'image\'s css is not called');
    assert.strictEqual(image.stub('append').callCount, 0, 'image is not appended');

    assert.strictEqual(image.element.setAttributeNS.callCount, 1, 'image href attribute is set');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[0], 'http://www.w3.org/1999/xlink', 'correct NS for href attribute');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[1], 'href', 'image href attribute');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[2], '', 'image href attribute value');
});

QUnit.test('image with params', function(assert) {
    // act
    const image = this.renderer.image(10, 20, 30, 40, '/test.jpg', 'Center');

    // assert
    assert.ok(image, 'image element is created');
    assert.ok(image instanceof renderers.SvgElement);
    assert.deepEqual(image.ctorArgs, [this.renderer, 'image', undefined]);
    assert.strictEqual(image.stub('attr').callCount, 1, 'image\'s attr called once');
    assert.deepEqual(image.stub('attr').firstCall.args[0], { x: 10, y: 20, width: 30, height: 40, preserveAspectRatio: 'xMidYMid' }, 'image\'s attr params');
    assert.strictEqual(image.stub('css').callCount, 0, 'image\'s css is not called');
    assert.strictEqual(image.stub('append').callCount, 0, 'image is not appended');

    assert.strictEqual(image.element.setAttributeNS.callCount, 1, 'image href attribute is set');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[0], 'http://www.w3.org/1999/xlink', 'correct NS for href attribute');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[1], 'href', 'image href attribute');
    assert.strictEqual(image.element.setAttributeNS.firstCall.args[2], '/test.jpg', 'image href attribute value');
});

QUnit.test('pattern, with right hatching, default width, step and opacity', function(assert) {
    // act
    const pattern = this.renderer.pattern('red', { direction: 'RighT' });

    // assert
    assert.ok(pattern, 'pattern element is created');
    assert.ok(pattern instanceof renderers.SvgElement);
    assert.strictEqual(pattern.id, 'DevExpressId', 'id is composed');
    assert.deepEqual(pattern.ctorArgs, [this.renderer, 'pattern', undefined]);
    assert.strictEqual(pattern.stub('attr').callCount, 1, 'pattern\'s attr called once');
    assert.deepEqual(pattern.stub('attr').firstCall.args[0], { id: 'DevExpressId', width: 6, height: 6, patternUnits: 'userSpaceOnUse' }, 'pattern\'s attr params');
    assert.strictEqual(pattern.stub('css').callCount, 0, 'pattern\'s css is not called');
    assert.strictEqual(pattern.stub('append').callCount, 1, 'pattern is appended');
    assert.equal(pattern.stub('append').firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'pattern is appended to defs');

    assert.ok(pattern.rect, 'pattern.rect element is created');
    assert.ok(pattern.rect instanceof renderers.RectSvgElement);
    assert.deepEqual(pattern.rect.ctorArgs, [this.renderer]);
    assert.strictEqual(pattern.rect.stub('attr').callCount, 2, 'pattern.rect\'s attr called twice');
    assert.deepEqual(pattern.rect.stub('attr').firstCall.args[0], { x: 0, y: 0, width: 6, height: 6 }, 'pattern.rect\'s attr first params');
    assert.deepEqual(pattern.rect.stub('attr').lastCall.args[0], { fill: 'red', opacity: undefined }, 'pattern.rect\'s attr second params');
    assert.strictEqual(pattern.rect.stub('css').callCount, 0, 'pattern.rect\'s css is not called');
    assert.strictEqual(pattern.rect.stub('append').callCount, 1, 'pattern.rect is appended');
    assert.equal(pattern.rect.stub('append').firstCall.args[0], pattern, 'pattern.rect is appended to pattern');

    assert.ok(pattern.path, 'pattern.path element is created');
    assert.ok(pattern.path instanceof renderers.PathSvgElement);
    assert.deepEqual(pattern.path.ctorArgs, [this.renderer]);
    assert.strictEqual(pattern.path.stub('attr').callCount, 1, 'pattern.path\'s attr called once');
    assert.deepEqual(pattern.path.stub('attr').firstCall.args[0], { d: 'M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9', 'stroke-width': 1, stroke: 'red' }, 'pattern.path\'s attr first params');
    assert.strictEqual(pattern.path.stub('css').callCount, 0, 'pattern.path\'s css is not called');
    assert.strictEqual(pattern.path.stub('append').callCount, 1, 'pattern.path is appended');
    assert.equal(pattern.path.stub('append').firstCall.args[0], pattern, 'pattern.path is appended to pattern');
});

QUnit.test('pattern, with right hatching', function(assert) {
    // act
    const pattern = this.renderer.pattern('red', { direction: 'RighT', width: 2, step: 3, opacity: 0.6 });

    // assert
    assert.ok(pattern, 'pattern element is created');
    assert.ok(pattern instanceof renderers.SvgElement);
    assert.strictEqual(pattern.id, 'DevExpressId', 'id is composed');
    assert.deepEqual(pattern.ctorArgs, [this.renderer, 'pattern', undefined]);
    assert.strictEqual(pattern.stub('attr').callCount, 1, 'pattern\'s attr called once');
    assert.deepEqual(pattern.stub('attr').firstCall.args[0], { id: 'DevExpressId', width: 3, height: 3, patternUnits: 'userSpaceOnUse' }, 'pattern\'s attr params');
    assert.strictEqual(pattern.stub('css').callCount, 0, 'pattern\'s css is not called');
    assert.strictEqual(pattern.stub('append').callCount, 1, 'pattern is appended');
    assert.equal(pattern.stub('append').firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'pattern is appended to defs');

    assert.ok(pattern.rect, 'pattern.rect element is created');
    assert.ok(pattern.rect instanceof renderers.RectSvgElement);
    assert.deepEqual(pattern.rect.ctorArgs, [this.renderer]);
    assert.strictEqual(pattern.rect.stub('attr').callCount, 2, 'pattern.rect\'s attr called twice');
    assert.deepEqual(pattern.rect.stub('attr').firstCall.args[0], { x: 0, y: 0, width: 3, height: 3 }, 'pattern.rect\'s attr first params');
    assert.deepEqual(pattern.rect.stub('attr').lastCall.args[0], { fill: 'red', opacity: 0.6 }, 'pattern.rect\'s attr second params');
    assert.strictEqual(pattern.rect.stub('css').callCount, 0, 'pattern.rect\'s css is not called');
    assert.strictEqual(pattern.rect.stub('append').callCount, 1, 'pattern.rect is appended');
    assert.equal(pattern.rect.stub('append').firstCall.args[0], pattern, 'pattern.rect is appended to pattern');

    assert.ok(pattern.path, 'pattern.path element is created');
    assert.ok(pattern.path instanceof renderers.PathSvgElement);
    assert.deepEqual(pattern.path.ctorArgs, [this.renderer]);
    assert.strictEqual(pattern.path.stub('attr').callCount, 1, 'pattern.path\'s attr called once');
    assert.deepEqual(pattern.path.stub('attr').firstCall.args[0], { d: 'M 1.5 -1.5 L -1.5 1.5 M 0 3 L 3 0 M 4.5 1.5 L 1.5 4.5', 'stroke-width': 2, stroke: 'red' }, 'pattern.path\'s attr first params');
    assert.strictEqual(pattern.path.stub('css').callCount, 0, 'pattern.path\'s css is not called');
    assert.strictEqual(pattern.path.stub('append').callCount, 1, 'pattern.path is appended');
    assert.equal(pattern.path.stub('append').firstCall.args[0], pattern, 'pattern.path is appended to pattern');
});

QUnit.test('pattern, with left hatching', function(assert) {
    // act
    const pattern = this.renderer.pattern('red', { direction: 'LefT', width: 2, step: 3, opacity: 0.6 });

    // assert
    assert.strictEqual(pattern.path.stub('attr').callCount, 1, 'pattern.path\'s attr called once');
    assert.strictEqual(pattern.path.stub('attr').firstCall.args[0].d, 'M 0 0 L 3 3 M -1.5 1.5 L 1.5 4.5 M 1.5 -1.5 L 4.5 1.5', 'pattern.path d param for left hatching');
});

QUnit.test('clipRect with params', function(assert) {
    // act
    const clipRect = this.renderer.clipRect(10, 20, 30, 40);

    // assert
    assert.ok(clipRect, 'clipRect element is created');
    assert.ok(clipRect instanceof renderers.RectSvgElement);
    // clipPath
    assert.ok(clipRect.clipPath, 'clipPath element is created');
    assert.ok(clipRect.clipPath instanceof renderers.SvgElement);
    assert.deepEqual(clipRect.clipPath.ctorArgs, [this.renderer, 'clipPath', undefined]);
    assert.strictEqual(clipRect.clipPath.stub('attr').callCount, 1, 'clipPath\'s attr called once');
    assert.deepEqual(clipRect.clipPath.stub('attr').firstCall.args[0], { id: 'DevExpressId' }, 'clipPath\'s attr params');
    assert.strictEqual(clipRect.clipPath.stub('css').callCount, 0, 'clipPath\'s css is not called');
    assert.strictEqual(clipRect.clipPath.stub('append').callCount, 1, 'clipPath is appended');
    assert.equal(clipRect.clipPath.stub('append').firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'clipPath is appended to defs');
    // clipRect
    assert.strictEqual(clipRect.id, 'DevExpressId', 'id is composed');
    assert.deepEqual(clipRect.ctorArgs, [this.renderer]);
    assert.strictEqual(clipRect.stub('attr').callCount, 1, 'clipRect\'s attr called once');
    assert.deepEqual(clipRect.stub('attr').firstCall.args[0], { x: 10, y: 20, width: 30, height: 40 }, 'clipRect\'s attr params');
    assert.strictEqual(clipRect.stub('css').callCount, 0, 'clipRect\'s css is not called');
    assert.strictEqual(clipRect.stub('append').callCount, 1, 'clipRect is appended');
    assert.equal(clipRect.stub('append').firstCall.args[0], clipRect.clipPath, 'clipRect is appended to defs');
});

QUnit.test('clipRect disposing', function(assert) {
    // arrange
    const clipRect = this.renderer.clipRect(10, 20, 30, 40);
    clipRect.clipPath.stub('dispose').reset();

    // act
    clipRect.dispose();

    // assert
    assert.ok(clipRect.clipPath.stub('dispose').called);
});

QUnit.test('shadowFilter with params', function(assert) {
    // arrange
    // act
    const shadow = this.renderer.shadowFilter(10, 20, 30, 40, 50, 60, 70, 'red', 0.6);

    // assert
    // main filter
    assert.ok(shadow, 'shadow element is created');
    assert.ok(shadow instanceof renderers.SvgElement);
    assert.strictEqual(shadow.id, 'DevExpressId');
    assert.deepEqual(shadow.ctorArgs, [this.renderer, 'filter', undefined]);
    assert.strictEqual(shadow.stub('attr').callCount, 1, 'shadow\'s attr called once');
    assert.deepEqual(shadow.stub('attr').firstCall.args[0], { id: 'DevExpressId', x: 10, y: 20, width: 30, height: 40 }, 'shadow\'s attr params');
    assert.strictEqual(shadow.stub('css').callCount, 0, 'shadow\'s css is not called');
    assert.strictEqual(shadow.stub('append').callCount, 1, 'shadow is appended');
    assert.equal(shadow.stub('append').firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'shadow is appended to defs');

    // feGaussianBlur
    assert.ok(shadow.gaussianBlur, 'shadow.gaussianBlur element is created');
    assert.ok(shadow.gaussianBlur instanceof renderers.SvgElement);
    assert.deepEqual(shadow.gaussianBlur.ctorArgs, [this.renderer, 'feGaussianBlur', undefined]);
    assert.strictEqual(shadow.gaussianBlur.stub('attr').callCount, 1, 'shadow.gaussianBlur\'s attr called once');
    assert.deepEqual(shadow.gaussianBlur.stub('attr').firstCall.args[0], { 'in': 'SourceGraphic', 'result': 'gaussianBlurResult', 'stdDeviation': 70 }, 'shadow.gaussianBlur\'s attr params');
    assert.strictEqual(shadow.gaussianBlur.stub('css').callCount, 0, 'shadow.gaussianBlur\'s css is not called');
    assert.strictEqual(shadow.gaussianBlur.stub('append').callCount, 1, 'shadow.gaussianBlur is appended');
    assert.equal(shadow.gaussianBlur.stub('append').firstCall.args[0], shadow, 'shadow.gaussianBlur is appended to defs');

    // feOffset
    assert.ok(shadow.offset, 'shadow.offset element is created');
    assert.ok(shadow.offset instanceof renderers.SvgElement);
    assert.deepEqual(shadow.offset.ctorArgs, [this.renderer, 'feOffset', undefined]);
    assert.strictEqual(shadow.offset.stub('attr').callCount, 1, 'shadow.offset\'s attr called once');
    assert.deepEqual(shadow.offset.stub('attr').firstCall.args[0], { 'in': 'gaussianBlurResult', 'result': 'offsetResult', 'dx': 50, 'dy': 60 }, 'shadow.offset\'s attr params');
    assert.strictEqual(shadow.offset.stub('css').callCount, 0, 'shadow.offset\'s css is not called');
    assert.strictEqual(shadow.offset.stub('append').callCount, 1, 'shadow.offset is appended');
    assert.equal(shadow.offset.stub('append').firstCall.args[0], shadow, 'shadow.offset is appended to defs');

    // feFlood
    assert.ok(shadow.flood, 'shadow.flood element is created');
    assert.ok(shadow.flood instanceof renderers.SvgElement);
    assert.deepEqual(shadow.flood.ctorArgs, [this.renderer, 'feFlood', undefined]);
    assert.strictEqual(shadow.flood.stub('attr').callCount, 1, 'shadow.flood\'s attr called once');
    assert.deepEqual(shadow.flood.stub('attr').firstCall.args[0], { 'result': 'floodResult', 'flood-color': 'red', 'flood-opacity': 0.6 }, 'shadow.flood\'s attr params');
    assert.strictEqual(shadow.flood.stub('css').callCount, 0, 'shadow.flood\'s css is not called');
    assert.strictEqual(shadow.flood.stub('append').callCount, 1, 'shadow.flood is appended');
    assert.equal(shadow.flood.stub('append').firstCall.args[0], shadow, 'shadow.flood is appended to defs');

    // feComposite
    assert.ok(shadow.composite, 'shadow.composite element is created');
    assert.ok(shadow.composite instanceof renderers.SvgElement);
    assert.deepEqual(shadow.composite.ctorArgs, [this.renderer, 'feComposite', undefined]);
    assert.strictEqual(shadow.composite.stub('attr').callCount, 1, 'shadow.composite\'s attr called once');
    assert.deepEqual(shadow.composite.stub('attr').firstCall.args[0], { 'in': 'floodResult', 'in2': 'offsetResult', 'operator': 'in', 'result': 'compositeResult' }, 'shadow.composite\'s attr params');
    assert.strictEqual(shadow.composite.stub('css').callCount, 0, 'shadow.composite\'s css is not called');
    assert.strictEqual(shadow.composite.stub('append').callCount, 1, 'shadow.composite is appended');
    assert.equal(shadow.composite.stub('append').firstCall.args[0], shadow, 'shadow.composite is appended to defs');

    // feComposite final
    assert.ok(shadow.finalComposite, 'shadow.finalComposite element is created');
    assert.ok(shadow.finalComposite instanceof renderers.SvgElement);
    assert.deepEqual(shadow.finalComposite.ctorArgs, [this.renderer, 'feComposite', undefined]);
    assert.strictEqual(shadow.finalComposite.stub('attr').callCount, 1, 'shadow.finalComposite\'s attr called once');
    assert.deepEqual(shadow.finalComposite.stub('attr').firstCall.args[0], { 'in': 'SourceGraphic', 'in2': 'compositeResult', 'operator': 'over' }, 'shadow.finalComposite\'s attr params');
    assert.strictEqual(shadow.finalComposite.stub('css').callCount, 0, 'shadow.finalComposite\'s css is not called');
    assert.strictEqual(shadow.finalComposite.stub('append').callCount, 1, 'shadow.finalComposite is appended');
    assert.equal(shadow.finalComposite.stub('append').firstCall.args[0], shadow, 'shadow.finalComposite is appended to defs');
});

QUnit.test('shadowFilter change filter attr function (full list of params)', function(assert) {
    // arrange
    const shadow = this.renderer.shadowFilter(10, 20, 30, 40, 50, 60, 70, 'red', 0.6);
    let result;
    shadow.gaussianBlur.stub('attr').reset();
    shadow.offset.stub('attr').reset();
    shadow.flood.stub('attr').reset();
    shadow.element.setAttribute = sinon.spy();

    // act
    result = shadow.attr({ x: 100, y: 200, width: 300, height: 400, offsetX: 500, offsetY: 600, blur: 700, color: 'green', opacity: 0.9 });

    // assert
    // main filter
    assert.equal(result, shadow);
    assert.equal(shadow.element.setAttribute.callCount, 4);
    assert.deepEqual(shadow.element.setAttribute.withArgs('x').lastCall.args, ['x', 100]);
    assert.deepEqual(shadow.element.setAttribute.withArgs('y').lastCall.args, ['y', 200]);
    assert.deepEqual(shadow.element.setAttribute.withArgs('width').lastCall.args, ['width', 300]);
    assert.deepEqual(shadow.element.setAttribute.withArgs('height').lastCall.args, ['height', 400]);

    // feGaussianBlur
    assert.strictEqual(shadow.gaussianBlur.stub('attr').callCount, 1, 'shadow.gaussianBlur\'s attr called once');
    assert.deepEqual(shadow.gaussianBlur.stub('attr').firstCall.args[0], { 'stdDeviation': 700 }, 'shadow.gaussianBlur\'s attr params');

    // feOffset
    assert.strictEqual(shadow.offset.stub('attr').callCount, 1, 'shadow.offset\'s attr called once');
    assert.deepEqual(shadow.offset.stub('attr').firstCall.args[0], { 'dx': 500, 'dy': 600 }, 'shadow.offset\'s attr params');

    // feFlood
    assert.strictEqual(shadow.flood.stub('attr').callCount, 1, 'shadow.flood\'s attr called once');
    assert.deepEqual(shadow.flood.stub('attr').firstCall.args[0], { 'flood-color': 'green', 'flood-opacity': 0.9 }, 'shadow.flood\'s attr params');
});

QUnit.test('shadowFilter change filter attr function (short list of params)', function(assert) {
    // arrange
    const shadow = this.renderer.shadowFilter(10, 20, 30, 40, 50, 60, 70, 'red', 0.6);
    let result;
    shadow.gaussianBlur.stub('attr').reset();
    shadow.offset.stub('attr').reset();
    shadow.flood.stub('attr').reset();
    shadow.element.setAttribute = sinon.spy();

    // act
    result = shadow.attr({ width: 300, height: 400, offsetY: 600, opacity: 0.9 });

    // assert
    // main filter
    assert.equal(result, shadow);
    assert.equal(shadow.element.setAttribute.callCount, 2);
    assert.deepEqual(shadow.element.setAttribute.withArgs('width').lastCall.args, ['width', 300]);
    assert.deepEqual(shadow.element.setAttribute.withArgs('height').lastCall.args, ['height', 400]);

    // feGaussianBlur
    assert.strictEqual(shadow.gaussianBlur.stub('attr').callCount, 0, 'shadow.gaussianBlur\'s attr is not called');

    // feOffset
    assert.strictEqual(shadow.offset.stub('attr').callCount, 1, 'shadow.offset\'s attr called once');
    assert.deepEqual(shadow.offset.stub('attr').firstCall.args[0], { 'dy': 600 }, 'shadow.offset\'s attr params');

    // feFlood
    assert.strictEqual(shadow.flood.stub('attr').callCount, 1, 'shadow.flood\'s attr called once');
    assert.deepEqual(shadow.flood.stub('attr').firstCall.args[0], { 'flood-opacity': 0.9 }, 'shadow.flood\'s attr params');
});

QUnit.test('brightFilter', function(assert) {
    const filter = this.renderer.brightFilter();

    assert.ok(filter instanceof renderers.SvgElement);
    assert.deepEqual(filter.ctorArgs, [this.renderer, 'filter', undefined]);
    assert.deepEqual(filter.attr.lastCall.args, [{ id: 'DevExpressId' }]);
    assert.strictEqual(filter.id, 'DevExpressId');
});

QUnit.test('brightFilter. create elements', function(assert) {
    this.renderer.brightFilter();

    assert.equal(renderers.SvgElement.getCall(2).returnValue.ctorArgs[1], 'filter', 'filter');
    assert.equal(renderers.SvgElement.getCall(3).returnValue.ctorArgs[1], 'feComponentTransfer', 'feComponentTransfer');
    assert.equal(renderers.SvgElement.getCall(4).returnValue.ctorArgs[1], 'feFuncR', 'feFuncR creation');
    assert.equal(renderers.SvgElement.getCall(5).returnValue.ctorArgs[1], 'feFuncG', 'feFuncG creation');
    assert.equal(renderers.SvgElement.getCall(6).returnValue.ctorArgs[1], 'feFuncB', 'feFuncB creation');
});

QUnit.test('brightFilter. appending filter elements', function(assert) {
    this.renderer.brightFilter();

    assert.strictEqual(renderers.SvgElement.getCall(2).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'filter');
    assert.strictEqual(renderers.SvgElement.getCall(3).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(2).returnValue, 'feComponentTransfer');
    assert.strictEqual(renderers.SvgElement.getCall(4).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(3).returnValue, 'feFuncR');
    assert.strictEqual(renderers.SvgElement.getCall(5).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(3).returnValue, 'feFuncG');
    assert.strictEqual(renderers.SvgElement.getCall(6).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(3).returnValue, 'feFuncB');
});

QUnit.test('brightFilter. applying settings', function(assert) {
    this.renderer.brightFilter('someType', 2);

    assert.deepEqual(renderers.SvgElement.getCall(4).returnValue.attr.lastCall.args, [{ type: 'someType', slope: 2 }]);
    assert.deepEqual(renderers.SvgElement.getCall(5).returnValue.attr.lastCall.args, [{ type: 'someType', slope: 2 }]);
    assert.deepEqual(renderers.SvgElement.getCall(6).returnValue.attr.lastCall.args, [{ type: 'someType', slope: 2 }]);
});

QUnit.test('getGrayScaleFilter. first time creation', function(assert) {
    const filter = this.renderer.getGrayScaleFilter();

    assert.ok(filter instanceof renderers.SvgElement);
    assert.deepEqual(filter.ctorArgs, [this.renderer, 'filter', undefined]);
    assert.deepEqual(filter.attr.lastCall.args, [{ id: 'DevExpressId' }]);
    assert.strictEqual(filter.id, 'DevExpressId');
    assert.equal(filter.stub('append').firstCall.args[0], renderers.SvgElement.getCall(1).returnValue, 'shadow is appended to defs');

    assert.equal(renderers.SvgElement.getCall(3).returnValue.ctorArgs[1], 'feColorMatrix', 'feColorMatrix');
    assert.strictEqual(renderers.SvgElement.getCall(3).returnValue.append.firstCall.args[0], renderers.SvgElement.getCall(2).returnValue, 'feColorMatrix');
    assert.deepEqual(renderers.SvgElement.getCall(3).returnValue.attr.lastCall.args, [{ type: 'matrix', values: '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0' }]);
});

QUnit.test('getGrayScaleFilter. call twice - only one filter created', function(assert) {
    const filter = this.renderer.getGrayScaleFilter();
    const id = filter.id;
    let filter2;

    filter2 = this.renderer.getGrayScaleFilter();

    assert.equal(filter2.id, id);
    assert.equal(filter.stub('append').callCount, 1);
});

QUnit.test('path without params', function(assert) {
    // arrange

    // act
    const path = this.renderer.path();

    // assert
    assert.ok(path, 'path element is created');
    assert.ok(path instanceof renderers.PathSvgElement);
    assert.deepEqual(path.ctorArgs, [this.renderer, undefined]);
    assert.strictEqual(path.stub('attr').callCount, 1, 'path\'s attr called once');
    assert.deepEqual(path.stub('attr').firstCall.args[0], { points: [] }, 'path\'s attr params');
    assert.strictEqual(path.stub('css').callCount, 0, 'path\'s css is not called');
    assert.strictEqual(path.stub('append').callCount, 0, 'path is not appended');
});

QUnit.test('path with params', function(assert) {
    // arrange
    const points = [10, 20];

    // act
    const path = this.renderer.path(points, 'bezier');

    // assert
    assert.ok(path, 'path element is created');
    assert.ok(path instanceof renderers.PathSvgElement);
    assert.deepEqual(path.ctorArgs, [this.renderer, 'bezier']);
    assert.strictEqual(path.stub('attr').callCount, 1, 'path\'s attr called once');
    assert.deepEqual(path.stub('attr').firstCall.args[0], { points: [10, 20] }, 'path\'s attr params');
    assert.strictEqual(path.stub('css').callCount, 0, 'path\'s css is not called');
    assert.strictEqual(path.stub('append').callCount, 0, 'path is not appended');
});

QUnit.test('arc without params', function(assert) {
    // arrange

    // act
    const arc = this.renderer.arc();

    // assert
    assert.ok(arc, 'arc element is created');
    assert.ok(arc instanceof renderers.ArcSvgElement);
    assert.deepEqual(arc.ctorArgs, [this.renderer]);
    assert.strictEqual(arc.stub('attr').callCount, 1, 'arc\'s attr called once');
    assert.deepEqual(arc.stub('attr').firstCall.args[0], {
        x: 0,
        y: 0,
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0
    }, 'arc\'s attr params');
    assert.strictEqual(arc.stub('css').callCount, 0, 'arc\'s css is not called');
    assert.strictEqual(arc.stub('append').callCount, 0, 'arc is not appended');
});

QUnit.test('arc with params', function(assert) {
    // arrange

    // act
    const arc = this.renderer.arc(1000, 2000, 50, 100, 90, 180);

    // assert
    assert.ok(arc, 'arc element is created');
    assert.ok(arc instanceof renderers.ArcSvgElement);
    assert.deepEqual(arc.ctorArgs, [this.renderer]);
    assert.strictEqual(arc.stub('attr').callCount, 1, 'arc\'s attr called once');
    assert.deepEqual(arc.stub('attr').firstCall.args[0], {
        x: 1000,
        y: 2000,
        innerRadius: 50,
        outerRadius: 100,
        startAngle: 90,
        endAngle: 180
    }, 'arc\'s attr params');
    assert.strictEqual(arc.stub('css').callCount, 0, 'arc\'s css is not called');
    assert.strictEqual(arc.stub('append').callCount, 0, 'arc is not appended');
});

QUnit.test('text without params', function(assert) {
    // arrange

    // act
    const text = this.renderer.text();

    // assert
    assert.ok(text, 'text element is created');
    assert.ok(text instanceof renderers.TextSvgElement);
    assert.deepEqual(text.ctorArgs, [this.renderer]);
    assert.strictEqual(text.stub('attr').callCount, 1, 'text\'s attr called once');
    assert.deepEqual(text.stub('attr').firstCall.args[0], { text: undefined, x: 0, y: 0 }, 'text attr\'s param');
    assert.strictEqual(text.stub('css').callCount, 0, 'text\'s css is not called');
    assert.strictEqual(text.stub('append').callCount, 0, 'text is not appended');
});

QUnit.test('text with params', function(assert) {
    // arrange

    // act
    const text = this.renderer.text('simple text', 10, 20);

    // assert
    assert.ok(text, 'text element is created');
    assert.ok(text instanceof renderers.TextSvgElement);
    assert.deepEqual(text.ctorArgs, [this.renderer]);
    assert.strictEqual(text.stub('attr').callCount, 1, 'text\'s attr called once');
    assert.deepEqual(text.stub('attr').firstCall.args[0], { text: 'simple text', x: 10, y: 20 }, 'text attr\'s param');
    assert.strictEqual(text.stub('css').callCount, 0, 'text\'s css is not called');
    assert.strictEqual(text.stub('append').callCount, 0, 'text is not appended');
});

QUnit.test('text with params. text argument is 0', function(assert) {
    // arrange

    // act
    const text = this.renderer.text(0, 10, 20);

    // assert
    assert.ok(text, 'text element is created');
    assert.ok(text instanceof renderers.TextSvgElement);
    assert.deepEqual(text.ctorArgs, [this.renderer]);
    assert.strictEqual(text.stub('attr').callCount, 1, 'text\'s attr called once');
    assert.deepEqual(text.stub('attr').firstCall.args[0], { text: 0, x: 10, y: 20 }, 'text attr\'s param');
    assert.strictEqual(text.stub('css').callCount, 0, 'text\'s css is not called');
    assert.strictEqual(text.stub('append').callCount, 0, 'text is not appended');
});

QUnit.test('text with params. text argument is null', function(assert) {
    // arrange

    // act
    const text = this.renderer.text(null, 10, 20);

    // assert
    assert.ok(text, 'text element is created');
    assert.ok(text instanceof renderers.TextSvgElement);
    assert.deepEqual(text.ctorArgs, [this.renderer]);
    assert.strictEqual(text.stub('attr').callCount, 1, 'text\'s attr called once');
    assert.deepEqual(text.stub('attr').firstCall.args[0], { text: null, x: 10, y: 20 }, 'text attr\'s param');
    assert.strictEqual(text.stub('css').callCount, 0, 'text\'s css is not called');
    assert.strictEqual(text.stub('append').callCount, 0, 'text is not appended');
});
QUnit.module('Hatching', {
    before: setMockElements,

    beforeEach: function() {
        const container = document.createElement('div');
        this.renderer = new Renderer({ container: container });
        this.renderer.initHatching();
    },

    after: resetMockElements
});

QUnit.test('lock', function(assert) {
    assert.strictEqual(this.renderer.lockHatching('red', { direction: 'left' }), 'DevExpressId-hatching-0', '1');
    assert.strictEqual(renderers.SvgElement.callCount, 3, 'patterns');
});

QUnit.test('lock / different pattern', function(assert) {
    assert.strictEqual(this.renderer.lockHatching('red', { direction: 'left' }), 'DevExpressId-hatching-0', '1');
    assert.strictEqual(this.renderer.lockHatching('blue', { direction: 'left' }), 'DevExpressId-hatching-1', '2');
    assert.strictEqual(renderers.SvgElement.callCount, 4, 'patterns');
});

QUnit.test('lock / same pattern', function(assert) {
    assert.strictEqual(this.renderer.lockHatching('red', { direction: 'left' }), 'DevExpressId-hatching-0', '1');
    assert.strictEqual(this.renderer.lockHatching('red', { direction: 'left' }), 'DevExpressId-hatching-0', '2');
    assert.strictEqual(renderers.SvgElement.callCount, 3, 'patterns');
});

QUnit.test('unlock', function(assert) {
    this.renderer.lockHatching('red', { direction: 'left' });
    this.renderer.releaseHatching('DevExpressId-hatching-0');
    assert.strictEqual(renderers.SvgElement.returnValues[2].dispose.callCount, 1, 'pattern');
});

QUnit.test('unlock / several references', function(assert) {
    this.renderer.lockHatching('red', { direction: 'left' });
    this.renderer.lockHatching('red', { direction: 'left' });
    this.renderer.releaseHatching('DevExpressId-hatching-0');
    assert.strictEqual(renderers.SvgElement.returnValues[2].stub('dispose').callCount, 0, 'pattern');
});

QUnit.test('init', function(assert) {
    this.renderer.lockHatching('red', { direction: 'left' });
    this.renderer.lockHatching('blue', { direction: 'left' });
    this.renderer.initHatching();
    assert.strictEqual(renderers.SvgElement.returnValues[2].dispose.callCount, 1, 'pattern 1');
    assert.strictEqual(renderers.SvgElement.returnValues[3].dispose.callCount, 1, 'pattern 2');
});

QUnit.test('release after init', function(assert) {
    this.renderer.initHatching();
    this.renderer.releaseHatching('DevExpressId-hatching-0');
    assert.ok(true);
});

if('pushState' in history) {
    QUnit.module('SvgElement. FuncIRI', {
        beforeEach: function() {
            this.refreshPaths = renderers.refreshPaths;
            this.originalUrl = window.location.href;
        },
        afterEach: function() {
            history.pushState('', document.title, this.originalUrl);
        },

        createRenderer: function(pathModified) {
            return new renderers.Renderer({
                container: document.createElement('div'),
                pathModified: pathModified
            });
        }
    });

    QUnit.test('FixPath API. Do not fix IRIs on disposed elements', function(assert) {
        // arrange
        const renderer = this.createRenderer(true);
        const element = renderer.rect(0, 0, 0, 0).attr({
            'fill': 'DevExpress_12'
        }).append(renderer.root);

        const href = window.location.href;
        const oldUrl = href.split('#')[0];
        const newUrl = href.split('?')[0] + '?testparam=2';

        window.history.pushState('', document.title, newUrl);

        renderer.dispose();

        // act
        this.refreshPaths();

        // assert
        assert.strictEqual(element.element.getAttribute('fill'), 'url(' + oldUrl + '#DevExpress_12)');
    });
}
