var $ = require('jquery'),
    support = require('core/utils/support');

require('common.css!');
require('ui/load_indicator');

QUnit.testStart(function() {
    var markup =
        '<div id="loadIndicator"></div>';

    $('#qunit-fixture').html(markup);
});

var LOADINDICATOR_CLASS = 'dx-loadindicator',
    LOADINDICATOR_WRAPPER = LOADINDICATOR_CLASS + '-wrapper',
    LOADINDICATOR_ICON = LOADINDICATOR_CLASS + '-icon',
    LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content',
    LOADINDICATOR_SEGMENT = LOADINDICATOR_CLASS + '-segment',
    LOADINDICATOR_IMAGE = 'dx-loadindicator-image';

var isIdenticalNamesInUrl = function(firstUrl, secondUrl) {
    var firstName = firstUrl.split('/');
    firstName = firstName[firstName.length - 1].replace(')', '').replace('"', '');
    var secondName = secondUrl.split('/');
    secondName = secondName[secondName.length - 1];
    return firstName === secondName;
};

QUnit.module('LoadIndicator markup', () => {
    QUnit.test('Basic markup initialization', function(assert) {
        var $indicator = $('#loadIndicator').dxLoadIndicator(),
            $indicatorWrapper = $indicator.find('.' + LOADINDICATOR_WRAPPER),
            $indicatorContent = $indicator.find('.' + LOADINDICATOR_CONTENT_CLASS);

        assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), 'Load Indicator initialized');
        assert.equal($indicatorWrapper.length, 1, 'Wrapper has been added');
        assert.equal($indicatorContent.length, 1, 'Content is added');
    });

    QUnit.test('LoadIndicator width custom dimensions', function(assert) {
        var $indicator = $('#loadIndicator').dxLoadIndicator({ width: 75, height: 75 }),
            indicatorElement = $indicator.get(0);

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
        var $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false, viaImage: false }),
            $indicatorWrapper = $indicator.find('.' + LOADINDICATOR_WRAPPER);

        assert.ok($indicatorWrapper.hasClass(LOADINDICATOR_IMAGE), 'Image class added');
        assert.equal($indicator.find('.' + LOADINDICATOR_ICON).length, 0, 'Icon div not created');
        assert.equal($indicator.find('.' + LOADINDICATOR_SEGMENT).length, 0, '16 Segment not created');
        assert.equal($indicator.find('.' + LOADINDICATOR_SEGMENT + '1').length, 0, 'Numerated segment not created');
    });

    QUnit.test('custom indicator', function(assert) {
        var url = '../../testing/content/customLoadIndicator.png',
            $element = $('#loadIndicator').dxLoadIndicator({
                visible: true,
                indicatorSrc: url
            }),
            $wrapper = $element.find('.' + LOADINDICATOR_WRAPPER),
            instance = $('#loadIndicator').dxLoadIndicator('instance'),
            getBackgroundImage = function() { return $wrapper[0].style.backgroundImage; };

        assert.ok(isIdenticalNamesInUrl(getBackgroundImage(), url), 'custom indicator installed successfully as image');
        instance.option('indicatorSrc', '');
        assert.ok(getBackgroundImage() !== '', 'custom indicator changed successfully as image');
    });
});

