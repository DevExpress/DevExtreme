import { AI } from 'ai/ai';

QUnit.module('AI', function() {
    QUnit.test('sendRequest is called with correct parameters', function(assert) {
        assert.expect(2);
        const done = assert.async();

        const ai = new AI({
            sendRequest: (params) => {
                assert.deepEqual(params.prompt, {
                    system: 'You are a translation assistant.',
                    user: 'Translate text to fr language.',
                }, 'prompt parameter is correct');
                assert.strictEqual(typeof params.onChunk, 'function', 'onChunk parameter is correct');

                const promise = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                        done();
                    });
                });

                return { promise, abort: () => {} };
            }
        });

        ai.translate(
            {
                text: 'text',
                lang: 'fr',
            },
            {
                onComplete: () => {},
                onChunk: () => {},
            },
        );
    });
});
