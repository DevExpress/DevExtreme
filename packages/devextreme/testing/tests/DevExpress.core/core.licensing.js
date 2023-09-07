import config from 'core/config';
import errors from 'core/errors';
import { Component, resetLicenseCheckSkipCondition } from 'core/component';
const { test, module } = QUnit;

const validToken_23_2 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjYxMjFmMDIyLTFjMTItNDNjZC04YWE0LTkwNzJkNDU4YjYxNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.RENyZ3Ga5rCB7/XNKYbk2Ffv1n9bUexYNhyOlqcAD02YVnPw6XyQcN+ZORScKDU9gOInJ4o7vPxkgh10KvMZNn+FuBK8UcUR7kchk7z0CHGuOcIn2jD5X2hG6SYJ0UCBG/JDG35AL09T7Uv/pGj4PolRsANxtuMpoqmvX2D2vkU=';
const validToken_22_1 = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjM3Yjg4ZjBmLWQ0MmMtNDJiZS05YjhkLTU1ZGMwYzUzYzAxZiIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjIxCn0=.NVsilC5uWlD5QGS6bocLMlsVVK0VpZXYwU2DstUiLRpEI79/onuR8dGWasCLBo4PORDHPkNA/Ej8XeCHzJ0EkXRRZ7E2LrP/xlEfHRXTruvW4IEbZt3LiwJBt6/isLz+wzXtYtjV7tpE07/Y0TFoy+mWpHoU11GVtwKh6weRxkg=';

class TestComponent extends Component {
    constructor(options) {
        super(options);
        this.NAME = 'TestComponent';
    }
}

let log = [];
const originalLog = errors.log;

module('License check', {
    beforeEach: function() {
        resetLicenseCheckSkipCondition();
        log = [];
        errors.log = (...args) => {
            log.push(args);
        };
    },
    afterEach: function() {
        errors.log = originalLog;
    }
}, () => {
    test('Empty token', function(assert) {
        config({ license: null });
        const instance = new TestComponent();

        assert.equal(log.length, 1);
        assert.strictEqual(log[0][0], 'W0019');
    });

    test('token should be verified', function(assert) {
        config({ license: validToken_23_2 });

        const instance = new TestComponent();

        assert.equal(log.length, 0);
    });

    test('token check should be failed - expired version', function(assert) {
        config({ license: validToken_22_1 });

        const instance = new TestComponent();

        assert.equal(log.length, 1);
        assert.strictEqual(log[0][0], 'W0020');
    });

    test('token check should be failed - wrong format', function(assert) {
        config({ license: 'invalid token' });

        const instance = new TestComponent();

        assert.equal(log.length, 1);
        assert.strictEqual(log[0][0], 'W0021');
    });
});
