var Class = require("core/class"),
    ValidationEngine = require("ui/validation_engine");

var Validator = Class.inherit({
    validate: function() { }
});

var testInvalidRule = function(rule, invalidValue, assert, name) {
    var result = ValidationEngine.validate(invalidValue, [rule], name);

    assert.ok(result, "Result is defined");
    assert.strictEqual(result.isValid, false, "result.isValid === false");
    assert.ok(result.brokenRule, "Single invalid rule");
    assert.strictEqual(result.brokenRule.isValid, false, "Rule should be marked as invalid");

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

QUnit.test('Validator correctly handles incorrect email', function(assert) {
    var result = ValidationEngine.validate('-@-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.', [{
        type: 'email',
        message: 'Set correct email'
    }]);

    assert.ok(result, 'Result is defined');
    assert.ok(!result.isValid, 'Value is invalid');
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

    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false } });

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

    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false } });

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

    validator.validate.returns({ isValid: false, brokenRule: rule });

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

    validator.validate.returns({ isValid: false, brokenRule: { type: "required", isValid: false } });

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


QUnit.module("ViewModel");
// all unit tests for KO are in koValidationTests.js
