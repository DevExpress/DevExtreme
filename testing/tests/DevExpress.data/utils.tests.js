"use strict";

var Guid = require("core/guid"),
    dataUtils = require("data/utils"),
    keysEqual = dataUtils.keysEqual,
    processRequestResultLock = dataUtils.processRequestResultLock,
    b64 = dataUtils.base64_encode,
    odataUtils = require("data/odata/utils");

QUnit.module("keysEqual");

QUnit.test("non-strict comparison is used", function(assert) {
    // NOTE there is no point in considering "1" and 1 as different keys
    assert.ok(keysEqual("id", 1, "1"));
    assert.ok(keysEqual(["a", "b"], { a: 1, b: 2 }, { a: "1", b: "2" }));
});

QUnit.test("toComparable is used for compound keys", function(assert) {
    var guid1 = new Guid(),
        guid2 = new Guid(guid1);

    assert.ok(guid1 !== guid2);

    assert.ok(keysEqual(
        ["a", "b"],
        { a: 1, b: guid1 },
        { a: 1, b: guid2 }
    ));
});

//T364210
QUnit.test("toComparable is used for EdmLiteral", function(assert) {

    var EdmLiteral = odataUtils.EdmLiteral,
        edm1 = new EdmLiteral("50m"),
        edm2 = new EdmLiteral("50m");

    assert.ok(edm1 !== edm2);

    assert.ok(keysEqual(null, edm1, edm2));
});

QUnit.module("processRequestResultLock");

QUnit.test("it works", function(assert) {
    assert.equal(processRequestResultLock.promise().state(), "resolved", "resolved by default");

    processRequestResultLock.obtain();
    assert.equal(processRequestResultLock.promise().state(), "pending", "pending when locked");

    processRequestResultLock.obtain();
    var promise = processRequestResultLock.promise();
    assert.equal(promise.state(), "pending", "pending when locked twice");

    processRequestResultLock.release();
    assert.equal(promise.state(), "pending", "pending when not all locks are released");

    processRequestResultLock.release();
    assert.equal(promise.state(), "resolved", "resolved when all locks are released");
});

QUnit.test("reset", function(assert) {
    processRequestResultLock.obtain();

    var promise = processRequestResultLock.promise();
    assert.equal(promise.state(), "pending", "pending when locked");

    processRequestResultLock.reset();
    assert.equal(promise.state(), "resolved", "old promises are resolved when reset");

    promise = processRequestResultLock.promise();
    assert.equal(promise.state(), "resolved", "default state is reset");
});

QUnit.test("nested tasks are executed immediately if no lock", function(assert) {
    var executed1 = false,
        executed2 = false;

    processRequestResultLock
        .promise()
        .done(function() {
            executed1 = true;

            processRequestResultLock
                .promise()
                .done(function() {
                    executed2 = true;
                });

            assert.ok(executed2);
        });

    assert.ok(executed1);
    assert.ok(executed2);
});

QUnit.module("base64");

QUnit.test("encode", function(assert) {
    assert.equal(b64(""), "");
    assert.equal(b64("A"), "QQ==");
    assert.equal(b64("AA"), "QUE=");
    assert.equal(b64("AAA"), "QUFB");
    assert.equal(b64("DevExpress"), "RGV2RXhwcmVzcw==");
    assert.equal(b64("\u0401"), "0IE=");
    assert.equal(b64([65]), "QQ==");
});
