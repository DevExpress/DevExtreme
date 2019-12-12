var browser = require("core/utils/browser");

var userAgents = {
    win_phone_8_1_update: "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537",
    webkit: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Custom/43.0.2357.124",
    mozilla: "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0",
    ie11: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; rv:11.0) like Gecko",
    ie: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    msEdge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.0",
    safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
    chrome: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    chrome_ios: "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/74.0.3729.157 Mobile/13B143 Safari/601.1.46",
    mozilla_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/18.2b15817 Mobile/15E148 Safari/605.1.15",
    phantom: "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1",
    google_app_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/88.0.281793270 Mobile/15E148 Safari/604.1"
};

QUnit.module("browser");

QUnit.test("on windows phone devices browser is msie", function(assert) {
    assert.ok(browser._fromUA(userAgents.win_phone_8_1_update).msie, "on widows phone browser is IE");
});

QUnit.test("MSEdge is IE", function(assert) {
    assert.ok(browser._fromUA(userAgents.msEdge).msie, "ie detected");
});

QUnit.test("browser is IE", function(assert) {
    var browserObject = browser._fromUA(userAgents.ie);
    assert.ok(browserObject.msie, "ie detected");
    assert.equal(browserObject.version, '9.0', "version was detect correctly");
});

QUnit.test("browser is IE11", function(assert) {
    var browserObject = browser._fromUA(userAgents.ie11);
    assert.ok(browserObject.msie, "ie11 detected");
    assert.equal(browserObject.version, '11.0', "version was detect correctly");
});

QUnit.test("browser is generic webkit", function(assert) {
    var browserObject = browser._fromUA(userAgents.webkit);
    assert.ok(browserObject.webkit, "webkit detected");
    assert.equal(browserObject.version, '537.36', "version was detect correctly");
});

QUnit.test("browser is mozilla", function(assert) {
    var browserObject = browser._fromUA(userAgents.mozilla);
    assert.ok(browserObject.mozilla, "mozilla detected");
    assert.equal(browserObject.version, '38.0', "version was detect correctly");
});

QUnit.test("browser is safari", function(assert) {
    var browserObject = browser._fromUA(userAgents.safari);

    assert.ok(browserObject.safari, "safari detected");
    assert.ok(browserObject.webkit, "safari is webkit browser");
    assert.equal(browserObject.version, '10.0.1', "version was detect correctly");
});

QUnit.test("browser is phantom masked to safari", function(assert) {
    var browserObject = browser._fromUA(userAgents.phantom);

    assert.ok(browserObject.safari, "safari detected");
    assert.ok(browserObject.webkit, "safari is webkit browser");
});

QUnit.test("chrome is webkit but not safari", function(assert) {
    var browserObject = browser._fromUA(userAgents.chrome);

    assert.notOk(browserObject.safari, "chrome is not safari");
    assert.ok(browserObject.webkit, "chrome is webkit browser");
    assert.ok(browserObject.chrome, "chrome is true");
    assert.strictEqual(browserObject.version, "56.0", "chrome version is correct");
});

QUnit.test("browser is chrome (mobile)", function(assert) {
    var browserObject = browser._fromUA(userAgents.chrome_ios);

    assert.notOk(browserObject.safari, "chrome is not safari");
    assert.ok(browserObject.webkit, "chrome is webkit browser");
    assert.ok(browserObject.chrome, "chrome is true");
    assert.strictEqual(browserObject.version, "74.0", "chrome version is correct");
});

QUnit.test("browser is mozilla (mobile)", function(assert) {
    var browserObject = browser._fromUA(userAgents.mozilla_ios);

    assert.ok(browserObject.mozilla, "mozilla detected");
    assert.ok(browserObject.webkit, "firefox for ios is webkit browser");
    assert.notOk(browserObject.safari, "firefox is not safari");
    assert.notOk(browserObject.chrome, "firefox is not chrome");
    assert.equal(browserObject.version, '18.2', "version was detect correctly");
});

QUnit.test("google app is chrome (mobile)", function(assert) {
    var browserObject = browser._fromUA(userAgents.google_app_ios);

    assert.notOk(browserObject.safari, "google app is not safari");
    assert.notOk(browserObject.chrome, "google app is not chrome");
    assert.ok(browserObject.webkit, "google app is webkit browser");
    assert.ok(browserObject.unknown, "but google app is not known browser name");
    assert.strictEqual(browserObject.version, "605.1.15", "webkit version is correct");
});
