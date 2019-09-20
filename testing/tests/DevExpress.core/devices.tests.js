window.includeThemesLinks();

var $ = require("jquery"),
    renderer = require("core/renderer"),
    themes = require("ui/themes"),
    devices = require("core/devices"),
    fromUA = $.proxy(devices._fromUA, devices),
    viewPort = require("core/utils/view_port"),
    viewPortChanged = viewPort.changeCallback,
    resizeCallbacks = require("core/utils/resize_callbacks"),
    config = require("core/config");

var userAgents = {
    iphone_6: "Mozilla/5.0 (iPhone; CPU OS 6_0_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25",
    ipad_7: "Mozilla/5.0 (iPad; CPU OS 7_0_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25",
    android_9: "Mozilla/5.0 (Linux; Android 9; Mi A2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36",
    android_4_3_4: "Mozilla/5.0 (Linux; Android 4.3.4; Galaxy Nexus Build/IMM76B)AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19",
    android_4_4_0: "Mozilla/5.0 (Linux; Android 4.4.0; Galaxy Nexus Build/IMM76B)AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19",
    android_tablet_4_0_3: "Mozilla/5.0 (Linux; Android 4.0.3; Galaxy Nexus Build/IMM76B)AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Safari/535.19",
    win_arm_8: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Tablet PC; Trident/6.0)",
    win_phone_8: "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)",
    win_phone_8_desktop_mode: "Mozilla/5.0 (Windows NT 6.2; ARM; Trident/7.0; Touch; rv:11.0; WPDesktop; Lumia 930) like Gecko",
    win_phone_8_1: "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11; IEMobile/11.0) like Android 4.1.2; compatible) like iPhone OS 7_0_3 Mac OS X WebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.99 Mobile Safari /537.36",
    win_phone_10: "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; NOKIA; Lumia 920) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.0",
    msSurface: "Mozilla/5.0 (Windows NT 6.3; ARM; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecho",
    win8_1_ie11: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Tablet PC 2.0; rv:11.0) like Gecko"
};

QUnit.module("devices", {
    beforeEach: function() {
        this._savedDevice = devices.current();
    },
    afterEach: function() {
        devices.current(this._savedDevice);
    }
});

QUnit.test("ios by userAgent", function(assert) {
    var device = fromUA(userAgents.iphone_6);

    assert.equal(device.platform, "ios", "platform is ios");
    assert.equal(device.version.toString(), "6,0,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");

    device = fromUA(userAgents.ipad_7);

    assert.equal(device.platform, "ios", "platform is ios");
    assert.equal(device.version.toString(), "7,0,0", "correct version");
    assert.equal(device.deviceType, "tablet", "deviceType is tablet");
});

