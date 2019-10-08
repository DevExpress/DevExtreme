import Class from "core/class";
import ValidationEngine from "ui/validation_engine";
import { Deferred } from "core/utils/deferred";
import { isPromise } from "core/utils/type";

const Validator = Class.inherit({
    validate: function() { }
});

const testInvalidRule = function(rule, invalidValue, assert, name) {
    const result = ValidationEngine.validate(invalidValue, [rule], name);

    assert.ok(result, "Result is defined");
    assert.strictEqual(result.isValid, false, "result.isValid === false");
    assert.ok(result.brokenRule, "Single invalid rule");
    assert.strictEqual(result.brokenRule.isValid, false, "Rule should be marked as invalid");
    assert.strictEqual(result.brokenRules.length, 1, "Single invalid broken rule");
    assert.strictEqual(result.brokenRules[0].isValid, false, "Broken rule should be marked as invalid");
    assert.strictEqual(result.status, "invalid", "result.status === 'invalid'");

    return result;
};


QUnit.module("General");

QUnit.test("ValidationEngine exists", function(assert) {
    assert.ok(ValidationEngine, "Ok");
});


QUnit.test("Unknown validation type", function(assert) {

    assert.throws(
        function() {
            ValidationEngine.validate("CoolValue", [{
                type: "foobar",
                message: "This value should be cool"
            }]);
        },
        function(e) {
            return /E0100/.test(e.message);
        },
        "Exception messages should be readable"
    );
});


QUnit.test("Undefined validation rules", function(assert) {
    var result = ValidationEngine.validate("CoolValue", undefined);

    assert.ok(result, "Result is defined");
    assert.strictEqual(result.isValid, true, "Result is valid");
    assert.ok(!result.brokenRule, "No invalid rules");
});

QUnit.module("Required rule");

var testInvalidRequiredRules = function(invalidValue, assert) {
    var customMessage = "This is really-really required field.",
        result = testInvalidRule({
            type: "required",
            message: customMessage
        }, invalidValue, assert);

    assert.equal(result.brokenRule.message, customMessage);

    return result;
};

