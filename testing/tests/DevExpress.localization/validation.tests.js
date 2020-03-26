require('localization/globalize/core');
require('localization/globalize/number');
require('localization/globalize/currency');
require('localization/globalize/date');
require('localization/globalize/message');
const cldrData = [
    require('../../../node_modules/devextreme-cldr-data/ru.json!json')
];

const ValidationEngine = require('ui/validation_engine');
const Globalize = require('globalize');
const localization = require('localization');
const ru = require('localization/messages/ru.json!');

cldrData.forEach(localeCldrData => {
    Globalize.load(localeCldrData);
});

localization.loadMessages(ru);

QUnit.module('culture-specific validation', {
    beforeEach: function() {
        Globalize.locale('ru');
    },

    afterEach: function() {
        Globalize.locale('en');
    }
});

QUnit.test('Invalid message localization', function(assert) {
    const result = ValidationEngine.validate('не число', [{
        type: 'numeric'
    }]);

    assert.equal(result.brokenRule.message, 'Значение должно быть числом', 'Russian localization should be used');
});

QUnit.test('Invalid message localization, formatted', function(assert) {
    const result = ValidationEngine.validate('не число', [{
        type: 'numeric'
    }], 'Зарплата');

    assert.equal(result.brokenRule.message, 'Значение поля Зарплата должно быть числом', 'Russian localization should be used');
});

QUnit.test('T212840: Numeric - invalid, with default culture-agnostic behaviour', function(assert) {
    const result = ValidationEngine.validate('2,100,001.15', [{
        type: 'numeric'
    }]);

    assert.ok(result, 'Result is defined');
    assert.ok(!result.isValid, 'IsValid');
});

QUnit.test('T212840: Numeric - valid, with globalize-culture-specific option', function(assert) {
    const result = ValidationEngine.validate('2 100 001,15', [{
        type: 'numeric',
        useCultureSettings: true
    }]);

    assert.ok(result, 'Result is defined');
    assert.ok(result.isValid, 'IsValid');
    assert.ok(!result.brokenRule, 'No any invalid rules');
});
