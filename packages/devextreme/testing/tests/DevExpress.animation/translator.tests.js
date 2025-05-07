const $ = require('jquery');
const translator = require('common/core/animation/translator');
const styleUtils = require('core/utils/style');
const transformStyle = styleUtils.styleProp('transform');

QUnit.module('translator', {
    beforeEach: function() {
        this.$container = $('<div>').css({ position: 'relative', height: '100px' }).appendTo('#qunit-fixture');
        this.$element = $('<div>').css({ position: 'absolute', height: '100px' }).appendTo(this.$container);
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('translator.getTranslateCss', function(assert) {
    let translateCss = translator.getTranslateCss({ x: 100, y: -100 });
    assert.equal(translateCss, 'translate(100px, -100px)');

    translateCss = translator.getTranslateCss({ x: 100 });
    assert.equal(translateCss, 'translate(100px, 0px)');
});

QUnit.test('translator.getTranslate', function(assert) {
    this.$element.css(transformStyle, translator.getTranslateCss({ x: 100, y: -100 }));
    assert.deepEqual(translator.getTranslate(this.$element), {
        x: 100,
        y: -100,
        z: 0
    });

    // NOTE: translate3d was removed because of Android and iOS bugs
    this.$element.css(transformStyle, translator.getTranslateCss({ x: 100, y: -100, z: 300 }));
    assert.deepEqual(translator.getTranslate(this.$element), {
        x: 100,
        y: -100,
        z: 0
    });
});

QUnit.test('translator.move', function(assert) {
    translator.move(this.$element, { left: 100, top: -100 });
    assert.deepEqual(translator.getTranslate(this.$element), {
        x: 100,
        y: -100,
        z: 0
    });

    translator.move(this.$element, { left: 200 });
    assert.deepEqual(translator.getTranslate(this.$element), {
        x: 200,
        y: -100,
        z: 0
    });

    translator.move(this.$element, { top: 100 });
    assert.deepEqual(translator.getTranslate(this.$element), {
        x: 200,
        y: 100,
        z: 0
    });
});

QUnit.test('translator.locate', function(assert) {
    translator.move(this.$element, { left: 100, top: -100 });

    const position = translator.locate(this.$element);
    assert.deepEqual(position, {
        left: 100,
        top: -100
    });
});

QUnit.test('set up position in percent', function(assert) {
    translator.move(this.$element, { left: '100%', top: '-100%' });

    const position = translator.locate(this.$element);
    assert.deepEqual(position, {
        left: this.$element.width(),
        top: -this.$element.height()
    }, 'correct position');
});