QUnit.test("Required - correct value", function(assert) {
    var result = ValidationEngine.validate("CoolValue", [{
        type: "required",
        message: "This is really-really required field."
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "No any invalid rules");
});


QUnit.test("Required - empty string", function(assert) {
    testInvalidRequiredRules("", assert);
});

QUnit.test("Required - null", function(assert) {
    testInvalidRequiredRules(null, assert);
});

QUnit.test("Required - undefined", function(assert) {
    testInvalidRequiredRules(undefined, assert);
});

QUnit.test("Required - false", function(assert) {
    testInvalidRequiredRules(false, assert);
});


QUnit.test("Required - 0 (zero) is valid value", function(assert) {
    var result = ValidationEngine.validate(0, [{
        type: "required"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Required - spaces and tabs are trimmed by default", function(assert) {
    testInvalidRequiredRules("   \t  ", assert);
});

QUnit.test("Required - spaces and tabs are accepted on trim: false", function(assert) {

    var result = ValidationEngine.validate("   \t  ", [{
        type: "required",
        trim: false
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Required - default English message", function(assert) {
    var result = testInvalidRule({
        type: "required"
    }, "", assert);


    assert.equal(result.brokenRule.message, "Required");
});

QUnit.test("Required - default English message with name", function(assert) {
    var result = testInvalidRule({
        type: "required"
    }, "", assert, "Login");


    assert.equal(result.brokenRule.message, "Login is required");
});

QUnit.module("Pattern rule");

QUnit.test("Pattern - invalid", function(assert) {
    var result = testInvalidRule({
        type: "pattern",
        pattern: /^[A-Z]+$/,
        message: "Only capital letters are allowed"
    }, "A1", assert);

    assert.equal(result.brokenRule.message, "Only capital letters are allowed");
});

QUnit.test("Pattern - valid", function(assert) {
    var result = ValidationEngine.validate("ABC", [{
        type: "pattern",
        pattern: /^[A-Z]+$/,
        message: "Only capital letters are allowed"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "No any invalid rules");
});


QUnit.test("Pattern - valid, string", function(assert) {
    var result = ValidationEngine.validate("ABC", [{
        type: "pattern",
        pattern: "^[A-Z]+$",
        message: "Only capital letters are allowed"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "No any invalid rules");
});

QUnit.test("Pattern - default English message", function(assert) {
    var result = testInvalidRule({
        type: "pattern",
        pattern: /^[A-Z]+$/
    }, "A1", assert);

    assert.equal(result.brokenRule.message, "Value does not match pattern");
});

QUnit.test("Pattern - default English message with name", function(assert) {
    var result = testInvalidRule({
        type: "pattern",
        pattern: /^[A-Z]+$/
    }, "A1", assert, "Product Code");

    assert.equal(result.brokenRule.message, "Product Code does not match pattern");
});

QUnit.test("Pattern - empty value should be valid", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "pattern",
        pattern: /^[A-Z]+$/
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});


QUnit.module("Numeric rule");


QUnit.test("Numeric - invalid", function(assert) {
    var result = testInvalidRule({
        type: "numeric",
        message: "Please enter numeric value"
    }, "A1", assert);

    assert.equal(result.brokenRule.message, "Please enter numeric value");
});

QUnit.test("Numeric - valid", function(assert) {
    var result = ValidationEngine.validate("123", [{
        type: "numeric",
        message: "Please enter numeric value"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "No any invalid rules");
});

QUnit.test("Numeric - default English message", function(assert) {
    var result = testInvalidRule({
        type: "numeric"
    }, "A1", assert);

    assert.equal(result.brokenRule.message, "Value must be a number");
});

QUnit.test("Numeric - default English message", function(assert) {
    var result = testInvalidRule({
        type: "numeric"
    }, "A1", assert, "Age");

    assert.equal(result.brokenRule.message, "Age must be a number");
});


QUnit.test("Numeric - empty value should be valid", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "numeric",
        message: "Please enter numeric value"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});


QUnit.module("Range rule - numeric");

QUnit.test("Range - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: 10,
        max: 100,
        message: "Please enter value inside of range"
    }, "101", assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});


QUnit.test("Range (min only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: 10,
        message: "Please enter value inside of range"
    }, "9", assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});


QUnit.test("Range (max only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        max: 100,
        message: "Please enter value inside of range"
    }, "101", assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});

QUnit.test("Range - invalid (not a number)", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: 10,
        max: 100,
        message: "Please enter value inside of range"
    }, "abc", assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});

QUnit.test("Range - incorrect rules (no min nor max)", function(assert) {
    assert.throws(
        function() {
            ValidationEngine.validate("101", [{
                type: "range",
                message: "Please enter value inside of range"
            }]);
        },
        function(e) {
            return /E0101/.test(e.message);
        },
        "Exception messages should be readable"
    );
});

QUnit.test("Range (min and max) - valid", function(assert) {
    var result = ValidationEngine.validate("55", [{
        type: "range",
        min: 10,
        max: 100,
        message: "Please enter value inside of range"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});

QUnit.test("Range (max only) - valid", function(assert) {
    var result = ValidationEngine.validate("55", [{
        type: "range",
        max: 100,
        message: "Please enter value inside of range"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});

QUnit.test("Range (min only) - valid", function(assert) {
    var result = ValidationEngine.validate("55", [{
        type: "range",
        min: 10,
        message: "Please enter numeric value"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});


QUnit.test("Range - default English message", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: 10,
        max: 100
    }, "101", assert);

    assert.equal(result.brokenRule.message, "Value is out of range");
});

QUnit.test("Range - default English message with name", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: 10,
        max: 100
    }, "101", assert, "Length");

    assert.equal(result.brokenRule.message, "Length is out of range");
});


QUnit.test("Range - empty value should be valid", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "range",
        min: 10,
        max: 100
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.module("Range rule - datetime");

QUnit.test("Range - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: new Date(2010, 1, 1),
        max: new Date(2014, 1, 1),
        message: "Please enter value inside of range"
    }, new Date(2016, 1, 1), assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});


QUnit.test("Range (min only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        min: new Date(2010, 1, 1),
        message: "Please enter value inside of range"
    }, new Date(2009, 1, 1), assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});


QUnit.test("Range (max only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "range",
        max: new Date(2014, 1, 1),
        message: "Please enter value inside of range"
    }, new Date(2016, 1, 1), assert);

    assert.equal(result.brokenRule.message, "Please enter value inside of range");
});

QUnit.test("Range (min and max) - valid", function(assert) {
    var result = ValidationEngine.validate(new Date(2013, 1, 1), [{
        type: "range",
        min: new Date(2012, 1, 1),
        max: new Date(2014, 1, 1),
        message: "Please enter value inside of range"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});

QUnit.test("Range (max only) - valid", function(assert) {
    var result = ValidationEngine.validate(new Date(2014, 1, 1), [{
        type: "range",
        max: new Date(2016, 1, 1),
        message: "Please enter value inside of range"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});

QUnit.test("Range (min only) - valid", function(assert) {
    var result = ValidationEngine.validate(new Date(2016, 1, 1), [{
        type: "range",
        min: new Date(2010, 1, 1),
        message: "Please enter numeric value"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Please enter value inside of range");
});


QUnit.test("Range - empty value should be valid", function(assert) {
    var result = ValidationEngine.validate(null, [{
        type: "range",
        min: new Date(2010, 1, 1),
        max: new Date(2014, 1, 1),
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.module("StringLength rule");

QUnit.test("StringLength - invalid", function(assert) {
    var result = testInvalidRule({
        type: "stringLength",
        min: 2,
        max: 5,
        message: "Wrong length - custom message"
    }, "unpredictable", assert);

    assert.equal(result.brokenRule.message, "Wrong length - custom message");
});


QUnit.test("StringLength (min only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "stringLength",
        min: 4,
        message: "Wrong length - custom message"
    }, "OK", assert);

    assert.equal(result.brokenRule.message, "Wrong length - custom message");
});


QUnit.test("StringLength (max only) - invalid", function(assert) {
    var result = testInvalidRule({
        type: "stringLength",
        max: 4,
        message: "Wrong length - custom message"
    }, "Chlorhexidine", assert);

    assert.equal(result.brokenRule.message, "Wrong length - custom message");
});

QUnit.test("StringLength - incorrect rules (no min nor max)", function(assert) {
    assert.throws(
        function() {
            ValidationEngine.validate("test", [{
                type: "stringLength"
            }]);
        },
        function(e) {
            return /E0101/.test(e.message);
        },
        "Exception messages should be readable"
    );
});


QUnit.test("StringLength - trim by default - valid", function(assert) {
    var result = ValidationEngine.validate("Good                 ", [{
        type: "stringLength",
        min: 2,
        max: 5
    }]);

    assert.equal(result.isValid, true, "Should be valid");
});


QUnit.test("StringLength - skipped trim - invalid", function(assert) {
    var result = ValidationEngine.validate("Good        ", [{
        type: "stringLength",
        min: 2,
        max: 5,
        trim: false
    }]);

    assert.strictEqual(result.isValid, false, "Should be invalid");
});

QUnit.test("StringLength (min and max) - valid", function(assert) {
    var result = ValidationEngine.validate("It's OK", [{
        type: "stringLength",
        min: 6,
        max: 8,
        message: "Wrong length - custom message"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Wrong length - custom message");
});

QUnit.test("StringLength (max only) - valid", function(assert) {
    var result = ValidationEngine.validate("Short value.", [{
        type: "stringLength",
        max: 20,
        message: "Wrong length - custom message"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Wrong length - custom message");
});

QUnit.test("StringLength (min only) - valid", function(assert) {
    var result = ValidationEngine.validate("This is long sentence", [{
        type: "stringLength",
        min: 10,
        message: "Wrong length - custom message"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "Wrong length - custom message");
});

QUnit.test("StringLength - exact value", function(assert) {
    var result = ValidationEngine.validate("GBR", [{
        type: "stringLength",
        min: 3,
        max: 3
    }]);

    assert.equal(result.isValid, true, "Should be valid");
});

QUnit.test("StringLength - default English message", function(assert) {
    var result = testInvalidRule({
        type: "stringLength",
        min: 2,
        max: 5
    }, "Too long", assert);

    assert.equal(result.brokenRule.message, "The length of the value is not correct");
});

QUnit.test("StringLength - default English message with name", function(assert) {
    var result = testInvalidRule({
        type: "stringLength",
        min: 4,
        max: 6
    }, "ABCDEFG", assert, "Product Code");

    assert.equal(result.brokenRule.message, "The length of Product Code is not correct");
});

QUnit.test("StringLength - undefined equal to 0 length", function(assert) {
    var result = ValidationEngine.validate(undefined, [{
        type: "stringLength",
        min: 1,
        max: 10
    }]);

    assert.equal(result.isValid, false, "undefined equal to 0 length");

    result = ValidationEngine.validate(undefined, [{
        type: "stringLength",
        max: 1
    }]);

    assert.equal(result.isValid, true, "undefined equal to 0 length");
});

QUnit.test("StringLength - null equal to 0 length", function(assert) {
    var result = ValidationEngine.validate(null, [{
        type: "stringLength",
        min: 1,
        max: 5
    }]);

    assert.equal(result.isValid, false, "null equal to 0 length");

    result = ValidationEngine.validate(null, [{
        type: "stringLength",
        max: 1
    }]);

    assert.equal(result.isValid, true, "null equal to 0 length");
});


QUnit.module("Common types ");

QUnit.test("Email - valid", function(assert) {
    var result = ValidationEngine.validate("john@example.com", [{
        type: "email",
        message: "Set good-looking email"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.ok(!result.brokenRule, "No any invalid rules");
});

QUnit.test("Email - invalid", function(assert) {
    var result = testInvalidRule({
        type: "email",
        message: "Set good-looking email"
    }, "john-example.com", assert);

    assert.equal(result.brokenRule.message, "Set good-looking email", "Custom message");
});


QUnit.test("Email - default English message", function(assert) {
    var result = testInvalidRule({
        type: "email"
    }, "john-example.com", assert);

    assert.equal(result.brokenRule.message, "Email is invalid", "Default message");
});

QUnit.test("Email - default English message - with name", function(assert) {
    var result = testInvalidRule({
        type: "email"
    }, "john-example.com", assert, "Customer Email");

    assert.equal(result.brokenRule.message, "Customer Email is invalid", "Default message");
});


QUnit.test("Email - empty value should be valid", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "email"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Array of emails should be valid", function(assert) {
    var result = ValidationEngine.validate(["test@domain.com", "test2@domain.com"], [{
        type: "email"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Array of emails with incorrect one should be invalid", function(assert) {
    var result = ValidationEngine.validate(["testdomain.com", "test2@domain.com"], [{
        type: "email"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(!result.isValid, "IsValid");
});

QUnit.test("Empty array is invalid", function(assert) {
    var result = ValidationEngine.validate([], [{
        type: "required"
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(!result.isValid, "IsValid");
});

QUnit.module("Custom rule with user's callback");

QUnit.test("Can be validated positively", function(assert) {
    var customCallback = sinon.spy(function() { return true; }),
        validator = {},
        value = "Some custom value",
        rule = {
            type: "custom",
            validationCallback: customCallback,
            validator: validator
        },
        result = ValidationEngine.validate(value, [rule]);


    assert.ok(result, "Result is defined");
    assert.ok(!result.brokenRule, "No any invalid rules");
    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].validator, validator, "Validator should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].rule, rule, "Rule should be passed");
});

QUnit.test("Can be validated negatively", function(assert) {
    var customCallback = sinon.spy(function() { return false; }),
        value = "Some custom value",
        result = testInvalidRule({
            type: "custom",
            validationCallback: customCallback
        }, value, assert);

    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.equal(result.brokenRule.message, "Value is invalid");
});

QUnit.test("Can be validated negatively with custom message", function(assert) {
    var customCallback = sinon.spy(function() { return false; }),
        value = "Some custom value",
        customMessage = "Value does not satisfy our custom validation scenario",
        result = testInvalidRule({
            type: "custom",
            message: customMessage,
            validationCallback: customCallback
        }, value, assert);

    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.equal(result.brokenRule.message, customMessage);
});

QUnit.test("Default message", function(assert) {
    var customCallback = sinon.spy(function() { return false; }),
        value = "Some custom value",
        result = testInvalidRule({
            type: "custom",
            validationCallback: customCallback
        }, value, assert);

    assert.equal(result.brokenRule.message, "Value is invalid");
});

QUnit.test("Default message with name", function(assert) {
    var customCallback = sinon.spy(function() { return false; }),
        value = "Some custom value",
        result = testInvalidRule({
            type: "custom",
            validationCallback: customCallback
        }, value, assert, "Customer Code");

    assert.equal(result.brokenRule.message, "Customer Code is invalid");
});

QUnit.test("Custom validation rule when value is array", function(assert) {
    var customCallback = sinon.stub().returns(false),
        value = ["test1", "test2"],
        result = testInvalidRule({
            type: "custom",
            validationCallback: customCallback
        }, value, assert, "Customer Code");

    assert.equal(result.brokenRule.message, "Customer Code is invalid");
    assert.deepEqual(customCallback.getCall(0).args[0].value, value, "value is correct");
});

QUnit.test("Validation callback must have the 'data' in arguments when validator has 'dataGetter' option", function(assert) {
    var params,
        customCallback = sinon.spy(function() { return true; }),
        data = { test: "test" },
        validator = {
            option: function(optionName) {
                if(optionName === "dataGetter") {
                    return function() {
                        return data;
                    };
                }
            }
        },
        value = "Some custom value",
        rule = {
            type: "custom",
            validationCallback: customCallback,
            validator: validator
        },
        result = ValidationEngine.validate(value, [rule]);


    assert.ok(result, "Result is defined");
    assert.ok(customCallback.calledOnce, "Validation callback was called");

    params = customCallback.getCall(0).args[0];
    assert.equal(params.value, value, "Correct value should be passed");
    assert.strictEqual(params.validator, validator, "Validator should be passed");
    assert.strictEqual(params.rule, rule, "Rule should be passed");
    assert.strictEqual(params.data, data, "Data should be passed");
});


QUnit.module("Compare rule");

QUnit.test("Simple equal tests - jquery way", function(assert) {
    var result = ValidationEngine.validate("123", [{
        type: "compare",
        comparisonTarget: function() { return "123"; },
        message: "Values should match"
    }]);

    assert.ok(result.isValid, "Value should be valid");
});

QUnit.test("Comparison type === passed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "===",
        comparisonTarget: function() { return "2"; },
        message: "Values should be more"
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type === failed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "===",
        comparisonTarget: function() { return 2; },
        message: "Values should be more"
    }]);

    assert.ok(!result.isValid, "Result should be invalid (because of different types)");
});

QUnit.test("Comparison type != passed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "!=",
        comparisonTarget: function() { return 3; }
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type != failed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "!=",
        comparisonTarget: function() { return 2; }
    }]);

    assert.ok(!result.isValid, "Result should be invalid (even with different data types)");
});


QUnit.test("Comparison type !== passed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "!==",
        comparisonTarget: function() { return 2; }
    }]);

    assert.ok(result.isValid, "Result should be valid (because of different types)");
});

QUnit.test("Comparison type !== failed", function(assert) {
    var result = ValidationEngine.validate(2, [{
        type: "compare",
        comparisonType: "!==",
        comparisonTarget: function() { return 2; }
    }]);

    assert.ok(!result.isValid, "Result should be invalid");
});

QUnit.test("Comparison type > passed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: ">",
        comparisonTarget: function() { return "1"; },
        message: "Values should be more"
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type > failed", function(assert) {
    var result = ValidationEngine.validate("1", [{
        type: "compare",
        comparisonType: ">",
        comparisonTarget: function() { return "2"; },
        message: "Values should be more"
    }]);

    assert.ok(!result.isValid, "Result should be valid");
});

QUnit.test("Comparison type >= passed", function(assert) {
    var result = ValidationEngine.validate("1", [{
        type: "compare",
        comparisonType: ">=",
        comparisonTarget: function() { return "1"; },
        message: "Values should be more"
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type >= failed", function(assert) {
    var result = ValidationEngine.validate("1", [{
        type: "compare",
        comparisonType: ">=",
        comparisonTarget: function() { return "2"; },
        message: "Values should be more"
    }]);

    assert.ok(!result.isValid, "Result should be valid");
});


QUnit.test("Comparison type < passed", function(assert) {
    var result = ValidationEngine.validate("1", [{
        type: "compare",
        comparisonType: "<",
        comparisonTarget: function() { return "2"; },
        message: "Values should be more"
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type < failed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "<",
        comparisonTarget: function() { return "1"; },
        message: "Values should be more"
    }]);

    assert.ok(!result.isValid, "Result should be valid");
});

QUnit.test("Comparison type <= passed", function(assert) {
    var result = ValidationEngine.validate("1", [{
        type: "compare",
        comparisonType: "<=",
        comparisonTarget: function() { return "1"; },
        message: "Values should be more"
    }]);

    assert.ok(result.isValid, "Result should be valid");
});

QUnit.test("Comparison type <= failed", function(assert) {
    var result = ValidationEngine.validate("2", [{
        type: "compare",
        comparisonType: "<=",
        comparisonTarget: function() { return "1"; },
        message: "Values should be more"
    }]);

    assert.ok(!result.isValid, "Result should be valid");
});


QUnit.test("Default message", function(assert) {
    var result = testInvalidRule({
        type: "compare",
        comparisonTarget: function() { return "345"; }
    }, "123", assert);


    assert.equal(result.brokenRule.message, "Values do not match");
});

QUnit.test("Default message with name", function(assert) {
    var result = testInvalidRule({
        type: "compare",
        comparisonTarget: function() { return "345"; }
    }, "123", assert, "Password Confirmation");

    assert.equal(result.brokenRule.message, "Password Confirmation does not match");
});

QUnit.test("Comparison target should be set; otherways we should throw exception", function(assert) {
    assert.throws(
        function() {
            ValidationEngine.validate("123", [{
                type: "compare",
            }]);
        },
        function(e) {
            return /E0102/.test(e.message);
        },
        "Exception messages should be readable"
    );
});


QUnit.module("Async rule with user's callback");

const testAsyncRules = function(rules, value, assert, name) {
    const result = ValidationEngine.validate(value, rules, name);

    assert.ok(result, "Result is defined");
    assert.strictEqual(result.isValid, true, "result.isValid === true");
    assert.notOk(result.brokenRule, "Broken rule is not defined");
    assert.notOk(result.brokenRules, "Broken rules are not defined");
    assert.ok(result.pendingRules, "Pending rules are defined");
    assert.strictEqual(result.pendingRules.length, rules.length, "The number of pending rules should be equal the number of async rules");
    assert.strictEqual(result.status, "pending", "result.status === 'pending'");

    return result;
};

QUnit.test("Unknown result of validationCallback", function(assert) {
    assert.throws(
        function() {
            ValidationEngine.validate("CoolValue", [{
                type: "async",
                validationCallback: function() {
                    return true;
                }
            }]);
        },
        function(e) {
            return /E0103/.test(e.message);
        },
        "Exception messages should be readable"
    );
});

QUnit.test("Can be validated positively", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(true);
            return d.promise();
        }),
        validator = {},
        value = "Some custom value",
        rule = {
            type: "async",
            validationCallback: customCallback,
            validator: validator
        },
        result = testAsyncRules([rule], value, assert),
        done = assert.async();

    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].validator, validator, "Validator should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].rule, rule, "Rule should be passed");
    assert.ok(result.complete, "result.complete is defined");
    assert.ok(isPromise(result.complete), "result.complete is a promise");
    result.complete.then((res) => {
        assert.notOk(res.brokenRule, "Broken rule is not defined");
        assert.notOk(res.brokenRules, "Broken rules are not defined");
        assert.notOk(res.pendingRules, "Pending rules are not defined");
        assert.strictEqual(res.isValid, true, "Rule is valid");
        assert.strictEqual(res.status, "valid", "Rule status is valid");
        done();
    });
});

QUnit.test("Can be validated negatively", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(false);
            return d.promise();
        }),
        value = "Some custom value",
        rule = {
            type: "async",
            validationCallback: customCallback
        },
        result = testAsyncRules([rule], value, assert),
        done = assert.async();

    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].rule, rule, "Rule should be passed");
    assert.ok(result.complete, "result.complete is defined");
    assert.ok(isPromise(result.complete), "result.complete is a promise");
    result.complete.then((res) => {
        assert.ok(res.brokenRule, "Broken rule is defined");
        assert.ok(res.brokenRules, "Broken rules are defined");
        assert.strictEqual(res.brokenRules.length, 1, "A single rule should be broken");
        assert.strictEqual(res.brokenRules[0], res.brokenRule, "Broken rules should be equal");
        assert.equal(res.brokenRules[0].message, "Value is invalid");
        assert.notOk(res.pendingRules, "Pending rules are not defined");
        assert.strictEqual(res.isValid, false, "Rule is invalid");
        assert.strictEqual(res.status, "invalid", "Rule status is invalid");
        done();
    });
});

QUnit.test("Can be validated negatively with custom message", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(false);
            return d.promise();
        }),
        value = "Some custom value",
        customMessage = "Value does not satisfy our custom validation scenario",
        rule = {
            type: "async",
            message: customMessage,
            validationCallback: customCallback
        },
        result = testAsyncRules([rule], value, assert),
        done = assert.async();

    assert.ok(customCallback.calledOnce, "Validation callback was called");
    assert.equal(customCallback.getCall(0).args[0].value, value, "Correct value should be passed");
    assert.strictEqual(customCallback.getCall(0).args[0].rule, rule, "Rule should be passed");
    assert.ok(result.complete, "result.complete is defined");
    assert.ok(isPromise(result.complete), "result.complete is a promise");
    result.complete.then((res) => {
        assert.ok(res.brokenRule, "Broken rule is defined");
        assert.ok(res.brokenRules, "Broken rules are defined");
        assert.strictEqual(res.brokenRules.length, 1, "A single rule should be broken");
        assert.strictEqual(res.brokenRules[0], res.brokenRule, "Broken rules should be equal");
        assert.equal(res.brokenRules[0].message, customMessage);
        assert.notOk(res.pendingRules, "Pending rules are not defined");
        assert.strictEqual(res.isValid, false, "Rule is invalid");
        assert.strictEqual(res.status, "invalid", "Rule status is invalid");
        done();
    });
});


QUnit.test("Can be validated negatively with a custom message from validationCallback", function(assert) {
    const customMessage = "Value does not satisfy our custom validation scenario",
        customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve({
                isValid: false,
                message: customMessage
            });
            return d.promise();
        }),
        value = "Some custom value",
        rule = {
            type: "async",
            validationCallback: customCallback
        },
        result = testAsyncRules([rule], value, assert),
        done = assert.async();

    result.complete.then((res) => {
        assert.equal(res.brokenRules[0].message, customMessage);
        done();
    });
});

QUnit.test("Default message with name", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        }),
        value = "Some custom value",
        rule = {
            type: "async",
            validationCallback: customCallback
        },
        result = testAsyncRules([rule], value, assert, "Customer Code"),
        done = assert.async();

    result.complete.then((res) => {
        assert.equal(result.brokenRules[0].message, "Customer Code is invalid");
        done();
    });
});

QUnit.test("Async rule cannot be validated when a sync rule is invalid", function(assert) {
    const customCallback = sinon.spy(),
        value = "",
        rules = [
            {
                type: "async",
                validationCallback: customCallback
            },
            {
                type: "required"
            }
        ],
        result = ValidationEngine.validate(value, rules);

    assert.notOk(customCallback.calledOnce, "Validation callback was not called");
    assert.notOk(result.complete, "result.complete is not defined");
    assert.strictEqual(result.brokenRules.length, 1, "Only a single rule should be broken");
    assert.equal(result.brokenRules[0].type, "required", "Only required rule should be broken");
});

QUnit.test("Only async rules should be broken", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        }),
        value = "Some value",
        rules = [
            {
                type: "async",
                validationCallback: customCallback
            },
            {
                type: "required"
            },
            {
                type: "async",
                validationCallback: customCallback
            }
        ],
        result = ValidationEngine.validate(value, rules),
        done = assert.async();

    assert.equal(result.pendingRules.length, 2);
    assert.ok(customCallback.calledTwice, "Validation callback was called twice");
    result.complete.then((res) => {
        assert.equal(res.brokenRules.length, 2, "Two rules should be broken");
        assert.equal(res.brokenRules[0].type, "async");
        assert.equal(res.brokenRules[1].type, "async");
        done();
    });
});