QUnit.test("android by userAgent", function(assert) {
    var device = fromUA(userAgents.android_4_3_4);

    assert.equal(device.platform, "android", "platform is android");
    assert.equal(device.version.toString(), "4,3,4", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
    assert.equal(device.grade, "B", "grade is B");

    device = fromUA(userAgents.android_4_4_0);

    assert.equal(device.platform, "android", "platform is android");
    assert.equal(device.version.toString(), "4,4,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
    assert.equal(device.grade, "A", "grade is A");

    device = fromUA(userAgents.android_tablet_4_0_3);

    assert.equal(device.platform, "android", "platform is android");
    assert.equal(device.version.toString(), "4,0,3", "correct version");
    assert.equal(device.deviceType, "tablet", "deviceType is tablet");

    device = fromUA(userAgents.android_9);

    assert.equal(device.platform, "android", "platform is android");
    assert.equal(device.version.toString(), "9,0,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
});

QUnit.test("winphone8 by userAgent", function(assert) {
    var device = fromUA(userAgents.win_phone_8);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.version.toString(), "8,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");

    device = fromUA(userAgents.win_arm_8);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.version.toString(), "6,2", "correct version");
    assert.equal(device.deviceType, "tablet", "deviceType is tablet");
});

QUnit.test("winphone8,IE desktop mode, by userAgent", function(assert) {
    var device = fromUA(userAgents.win_phone_8_desktop_mode);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
});

QUnit.test("winphone8.1 by userAgent", function(assert) {
    var device = fromUA(userAgents.win_phone_8_1);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.version.toString(), "8,1", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
});

QUnit.test("winphone10 by userAgent", function(assert) {
    var device = fromUA(userAgents.win_phone_10);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.version.toString(), "10,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
});

QUnit.test("msSurface by userAgent", function(assert) {
    var device = fromUA(userAgents.msSurface);

    assert.equal(device.platform, "win", "platform is win");
    assert.equal(device.deviceType, "tablet", "deviceType is tablet");
});

QUnit.test("win8.1 IE11 by userAgent", function(assert) {
    var device = fromUA(userAgents.win8_1_ie11);

    assert.equal(device.platform, "generic", "platform is generic");
    assert.equal(device.deviceType, "desktop", "deviceType is desktop");
});

QUnit.test("iphone by device name", function(assert) {
    var device;

    devices.current("iPhone");
    device = devices.current();
    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");

    devices.current("iPhone5");
    device = devices.current();

    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");

    devices.current("iPhone6");
    device = devices.current();

    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");

    devices.current("iPhone6plus");
    device = devices.current();

    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");
});

QUnit.test("ipad by device name", function(assert) {
    devices.current("iPad");
    var device = devices.current();

    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "tablet", "correct deviceType");
});

QUnit.test("ipad mini by device name", function(assert) {
    devices.current("iPadMini");
    var device = devices.current();

    assert.equal(device.platform, "ios", "correct platform");
    assert.equal(device.deviceType, "tablet", "correct deviceType");
});

