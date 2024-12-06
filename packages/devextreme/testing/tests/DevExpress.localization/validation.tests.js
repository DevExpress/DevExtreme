require('common/core/localization/globalize/core');
require('common/core/localization/globalize/number');
require('common/core/localization/globalize/currency');
require('common/core/localization/globalize/date');
require('common/core/localization/globalize/message');
const cldrData = [
    require('devextreme-cldr-data/fr.json!json')
];

const ValidationEngine = require('ui/validation_engine');
const Globalize = require('globalize');
const localization = require('localization');
const fr = require('localization/messages/fr.json!');

cldrData.forEach(localeCldrData => {
    Globalize.load(localeCldrData);
});

localization.loadMessages(fr);

QUnit.module('culture-specific validation', {
    beforeEach: function() {
        Globalize.locale('fr');
    },

    afterEach: function() {
        Globalize.locale('en');
    }
});

QUnit.test('Invalid message localization', function(assert) {
    const result = ValidationEngine.validate('NaN', [{
        type: 'numeric'
    }]);

    assert.equal(result.brokenRule.message, 'La valeur doit être un nombre', 'French localization should be used');
});

QUnit.test('Invalid message localization, formatted', function(assert) {
    const result = ValidationEngine.validate('NaN', [{
        type: 'numeric'
    }], 'Salaire');

    assert.equal(result.brokenRule.message, 'Salaire doit être un nombre', 'French localization should be used');
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
