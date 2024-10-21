import { throttle } from 'core/utils/throttle';

QUnit.module('throttle',
    () => {
        QUnit.test('Must call the function immediately on the first call', function(assert) {
            let callCount = 0;

            function func() {
                callCount++;
            }

            const throttledFunc = throttle(func, 100);

            throttledFunc();

            assert.strictEqual(callCount, 1, 'Must call the function immediately on the first call');
        });

        QUnit.test('The function is called immediately on the first call', function(assert) {
            const clock = sinon.useFakeTimers({ now: new Date().getTime() });

            let callCount = 0;

            function func() {
                callCount++;
            }

            try {
                const throttledFunc = throttle(func, 100);

                throttledFunc();
                throttledFunc();

                assert.strictEqual(callCount, 1, 'The function is called only once');

                clock.tick(50);

                throttledFunc();

                assert.strictEqual(callCount, 1, 'The function is not called again until the delay expires');
            } finally {
                clock.restore();
            }

        });

        QUnit.test('Must call the function again after the delay has expired', function(assert) {
            const clock = sinon.useFakeTimers({ now: new Date().getTime() });

            let callCount = 0;

            function func() {
                callCount++;
            }

            try {
                const throttledFunc = throttle(func, 100);

                throttledFunc();

                assert.strictEqual(callCount, 1, 'Function called for the first time');

                clock.tick(100);

                throttledFunc();

                assert.strictEqual(callCount, 2, 'The function is called again after a delay');
            } finally {
                clock.restore();
            }
        });

        QUnit.test('The function must preserve the correct context', function(assert) {
            assert.expect(1);

            const context = { value: 42 };

            function func() {
                assert.strictEqual(this.value, 42, 'The context is saved correctly');
            }

            const throttledFunc = throttle(func, 100);

            throttledFunc.call(context);
        });

        QUnit.test('The function must pass the correct arguments to the function', function(assert) {
            assert.expect(1);

            function func(a, b) {
                assert.deepEqual([a, b], [1, 2], 'The arguments are properly conveyed');
            }

            const throttledFunc = throttle(func, 100);

            throttledFunc(1, 2);
        });
    });

