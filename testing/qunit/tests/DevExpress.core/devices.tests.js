window.includeThemesLinks();

const $ = require('jquery');
const renderer = require('core/renderer');
const themes = require('ui/themes');
const devices = require('core/devices');
const fromUA = $.proxy(devices._fromUA, devices);
const viewPort = require('core/utils/view_port');
const viewPortChanged = viewPort.changeCallback;
const resizeCallbacks = require('core/utils/resize_callbacks');
const config = require('core/config');

const userAgents = {
    iphone_12: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/15E148 Safari/604.1',
    ipad_10: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1',
    android_9: 'Mozilla/5.0 (Linux; Android 9; Mi A2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36',
    android_4_3_4: 'Mozilla/5.0 (Linux; Android 4.3.4; Galaxy Nexus Build/IMM76B)AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
    android_4_4_0: 'Mozilla/5.0 (Linux; Android 4.4.0; Galaxy Nexus Build/IMM76B)AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
    android_tablet_7_1_1: 'Mozilla/5.0 (Linux; Android 7.1.1; SM-T555 Build/NMF26X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Safari/537.36',
    win_phone_10: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; NOKIA; Lumia 920) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.0',
    win_arm_8: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Tablet PC; Trident/6.0)',
    win8_1_ie11: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Tablet PC 2.0; rv:11.0) like Gecko'
};

QUnit.module('devices', {
    beforeEach: function() {
        this._savedDevice = devices.current();
    },
    afterEach: function() {
        devices.current(this._savedDevice);
    }
});

