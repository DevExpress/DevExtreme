import jQuery from 'jquery';
import typeUtils from 'core/utils/type';
import rendererModule from 'viz/core/renderers/renderer';
import coreRenderer from 'core/renderer';
import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';
import Color from 'color';

let $ = jQuery;

function isFirefoxOnLinux() {
    const ua = navigator.userAgent;
    return /firefox/i.test(ua) && /linux/i.test(ua);
}

function colorEqual(actual, expected, message) {
    const hexActual = new Color(actual).toHex();
    const hexExpected = new Color(expected).toHex();
    this.pushResult({
        result: hexActual === hexExpected,
        actual: hexActual,
        expected: hexExpected === expected ? hexExpected : hexExpected + ' (' + expected + ')',
        message: message
    });
}


$('<div>')
    .attr('id', 'qunit-fixture')
    .css({ width: 300, height: 300 })
    .appendTo($('body'));

function checkDashStyle(assert, elem, result, style, value) {
    assert.equal(result, elem);
    assert.ok(!elem.element.getAttribute('dashStyle'));
    assert.strictEqual((elem.element.getAttribute('stroke-dasharray') || 'none').replace(/\s/g, '').replace(/px/g, ''), value.replace(/\s/g, ''));
    assert.strictEqual(elem._settings['dashStyle'], style);
}

