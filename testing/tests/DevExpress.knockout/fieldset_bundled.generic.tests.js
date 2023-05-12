require('generic_light.css!');

QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;

const testFieldsetsOnPlatform = require('./fieldsetParts/shared.js');
testFieldsetsOnPlatform('generic.light', { testSwitchBaseline: false });