QUnit.test('ios by userAgent', function(assert) {
    let device = fromUA(userAgents.iphone_12);

    assert.equal(device.platform, 'ios', 'platform is ios');
    assert.equal(device.version.toString(), '12,3,1', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');

    device = fromUA(userAgents.ipad_10);

    assert.equal(device.platform, 'ios', 'platform is ios');
    assert.equal(device.version.toString(), '10,3,3', 'correct version');
    assert.equal(device.deviceType, 'tablet', 'deviceType is tablet');
});

QUnit.test('android by userAgent', function(assert) {
    let device = fromUA(userAgents.android_4_3_4);

    assert.equal(device.platform, 'android', 'platform is android');
    assert.equal(device.version.toString(), '4,3,4', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');
    assert.equal(device.grade, 'B', 'grade is B');

    device = fromUA(userAgents.android_4_4_0);

    assert.equal(device.platform, 'android', 'platform is android');
    assert.equal(device.version.toString(), '4,4,0', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');
    assert.equal(device.grade, 'A', 'grade is A');

    device = fromUA(userAgents.android_tablet_7_1_1);

    assert.equal(device.platform, 'android', 'platform is android');
    assert.equal(device.version.toString(), '7,1,1', 'correct version');
    assert.equal(device.deviceType, 'tablet', 'deviceType is tablet');

    device = fromUA(userAgents.android_9);

    assert.equal(device.platform, 'android', 'platform is android');
    assert.equal(device.version.toString(), '9,0,0', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');
});

QUnit.test('win8 tablet by userAgent', function(assert) {
    const device = fromUA(userAgents.win_arm_8);

    assert.equal(device.platform, 'generic', 'platform is generic');
    assert.equal(device.deviceType, 'tablet', 'deviceType is tablet');
});

QUnit.test('win8.1 IE11 by userAgent', function(assert) {
    const device = fromUA(userAgents.win8_1_ie11);

    assert.equal(device.platform, 'generic', 'platform is generic');
    assert.equal(device.deviceType, 'desktop', 'deviceType is desktop');
});

QUnit.test('iphone by device name', function(assert) {
    let device;

    devices.current('iPhone');
    device = devices.current();
    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone5');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone6');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');

    devices.current('iPhone6plus');
    device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('ipad by device name', function(assert) {
    devices.current('iPad');
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('ipad mini by device name', function(assert) {
    devices.current('iPadMini');
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('android phone by device name', function(assert) {
    devices.current('androidPhone');
    const device = devices.current();

    assert.equal(device.platform, 'android', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('android tablet by device name', function(assert) {
    devices.current('androidTablet');
    const device = devices.current();

    assert.equal(device.platform, 'android', 'correct platform');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType');
});

QUnit.test('winphone10 by userAgent', function(assert) {
    const device = fromUA(userAgents.win_phone_10);

    assert.strictEqual(device.deviceType, 'phone', 'correct deviceType');
    assert.strictEqual(device.platform, 'generic', 'platform is generic because win is deprecated');
});

QUnit.test('generic phone by device name', function(assert) {
    devices.current('genericPhone');
    const device = devices.current();

    assert.equal(device.platform, 'generic', 'correct platform');
    assert.equal(device.deviceType, 'phone', 'correct deviceType');
});

QUnit.test('current', function(assert) {
    devices.current(fromUA(userAgents.iphone_12));
    const device = devices.current();

    assert.equal(device.platform, 'ios', 'platform is ios');
    assert.equal(device.version.toString(), '12,3,1', 'correct version');
    assert.equal(device.deviceType, 'phone', 'deviceType is phone');
});

QUnit.test('method current sets necessary flags', function(assert) {
    devices.current({
        platform: 'android',
        deviceType: 'tablet'
    });

    const device = devices.current();

    assert.ok(device.android, 'correct android flag');
    assert.ok(device.tablet, 'correct tablet flag');
});

QUnit.test('method current sets correct shortcuts if deviceType was not forced (T268185)', function(assert) {
    devices.current({
        platform: 'android',
        deviceType: 'tablet'
    });

    devices.current({
        platform: 'ios'
    });

    const device = devices.current();

    assert.ok(device.ios, 'correct ios flag');
    assert.equal(device.deviceType, 'tablet', 'correct deviceType value');
    assert.ok(device.tablet, 'correct tablet flag');
});

QUnit.test('method themes.ready calls a callback function after device setting and themes loading', function(assert) {
    const done = assert.async();

    themes.ready(function() {
        assert.ok(devices.current().ios, 'correct ios flag');
        assert.equal(themes.current(), 'generic.light');

        done();
    });

    devices.current({ platform: 'ios' });
});


QUnit.test('attach css classes', function(assert) {
    const originalRealDevice = devices.real();

    try {
        const $element = $('<div>');

        devices.real({ platform: 'ios', version: [7, 1] });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-device-ios'), 'real device platform class added');
        assert.ok($element.hasClass('dx-device-ios-7'), 'real device platform with version class added');

    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('attach css classes (dx-device-mobile)', function(assert) {
    const originalCurrentDevice = devices.current();

    try {
        let $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'phone' });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass('dx-device-desktop'));
        assert.ok($element.hasClass('dx-device-phone'));
        assert.ok(!$element.hasClass('dx-device-tablet'));
        assert.ok($element.hasClass('dx-device-mobile'));

        $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'tablet' });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass('dx-device-desktop'));
        assert.ok(!$element.hasClass('dx-device-phone'));
        assert.ok($element.hasClass('dx-device-tablet'));
        assert.ok($element.hasClass('dx-device-mobile'));

        $element = $('<div>');
        devices.current({ platform: 'generic', deviceType: 'desktop' });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-device-desktop'));
        assert.ok(!$element.hasClass('dx-device-phone'));
        assert.ok(!$element.hasClass('dx-device-tablet'));
        assert.ok(!$element.hasClass('dx-device-mobile'));

    } finally {
        devices.current(originalCurrentDevice);
    }
});

QUnit.test('detach css classes', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });

        devices.attachCssClasses($element);
        devices.detachCssClasses($element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('detach only attached classes', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });

        devices.attachCssClasses($element);
        devices.real({ platform: 'generic', version: [] });
        devices.detachCssClasses($element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('move classes from previous viewport to new viewport', function(assert) {
    const originalRealDevice = devices.real();
    try {
        const $element = $('<div>');
        devices.real({ platform: 'ios', version: [7, 1] });
        devices.attachCssClasses($element);

        const $newElement = $('<div>');

        viewPortChanged.fire($newElement, $element);

        assert.equal($element.hasClass('dx-device-ios'), false, 'platform class removed');
        assert.equal($element.hasClass('dx-device-ios-7'), false, 'version class removed');

        assert.ok($newElement.hasClass('dx-device-ios'), 'real device platform class added');
        assert.ok($newElement.hasClass('dx-device-ios-7'), 'real device platform with version class added');
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test('attach css classes RTL', function(assert) {
    const originalRTL = config().rtlEnabled;

    try {
        const $element = $('<div>');

        config({ rtlEnabled: false });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass('dx-rtl'), false, 'rtl class was not added');

        config({ rtlEnabled: true });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass('dx-rtl'), true, 'rtl class added');

    } finally {
        config({ rtlEnabled: originalRTL });
    }
});

QUnit.test('attach css classes in simulator', function(assert) {
    const originalIsSimulator = devices.isSimulator;

    try {
        devices.isSimulator = function() {
            return true;
        };

        const $element = $('<div>');

        devices.attachCssClasses($element);
        assert.ok($element.hasClass('dx-simulator'), 'simulator class added');

    } finally {
        devices.isSimulator = originalIsSimulator;
    }
});

QUnit.test('classes not attached to body ', function(assert) {
    const originalCurrentDevice = devices.current();
    const $style = $('<style>').text('.dx-theme-marker {font-family: "dx.ios7.default" }');
    $style.appendTo('head');
    try {
        const $body = $('body');
        devices.current({ platform: 'ios', version: [7, 1] });
        assert.ok(!$body.hasClass('dx-theme-ios7'), 'classes is not added on ');

    } finally {
        $style.remove();
        devices.current(originalCurrentDevice);
    }
});

QUnit.test('simulator forcing', function(assert) {
    devices.forceSimulator();
    assert.equal(devices.isSimulator(), true, 'simulator forced');
});

QUnit.test('isSimulator return true when is ripple emulator', function(assert) {
    const ripple = window.tinyHippos;
    try {
        window.tinyHippos = true;
        assert.ok(devices.isSimulator(), 'ripple emulator detected as simulator');
    } finally {
        window.tinyHippos = ripple;
    }
});


QUnit.module('orientation', {
    beforeEach: function() {
        const that = this;

        that.currentWidth = 100;
        that.currentHeight = 200;
        that.originalWidth = renderer.fn.width;
        that.originalHeight = renderer.fn.height;

        // NOTE: using renderer.height() and renderer.width() for correct window size detecting on WP8
        renderer.fn.width = function() {
            return that.currentWidth;
        };
        renderer.fn.height = function() {
            return that.currentHeight;
        };
    },
    afterEach: function() {
        renderer.fn.width = this.originalWidth;
        renderer.fn.height = this.originalHeight;
    }
});

QUnit.test('orientation detecting', function(assert) {
    assert.expect(3);

    const device = new devices.constructor();

    assert.equal(device.orientation(), 'portrait');

    device.on('orientationChanged', function(args) {
        assert.equal(args.orientation, 'landscape');
        assert.equal(device.orientation(), 'landscape');
    });

    this.currentHeight = 100;
    this.currentWidth = 200;

    resizeCallbacks.fire();
});

QUnit.test('no unnecessary orientationChanged on screen keyboard appearing', function(assert) {
    const device = new devices.constructor();

    device.on('orientationChanged', function(args) {
        assert.ok(false, 'orientationChanged should not fire');
    });

    this.currentHeight = 90;
    resizeCallbacks.fire();

    assert.equal(device.orientation(), 'portrait');
});

QUnit.test('force device replace only needed option', function(assert) {
    devices.current({ platform: 'ios', deviceType: 'tablet' });
    devices.current({ platform: 'android' });

    assert.equal(devices.current().deviceType, 'tablet', 'deviceType was not overridden');
});
