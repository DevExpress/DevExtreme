const originalTest = QUnit.test;

QUnit.test = QUnit.urlParams['nocsp'] ? originalTest : QUnit.skip;