QUnit.test("Two async rules should be broken", function(assert) {
    const customCallback1 = function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        },
        customCallback2 = function() {
            const d = new Deferred();
            d.reject(false);
            return d.promise();
        },
        value = "Some value",
        rules = [
            {
                type: "async",
                validationCallback: customCallback1
            },
            {
                type: "async",
                validationCallback: customCallback2
            }
        ],
        result = ValidationEngine.validate(value, rules),
        done = assert.async();

    assert.equal(result.pendingRules.length, 2);
    result.complete.then((res) => {
        assert.equal(res.brokenRules.length, 2, "Two rules should be broken");
        done();
    });
});

QUnit.test("Three async rules should be broken", function(assert) {
    const customCallback1 = function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        },
        customCallback2 = function() {
            const d = new Deferred();
            d.reject();
            return d.promise();
        },
        customCallback3 = function() {
            const d = new Deferred();
            d.reject({
                isValid: false
            });
            return d.promise();
        },
        value = "Some value",
        rules = [
            {
                type: "async",
                validationCallback: customCallback1
            },
            {
                type: "async",
                validationCallback: customCallback2
            },
            {
                type: "async",
                validationCallback: customCallback3
            }
        ],
        result = ValidationEngine.validate(value, rules),
        done = assert.async();

    assert.equal(result.pendingRules.length, 3);
    result.complete.then((res) => {
        assert.equal(res.brokenRules.length, 3, "Three rules should be broken");
        done();
    });
});

