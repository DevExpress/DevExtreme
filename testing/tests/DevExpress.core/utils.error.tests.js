const errorUtils = require('core/utils/error');
const consoleUtils = require('core/utils/console');

const errors = errorUtils({
    'E1': 'Error 1',
    'E2': 'Error 2.. ',
    'W1': 'Warning 1',
    'W2': '{0} module is not initialized'
});

QUnit.module('error logging', {
    beforeEach: function() {
        this.originalLogger = consoleUtils.logger;
        const log = this.log = [];

        consoleUtils.logger = {
            warn: function(message) {
                log.push({ 'warn': message });
            },

            error: function(message) {
                log.push({ 'error': message });
            },

            log: function(message) {
                log.push({ 'log': message });
            }
        };
    },

    afterEach: function() {
        consoleUtils.logger = this.originalLogger;
        this.log = [];
    }
});


const mockVersion = function(s) {
    return s.replace(/\d+_\d+/, '[VERSION]');
};

QUnit.test('\'log\' method logs error on console if ID is matched to error id pattern', function(assert) {
    errors.log('E1');
    assert.deepEqual(mockVersion(this.log[0].error), 'E1 - Error 1. See:\nhttp://js.devexpress.com/error/[VERSION]/E1');
});

QUnit.test('\'log\' method logs warning on console if ID is matched to warning id pattern', function(assert) {
    errors.log('W1');
    assert.deepEqual(mockVersion(this.log[0].warn), 'W1 - Warning 1. See:\nhttp://js.devexpress.com/error/[VERSION]/W1');
});

QUnit.test('\'log\' method logs message on console if ID is not matched to any patterns', function(assert) {
    errors.log('WWW.DEVEXPRESS.COM');
    assert.deepEqual(this.log[0].log, 'WWW.DEVEXPRESS.COM');
});

QUnit.test('\'Error\' method creates Error instance', function(assert) {
    const error = errors.Error('E1');
    assert.ok(error instanceof Error);
    assert.equal(mockVersion(error.message), 'E1 - Error 1. See:\nhttp://js.devexpress.com/error/[VERSION]/E1');
});

QUnit.test('\'Error\' method called with \'new\' returns Error instance', function(assert) {
    const error = new errors.Error('E1');
    assert.ok(error instanceof Error);
});

QUnit.test('\'Error\' method creates Error with \'__details\' and \'__id\' property', function(assert) {
    const error = errors.Error('E1');
    assert.equal(error.__id, 'E1');
    assert.equal(error.__details, 'Error 1');
});

QUnit.test('\'Error\' method create Error with no unnecessary dots', function(assert) {
    const error = errors.Error('E2');
    assert.equal(mockVersion(error.message), 'E2 - Error 2. See:\nhttp://js.devexpress.com/error/[VERSION]/E2');
});

QUnit.test('\'log\' and \'error\' method support string formatting', function(assert) {
    errors.log('W2', 'Core');
    assert.deepEqual(mockVersion(this.log[0].warn), 'W2 - Core module is not initialized. See:\nhttp://js.devexpress.com/error/[VERSION]/W2');

    const error = errors.Error('W2', 'Core');
    assert.equal(mockVersion(error.message), 'W2 - Core module is not initialized. See:\nhttp://js.devexpress.com/error/[VERSION]/W2');
});
