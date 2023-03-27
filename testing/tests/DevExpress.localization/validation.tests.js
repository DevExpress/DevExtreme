import 'localization/globalize/core';
import 'localization/globalize/number';
import 'localization/globalize/currency';
import 'localization/globalize/date';
import 'localization/globalize/message';

import cldrRu from '../../../node_modules/devextreme-cldr-data/ru.json!json';
const cldrData = [ cldrRu ];

import ValidationEngine from 'ui/validation_engine';
import Globalize from 'globalize';
import localization from 'localization';
import ru from 'localization/messages/ru.json!';

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