QUnit.test("One rule is reevaluated", function(assert) {
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        }),
        value = "Some value",
        rules = [
            {
                type: "async",
                reevaluate: false,
                validationCallback: customCallback
            },
            {
                type: "async",
                validationCallback: customCallback
            }
        ],
        result = testAsyncRules(rules, value, assert),
        done = assert.async();

    assert.ok(result, "Result is defined");
    assert.ok(customCallback.calledTwice, "Validation callback was called twice");
    result.complete.then((res) => {
        const result1 = ValidationEngine.validate(value, rules);
        assert.equal(result1.status, "invalid", "result.status === 'invalid'");
        assert.ok(customCallback.calledTwice);
        assert.equal(result1.brokenRules.length, 1, "Only a single rule should be broken");
        done();
    });
});

QUnit.test("Validation callback must have the 'data' in arguments when validator has 'dataGetter' option", function(assert) {
    let params;
    const customCallback = sinon.spy(function() {
            const d = new Deferred();
            d.resolve({
                isValid: false
            });
            return d.promise();
        }),
        data = { test: "test" },
        validator = {
            option: function(optionName) {
                if(optionName === "dataGetter") {
                    return function() {
                        return data;
                    };
                }
            }
        },
        value = "Some custom value",
        rule = {
            type: "async",
            validationCallback: customCallback,
            validator: validator
        },
        result = ValidationEngine.validate(value, [rule]);

    assert.ok(result, "Result is defined");
    assert.ok(customCallback.calledOnce, "Validation callback was called");

    params = customCallback.getCall(0).args[0];
    assert.equal(params.value, value, "Correct value should be passed");
    assert.strictEqual(params.validator, validator, "Validator should be passed");
    assert.strictEqual(params.rule, rule, "Rule should be passed");
    assert.strictEqual(params.data, data, "Data should be passed");
});