(function SvgElement_functionality() {
    QUnit.module('SvgElement common API', {
        beforeEach: function() {
            this.Element = rendererModule.SvgElement;
            this.rendererStub = { fake: 'fake', root: { element: document.createElement('div') } };
        }
    });

    QUnit.test('Creation', function(assert) {
        // arrange

        // act
        const elem = new this.Element(this.rendererStub, 'svg');

        // assert
        assert.ok(elem);
        assert.ok(elem instanceof this.Element);
        assert.ok(elem.element);
        assert.ok(elem.renderer);
        assert.equal(elem.renderer, this.rendererStub);
        assert.equal(elem.element.tagName, 'svg');

        // assert.equal(elem._$element.get(0), elem.element);
    });

    QUnit.test('Append to another SvgElement', function(assert) {
        // arrange
        const elem = new this.Element(this.rendererStub, 'svg');
        const anotherElement = { element: document.createElement('div') };

        // act
        const result = elem.append(anotherElement);

        // assert
        assert.equal(result, elem);
        assert.equal(anotherElement.element.childNodes.length, 1);
        assert.equal(anotherElement.element.childNodes[0], elem.element);
        assert.equal(elem.element.childNodes.length, 0);
    });

    // TODO backward compatibility
    QUnit.test('Append to undefined parent. backward compatibility!!!', function(assert) {
        // arrange
        const elem = new this.Element(this.rendererStub, 'svg');

        // act
        const result = elem.append();

        // assert
        assert.equal(result, elem);
        assert.equal(this.rendererStub.root.element.childNodes.length, 1);
        assert.equal(this.rendererStub.root.element.childNodes[0], elem.element);
        assert.equal(elem.element.childNodes.length, 0);
    });

    QUnit.test('Remove', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const elem1 = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem2 = (new this.Element(this.rendererStub, 'svg')).append(parent);

        // act
        const result = elem1.remove();

        // assert
        assert.equal(result, elem1);
        assert.equal(parent.element.childNodes.length, 1);
        assert.equal(parent.element.childNodes[0], elem2.element);
    });

    // Though it is private method it is tested in order to test links functionality (where it is only used) in a platform agnostic way
    QUnit.test('Insert', function(assert) {
        const element = new this.Element(this.rendererStub, 'svg');
        const parent = { element: document.createElement('div') };
        parent.element.appendChild(document.createElement('div'));
        parent.element.appendChild(document.createElement('div'));
        parent.element.appendChild(document.createElement('div'));

        element._insert(parent, { element: parent.element.childNodes[2] });

        assert.strictEqual(parent.element.childNodes[2], element.element, 'position');
    });

    QUnit.test('toForeground', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };

        const elem1 = (new this.Element(this.rendererStub, 'svg')).append(parent);
        (new this.Element(this.rendererStub, 'svg')).append(parent);
        (new this.Element(this.rendererStub, 'svg')).append(parent);

        // act
        const result = elem1.toForeground();

        // assert
        assert.equal(result, elem1);
        assert.equal(parent.element.childNodes.length, 3);
        assert.equal(parent.element.childNodes[2], elem1.element);
    });

    QUnit.test('toBackground', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };

        (new this.Element(this.rendererStub, 'svg')).append(parent);
        (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem3 = (new this.Element(this.rendererStub, 'svg')).append(parent);

        // act
        const result = elem3.toBackground();

        // assert
        assert.equal(result, elem3);
        assert.equal(parent.element.childNodes.length, 3);
        assert.equal(parent.element.childNodes[0], elem3.element);
    });

    QUnit.test('Move', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect4 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect5 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect6 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        rect1.attr = sinon.spy(); rect1.animate = sinon.spy();
        rect2.attr = sinon.spy(); rect2.animate = sinon.spy();
        rect3.attr = sinon.spy(); rect3.animate = sinon.spy();
        rect4.attr = sinon.spy(); rect4.animate = sinon.spy();
        rect5.attr = sinon.spy(); rect5.animate = sinon.spy();
        rect6.attr = sinon.spy(); rect6.animate = sinon.spy();

        // act
        const result1 = rect1.move();
        const result2 = rect2.move(10, 20);
        const result3 = rect3.move(10, 20, true);
        const result4 = rect4.move(10, 20, true, { a: 'ff' });
        const result5 = rect5.move(10);
        const result6 = rect6.move(undefined, 10);

        // assert
        assert.equal(result1, rect1);
        assert.ok(rect1.attr.calledOnce);
        assert.deepEqual(rect1.attr.firstCall.args[0], {});
        assert.strictEqual(rect1.animate.callCount, 0);

        assert.equal(result2, rect2);
        assert.ok(rect2.attr.calledOnce);
        assert.deepEqual(rect2.attr.firstCall.args[0], { translateX: 10, translateY: 20 });
        assert.strictEqual(rect2.animate.callCount, 0);

        assert.equal(result3, rect3);
        assert.ok(rect3.animate.calledOnce);
        assert.deepEqual(rect3.animate.firstCall.args[0], { translateX: 10, translateY: 20 });
        assert.deepEqual(rect3.animate.firstCall.args[1], undefined);
        assert.strictEqual(rect3.attr.callCount, 0);

        assert.equal(result4, rect4);
        assert.ok(rect4.animate.calledOnce);
        assert.deepEqual(rect4.animate.firstCall.args[0], { translateX: 10, translateY: 20 });
        assert.deepEqual(rect4.animate.firstCall.args[1], { a: 'ff' });
        assert.strictEqual(rect4.attr.callCount, 0);

        assert.equal(result5, rect5);
        assert.ok(rect5.attr.calledOnce);
        assert.deepEqual(rect5.attr.firstCall.args[0], { translateX: 10 });
        assert.strictEqual(rect5.animate.callCount, 0);

        assert.equal(result6, rect6);
        assert.ok(rect6.attr.calledOnce);
        assert.deepEqual(rect6.attr.firstCall.args[0], { translateY: 10 });
        assert.strictEqual(rect6.animate.callCount, 0);
    });

    QUnit.test('Rotate', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect4 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect5 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect6 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect7 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        rect1.attr = sinon.spy(); rect1.animate = sinon.spy();
        rect2.attr = sinon.spy(); rect2.animate = sinon.spy();
        rect3.attr = sinon.spy(); rect3.animate = sinon.spy();
        rect4.attr = sinon.spy(); rect4.animate = sinon.spy();
        rect5.attr = sinon.spy(); rect5.animate = sinon.spy();
        rect6.attr = sinon.spy(); rect6.animate = sinon.spy();
        rect7.attr = sinon.spy(); rect7.animate = sinon.spy();

        // act
        const result1 = rect1.rotate();
        const result2 = rect2.rotate(10, 20, 30);
        const result3 = rect3.rotate(10, 20, 30, true);
        const result4 = rect4.rotate(10, 20, 30, true, { a: 'ff' });
        const result5 = rect5.rotate(10);
        const result6 = rect6.rotate(10, 20);
        const result7 = rect7.rotate(10, undefined, 20);

        // assert
        assert.equal(result1, rect1);
        assert.ok(rect1.attr.calledOnce);
        assert.deepEqual(rect1.attr.firstCall.args[0], { rotate: 0 });
        assert.strictEqual(rect1.animate.callCount, 0);

        assert.equal(result2, rect2);
        assert.ok(rect2.attr.calledOnce);
        assert.deepEqual(rect2.attr.firstCall.args[0], { rotate: 10, rotateX: 20, rotateY: 30 });
        assert.strictEqual(rect2.animate.callCount, 0);

        assert.equal(result3, rect3);
        assert.ok(rect3.animate.calledOnce);
        assert.deepEqual(rect3.animate.firstCall.args[0], { rotate: 10, rotateX: 20, rotateY: 30 });
        assert.deepEqual(rect3.animate.firstCall.args[1], undefined);
        assert.strictEqual(rect3.attr.callCount, 0);

        assert.equal(result4, rect4);
        assert.ok(rect4.animate.calledOnce);
        assert.deepEqual(rect4.animate.firstCall.args[0], { rotate: 10, rotateX: 20, rotateY: 30 });
        assert.deepEqual(rect4.animate.firstCall.args[1], { a: 'ff' });
        assert.strictEqual(rect4.attr.callCount, 0);

        assert.equal(result5, rect5);
        assert.ok(rect5.attr.calledOnce);
        assert.deepEqual(rect5.attr.firstCall.args[0], { rotate: 10 });
        assert.strictEqual(rect5.animate.callCount, 0);

        assert.equal(result6, rect6);
        assert.ok(rect6.attr.calledOnce);
        assert.deepEqual(rect6.attr.firstCall.args[0], { rotate: 10, rotateX: 20 });
        assert.strictEqual(rect6.animate.callCount, 0);

        assert.equal(result7, rect7);
        assert.ok(rect7.attr.calledOnce);
        assert.deepEqual(rect7.attr.firstCall.args[0], { rotate: 10, rotateY: 20 });
        assert.strictEqual(rect7.animate.callCount, 0);
    });

    QUnit.test('getOffset', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        $('#qunit-fixture').append(parent);

        // act
        const offset = svg.getOffset();

        // assert
        assert.deepEqual(offset, $(svg.element).offset());

    });

    QUnit.test('setTitle', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect.setTitle('test');

        assert.equal(rect.element.childNodes.length, 1);
        assert.equal(rect.element.childNodes[0].tagName, 'title');
        assert.equal(rect.element.childNodes[0].textContent, 'test');
    });

    QUnit.test('removeTitle', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect.setTitle('test');
        rect.removeTitle();

        assert.equal(rect.element.childNodes.length, 0);
    });

    QUnit.test('Sharp', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const root = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem = (new this.Element(this.rendererStub, 'g')).attr({ x: 1, y: 2, width: 3, height: 4, 'stroke-width': 5 }).append(root);

        elem.attr = sinon.spy(function() { return this; });

        // act
        const result = elem.sharp();

        // assert
        assert.equal(result, elem);
        assert.deepEqual(elem.attr.callCount, 1);
        assert.deepEqual(elem.attr.firstCall.args, [{ sharp: true, sharpDirection: undefined }]);
    });

    QUnit.test('Sharp with parameter', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const root = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem = (new this.Element(this.rendererStub, 'g')).attr({ x: 1, y: 2, width: 3, height: 4, 'stroke-width': 5 }).append(root);

        elem.attr = sinon.spy(function() { return this; });

        // act
        const result = elem.sharp('h', -1);

        // assert
        assert.equal(result, elem);
        assert.deepEqual(elem.attr.callCount, 1);
        assert.deepEqual(elem.attr.firstCall.args, [{ sharp: 'h', sharpDirection: -1 }]);
    });

    QUnit.test('Data, object', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.data({ key1: 'value1', key2: 'value2' });

        // assert
        assert.equal(result, elem);
        assert.equal(elem.element.key1, 'value1');
        assert.equal(elem.element.key2, 'value2');
    });

    QUnit.test('Data, key_value', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.data('key1', 'value1');

        // assert
        assert.equal(result, elem);
        assert.equal(elem.element.key1, 'value1');
    });

    QUnit.test('smartAttr', function(assert) {
        const lock = this.rendererStub.lockDefsElements = sinon.stub().returns('test-pattern');
        const element = (new this.Element(this.rendererStub, 'rect'));
        const attr = { fill: 'red', hatching: { direction: 'left' } };

        element.smartAttr(attr);

        assert.deepEqual(element._settings, { fill: 'test-pattern' }, 'attrs');
        assert.deepEqual(lock.lastCall.args, [{
            color: attr.fill, hatching: attr.hatching
        }, undefined, 'pattern'], 'lock');
    });

    QUnit.test('smartAttr / no hatching', function(assert) {
        const lock = this.rendererStub.lockDefsElements = sinon.spy();
        const element = (new this.Element(this.rendererStub, 'rect'));

        element.smartAttr({ fill: 'red' });

        assert.deepEqual(element._settings, { fill: 'red' }, 'attrs');
        assert.strictEqual(lock.lastCall, null, 'lock');
    });

    QUnit.test('smartAttr with \'none\' hatching', function(assert) {
        const lock = this.rendererStub.lockDefsElements = sinon.stub().returns('test-pattern');
        const element = (new this.Element(this.rendererStub, 'rect'));

        element.smartAttr({ fill: 'red', hatching: { direction: 'NoNe' } });

        assert.deepEqual(element._settings, { fill: 'red' }, 'attrs');
        assert.ok(!lock.called, 'lock');
    });

    QUnit.test('smartAttr / no hatching and previous hatching', function(assert) {
        const release = this.rendererStub.releaseDefsElements = sinon.spy();
        const element = (new this.Element(this.rendererStub, 'rect'));
        this.rendererStub.lockDefsElements = function() { return 'test-pattern'; };
        element.smartAttr({ fill: 'red', hatching: { direction: 'left' } });

        element.smartAttr({ fill: 'blue' });

        assert.deepEqual(element._settings, { fill: 'blue' }, 'attrs');
        assert.deepEqual(release.lastCall.args, ['test-pattern'], 'release');
    });

    QUnit.test('smartAttr / no change passed args', function(assert) {
        const element = (new this.Element(this.rendererStub, 'rect'));
        const attrs = { fill: 'red', hatching: { direction: 'left' } };

        this.rendererStub.lockDefsElements = function() { return 'test-pattern'; };

        element.smartAttr(attrs);

        assert.deepEqual(attrs.fill, 'red');
        assert.strictEqual(attrs.hatching.direction, 'left');
    });

    QUnit.test('smartAttr / apply attrs', function(assert) {
        const element = (new this.Element(this.rendererStub, 'rect'));
        const attrs = { fill: 'red', stroke: 'green' };

        this.rendererStub.lockDefsElements = function() { return 'test-pattern'; };
        element.attr = sinon.spy();

        element.smartAttr(attrs);

        assert.deepEqual(element.attr.lastCall.args, [{ fill: 'red', stroke: 'green' }]);
    });

    QUnit.test('smartAttr, filter', function(assert) {
        const lock = this.rendererStub.lockDefsElements = sinon.stub().returns('test-pattern');
        const element = (new this.Element(this.rendererStub, 'rect'));

        element.smartAttr({ fill: 'red', filter: true });

        assert.deepEqual(element._settings, { fill: 'red', filter: 'test-pattern' }, 'attrs');
        assert.deepEqual(lock.lastCall.args, [{}, undefined, 'filter'], 'lock');
    });

    QUnit.test('smartAttr, dispose filter', function(assert) {
        const release = this.rendererStub.releaseDefsElements = sinon.spy();
        this.rendererStub.lockDefsElements = sinon.stub().returns('test-pattern');
        const element = (new this.Element(this.rendererStub, 'rect'));

        element.smartAttr({ filter: true });
        element.smartAttr({ filter: false });

        assert.deepEqual(release.lastCall.args, ['test-pattern'], 'release');
    });

    QUnit.test('smartAttr should not raise exception when filter applied on element with hatching', function(assert) {
        this.rendererStub.lockDefsElements = sinon.stub().returns('test-pattern');
        this.rendererStub.releaseDefsElements = sinon.spy();
        const element = (new this.Element(this.rendererStub, 'rect'));
        const hatchingAttrs = { fill: 'red', hatching: { direction: 'left' } };
        const filterAttrs = { filter: true };

        element.smartAttr(hatchingAttrs);

        try {
            element.smartAttr(filterAttrs);
            assert.strictEqual(Object.hasOwnProperty.call(filterAttrs, 'filter'), false);
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        }
    });

    QUnit.module('SvgElement markup method');

    QUnit.test('Returns correct namespaces (IE specific problem)', function(assert) {
        function mapFromStr(str) {
            const map = {};
            str.split('>').forEach(function(s) {
                s.split('<').forEach(function(s) {
                    s.split(' ').forEach(function(s) {
                        if(s) {
                            map[s] = (map[s] || 0) + 1;
                        }
                    });
                });
            });
            return map;
        }
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new rendererModule.SvgElement({}, 'svg')).append(parent);
        $('#qunit-fixture').append(parent);

        svg.element.appendChild(document.createTextNode('Some content'));

        svg.attr({
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            version: '1.1'
        });

        // act
        const markupString = svg.markup();

        // assert
        assert.deepEqual(mapFromStr(markupString), mapFromStr('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">Some content</svg>'));
    });

    QUnit.test('Can return markup on detached element', function(assert) {
        // arrange
        const svg = (new rendererModule.SvgElement({}, 'svg'));

        svg.element.appendChild(document.createTextNode('Some content'));

        svg.attr({
            xmlns: 'http://www.w3.org/2000/svg'
        });

        // act
        const markupString = svg.markup();

        // assert
        assert.strictEqual(markupString.replace(/\s*/g, ''), '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">Some content</svg>'.replace(/\s*/g, ''));
    });

    QUnit.test('HTML entities presented as numeric code', function(assert) {
        // arrange
        const svg = (new rendererModule.SvgElement({}, 'svg'));
        const text = (new rendererModule.TextSvgElement({})).append(svg);

        text.attr({ text: '&amp;&lt;&gt;&nbsp; &copy;&Oslash;' });

        // act
        const markupString = svg.markup();

        // assert
        assert.notStrictEqual(markupString.indexOf('&#38;&#60;&#62;&#160; ©Ø'), -1);
    });

    QUnit.test('Change multiple entries of entity to numeric code', function(assert) {
        // arrange
        const svg = (new rendererModule.SvgElement({}, 'svg'));
        const text = (new rendererModule.TextSvgElement({})).append(svg);
        text.attr({ text: '1&nbsp;2&nbsp;3' });

        // act
        const markupString = svg.markup();

        // assert
        assert.notStrictEqual(markupString.indexOf('1&#160;2&#160;3'), -1);
    });

    QUnit.module('SvgElement jQuery API', {
        beforeEach: function() {
            const renderer = rendererModule;

            this.Element = renderer.SvgElement;

            this.jQuery = $;
            $ = coreRenderer;
            this.eventsEngine = eventsEngine;
            this.rendererStub = { fake: 'fake', root: { element: document.createElement('div') } };
            this.$emptyStub = sinon.stub($.fn, 'empty');
            this.$removeStub = sinon.stub($.fn, 'remove').callsFake(function() { return this; });
            this.$onStub = sinon.stub(this.eventsEngine, 'on');
            this.$offStub = sinon.stub(this.eventsEngine, 'off');
            this.$triggerStub = sinon.stub(this.eventsEngine, 'trigger');
        },
        afterEach: function() {
            this.$emptyStub.restore();
            this.$removeStub.restore();
            this.$onStub.restore();
            this.$offStub.restore();
            this.$triggerStub.restore();
            $ = this.jQuery;
        }
    });

    QUnit.test('Clear', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.clear();

        // assert
        assert.equal(result, elem);
        assert.ok($.fn.empty.calledOnce);
        assert.equal($.fn.empty.firstCall.thisValue.get(0), $(elem.element).get(0));
    });

    QUnit.test('Disposing', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.dispose();

        // assert
        assert.equal(result, elem);
        assert.ok($.fn.remove.calledOnce);
        assert.equal($.fn.remove.firstCall.thisValue.get(0), $(elem.element).get(0));
    });

    QUnit.test('On', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.on(1, 2, 3, 4);

        // assert

        assert.equal(result, elem);
        assert.ok(this.eventsEngine.on.calledOnce);
        assert.deepEqual(this.eventsEngine.on.firstCall.args.slice(1), [1, 2, 3, 4]);
        assert.equal(this.eventsEngine.on.firstCall.args[0].get(0), $(elem.element).get(0));
    });

    QUnit.test('Off', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.off(1, 2, 3, 4);

        // assert
        assert.equal(result, elem);

        assert.ok(this.eventsEngine.off.calledOnce);
        assert.deepEqual(this.eventsEngine.off.firstCall.args.slice(1), [1, 2, 3, 4]);
        assert.equal(this.eventsEngine.off.firstCall.args[0].get(0), $(elem.element).get(0));
    });

    QUnit.test('Trigger', function(assert) {
        // arrange
        const elem = (new this.Element(this.rendererStub, 'svg'));

        // act
        const result = elem.trigger(1, 2, 3, 4);

        // assert
        assert.equal(result, elem);

        assert.ok(this.eventsEngine.trigger.calledOnce);
        assert.deepEqual(this.eventsEngine.trigger.firstCall.args.slice(1), [1, 2, 3, 4]);
        assert.equal(this.eventsEngine.trigger.firstCall.args[0].length, 1);
        assert.equal(this.eventsEngine.trigger.firstCall.args[0].get(0), $(elem.element).get(0));
    });

    QUnit.module('SvgElement. attr API, set attrs', {
        beforeEach: function() {
            const renderer = rendererModule;

            this.Element = renderer.SvgElement;

            this.rendererStub = { fake: 'fake' };
        }
    });

    QUnit.test('Attributes param is undefined', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const g = (new this.Element(this.rendererStub, 'g')).append(svg);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(g);

        // act
        const result = rect.attr();

        // assert
        assert.equal(result, rect);
    });

    QUnit.test('Attributes without processing', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const g = (new this.Element(this.rendererStub, 'g')).append(svg);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(g);

        // act
        const result = rect.attr({ 'some-attr': 'some value 1', 'someAttr': 'some value 2' });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect.element.getAttribute('some-attr'), 'some value 1');
        assert.strictEqual(rect.element.getAttribute('someAttr'), 'some value 2');

        assert.strictEqual(rect._settings['some-attr'], 'some value 1');
        assert.strictEqual(rect._settings['someAttr'], 'some value 2');
    });

    QUnit.test('DashStyle is processed', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'path')).append(svg);

        // act
        const result1 = elem1.attr({ 'dashStyle': 'longdash' });
        const result2 = elem2.attr({ 'dashStyle': 'dash' });
        const result3 = elem3.attr({ 'dashStyle': 'dot' });
        const result4 = elem4.attr({ 'dashStyle': 'solid' });
        const result5 = elem5.attr({ 'dashStyle': 'none' });
        const result6 = elem6.attr({ 'dashStyle': 'longdashdotdashlongdash' });

        // assert
        checkDashStyle(assert, elem1, result1, 'longdash', '8,3');
        checkDashStyle(assert, elem2, result2, 'dash', '4,3');
        checkDashStyle(assert, elem3, result3, 'dot', '1,3');
        checkDashStyle(assert, elem4, result4, 'solid', 'none');
        checkDashStyle(assert, elem5, result5, 'none', 'none');
        checkDashStyle(assert, elem6, result6, 'longdashdotdashlongdash', '8,3,1,3,4,3,8,3');
    });

    QUnit.test('DashStyle is applied after stroke-width', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'path')).append(svg);

        // act
        const result1 = elem1.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'longdash' });
        const result2 = elem2.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'dash' });
        const result3 = elem3.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'dot' });
        const result4 = elem4.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'solid' });
        const result5 = elem5.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'none' });
        const result6 = elem6.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'longdashdotdashlongdash' });

        // assert
        checkDashStyle(assert, elem1, result1, 'longdash', '16,6');
        checkDashStyle(assert, elem2, result2, 'dash', '8,6');
        checkDashStyle(assert, elem3, result3, 'dot', '2,6');
        checkDashStyle(assert, elem4, result4, 'solid', 'none');
        checkDashStyle(assert, elem5, result5, 'none', 'none');
        checkDashStyle(assert, elem6, result6, 'longdashdotdashlongdash', '16,6,2,6,8,6,16,6');
    });

    QUnit.test('DashStyle is applied before stroke-width', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'path')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'path')).append(svg);
        // act
        const result1 = elem1.attr({ 'dashStyle': 'longdash' }).attr({ 'stroke-width': 2 });
        const result2 = elem2.attr({ 'dashStyle': 'dash' }).attr({ 'stroke-width': 2 });
        const result3 = elem3.attr({ 'dashStyle': 'dot' }).attr({ 'stroke-width': 2 });
        const result4 = elem4.attr({ 'dashStyle': 'solid' }).attr({ 'stroke-width': 2 });
        const result5 = elem5.attr({ 'dashStyle': 'none' }).attr({ 'stroke-width': 2 });
        const result6 = elem6.attr({ 'dashStyle': 'longdashdotdashlongdash' }).attr({ 'stroke-width': 2 });

        // assert
        checkDashStyle(assert, elem1, result1, 'longdash', '16,6');
        checkDashStyle(assert, elem2, result2, 'dash', '8,6');
        checkDashStyle(assert, elem3, result3, 'dot', '2,6');
        checkDashStyle(assert, elem4, result4, 'solid', 'none');
        checkDashStyle(assert, elem5, result5, 'none', 'none');
        checkDashStyle(assert, elem6, result6, 'longdashdotdashlongdash', '16,6,2,6,8,6,16,6');
    });

    QUnit.test('DashStyle is applied after stroke-width (rect element)', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        const result1 = elem1.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'longdash' });
        const result2 = elem2.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'dash' });
        const result3 = elem3.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'dot' });
        const result4 = elem4.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'solid' });
        const result5 = elem5.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'none' });
        const result6 = elem6.attr({ 'stroke-width': 2 }).attr({ 'dashStyle': 'longdashdotdashlongdash' });

        // assert
        checkDashStyle(assert, elem1, result1, 'longdash', '16,6');
        checkDashStyle(assert, elem2, result2, 'dash', '8,6');
        checkDashStyle(assert, elem3, result3, 'dot', '2,6');
        checkDashStyle(assert, elem4, result4, 'solid', 'none');
        checkDashStyle(assert, elem5, result5, 'none', 'none');
        checkDashStyle(assert, elem6, result6, 'longdashdotdashlongdash', '16,6,2,6,8,6,16,6');
    });

    QUnit.test('DashStyle is applied before stroke-width (rect element)', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        const result1 = elem1.attr({ 'dashStyle': 'longdash' }).attr({ 'stroke-width': 2 });
        const result2 = elem2.attr({ 'dashStyle': 'dash' }).attr({ 'stroke-width': 2 });
        const result3 = elem3.attr({ 'dashStyle': 'dot' }).attr({ 'stroke-width': 2 });
        const result4 = elem4.attr({ 'dashStyle': 'solid' }).attr({ 'stroke-width': 2 });
        const result5 = elem5.attr({ 'dashStyle': 'none' }).attr({ 'stroke-width': 2 });
        const result6 = elem6.attr({ 'dashStyle': 'longdashdotdashlongdash' }).attr({ 'stroke-width': 2 });

        // assert
        checkDashStyle(assert, elem1, result1, 'longdash', '16,6');
        checkDashStyle(assert, elem2, result2, 'dash', '8,6');
        checkDashStyle(assert, elem3, result3, 'dot', '2,6');
        checkDashStyle(assert, elem4, result4, 'solid', 'none');
        checkDashStyle(assert, elem5, result5, 'none', 'none');
        checkDashStyle(assert, elem6, result6, 'longdashdotdashlongdash', '16,6,2,6,8,6,16,6');
    });

    QUnit.test('DashStyle is undefined after some value', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem = (new this.Element(this.rendererStub, 'path')).attr({ 'dashStyle': 'longdash' }).append(svg);

        // act
        const result = elem.attr({ 'dashStyle': undefined });

        // assert
        checkDashStyle(assert, elem, result, 'longdash', '8,3');
    });

    QUnit.test('DashStyle is null after some value', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem = (new this.Element(this.rendererStub, 'path')).attr({ 'dashStyle': 'longdash' }).append(svg);

        // act
        const result = elem.attr({ 'dashStyle': null });

        // assert
        assert.equal(result, elem);
        assert.strictEqual(elem.element.getAttribute('stroke-dasharray'), null);
        assert.strictEqual(elem._settings['dashStyle'], null);
    });

    QUnit.test('DashStyle is solid after some value', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem = (new this.Element(this.rendererStub, 'path')).attr({ 'dashStyle': 'longdash' }).append(svg);

        // act
        const result = elem.attr({ 'dashStyle': 'solid' });

        // assert
        assert.equal(result, elem);
        assert.strictEqual(elem.element.getAttribute('stroke-dasharray'), null);
        assert.strictEqual(elem._settings['dashStyle'], 'solid');
    });

    QUnit.test('Align attribute is processed. LTR', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        const result1 = rect1.attr({ 'align': 'left' });
        const result2 = rect2.attr({ 'align': 'center' });
        const result3 = rect3.attr({ 'align': 'right' });

        // assert
        assert.equal(result1, rect1);
        assert.ok(!rect1.element.getAttribute('align'));
        assert.strictEqual(rect1.element.getAttribute('text-anchor'), 'start');
        assert.strictEqual(rect1._settings['align'], 'left');

        assert.equal(result2, rect2);
        assert.ok(!rect2.element.getAttribute('align'));
        assert.strictEqual(rect2.element.getAttribute('text-anchor'), 'middle');
        assert.strictEqual(rect2._settings['align'], 'center');

        assert.equal(result3, rect3);
        assert.ok(!rect3.element.getAttribute('align'));
        assert.strictEqual(rect3.element.getAttribute('text-anchor'), 'end');
        assert.strictEqual(rect3._settings['align'], 'right');
    });

    QUnit.test('Align attribute is processed. RTL', function(assert) {
        // arrange
        this.rendererStub.rtl = true;

        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        const result1 = rect1.attr({ 'align': 'left' });
        const result2 = rect2.attr({ 'align': 'center' });
        const result3 = rect3.attr({ 'align': 'right' });

        // assert
        assert.equal(result1, rect1);
        assert.ok(!rect1.element.getAttribute('align'));
        assert.strictEqual(rect1.element.getAttribute('text-anchor'), 'end');
        assert.strictEqual(rect1._settings['align'], 'left');

        assert.equal(result2, rect2);
        assert.ok(!rect2.element.getAttribute('align'));
        assert.strictEqual(rect2.element.getAttribute('text-anchor'), 'middle');
        assert.strictEqual(rect2._settings['align'], 'center');

        assert.equal(result3, rect3);
        assert.ok(!rect3.element.getAttribute('align'));
        assert.strictEqual(rect3.element.getAttribute('text-anchor'), 'start');
        assert.strictEqual(rect3._settings['align'], 'right');
    });

    QUnit.test('Align = null', function(assert) {
        // arrange
        this.rendererStub.rtl = true;

        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).attr({ 'align': 'left' }).append(svg);

        // act
        const result = rect.attr({ 'align': null });

        // assert
        assert.equal(result, rect);
        assert.ok(!rect.element.getAttribute('align'));
        assert.strictEqual(rect.element.getAttribute('text-anchor'), null);
        assert.strictEqual(rect._settings['align'], null);
    });

    QUnit.test('Special cases. value is undefined (does not take effect)', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'circle')).attr({ 'cy': 100, dashStyle: 'dot' }).append(svg);

        // act
        const result = rect.attr({ 'cy': undefined, dashStyle: undefined });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect.element.getAttribute('cy'), '100');
        assert.strictEqual(rect.element.getAttribute('stroke-dasharray').replace(/\s/g, '').replace(/px/g, ''), '1,3');

        assert.strictEqual(rect._settings['cy'], 100);
        assert.strictEqual(rect._settings['dashStyle'], 'dot');
    });

    QUnit.test('Special cases. value is null (deletes attribute)', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'circle')).attr({ 'cy': 100, dashStyle: 'dot' }).append(svg);

        // act
        const result = rect.attr({ 'cy': null, dashStyle: null });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect.element.getAttribute('cy'), null);
        assert.strictEqual(rect.element.getAttribute('stroke-dasharray'), null);

        assert.strictEqual(rect._settings['cy'], null);
        assert.strictEqual(rect._settings['dashStyle'], null);
    });

    QUnit.module('SvgElement. attr API, set attrs. transform', {
        beforeEach: function() {
            const renderer = rendererModule;
            this.Element = renderer.SvgElement;

            this.rendererStub = { fake: 'fake' };
        }
    });

    QUnit.test('Do not calculate transform attribute if no transformations applied', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect._applyTransformation = sinon.spy();

        // act
        const result = rect.attr({ fill: 'red', stroke: 'blue' });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect._applyTransformation.callCount, 0);
    });

    QUnit.test('Calculate transform attribute only once on attr call', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect._applyTransformation = sinon.spy();
        rect.element.setAttribute = sinon.spy();

        // act
        const result = rect.attr({ fill: 'red', stroke: 'blue', x: 1, y: 2, translateX: 10, scaleY: 20, rotate: 90 });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect._applyTransformation.callCount, 1);
        assert.strictEqual(rect._settings['fill'], 'red');
        assert.strictEqual(rect._settings['stroke'], 'blue');
        assert.strictEqual(rect._settings['x'], 1);
        assert.strictEqual(rect._settings['y'], 2);
        assert.strictEqual(rect._settings['translateX'], 10);
        assert.strictEqual(rect._settings['scaleY'], 20);
        assert.strictEqual(rect._settings['rotate'], 90);

        assert.strictEqual(rect.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('All transform attributes are stored', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect._applyTransformation = sinon.spy();
        rect.element.setAttribute = sinon.spy();

        // act
        const result = rect.attr({
            translateX: 11, translateY: 22,
            rotate: 33, rotateX: 44, rotateY: 55,
            scaleX: 66, scaleY: 77,
            rotateAngle: 88,
            x: 100, 'some-attribute': 200
        });

        // assert
        assert.equal(result, rect);
        assert.strictEqual(rect._settings.translateX, 11);
        assert.strictEqual(rect._settings.translateY, 22);
        assert.strictEqual(rect._settings.rotate, 33);
        assert.strictEqual(rect._settings.rotateX, 44);
        assert.strictEqual(rect._settings.rotateY, 55);
        assert.strictEqual(rect._settings.scaleX, 66);
        assert.strictEqual(rect._settings.scaleY, 77);

        assert.strictEqual(rect.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('translateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');

        assert.deepEqual(rect.element.setAttribute.withArgs('x').lastCall.args, ['x', 100], 'other attributes are applied');
        assert.deepEqual(rect.element.setAttribute.withArgs('some-attribute').lastCall.args, ['some-attribute', 200], 'other attributes are applied');
    });

    QUnit.test('Translate transformation', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect4 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect1.element.setAttribute = sinon.spy();
        rect2.element.setAttribute = sinon.spy();
        rect3.element.setAttribute = sinon.spy();
        rect4.element.setAttribute = sinon.spy();

        // act
        const result1 = rect1.attr({ translateX: null });
        const result2 = rect2.attr({ translateX: 10 });
        const result3 = rect3.attr({ translateY: 20 });
        const result4 = rect4.attr({ translateX: 30, translateY: 40 });

        // assert
        assert.equal(result1, rect1);
        assert.deepEqual(rect1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);
        assert.strictEqual(rect1.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result2, rect2);
        assert.deepEqual(rect2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(10,0)']);
        assert.strictEqual(rect2.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result3, rect3);
        assert.deepEqual(rect3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,20)']);
        assert.strictEqual(rect3.element.setAttribute.withArgs('translateY').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result4, rect4);
        assert.deepEqual(rect4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);
        assert.strictEqual(rect4.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect4.element.setAttribute.withArgs('translateY').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('Rotate transformation', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect4 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect5 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect6 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect7 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect1.element.setAttribute = sinon.spy();
        rect2.element.setAttribute = sinon.spy();
        rect3.element.setAttribute = sinon.spy();
        rect4.element.setAttribute = sinon.spy();
        rect5.element.setAttribute = sinon.spy();
        rect6.element.setAttribute = sinon.spy();
        rect7.element.setAttribute = sinon.spy();

        // act
        const result1 = rect1.attr({ rotate: null });
        const result2 = rect2.attr({ rotate: 10 });
        const result3 = rect3.attr({ rotate: 20, rotateX: 30 });
        const result4 = rect4.attr({ rotate: 40, rotateY: 50 });
        const result5 = rect5.attr({ rotate: 60, rotateX: 70, rotateY: 80 });
        const result6 = rect6.attr({ rotate: 90, x: 100, y: 110 });
        const result7 = rect7.attr({ rotate: 120, x: 130, rotateY: 140, y: 150 });

        // assert
        assert.equal(result1, rect1);
        assert.deepEqual(rect1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);
        assert.strictEqual(rect1.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result2, rect2);
        assert.deepEqual(rect2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(10,0,0)']);
        assert.strictEqual(rect2.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result3, rect3);
        assert.deepEqual(rect3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(20,30,0)']);
        assert.strictEqual(rect3.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect3.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result4, rect4);
        assert.deepEqual(rect4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(40,0,50)']);
        assert.strictEqual(rect4.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect4.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result5, rect5);
        assert.ok(rect5.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(60,70,80)']);
        assert.strictEqual(rect5.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect5.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect5.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result6, rect6);
        assert.ok(rect6.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(90,100,110)']);
        assert.strictEqual(rect6.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect6.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect6.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result7, rect7);
        assert.ok(rect7.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) rotate(120,130,140)']);
        assert.strictEqual(rect7.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect7.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect7.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('Scale transformation', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect1 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect2 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect3 = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const rect4 = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect1.element.setAttribute = sinon.spy();
        rect2.element.setAttribute = sinon.spy();
        rect3.element.setAttribute = sinon.spy();
        rect4.element.setAttribute = sinon.spy();

        // act
        const result1 = rect1.attr({ scaleX: null });
        const result2 = rect2.attr({ scaleX: 10 });
        const result3 = rect3.attr({ scaleY: 20 });
        const result4 = rect4.attr({ scaleX: 30, scaleY: 40 });

        // assert
        assert.equal(result1, rect1);
        assert.deepEqual(rect1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);
        assert.strictEqual(rect1.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result2, rect2);
        assert.deepEqual(rect2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) scale(10,1)']);
        assert.strictEqual(rect2.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result3, rect3);
        assert.deepEqual(rect3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) scale(1,20)']);
        assert.strictEqual(rect3.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');

        assert.equal(result4, rect4);
        assert.deepEqual(rect4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0) scale(30,40)']);
        assert.strictEqual(rect4.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect4.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('All transformations at once', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect.element.setAttribute = sinon.spy();

        // act
        const result = rect.attr({ translateX: 10, translateY: 20, scaleX: 30, scaleY: 40, rotate: 50, rotateX: 60, rotateY: 70 });

        // assert
        assert.equal(result, rect);
        // with IE fix
        assert.deepEqual(rect.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(10,20) rotate(50,60,70) scale(30,40)']);

        assert.strictEqual(rect.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('translateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('Change some transforms', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        rect.element.setAttribute = sinon.spy();

        rect.attr({ translateX: 10, translateY: 20, scaleX: 30, scaleY: 40, rotate: 50, rotateX: 60, rotateY: 70 });

        // act
        const result = rect.attr({ translateX: 100, scaleY: 400, rotateX: 600 });

        // assert
        assert.equal(result, rect);
        // with IE fix
        assert.deepEqual(rect.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(100,20) rotate(50,600,70) scale(30,400)']);

        assert.strictEqual(rect.element.setAttribute.withArgs('translateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('translateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotate').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('rotateY').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleX').callCount, 0, 'transform attrs are not applied directly');
        assert.strictEqual(rect.element.setAttribute.withArgs('scaleY').callCount, 0, 'transform attrs are not applied directly');
    });

    QUnit.test('Perform sharping', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem7 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem8 = (new this.Element(this.rendererStub, 'circle')).append(svg);

        elem1.element.setAttribute = sinon.spy();
        elem2.element.setAttribute = sinon.spy();
        elem3.element.setAttribute = sinon.spy();
        elem4.element.setAttribute = sinon.spy();
        elem5.element.setAttribute = sinon.spy();
        elem6.element.setAttribute = sinon.spy();
        elem7.element.setAttribute = sinon.spy();
        elem8.element.setAttribute = sinon.spy();

        // act
        const result1 = elem1.attr({ sharp: true });
        const result2 = elem2.attr({ sharp: true, 'stroke-width': 1 });
        const result3 = elem3.attr({ sharp: true, 'stroke-width': 2 });
        const result4 = elem4.attr({ sharp: true, 'stroke-width': 1, translateX: 30, translateY: 40 });
        const result5 = elem5.attr({ sharp: true, 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: undefined });
        const result6 = elem6.attr({ sharp: true, 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: false });
        const result7 = elem7.attr({ sharp: true, 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: null });
        const result8 = elem8.attr({ sharp: false });

        // assert
        assert.equal(result1, elem1);
        assert.ok(elem1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result2, elem2);
        assert.ok(elem2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0.5,0.5)']);

        assert.equal(result3, elem3);
        assert.ok(elem3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result4, elem4);
        assert.ok(elem4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30.5,40.5)']);

        assert.equal(result5, elem5);
        assert.deepEqual(elem5.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30.5,40.5)']);

        assert.equal(result6, elem6);
        assert.deepEqual(elem6.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result7, elem7);
        assert.deepEqual(elem7.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result8, elem8);
        assert.deepEqual(elem8.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);
    });

    QUnit.test('Perform vertical sharping', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem7 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem8 = (new this.Element(this.rendererStub, 'circle')).append(svg);

        elem1.element.setAttribute = sinon.spy();
        elem2.element.setAttribute = sinon.spy();
        elem3.element.setAttribute = sinon.spy();
        elem4.element.setAttribute = sinon.spy();
        elem5.element.setAttribute = sinon.spy();
        elem6.element.setAttribute = sinon.spy();
        elem7.element.setAttribute = sinon.spy();
        elem8.element.setAttribute = sinon.spy();

        // act
        const result1 = elem1.attr({ sharp: 'v' });
        const result2 = elem2.attr({ sharp: 'v', 'stroke-width': 1 });
        const result3 = elem3.attr({ sharp: 'v', 'stroke-width': 2 });
        const result4 = elem4.attr({ sharp: 'v', 'stroke-width': 1, translateX: 30, translateY: 40 });
        const result5 = elem5.attr({ sharp: 'v', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: undefined });
        const result6 = elem6.attr({ sharp: 'v', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: false });
        const result7 = elem7.attr({ sharp: 'v', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: null });
        const result8 = elem8.attr({ sharp: false });

        // assert
        assert.equal(result1, elem1);
        assert.deepEqual(elem1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result2, elem2);
        assert.deepEqual(elem2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0.5)']);

        assert.equal(result3, elem3);
        assert.deepEqual(elem3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result4, elem4);
        assert.deepEqual(elem4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40.5)']);

        assert.equal(result5, elem5);
        assert.deepEqual(elem5.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40.5)']);

        assert.equal(result6, elem6);
        assert.deepEqual(elem6.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result7, elem7);
        assert.deepEqual(elem7.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result8, elem8);
        assert.deepEqual(elem8.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.strictEqual(elem1.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem2.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem3.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem4.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem5.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem6.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem7.element.setAttribute.withArgs('sharp').callCount, 0);
        assert.strictEqual(elem8.element.setAttribute.withArgs('sharp').callCount, 0);
    });

    QUnit.test('Perform horizontal sharping', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const elem1 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem2 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem3 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem4 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem5 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem6 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem7 = (new this.Element(this.rendererStub, 'circle')).append(svg);
        const elem8 = (new this.Element(this.rendererStub, 'circle')).append(svg);

        elem1.element.setAttribute = sinon.spy();
        elem2.element.setAttribute = sinon.spy();
        elem3.element.setAttribute = sinon.spy();
        elem4.element.setAttribute = sinon.spy();
        elem5.element.setAttribute = sinon.spy();
        elem6.element.setAttribute = sinon.spy();
        elem7.element.setAttribute = sinon.spy();
        elem8.element.setAttribute = sinon.spy();

        // act
        const result1 = elem1.attr({ sharp: 'h' });
        const result2 = elem2.attr({ sharp: 'h', 'stroke-width': 1 });
        const result3 = elem3.attr({ sharp: 'h', 'stroke-width': 2 });
        const result4 = elem4.attr({ sharp: 'h', 'stroke-width': 1, translateX: 30, translateY: 40 });
        const result5 = elem5.attr({ sharp: 'h', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: undefined });
        const result6 = elem6.attr({ sharp: 'h', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: false });
        const result7 = elem7.attr({ sharp: 'h', 'stroke-width': 1, translateX: 30, translateY: 40 }).attr({ sharp: null });
        const result8 = elem8.attr({ sharp: false });

        // assert
        assert.equal(result1, elem1);
        assert.ok(elem1.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result2, elem2);
        assert.ok(elem2.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0.5,0)']);

        assert.equal(result3, elem3);
        assert.ok(elem3.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);

        assert.equal(result4, elem4);
        assert.ok(elem4.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30.5,40)']);

        assert.equal(result5, elem5);
        assert.ok(elem5.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30.5,40)']);

        assert.equal(result6, elem6);
        assert.ok(elem6.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result7, elem7);
        assert.ok(elem7.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(30,40)']);

        assert.equal(result8, elem8);
        assert.ok(elem8.element.setAttribute.withArgs('transform').lastCall.args, ['transform', 'translate(0,0)']);
    });

    QUnit.module('SvgElement. attr API, get attrs', {
        beforeEach: function() {
            const renderer = rendererModule;

            this.Element = renderer.SvgElement;

            this.rendererStub = { fake: 'fake' };
        }
    });

    QUnit.test('Get stored attribute without processing', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const getAttrSpy = sinon.spy(rect.element.setAttribute.withArgs);
        rect.attr({ 'some-attr': 'some value 1', 'someAttr': 'some value 2' });

        // act
        const result = rect.attr('some-attr');

        // assert
        assert.equal(result, 'some value 1');
        assert.ok(!getAttrSpy.called);
    });

    QUnit.test('Get stored attribute with processing', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const getAttrSpy = sinon.spy(rect.element.setAttribute.withArgs);
        rect.attr({ 'align': 'left' });

        // act
        const result = rect.attr('align');

        // assert
        assert.equal(result, 'left');
        assert.ok(!getAttrSpy.called);
    });

    QUnit.test('Get default value of processed attribute', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const getAttrSpy = sinon.spy(rect.element.setAttribute.withArgs);
        rect.attr({ 'some-attr': 'some value 1' });

        // act
        const result = rect.attr('x');

        // assert
        assert.strictEqual(result, 0);
        assert.ok(!getAttrSpy.called);
    });

    QUnit.test('Get default value of processed attribute', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const getAttrSpy = sinon.spy(rect.element.setAttribute.withArgs);
        rect.attr({ 'some-attr': 'some value 1' });

        // act/assert
        assert.strictEqual(rect.attr('translateX'), 0);
        assert.strictEqual(rect.attr('translateY'), 0);
        assert.strictEqual(rect.attr('rotate'), 0);
        assert.strictEqual(rect.attr('rotateX'), 0);
        assert.strictEqual(rect.attr('rotateY'), 0);
        assert.strictEqual(rect.attr('scaleX'), 1);
        assert.strictEqual(rect.attr('scaleY'), 1);
        assert.strictEqual(rect.attr('pointer-events'), null);
        assert.ok(!getAttrSpy.called);
    });

    QUnit.module('SvgElement. css API', {
        beforeEach: function() {
            const Element = rendererModule.SvgElement;
            const parent = { element: document.createElement('div') };
            const svg = (new Element({}, 'svg')).append(parent);

            this.rect = (new Element({}, 'rect')).append(svg);
        }
    });

    QUnit.test('Compose styles, do not process style names', function(assert) {
        // act
        const result = this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '13px');
        assert.strictEqual(this.rect.element.style['cursor'], 'pointer');
    });

    QUnit.test('Compose styles, set zero value', function(assert) {
        // act
        this.rect.css({ 'font-size': 0, opacity: 0 });

        // assert
        assert.strictEqual(this.rect.element.style['font-size'], '0px');
        assert.strictEqual(this.rect.element.style['opacity'], '0');
    });

    QUnit.test('Merge existing styles with new ones', function(assert) {
        // arrange
        this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // act
        const result = this.rect.css({ 'font-family': 'SegoeUI', cursor: 'default' });

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '13px');
        assert.strictEqual(this.rect.element.style['cursor'], 'default');
        assert.strictEqual(this.rect.element.style['font-family'], 'SegoeUI');
    });

    QUnit.test('Empty styles do not clear existing ones', function(assert) {
        // arrange
        this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // act
        const result = this.rect.css();

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '13px');
        assert.strictEqual(this.rect.element.style['cursor'], 'pointer');
    });

    QUnit.test('Special cases. value is undefined (does not take effect)', function(assert) {
        // arrange
        this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // act
        const result = this.rect.css({ 'font-size': undefined, cursor: 'default' });

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '13px');
        assert.strictEqual(this.rect.element.style['cursor'], 'default');
    });

    QUnit.test('Special cases. value is null (does not take effect)', function(assert) {
        // arrange
        this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // act
        const result = this.rect.css({ 'font-size': null, cursor: 'default' });

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '13px');
        assert.strictEqual(this.rect.element.style['cursor'], 'default');
    });

    QUnit.test('Special cases. value is empty string (deletes style)', function(assert) {
        // arrange
        this.rect.css({ 'font-size': 13, 'cursor': 'pointer' });

        // act
        const result = this.rect.css({ 'font-size': '', cursor: 'default' });

        // assert
        assert.equal(result, this.rect);
        assert.strictEqual(this.rect.element.style['font-size'], '');
        assert.strictEqual(this.rect.element.style['cursor'], 'default');
    });

    QUnit.test('Special cases. apply unit name', function(assert) {
        const cssStyles = {
            'column-count': 2,
            'fill-opacity': 0.2,
            'flex-grow': 1,
            'flex-shrink': 1,
            'font-weight': 800,
            'line-height': 3,
            'opacity': 0.3,
            'order': 2,
            'orphans': 3,
            'widows': 1,
            'z-index': 4,
            'zoom': 2,
            'font-size': '12pt',
            'left': 30,
            'width': 400
        };
        const expectedStyleStrings = {
            'column-count': '2',
            'fill-opacity': '0.2',
            'flex-grow': '1',
            'flex-shrink': '1',
            'font-weight': '800',
            'line-height': '3',
            'opacity': '0.3',
            'order': '2',
            'orphans': '3',
            'widows': '1',
            'z-index': '4',
            'zoom': '2',
            'font-size': '12pt',
            'left': '30px',
            'width': '400px'
        };

        this.rect.css(cssStyles);

        for(const key in expectedStyleStrings) {
            assert.strictEqual(this.rect.element.style[key].toString(), expectedStyleStrings[key]);
        }
    });

    QUnit.module('SvgElement. getBBox API', {
        beforeEach: function() {
            this.Element = rendererModule.SvgElement;
            this.parent = document.createElement('div');
            this.svg = (new this.Element({}, 'svg')).append({ element: this.parent });
            $('#qunit-fixture').append(this.parent);
        }
    });

    QUnit.test('GetBBox of not-drawn element', function(assert) {
        // arrange
        const circle = (new this.Element({}, 'circle')).attr({ cx: 33, cy: 55, r: 123 });

        // act
        const bBox = circle.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            isEmpty: true
        });
    });

    QUnit.test('GetBBox of simple element', function(assert) {
        // arrange
        const circle = (new this.Element({}, 'circle')).attr({ cx: 40, cy: 50, r: 30 }).append(this.svg);

        // act
        const bBox = circle.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 10,
            y: 20,
            width: 60,
            height: 60,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox with float values', function(assert) {
        // arrange
        const circle = (new this.Element({}, 'circle')).attr({ cx: 40.4, cy: 49.6, r: 30.7 }).append(this.svg);

        // act
        const bBox = circle.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 9,
            y: 18,
            width: 63,
            height: 63,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of parent of element', function(assert) {
        // arrange
        const g = (new this.Element({}, 'g')).append(this.svg);

        (new this.Element({}, 'circle')).attr({ cx: 10, cy: 20, r: 10 }).append(g);

        // act
        const bBox = g.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 0,
            y: 10,
            width: 20,
            height: 20,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rect element', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 20,
            y: 30,
            width: 50,
            height: 30,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rotated rect element (90)', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30, rotate: 90, rotateX: 20, rotateY: 30 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: -10,
            y: 30,
            width: 30,
            height: 50,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rotated rect element (90 without rotateX/rotateY)', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30, rotate: 90 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: -10,
            y: 30,
            width: 30,
            height: 50,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rotated rect element (180)', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30, rotate: 180, rotateX: 20, rotateY: 30 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: -30,
            y: 0,
            width: 50,
            height: 30,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rotated rect element (45)', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30, rotate: 45, rotateX: 20, rotateY: 30 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: -2,
            y: 29,
            width: 58,
            height: 58,
            isEmpty: false
        });
    });

    QUnit.test('GetBBox of rotated rect element (30)', function(assert) {
        // arrange
        const rect = (new this.Element({}, 'rect')).attr({ x: 20, y: 30, width: 50, height: 30, rotate: 30, rotateX: 20, rotateY: 30 }).append(this.svg);

        // act
        const bBox = rect.getBBox();

        // assert
        assert.deepEqual(bBox, {
            x: 5,
            y: 30,
            width: 59,
            height: 51,
            isEmpty: false
        });
    });

    QUnit.module('SvgElement. animate API', {
        beforeEach: function() {
            const renderer = { animateElement: sinon.spy(), _animation: { enabled: true, somethingElse: 'yesSomethingElse' }, animationEnabled: function() { return this._animation.enabled; } };
            const Element = rendererModule.SvgElement;
            const parent = { element: document.createElement('div') };
            const svg = (new Element(renderer, 'svg')).append(parent);

            this.rect = (new Element(renderer, 'rect')).append(svg);
            this.rect.attr = sinon.spy();
        }
    });

    QUnit.test('Animate common attribute stored in wrapper', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;
        rect._settings.x = 10;
        rect._settings.width = 100;

        // act
        const result = rect.animate({ x: 20, width: 50 });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], { x: { from: 10, to: 20 }, width: { from: 100, to: 50 } }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute stored in element', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;
        rect.element.setAttribute('x', 1);
        rect.element.setAttribute('width', 2);

        // act
        const result = rect.animate({ x: 20, width: 50 });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], { x: { from: 1, to: 20 }, width: { from: 2, to: 50 } }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute not stored', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;

        // act
        const result = rect.animate({ x: 20, width: 50 });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], { x: { from: 0, to: 20 }, width: { from: 0, to: 50 } }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute. Merge options', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;

        // act
        const result = rect.animate({ x: 20 }, { someNewOption: 'newOption', somethingElse: 'changed' });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], { x: { from: 0, to: 20 } }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, someNewOption: 'newOption', somethingElse: 'changed' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute. Complete', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;
        const complete = sinon.spy();

        // act
        const result = rect.animate({ x: 20 }, {}, complete);

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], { x: { from: 0, to: 20 } }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse', complete: complete }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute. Animation disabled', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;
        const complete = sinon.spy();
        const step = sinon.spy();

        renderer._animation.enabled = false;

        // act
        const result = rect.animate({ x: 20, width: 200, translateX: 30 }, { step: step }, complete);

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(renderer.animateElement.callCount, 0, 'renderer.animateElement is not called');
        assert.equal(rect.attr.callCount, 1, 'attr is called once');
        assert.deepEqual(rect.attr.firstCall.args[0], { x: 20, width: 200, translateX: 30 }, 'attr params');

        assert.equal(step.callCount, 1, 'step function is called once');
        assert.equal(step.firstCall.thisValue, rect, 'step\'s this object');
        assert.equal(step.firstCall.args[0], 1, 'Step\'s first param');
        assert.equal(step.firstCall.args[0], 1, 'Step\'s second param');

        assert.equal(complete.callCount, 1, 'complete function is called once');
        assert.equal(complete.firstCall.thisValue, rect, 'complete\'s this object');
        assert.deepEqual(renderer._animation, { enabled: false, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate common attribute. Animation disabled, no step, no complete', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;

        renderer._animation.enabled = false;

        // act
        const result = rect.animate({ x: 20, width: 200, translateX: 30 });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(renderer.animateElement.callCount, 0, 'renderer.animateElement is not called');
        assert.equal(rect.attr.callCount, 1, 'attr is called once');
        assert.deepEqual(rect.attr.firstCall.args[0], { x: 20, width: 200, translateX: 30 }, 'attr params');
        assert.deepEqual(renderer._animation, { enabled: false, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('T338486', function(assert) {
        const rect = this.rect;

        rect._settings.translateY = 99.99998,
        rect._settings.translateX = 199.99998;

        // act
        rect.animate({ translateY: 100, translateX: 200 });

        assert.strictEqual(rect.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.deepEqual(rect.renderer.animateElement.args[0][1].transform.from, { translateY: 100, translateX: 200 }, 'renderer.animateElement\'s attrs param');
    });

    QUnit.test('Animate transform attributes stored in wrapper', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;
        rect._settings.translateX = 10;
        rect._settings.translateY = 20;
        rect._settings.rotate = 30;
        rect._settings.rotateX = 40;
        rect._settings.rotateY = 50;
        rect._settings.scaleX = 60;
        rect._settings.scaleY = 70;

        // act
        const result = rect.animate({
            translateX: 100,
            translateY: 200,
            rotate: 300,
            rotateX: 400,
            rotateY: 500,
            scaleX: 600,
            scaleY: 700
        });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], {
            transform: {
                from: {
                    translateX: 10,
                    translateY: 20,
                    rotate: 30,
                    rotateX: 40,
                    rotateY: 50,
                    scaleX: 60,
                    scaleY: 70
                },
                to: {
                    translateX: 100,
                    translateY: 200,
                    rotate: 300,
                    rotateX: 400,
                    rotateY: 500,
                    scaleX: 600,
                    scaleY: 700
                }
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate transform attributes, from default values', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;

        // act
        const result = rect.animate({
            translateX: 100,
            translateY: 200,
            rotate: 300,
            rotateX: 400,
            rotateY: 500,
            scaleX: 600,
            scaleY: 700
        });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], {
            transform: {
                from: {
                    translateX: 0,
                    translateY: 0,
                    rotate: 0,
                    rotateX: 0,
                    rotateY: 0,
                    scaleX: 1,
                    scaleY: 1
                },
                to: {
                    translateX: 100,
                    translateY: 200,
                    rotate: 300,
                    rotateX: 400,
                    rotateY: 500,
                    scaleX: 600,
                    scaleY: 700
                }
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate arc param', function(assert) {
        // arrange
        const rect = this.rect;
        const renderer = rect.renderer;

        // act
        const result = rect.animate({
            arc: {
                from: { arcFrom: 'fromArc' },
                to: { arcTo: 'toArc' }
            }
        });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.attr.callCount, 0, 'attr is not called');
        assert.equal(renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(renderer.animateElement.firstCall.args[0], rect, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(renderer.animateElement.firstCall.args[1], {
            arc: {
                from: { arcFrom: 'fromArc' },
                to: { arcTo: 'toArc' }
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Stop animation', function(assert) {
        // arrange
        const rect = this.rect;

        rect.animation = { stop: sinon.spy() };

        // act
        const result = rect.stopAnimation({ disableCompleteParam: true });

        // assert
        assert.equal(result, rect, 'return value');
        assert.equal(rect.animation.stop.callCount, 1, 'animation.stop is called');
        assert.deepEqual(rect.animation.stop.firstCall.args[0], { disableCompleteParam: true }, 'animation.stop\'s disableComplete param');
    });

    QUnit.module('Links', {
        beforeEach: function() {
            this.renderer = {};
        },

        element: function() {
            return new rendererModule.SvgElement(this.renderer, 'g');
        }
    });

    QUnit.test('Enabling links', function(assert) {
        const parent = this.element();
        const child = this.element();

        assert.strictEqual(parent.enableLinks(), parent, 'return value');
        child.linkOn(parent, {});
        assert.ok(true);
    });

    QUnit.test('Virtual link', function(assert) {
        const parent = this.element().enableLinks();

        assert.strictEqual(parent.virtualLink({}), parent, 'return value');
    });

    QUnit.test('Link after', function(assert) {
        const parent = this.element().enableLinks();

        assert.strictEqual(parent.linkAfter('test'), parent, 'return value');
    });

    QUnit.test('Turn link on and off', function(assert) {
        const parent = this.element().enableLinks();
        const child = this.element();

        assert.strictEqual(child.linkOn(parent, {}), child, 'return value - on');
        assert.strictEqual(child.linkOff(), child, 'return value - off');
    });

    QUnit.test('Turn link on when links are not enabled', function(assert) {
        try {
            this.element().linkOn(this.element(), {});
            assert.ok(false, 'exception is expected');
        } catch(_) {
            assert.ok(true, 'exception');
        }
    });

    QUnit.test('Appending and removing', function(assert) {
        const parent = this.element().enableLinks();
        const child = this.element().linkOn(parent, {});

        assert.strictEqual(child.linkAppend(), child, 'return value - append');
        assert.strictEqual(child.linkRemove(), child, 'return value - remove');
    });

    QUnit.test('Appending and removing non linked', function(assert) {
        const child = this.element();

        try {
            child.linkAppend();
            assert.ok(false, 'exception is expected - append');
        } catch(_) {
            assert.ok(true, 'exception - append');
        }
        try {
            child.linkRemove();
            assert.ok(false, 'exception is expected - remove');
        } catch(_) {
            assert.ok(true, 'exception - remove');
        }
    });

    QUnit.module('Links - appending and removing', {
        beforeEach: function() {
            this.renderer = {};
            this.parent = this.element().enableLinks();
            this.child1 = this.element().attr({ 'class': 'child1' });
            this.child2 = this.element().attr({ 'class': 'child2' });
            this.child3 = this.element().attr({ 'class': 'child3' });
            this.child4 = this.element().attr({ 'class': 'child4' });
            this.child5 = this.element().attr({ 'class': 'child5' });
        },

        element: function() {
            return new rendererModule.SvgElement(this.renderer, 'g');
        },

        check: function(assert, expected, message) {
            const actualNodes = $.map(this.parent.element.childNodes, function(node) {
                return node;
            });
            const expectedNodes = $.map(expected, function(element) {
                return element.element;
            });
            assert.deepEqual(actualNodes, expectedNodes, message);
        }
    });

    QUnit.test('Simple sequential linking', function(assert) {
        this.child1.linkOn(this.parent, {});
        this.child2.linkOn(this.parent, {});
        this.child3.linkOn(this.parent, {});
        this.child4.linkOn(this.parent, {});
        this.child5.linkOn(this.parent, {});

        this.child3.linkAppend();
        this.child4.linkAppend();
        this.child1.linkAppend();
        this.child5.linkAppend();
        this.child2.linkAppend();

        this.check(assert, [this.child1, this.child2, this.child3, this.child4, this.child5], '1');

        this.child4.linkRemove();
        this.child1.linkRemove();

        this.check(assert, [this.child2, this.child3, this.child5], '2');

        this.child1.linkAppend();
        this.child2.linkRemove();

        this.check(assert, [this.child1, this.child3, this.child5], '3');

        this.child3.linkRemove();
        this.child4.linkAppend();

        this.check(assert, [this.child1, this.child4, this.child5], '4');
    });

    QUnit.test('Linking with \'after\' key', function(assert) {
        this.child4.linkOn(this.parent, 'child4');
        this.child5.linkOn(this.parent, {});
        this.child1.linkOn(this.parent, { name: 'child1', after: 'child4' });
        this.child2.linkOn(this.parent, { after: 'child4' });
        this.child3.linkOn(this.parent, { after: 'child1' });

        this.child5.linkAppend();
        this.child4.linkAppend();

        this.check(assert, [this.child4, this.child5], '1');

        this.child3.linkAppend();

        this.check(assert, [this.child4, this.child3, this.child5], '2');

        this.child2.linkAppend();

        this.check(assert, [this.child4, this.child3, this.child2, this.child5], '3');

        this.child1.linkAppend();

        this.check(assert, [this.child4, this.child1, this.child3, this.child2, this.child5], '4');
    });

    QUnit.test('Linking with virtual links', function(assert) {
        this.child1.linkOn(this.parent, {});
        this.parent.virtualLink('virtual1');

        this.child3.linkOn(this.parent, {});
        this.parent.virtualLink({ name: 'virtual2', after: 'virtual1' });

        this.child4.linkOn(this.parent, { after: 'virtual2' });
        this.child2.linkOn(this.parent, {});
        this.child5.linkOn(this.parent, { after: 'virtual1' });

        this.child5.linkAppend();
        this.child3.linkAppend();

        this.check(assert, [this.child5, this.child3], '1');

        this.child1.linkAppend();
        this.child2.linkAppend();

        this.check(assert, [this.child1, this.child5, this.child3, this.child2], '2');

        this.child4.linkAppend();

        this.check(assert, [this.child1, this.child5, this.child4, this.child3, this.child2], '3');
    });

    QUnit.test('Linking with virtual links and link after', function(assert) {
        this.child1.linkOn(this.parent, {});
        this.parent.virtualLink('virtual1');

        this.child3.linkOn(this.parent, {});
        this.parent.virtualLink({ name: 'virtual2', after: 'virtual1' });

        this.child4.linkOn(this.parent, { after: 'virtual2' });
        this.parent.linkAfter('virtual1');
        this.child2.linkOn(this.parent, {});
        this.parent.linkAfter();
        this.child5.linkOn(this.parent, { after: 'virtual1' });

        this.child5.linkAppend();
        this.child3.linkAppend();

        this.check(assert, [this.child5, this.child3], '1');

        this.child1.linkAppend();
        this.child2.linkAppend();

        this.check(assert, [this.child1, this.child2, this.child5, this.child3], '2');

        this.child4.linkAppend();

        this.check(assert, [this.child1, this.child2, this.child5, this.child4, this.child3], '3');
    });

    QUnit.module('SvgElement. FuncIRI', {
        beforeEach: function() {
            this.refreshPaths = rendererModule.refreshPaths;
            this.Element = rendererModule.SvgElement;

            this.rendererStub = { fake: 'fake' };
            this.originalUrl = window.location.href;
        },
        afterEach: function() {
            if('pushState' in history) {
                history.pushState('', document.title, this.originalUrl);
            } else {
                window.location.hash = '';
            }
        }
    });

    QUnit.test('Set clip-path attribute. pathModified = false', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        rect.attr({ 'clip-path': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('clip-path').replace(/"/g, ''), 'url(#DevExpress_34)');
    });

    QUnit.test('Set clip-path attribute. pathModified = true', function(assert) {
        // arrange
        this.rendererStub.pathModified = true;
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const url = window.location.href.split('#')[0];

        // act
        rect.attr({ 'clip-path': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('clip-path').replace(/"/g, ''), 'url(' + url + '#DevExpress_34)');
    });

    QUnit.test('Set clip-path = null', function(assert) {
        // arrange
        this.rendererStub.pathModified = true;
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).attr({ 'clip-path': 'DevExpress_34' }).append(svg);

        // act
        rect.attr({ 'clip-path': null });

        // assert
        assert.strictEqual(rect.element.getAttribute('clip-path'), null);
    });

    QUnit.test('Set filter attribute. pathModified = false', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        rect.attr({ 'filter': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('filter').replace(/"/g, ''), 'url(#DevExpress_34)');
    });

    QUnit.test('Set filter attribute. pathModified = true', function(assert) {
        // arrange
        this.rendererStub.pathModified = true;
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const url = window.location.href.split('#')[0];

        // act
        rect.attr({ 'filter': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('filter').replace(/"/g, ''), 'url(' + url + '#DevExpress_34)');
    });

    QUnit.test('Set filter = null', function(assert) {
        // arrange
        this.rendererStub.pathModified = true;
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).attr({ 'filter': 'DevExpress_34' }).append(svg);

        // act
        rect.attr({ 'filter': null });

        // assert
        assert.strictEqual(rect.element.getAttribute('filter'), null);
    });

    QUnit.test('Set pattern as fill attribute. pathModified = false', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        rect.attr({ 'fill': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('fill').replace(/"/g, ''), 'url(#DevExpress_34)');
    });

    QUnit.test('Set pattern as fill attribute. pathModified = true', function(assert) {
        // arrange
        this.rendererStub.pathModified = true;
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);
        const url = window.location.href.split('#')[0];

        // act
        rect.attr({ 'fill': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('fill').replace(/"/g, ''), 'url(' + url + '#DevExpress_34)');
    });

    QUnit.test('Set pattern as fill attribute = null', function(assert) {
        // arrange
        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).attr({ 'fill': 'DevExpress_34' }).append(svg);

        // act
        rect.attr({ 'fill': null });

        // assert
        assert.strictEqual(rect.element.getAttribute('fill'), null);
    });

    QUnit.test('Remove hashes from url for FuncIRI. pathModified = true', function(assert) {
        // arrange
        const url = window.location.href.split('#')[0];

        window.location.hash = 'testhash';
        this.rendererStub.pathModified = true;

        const parent = { element: document.createElement('div') };
        const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
        const rect = (new this.Element(this.rendererStub, 'rect')).append(svg);

        // act
        rect.attr({ 'filter': 'DevExpress_34' });

        // assert
        assert.strictEqual(rect.element.getAttribute('filter').replace(/"/g, ''), 'url(' + url + '#DevExpress_34)');
    });

    if('pushState' in history) {
        QUnit.test('FixPath API. pathModified = false', function(assert) {
            // arrange
            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rectWithClip = (new this.Element(this.rendererStub, 'rect')).attr({ 'clip-path': 'DevExpress_12' }).append(svg);
            const rectWithPattern = (new this.Element(this.rendererStub, 'rect')).attr({ 'fill': 'DevExpress_13' }).append(svg);
            const rectWithFilter = (new this.Element(this.rendererStub, 'rect')).attr({ 'filter': 'DevExpress_14' }).append(svg);

            const url = window.location.pathname + '?testparam=2';
            window.history.pushState('', document.title, url);

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(rectWithClip.element.getAttribute('clip-path').replace(/"/g, ''), 'url(#DevExpress_12)');
            assert.strictEqual(rectWithPattern.element.getAttribute('fill').replace(/"/g, ''), 'url(#DevExpress_13)');
            assert.strictEqual(rectWithFilter.element.getAttribute('filter').replace(/"/g, ''), 'url(#DevExpress_14)');
        });

        QUnit.test('FixPath API. pathModified = true', function(assert) {
            // arrange
            this.rendererStub.pathModified = true;

            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rectWithClip = (new this.Element(this.rendererStub, 'rect')).attr({ 'clip-path': 'DevExpress_12' }).append(svg);
            const rectWithPattern = (new this.Element(this.rendererStub, 'rect')).attr({ 'fill': 'DevExpress_13' }).append(svg);
            const rectWithFilter = (new this.Element(this.rendererStub, 'rect')).attr({ 'filter': 'DevExpress_14' }).append(svg);

            const newUrl = window.location.href.split('?')[0] + '?testparam=2';
            window.history.pushState('', document.title, newUrl);

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(rectWithClip.element.getAttribute('clip-path').replace(/"/g, ''), 'url(' + newUrl + '#DevExpress_12)');
            assert.strictEqual(rectWithPattern.element.getAttribute('fill').replace(/"/g, ''), 'url(' + newUrl + '#DevExpress_13)');
            assert.strictEqual(rectWithFilter.element.getAttribute('filter').replace(/"/g, ''), 'url(' + newUrl + '#DevExpress_14)');
        });

        QUnit.test('FixPath API. do not change attribute if its value was funcIRI, but now it is not', function(assert) {
            // arrange
            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rect = (new this.Element(this.rendererStub, 'rect')).attr({ fill: 'DevExpress_12' }).append(svg);
            rect.attr({ fill: 'red' });

            const url = window.location.href.split('?')[0] + '?testparam=2';
            window.history.pushState('', document.title, url);

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(rect.element.getAttribute('fill'), 'red');
        });

        QUnit.test('FixPath API. Do not fix IRIs on disposed elements', function(assert) {
            // arrange
            this.rendererStub.pathModified = true;

            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rect = (new this.Element(this.rendererStub, 'rect')).attr({ fill: 'DevExpress_12' }).append(svg);
            const testElement = rect.element;

            const href = window.location.href;
            const oldUrl = href.split('#')[0];
            const newUrl = href.split('?')[0] + '?testparam=2';

            window.history.pushState('', document.title, newUrl);

            rect.dispose();

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(testElement.getAttribute('fill'), 'url(' + oldUrl + '#DevExpress_12)');
        });

        // T711457
        QUnit.test('No path refreshing when parent element was cleared', function(assert) {
            // arrange
            this.rendererStub.pathModified = true;

            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rootGroup = (new this.Element(this.rendererStub, 'group')).attr({ fill: 'DevExpress_12' }).append(svg);
            const rect1 = (new this.Element(this.rendererStub, 'rect')).attr({ fill: 'DevExpress_13' }).append(rootGroup);
            const href = window.location.href;
            const oldUrl = href.split('#')[0];
            const newUrl = href.split('?')[0] + '?testparam=2';

            window.history.pushState('', document.title, newUrl);

            rootGroup.clear();

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(rootGroup.element.getAttribute('fill'), 'url(' + newUrl + '#DevExpress_12)');
            assert.strictEqual(rect1.element.getAttribute('fill'), 'url(' + oldUrl + '#DevExpress_13)');
        });

        QUnit.test('No path refreshing when parent element was disposed', function(assert) {
            // arrange
            this.rendererStub.pathModified = true;

            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rootGroup = (new this.Element(this.rendererStub, 'group')).append(svg);
            const rect1 = (new this.Element(this.rendererStub, 'rect')).attr({ fill: 'DevExpress_12' }).append(rootGroup);
            const childGroup = (new this.Element(this.rendererStub, 'group')).append(rootGroup);
            const rect2 = (new this.Element(this.rendererStub, 'rect')).attr({ fill: 'DevExpress_13' }).append(childGroup);
            const href = window.location.href;
            const oldUrl = href.split('#')[0];
            const newUrl = href.split('?')[0] + '?testparam=2';

            window.history.pushState('', document.title, newUrl);

            rootGroup.dispose();

            // act
            this.refreshPaths();

            // assert
            assert.strictEqual(rect1.element.getAttribute('fill'), 'url(' + oldUrl + '#DevExpress_12)');
            assert.strictEqual(rect2.element.getAttribute('fill'), 'url(' + oldUrl + '#DevExpress_13)');
        });

        QUnit.test('Attribute with FuncIRI is removed and re-set. IMPORTANT due to FF and Edge bugs', function(assert) {
            // arrange
            const parent = { element: document.createElement('div') };
            const svg = (new this.Element(this.rendererStub, 'svg')).append(parent);
            const rect = (new this.Element(this.rendererStub, 'rect')).attr({ 'clip-path': 'DevExpress_12' }).append(svg);

            const url = window.location.pathname + '?testparam=2';
            window.history.pushState('', document.title, url);

            rect.element.removeAttribute = sinon.spy();
            rect.element.setAttribute = sinon.spy();

            // act
            this.refreshPaths();

            // assert
            assert.deepEqual(rect.element.removeAttribute.lastCall.args, ['clip-path']);
            assert.deepEqual(rect.element.setAttribute.lastCall.args, ['clip-path', 'url(#DevExpress_12)']);
        });
    }
})();

(function RectSvgElement_functionality() {
    QUnit.module('RectSvgElement', {
        beforeEach: function() {
            const rendererNS = rendererModule;

            this.SvgElement = rendererNS.SvgElement;
            this.Element = rendererNS.RectSvgElement;

            this.renderer = {};
        }
    });

    QUnit.test('Create rect', function(assert) {
        // act
        const rect = new this.Element(this.renderer);

        // assert
        assert.ok(rect instanceof this.Element);
        assert.ok(rect instanceof this.SvgElement);
    });

    QUnit.test('Attr. without params', function(assert) {
        const rect = new this.Element(this.renderer);

        // act
        const res = rect.attr();

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), null);

        assert.ok(!('x' in rect._settings));
    });

    QUnit.test('Attr. x, y, w, h, even sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 30, height: 40, 'stroke-width': 6 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '4');
        assert.strictEqual(rect.element.getAttribute('y'), '5');
        assert.strictEqual(rect.element.getAttribute('width'), '24');
        assert.strictEqual(rect.element.getAttribute('height'), '34');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '6');

        assert.strictEqual(rect._settings.x, 4, 'x');
        assert.strictEqual(rect._settings.y, 5, 'y');
        assert.strictEqual(rect._settings.width, 24, 'width');
        assert.strictEqual(rect._settings.height, 34, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 6);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 30, height: 40, 'stroke-width': 6 }, 'function param is not changed');
    });

    QUnit.test('Attr. x, y, w, h, odd sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 30, height: 40, 'stroke-width': 5 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '3.5');
        assert.strictEqual(rect.element.getAttribute('y'), '4.5');
        assert.strictEqual(rect.element.getAttribute('width'), '25');
        assert.strictEqual(rect.element.getAttribute('height'), '35');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '5');

        assert.strictEqual(rect._settings.x, 3.5, 'x');
        assert.strictEqual(rect._settings.y, 4.5, 'y');
        assert.strictEqual(rect._settings.width, 25, 'width');
        assert.strictEqual(rect._settings.height, 35, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 5);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 30, height: 40, 'stroke-width': 5 }, 'function param is not changed');
    });

    QUnit.test('Attr. w, h, even sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { width: 30, height: 40, 'stroke-width': 6 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '3');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '24');
        assert.strictEqual(rect.element.getAttribute('height'), '34');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '6');

        assert.strictEqual(rect._settings.x, 3, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 24, 'width');
        assert.strictEqual(rect._settings.height, 34, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 6);

        assert.deepEqual(attrs, { width: 30, height: 40, 'stroke-width': 6 }, 'function param is not changed');
    });

    QUnit.test('Attr. w, h, odd sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { width: 30, height: 40, 'stroke-width': 3 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '1.5');
        assert.strictEqual(rect.element.getAttribute('y'), '1.5');
        assert.strictEqual(rect.element.getAttribute('width'), '27');
        assert.strictEqual(rect.element.getAttribute('height'), '37');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '3');

        assert.strictEqual(rect._settings.x, 1.5, 'x');
        assert.strictEqual(rect._settings.y, 1.5, 'y');
        assert.strictEqual(rect._settings.width, 27, 'width');
        assert.strictEqual(rect._settings.height, 37, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 3);

        assert.deepEqual(attrs, { width: 30, height: 40, 'stroke-width': 3 }, 'function param is not changed');
    });

    QUnit.test('Attr. width < height, sw > min, even sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 4, height: 40, 'stroke-width': 6 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '2');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '2');
        assert.strictEqual(rect.element.getAttribute('height'), '38');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');

        assert.strictEqual(rect._settings.x, 2, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 2, 'width');
        assert.strictEqual(rect._settings.height, 38, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 4, height: 40, 'stroke-width': 6 }, 'function param is not changed');
    });

    QUnit.test('Attr. width < height, sw > min, odd sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 4, height: 40, 'stroke-width': 5 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '2');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '2');
        assert.strictEqual(rect.element.getAttribute('height'), '38');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');

        assert.strictEqual(rect._settings.x, 2, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 2, 'width');
        assert.strictEqual(rect._settings.height, 38, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 4, height: 40, 'stroke-width': 5 }, 'function param is not changed');
    });

    QUnit.test('Attr. width > height, sw > min, even sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 30, height: 4, 'stroke-width': 6 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '2');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '28');
        assert.strictEqual(rect.element.getAttribute('height'), '2');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');

        assert.strictEqual(rect._settings.x, 2, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 28, 'width');
        assert.strictEqual(rect._settings.height, 2, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 30, height: 4, 'stroke-width': 6 }, 'function param is not changed');
    });

    QUnit.test('Attr. width > height, sw > min, odd sw', function(assert) {
        // arrange
        const rect = new this.Element(this.renderer);
        const attrs = { x: 1, y: 2, width: 30, height: 4, 'stroke-width': 5 };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '2');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '28');
        assert.strictEqual(rect.element.getAttribute('height'), '2');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');

        assert.strictEqual(rect._settings.x, 2, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 28, 'width');
        assert.strictEqual(rect._settings.height, 2, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);

        assert.deepEqual(attrs, { x: 1, y: 2, width: 30, height: 4, 'stroke-width': 5 }, 'function param is not changed');
    });

    QUnit.test('Attr. change rect attrs + extra attr', function(assert) {
        // arrange
        const rect = (new this.Element(this.renderer)).attr({ x: 1, y: 2, width: 30, height: 40, 'stroke-width': 6 });
        const attrs = { x: 10, y: 20, width: 300, height: 400, 'stroke-width': 10, fill: 'red' };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '15');
        assert.strictEqual(rect.element.getAttribute('y'), '25');
        assert.strictEqual(rect.element.getAttribute('width'), '290');
        assert.strictEqual(rect.element.getAttribute('height'), '390');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '10');
        assert.strictEqual(rect.element.getAttribute('fill'), 'red');

        assert.strictEqual(rect._settings.x, 15, 'x');
        assert.strictEqual(rect._settings.y, 25, 'y');
        assert.strictEqual(rect._settings.width, 290, 'width');
        assert.strictEqual(rect._settings.height, 390, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 10);
        assert.strictEqual(rect._settings.fill, 'red');

        assert.deepEqual(attrs, { x: 10, y: 20, width: 300, height: 400, 'stroke-width': 10, fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change some rect attrs + extra attr', function(assert) {
        // arrange
        const rect = (new this.Element(this.renderer)).attr({ x: 1, y: 2, width: 4, height: 40, 'stroke-width': 6 });
        const attrs = { x: 10, y: 20, fill: 'red' };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '11');
        assert.strictEqual(rect.element.getAttribute('y'), '21');
        assert.strictEqual(rect.element.getAttribute('width'), '2');
        assert.strictEqual(rect.element.getAttribute('height'), '38');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');
        assert.strictEqual(rect.element.getAttribute('fill'), 'red');

        assert.strictEqual(rect._settings.x, 11, 'x');
        assert.strictEqual(rect._settings.y, 21, 'y');
        assert.strictEqual(rect._settings.width, 2, 'width');
        assert.strictEqual(rect._settings.height, 38, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);
        assert.strictEqual(rect._settings.fill, 'red');

        assert.deepEqual(attrs, { x: 10, y: 20, fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change extra attr only', function(assert) {
        // arrange
        const rect = (new this.Element(this.renderer)).attr({ x: 1, y: 2, width: 4, height: 40, 'stroke-width': 6 });
        const attrs = { fill: 'red' };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '2');
        assert.strictEqual(rect.element.getAttribute('y'), '3');
        assert.strictEqual(rect.element.getAttribute('width'), '2');
        assert.strictEqual(rect.element.getAttribute('height'), '38');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '2');
        assert.strictEqual(rect.element.getAttribute('fill'), 'red');

        assert.strictEqual(rect._settings.x, 2, 'x');
        assert.strictEqual(rect._settings.y, 3, 'y');
        assert.strictEqual(rect._settings.width, 2, 'width');
        assert.strictEqual(rect._settings.height, 38, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 2);
        assert.strictEqual(rect._settings.fill, 'red');

        assert.deepEqual(attrs, { fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Special cases. value is undefined (does not take effect)', function(assert) {
        // arrange
        const rect = (new this.Element(this.renderer)).attr({ x: 1, y: 2, width: 30, height: 40, 'stroke-width': 6 });
        const attrs = { x: 10, y: undefined };

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.strictEqual(rect.element.getAttribute('x'), '13');
        assert.strictEqual(rect.element.getAttribute('y'), '5');
        assert.strictEqual(rect.element.getAttribute('width'), '24');
        assert.strictEqual(rect.element.getAttribute('height'), '34');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '6');

        assert.strictEqual(rect._settings.x, 13, 'x');
        assert.strictEqual(rect._settings.y, 5, 'y');
        assert.strictEqual(rect._settings.width, 24, 'width');
        assert.strictEqual(rect._settings.height, 34, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 6);

        assert.deepEqual(attrs, { x: 10, y: undefined }, 'function param is not changed');
    });

    QUnit.test('Special cases. sharping', function(assert) {
        // arrange
        const rect = (new this.Element(this.renderer)).attr({ x: 1, y: 2, width: 30, height: 40, 'stroke-width': 6 });
        const attrs = { sharp: true };

        rect.element.setAttribute = sinon.spy();

        // act
        const res = rect.attr(attrs);

        // assert
        assert.equal(res, rect);
        assert.equal(rect.element.setAttribute.callCount, 0);
        assert.strictEqual(rect.element.getAttribute('x'), '4');
        assert.strictEqual(rect.element.getAttribute('y'), '5');
        assert.strictEqual(rect.element.getAttribute('width'), '24');
        assert.strictEqual(rect.element.getAttribute('height'), '34');
        assert.strictEqual(rect.element.getAttribute('stroke-width'), '6');

        assert.strictEqual(rect._settings.x, 4, 'x');
        assert.strictEqual(rect._settings.y, 5, 'y');
        assert.strictEqual(rect._settings.width, 24, 'width');
        assert.strictEqual(rect._settings.height, 34, 'height');
        assert.strictEqual(rect._settings['stroke-width'], 6);

        assert.deepEqual(attrs, { sharp: true }, 'function param is not changed');
    });
})();

(function PathSvgElement_functionality() {
    QUnit.module('PathSvgElement', {
        beforeEach: function() {
            const rendererNS = rendererModule;

            this.SvgElement = rendererNS.SvgElement;
            this.Element = rendererNS.PathSvgElement;
            this.renderer = { animateElement: sinon.spy(), _animation: { enabled: true, somethingElse: 'yesSomethingElse' }, animationEnabled: function() { return this._animation.enabled; } };
        },
        createElement: function(type) {
            const elem = new this.Element(this.renderer, type);
            elem.element.setAttribute = sinon.spy();
            return elem;
        }
    });

    QUnit.test('Create path (check type)', function(assert) {
        // act
        const path1 = this.createElement();
        const path2 = this.createElement('sometype');

        // assert
        assert.equal(path1.type, 'line');
        assert.equal(path2.type, 'sometype');
        assert.ok(path1 instanceof this.Element);
        assert.ok(path1 instanceof this.SvgElement);
    });

    QUnit.test('Attr. without params', function(assert) {
        const path = this.createElement('line');

        // act
        const res = path.attr();

        // assert
        assert.equal(res, path);
        assert.strictEqual(path.element.setAttribute.withArgs('d').callCount, 0);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.ok(!('d' in path._settings));
        assert.ok(!('points' in path._settings));

        assert.equal(path.segments, undefined, 'segments are stored');
    });

    QUnit.test('Attr. wrong type', function(assert) {
        const attrs = { points: [1, 2, 3, 4] };
        const path = this.createElement('wrong-type');
        const expected_d = 'M 0 0';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 0, 0]], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4] }, 'function param is not changed');
    });

    QUnit.test('Attr. line. empty array', function(assert) {
        const attrs = { points: [] };
        const path = this.createElement('line');
        const expected_d = 'M 0 0';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 0, 0]], 'segments are stored');
        assert.deepEqual(attrs, { points: [] }, 'function param is not changed');
    });

    QUnit.test('Attr. line. simple array', function(assert) {
        const attrs = { points: [1, 2, 3, 4, 5.123, 6.456] };
        const path = this.createElement('line');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456]], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4, 5.123, 6.456] }, 'function param is not changed');
    });

    QUnit.test('Attr. line. 2D array', function(assert) {
        const attrs = { points: [[1, 2, 3, 4, 5.123, 6.456], [10, 20, 30, 40, 50.123, 60.456]] };
        const path = this.createElement('line');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 M 10 20 L 30 40 L 50.123 60.456';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['M', 10, 20], ['L', 30, 40], ['L', 50.123, 60.456]], 'segments are stored');
        assert.deepEqual(attrs, { points: [[1, 2, 3, 4, 5.123, 6.456], [10, 20, 30, 40, 50.123, 60.456]] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. line. simple array of objects', function(assert) {
        const attrs = { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }] };
        const path = this.createElement('line');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456]], 'segments are stored');
        assert.deepEqual(attrs, { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. line. 2D array of objects', function(assert) {
        const attrs = { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }], [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50.123, y: 60.456 }]] };
        const path = this.createElement('line');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 M 10 20 L 30 40 L 50.123 60.456';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['M', 10, 20], ['L', 30, 40], ['L', 50.123, 60.456]], 'segments are stored');
        assert.deepEqual(attrs, { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }], [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50.123, y: 60.456 }]] }, 'function param is not changed');
    });

    QUnit.test('Attr. area. empty array', function(assert) {
        const attrs = { points: [] };
        const path = this.createElement('area');
        const expected_d = 'M 0 0 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 0, 0], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [] }, 'function param is not changed');
    });

    QUnit.test('Attr. area. simple array', function(assert) {
        const attrs = { points: [1, 2, 3, 4, 5.123, 6.456] };
        const path = this.createElement('area');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4, 5.123, 6.456] }, 'function param is not changed');
    });

    QUnit.test('Attr. area. 2D array', function(assert) {
        const attrs = { points: [[1, 2, 3, 4, 5.123, 6.456], [10, 20, 30, 40, 50.123, 60.456]] };
        const path = this.createElement('area');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 Z M 10 20 L 30 40 L 50.123 60.456 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['Z'], ['M', 10, 20], ['L', 30, 40], ['L', 50.123, 60.456], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [[1, 2, 3, 4, 5.123, 6.456], [10, 20, 30, 40, 50.123, 60.456]] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. area. simple array of objects', function(assert) {
        const attrs = { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }] };
        const path = this.createElement('area');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. area. 2D array of objects', function(assert) {
        const attrs = { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }], [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50.123, y: 60.456 }]] };
        const path = this.createElement('area');
        const expected_d = 'M 1 2 L 3 4 L 5.123 6.456 Z M 10 20 L 30 40 L 50.123 60.456 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4], ['L', 5.123, 6.456], ['Z'], ['M', 10, 20], ['L', 30, 40], ['L', 50.123, 60.456], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }], [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50.123, y: 60.456 }]] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezier. empty array', function(assert) {
        const attrs = { points: [] };
        const path = this.createElement('bezier');
        const expected_d = 'M 0 0';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 0, 0]], 'segments are stored');
        assert.deepEqual(attrs, { points: [] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezier. simple array', function(assert) {
        const attrs = { points: [1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345, 9, 10, 11, 12, 13, 14] };
        const path = this.createElement('bezier');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 C 9 10 11 12 13 14';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['C', 9, 10, 11, 12, 13, 14]], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345, 9, 10, 11, 12, 13, 14] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezier. 2D array', function(assert) {
        const attrs = { points: [[1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345], [9, 10, 11, 12, 13, 14, 15, 16]] };
        const path = this.createElement('bezier');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 M 9 10 C 11 12 13 14 15 16';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['M', 9, 10], ['C', 11, 12, 13, 14, 15, 16]], 'segments are stored');
        assert.deepEqual(attrs, { points: [[1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345], [9, 10, 11, 12, 13, 14, 15, 16]] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. bezier. simple array of objects', function(assert) {
        const attrs = { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }, { x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }] };
        const path = this.createElement('bezier');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 C 9 10 11 12 13 14';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['C', 9, 10, 11, 12, 13, 14]], 'segments are stored');
        assert.deepEqual(attrs, { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }, { x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. bezier. 2D array of objects', function(assert) {
        const attrs = { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }], [{ x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }, { x: 15, y: 16 }]] };
        const path = this.createElement('bezier');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 M 9 10 C 11 12 13 14 15 16';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['M', 9, 10], ['C', 11, 12, 13, 14, 15, 16]], 'segments are stored');
        assert.deepEqual(attrs, { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }], [{ x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }, { x: 15, y: 16 }]] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezierarea. empty array', function(assert) {
        const attrs = { points: [] };
        const path = this.createElement('bezierarea');
        const expected_d = 'M 0 0 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 0, 0], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezierarea. simple array', function(assert) {
        const attrs = { points: [1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345, 9, 10, 11, 12, 13, 14] };
        const path = this.createElement('bezierarea');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 C 9 10 11 12 13 14 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['C', 9, 10, 11, 12, 13, 14], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345, 9, 10, 11, 12, 13, 14] }, 'function param is not changed');
    });

    QUnit.test('Attr. bezierarea. 2D array', function(assert) {
        const attrs = { points: [[1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345], [9, 10, 11, 12, 13, 14, 15, 16]] };
        const path = this.createElement('bezierarea');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 Z M 9 10 C 11 12 13 14 15 16 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['Z'], ['M', 9, 10], ['C', 11, 12, 13, 14, 15, 16], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [[1, 2, 3, 4, 5.123, 6.456, 7.891, 8.345], [9, 10, 11, 12, 13, 14, 15, 16]] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. bezierarea. simple array of objects', function(assert) {
        const attrs = { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }, { x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }] };
        const path = this.createElement('bezierarea');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 C 9 10 11 12 13 14 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['C', 9, 10, 11, 12, 13, 14], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }, { x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }] }, 'function param is not changed');
    });

    // TODO backward compatibility
    QUnit.test('Attr. bezierarea. 2D array of objects', function(assert) {
        const attrs = { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }], [{ x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }, { x: 15, y: 16 }]] };
        const path = this.createElement('bezierarea');
        const expected_d = 'M 1 2 C 3 4 5.123 6.456 7.891 8.345 Z M 9 10 C 11 12 13 14 15 16 Z';

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], expected_d);
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['C', 3, 4, 5.123, 6.456, 7.891, 8.345], ['Z'], ['M', 9, 10], ['C', 11, 12, 13, 14, 15, 16], ['Z']], 'segments are stored');
        assert.deepEqual(attrs, { points: [[{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5.123, y: 6.456 }, { x: 7.891, y: 8.345 }], [{ x: 9, y: 10 }, { x: 11, y: 12 }, { x: 13, y: 14 }, { x: 15, y: 16 }]] }, 'function param is not changed');
    });

    QUnit.test('Attr. change points attr + extra attrs', function(assert) {
        // arrange
        const attrs = { points: [1, 2, 3, 4], fill: 'red' };
        const path = this.createElement('line').attr({ points: [10, 20, 30, 40] });

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', 'M 1 2 L 3 4']);
        assert.deepEqual(path.element.setAttribute.withArgs('fill').lastCall.args, ['fill', 'red']);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], 'M 1 2 L 3 4');
        assert.strictEqual(path._settings['fill'], 'red');
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4]], 'segments are stored');
        assert.deepEqual(attrs, { points: [1, 2, 3, 4], fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change segments attr + extra attrs', function(assert) {
        // arrange
        const attrs = { segments: [['M', 1, 2], ['L', 3, 4]], fill: 'red' };
        const path = this.createElement('line').attr({ points: [10, 20, 30, 40] });

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', 'M 1 2 L 3 4']);
        assert.deepEqual(path.element.setAttribute.withArgs('fill').lastCall.args, ['fill', 'red']);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], 'M 1 2 L 3 4');
        assert.strictEqual(path._settings['fill'], 'red');
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 1, 2], ['L', 3, 4]], 'segments are stored');
        assert.deepEqual(attrs, { segments: [['M', 1, 2], ['L', 3, 4]], fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change only extra attrs', function(assert) {
        // arrange
        const attrs = { fill: 'red' };

        const path = this.createElement('line').attr({ points: [10, 20, 30, 40] });

        // act
        const res = path.attr(attrs);

        // assert
        assert.equal(res, path);
        assert.deepEqual(path.element.setAttribute.withArgs('d').lastCall.args, ['d', 'M 10 20 L 30 40']);
        assert.deepEqual(path.element.setAttribute.withArgs('fill').lastCall.args, ['fill', 'red']);
        assert.strictEqual(path.element.setAttribute.withArgs('points').callCount, 0);

        assert.strictEqual(path._settings['d'], 'M 10 20 L 30 40');
        assert.strictEqual(path._settings['fill'], 'red');
        assert.ok(!('points' in path._settings));

        assert.deepEqual(path.segments, [['M', 10, 20], ['L', 30, 40]], 'segments are stored');

        assert.deepEqual(attrs, { fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. Get attribute', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4] });
        const getAttrSpy = sinon.spy(path.element.setAttribute.withArgs);

        // act
        const result = path.attr('d');

        // assert
        assert.equal(result, 'M 1 2 L 3 4');
        assert.ok(!getAttrSpy.called);
    });

    QUnit.test('Animate. line. equal length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4, 5, 6] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['L', 3, 4], ['L', 5, 6]],
                to: [['M', 10, 20], ['L', 30, 40], ['L', 50, 60]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. line. old length > new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4, 5, 6] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['L', 3, 4], ['L', 5, 6]],
                to: [['M', 10, 20], ['L', 30, 40], ['L', 30, 40]],
                end: [['M', 10, 20], ['L', 30, 40]]
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. line. old length < new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['L', 3, 4], ['L', 3, 4]],
                to: [['M', 10, 20], ['L', 30, 40], ['L', 50, 60]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. line. old length < new length, old is single point', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['L', 1, 2], ['L', 1, 2]],
                to: [['M', 10, 20], ['L', 30, 40], ['L', 50, 60]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. line. old length < new length, old is empty', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line'));
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 10, 20], ['L', 30, 40], ['L', 50, 60]],
                to: [['M', 10, 20], ['L', 30, 40], ['L', 50, 60]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezier. equal length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezier')).attr({ points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['C', 3, 4, 5, 6, 7, 8], ['C', 9, 10, 11, 12, 13, 14]],
                to: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 90, 100, 110, 120, 130, 140]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezier. old length > new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezier')).attr({ points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60, 70, 80] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['C', 3, 4, 5, 6, 7, 8], ['C', 9, 10, 11, 12, 13, 14]],
                to: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 70, 80, 70, 80, 70, 80]],
                end: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80]]
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezier. old length < new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezier')).attr({ points: [1, 2, 3, 4, 5, 6, 7, 8] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['C', 3, 4, 5, 6, 7, 8], ['C', 7, 8, 7, 8, 7, 8]],
                to: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 90, 100, 110, 120, 130, 140]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezier. old length < new length, old is single point', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezier')).attr({ points: [1, 2] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['C', 1, 2, 1, 2, 1, 2], ['C', 1, 2, 1, 2, 1, 2]],
                to: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 90, 100, 110, 120, 130, 140]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezier. old length < new length, old is empty', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezier'));
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 90, 100, 110, 120, 130, 140]],
                to: [['M', 10, 20], ['C', 30, 40, 50, 60, 70, 80], ['C', 90, 100, 110, 120, 130, 140]],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. area. equal length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'area')).attr({ points: [100, 150, 300, 50, 500, 150, 500, 300, 300, 400, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 30, 5, 50, 15, 50, 30, 30, 40, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150], ['L', 300, 50], ['L', 500, 150], /* middle */['L', 500, 300], ['L', 300, 400], ['L', 100, 300], ['Z']],
                to: [['M', 10, 15], ['L', 30, 5], ['L', 50, 15], /* middle */['L', 50, 30], ['L', 30, 40], ['L', 10, 30], ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. area. old length > new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'area')).attr({ points: [100, 150, 300, 50, 500, 150, 500, 300, 300, 400, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 30, 5, 30, 40, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150], ['L', 300, 50], ['L', 500, 150], /* middle */['L', 500, 300], ['L', 300, 400], ['L', 100, 300], ['Z']],
                to: [['M', 10, 15], ['L', 30, 5], ['L', 30, 5], /* middle */['L', 30, 40], ['L', 30, 40], ['L', 10, 30], ['Z']],
                end: [['M', 10, 15], ['L', 30, 5], /* middle */['L', 30, 40], ['L', 10, 30], ['Z']]
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. area. old length < new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'area')).attr({ points: [100, 150, 300, 50, 300, 400, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 30, 5, 50, 15, 50, 30, 30, 40, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150], ['L', 300, 50], ['L', 300, 50], /* middle */['L', 300, 400], ['L', 300, 400], ['L', 100, 300], ['Z']],
                to: [['M', 10, 15], ['L', 30, 5], ['L', 50, 15], /* middle */['L', 50, 30], ['L', 30, 40], ['L', 10, 30], ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. area. old length < new length, old is single point', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'area')).attr({ points: [100, 150, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 30, 5, 50, 15, 50, 30, 30, 40, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150], ['L', 100, 150], ['L', 100, 150], /* middle */['L', 100, 300], ['L', 100, 300], ['L', 100, 300], ['Z']],
                to: [['M', 10, 15], ['L', 30, 5], ['L', 50, 15], /* middle */['L', 50, 30], ['L', 30, 40], ['L', 10, 30], ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. area. old length < new length, old is empty', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'area'));
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 30, 5, 50, 15, 50, 30, 30, 40, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 10, 15], ['L', 30, 5], ['L', 50, 15], /* middle */['L', 50, 30], ['L', 30, 40], ['L', 10, 30], ['Z']],
                to: [['M', 10, 15], ['L', 30, 5], ['L', 50, 15], /* middle */['L', 50, 30], ['L', 30, 40], ['L', 10, 30], ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    // TODO check 'tail' rule
    QUnit.test('Animate. bezierarea. equal length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezierarea')).attr({ points: [100, 150, 100, 100, 200, 50, 300, 50, 400, 50, 500, 100, 500, 150, 500, 150, 500, 300, 500, 300, 500, 350, 400, 400, 300, 400, 200, 400, 100, 350, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 10, 10, 20, 5, 30, 5, 40, 5, 50, 10, 50, 15, 50, 15, 50, 30, 50, 30, 50, 35, 40, 40, 30, 40, 20, 40, 10, 35, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150],
                    ['C', 100, 100, 200, 50, 300, 50],
                    ['C', 400, 50, 500, 100, 500, 150],
                    // middle
                    ['C', 500, 150, 500, 300, 500, 300],
                    ['C', 500, 350, 400, 400, 300, 400],
                    ['C', 200, 400, 100, 350, 100, 300],
                    ['Z']],
                to: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 40, 5, 50, 10, 50, 15],
                    // middle
                    ['C', 50, 15, 50, 30, 50, 30],
                    ['C', 50, 35, 40, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezierarea. old length > new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezierarea')).attr({ points: [100, 150, 100, 100, 200, 50, 300, 50, 400, 50, 500, 100, 500, 150, 500, 150, 500, 300, 500, 300, 500, 350, 400, 400, 300, 400, 200, 400, 100, 350, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 10, 10, 20, 5, 30, 5, 30, 5, 30, 40, 30, 40, 20, 40, 10, 35, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150],
                    ['C', 100, 100, 200, 50, 300, 50],
                    ['C', 400, 50, 500, 100, 500, 150],
                    // middle
                    ['C', 500, 150, 500, 300, 500, 300],
                    ['C', 500, 350, 400, 400, 300, 400],
                    ['C', 200, 400, 100, 350, 100, 300],
                    ['Z']],
                to: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 30, 5, 30, 5, 30, 5],
                    // middle
                    ['C', 30, 5, 30, 40, 30, 40],
                    ['C', 30, 40, 30, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                end: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    // middle
                    ['C', 30, 5, 30, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']]
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezierarea. old length < new length', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezierarea')).attr({ points: [100, 150, 100, 100, 200, 50, 300, 50, 300, 50, 300, 400, 300, 400, 200, 400, 100, 350, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 10, 10, 20, 5, 30, 5, 40, 5, 50, 10, 50, 15, 50, 15, 50, 30, 50, 30, 50, 35, 40, 40, 30, 40, 20, 40, 10, 35, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150],
                    ['C', 100, 100, 200, 50, 300, 50],
                    ['C', 300, 50, 300, 50, 300, 50],
                    // middle
                    ['C', 300, 50, 300, 400, 300, 400],
                    ['C', 300, 400, 300, 400, 300, 400],
                    ['C', 200, 400, 100, 350, 100, 300],
                    ['Z']],
                to: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 40, 5, 50, 10, 50, 15],
                    // middle
                    ['C', 50, 15, 50, 30, 50, 30],
                    ['C', 50, 35, 40, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezierarea. old length < new length, old is single point', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezierarea')).attr({ points: [100, 150, 100, 150, 100, 300, 100, 300] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 10, 10, 20, 5, 30, 5, 40, 5, 50, 10, 50, 15, 50, 15, 50, 30, 50, 30, 50, 35, 40, 40, 30, 40, 20, 40, 10, 35, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 100, 150],
                    ['C', 100, 150, 100, 150, 100, 150],
                    ['C', 100, 150, 100, 150, 100, 150],
                    // middle
                    ['C', 100, 150, 100, 300, 100, 300],
                    ['C', 100, 300, 100, 300, 100, 300],
                    ['C', 100, 300, 100, 300, 100, 300],
                    ['Z']],
                to: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 40, 5, 50, 10, 50, 15],
                    // middle
                    ['C', 50, 15, 50, 30, 50, 30],
                    ['C', 50, 35, 40, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. bezierarea. old length < new length, old is empty', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'bezierarea'));
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 15, 10, 10, 20, 5, 30, 5, 40, 5, 50, 10, 50, 15, 50, 15, 50, 30, 50, 30, 50, 35, 40, 40, 30, 40, 20, 40, 10, 35, 10, 30] });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 40, 5, 50, 10, 50, 15],
                    // middle
                    ['C', 50, 15, 50, 30, 50, 30],
                    ['C', 50, 35, 40, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                to: [['M', 10, 15],
                    ['C', 10, 10, 20, 5, 30, 5],
                    ['C', 40, 5, 50, 10, 50, 15],
                    // middle
                    ['C', 50, 15, 50, 30, 50, 30],
                    ['C', 50, 35, 40, 40, 30, 40],
                    ['C', 20, 40, 10, 35, 10, 30],
                    ['Z']],
                end: undefined
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. path params + extra', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4] });
        path.attr = sinon.spy();

        // act
        const result = path.animate({ points: [10, 20, 30, 40], someAttr: 12 });

        // assert
        assert.equal(result, path);
        assert.equal(path.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], path, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            segments: {
                from: [['M', 1, 2], ['L', 3, 4]],
                to: [['M', 10, 20], ['L', 30, 40]],
                end: undefined
            },
            someAttr: {
                from: 0,
                to: 12
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. path params (stored in wrapper) + extra, animation disabled', function(assert) {
        // arrange
        const path = (new this.Element(this.renderer, 'line')).attr({ points: [1, 2, 3, 4] });
        path.attr = sinon.spy();
        this.renderer._animation.enabled = false;

        // act
        const result = path.animate({ points: [10, 20, 30, 40], someAttr: 12 });

        // assert
        assert.equal(result, path);
        assert.equal(this.renderer.animateElement.callCount, 0, 'renderer.animateElement is not called');
        assert.equal(path.attr.callCount, 1, 'attr is called');
        assert.deepEqual(path.attr.firstCall.args[0], {
            someAttr: 12,
            points: [10, 20, 30, 40]
        });
    });
})();

