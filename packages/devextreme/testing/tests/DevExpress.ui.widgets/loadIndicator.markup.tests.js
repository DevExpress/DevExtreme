import $ from 'jquery';
import support from '__internal/core/utils/m_support';

import {
    LOADINDICATOR_CLASS,
    LOADINDICATOR_ICON_CLASS,
    LOADINDICATOR_CONTENT_CLASS,
    LOADINDICATOR_SEGMENT_CLASS,
    LOADINDICATOR_IMAGE_CLASS,
    LOADINDICATOR_WRAPPER_CLASS,
    ANIMATION_TYPE_CLASSES,
} from '__internal/ui/load_indicator';

import 'ui/load_indicator';

QUnit.testStart(function() {
    const markup = '<div id="loadIndicator"></div>';

    $('#qunit-fixture').html(markup);
});

const isIdenticalNamesInUrl = (firstUrl, secondUrl) => {
    const parts = firstUrl.split('/');
    const firstName = parts[parts.length - 1]
        .replace(/\)/g, '')
        .replace(/"/g, '');

    const parts2 = secondUrl.split('/');
    const secondName = parts2[parts2.length - 1];

    return firstName === secondName;
};

QUnit.module('LoadIndicator markup', () => {
    QUnit.test('Basic markup initialization', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator();
        const $indicatorWrapper = $indicator.find(`.${LOADINDICATOR_WRAPPER_CLASS}`);
        const $indicatorContent = $indicator.find(`.${LOADINDICATOR_CONTENT_CLASS}`);

        assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), 'Load Indicator initialized');
        assert.strictEqual($indicatorWrapper.length, 1, 'Wrapper has been added');
        assert.strictEqual($indicatorContent.length, 1, 'Content is added');
    });

    QUnit.test('LoadIndicator width custom dimensions', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ width: 75, height: 75 });
        const indicatorElement = $indicator.get(0);

        assert.strictEqual(indicatorElement.style.width, '75px', 'outer width of the element must be equal to custom width');
        assert.strictEqual(indicatorElement.style.height, '75px', 'outer height of the element must be equal to custom width');
    });
});

QUnit.module('Static load indicator', {
    beforeEach() {
        this._defaultAnimation = support.animation;
        support.animation = function() { return false; };
    },
    afterEach() {
        support.animation = this._defaultAnimation;
    }
}, () => {
    QUnit.test('basic render', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false });
        const $indicatorWrapper = $indicator.find(`.${LOADINDICATOR_WRAPPER_CLASS}`);

        assert.notOk($indicatorWrapper.hasClass(`.${LOADINDICATOR_IMAGE_CLASS}`), 'Image class not added');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_ICON_CLASS}`).length, 0, 'Icon div not created');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT_CLASS}`).length, 0, '16 Segment not created');
        assert.strictEqual($indicator.find(`.${LOADINDICATOR_SEGMENT_CLASS}1`).length, 0, 'Numerated segment not created');
    });

    QUnit.test('custom indicator', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';
        const $element = $('#loadIndicator').dxLoadIndicator({
            visible: true,
            indicatorSrc: url,
        });
        const $wrapper = $element.find(`.${LOADINDICATOR_WRAPPER_CLASS}`);
        const instance = $('#loadIndicator').dxLoadIndicator('instance');

        const getBackgroundImage = () => $wrapper[0].style.backgroundImage;

        assert.strictEqual(isIdenticalNamesInUrl(getBackgroundImage(), url), true, 'custom indicator installed successfully as image');

        instance.option('indicatorSrc', '');

        assert.strictEqual(getBackgroundImage(), 'none', 'custom indicator changed successfully as image');
    });
});

QUnit.module('animation type', () => {
    QUnit.test('content should have circle animation class by default', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator();
        const $indicatorContent = $element.find(`.${LOADINDICATOR_CONTENT_CLASS}`);

        assert.strictEqual($indicatorContent.hasClass(ANIMATION_TYPE_CLASSES['circle']), true, 'animation class has been added');
    });

    QUnit.test('content should not have any animation class if animation type is undefined', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator({ animationType: undefined });

        const $indicatorContent = $element.find(`.${LOADINDICATOR_CONTENT_CLASS}`);
        const classCount = $indicatorContent[0].classList.length || 0;

        assert.strictEqual(classCount, 1, 'animation classes has not been added');
    });

    QUnit.test('content should have circle animation class in runtime', function(assert) {
        const instance = $('#loadIndicator')
            .dxLoadIndicator({ animationType: undefined })
            .dxLoadIndicator('instance');

        const getContent = () => instance.$element().find(`.${LOADINDICATOR_CONTENT_CLASS}`);
        const classCount = getContent()[0].classList.length || 0;

        assert.strictEqual(classCount, 1, 'animation classes has not been added');

        instance.option({ animationType: 'circle' });

        assert.strictEqual(getContent().hasClass(ANIMATION_TYPE_CLASSES['circle']), true, 'animation class has been added');
    });

    QUnit.test('content should have sparkle animation class if animation type is sparkle', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator({ animationType: 'sparkle' });
        const $indicatorContent = $element.find(`.${LOADINDICATOR_CONTENT_CLASS}`);

        assert.strictEqual($indicatorContent.hasClass(ANIMATION_TYPE_CLASSES['sparkle']), true, 'animation class has been changed');
    });

    QUnit.test('content should have sparkle animation class in runtime', function(assert) {
        const instance = $('#loadIndicator').dxLoadIndicator().dxLoadIndicator('instance');

        instance.option({ animationType: 'sparkle' });

        const $content = instance.$element().find(`.${LOADINDICATOR_CONTENT_CLASS}`);

        assert.strictEqual($content.hasClass(ANIMATION_TYPE_CLASSES['sparkle']), true, 'animation class has been changed');
    });

    QUnit.test('content should have 3 segments if animation type is sparkle', function(assert) {
        const $element = $('#loadIndicator').dxLoadIndicator({ animationType: 'sparkle', visible: true });
        const $segments = $element.find(`.${LOADINDICATOR_SEGMENT_CLASS}`);

        assert.strictEqual($segments.length, 3, '3 segments are rendered');
    });
});