QUnit.module("State of validated rules");

QUnit.test("Rule should not be revalidated if no value changed - invalid value", function(assert) {
    var handler = sinon.spy(function() { return false; }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "custom",
            message: message,
            validationCallback: handler
        };

    // act
    ValidationEngine.validate(value, [rule]);
    var result2 = ValidationEngine.validate(value, [rule]);

    // assert
    assert.strictEqual(rule.isValid, false, "Rule should be marked as invalid");
    assert.ok(handler.calledOnce, "Handler should be called only once as value did not change");
    assert.ok(result2.brokenRule, "Rule should be marked as broken");
    assert.equal(result2.brokenRule.message, message);
});


QUnit.test("Rule should not be revalidated if no value changed - valid value", function(assert) {
    var handler = sinon.spy(function() { return true; }),
        value = "25",
        rule = {
            type: "custom",
            validationCallback: handler
        };

    // act
    ValidationEngine.validate(value, [rule]);
    ValidationEngine.validate(value, [rule]);

    // assert
    assert.strictEqual(rule.isValid, true, "Rule should be marked as valid");
    assert.ok(handler.calledOnce, "Handler should be called only once as value did not change");
});

QUnit.test("Rule should  be revalidated after value change - valid value", function(assert) {
    var handler = sinon.spy(function() { return true; }),
        value = "25",
        rule = {
            type: "custom",
            validationCallback: handler
        };

    // act
    ValidationEngine.validate(value, [rule]);
    ValidationEngine.validate(value + "1", [rule]);

    // assert
    assert.strictEqual(rule.isValid, true, "Rule should be marked as valid");
    assert.ok(handler.calledTwice, "Handler should be called twice as value changed");
});