(function ArcSvgElement_functionality() {
    QUnit.module('ArcSvgElement', {
        beforeEach: function() {
            const rendererNS = rendererModule;

            this.SvgElement = rendererNS.SvgElement;
            this.Element = rendererNS.ArcSvgElement;

            this.renderer = { animateElement: sinon.spy(), _animation: { enabled: true, somethingElse: 'yesSomethingElse' }, animationEnabled: function() { return this._animation.enabled; } };
        },
        createElement: function(type) {
            const elem = new this.Element(this.renderer);
            elem.element.setAttribute = sinon.spy();
            return elem;
        }
    });

    QUnit.test('Create arc', function(assert) {
        // act
        const arc = this.createElement();

        // assert
        assert.ok(arc instanceof this.Element);
        assert.ok(arc instanceof this.SvgElement);

    });

    QUnit.test('Attr. without params', function(assert) {
        const arc = this.createElement();

        // act
        const res = arc.attr();

        // assert
        assert.equal(res, arc);
        assert.strictEqual(arc.element.setAttribute.withArgs('d').callCount, 0);

        assert.ok(!('d' in arc._settings));
    });

    QUnit.test('Attr. not circle, short curve', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 0, endAngle: 90 };
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 0 0 100.00000 -200.00000 L 100.00000 -100.00000 A 300.00000 300.00000 0 0 1 400.00000 200.00000 Z';

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);

        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 100, 'x');
        assert.strictEqual(arc._settings.y, 200, 'y');
        assert.strictEqual(arc._settings.innerRadius, 300, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 400, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 0, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 90, 'endAngle');

        assert.deepEqual(attrs, { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 0, endAngle: 90 }, 'function param is not changed');
    });

    QUnit.test('Attr, circle, long curve', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 90, endAngle: 450 };
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 1 0 499.99999 200.06981 M 400.00000 200.05236 A 300.00000 300.00000 0 1 1 400.00000 200.00000 Z';

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);

        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 100, 'x');
        assert.strictEqual(arc._settings.y, 200, 'y');
        assert.strictEqual(arc._settings.innerRadius, 300, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 400, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 90, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 450, 'endAngle');

        assert.deepEqual(attrs, { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 90, endAngle: 450 }, 'function param is not changed');
    });

    QUnit.test('Attr, close to circle (diff > 0.001), should be circle', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 90.0001, endAngle: 450 };
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 1 0 499.99999 200.06981 M 400.00000 200.05236 A 300.00000 300.00000 0 1 1 400.00000 200.00000 Z';

        // act
        arc.attr(attrs);

        // assert
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);
    });

    QUnit.test('Attr, close angles', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 179.999, endAngle: 180 };
        const expected_d = 'M -300.00000 199.99302 A 400.00000 400.00000 0 0 0 -300.00000 200.00000 L -200.00000 200.00000 A 300.00000 300.00000 0 0 1 -200.00000 199.99476 Z';

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);

        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 100, 'x');
        assert.strictEqual(arc._settings.y, 200, 'y');
        assert.strictEqual(arc._settings.innerRadius, 300, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 400, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 179.999, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 180, 'endAngle');

        assert.deepEqual(attrs, { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 179.999, endAngle: 180 }, 'function param is not changed');
    });

    QUnit.test('Attr, angles more than 360', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 360, endAngle: 450 };
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 0 0 100.00000 -200.00000 L 100.00000 -100.00000 A 300.00000 300.00000 0 0 1 400.00000 200.00000 Z';

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);

        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 100, 'x');
        assert.strictEqual(arc._settings.y, 200, 'y');
        assert.strictEqual(arc._settings.innerRadius, 300, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 400, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 360, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 450, 'endAngle');

        assert.deepEqual(attrs, { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 360, endAngle: 450 }, 'function param is not changed');
    });

    QUnit.test('Attr, whole angle multiple of 360', function(assert) {
        // arrange
        const arc = (this.createElement());
        const attrs = { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 90, endAngle: 810 };
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 1 0 499.99999 200.06981 M 400.00000 200.05236 A 300.00000 300.00000 0 1 1 400.00000 200.00000 Z';

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);
        assert.deepEqual(arc.element.setAttribute.withArgs('d').lastCall.args, ['d', expected_d]);

        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 100, 'x');
        assert.strictEqual(arc._settings.y, 200, 'y');
        assert.strictEqual(arc._settings.innerRadius, 300, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 400, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 90, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 810, 'endAngle');

        assert.deepEqual(attrs, { x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 90, endAngle: 810 }, 'function param is not changed');
    });

    QUnit.test('Attr. change base arc attrs + extra attrs', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer)).attr({ x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 });
        const attrs = { x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800, fill: 'red' };
        const expected_d = 'M 9000.00000 20000.00000 A 1000.00000 1000.00000 0 1 0 11000.00000 20000.00000 L 10500.00000 20000.00000 A 500.00000 500.00000 0 1 1 9500.00000 20000.00000 Z';
        arc.element.setAttribute = sinon.spy();

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);

        assert.strictEqual(arc.element.setAttribute.callCount, 3);
        assert.deepEqual(arc.element.setAttribute.getCall(0).args, ['fill', 'red']);
        assert.deepEqual(arc.element.setAttribute.getCall(1).args, ['d', expected_d]);
        assert.deepEqual(arc.element.setAttribute.getCall(2).args[0], 'transform');

        assert.strictEqual(arc._settings['fill'], 'red');
        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 10000, 'x');
        assert.strictEqual(arc._settings.y, 20000, 'y');
        assert.strictEqual(arc._settings.innerRadius, 500, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 1000, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 900, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 1800, 'endAngle');

        assert.deepEqual(attrs, { x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800, fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change some arc attrs + extra attrs', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer)).attr({ x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 });
        const attrs = { x: 10000, innerRadius: 500, startAngle: 900, fill: 'red' };
        const expected_d = 'M 10500.00000 2000.00000 A 500.00000 500.00000 0 1 0 10499.99999 2000.08727 M 10100.00000 2000.01745 A 100.00000 100.00000 0 1 1 10100.00000 2000.00000 Z';
        arc.element.setAttribute = sinon.spy();

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);

        assert.strictEqual(arc.element.setAttribute.callCount, 3);
        assert.deepEqual(arc.element.setAttribute.getCall(0).args, ['fill', 'red']);
        assert.deepEqual(arc.element.setAttribute.getCall(1).args, ['d', expected_d]);
        assert.deepEqual(arc.element.setAttribute.getCall(2).args[0], 'transform');

        assert.strictEqual(arc._settings['fill'], 'red');
        assert.strictEqual(arc._settings['d'], expected_d);

        assert.strictEqual(arc._settings.x, 10000, 'x');
        assert.strictEqual(arc._settings.y, 2000, 'y');
        assert.strictEqual(arc._settings.innerRadius, 500, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 100, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 900, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 180, 'endAngle');

        assert.deepEqual(attrs, { x: 10000, innerRadius: 500, startAngle: 900, fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. change only extra attrs', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer)).attr({ x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 });
        const attrs = { fill: 'red' };
        const expected_d = 'M 1000.00000 1900.00000 A 100.00000 100.00000 0 0 0 900.00000 2000.00000 L 950.00000 2000.00000 A 50.00000 50.00000 0 0 1 1000.00000 1950.00000 Z';
        arc.element.setAttribute = sinon.spy();

        // act
        const res = arc.attr(attrs);

        // assert
        assert.equal(res, arc);

        assert.strictEqual(arc.element.setAttribute.callCount, 1);
        assert.deepEqual(arc.element.setAttribute.firstCall.args, ['fill', 'red']);

        assert.strictEqual(arc._settings['fill'], 'red');
        assert.strictEqual(arc._settings['d'], expected_d);
        assert.strictEqual(arc._settings.x, 1000, 'x');
        assert.strictEqual(arc._settings.y, 2000, 'y');
        assert.strictEqual(arc._settings.innerRadius, 50, 'innerRadius');
        assert.strictEqual(arc._settings.outerRadius, 100, 'outerRadius');
        assert.strictEqual(arc._settings.startAngle, 90, 'startAngle');
        assert.strictEqual(arc._settings.endAngle, 180, 'endAngle');

        assert.deepEqual(attrs, { fill: 'red' }, 'function param is not changed');
    });

    QUnit.test('Attr. Get attribute', function(assert) {
        const arc = (new this.Element(this.renderer)).attr({ x: 100, y: 200, innerRadius: 300, outerRadius: 400, startAngle: 0, endAngle: 90 });
        const expected_d = 'M 500.00000 200.00000 A 400.00000 400.00000 0 0 0 100.00000 -200.00000 L 100.00000 -100.00000 A 300.00000 300.00000 0 0 1 400.00000 200.00000 Z';
        const getAttrSpy = sinon.spy(arc.element.setAttribute.withArgs);

        // act
        const res = arc.attr('d');

        // assert
        assert.strictEqual(res, expected_d);
        assert.ok(!getAttrSpy.called);
    });

    QUnit.test('Animate. arc params (stored in wrapper) + extra', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer)).attr({ x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 });
        arc.attr = sinon.spy();

        // act
        const result = arc.animate({ x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800, someAttr: 12 });

        // assert
        assert.equal(result, arc);
        assert.equal(arc.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], arc, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            someAttr: {
                from: 0,
                to: 12
            },
            arc: {
                from: { x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 },
                to: { x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800 }
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. arc params (not stored) + extra', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer));
        arc.attr = sinon.spy();

        // act
        const result = arc.animate({ x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800, someAttr: 12 });

        // assert
        assert.equal(result, arc);
        assert.equal(arc.attr.callCount, 0, 'attr is not called');
        assert.equal(this.renderer.animateElement.callCount, 1, 'renderer.animateElement is called');
        assert.equal(this.renderer.animateElement.firstCall.args[0], arc, 'renderer.animateElement\'s wrapper param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[1], {
            someAttr: {
                from: 0,
                to: 12
            },
            arc: {
                from: { x: 0, y: 0, innerRadius: 0, outerRadius: 0, startAngle: 0, endAngle: 0 },
                to: { x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800 }
            }
        }, 'renderer.animateElement\'s attrs param');
        assert.deepEqual(this.renderer.animateElement.firstCall.args[2], { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer.animateElement\'s options param');
        assert.deepEqual(this.renderer._animation, { enabled: true, somethingElse: 'yesSomethingElse' }, 'renderer._animation are not touched');
    });

    QUnit.test('Animate. arc params (stored in wrapper) + extra, animation disabled', function(assert) {
        // arrange
        const arc = (new this.Element(this.renderer)).attr({ x: 1000, y: 2000, innerRadius: 50, outerRadius: 100, startAngle: 90, endAngle: 180 });
        arc.attr = sinon.spy();
        this.renderer._animation.enabled = false;

        // act
        const result = arc.animate({ x: 10000, y: 20000, innerRadius: 500, outerRadius: 1000, startAngle: 900, endAngle: 1800, someAttr: 12 });

        // assert
        assert.equal(result, arc);
        assert.equal(this.renderer.animateElement.callCount, 0, 'renderer.animateElement is not called');
        assert.equal(arc.attr.callCount, 1, 'attr is called');
        assert.deepEqual(arc.attr.firstCall.args[0], {
            someAttr: 12,
            x: 10000,
            y: 20000,
            innerRadius: 500,
            outerRadius: 1000,
            startAngle: 900,
            endAngle: 1800
        });
    });
})();