QUnit.test("android phone by device name", function(assert) {
    devices.current("androidPhone");
    var device = devices.current();

    assert.equal(device.platform, "android", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");
});

QUnit.test("android tablet by device name", function(assert) {
    devices.current("androidTablet");
    var device = devices.current();

    assert.equal(device.platform, "android", "correct platform");
    assert.equal(device.deviceType, "tablet", "correct deviceType");
});

QUnit.test("winphone8 by device name", function(assert) {
    devices.current("win8Phone");
    var device = devices.current();

    assert.equal(device.platform, "win", "correct platform");
    assert.equal(device.version.toString(), "8,0", "correct version");
    assert.equal(device.deviceType, "phone", "correct deviceType");
});

QUnit.test("win8 by device name", function(assert) {
    devices.current("win8");
    var device = devices.current();

    assert.equal(device.platform, "win", "correct platform");
    assert.equal(device.version.toString(), "8", "correct version");
    assert.equal(device.deviceType, "desktop", "correct deviceType");
});

QUnit.test("winphone10 by device name", function(assert) {
    devices.current("win10Phone");
    var device = devices.current();

    assert.equal(device.platform, "win", "correct platform");
    assert.equal(device.version.toString(), "10,0", "correct version");
    assert.equal(device.deviceType, "phone", "correct deviceType");
});

QUnit.test("win10 by device name", function(assert) {
    devices.current("win10");
    var device = devices.current();

    assert.equal(device.platform, "win", "correct platform");
    assert.equal(device.version.toString(), "10", "correct version");
    assert.equal(device.deviceType, "desktop", "correct deviceType");
});

QUnit.test("msSurface by device name (T463075)", function(assert) {
    devices.current("msSurface");
    var device = devices.current();

    assert.equal(device.platform, "win", "correct platform");
    assert.equal(device.deviceType, "tablet", "correct deviceType");
});

QUnit.test("version [10] should be forced for current device on wp8.x devices", function(assert) {
    if(devices.real().platform !== "win") {
        assert.ok(true, "the test is actual only for real wp8.x devices");
        return;
    }

    var version = devices.current().version.toString();
    assert.equal(version, "10", "version [10] is forced for wp8 device");
});

QUnit.test("generic phone by device name", function(assert) {
    devices.current("genericPhone");
    var device = devices.current();

    assert.equal(device.platform, "generic", "correct platform");
    assert.equal(device.deviceType, "phone", "correct deviceType");
});

QUnit.test("current", function(assert) {
    devices.current(fromUA(userAgents.iphone_6));
    var device = devices.current();

    assert.equal(device.platform, "ios", "platform is ios");
    assert.equal(device.version.toString(), "6,0,0", "correct version");
    assert.equal(device.deviceType, "phone", "deviceType is phone");
});

QUnit.test("method current sets necessary flags", function(assert) {
    devices.current({
        platform: "android",
        deviceType: "tablet"
    });

    var device = devices.current();

    assert.ok(device.android, "correct android flag");
    assert.ok(device.tablet, "correct tablet flag");
});

QUnit.test("method current sets correct shortcuts if deviceType was not forced (T268185)", function(assert) {
    devices.current({
        platform: "android",
        deviceType: "tablet"
    });

    devices.current({
        platform: "ios"
    });

    var device = devices.current();

    assert.ok(device.ios, "correct ios flag");
    assert.equal(device.deviceType, "tablet", "correct deviceType value");
    assert.ok(device.tablet, "correct tablet flag");
});

QUnit.test("method themes.ready calls a callback function after device setting and themes loading", function(assert) {
    var done = assert.async();

    themes.ready(function() {
        assert.ok(devices.current().ios, "correct ios flag");
        assert.equal(themes.current(), "ios7.default");

        done();
    });

    devices.current({ platform: "ios" });
});


QUnit.test("attach css classes", function(assert) {
    var originalRealDevice = devices.real();

    try {
        var $element = $("<div>");

        devices.real({ platform: "ios", version: [7, 1] });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass("dx-device-ios"), "real device platform class added");
        assert.ok($element.hasClass("dx-device-ios-7"), "real device platform with version class added");

    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test("attach css classes (dx-device-mobile)", function(assert) {
    var originalCurrentDevice = devices.current();

    try {
        var $element = $("<div>");
        devices.current({ platform: "generic", deviceType: "phone" });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass("dx-device-desktop"));
        assert.ok($element.hasClass("dx-device-phone"));
        assert.ok(!$element.hasClass("dx-device-tablet"));
        assert.ok($element.hasClass("dx-device-mobile"));

        $element = $("<div>");
        devices.current({ platform: "generic", deviceType: "tablet" });
        devices.attachCssClasses($element);
        assert.ok(!$element.hasClass("dx-device-desktop"));
        assert.ok(!$element.hasClass("dx-device-phone"));
        assert.ok($element.hasClass("dx-device-tablet"));
        assert.ok($element.hasClass("dx-device-mobile"));

        $element = $("<div>");
        devices.current({ platform: "generic", deviceType: "desktop" });
        devices.attachCssClasses($element);
        assert.ok($element.hasClass("dx-device-desktop"));
        assert.ok(!$element.hasClass("dx-device-phone"));
        assert.ok(!$element.hasClass("dx-device-tablet"));
        assert.ok(!$element.hasClass("dx-device-mobile"));

    } finally {
        devices.current(originalCurrentDevice);
    }
});

QUnit.test("detach css classes", function(assert) {
    var originalRealDevice = devices.real();
    try {
        var $element = $("<div>");
        devices.real({ platform: "ios", version: [7, 1] });

        devices.attachCssClasses($element);
        devices.detachCssClasses($element);

        assert.equal($element.hasClass("dx-device-ios"), false, "platform class removed");
        assert.equal($element.hasClass("dx-device-ios-7"), false, "version class removed");
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test("detach only attached classes", function(assert) {
    var originalRealDevice = devices.real();
    try {
        var $element = $("<div>");
        devices.real({ platform: "ios", version: [7, 1] });

        devices.attachCssClasses($element);
        devices.real({ platform: "generic", version: [] });
        devices.detachCssClasses($element);

        assert.equal($element.hasClass("dx-device-ios"), false, "platform class removed");
        assert.equal($element.hasClass("dx-device-ios-7"), false, "version class removed");
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test("move classes from previous viewport to new viewport", function(assert) {
    var originalRealDevice = devices.real();
    try {
        var $element = $("<div>");
        devices.real({ platform: "ios", version: [7, 1] });
        devices.attachCssClasses($element);

        var $newElement = $("<div>");

        viewPortChanged.fire($newElement, $element);

        assert.equal($element.hasClass("dx-device-ios"), false, "platform class removed");
        assert.equal($element.hasClass("dx-device-ios-7"), false, "version class removed");

        assert.ok($newElement.hasClass("dx-device-ios"), "real device platform class added");
        assert.ok($newElement.hasClass("dx-device-ios-7"), "real device platform with version class added");
    } finally {
        devices.real(originalRealDevice);
    }
});

QUnit.test("attach css classes RTL", function(assert) {
    var originalRTL = config().rtlEnabled;

    try {
        var $element = $("<div>");

        config({ rtlEnabled: false });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass("dx-rtl"), false, "rtl class was not added");

        config({ rtlEnabled: true });
        devices.attachCssClasses($element);
        assert.equal($element.hasClass("dx-rtl"), true, "rtl class added");

    } finally {
        config({ rtlEnabled: originalRTL });
    }
});

QUnit.test("attach css classes in simulator", function(assert) {
    var originalIsSimulator = devices.isSimulator;

    try {
        devices.isSimulator = function() {
            return true;
        };

        var $element = $("<div>");

        devices.attachCssClasses($element);
        assert.ok($element.hasClass("dx-simulator"), "simulator class added");

    } finally {
        devices.isSimulator = originalIsSimulator;
    }
});

QUnit.test("classes not attached to body ", function(assert) {
    var originalCurrentDevice = devices.current();
    var $style = $("<style>").text('.dx-theme-marker {font-family: "dx.ios7.default" }');
    $style.appendTo("head");
    try {
        var $body = $("body");
        devices.current({ platform: "ios", version: [7, 1] });
        assert.ok(!$body.hasClass("dx-theme-ios7"), "classes is not added on ");

    } finally {
        $style.remove();
        devices.current(originalCurrentDevice);
    }
});

QUnit.test("simulator forcing", function(assert) {
    devices.forceSimulator();
    assert.equal(devices.isSimulator(), true, "simulator forced");
});

QUnit.test("isSimulator return true when is ripple emulator", function(assert) {
    var ripple = window.tinyHippos;
    try {
        window.tinyHippos = true;
        assert.ok(devices.isSimulator(), "ripple emulator detected as simulator");
    } finally {
        window.tinyHippos = ripple;
    }
});


QUnit.module("orientation", {
    beforeEach: function() {
        var that = this;

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

QUnit.test("orientation detecting", function(assert) {
    assert.expect(3);

    var device = new devices.constructor();

    assert.equal(device.orientation(), "portrait");

    device.on("orientationChanged", function(args) {
        assert.equal(args.orientation, "landscape");
        assert.equal(device.orientation(), "landscape");
    });

    this.currentHeight = 100;
    this.currentWidth = 200;

    resizeCallbacks.fire();
});

QUnit.test("no unnecessary orientationChanged on screen keyboard appearing", function(assert) {
    var device = new devices.constructor();

    device.on("orientationChanged", function(args) {
        assert.ok(false, "orientationChanged should not fire");
    });

    this.currentHeight = 90;
    resizeCallbacks.fire();

    assert.equal(device.orientation(), "portrait");
});

QUnit.test("force device replace only needed option", function(assert) {
    devices.current({ platform: "ios", deviceType: "tablet" });
    devices.current({ platform: "android" });

    assert.equal(devices.current().deviceType, 'tablet', "deviceType was not overridden");
});