QUnit.test("Async rule should be revalidated if no value changed - invalid value", function(assert) {
    const handler = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(false);
            return d.promise();
        }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "async",
            message: message,
            validationCallback: handler
        },
        done = assert.async();

    const result1 = ValidationEngine.validate(value, [rule]);
    result1.complete.then(() => {
        const result2 = ValidationEngine.validate(value, [rule]);
        result2.complete.then((res) => {
            assert.strictEqual(rule.isValid, false, "Rule should be marked as invalid");
            assert.ok(handler.calledTwice, "Handler should be called twice even when value did not change");
            assert.ok(res.brokenRule, "Rule should be marked as broken");
            assert.equal(res.brokenRule.message, message);
            done();
        });
    });
});

QUnit.test("Async rule should be revalidated if no value changed - valid value", function(assert) {
    const handler = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(true);
            return d.promise();
        }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "async",
            message: message,
            validationCallback: handler
        },
        done = assert.async();

    const result1 = ValidationEngine.validate(value, [rule]);
    result1.complete.then(() => {
        const result2 = ValidationEngine.validate(value, [rule]);
        result2.complete.then((res) => {
            assert.strictEqual(rule.isValid, true, "Rule should be marked as valid");
            assert.ok(handler.calledTwice, "Handler should be called twice even when value did not change");
            done();
        });
    });
});

QUnit.test("Async rule should not be revalidated if no value changed - invalid value - reevaluate disabled", function(assert) {
    const handler = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(false);
            return d.promise();
        }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "async",
            message: message,
            reevaluate: false,
            validationCallback: handler
        },
        done = assert.async();

    const result1 = ValidationEngine.validate(value, [rule]);
    result1.complete.then((res) => {
        const result2 = ValidationEngine.validate(value, [rule]);
        assert.strictEqual(rule.isValid, false, "Rule should be marked as invalid");
        assert.ok(handler.calledOnce, "Handler should be called only once as value did not change");
        assert.ok(result2.brokenRule, "Rule should be marked as broken");
        assert.equal(result2.brokenRule.message, message);
        done();
    });
});