(function TextSvgElement_functionality() {
    const textEnvironment = {
        beforeEach: function() {
            const rendererNS = rendererModule;

            this.SvgElement = rendererNS.SvgElement;
            this.Element = rendererNS.TextSvgElement;

            this.renderer = { encodeHtml: false };

            this.parent = document.createElement('div');
            this.svg = (new this.SvgElement({}, 'svg')).append({ element: this.parent });
            $('#qunit-fixture').append(this.parent);
        },
        prepareRenderBeforeEllipsis: function() {
            this.renderer.root = new this.SvgElement({}, 'svg');
            const element = new this.Element(this.renderer);
            element.getBBox = sinon.stub().returns({ width: 20 });
            this.renderer.text = sinon.stub().returns(element);
        },
        createText: function() {
            return new this.Element(this.renderer);
        },
        checkEmpty: function(assert, text) {
            assert.strictEqual(text.element.tagName, 'text', 'tag name');
            assert.strictEqual(text.element.childNodes.length, 0, 'child nodes count');
            assert.strictEqual(text.element.textContent, '', 'text content');
        },
        checkSimple: function(assert, text, expected, position) {
            assert.strictEqual(text.element.tagName, 'text', 'tag name');
            assert.equal(text.element.getAttribute('x'), position.x, 'x attribute');
            assert.equal(text.element.getAttribute('y'), position.y, 'y attribute');
            if(expected) {
                assert.strictEqual(text.element.childNodes.length, 1, 'child nodes count');
                assert.strictEqual(text.element.childNodes[0].nodeName, '#text', 'child is text node');
                assert.strictEqual(text.element.childNodes[0].wholeText, expected.text, 'text of the #text node');
                assert.strictEqual(text.element.textContent, expected.text, 'text content');
            } else {
                assert.strictEqual(text.element.childNodes.length, 0, 'child nodes count');
            }
        },
        checkTspans: function(assert, text, expectedData, position, strokeData) {
            assert.strictEqual(text.element.tagName, 'text', 'tag name');
            assert.equal(text.element.getAttribute('x'), position.x, 'x attribute');
            assert.equal(text.element.getAttribute('y'), position.y, 'y attribute');
            assert.strictEqual(text.element.childNodes.length, strokeData ? expectedData.length * 2 : expectedData.length, 'child nodes count');
            if(strokeData) {
                checkTspans(true, false);
                checkTspans(false, true);
            } else {
                checkTspans(false, false);
            }
            function checkTspans(checkStroke, withOffset) {
                const offset = withOffset ? expectedData.length : 0;
                $.each(expectedData, function(i, expected) {
                    const tspan = text.element.childNodes[i + offset];
                    const postfix = ' / ' + (checkStroke ? 'stroke' : '') + ' tspan ' + (i + 1);
                    assert.strictEqual(tspan.tagName, 'tspan', 'tag name' + postfix);

                    if(typeUtils.isDefined(expected.x)) {
                        assert.equal(tspan.getAttribute('x'), expected.x + '', 'x attribute' + postfix);
                    } else {
                        assert.equal(tspan.getAttribute('x'), null, 'x attribute' + postfix);
                    }
                    if(typeUtils.isDefined(expected.y)) {
                        assert.equal(tspan.getAttribute('y'), expected.y + '', 'y attribute' + postfix);
                    } else {
                        assert.equal(tspan.getAttribute('y'), null, 'y attribute' + postfix);
                    }

                    if(typeUtils.isDefined(expected.dx)) {
                        assert.deepEqual(tspan.getAttribute('dx'), expected.dx + '', 'dx attribute' + postfix);
                    } else {
                        assert.equal(tspan.getAttribute('dx'), null, 'dx attribute' + postfix);
                    }

                    if(typeUtils.isDefined(expected.dy)) {
                        assert.deepEqual(tspan.getAttribute('dy'), expected.dy + '', 'dy attribute' + postfix);
                    } else {
                        assert.equal(tspan.getAttribute('dy'), null, 'd attribute' + postfix);
                    }

                    assert.strictEqual(tspan.textContent, expected.text, 'text content' + postfix);
                    if(expected.style) {
                        if(tspan.getAttribute('style') !== null) {
                            $.each(expected.style, function(name, value) {
                                const expected = value.replace(/\s/g, '').replace(/;$/, '');
                                const actual = tspan.style[name].replace(/\s/g, '');
                                if(name === 'fill' || name === 'stroke') {
                                    colorEqual.call(assert, actual, expected);
                                } else {
                                    assert.equal(actual, expected);
                                }
                            });
                        }
                    }

                    if(checkStroke) {
                        assert.deepEqual(tspan.getAttribute('stroke'), strokeData['stroke'] + '', 'stroke attribute' + postfix);
                        assert.deepEqual(tspan.getAttribute('stroke-width'), strokeData['stroke-width'] + '', 'stroke-width attribute' + postfix);
                        assert.deepEqual(tspan.getAttribute('stroke-opacity'), strokeData['stroke-opacity'] + '', 'stroke-opacity attribute' + postfix);
                    } else {
                        assert.equal(tspan.getAttribute('stroke'), null, 'stroke attribute' + postfix);
                        assert.equal(tspan.getAttribute('stroke-width'), null, 'stroke-width attribute' + postfix);
                        assert.equal(tspan.getAttribute('stroke-opacity'), null, 'stroke-opacity attribute' + postfix);
                    }
                });
            }
        }
    };

    QUnit.module('TextSvgElement', textEnvironment);

    QUnit.test('Create text', function(assert) {
        // act
        const text = this.createText();

        // assert
        assert.ok(text instanceof this.Element);
        assert.ok(text instanceof this.SvgElement);
    });

    QUnit.test('Attr. without params', function(assert) {
        const text = this.createText();

        // act
        const res = text.attr();

        // assert
        assert.equal(res, text);
        assert.strictEqual(text.element.getAttribute('x'), null);

        assert.ok(!('x' in text._settings));
    });

    QUnit.test('Attr. Get attribute', function(assert) {
        // arrange
        const text = this.createText();

        // act, assert
        assert.strictEqual(text.attr('translateY'), 0, 'method result');
        this.checkEmpty(assert, text);
    });

    QUnit.test('Do not create any textNodes if no text passed', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { x: 1, y: 2 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkEmpty(assert, text);
        assert.deepEqual(attrs, { x: 1, y: 2 }, 'function param is not changed');
    });

    QUnit.test('Do not create any textNodes if text is null', function(assert) {
        // arrange
        const text = this.createText();

        // act
        const result = text.attr({ x: 1, y: 2, text: null });

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkEmpty(assert, text);
    });

    QUnit.test('Do not create any textNodes if text is undefined', function(assert) {
        // arrange
        const text = this.createText();

        // act
        const result = text.attr({ x: 1, y: 2, text: undefined });

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkEmpty(assert, text);
    });

    QUnit.test('Simple text', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: 'simple text', x: 1, y: 2 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkSimple(assert, text, { text: 'simple text' }, { x: 1, y: 2 });
        assert.deepEqual(attrs, { text: 'simple text', x: 1, y: 2 }, 'function param is not changed');
    });

    QUnit.test('Text is 0', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: 0, x: 1, y: 2, align: 'right' };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkSimple(assert, text, { text: '0' }, { x: 1, y: 2 });
        assert.deepEqual(attrs, { text: 0, x: 1, y: 2, 'align': 'right' }, 'function param is not changed');
    });

    QUnit.test('Simple text, empty string', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: '', x: 1, y: 2 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkSimple(assert, text, { text: '' }, { x: 1, y: 2 });
        assert.deepEqual(attrs, { text: '', x: 1, y: 2 }, 'function param is not changed');
    });

    QUnit.test('Text param as number', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: 123456, x: 1, y: 2 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkSimple(assert, text, { text: '123456' }, { x: 1, y: 2 });
        assert.deepEqual(attrs, { text: 123456, x: 1, y: 2 }, 'function param is not changed');
    });

    QUnit.test('Multiline text, default line height', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: 12, text: 'with multiple' },
            { x: 10, dy: 12, text: 'lines' }

        ], { x: 10, y: 20 });
        assert.deepEqual(attrs, { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 }, 'function param is not changed');
    });

    QUnit.test('Single line text with the spaces in the start of the line and with stroke, tspans should be w/o spaces there', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: '  simple text', x: 10, y: 20, stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Multiline text with the spaces in the start of each line, tspans should be w/o spaces there', function(assert) {
        // arrange
        const text = this.createText();
        const attrs = { text: '  simple text\r\n with multiple\n lines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: 12, text: 'with multiple' },
            { x: 10, dy: 12, text: 'lines' }
        ], { x: 10, y: 20 });
    });

    QUnit.test('Multiline text, default line height / HTML encoding', function(assert) {
        // arrange
        this.renderer.encodeHtml = true;
        const text = this.createText();
        const attrs = { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: 12, text: 'with multiple' },
            { x: 10, dy: 12, text: 'lines' }

        ], { x: 10, y: 20 });
    });

    QUnit.test('Multiline text, line height from font size', function(assert) {
        // arrange
        const text = this.createText().css({ 'font-size': 18 });
        const attrs = { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: '18px', text: 'with multiple' },
            { x: 10, dy: '18px', text: 'lines' }
        ], { x: 10, y: 20 });
        assert.deepEqual(attrs, { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 }, 'function param is not changed');
    });

    QUnit.test('Multiline text, line height from font size(em)', function(assert) {
        // arrange
        const text = this.createText().css({ 'font-size': '0.9em' });
        const attrs = { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: '0.9em', text: 'with multiple' },
            { x: 10, dy: '0.9em', text: 'lines' }
        ], { x: 10, y: 20 });
        assert.deepEqual(attrs, { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 }, 'function param is not changed');
    });

    QUnit.test('Multiline text, line height from font size(absolute size)', function(assert) {
        // arrange
        const text = this.createText().css({ 'font-size': 'large' });
        const attrs = { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: 12, text: 'with multiple' },
            { x: 10, dy: 12, text: 'lines' }
        ], { x: 10, y: 20 });
        assert.deepEqual(attrs, { text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 }, 'function param is not changed');
    });

    QUnit.test('Multiline text after simple text', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'text is very simple', x: 50, y: 40 });
        const attrs = { text: 'simple text\r\nwith multiple\nlines' };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 50, y: 40, text: 'simple text' },
            { x: 50, dy: 12, text: 'with multiple' },
            { x: 50, dy: 12, text: 'lines' }
        ], { x: 50, y: 40 });
        assert.deepEqual(attrs, { text: 'simple text\r\nwith multiple\nlines' }, 'function param is not changed');
    });

    QUnit.test('Creation multiline text html', function(assert) {
        const text = this.createText().attr({ text: 'Text<br/><b>Example<i>more</i></b><br/>someone text', x: 20, y: 30 });

        this.checkTspans(assert, text, [
            { x: 20, y: 30, text: 'Text' },
            { x: 20, dy: 12, text: 'Example' },
            { text: 'more' },
            { x: 20, dy: 12, text: 'someone text' }
        ], { x: 20, y: 30 });
    });

    // T227388
    QUnit.test('Html text is wrapped with brackets', function(assert) {
        const text = this.createText().attr({ text: '<Example>' });

        this.checkEmpty(assert, text);
    });

    QUnit.test('Creation text with special characters', function(assert) {
        const text = this.createText().attr({ text: '&#0176; C', x: 0, y: 0 });

        this.checkTspans(assert, text, [
            { x: 0, y: 0, text: '° C' }
        ], { x: 0, y: 0 });
    });

    QUnit.test('Creation text html with style', function(assert) {
        const text = this.createText().attr({ text: 'Text <b style=\'color:#010101\'>bold</b>', x: 10, y: 20 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, style: { fontWeight: '', fill: '' }, text: 'Text ' },
            { style: { 'font-weight': 'bold', fill: '#010101;' }, text: 'bold' }
        ], { x: 10, y: 20 });
    });

    QUnit.test('Creation text html with style / HTML encoding', function(assert) {
        this.renderer.encodeHtml = true;
        const text = this.createText().attr({ text: 'Text <b style=\'color:rgb(1,1,1)\'>bold</b>', x: 10, y: 20 });

        this.checkSimple(assert, text, { text: 'Text <b style=\'color:rgb(1,1,1)\'>bold</b>' }, { x: 10, y: 20 });
    });

    QUnit.test('Check inheritance setting', function(assert) {
        const text = this.createText().attr({ text: 'Simple Text<b>Bold<i>Bold Italic<u>Underline Bold italic</u></i></b>', x: 30, y: 20 });

        this.checkTspans(assert, text, [
            { x: 30, y: 20, text: 'Simple Text' },
            { text: 'Bold', style: { 'font-weight': 'bold;' } },
            { text: 'Bold Italic', style: { 'font-weight': 'bold', 'font-style': 'italic;' } },
            { text: 'Underline Bold italic', style: { 'font-weight': 'bold', 'font-style': 'italic', 'text-decoration': 'underline;' } }
        ], { x: 30, y: 20 });
    });

    QUnit.test('Check inheritance setting font size', function(assert) {
        const text = this.createText().attr({ text: 'Simple Text<b style=\'font-size:15px\'>Bold<i>Bold Italic<u>Underline Bold italic</u></i></b>', x: 0, y: 0 });

        this.checkTspans(assert, text, [
            { x: 0, y: 0, text: 'Simple Text' },
            { text: 'Bold', style: { 'font-weight': 'bold', 'font-size': '15px;' } },
            { text: 'Bold Italic', style: { 'font-weight': 'bold', 'font-size': '15px', 'font-style': 'italic;', } },
            { text: 'Underline Bold italic', style: { 'font-weight': 'bold', 'font-size': '15px', 'font-style': 'italic', 'text-decoration': 'underline;', } },
        ], { x: 0, y: 0 });
    });

    // T177039
    QUnit.test('Inheritance settings font size for multiline text', function(assert) {
        const text = this.createText().attr({ text: '<span>line1</span>\n<span style=\'font-size:16px;\'>line2</span>\n<span>line3</span>', x: 1, y: 2 }).css({ 'font-size': 18 });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'line1' },
            { x: 1, dy: '16px', text: 'line2' },
            { x: 1, dy: '18px', text: 'line3' }
        ], { x: 1, y: 2 });
    });

    QUnit.test('T514698. Text contains html comments-like structures without any other html-like strings - do not parse as HTML', function(assert) {
        const text = this.createText().attr({ text: 'Regular text <!--html comment like-->', x: 1, y: 2 });

        this.checkSimple(assert, text, { text: 'Regular text <!--html comment like-->' }, { x: 1, y: 2 });
    });

    QUnit.test('T514698. Text contains html comments-like and other html-like strings - parse HTML and skip comments', function(assert) {
        const text = this.createText().attr({ text: 'Regular text<br/><b>Html text</b><!--html comment like-->', x: 20, y: 30 });

        this.checkTspans(assert, text, [
            { x: 20, y: 30, text: 'Regular text' },
            { x: 20, dy: 12, text: 'Html text' }
        ], { x: 20, y: 30 });
    });

    QUnit.test('Simple text after multiline text', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines', x: 1, y: 2 });
        const attrs = { text: 'text is very simple', x: 3, y: 4 };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkSimple(assert, text, { text: 'text is very simple' }, { x: 3, y: 4 });
        assert.deepEqual(attrs, { text: 'text is very simple', x: 3, y: 4 }, 'function param is not changed');
    });

    QUnit.test('Special cases. text is undefined (does not take effect)', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 });
        const attrs = { text: undefined };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: 12, text: 'with multiple' },
            { x: 10, dy: 12, text: 'lines' }

        ], { x: 10, y: 20 });
        assert.deepEqual(attrs, { text: undefined }, 'function param is not changed');
    });

    QUnit.test('Special cases. text is null (deletes text)', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines' });
        const attrs = { text: null };

        // act
        const result = text.attr(attrs);

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkEmpty(assert, text);
        assert.deepEqual(attrs, { text: null }, 'function param is not changed');
    });

    QUnit.test('Css with empty param', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 });

        // act
        const result = text.css();

        // assert
        assert.strictEqual(result, text, 'method result');
    });

    QUnit.test('Update text line positions if font size changed', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 });

        // act
        const result = text.css({ 'font-size': 18 });

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'simple text' },
            { x: 10, dy: '18px', text: 'with multiple' },
            { x: 10, dy: '18px', text: 'lines' }
        ], { x: 10, y: 20 });
    });

    QUnit.test('Update text line positions if text position changed', function(assert) {
        // arrange
        const text = this.createText().attr({ text: 'simple text\r\nwith multiple\nlines', x: 10, y: 20 });

        // act
        const result = text.attr({ x: 30, y: 40 });

        // assert
        assert.strictEqual(result, text, 'method result');
        this.checkTspans(assert, text, [
            { x: 30, y: 40, text: 'simple text' },
            { x: 30, dy: 12, text: 'with multiple' },
            { x: 30, dy: 12, text: 'lines' }
        ], { x: 30, y: 40 });
    });

    // T177039
    QUnit.test('Partial font size is less than common font size / not first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1<br/>Line 2-1<span font-size=\'18px\'>Line 2-2</span>Line 2-3\nLine 3' }).css({ 'font-size': 20 });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '20px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { text: 'Line 2-3' },
            { x: 1, dy: '20px', text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    // T177039
    QUnit.test('Partial font size is less than common font size / first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1<br/><span style=\'font-size: 18px;\'>Line 2-1</span>Line 2-2\nLine 3' }).css({ 'font-size': 20 });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '20px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { x: 1, dy: '20px', text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    // T177039
    QUnit.test('Partial font size is greater than common font size / not first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1<br/>Line 2-1<span style=\'font-size: 18px;\'>Line 2-2</span>Line 2-3\nLine 3' }).css({ 'font-size': 10 });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '18px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { text: 'Line 2-3' },
            { x: 1, dy: '10px', text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    // T177039
    QUnit.test('Partial font size is greater than common font size / first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1<br/><span style=\'font-size: 18px;\'>Line 2-1</span>Line 2-2\nLine 3' }).css({ 'font-size': 10 });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '18px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { x: 1, dy: '10px', text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    // T177039
    QUnit.test('Two partial font sizes / not first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1\nLine 2-1<span style=\'font-size: 16px;\'>Line 2-2</span><span style=\'font-size: 18px;\'>Line 2-3</span>\nLine 3' });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '18px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { text: 'Line 2-3' },
            { x: 1, dy: 12, text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    // T177039
    QUnit.test('Two partial font sizes / first element', function(assert) {
        const text = this.createText().attr({ x: 1, y: 2, text: 'Line 1\n<span style=\'font-size: 16px;\'>Line 2-1</span><span style=\'font-size: 18px;\'>Line 2-2</span>\nLine 3' });

        this.checkTspans(assert, text, [
            { x: 1, y: 2, text: 'Line 1' },
            { x: 1, dy: '18px', text: 'Line 2-1' },
            { text: 'Line 2-2' },
            { x: 1, dy: 12, text: 'Line 3' }
        ], { x: 1, y: 2 });
    });

    QUnit.test('Stroked text / empty', function(assert) {
        const text = this.createText().attr({ x: 10, y: 20, stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkEmpty(assert, text);
    });

    QUnit.test('Stroked text / simple', function(assert) {
        const text = this.createText().attr({ x: 10, y: 20, text: 'Simple Text', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'Simple Text' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Stroked text / multiline', function(assert) {
        const text = this.createText().attr({ x: 10, y: 20, text: 'Line 1\nLine 2\nLine 3', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'Line 1' },
            { x: 10, dy: 12, text: 'Line 2' },
            { x: 10, dy: 12, text: 'Line 3' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Stroked text / multiline / HTML encoding', function(assert) {
        this.renderer.encodeHtml = true;
        const text = this.createText().attr({ x: 10, y: 20, text: 'Line 1\nLine 2\nLine 3', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'Line 1' },
            { x: 10, dy: 12, text: 'Line 2' },
            { x: 10, dy: 12, text: 'Line 3' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Stroked text / html tags', function(assert) {
        const text = this.createText().attr({ x: 10, y: 20, text: 'Line 1<br/>Line 2-1<span style=\'font-size: 16px;\'>Line 2-2</span><br/>Line 3', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'Line 1' },
            { x: 10, dy: '16px', text: 'Line 2-1' },
            { text: 'Line 2-2', style: { 'font-size': '16px;' } },
            { x: 10, dy: 12, text: 'Line 3' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Stroked text / html tags / HTML encoding', function(assert) {
        this.renderer.encodeHtml = true;
        const text = this.createText().attr({ x: 10, y: 20, text: 'Line 1<br/>Line 2-1<span style=\'font-size: 16px;\'>Line 2-2</span><br/>Line 3', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });

        this.checkTspans(assert, text, [
            { x: 10, y: 20, text: 'Line 1<br/>Line 2-1<span style=\'font-size: 16px;\'>Line 2-2</span><br/>Line 3' }
        ], { x: 10, y: 20 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.4 });
    });

    QUnit.test('Stroked then non stroked / simple', function(assert) {
        const text = this.createText().attr({ x: 0, y: 0, text: 'Simple Text', stroke: 'black', 'stroke-width': 3 }).attr({ stroke: null });

        this.checkSimple(assert, text, { text: 'Simple Text' }, { x: 0, y: 0 });
    });

    QUnit.test('Stroked then non stroked / multiline', function(assert) {
        const text = this.createText().attr({ x: 0, y: 0, text: 'Line 1\nLine 2\nLine 3', stroke: 'black', 'stroke-width': 3 }).attr({ stroke: null });

        this.checkTspans(assert, text, [
            { x: 0, y: 0, text: 'Line 1' },
            { x: 0, dy: 12, text: 'Line 2' },
            { x: 0, dy: 12, text: 'Line 3' }
        ], { x: 0, y: 0 });
    });

    QUnit.test('Stroked then non stroked / html tags', function(assert) {
        const text = this.createText().attr({ x: 0, y: 0, text: 'Line 1<br/>Line 2-1<span style=\'font-size: 16px;\'>Line 2-2</span><br/>Line 3', stroke: 'black', 'stroke-width': 3 }).attr({ stroke: null });

        this.checkTspans(assert, text, [
            { x: 0, y: 0, text: 'Line 1' },
            { x: 0, dy: '16px', text: 'Line 2-1' },
            { text: 'Line 2-2', style: { 'font-size': '16px;' } },
            { x: 0, dy: 12, text: 'Line 3' }
        ], { x: 0, y: 0 });
    });

    if(!isFirefoxOnLinux()) {

        QUnit.test('Apply ellipsis. Single line', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(110);

            this.checkSimple(assert, text, { text: 'There is test t...' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Single line. Complex line', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There <b>is</b> test text for <i>checking</i> ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(105);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There ' },
                { text: 'is' },
                { text: ' test ...' },
            ], { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Single line, big max width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(1000);

            this.checkSimple(assert, text, { text: 'There is test text for checking ellipsis with single line' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, false);
        });

        QUnit.test('Apply ellipsis. Single line, zero width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(0);

            this.checkSimple(assert, text, { text: '...' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Single line, negative width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(-10);

            this.checkSimple(assert, text, { text: '...' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Single line. Complex line. required length equal startindex of text', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There <b>is</b> test text for <i>checking</i> ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 280 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(78);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There ' },
                { text: 'is' },
                { text: ' ...' },
            ], { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Text should not ellipsis if maxWidth = text width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test' });

            text.element.getBBox = sinon.stub().returns({ width: 40 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(40);

            this.checkSimple(assert, text, { text: 'There is test' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, false);
        });

        QUnit.test('There is not text', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: '' });

            text.element.getBBox = sinon.stub().returns({ width: 0 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(-10);

            this.checkSimple(assert, text, { text: '' }, { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, false);
        });

        QUnit.test('Apply ellipsis. Required length less than width of the ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There <b>is</b> test text for <i>checking</i> ellipsis with single line' });

            text.element.getBBox = sinon.stub().returns({ width: 280 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(18);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: '...' }
            ], { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Multiline', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test\ntext for checking<br/>ellipsis with multi\nline and four lines' });

            text.element.getBBox = sinon.stub().returns({ width: 300 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(60);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There...' },
                { x: 0, dy: 12, text: 'text f...' },
                { x: 0, dy: 12, text: 'ellipsi...' },
                { x: 0, dy: 12, text: 'line a...' }
            ], { x: 0, y: 0 });
            assert.strictEqual(hasEllipsis, true);
        });

        QUnit.test('Apply ellipsis. Multiline. Complex lines', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'It <b>is</b> test\ntext for <i>checking</i><br/>ellipsis <b>with</b> multi\nline <b>and</b><i> four</i> lines' });

            this.prepareRenderBeforeEllipsis();

            text.applyEllipsis(58);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'It ' },
                { text: 'is' },
                { text: ' t...' },
                { x: 0, dy: 12, text: 'text f...' },
                { x: 0, dy: 12, text: 'ellips...' },
                { x: 0, dy: 12, text: 'line ' },
                { text: 'a...' }
            ], { x: 0, y: 0 });
        });

        QUnit.test('Apply ellipsis. Multiline. Complex lines. With stroked', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'It <b>is</b> test\ntext for <i>checking</i><br/>ellipsis <b>with</b> multi\nline <b>and</b><i> four</i> lines', stroke: 'black', 'stroke-width': 3 });

            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(34);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'It ' },
                { text: '...' },
                { x: 0, dy: 12, text: 'te...' },
                { x: 0, dy: 12, text: 'el...' },
                { x: 0, dy: 12, text: 'li...' }
            ], { x: 0, y: 0 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 1 });
        });

        // T629325
        QUnit.test('Apply ellipsis. Multiline. There is single white space in second line', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'Line one<br/>Line two <b>with</b> <i>single</i> white space' });

            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(130);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'Line one' },
                { x: 0, dy: 12, text: 'Line two ' },
                { text: 'with' },
                { text: ' ' },
                { text: 'si...' }
            ], { x: 0, y: 0 });
        });

        QUnit.test('Apply ellipsis. Multiline. With encode html', function(assert) {
            this.renderer.encodeHtml = true;
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test\ntext for checking<br/>ellipsis with single\nline' });

            text.element.getBBox = sinon.stub().returns({ width: 400 });
            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(70);

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There i...' },
                { x: 0, dy: 12, text: 'text for...' },
                { x: 0, dy: 12, text: 'line' }
            ], { x: 0, y: 0 });
        });

        QUnit.test('Not apply ellipsis. One symbol', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: '7' });

            text.element.getBBox = sinon.stub().returns({ width: 300, height: 20, x: 0, y: 0 });
            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(1);

            this.checkSimple(assert, text, { text: '7' }, { x: 0, y: 0 });
            assert.ok(!hasEllipsis);
        });

        QUnit.test('Apply ellipsis second time with new width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis' });
            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(40);
            const textAfterFirstIteration = text.element.childNodes[0].wholeText;

            // act
            text.applyEllipsis(80);
            const textAfterSecondIteration = text.element.childNodes[0].wholeText;

            // assert
            assert.ok(textAfterSecondIteration.length > textAfterFirstIteration.length);
            assert.equal(textAfterSecondIteration.substr(-3), '...');
        });

        QUnit.test('restore text after ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis' });
            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(40);

            text.restoreText();
            assert.equal(text.element.childNodes[0].wholeText, 'There is test text for checking ellipsis');
        });

        QUnit.test('Apply new text after ellipsis - draw new text, reset ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'It <b>is</b> test\ntext for <i>checking</i><br/>ellipsis <b>with</b> multi\nline <b>and</b><i> four</i> lines' });
            text.element.getBBox = sinon.stub().returns({ width: 300, height: 20, x: 0, y: 0 });
            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(40);

            text.attr({ text: 'There is test\ntext for checking<br/>ellipsis with single\nline' });

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There is test' },
                { x: 0, dy: 12, text: 'text for checking' },
                { x: 0, dy: 12, text: 'ellipsis with single' },
                { x: 0, dy: 12, text: 'line' }
            ], { x: 0, y: 0 });
        });

        QUnit.test('Apply stroke after ellipsis - draw old text with stroke, reset ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, text: 'There is test\ntext for checking<br/>ellipsis with single\nline' });
            text.element.getBBox = sinon.stub().returns({ width: 400, height: 20, x: 0, y: 0 });
            this.prepareRenderBeforeEllipsis();
            text.applyEllipsis(40);

            text.attr({ stroke: 'black', 'stroke-width': 3 });

            this.checkTspans(assert, text, [
                { x: 0, y: 0, text: 'There is test' },
                { x: 0, dy: 12, text: 'text for checking' },
                { x: 0, dy: 12, text: 'ellipsis with single' },
                { x: 0, dy: 12, text: 'line' }
            ], { x: 0, y: 0 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 1 });
        });

        QUnit.test('Apply ellipsis of rotated element', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 0, y: 0, rotate: 270, text: 'There is test text for checking ellipsis with single line' });

            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(100);

            assert.strictEqual(hasEllipsis, true);
            assert.equal(text.element.childNodes[0].wholeText.substr(-3), '...');
        });

        QUnit.test('Do not apply ellipsis if element not added', function(assert) {
            const text = this.createText().attr({ x: 0, y: 0, text: 'There is test text for checking ellipsis with single line' });

            this.prepareRenderBeforeEllipsis();
            const hasEllipsis = text.applyEllipsis(100);

            assert.strictEqual(hasEllipsis, false);
        });


        QUnit.test('security of renderer', function(assert) {
            const withoutClosingTags = this.createText().attr({ text: 'text >with <angle brackets > without closing', x: 20, y: 30 });
            const withClosing = this.createText().attr({ text: 'text <with>angle brackets </with >closing', x: 20, y: 30 });
            const withSimpleMarkup = this.createText().attr({ text: 'text with markup1<a class="className"></a>', x: 20, y: 30 });
            const withSimpleStyleTag = this.createText().attr({ text: '<b href="mref" src="s" onerror="(function(){})()" style="font-size:11px;" >aa</b>', x: 20, y: 30 });
            const attrWithSpace = this.createText().attr({ text: '<img onerror  =  \'function(){}\' />' });
            const mixedQuotes = this.createText().attr({ text: '<b href="mref" src="s" onerror=\'(function(){})()\' >aa</b>', x: 20, y: 30 });
            const mixedQuotesWithStyle1 = this.createText().attr({
                text: '<b style="font-size:11px;fill:#767676;font-family:\'Segoe UI\', \'Helvetica Neue\'font-weight:400;cursor:default;" >aa</b>', x: 20, y: 30
            });
            const mixedQuotesWithStyle2 = this.createText().attr({
                text: '<b style=\'font-size:11px;fill:#767676;font-family:"Segoe UI", "Helvetica Neue"font-weight:400;cursor:default;\' src=\'ms\' >aa</b>', x: 20, y: 30
            });
            const mixedQuotesWithStyle3 = this.createText().attr({
                text: '<b style=\'font-size:11px;fill:#767676;font-family:"Segoe UI"; cursor:default;\' href=\'mref\'> </b>', x: 20, y: 30
            });
            const mixedQuotesWithStyle4 = this.createText().attr({
                text: '<b src=\'e\' style=\'font-size:11px;fill:#767676;font-family:"Segoe UI", "Helvetica Neue";font-weight:400;cursor:default;\' >aa</b>', x: 20, y: 30
            });
            const withoutQuotes = this.createText().attr({
                text: '<video src=1 style=\'font-size:11px;\' onerror=alert(1)> </video>', x: 20, y: 30
            });

            assert.strictEqual(withoutClosingTags.DEBUG_parsedHtml, 'text >with <angle > without closing');
            assert.strictEqual(withClosing.DEBUG_parsedHtml, 'text <with>angle brackets </with >closing');
            assert.strictEqual(withSimpleMarkup.DEBUG_parsedHtml, 'text with markup1<a class="className"></a>');
            assert.strictEqual(withSimpleStyleTag.DEBUG_parsedHtml, '<b style="font-size:11px;" >aa</b>');
            assert.strictEqual(attrWithSpace.DEBUG_parsedHtml, '<img />');
            assert.strictEqual(mixedQuotes.DEBUG_parsedHtml, '<b >aa</b>');
            assert.strictEqual(mixedQuotesWithStyle1.DEBUG_parsedHtml, '<b style="font-size:11px;fill:#767676;font-family:\'Segoe UI\', \'Helvetica Neue\'font-weight:400;cursor:default;" >aa</b>');
            assert.strictEqual(mixedQuotesWithStyle2.DEBUG_parsedHtml, '<b style=\'font-size:11px;fill:#767676;font-family:"Segoe UI", "Helvetica Neue"font-weight:400;cursor:default;\' >aa</b>');
            assert.strictEqual(mixedQuotesWithStyle3.DEBUG_parsedHtml, '<b style=\'font-size:11px;fill:#767676;font-family:"Segoe UI"; cursor:default;\' > </b>');
            assert.strictEqual(mixedQuotesWithStyle4.DEBUG_parsedHtml, '<b style=\'font-size:11px;fill:#767676;font-family:"Segoe UI", "Helvetica Neue";font-weight:400;cursor:default;\' >aa</b>');
            assert.strictEqual(withoutQuotes.DEBUG_parsedHtml, '<video style=\'font-size:11px;\' > </video>');
        });

        QUnit.module('TextSvgElement. Apply text overflow rules', textEnvironment);

        QUnit.test('WordWrap normal', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>There is test text for checking ellipsis with single line<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal'
            });
            assert.deepEqual(result, { rowCount: 5, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'There is test' },
                { x: 35, dy: 12, text: 'text for' },
                { x: 35, dy: 12, text: 'checking' },
                { x: 35, dy: 12, text: 'ellipsis with' },
                { x: 35, dy: 12, text: 'single line' }
            ], { x: 35, y: 100 });

            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('WordWrap normal. Single long word', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>longlonglonglonglong<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'clip'
            });

            assert.deepEqual(result, { rowCount: 1, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'longlonglonglonglong' },
            ], { x: 35, y: 100 });

            // TO-DO clip rect
        });

        QUnit.test('Single line. wordWrap word-break', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>longlonglonglonglonglonglong<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'word-break'
            });

            assert.deepEqual(result, { rowCount: 2, textChanged: true, textIsEmpty: false });

            assert.equal(text.element.textContent, 'longlonglonglonglonglonglong');
            assert.equal(text.element.childNodes.length, 2);

            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('Single line. wordWrap normal. text overflow clip', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>long longlonglonglonglonglong long<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'clip'
            });

            assert.deepEqual(result, { rowCount: 3, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'long' },
                { x: 35, dy: 12, text: 'longlonglonglonglonglong' },
                { x: 35, dy: 12, text: 'long' }
            ], { x: 35, y: 100 });

            assert.ok(text.getBBox().width > 110);

            // TO-DO clip rect
        });

        QUnit.test('wordWrap normal. text overflow ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>long longlonglonglonglonglong long<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 3, textChanged: true, textIsEmpty: false });

            assert.notStrictEqual(text.element.childNodes[1].textContent.indexOf('...'), -1);

            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('wordWrap normal. text overflow hide', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>long longlonglonglonglonglong long<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'hide'
            });

            assert.deepEqual(result, { rowCount: 0, textChanged: true, textIsEmpty: true });
            assert.equal(text.getBBox().width, 0);
        });

        QUnit.test('wordWrap normal. Simple text', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'There is test text for checking ellipsis with single line' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal'
            });

            assert.deepEqual(result, { rowCount: 4, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'There is test text' },
                { x: 35, dy: 12, text: 'for checking' },
                { x: 35, dy: 12, text: 'ellipsis with' },
                { x: 35, dy: 12, text: 'single line' }
            ], { x: 35, y: 100 });

            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('Single line. wordWrap none', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '<b>longlonglonglonglonglonglong<b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 1, textChanged: true, textIsEmpty: false });

            assert.ok(text.element.textContent.indexOf('...') > 0);
            assert.equal(text.element.childNodes.length, 1);

            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('Complex text. wordWrap normal', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'There <b>is</b> test <b>text for</b> <br/>checking <b>ellipsis</b> with single <i>line</i>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 5, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'There ' },
                { x: null, y: null, text: 'is' },
                { x: null, y: null, text: ' test ' },
                { x: null, y: null, text: 'text' },
                { x: 35, dy: 12, text: 'for' },
                { x: 35, dy: 12, text: 'checking ' },
                { x: null, y: null, text: 'ellipsis' },
                { x: 35, dy: 12, text: 'with single ' },
                { x: 35, dy: 12, text: 'line' },

            ], { x: 35, y: 100 });

            assert.equal(text.element.childNodes[4].style.fontWeight, 'bold');
            assert.equal(text.element.childNodes[5].style.fontWeight, '');
        });

        // T982300
        QUnit.test('Wordwrap long text with too small width', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'Thereislong text' });

            this.prepareRenderBeforeEllipsis();

            // act
            const result = text.setMaxSize(3, undefined, {
                wordWrap: 'breakWord',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 2, textChanged: true, textIsEmpty: false });
        });

        QUnit.test('Complex text. wordWrap: none, text overflow: ellipsis - remove test next to ellipsis', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'longlonglonglonglong <b>longlonglonglonglong</b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 1, textChanged: true, textIsEmpty: false });

            assert.equal(text.element.childNodes.length, 1);
        });

        QUnit.test('Complex text. wordWrap: none, text overflow: ellipsis - remove test next to ellipsis. Stroked text', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', 'stroke-width': 2, text: 'longlonglonglonglong <b>longlonglonglonglong</b>' });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.equal(text.element.childNodes.length, 2);
        });

        QUnit.test('Complex text. wordWrap: normal, text overflow: ellipsis - wrap word', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'longlonglonglonglong <b>longlonglonglonglong</b>' });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 2, textChanged: true, textIsEmpty: false });

            assert.equal(text.element.childNodes.length, 2);
        });

        QUnit.test('WordWrap stroked text', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black', stroke: 'black', 'stroke-width': 3,
                text: 'There is test text for checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal'
            });

            assert.deepEqual(result, { rowCount: 4, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'There is test text' },
                { x: 35, dy: 12, text: 'for checking' },
                { x: 35, dy: 12, text: 'ellipsis with' },
                { x: 35, dy: 12, text: 'single line' }
            ], { x: 35, y: 100 }, { stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 1 });
        });

        QUnit.test('WordWrap long text. Keep visible ellipsis when width is too small', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black', stroke: 'black',
                text: 'There is'
            });

            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(1, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.deepEqual(result, { rowCount: 1, textChanged: true, textIsEmpty: false });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: '...' }
            ], { x: 35, y: 100 });
        });

        QUnit.test('Set max height. textOverflow hide', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There is test text for checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 20, {
                wordWrap: 'normal',
                textOverflow: 'hide'
            });

            assert.equal(text.getBBox().height, 0);
        });

        QUnit.test('Set max height. null as height', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There is test text for checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, null, {
                wordWrap: 'normal',
                textOverflow: 'ellipsis'
            });
            assert.notStrictEqual(text.getBBox().height, 0);
        });

        QUnit.test('Set max height. TextOverflow = \'none\'. Show all texts ', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There is test text for checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 10, {
                wordWrap: 'normal',
                textOverflow: 'none'
            });

            assert.notStrictEqual(text.getBBox().height, 0);
        });

        QUnit.test('Set max height. textOverflow ellipsis. multi line text, Last text width less than maxWidth - add ... at the end', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There\nis\ntest\ntext\nfor checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 25, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'There' },
                { x: 35, dy: 12, text: 'is...' },
            ], { x: 35, y: 100 });
        });

        QUnit.test('Set max height. textOverflow ellipsis. multi line text, Do not add ... double times', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'Text\nText Text Text Text Text Text\nText'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 25, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.ok(text.element.childNodes[1].textContent.indexOf('...') > 0);
            assert.equal(text.element.childNodes[1].textContent.indexOf('......'), -1);
            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('Set max height. textOverflow ellipsis. Slice text', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'Text\nText Text Text 1\nText'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 25, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.ok(text.element.childNodes[1].textContent.indexOf('...') > 0);
            assert.ok(text.getBBox().width <= 110);
        });

        QUnit.test('Set max height without width', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'Text\nText Text Text 1\nText'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(null, 25, {
                wordWrap: 'breakWord',
                textOverflow: 'ellipsis'
            });

            this.checkTspans(assert, text, [
                { x: 35, y: 100, text: 'Text' },
                { x: 35, dy: 12, text: 'Text Text Text 1...' },
            ], { x: 35, y: 100 });
        });

        // T732389
        QUnit.test('textOverflow hide. Can apply x attr on hidden text', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There is test text for checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(110, 20, {
                wordWrap: 'normal',
                textOverflow: 'hide'
            });

            text.attr({ x: 45 });
            this.checkSimple(assert, text, undefined, { x: 45, y: 100 });
        });

        QUnit.test('setMaxWidth with width that is less then zero', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'Text' });

            this.prepareRenderBeforeEllipsis();

            text.setMaxSize(-1, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis'
            });

            assert.equal(text.element.textContent, '...');
        });

        QUnit.test('Can hide ellipsis if maxWidth too small', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'Text' });

            this.prepareRenderBeforeEllipsis();

            text.setMaxSize(-1, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis',
                hideOverflowEllipsis: true
            });

            assert.equal(text.element.textContent, '');
        });

        QUnit.test('Do not hide ellipsis if maxWidth is enought to dispay it', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'Text Text Text Text' });

            this.prepareRenderBeforeEllipsis();

            text.setMaxSize(60, undefined, {
                wordWrap: 'none',
                textOverflow: 'ellipsis',
                hideOverflowEllipsis: true
            });

            assert.ok(text.element.textContent.indexOf, '...' > 0);
        });

        QUnit.test('Hide ellipsis string in multiple line text with height limit', function(assert) {
            const text = this.createText().append(this.svg).attr({
                x: 35, y: 100, fill: 'black',
                text: 'There\nis\ntest\ntext\nfor checking ellipsis with single line'
            });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(10, 25, {
                wordWrap: 'none',
                textOverflow: 'ellipsis',
                hideOverflowEllipsis: true
            });

            assert.equal(text.element.textContent, '');
        });

        QUnit.test('WordWrap normal with title element', function(assert) {
            const text = this.createText().append(this.svg).attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: 'Text Text Text Text Text Text' });

            text.setTitle('hint');
            this.prepareRenderBeforeEllipsis();
            const result = text.setMaxSize(110, undefined, {
                wordWrap: 'normal'
            });
            assert.ok(result.textChanged);
            assert.equal(domAdapter.querySelectorAll(text.element, 'title').length, 1);
        });

        QUnit.test('T820606. call setMaxHeight for detached text element', function(assert) {
            const text = this.createText().attr({ x: 35, y: 100, fill: 'black', stroke: 'black', text: '200K' });

            this.prepareRenderBeforeEllipsis();
            text.setMaxSize(-103, undefined, {
                wordWrap: 'normal',
                textOverflow: 'hide'
            });

            assert.equal(text.element.textContent, '200K');
        });
    }
})();
