import $ from 'jquery';
import support from 'core/utils/support';

import 'ui/load_indicator';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="loadIndicator"></div>';

    $('#qunit-fixture').html(markup);
});

const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_WRAPPER = LOADINDICATOR_CLASS + '-wrapper';
const LOADINDICATOR_ICON = LOADINDICATOR_CLASS + '-icon';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_SEGMENT = LOADINDICATOR_CLASS + '-segment';
const LOADINDICATOR_IMAGE = 'dx-loadindicator-image';

const isIdenticalNamesInUrl = function(firstUrl, secondUrl) {
    let firstName = firstUrl.split('/');
    firstName = firstName[firstName.length - 1].replace(')', '').replace('"', '');
    let secondName = secondUrl.split('/');
    secondName = secondName[secondName.length - 1];
    return firstName === secondName;
};

QUnit.module('LoadIndicator markup', () => {
    QUnit.test('Basic markup initialization', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator(); const $indicatorWrapper = $indicator.find('.' + LOADINDICATOR_WRAPPER); const $indicatorContent = $indicator.find('.' + LOADINDICATOR_CONTENT_CLASS);

        assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), 'Load Indicator initialized');
        assert.equal($indicatorWrapper.length, 1, 'Wrapper has been added');
        assert.equal($indicatorContent.length, 1, 'Content is added');
    });

    QUnit.test('LoadIndicator width custom dimensions', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ width: 75, height: 75 }); const indicatorElement = $indicator.get(0);

        assert.strictEqual(indicatorElement.style.width, '75px', 'outer width of the element must be equal to custom width');
        assert.strictEqual(indicatorElement.style.height, '75px', 'outer height of the element must be equal to custom width');
    });
});

QUnit.module('Static load indicator', {
    beforeEach: function() {
        // Override support styleProp
        this._defaultAnimation = support.animation;
        support.animation = function() { return false; };
    },
    afterEach: function() {
        // Restoring support styleProp
        support.animation = this._defaultAnimation;
    }
}, () => {
    QUnit.test('basic render', function(assert) {
        const $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false, viaImage: false }); const $indicatorWrapper = $indicator.find('.' + LOADINDICATOR_WRAPPER);

        assert.ok($indicatorWrapper.hasClass(LOADINDICATOR_IMAGE), 'Image class added');
        assert.equal($indicator.find('.' + LOADINDICATOR_ICON).length, 0, 'Icon div not created');
        assert.equal($indicator.find('.' + LOADINDICATOR_SEGMENT).length, 0, '16 Segment not created');
        assert.equal($indicator.find('.' + LOADINDICATOR_SEGMENT + '1').length, 0, 'Numerated segment not created');
    });

    QUnit.test('custom indicator', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';
        const $element = $('#loadIndicator').dxLoadIndicator({
            visible: true,
            indicatorSrc: url
        });
        const $wrapper = $element.find('.' + LOADINDICATOR_WRAPPER);
        const instance = $('#loadIndicator').dxLoadIndicator('instance');
        const getBackgroundImage = function() { return $wrapper[0].style.backgroundImage; };

        assert.ok(isIdenticalNamesInUrl(getBackgroundImage(), url), 'custom indicator installed successfully as image');
        instance.option('indicatorSrc', '');
        assert.notStrictEqual(getBackgroundImage(), '', 'custom indicator changed successfully as image');
    });
});