QUnit.test("Async rule should not be revalidated if no value changed - valid value - reevaluate disabled", function(assert) {
    const handler = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(true);
            return d.promise();
        }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "async",
            message: message,
            reevaluate: false,
            validationCallback: handler
        },
        done = assert.async();

    const result1 = ValidationEngine.validate(value, [rule]);
    result1.complete.then((res) => {
        ValidationEngine.validate(value, [rule]);
        assert.strictEqual(rule.isValid, true, "Rule should be marked as valid");
        assert.ok(handler.calledOnce, "Handler should be called only once as value did not change");
        done();
    });
});


QUnit.test("Async rule should  be revalidated after value change - valid value", function(assert) {
    const handler = sinon.spy(function() {
            const d = new Deferred();
            d.resolve(true);
            return d.promise();
        }),
        value = "25",
        message = "Custom error message",
        rule = {
            type: "async",
            message: message,
            validationCallback: handler
        },
        done = assert.async();

    const result = ValidationEngine.validate(value, [rule]);
    result.complete.then((res) => {
        ValidationEngine.validate(value + "1", [rule]);
        assert.strictEqual(rule.isValid, true, "Rule should be marked as valid");
        assert.ok(handler.calledTwice, "Handler should be called twice as value changed");
        done();
    });
});


QUnit.test("If first rule fails, second one should not be evaluated", function(assert) {
    var handler = sinon.spy(function() { return true; }),
        value = "",
        rule1 = {
            type: "required"
        },
        rule2 = {
            type: "custom",
            validationCallback: handler
        };

    // act
    var result1 = ValidationEngine.validate(value, [rule1, rule2]);

    // assert
    assert.strictEqual(result1.isValid, false, "Result should be marked as invalid");
    assert.ok(!handler.called, "Handler should never be called");
});


QUnit.test("If first rule failed on last check, second one should not be evaluated", function(assert) {
    var handler = sinon.spy(function() { return true; }),
        emptyValue = "",
        rule1 = {
            type: "required"
        },
        rule2 = {
            type: "custom",
            validationCallback: handler
        };

    // act
    ValidationEngine.validate(emptyValue, [rule1, rule2]);
    var result2 = ValidationEngine.validate(emptyValue, [rule1, rule2]);

    // assert
    assert.strictEqual(result2.isValid, false, "Result should be marked as invalid");
    assert.ok(!handler.called, "Handler should be called twice as value changed");
});


QUnit.test("Compare rule should be reevaluated on each call", function(assert) {
    var value = "somevalue",
        handler = sinon.spy(function() { return value; }),
        rule = {
            type: "compare",
            comparisonTarget: handler
        };

    ValidationEngine.validate(value, [rule]);
    // act
    var result2 = ValidationEngine.validate(value, [rule]);

    // assert
    assert.strictEqual(result2.isValid, true, "Result should be marked as valid");
    assert.ok(handler.calledTwice, "Handler should be called twice");
});


QUnit.module("Groups", {
    beforeEach: function() {
        ValidationEngine.initGroups();
    }
});

QUnit.test("Simple group - can register validator in group", function(assert) {
    var group = "newGroup",
        validator = sinon.createStubInstance(Validator);

    // act
    ValidationEngine.registerValidatorInGroup(group, validator);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig(group);
    assert.ok(groupConfig, "Group was registered in Validation Engine");
    assert.equal(groupConfig.validators.length, 1, "Single validator was registered in group Validation Engine");
    assert.ok(groupConfig.validators[0], validator, "Validator was registered in correct group");
});

QUnit.test("Simple group - validator should not be duplicated in group", function(assert) {
    var group = "newGroup",
        validator = sinon.createStubInstance(Validator);

    // act
    ValidationEngine.registerValidatorInGroup(group, validator);
    ValidationEngine.registerValidatorInGroup(group, validator);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig(group);
    assert.ok(groupConfig, "Group was registered in Validation Engine");
    assert.equal(groupConfig.validators.length, 1, "Single validator was registered in group Validation Engine");
    assert.ok(groupConfig.validators[0], validator, "Validator was registered in correct group");
});

QUnit.test("Simple group - can register validator in undefined group", function(assert) {
    var validator = sinon.createStubInstance(Validator);

    // act
    ValidationEngine.registerValidatorInGroup(undefined, validator);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig();
    assert.ok(groupConfig, "Group was registered in Validation Engine");
    assert.equal(groupConfig.validators.length, 1, "Single validator was registered in group Validation Engine");
    assert.ok(groupConfig.validators[0], validator, "Validator was registered in correct group");
});

QUnit.test("Simple group - remove validator registration", function(assert) {
    var validator = sinon.createStubInstance(Validator);
    ValidationEngine.registerValidatorInGroup(undefined, validator);

    // act
    ValidationEngine.removeRegisteredValidator(undefined, validator);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig();
    assert.ok(groupConfig, "Group still exist Validation Engine");
    assert.equal(groupConfig.validators.length, 0, "Validator was unregistered");
});


QUnit.test("Simple group - call validateGroup method", function(assert) {
    var group = "newGroup",
        validator = sinon.createStubInstance(Validator);

    validator.on = sinon.stub();
    validator.off = sinon.stub();

    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false }, brokenRules: [{ type: "required", isValid: false }] });

    ValidationEngine.registerValidatorInGroup(group, validator);
    // act
    var result = ValidationEngine.validateGroup(group);

    // assert
    assert.ok(result, "Group Result is defined");
    assert.ok(validator.validate.calledOnce, "Validation Engine calls validator validate");
    assert.strictEqual(result.isValid, false, "IsValid");
    assert.ok(result.brokenRules, "Failed Rules should be passed from validators to group result");
    assert.equal(result.brokenRules.length, 1, "Widget's validation results should be passed to caller");

});

QUnit.test("Simple group - call validateGroup method for undefined group", function(assert) {
    var validator = sinon.createStubInstance(Validator);
    validator.on = sinon.stub();
    validator.off = sinon.stub();
    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false }, brokenRules: [{ type: "required", isValid: false }] });

    ValidationEngine.registerValidatorInGroup(undefined, validator);
    // act
    var result = ValidationEngine.validateGroup();

    // assert
    assert.ok(result, "Group Result is defined");
    assert.ok(validator.validate.calledOnce, "Validation Engine calls validator validate");
    assert.equal(result.brokenRules.length, 1, "Widget's validation results should be passed to caller");
});

QUnit.test("Unknown group - meaningful exception should be created", function(assert) {
    assert.throws(
        function() {
            ValidationEngine.validateGroup("unknownGroup");
        },
        function(e) {
            return /E0110/.test(e.message);
        },
        "Exception messages should be readable"
    );
});

QUnit.test("Event Validated should be triggered", function(assert) {
    var group = {},
        validator = sinon.createStubInstance(Validator),
        rule = { type: "required", isValid: false },
        handler = sinon.spy();
    validator.on = sinon.stub();
    validator.off = sinon.stub();
    validator.validate.returns({ isValid: false, brokenRule: rule, brokenRules: [rule] });

    ValidationEngine.registerValidatorInGroup(group, validator);
    ValidationEngine.getGroupConfig(group).on("validated", handler);

    // act
    ValidationEngine.validateGroup(group);

    // assert
    assert.ok(handler.calledOnce, "Handler should be called");
    assert.ok(handler.calledOn(ValidationEngine.getGroupConfig(group)), "Group config should be passed as 'this'");

    var params = handler.getCall(0).args[0];
    assert.strictEqual(params.isValid, false, "IsValid should be passed");
    assert.deepEqual(params.brokenRules, [rule], "Broken validation rules should be passed");
});

QUnit.test("Undefined group is defined by default", function(assert) {
    // act
    var config = ValidationEngine.getGroupConfig();

    assert.ok(config, "Config should be retrieved for undefined group");
});


QUnit.test("Simple group - call validate method on group config object", function(assert) {
    var validator = sinon.createStubInstance(Validator);
    validator.on = sinon.stub();
    validator.off = sinon.stub();
    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false }, brokenRules: [{ type: "required", isValid: false }] });

    ValidationEngine.registerValidatorInGroup(undefined, validator);
    var groupConfig = ValidationEngine.getGroupConfig();
    // act
    var result = groupConfig.validate();

    // assert
    assert.ok(result, "Group Result is defined");
    assert.ok(validator.validate.calledOnce, "Validation Engine calls validator validate");
    assert.equal(result.brokenRules.length, 1, "Widget's validation results should be passed to caller");
});

QUnit.test("Remove registered group", function(assert) {
    var group = "group1",
        validator = sinon.createStubInstance(Validator);
    ValidationEngine.registerValidatorInGroup(group, validator);

    // act
    ValidationEngine.removeGroup(group);

    // assert
    var groupConfig = ValidationEngine.getGroupConfig(group);
    assert.ok(!groupConfig, "Group config should be removed from the list");
});

QUnit.module("ignoreEmptyValue option");

QUnit.test("Should not work with required rule", function(assert) {
    testInvalidRule({
        type: "required",
        message: "A message",
        ignoreEmptyValue: true
    }, "", assert);
});

QUnit.test("Disable the option for the numeric rule", function(assert) {
    testInvalidRule({
        type: "numeric",
        message: "A message",
        ignoreEmptyValue: false
    }, "", assert);
});

QUnit.test("Disable the option for the range rule", function(assert) {
    testInvalidRule({
        type: "range",
        message: "A message",
        min: 0,
        max: 10,
        ignoreEmptyValue: false
    }, "", assert);
});

QUnit.test("Use the option for the StringLength rule", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "stringLength",
        message: "A message",
        min: 2,
        max: 10,
        ignoreEmptyValue: true
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Use the option for the Compare rule", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "compare",
        message: "A message",
        comparisonTarget: function() {
            return 1;
        },
        comparisonType: ">",
        ignoreEmptyValue: true
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Disable the option for the Pattern rule", function(assert) {
    testInvalidRule({
        type: "pattern",
        message: "A message",
        pattern: /^\d+$/,
        ignoreEmptyValue: false
    }, "", assert);
});

QUnit.test("Use the option for the Custom rule", function(assert) {
    var result = ValidationEngine.validate("", [{
        type: "custom",
        message: "A message",
        validationCallback: function() {
            return false;
        },
        ignoreEmptyValue: true
    }]);

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
});

QUnit.test("Disable the option for the Email rule", function(assert) {
    testInvalidRule({
        type: "email",
        message: "A message",
        ignoreEmptyValue: false
    }, "", assert);
});

QUnit.test("Use the option for the Async rule", function(assert) {
    const customCallback1 = sinon.spy(function() { return false; }),
        customCallback2 = sinon.spy(function() { return new Deferred().resolve().promise(); }),
        result = ValidationEngine.validate("", [{
            type: "async",
            message: "A message",
            validationCallback: customCallback1,
            ignoreEmptyValue: true
        }, {
            type: "async",
            message: "A message",
            validationCallback: customCallback2
        }]),
        done = assert.async();

    assert.ok(result, "Result is defined");
    assert.ok(result.isValid, "IsValid");
    assert.equal(result.status, "pending", "result.status === 'pending'");
    assert.equal(result.pendingRules.length, 1, "result.pendingRules contains only a single rule");
    assert.notOk(customCallback1.called, "customCallback1 should not be called");
    assert.ok(customCallback2.called, "customCallback2 should be called");

    result.complete.then((res) => {
        done();
    });
});

QUnit.module("ViewModel");
// all unit tests for KO are in koValidationTests.js
